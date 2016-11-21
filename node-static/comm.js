var swig  = require('swig');
var path = require('path');

module.exports.getHtml = function(tplName, data){
	var template = swig.compileFile(tplName);
	return template(data);
};

module.exports.pathFormat = function(pathname){
	var realPath = path.join(pathname, '/').replace('\\','/');
	return realPath;
};
