const { ipcRenderer } = require('electron');

let databaseAddress = document.getElementById('databaseAddress');
let username = document.getElementById('username');
let password = document.getElementById('password');
let databaseName = document.getElementById('databaseName');
document.getElementById("connectBtn").addEventListener('click', () => {
    ipcRenderer.invoke('connect-database', {
        host: databaseAddress.value,
        username: username.value,
        password: password.value,
        db: databaseName.value,
    });
});