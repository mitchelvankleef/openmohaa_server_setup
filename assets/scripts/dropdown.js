document.querySelectorAll('select').forEach((select) => {
	addCustomDropdown(select);
	initMapPopover();
	
	select.addEventListener('change', function () {
		removeCustomDropdowns();
		document.querySelectorAll('select').forEach((select) => {
			addCustomDropdown(select);
		});
		initMapPopover();
	});
});

document.addEventListener('click', function (e) {	
	document.querySelectorAll('.customSelectDropdown').forEach((select) => {
		if (e.target.tagName == 'SELECT') {
			return;
		}
		
		
		if (e.target != select && e.target != select.parentNode.querySelector('.customSelect')) {
			select.style.display = 'none';
		}
	});
});

function addCustomDropdown(originalSelect) {
	originalSelect.style.display = 'none';
	
	const customSelectWrapper = document.createElement('div');
	customSelectWrapper.classList.add('customSelectWrapper');

	originalSelect.after(customSelectWrapper);
	
	const customSelect = document.createElement('span');
	customSelect.classList.add('customSelect');

	customSelectWrapper.append(customSelect);
	
	const customSelectDropdown = document.createElement('ul');
	customSelectDropdown.classList.add('customSelectDropdown');
	customSelectDropdown.style.display = 'none';
	
	customSelect.addEventListener('click', function () {
		if (customSelectDropdown.style.display == 'none') {
			customSelectDropdown.style.display = 'block';
		} else {
			customSelectDropdown.style.display = 'none';
		}
	});
	
	let selectedOption = null;

	originalSelect.querySelectorAll('*').forEach((option) => {
		if (option.hidden || option.tagName === 'OPTGROUP' && option.querySelectorAll('option:not([hidden])').length == 0) {
			return;
		}
		
		const image = option.dataset.image;
		
		const newOption = document.createElement('li');
		newOption.dataset.value = option.value;
		newOption.innerHTML = '';
		
		if (image) {
			newOption.innerHTML += '<img src="./assets/img/' + image + '">';
		}
		
		if (option.tagName === 'OPTGROUP') {
			newOption.classList.add('optgroup');
			newOption.innerHTML += '<strong>' + option.label + '</strong>';
		} else {
			newOption.innerHTML += option.innerText;
		}
		
		newOption.addEventListener('click', function(e) {
			if (e.target.classList.contains('optgroup')) {
				return;
			}
			
			originalSelect.value = e.target.dataset.value;
			customSelect.innerHTML = e.target.innerHTML;
			
			originalSelect.dispatchEvent(new Event('change'));
		});
		
		customSelectDropdown.appendChild(newOption);
		
		if (option.value == originalSelect.value) {	
			customSelect.innerHTML = customSelectDropdown.querySelector('li[data-value="' + option.value + '"]').innerHTML;
		}
	});

	customSelectWrapper.append(customSelectDropdown);
}

function removeCustomDropdowns() {
	document.querySelectorAll('.customSelectWrapper').forEach((select) => {
		select.remove();
	});
}

function initMapPopover() {
	const mapImages = document.querySelectorAll('select[name="map"] + .customSelectWrapper li:not(.optgroup) img');

	mapImages.forEach((mapImage) => {
		mapImage.addEventListener('mouseenter', function () {
			const mapImagePopover = document.createElement('div');
			mapImagePopover.id = 'mapPopover';
			mapImagePopover.innerHTML = mapImage.outerHTML;
			
			mapImage.parentNode.parentNode.after(mapImagePopover);
		});
		
		mapImage.addEventListener('mouseleave', function () {
			document.getElementById('mapPopover').remove();
		});
	});
}