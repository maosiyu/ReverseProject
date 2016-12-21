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
var Entity = function () {
};
Entity.entityConvert = function (outputFilePath, projectPath, tbName, tbComment, rows, callback) {

    // 拼接文件的输出路径
    outputFilePath = outputFilePath + '/' + projectPath;

    var resultFile = '';
    // 包
    var javaPackage = '';
    // 引包
    var javaImport = '';
    // 拼接java 实体类
    var javaClass = '';
    var className = Util.firstLetter(Util.dbToCamelCaseFormat(tbName));
    // 属性名
    var javaProperty = '';
    // 属性get、set方法
    var method = '';

    // 包名
    javaPackage += 'package ' + projectPath.replace(/\//g, '.').replace(/.$/g, '') + ';\n\n';
    // 引包
    javaImport += 'import java.math.BigInteger;\n\n';
    javaImport += 'import java.math.BigDecimal;\n\n';
    javaImport += 'import java.util.Date;\n\n';
    javaImport += 'import java.sql.Timestamp;\n\n';
    // 注释
    javaClass += '/**' + '\n';
    javaClass += ' * ' + tbComment + '\n';
    javaClass += ' */' + '\n';
    // 类名
    javaClass += 'public class ' + className + ' {\n\n';

    // 拼接java 实体对象
    for (var i = 0; i < rows.length; i++) {
        var type = Dictionary.match(rows[i].cType);
        var name = Util.dbToCamelCaseFormat(rows[i].cName);
        var comment = rows[i].cComment;
        // 注释
        javaProperty += ('    /** ' + comment + '. */\n');
        // 属性名称
        javaProperty += ('    private ' + type + ' ' + name + ';\n\n');
        // get方法注释
        method += '    /**' + '\n';
        method += '     * 获取 ' + comment + '\n';
        method += '     */' + '\n';
        // get方法
        method += '    public ' + type + ' get' + Util.firstLetter(name) + '() {\n\n';
        method += '        return ' + name + ';\n';
        method += '    }\n\n';
        // set方法注释
        method += '    /**' + '\n';
        method += '     * 设置 ' + comment + '\n';
        method += '     */' + '\n';
        // set方法
        method += '    public void set' + Util.firstLetter(name) + '(' + type + ' ' + name + ') {\n\n';
        method += '        this.' + name + ' = ' + name + ';\n';
        method += '    }\n\n';
    }
    javaClass += javaProperty;
    javaClass += method;
    javaClass += '}\n\n';
    resultFile = javaPackage + javaImport + javaClass;
    // 拼接完成后回调 准备生成 java文件 （回调函数在 template.js中 bagpipe.push()的回调函数处理）
    callback(null, 'localWriteFile', outputFilePath, className + '.java', resultFile);
}

module.exports = Entity;