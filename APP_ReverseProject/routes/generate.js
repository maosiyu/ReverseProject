var Template = require('../public/config/template');
var Mapping = require('./generate/mapping');
var Mapper = require('./generate/mapper');
var Entity = require('./generate/entity');
var express = require('express');
var router = express.Router();

var Util = require('../public/config/utils');
var path = require('path');
var fs = require('fs');

router.post('/', function (req, res, next) {

    // tables：表名， outputFilePath：输出目录， projectPath：项目目录
    var outputFilePath = req.body.outputFilePath;
    var projectPath = req.body.projectPath;
    var tables = req.body.tables;

    //
    var converts = [];
    converts.push(Entity.entityConvert);
    converts.push(Mapper.mapperConvert);
    converts.push(Mapping.mappingConvert);
    //
    var projectPaths = [];
    projectPaths.push(projectPath + '/entity/');
    projectPaths.push(projectPath + '/mapper/');
    projectPaths.push(projectPath + '/mappping/');

    // 拼接
    var newPath = outputFilePath + '/' + projectPath
    // 同步判断文件夹是否存在
    if (!fs.existsSync(newPath)) {
        // 创建多层文件夹 异步递归
        Util.mkdirs(newPath, '0777', function () {
            Template.convert(outputFilePath, projectPaths, JSON.parse(tables), converts);
        });
    }

    res.send({
        message: '开始生成!',
        code: 1
    });
});

module.exports = router;