const electron = require("electron");
const { shell } = require('electron')
const ipcMain = require('electron').ipcMain;
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const isDev = require("electron-is-dev");
const fs = require("fs")
const file = require(path.join(__dirname,'config.json'));


require('electron-reload')(__dirname, {ignored: /profile|[\/\\]\./});

let win;

let currUser = '';
let loginFlag = false;

app.on("ready", createWindow);
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
    app.quit();
    }
});

app.on("activate", () => {
    if (win === null) {
    createWindow();
    }
});

function createWindow() {
    console.log(__dirname + '/preload.js')
    
    win = new BrowserWindow({ 
        width: 400, 
        height: 600,
        icon: __dirname + "/icon.png",
        webPreferences: {
            nodeIntegration: false,
            preload: __dirname + '/preload.js'
          }
    });
    //win.setMenu(null);
    win.loadURL(
        isDev
        ? "http://localhost:3000"
        : `file://${path.join(__dirname, "../build/index.html")}`
    );
    win.on("closed", () => (win = null));
    win.webContents.on("new-window", function(event, url) {
        event.preventDefault();
        shell.openExternal(url);
      });
}

function switchToMainDisplay () {
    win.setSize(1200, 800);
    win.center();
}

function switchToLoginDisplay () {
    win.setSize(400, 600);
    win.center();
}

function showElement(id) {
win.webContents.executeJavaScript(`document.getElementById("` + id + `").removeAttribute("hidden")`);
}

function hideElement(id) {
    win.webContents.executeJavaScript(`document.getElementById("` + id + `").hidden = true`);
}

function checkHoloLensConnected () {
    try {
        var http = require('http'),
        options = {method: 'HEAD', host: 'https://192.168.1.30', port: 80, path: '/'},
        req = http.request(options, function(r) {
            file.status.hololens.connected = "Yes";

            fs.writeFile(path.join(__dirname,'config.json'), JSON.stringify(file), function writeJSON(err) {
            if (err) return console.log(err);
            console.log(JSON.stringify(file));
            console.log('Yes');
            });
        });
        req.end();
        return true;
    }
    catch(e){
        
        file.status.hololens.connected = "No";

            fs.writeFile(path.join(__dirname,'config.json'), JSON.stringify(file), function writeJSON(err) {
            if (err) return console.log(err);
            console.log(JSON.stringify(file));
            console.log('No');
            });
            return false;
    }
}

function createTemplate(workOrderNum) {
    var template = {order: []}
        template.order.push({number: "a", location:"b", lastInspection: "c", inspectBefore: "d"});
        var json = JSON.stringify(template);
        fs.writeFile(path.join(__dirname,'..\\profile\\' + currUser + '\\workOrders\\' + workOrderNum + '.json'), json, 'utf8', function (err) {
            if (err) throw err;
        });

}


async function createWorkOrder (workOrderNum, location, lastInspected, inspectBy){
    await createTemplate(workOrderNum);
    console.log("all done with creating template");
    const work_order = require(path.join(__dirname,'..\\profile\\' + currUser + '\\workOrders\\874.json'));
    console.log(work_order);
    work_order.order.number = workOrderNum;
    work_order.order.location = location;
    work_order.order.lastInspection = lastInspected;
    work_order.order.inspectBefore = inspectBy;
    await fs.writeFile(path.join(__dirname,'..\\profile\\' + currUser + '\\workOrders\\' + workOrderNum + '.json'), JSON.stringify(work_order), function writeJSON(err) {
        if (err) return console.log(err);
    });
    user_data = require(path.join(__dirname,'..\\profile\\' + currUser + '\\userdata.json'));
    let rawConfig = fs.readFileSync(path.join(__dirname,'..\\profile\\' + currUser + '\\userdata.json'));
    let parseRaw = JSON.parse(rawConfig);
    let files = parseRaw.workOrders.files;
    files.push(workOrderNum + '.json');
    console.log(files)
    user_data.workOrders.files = files;
    await fs.writeFile(path.join(__dirname,'..\\profile\\' + currUser + '\\userdata.json'), JSON.stringify(user_data), function writeJSON(err) {
        if (err) return console.log(err);
    });

}

async function removeWorkOrder(file){
    fs.unlinkSync(path.join(__dirname,'..\\profile\\' + currUser + '\\workOrders\\' + file + '.json'), (err) => console.log(err))

    user_data = require(path.join(__dirname,'..\\profile\\' + currUser + '\\userdata.json'));
    let rawConfig = fs.readFileSync(path.join(__dirname,'..\\profile\\' + currUser + '\\userdata.json'));
    let parseRaw = JSON.parse(rawConfig);
    let files = parseRaw.workOrders.files;
    let index = files.indexOf(file + '.json');
    console.log(files)
    if (index > -1) {
        files.splice(index, 1);
    }
    console.log(files)
    user_data.workOrders.files = files;
    await fs.writeFile(path.join(__dirname,'..\\profile\\' + currUser + '\\userdata.json'), JSON.stringify(user_data), function writeJSON(err) {
        if (err) return console.log(err);
    });
}

//ipc Event 
ipcMain.on('login', (event, arg) => {
    loginFlag = true;    
    switchToMainDisplay();
    hideElement('login-page');
    showElement('page-header');
    showElement('page-nav');
    showElement('status-page');
    console.log("Login Successful");
    event.reply('login-success')
  })

  ipcMain.on('logout', (event, currentPage) => {
    loginFlag = false;
    switchToLoginDisplay();
    showElement('login-page');
    hideElement('page-nav');
    hideElement('page-header');
    hideElement(currentPage);
    console.log("Logout Successful");
  })

ipcMain.on('switch-page', (event, currentPage, newPage) => {
    hideElement(currentPage);
    showElement(newPage);
})


ipcMain.handle('check-bypass', (event, message) => {
    let rawConfig = fs.readFileSync(path.join(__dirname,'config.json'));
    let parseRaw = JSON.parse(rawConfig);
    let bypassFlag = parseRaw.login.bypass; 
    return bypassFlag;
})

ipcMain.handle('check-credentials', (event, username, password) => {
    console.log(path.join(__dirname,'config.json'))
    let rawConfig = fs.readFileSync(path.join(__dirname,'config.json'));
    let parseRaw = JSON.parse(rawConfig);
    let user = parseRaw.login.username;
    let pass = parseRaw.login.password;
    for(var i = 0; i < user.length; i++){
        if(user[i] == username && pass[i] == password){
            currUser = user[i];
            return true;
        }
    }
    return false;
})

ipcMain.handle('get-status-props', (event, message) => {
    //checkHoloLensConnected();
    console.log("fetching status props")
    let rawConfig = fs.readFileSync(path.join(__dirname,'..\\profile\\' + currUser + '\\userdata.json'));
    let parseRaw = JSON.parse(rawConfig);
    return parseRaw;
})

ipcMain.handle('is-login', (event) => {
    return loginFlag;
})

ipcMain.handle('get-work-orders', (event) => {
    console.log("fetching work orders")
    let rawConfig = fs.readFileSync(path.join(__dirname,'..\\profile\\' + currUser + '\\userdata.json'));
    let parseRaw = JSON.parse(rawConfig);
    let files = parseRaw.workOrders.files;
    return files;
    
});

ipcMain.handle('parse-work-order', (event, file) => {
    //checkHoloLensConnected();
    let rawConfig = fs.readFileSync(path.join(__dirname,'..\\profile\\' + currUser + '\\workOrders\\' + file));
    let parseRaw = JSON.parse(rawConfig);
    return parseRaw;
})

ipcMain.handle('create-work-order', (event, workOrderNum, location, lastInspected, inspectBy) => {
    console.log("Creating new work order")    
    createWorkOrder(workOrderNum, location, lastInspected, inspectBy);
    return true;
})

ipcMain.handle('remove-work-order', (event, file) => {
    removeWorkOrder(file);
    return true;
})