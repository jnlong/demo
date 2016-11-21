var reptile = require('./lib/reptile-api.js');
log4js.configure('./config/log4js.json');

// 爬取nodejs官网api
/* reptile({
    curPath: 'http://nodejs.cn/doc/node',
    fileName: 'index.html',
    menuFilter: '#column2 ul a',
    path: __dirname + '\\out\\'
});
*/

// 爬取mdn 官网api
reptile({
    curPath: 'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript',
    menuFilter: '#quick-links ol a',
    path: __dirname + '\\mdn-js\\'
});
