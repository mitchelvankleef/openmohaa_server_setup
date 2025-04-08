const { app, BrowserWindow, ipcMain, dialog } = require('electron/main');
const { spawn } = require('child_process');

const path = require('path'); 
const fs = require('fs');
const os = require('os');

let rootPath = path.resolve('.').replace(/\\/g, '/');

const createWindow = () => {
	const win = new BrowserWindow({
		width: 800,
		height: 800,
		icon: './assets/img/favicon.png',
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: __dirname + '/preload.js'
        }
	});

	win.setMenu(null);

	win.loadFile('index.html');
}

app.whenReady().then(() => {
	createWindow();

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});

	app.on('window-all-closed', () => {
		if (os.platform() !== 'darwin') {
			app.quit();
		}
	});
	
	const enabledGames = {
		'aa': true,
		'sh': true,
		'bt': true
	};
	
	if (app.isPackaged) {		
		if (process?.env?.PORTABLE_EXECUTABLE_DIR) {
			rootPath = process.env.PORTABLE_EXECUTABLE_DIR;
		}
	
		const executableFile = getExecutable();
	
		if (!fs.existsSync(rootPath + '/' + executableFile)) {
			dialog.showErrorBox('Could not find \'' + executableFile + '\'!', 'Please make sure you are running the tool from your game\'s root directory');
			app.exit(1);
		}
	
		if (!fs.existsSync(rootPath + '/main')) {
			dialog.showErrorBox('Could not find the \'main\' folder!', 'Please make sure you are running the tool from your game\'s root directory');
			app.exit(1);
		}

		if (!fs.existsSync(rootPath + '/mainta')) {
			enabledGames['sh'] = false;
		}
		if (!fs.existsSync(rootPath + '/maintt')) {
			enabledGames['bt'] = false;
		}
	}

	ipcMain.handle('getEnabledGames', () => enabledGames);
})


ipcMain.handle('saveConfig', async (event, config, game) => {
	let gameFolder = 'main';
	
	switch (parseInt(game)) {
		case 1:
			gameFolder = 'mainta';
			break;
		case 2:
			gameFolder = 'maintt';
			break;
	}
	
	fs.writeFile(rootPath + '/' + gameFolder + '/server.cfg',  
		config,
		function (err) {
			if (err) throw err;
		}
	); 
});

ipcMain.handle('runServer', async (event, game) => {
    return new Promise((resolve, reject) => {
		if (os.platform() === 'win32') {
			spawn('cd /d ' + rootPath + ' && omohaaded.x86_64.exe', ['+set com_target_game ' + game + ' +exec "server.cfg"'], { shell: true, detached: true, stdio: 'ignore' });
		} else if (os.platform() === 'darwin') {
			//spawn('cd "' + rootPath + '" && ./omohaaded.multiarch', ['+set com_target_game ' + game + ' +exec "server.cfg"'], { cwd: rootPath, shell: true, detached: true, stdio: 'ignore' });
		} else {
			spawn('gnome-terminal -- bash -c \'cd "' + rootPath + '" && ./omohaaded.x86_64 +set com_target_game ' + game + ' +exec "server.cfg"\'', [], { cwd: rootPath, shell: true, detached: true, stdio: 'ignore' });
		}
    });
});

ipcMain.handle('showDialog', async (event, dialogTitle, dialogMessage) => {
	dialog.showMessageBox({
	  type: 'info',
	  buttons: ['OK'],
	  title: 'Information',
	  message: dialogTitle,
	  detail: dialogMessage
	});
});

ipcMain.handle('getConfig', async (event, game) => {
    return new Promise(function (resolve, reject) {
        fs.readFile(rootPath + '/' + game + '/server.cfg', 'utf8', function (err, data) {
            if (err)
                return;
            else
                resolve(data);
        });
    });
});

function getExecutable() {
	switch (os.platform()) {
		case 'win32':
			return 'omohaaded.x86_64.exe';
			break;
		case 'darwin':
			return 'omohaaded.multiarch';
			break;
		default:
			return 'omohaaded.x86_64';
			break;
	}
}