const form = document.querySelector('form');

/**
 * Add module
 * @param  	{Object}	module 		The object containing the module
 */
function addModule(moduleId, module, active = false) {	
	/* Create fieldset */
	const fieldset = document.createElement('fieldset');
	fieldset.dataset.tab = moduleId;
	
	if (active) {
		fieldset.classList.add('active');
	}
	
	/* Add title */
	const title = document.createElement('strong');
	title.innerText = module.name;
	fieldset.appendChild(title);
	
	/* Add fields */
	for (let i = 0; i < module.fields.length; i++) {			
		const field = module.fields[i];
		
		const theField = getField(field);
		
		fieldset.appendChild(theField);
	}
	
	/* Add fieldset to form */
	form.appendChild(fieldset);
}

/**
 * Get the HTML for a given field
 * @param  {String}	field	The object containing field data
 * @return {String}			HTML element containing the field
 */
function getField(field) {
	const label	= document.createElement('label');
	
	if (field.label) {
		const span		= document.createElement('span');
		span.innerText	= field.label;
		
		label.appendChild(span);
	}
	
	const fieldWrapper = document.createElement('div');
	fieldWrapper.classList.add('fieldWrapper');
	
	switch (field.type) {
		case 'dropdown':
			const select	= document.createElement('select');		
			select.name		= field.name;
			
			renderOptions(select, field.options, field.default ?? null);
		
			fieldWrapper.appendChild(select);
			break;
			
		case 'textarea':
			const textarea	= document.createElement('textarea');
			textarea.name	= field.name;
			textarea.value	= field.default ?? '';
			
			if (field.rows) {
				textarea.rows	= field.rows;
			}
			
			fieldWrapper.appendChild(textarea);
			break;
			
		default:
			const input	= document.createElement('input');		
			input.type	= getInputType(field.type);
			input.name	= field.name;
			input.value	= input.type === 'checkbox' ? 1 : (field.default ?? '');
			
			if (input.type === 'checkbox' && field.default == 1) {
				input.checked = true;
			}
			
			if (input.type === 'number' && field.step) {
				input.step = field.step;
			}
		
			fieldWrapper.appendChild(input);
			break;
	}
	
	if (field.buttons) {
		for (let i = 0; i < field.buttons.length; i++) {
			const button = field.buttons[i];
			
			const theButton = document.createElement('button');
			theButton.type = 'button';
			theButton.innerText = button.label;
			theButton.setAttribute('onclick', button.function + '(this)');
			
			if (button.id) {
				theButton.id = button.id;
			}
			
			fieldWrapper.appendChild(theButton);
		}
	}
	
	label.appendChild(fieldWrapper);
	
	return label;
}

/**
 * Get the HTML type for an input field based by the given config type
 * @param  {String}	type	The config type for the input field
 * @return {String}			The HTML type for the input field
 */
function getInputType(type) {
	switch (type) {
		case 'dropdown':
			return 'select';
			break;
			
		case 'boolean':
			return 'checkbox';
			break;
		
		default:
			return type;
			break;
	}
}

/**
 * Render the options for the given select
 * @param  {String}	select			The HTML select element
 * @param  {String}	options			An array containing options
 * @param  {String}	defaultValue	A string containing the default value
 */
function renderOptions(select, options, defaultValue = null) {
	for (let i = 0; i < options.length; i++) {
		if (options[i].type === 'optgroup') {
			const optgroup	= document.createElement('optgroup');
			
			optgroup.label			= options[i].label;
	
			if (options[i].game !== undefined) {
				optgroup.dataset.game	= options[i].game;
			}
			if (options[i].mode !== undefined) {
				optgroup.dataset.mode	= options[i].mode;
			}
			if (options[i].image) {
				optgroup.dataset.image	= options[i].image;
			}
			
			for (let j = 0; j < options[i].suboptions.length; j++) {
				createOption(optgroup, options[i].suboptions[j], defaultValue);
			}
		
			select.appendChild(optgroup);
		} else {
			createOption(select, options[i], defaultValue);
		}
	}
}

/**
 * Create an option and append it to the select or optgroup
 * @param  {String}	select			The HTML select or opgroup element
 * @param  {String}	option			An array containing the option
 * @param  {String}	defaultValue	A string containing the default value
 */
function createOption(select, theOption, defaultValue) {
	const option = document.createElement('option');
	
	option.innerText	= theOption.label;
	option.value		= theOption.value;
	
	if (theOption.game !== undefined) {
		option.dataset.game	= theOption.game;
	}
	if (theOption.mode !== undefined) {
		option.dataset.mode	= theOption.mode;
	}
	if (theOption.image) {
		option.dataset.image = theOption.image;
	}
	
	if (option.value == defaultValue) {
		option.selected = true;
	}
	
	select.appendChild(option);
}