const menuButton = document.getElementById('menu');
const navigation = document.querySelector('nav');

menuButton.addEventListener('click', function() {
	navigation.classList.add('active');
});

window.addEventListener('modulesLoaded', function() {
	const navItems	= document.querySelectorAll('nav ul li');
	const modules	= document.querySelectorAll('form fieldset');
	
	document.addEventListener('click', function (e) {	
		if (e.target != navigation && !e.target.closest('nav') && e.target != menuButton && !e.target.closest('#menu')) {
			navigation.classList.remove('active');
		}
	});

	navItems.forEach((navItem) => {
		navItem.addEventListener('click', function() {
			resetNavItems(navItems, modules);
			navItem.classList.add('active');
			
			modules.forEach((module) => {
				if (module.dataset.tab == navItem.dataset.tab) {
					module.classList.add('active');
				}
			});
			
			setTimeout(function() { navigation.classList.remove('active') }, 200);
		});
	});
});

/**
 * Add navigation item to menu
 * @param  	{String}	itemId 		The ID of the navigation item
 * @param	{String}	itemLabel	The label of the navigation item
 * @param	{Boolean}	active		Set to true when navigation item is active by default
 * @return 	{String}				Game folder
 */
function addNavItem(itemId, itemLabel, active = false) {	
	const navItem = document.createElement('li');
	navItem.dataset.tab = itemId;
	navItem.innerHTML = `<span>${itemLabel}</span>`;
	
	if (active) {
		navItem.classList.add('active');
	}
	
	navigation.querySelector('ul').appendChild(navItem);
}

/**
 * Reset navigation items
 */
function resetNavItems(navItems, modules) {
	navItems.forEach((navItem) => {
		navItem.classList.remove('active');
	});
	modules.forEach((module) => {
		module.classList.remove('active');
	});
}