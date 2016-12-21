var Config = require('../public/config/config');
var express = require('express');
var router = express.Router();

router.post('/', function (req, res, next) {

    var settings = req.body;

    // 将配置保留到 Config文件中 缓存，为其它模块共享
    Config.host = settings.host;
    Config.port = settings.port;
    Config.user = settings.user;
    Config.database = settings.database;
    Config.password = settings.password;

    registerDB(req.body, function (message, code) {
        res.send({
            message: message,
            code: code
        });
    });
});

module.exports = router;


/**
 * 注册连接池事件
 */
var registerDB = function (settings, callback) {

    var mysql = require('mysql');
    /**
     * 配置连接池
     */
    pool = mysql.createPool(settings);
    // 链接数据库
    pool.getConnection(function (err, connection) {
        // 连接成功
        var message = '数据库连接成功！';
        var code = 1;
        if (err) {
            message = '数据库连接失败！';
            code = 0;
        } else {
            connection.release();
        }

        callback(message, code);
    });
}
