/*
 * @author zxl
 * @date 2017-01-13
 * @file 从txt文件中读取数据，转换成数组格式，然后向cms中追加数据
 */
var fs = require('fs');
var path = require('path');
var resArr = [];
var obj;
var list = {
    title: '应用名称',
    app_file_size: 'apk大小',
    download_url: 'apk下载地址',
    des: '描述',
    type: '应用类型',
    icon: 'icon地址',
    images: '截图地址',
    // 没有数据的key
    category: '',
    color: '',
    description: '应用简介',
    downnum: '下载数量',
    more: '更多',
    num: '',
    pos: '',
    style: '',
    url: '',
};
var listDef = {
    category: 'cms'
};

init('D:\\data\\cmsGame', 'game.js');

function init(filePath, newFileName) {
    var files = fs.readdirSync(filePath);
    for (var i in files) {
        var file = path.join(filePath, files[i]);
        var data = fs.readFileSync(file, 'utf8');
        getJson(data);
    }
    log(resArr);
    fs.writeFile(newFileName, JSON.stringify(resArr));
}

function log(m) {
    console.log(m);
}

function getJson(data) {
    var arr = data.replace(/(\r|\n)/g, '').split('@');
    obj = {};
    for (var i = 0; i < arr.length; i++) {
        var cur = arr[i];
        for (j in list) {
            if (!list[j]) {
                obj[j] = listDef[j] || '';
            } else if (cur.indexOf(list[j]) != -1) {
                obj[j] = cur.replace(list[j] + '|', '');
            }
        }
    }
    log(obj)
    resArr.push(obj);
}
