const {app, BrowserWindow, ipcMain, dialog} = require('electron')
const fs = require('fs')
const NodeRSA = require('node-rsa')

function createWindow(){
    let win = new BrowserWindow({
        width: 750,
        height: 800,
        webPreferences: {
            nodeIntegration: true
        },
        //icon: __dirname + '/app/images/ninja.png'
    })
    win.loadFile('./app/index.html')
    win.setMenuBarVisibility(false)
}

ipcMain.on('rsa-genkey', (event) => {
    const key = new NodeRSA({b: 2048})
    const publicKey = key.exportKey('pkcs8-public-pem')
    const privateKey = key.exportKey('pkcs8-private-pem')
    event.sender.send('rsa-genkey-reply', {publicKey, privateKey})
})

ipcMain.on('rsa-encryption', (event, args) => {
    try {
        const {message, publicKey} = args
        console.log('------------------- rsa encryption: -------------')
        console.log('message:', message)
        const key = new NodeRSA({b: 512})
        key.importKey(publicKey, 'pkcs8-public-pem')
        const encrypted = key.encrypt(Buffer.from(message, 'base64'), 'base64', 'buffer')
        event.sender.send('rsa-encryption-reply', encrypted)
        console.log('result of rsa encryption: ', encrypted)
    }
    catch(err){
        console.log(err)
        dialog.showErrorBox('Error', 'Непредвиденная ошибка в шифровании содержимого! Пожалуйста, проверьте свой ключ')
    }
})

ipcMain.on('rsa-decryption', (event, args) => {
    try {
        const {message, privateKey} = args
        console.log('------------------- rsa decryption: -------------')
        console.log('message', Buffer.from(message, 'base64').toString('binary'))
        const key = new NodeRSA({b: 512})
        key.importKey(privateKey, 'pkcs8-private-pem')
        const decrypted = key.decrypt(Buffer.from(message, 'base64').toString('binary'), 'base64')
        event.sender.send('rsa-decryption-reply', decrypted)
        console.log('result of rsa decryption: ', decrypted)
    }
    catch(err){
        console.log(err)
        dialog.showErrorBox('Error', 'Непредвиденная ошибка в расшифровании содержимого! Пожалуйста, проверьте свой ключ')
    }
})

// Обработчик событий по открытию файла
ipcMain.on('open-file', (event, args) => {
    dialog.showOpenDialog({
        defaultPath: __dirname,
        filters: [
            {name: 'All files', extensions: ['*']}
        ]
    }, filenames => {
        if (filenames === undefined){
            event.sender.send('open-file-reply', null)
        }
        else {
            fs.readFile(filenames[0], function(err, data){
                if(err){
                    event.sender.send('open-file-reply', null)
                }
                else{
                    console.log(data.toString('base64'))
                    event.sender.send('open-file-reply', data.toString('base64'))
                }
            })
        }
    })
})

ipcMain.on('save-file', (event, data) => {
    dialog.showSaveDialog({
        defaultPath: __dirname,
        filters: [
            {name: 'Text file', extensions: ['txt']},
            {name: 'All files', extensions: ['*']}
        ]
    }, filename => {
        if (filename){
            console.log(data)
            console.log(Buffer.from(data, 'base64').toString('binary'))
            fs.writeFile(filename, Buffer.from(data, 'base64'), (err) => {
                //console.log(Buffer.from(data, 'base64').toString('binary'))
            })
        }
    })
})

app.on('ready', createWindow)
