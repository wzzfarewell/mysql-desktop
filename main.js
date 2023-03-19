const mysql = require('mysql');
const { app, BrowserWindow, ipcMain, Notification, dialog } = require('electron');
const path = require('path');

let connectWindow ;
let mainWindow;

function createConnectWindow() {
    const win = new BrowserWindow({
        width : 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true, // This gives us access to Node.js APIs.
            contextIsolation: false,
            enableRemoteModule: true,
        }
    });
    win.loadFile(path.join(__dirname, 'views/connect.html'))
    // win.webContents.openDevTools()
    return win;
}

function createMainWindow() {
    const win = new BrowserWindow({
        width : 1200,
        height: 900,
        webPreferences: {
            nodeIntegration: true, // This gives us access to Node.js APIs.
            contextIsolation: false,
            enableRemoteModule: true,
        }
    });
    win.loadFile(path.join(__dirname, 'index.html'));
    // win.webContents.openDevTools()
    return win;
}

const loadMainWindow = () => {
    connectWindow = createConnectWindow();
};

app.on("ready", loadMainWindow);

// ensure that the application boots up when its icon is clicked in the operating system’s application dock when there are no windows open.
app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        loadMainWindow();
    }
});

// take care of an issue on some operating systems where the application still remains active even after all windows have been closed. 
// This often occurs on non-MacOS platforms. 
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

ipcMain.handle('connect-database', (event, ...args) => {
    console.log(args);
    mainWindow = createMainWindow();
    connectWindow.close();
    var params = args[0];
    connect(params.host, params.username, params.password, params.db);
});

ipcMain.handle('show-notification', (event, ...args) => {
    const notification = {
        title: 'New Task',
        body: `Added: ${args[0]}`
    };
    new Notification(notification).show();
});

function connect(host, user, password, db) {
    var connection = mysql.createConnection({
        host: host,
        user: user,
        password: password,
        database: db,
    });
    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to MySQL database: ', err);
            const options = {
                type: 'error',
                buttons: ['OK'],
                title: 'Error',
                message: 'An error occurred: ' + err,
              };
              dialog.showMessageBox(BrowserWindow.getFocusedWindow(), options)
              .then((choice) => {
                  if (choice.response === 0) {
                      quitApplication();
                  }
              }).catch(err => {
                  console.log('ERROR', err);
              });
              
              setTimeout(() => {
                quitApplication();
              }, 5000);
          } else {
            console.log('Connected to MySQL database!');
          }
    });
}

function quitApplication() {
    app.quit();
}