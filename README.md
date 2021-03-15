# RSA Simple Deen

Это мини-приложение по шифрованию содержимого файлов, а также некоторых строк. Алгоритм шифрования RSA.

![Preview image](app/images/preview.png)

## Прежде чем начать

Эта инструкция поможет Вам запустить приложение

### Требования

Первым делом устанавливаем nodeJS, если он у Вас еще не установлен.

```
node.js
```

Далее устанавливаем пакеты
```
npm install
```

### Запуск

```
npm start
```

## Сборка приложения

```
npm run dist
```

## Изменение размерности ключа шифрования

### Пример использования:

```js

// Устанавливаем свою размерность ключа - 512/1024/2048
// Пример: const key = new NodeRSA({b: 512/1024/2048})

const key = new NodeRSA({b: 512/1024/2048})

```

### Изменяется это в файле main.js (19 строка)

```js
ipcMain.on('rsa-genkey', (event) => {
    const key = new NodeRSA({b: 2048})
    const publicKey = key.exportKey('pkcs8-public-pem')
    const privateKey = key.exportKey('pkcs8-private-pem')
    event.sender.send('rsa-genkey-reply', {publicKey, privateKey})
})
});

$promise->wait();
```

## Написан на основе

* [Electron.js](https://electronjs.org/)
* [Node.js](https://nodejs.org/en/)
* [Bootstrap 4](https://getbootstrap.com/)

## Авторы

* [Munovv](https://github.com/Munovv)
