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

function loadScript(scriptFile) {
	const script = document.createElement('script');
	script.src = `./src/core/${scriptFile}.js`;
	document.body.appendChild(script);
}

async function getModule(moduleFile) {
    const response = await fetch(`./src/modules/${moduleFile}.json`);
    const json = await response.json();
    return json;
}

async function getModulesConfig() {
    const response = await fetch(`./src/modules.json`);
    const json = await response.json();
    return json;
}