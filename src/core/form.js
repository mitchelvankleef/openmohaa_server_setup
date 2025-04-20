/* Initialize form */
window.addEventListener('modulesLoaded', function() {
	const form = document.querySelector('form');

	const gameSelect = document.querySelector('select[name="com_target_game"]');
	const gameModeSelect = document.querySelector('select[name="g_gametype"]');
	const mapSelect = document.querySelector('select[name="map"]');			
	const mapList = document.querySelector('textarea[name="sv_maplist"]');
	const saveBtn = document.querySelector('button[type="submit"]');

	window.electronAPI.getEnabledGames().then(value => {
		if (!value.sh) {
			document.querySelector('[name="com_target_game"] [data-game="1"]').remove();
		}
		if (!value.bt) {
			document.querySelector('[name="com_target_game"] [data-game="2"]').remove();
		}
	});

	form.addEventListener('submit', function(e) {
		e.preventDefault();
		
		const formData = new FormData(form);
		saveConfig(formData);
	});

	saveBtn.addEventListener('click', function() {	
		window.addEventListener('configSaved', function eventHandler() {
			window.electronAPI.showDialog('Config file saved', 'The config file was saved to ' + getGameFolder(parseInt(gameSelect.value)) + '/server.cfg');
			
			this.removeEventListener('configSaved', eventHandler);
		});
	});

	updateOptions();

	gameSelect.addEventListener('change', function() {			
		updateOptions();
		
		fillFields(parseInt(gameSelect.value));
	});

	gameModeSelect.addEventListener('change', function() {		
		updateOptions();
	});

	fillFields();
});

/**
 * Add a map to the map rotation list field
 * @param  	{HTMLSelectElement}	selectedOption	The selected option HTML element
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
 * Update the available game mode and map options based on the currently selected game
 */
function updateOptions() {
	const gameSelect = document.querySelector('select[name="com_target_game"]');
	const gameModeSelect = document.querySelector('select[name="g_gametype"]');
	const mapSelect = document.querySelector('select[name="map"]');			
	const mapList = document.querySelector('textarea[name="sv_maplist"]');
	
	const selectedGameModeOption = gameModeSelect.querySelector('option:checked');
	const selectedMapOption = mapSelect.querySelector('option:checked');
	
	gameModeSelect.querySelectorAll('option').forEach((option) => {
		option.hidden = false;
		
		if (parseInt(option.dataset.game) > parseInt(gameSelect.value)) {
			option.hidden = true;
		}
	});
	
	if (selectedGameModeOption.hidden) {
		const firstMode = gameModeSelect.querySelector('option:not([hidden])');
		if (firstMode) firstMode.selected = true;
	} else {
		selectedGameModeOption.selected = true;
	}
	
	mapSelect.querySelectorAll('*').forEach((option) => {
		option.hidden = false;
		option.selected = false;
		
		if (parseInt(option.dataset.game) > parseInt(gameSelect.value)) {
			option.hidden = true;
		}
		
		if (option.tagName == 'OPTION') {
			switch (parseInt(gameModeSelect.value)) {
				case 4:
					if (option.dataset.mode !== 'obj' && option.value !== 'lib/mp_ship_lib') {
						option.hidden = true;
					}
					break;
					
				case 5:
					if (option.dataset.mode !== 'tow') {
						option.hidden = true;
					}
					break;
					
				case 6:
					if (option.dataset.mode !== 'lib') {
						option.hidden = true;
					}
					break;
			}
		}
	});
	
	if (selectedMapOption.hidden) {
		const firstMap = mapSelect.querySelector('option:not([hidden])');
		if (firstMap) firstMap.selected = true;
	} else {
		selectedMapOption.selected = true;
	}

	mapList.value = "";
	
	document.querySelectorAll('#mapRotation li').forEach((map) => {
		map.remove();
	});
}

/**
 * Update the map rotation list field based on the currently selected game
 */
function updateMapList() {
	const mapList = document.querySelector('textarea[name="sv_maplist"]');
	const mapRotationList = document.querySelectorAll('#mapRotation li');
	
	mapList.value = '';
	
	mapRotationList.forEach((map) => {
		mapList.value += map.querySelector('span').dataset.map + ' ';
	});
}

/**
 * Fill the fields based the config file data
 */
async function fillFields(gameId = 0) {
	const mapSelect = document.querySelector('select[name="map"]');			
	
	const config = await getConfig(gameId);
	const fields = config.split("\n");
	
	let customConfig = '';
	
	for(let i = 0; i < fields.length; i++) {
		const field = fields[i];
		if (field === undefined || field.trim().length === 0) continue;
		
		const splittedField = field.split(' ');
		
		if (splittedField[0] === '//') continue;
		
		let key = '';
		let val = '';
		
		if (splittedField[0] === 'set' || splittedField[0] === 'seta') {
			key = splittedField[1];
			val = splittedField[2];
			
			if (val[0] === '"') {
				for (let j = 3; j < splittedField.length; j++) {
					val += ' ' + splittedField[j];
				}
			}
		} else {
			key = splittedField[0];
			val = splittedField[1];
			
			if (val[0] === '"') {
				for (let j = 2; j < splittedField.length; j++) {
					val += ' ' + splittedField[j];
				}
			}
		}
		
		val = val.trim();
		
		if (key === 'sv_maplist') {
			const mapList = val.replaceAll('"', '').split(' ');
			
			mapList.forEach((map) => {
				const mapOption = mapSelect.querySelector('option[value="' + map + '"]');
				
				if (mapOption) {
					addMapToList(mapOption);
				}
			});
			
			updateMapList();
			
			continue;
		}
		
		const input = document.querySelector('[name="' + key + '" i]');		
		if (input) {
			if (input.tagName === 'SELECT') {		
				const customSelectDropdown = input.nextSibling;
				customSelectDropdown.querySelector('[data-value="' + val.replaceAll('"', '') + '"]').click();
			} else if (input.tagName === 'INPUT' && input.type === 'checkbox') {
				input.checked = (val == 1);
			} else {
				input.value = val.replaceAll('"', '');
			}
		} else {
			customConfig += field + "\n";
		}
	}
		
	document.querySelector('[name="custom_config"]').value = customConfig;
}

/**
 * Get the game folder for the provided game ID
 * @param  	{Integer}	gameId	The game ID
 */
function getGameFolder(gameId) {
	switch (gameId) {
		case 0:
			return 'main';
			break;
		case 1:
			return 'mainta';
			break;
		case 2:
			return 'maintt';
			break;
	}
}

/**
 * Start the game server
 */
function startServer() {	
	const form = document.querySelector('form');
	
	form.requestSubmit();
	runServer(gameSelect.value);
}