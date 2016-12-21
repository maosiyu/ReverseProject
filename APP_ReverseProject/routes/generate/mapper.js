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
var Mapper = function () {
};
Mapper.mapperConvert = function (outputFilePath, projectPath, tbName, tbComment, rows, callback) {

    // 拼接文件的输出路径
    outputFilePath = outputFilePath + '/' + projectPath;

    var resultFile = '';
    // 包
    var javaPackage = '';
    // 引包
    var javaImport = '';
    // 拼接java 实体类
    var javaClass = '';
    // 类名
    var className = Util.firstLetter(Util.dbToCamelCaseFormat(tbName));
    // 方法
    var method = '';

    // 包名
    javaPackage += 'package ' + projectPath.replace(/\//g, '.').replace(/.$/g, '') + ';\n\n';
    // 引包
    javaImport += 'import java.math.BigInteger;\n\n';
    javaImport += 'import java.math.BigDecimal;\n\n';
    javaImport += 'import java.util.Date;\n\n';
    javaImport += 'import java.sql.Timestamp;\n\n';
    javaImport += 'import java.util.List;\n\n';
    // 注释
    javaClass += '/**' + '\n';
    javaClass += ' * ' + tbComment + ' Mapper\n';
    javaClass += ' */' + '\n';
    // 类名
    javaClass += 'public interface ' + className + 'Mapper {\n\n';

    // 新增
    method += '    /**' + '\n';
    method += '     * 新增 ' + tbComment + '\n';
    method += '     * @param ' + Util.dbToCamelCaseFormat(tbName) + '\n';
    method += '     * @return 成功数量\n';
    method += '     */' + '\n';
    method += '    public int insert' + className + '(' + className + ' ' + Util.dbToCamelCaseFormat(tbName) + ');\n\n';
    // 删除
    method += '    /**' + '\n';
    method += '     * 删除 ' + tbComment + '\n';
    method += '     * @param id ' + tbComment + 'ID\n';
    method += '     * @return 成功数量\n';
    method += '     */' + '\n';
    method += '    public int delete' + className + 'ById(String id);\n\n';
    // 修改
    method += '    /**' + '\n';
    method += '     * 修改 ' + tbComment + '\n';
    method += '     * @param ' + Util.dbToCamelCaseFormat(tbName) + '\n';
    method += '     * @return 成功数量\n';
    method += '     */' + '\n';
    method += '    public int update' + className + '(' + className + ' ' + Util.dbToCamelCaseFormat(tbName) + ');\n\n';
    // 查询
    method += '    /**' + '\n';
    method += '     * 查询 ' + tbComment + '\n';
    method += '     * @param ' + Util.dbToCamelCaseFormat(tbName) + '\n';
    method += '     * @return ' + tbComment + '集合\n';
    method += '     */' + '\n';
    method += '    public List<' + className + '> select' + className + '(' + className + ' ' + Util.dbToCamelCaseFormat(tbName) + ');\n\n';

    javaClass += method;
    javaClass += '}\n\n';

    resultFile = javaPackage + javaImport + javaClass;
    // 拼接完成后回调 准备生成 java文件
    callback(null, 'localWriteFile', outputFilePath, className + 'Mapper.java', resultFile);
}

module.exports = Mapper;