/* Load scripts */
loadScript('functions');
loadScript('menu');
loadScript('modules');
loadScript('dmflags');

loadScript('form/dropdown');
loadScript('form/maplist');
loadScript('form/draganddrop');
loadScript('form');

/* Initialize modules */
(async () => {
	const modulesConfig = await getModulesConfig();

	for (let i = 0; i < modulesConfig.modules.length; i++) {
		const mod = modulesConfig.modules[i];
		const module = await getModule(mod.file);
		
		addModule(mod.file, module, i === 0);
		addNavItem(mod.file, module.name, i === 0);
	}

	dispatchGlobalEvent('modulesLoaded');
})();

/**
 * Load a script file
 * @param  {String}	scriptFile 	The name of the script file
 */
function loadScript(scriptFile) {
	const script = document.createElement('script');
	script.src = `./src/core/${scriptFile}.js`;
	document.body.appendChild(script);
}

/**
 * Load a module JSON file
 * @param  	{String}	moduleFile 	The name of the module file
 * @return 	{String}				Module config JSON
 */
async function getModule(moduleFile) {
    const response = await fetch(`./src/modules/${moduleFile}.json`);
    const json = await response.json();
    return json;
}

/**
 * Load the module config file
 * @param  	{String}	moduleFile 		The name of the module file
 * @return 	{String}					Modules config JSON
 */
async function getModulesConfig() {
    const response = await fetch(`./src/modules.json`);
    const json = await response.json();
    return json;
}