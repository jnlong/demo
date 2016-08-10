var reptile = require('./lib/reptile-api.js');
var log4js = require('log4js');
log4js.configure('./config/log4js.json');

reptile({ curPath: 'http://nodejs.cn/doc/node', fileName: 'index.html', menuFilter: '#column2 ul a', path: __dirname + '\\out\\' });
