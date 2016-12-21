var ws = null;
/**
 * 初始化websocket时 添加用户名
 * @param username
 */
var startWebSocket = function (outputInfoCallback, systemInfoCallback) {
    ws = new WebSocket('ws://127.0.0.1:10086');

    ws.onopen = function (evt) {
        systemInfoCallback('H5ws 已连接成功!');
    }
    ws.onmessage = function (evt) {
        outputInfoCallback(evt.data);
    }
    ws.onclose = function (evt) {
        systemInfoCallback('H5ws 已断开连接!');
    }
    // 异常
    ws.onerror = function (evt) {
        systemInfoCallback('H5ws 发生异常:' + evt);
    };
}