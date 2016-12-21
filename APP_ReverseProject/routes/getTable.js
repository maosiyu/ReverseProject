/**
 * Created by mao-siyu on 16-11-18.
 * 初始化数据库信息
 */
var Config = require('../public/config/config');
var query = require('../data_base/mysql');
var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {

    /**
     * 获取指定数据库中的 表名 表注释
     */
    var sql = " SELECT TABLE_NAME tbName, TABLE_COMMENT tbComment FROM information_schema.`TABLES` WHERE table_schema= '" + Config.database + "'";

    query(sql, function (err, rows) {

        // 连接成功
        var message = '数据库连接成功！';
        var code = 1;
        if (err) {
            message = '数据库连接失败！';
            code = 0;
        }

        res.send({
            message: message,
            code: code,
            data: JSON.stringify(rows),
            dataLength: rows.length
        });

    });

});

module.exports = router;