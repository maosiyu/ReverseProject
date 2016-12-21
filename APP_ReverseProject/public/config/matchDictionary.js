/**
 * Created by mao-siyu on 16-11-18.
 * 数据库类型 匹配字典
 */
var dictionary = {
    'varchar': 'String',
    'char': 'char',
    'blob': 'byte[]',
    'text': 'String',
    'longtext': 'String',
    'integer': 'Integer',
    'int': 'Integer',
    'tinyint': 'Boolean',
    'smallint': 'Short',
    'mediumint': 'Integer',
    'bit': 'Boolean',
    'bigint': 'BigInteger',
    'float': 'Float',
    'double': 'Double',
    'decimal': 'BigDecimal',
    'boolean': 'Boolean',
    'date': 'Date',
    'time': 'Date',
    'datetime': 'Date',
    'timestamp': 'Timestamp',
    'year': 'Date',
    'enum': 'String'
};
var Dictionary = function () {
};

Dictionary.match = function (key) {
    return dictionary[key];
};
module.exports = Dictionary;





















