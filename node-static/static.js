/* 
 * @file 静态资源管理
 * @auther zxl
 * @date 2016-10-12
 */
var path = require('path');
var fs = require('fs');
var http = require('http');
var url = require('url');
var mime = require('./mime');
var config = require("./config");
var utils = require("./utils");
var comm = require("./comm");

var port = 8011;

var server = http.createServer(function (req, res) {
    var pathname = url.parse(req.url).pathname;
    var realpath = path.join('E:\\code\\server', pathname);
    console.log(realpath);
    var ext = path.extname(realpath);
    ext = ext ? ext.slice(1) : undefined;
    var contentType = mime[ext] || "text/plain";
    fs.exists(realpath, function (exists) {
        if (!exists) {
            res.writeHead(404, {
                'Content-Type': 'text/plain'
            });

            res.write("This req URL " + pathname + "was not found on this server");
            res.end();
        } else if (!ext) {
            var fileArr = [];
            var files = fs.readdirSync(realpath);
            files.forEach(function(v,i){
                files[i] = path.join(pathname, files[i]);
            })
            var data = {path: pathname, title: pathname, data: files};
            var html = comm.getHtml('./index.html', data);

            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(html);
            res.end();
        } else {
            res.setHeader("Content-Type", contentType);
            var stats = fs.statSync(realpath);
            if (req.headers["range"]) {
                // console.log(req.headers["range"]);
                var range = utils.parseRange(req.headers["range"], stats.size);
                // console.log(range);
                if (range) {
                    res.setHeader("Content-Range", "bytes " + range.start + "-" + range.end + "/" + stats.size);
                    res.setHeader("Content-Length", (range.end - range.start + 1));
                    var stream = fs.createReadStream(realpath, {
                        "start": range.start,
                        "end": range.end
                    });

                    res.writeHead('206', "Partial Content");
                    stream.pipe(res);
                } else {
                    res.removeHeader("Content-Length");
                    res.writeHead(416, "req Range Not Satisfiable");
                    res.end();
                }
            } else {
                var stream = fs.createReadStream(realpath);
                res.writeHead('200', "Partial Content");
                stream.pipe(res);
            }

        }
    })
});

server.listen(port);
