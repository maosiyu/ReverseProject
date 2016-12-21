/**
 * Created by mao_siyu on 2016/11/13.
 * 共通工具类
 * @param object 实现类的 类对象
 */
var process = require('process');
var path = require('path');
var fs = require('fs');

var Util = function () {
};

/**
 * 首字母转大字
 * @param data
 */
Util.firstLetter = function (data) {
    return data.replace(/([a-z])/, function ($0) {
        return $0.toUpperCase();
    });
};

/**
 * 属性名称格式化 数据库字段转成驼峰命名
 * @param src
 */
Util.dbToCamelCaseFormat = function (data) {
    // 统一字符串类型
    var str = data.toLowerCase();
    // 匹配转换
    return str.replace(/_([a-z])/g, function ($0, $1) {
        return $1.toUpperCase();
    });
};

/**
 * 属性名称格式化 驼峰命名转成数据库字段
 * @param src
 */
Util.camelCaseToDbFormat = function (data) {
    return data.replace(/([^A-Z])([A-Z])/g, function ($0, $1, $2) {
        return $1 + "_" + $2.toLowerCase();
    });
};

/**
 * 创建多层文件夹 异步递归
 * @param dirpath
 * @param mode
 * @param callback
 */
Util.mkdirs = function (dirpath, mode, callback) {
    fs.exists(dirpath, function (exists) {
        if (exists && callback) {
            callback();
        } else {
            // 尝试创建父目录，然后再创建当前目录
            Util.mkdirs(path.dirname(dirpath), mode, function () {
                // 接收参数：
                // path          将创建的目录路径
                // mode          目录权限（读写权限），默认0777
                // callback      回调，传递异常参数err
                fs.mkdir(dirpath, mode, callback);
            });
        }
    });
};

/**
 * 测试运行时间 工具方法
 * @param _function
 */
Util.testRuntime = function (_function) {
    var startTime = process.hrtime();
    _function();
    var endTime = process.hrtime(startTime);
    // [秒, 纳秒]
    console.info('[秒, 纳秒]');
    console.info(endTime);
};

// 当使用require('./utils.js');时绑定的对象是 Util这个函数
module.exports = Util;