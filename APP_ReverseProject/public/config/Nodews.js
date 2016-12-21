/**
 * Created by mao_siyu on 2016/12/14.
 */
var nws = require('nodejs-websocket');

var nwsServer = nws.createServer(function (connec) {

    // /**
    //  * 消息
    //  */
    // connec.on('text', function (txt) {
    //     console.log('onText =:|======> : ' + txt);
    // });

    /**
     * 某次的连接是否关闭
     */
    connec.on('close', function (code) {
        console.info('onClose =:|======> code: ' + code);
    });

    connec.on('error', function (code, reason) {
        console.error('onError =:|======> code: ' + code + ' reason: ' + reason);
    });

});

/**
 * websocket 服务监听 已经启动
 */
nwsServer.on('listening', function () {
    console.log('nws.js onListening =:|======>  初始化 nws');
});

// /**
//  * websocket 客户端链接事件
//  */
// nwsServer.on('connection', function (connec) {
//     console.log('nws.js onConnection =:|======> Your connection key is: ' + connec.key);
//     connec.send('Your connection key is: ' + connec.key);
// });

nwsServer.listen(10086);

module.exports = nwsServer;