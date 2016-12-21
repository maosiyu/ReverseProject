/**
 * Created by mao-siyu on 16-11-18.
 *
 * @param tbName  类名
 * @param tbComment 类注释
 * @param rows 所有列名
 * @param callback
 */
var Util = require('../../public/config/utils');
var Dictionary = require('../../public/config/matchDictionary');

var Mapping = function () {
};
Mapping.mappingConvert = function (outputFilePath, projectPath, tbName, tbComment, rows, callback) {

    // 拼接文件的输出路径
    outputFilePath = outputFilePath + '/' + projectPath;

    // 类名
    var className = Util.firstLetter(Util.dbToCamelCaseFormat(tbName));

    // xml 头
    var xmlHead = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xmlHead += '<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">\n';

    // mapper文件
    var mapper = '<mapper namespace="' + projectPath.replace(/\//g, '.') + Util.firstLetter(Util.dbToCamelCaseFormat(tbName)) + 'Mapper" >\n';

    // 插入语句块
    var _insert = '';
    _insert += '    <!-- 新增 ' + tbComment + ' -->\n';
    _insert += '    <insert id="insert' + className + '" parameterType="' + className + '" >\n';
    _insert += '        INSERT INTO\n';
    _insert += '        ' + tbName + ' (\n';
    var insertValues = '        ) VALUES (\n';

    // 删除语句块
    var _delete = '';
    _delete += '    <!-- 删除 ' + tbComment + ' -->\n';
    _delete += '    <delete id="delete' + className + 'ById" parameterType="String" >\n';
    _delete += '        DELETE\n';
    _delete += '        FROM\n';
    _delete += '            ' + tbName + ' (\n';
    _delete += '        WHERE\n';
    _delete += '            id = #{id}\n';
    _delete += '    <\/delete>\n\n';

    // 修改语句块
    var _update = '';
    _update += '    <!-- 修改 ' + tbComment + ' -->\n';
    _update += '    <update id="update' + className + '" parameterType="' + className + '" >\n';
    _update += '        UPDATE\n';
    _update += '            ' + tbName + ' (\n';
    _update += '        SET\n';
    _update += '        <trim prefix="(" suffix=")" suffixOverrides="," >\n';
    var updateWhere = '        WHERE\n';
    updateWhere += '        <trim prefix="(" suffix=")" prefixOverrides="AND" >\n';

    // 查询语句块
    var _select = '';
    _select += '    <!-- 查询 ' + tbComment + ' -->\n';
    _select += '    <select id="select' + className + '" parameterType="' + className + '" resultType="' + className + '">\n';
    _select += '        SELECT\n';
    var selectFrom = '        FROM\n';
    selectFrom += '            ' + tbName + '\n';
    selectFrom += '        WHERE\n';
    selectFrom += '            1 = 1\n';


    // 拼接java 实体对象
    for (var i = 0; i < rows.length; i++) {
        var type = Dictionary.match(rows[i].cType);
        var name = rows[i].cName;
        var comment = rows[i].cComment;

        // 新增
        _insert += '            ' + name + ',\n';
        insertValues += '            #{' + Util.dbToCamelCaseFormat(name) + '},\n';

        // 修改
        _update += '            <if test="' + Util.dbToCamelCaseFormat(name) + ' != null">\n';
        _update += '                ' + name + ' = #{' + Util.dbToCamelCaseFormat(name) + '},\n';
        _update += '            <\/if>\n';
        updateWhere += '            <if test="' + Util.dbToCamelCaseFormat(name) + ' != null">\n';
        updateWhere += '                AND ' + name + ' = #{' + Util.dbToCamelCaseFormat(name) + '}\n';
        updateWhere += '            <\/if>\n';

        // 查询
        _select += '            ' + name + ' AS ' + Util.dbToCamelCaseFormat(name) + ',\n';
        selectFrom += '            <if test="' + Util.dbToCamelCaseFormat(name) + ' != null">\n';
        selectFrom += '                AND ' + name + ' = #{' + Util.dbToCamelCaseFormat(name) + '}\n';
        selectFrom += '            <\/if>\n';
    }
    // 新增
    _insert = _insert.replace(/,\n$/g, '\n');
    insertValues = insertValues.replace(/,\n$/g, '\n') + '        )\n';
    _insert += insertValues + '    <\/insert>\n\n';
    // 修改
    _update += '        <\/trim>\n';
    updateWhere += '        <\/trim>\n';
    _update += updateWhere;
    _update += '    <\/update>\n\n';
    // 查询
    _select = _select.replace(/,\n$/g, '\n');
    _select += selectFrom;
    _select += '    <\/select>\n\n';

    mapper += _insert;
    mapper += _delete;
    mapper += _update;
    mapper += _select;
    mapper += '<\/mapper>';
    var resultFile = xmlHead + mapper;
    // 拼接完成后回调 准备生成 java文件
    callback(null, 'localWriteFile', outputFilePath, className + 'Mapping.xml', resultFile);
}

module.exports = Mapping;