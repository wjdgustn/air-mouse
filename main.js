const express = require('express');
const http = require('http');
const https = require('https');
const fs = require('fs');

const webSocket = require('./socket');
const setting = require('./setting.json');

const app = express();

let protocol;
let options;
if(setting.USE_SSL) {
    protocol = "https://"
    options = {
        cert: fs.readFileSync(setting.SSL_CERT),
        key: fs.readFileSync(setting.SSL_KEY)
    }
}
else {
    protocol = "http://"
}

app.use((req, res, next) => {
    if(setting.ALLOW_IP.indexOf(req.connection.remoteAddress) == -1 && setting.ALLOW_IP.indexOf(req.connection.remoteAddress.replace('::ffff:', '')) == -1) {
        console.log(req.connection.remoteAddress);
        res.send('권한이 없습니다.');
        return;
    }
    next();
});

const staticoptions = {
    index: setting.INDEX
}
app.use(express.static(__dirname + "/public/", staticoptions));

console.log('라우터를 불러오는 중...');
let filelist = fs.readdirSync('./routes');
for(let i in filelist) {
    app.use(require('./routes/' + filelist[i]));
    console.log(`${filelist[i]} 라우터를 불러왔습니다.`);
}
console.log('라우터를 모두 불러왔습니다.\n');

let server;
if(setting.USE_SSL) {
    server = https.createServer(options, app).listen(setting.PORT, () => {
        console.log('서버가 구동중입니다!');
    });
}
else {
    server = http.createServer(app).listen(setting.PORT, () => {
        console.log("서버가 구동중입니다!");
    });
}

webSocket(server);