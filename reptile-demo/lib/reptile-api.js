var fs = require('fs');
var fse = require('fs-extra');
var request = require('request');
var cheerio = require('cheerio');
var url = require("url");
var log4js = require('log4js');
var log = log4js.getLogger("reptile");

//已加载的静态文件列表
var stalist = []; 
var staInfo = {};
//全局变量列表
var cg = {
    fileName: 'index.html',
    level: 2,
}; 

function setData(op) {
    var curPath = op.curPath;
    op.fileName = op.fileName || '';
    var fileName = op.fileName || cg.fileName;
    var path = op.path;
    var urlParse = url.parse(curPath);
    cg.link = curPath + '/' + op.fileName;
    cg.host = urlParse.protocol + '//' + urlParse.host;
    cg.curPath = curPath;
    cg.path = path;
    cg.menuFilter = op.menuFilter;
    fse.mkdirs(path, function(err) {
        if (err) return log(err);
        getHtml(cg.link, fileName, 1);
    });
}

function getHtml(link, fileName, level) {
    log.info(link)
    request(link, function(error, res, body) {
        if (!error && res.statusCode == 200) {
            // 下载首页html文件
            let $ = cheerio.load(body);
            // 处理子页面
            level <= cg.level && $(cg.menuFilter).each(function(i, elem) {
                var src = $(this).attr('href');
                var pos = src.lastIndexOf('/') === -1 ? 0 : (src.lastIndexOf('/') + 1);
                var newSrc = src.slice(pos);
                var hasHttp = /^(http:|https:|\/\/)/.test(src);
                if (!hasHttp) {
                    src = (src.charAt(0) === '/' ? cg.host : (cg.curPath + '/')) + src;
                }
                $(this).attr('href', newSrc);
                getHtml(src, newSrc, level +1);
            });
            // 下载首页静态文件
            getStaticOne('script', fileName, $);
            getStaticOne('css', fileName, $);
            fs.writeFileSync(cg.path + fileName, $.html());
        }
    });
}

function parseSrc(tag, i, prop, fileName) {
    var src = tag.attr(prop);
    var pos = src.lastIndexOf('/') === -1 ? 0 : (src.lastIndexOf('/') + 1);
    var newSrc = fileName + '_' + i + '_' + src.slice(pos);
    var hasHttp = /^(http:|https:|\/\/)/.test(src);
    var hasSrc = false;
    if (!hasHttp) {
        src = (src.charAt(0) === '/' ? cg.host : (cg.curPath + '/')) + src;
    }
    if(/^\/\//.test(src)){
    	src = 'http:' + src;
    }
    if (stalist.indexOf(src) === -1) {
        tag.attr(prop, newSrc);
        stalist.push(src);
        staInfo[src] = newSrc;
        log.debug(src);
    } else {
        tag.attr(prop, staInfo[src]);
        hasSrc = true;
    }
    return { src: src, newSrc: newSrc, hasSrc: hasSrc };
}

function getStaticOne(type, fileName, $) {
    fileName = fileName.replace('.html', '');
    var sel = type === 'css' ? 'link[rel="stylesheet"]' : 'script[src]';
    $(sel).each(function(i, elem) {
        var prop = type === 'css' ? 'href' : 'src';
        var res = parseSrc($(this), i, prop, fileName);
        var newSrc = res.newSrc;
        src = res.src;
        // 静态文件做排重处理
        if (!res.hasSrc) {
            (function(srcTmp, newSrcTmp) {
                request(srcTmp, function(error, res, body) {
                    if (!error && res.statusCode == 200) {
                        fs.writeFileSync(cg.path + newSrcTmp, body);
                    }
                })
            })(src, newSrc)
        }
    });
}

module.exports = setData;
