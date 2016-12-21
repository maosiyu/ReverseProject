/**
 * Created by mao_siyu on 2016/11/13.
 * 共通工具类
 * @param object 实现类的 类对象
 */

var Config = require('../../public/config/config');
var nws = require('../../public/config/Nodews');
var query = require('../../data_base/mysql');
var Bagpipe = require('bagpipe');
var Util = require('./utils');
var path = require('path');
var fs = require('fs');

var Template = function () {
};

nws.on('connection', function (connec) {

    var startTime = process.hrtime();
    /**
     * 转换java实体类
     * @param tables  指定的数据库表名
     * @param convertCallbacks  一组回调函数
     */
    Template.convert = function (outputFilePath, projectPaths, tables, convertCallbacks) {
        // 最大并发数
        var bagpipe = new Bagpipe(10);
        for (var i = 0; i < tables.length; i++) {

            bagpipe.push(Template.dataConvert, outputFilePath, projectPaths, tables, i, convertCallbacks, function (err, downLoadType, filePath, fileName, resultData) {
                // 异步回调执行
                if (err) {
                    connec.send('=:|======> bagpipe.push异步回调执行时发生异常: ' + err);
                    throw 'template.js =:|======> bagpipe.push异步回调执行时发生异常: ' + err;
                }
                // 生成的文件名, 要生成的文件内容
                Template[downLoadType](filePath, fileName, resultData);
            });
        }
    };

    /**
     * 将json转成文件
     * projectPaths：项目工程路径
     */
    Template.dataConvert = function (outputFilePath, projectPaths, tables, index, convertCallbacks, callback) {

        var tbName = tables[index].tbName;
        var tbComment = tables[index].tbComment;
        var sql = "SELECT COLUMN_NAME cName, DATA_TYPE cType, COLUMN_COMMENT cComment, COLUMN_KEY cKey, COLUMN_DEFAULT, EXTRA FROM information_schema.columns WHERE table_name = '" + tbName + "' AND table_schema = '" + Config.database + "'";
        query(sql, function (err, rows) {

            for (var i = 0; i < convertCallbacks.length; i++) {
                try {
                    var newPath = outputFilePath + '/' + projectPaths[i]
                    // 同步判断文件夹是否存在
                    if (!fs.existsSync(newPath))
                        fs.mkdirSync(newPath);
                    // 转换
                    convertCallbacks[i](outputFilePath, projectPaths[i], tbName, tbComment, rows, callback);
                } catch (e) {
                    connec.send('=:|======> 将json转成文件时发生了异常: ' + err);
                    throw 'template.js =:|======> 将json转成文件时发生了异常: ' + e;
                }
            }
        });
    };

    /**
     * 向本地写文件
     * @param fileName 要生成的文件名
     * @param fileContent 要生成的文件内容
     */
    Template.localWriteFile = function (filePath, fileName, fileContent) {

        // 将文件写到硬盘
        fs.writeFile(path.join(filePath, fileName), fileContent, function (err) {
            if (err) {
                connec.send('=:|======> 文件写到硬盘时发生了异常: ' + err);
                throw 'template.js =:|======> 将文件写到硬盘时发生了异常: ' + err;
            }
            connec.send(filePath + fileName + ' Export Success!');
        });
    };

});

module.exports = Template;
