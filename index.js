const {app,BrowserWindow} = require('electron');
app.on('ready',build_app);
function build_app(){
    var app_window = new BrowserWindow({
        webPreferences : {
            nodeIntegration : true,
            webviewTag: true
        },
        title:'Download manager'
    });
    app_window.setMenu(null);
    app_window.loadFile('./assests/index.html');
    app_window.webContents.openDevTools();
}