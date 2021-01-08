const {ipcRenderer} = require('electron')

$(document).ready(function(){

    ipcRenderer.on('rsa-encryption-reply', (event, result) => {
        $('#rsa-encryption #result').val(result)
        $('#rsa-encryption #result').attr('data-base64', Buffer.from(result, 'binary').toString('base64'))
    })

    ipcRenderer.on('rsa-decryption-reply', (event, result) => {
        // console.log(result)
        $('#rsa-decryption #result').val(Buffer.from(result, 'base64').toString('binary'))
        $('#rsa-decryption #result').attr('data-base64', result)
    })

    ipcRenderer.on('rsa-genkey-reply', (event, result) => {
        const {publicKey, privateKey} = result
        $('#rsa-genkey #public-key').val(publicKey)
        $('#rsa-genkey #private-key').val(privateKey)
        $('#rsa-genkey #public-key').attr('data-base64', Buffer.from(publicKey, 'binary').toString('base64'))
        $('#rsa-genkey #private-key').attr('data-base64', Buffer.from(privateKey, 'binary').toString('base64'))
    })

    $('#rsa-encryption .get-result').click(() => {
        ipcRenderer.send('rsa-encryption', {
            message: $('#rsa-encryption #message').attr('data-base64'),
            publicKey: $('#rsa-encryption #key').val()
        })
    })

    $('#rsa-decryption .get-result').click(() => {
        ipcRenderer.send('rsa-decryption', {
            message: $('#rsa-decryption #message').attr('data-base64'),
            privateKey: $('#rsa-decryption #key').val()
        })
    })

    $('#rsa-genkey .get-result').click(() => {
        ipcRenderer.send('rsa-genkey')
    })

    // Обновление текста в textbox
    $('#message,#result').change(function(){
        console.log('message or result change')
        console.log($(this).val())
        $(this).attr('data-base64', Buffer.from($(this).val(), 'binary').toString('base64'))
    })

    // Обработка и сохранение файла
    const loading = $('.loading')
    let currentTextarea
    ipcRenderer.on('open-file-reply', function(event, result) {
        if (result){
            console.log(result)
            currentTextarea.attr('data-base64', result)
            currentTextarea.val(Buffer.from(result, 'base64').toString('binary'))
        }
        loading.removeClass('show')
    })

    $('.file-button.open').click(function(){
        try {
            currentTextarea = $(this).siblings('textarea')
            ipcRenderer.send('open-file')
            loading.addClass('show')
        }
        catch(err) {
            loading.removeClass('show')
        }
    })

    ipcRenderer.on('save-file-reply', (event, result) => {
        loading.removeClass('show')
    })

    $('.file-button.save').click(function(){
        try {
            //const data = $(this).siblings('textarea').val()
            let data = $(this).siblings('textarea').attr('data-base64')
            console.log(data)
            ipcRenderer.send('save-file', data)
        }
        catch(err) {
            loading.removeClass('show')
        }
    })
});
