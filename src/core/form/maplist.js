window.addEventListener('modulesLoaded', function() {	
	const mapSelect	= document.querySelector('[name="map"]');		
	const mapList 	= document.querySelector('[name="sv_maplist"]');
	
	mapList.style.display = 'none';
	
	const mapRotationWrapper = document.createElement('div');
	mapRotationWrapper.id = 'mapRotationWrapper';
	
	const ul = document.createElement('ul');
	ul.id = 'mapRotation';
	
	mapRotationWrapper.appendChild(ul);	
	mapList.after(mapRotationWrapper);
});

/**
 * Remove map when user clicks on remove map button
 */
document.addEventListener('click', function (e) {	
	if (e.target.classList.contains('btnRemoveMap')) {
		e.target.parentNode.remove();
		updateMapList();
	}
});
	
/**
 * Add map when user clicks on add map button
 */
function addMap(element) {	
	const selectValue = element.parentNode.querySelector('select').value;
	const selectedOption = document.querySelector('option[value="' + selectValue + '"]');
	
	addMapToList(selectedOption);	
	updateMapList();
}

/**
 * Add map to maplist
 * @param  {HTMLElement}	selectedOption	The HTML element that is the selected option
 */
function addMapToList(selectedOption) {	
	const mapRotation = document.getElementById('mapRotation');
	mapRotation.innerHTML += `
		<li
			draggable="true"
			ondragenter="handleDragEnter(event)"
			ondragleave="handleDragLeave(event)"
			ondragstart="handleDragStart(event)"
			ondragend="handleDragEnd(event)"
			ondragover="handleDragOver(event)"
			ondrop="handleDrop(event)"
		>
			<img src="./assets/img/${selectedOption.dataset.image}" />
			<span data-map="${selectedOption.value}">${selectedOption.innerText}</span>
			<button type="button" class="btnRemoveMap">&times;</button>
		</li>
	`;
}

/**
 * Update the maplist with the latest added maps
 */
function updateMapList() {
	const mapList = document.querySelector('[name="sv_maplist"]');
	const mapRotationList = document.getElementById('mapRotation').querySelectorAll('li');
	
	mapList.value = '';
	
	mapRotationList.forEach((map) => {
		mapList.value += map.querySelector('span').dataset.map + ' ';
	});
}

/**
 * Clear the maplist
 */
function clearMapList() {	
	mapList.value = '';
	
	document.querySelectorAll('#mapRotation li').forEach((map) => {
		map.remove();
	});
}