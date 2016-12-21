/* =-=-=-=-=-=-=-=-=-= 此文件是链接 mysql 的配置文件 =-=-=-=-=-=-=-=-=-=-= */
var EventEmitter = require('events').EventEmitter;
var Config = require('../public/config/config');
var emitter = new EventEmitter();
var mysql = require('mysql');

/**
 * 应用
 */
emitter.on('connection', function (sql, callback) {
    // 为什么每次都要创建链接池?
    // 因为逆向生成工具可能会频繁切换数据库, 所以不能共用上一次的链接池
    var pool = mysql.createPool({
        host: Config.host,
        port: Config.port,
        user: Config.user,
        database: Config.database,
        password: Config.password
    });
    pool.getConnection(function (err, connection) {
        if (err) throw 'mysql.js --> getConnection =:|======> ' + err;
        connection.query(sql, function (err, rows) {
            if (err) throw 'mysql.js --> connection.query =:|======> ' + err;
            // 还是得释放链接
            connection.release();
            callback(err, rows);
        });
    });
});

var query = function (sql, callback) {
    emitter.emit('connection', sql, callback);
};

module.exports = query;
