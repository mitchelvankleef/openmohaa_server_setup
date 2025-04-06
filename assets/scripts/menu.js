const menuButton = document.getElementById('menu');
const navigation = document.querySelector('nav');
const navItems = document.querySelectorAll('nav ul li');
const tabItems = document.querySelectorAll('form fieldset');

menuButton.addEventListener('click', function() {
	navigation.classList.add('active');
});

document.addEventListener('click', function (e) {	
	if (e.target != navigation && !e.target.closest('nav') && e.target != menuButton && !e.target.closest('#menu')) {
		navigation.classList.remove('active');
	}
});

navItems.forEach((navItem) => {
	navItem.addEventListener('click', function() {
		resetTabs();
		navItem.classList.add('active');
		
		tabItems.forEach((tabItem) => {
			if (tabItem.dataset.tab == navItem.dataset.tab) {
				tabItem.classList.add('active');
			}
		});
		
		setTimeout(function() { navigation.classList.remove('active') }, 200);
	});
});

function resetTabs() {
	navItems.forEach((navItem) => {
		navItem.classList.remove('active');
	});
	tabItems.forEach((tabItem) => {
		tabItem.classList.remove('active');
	});
}