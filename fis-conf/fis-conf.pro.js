// 压缩
fis.match('*.css', {
    optimizer: fis.plugin('clean-css')
});
fis.match('*.js', {
    optimizer: fis.plugin('uglify-js')
});
fis.match('*.png', {
    optimizer: fis.plugin('png-compressor', {
        type: 'pngquant'
    })
});
// npm i fis-optimizer-html-minifier
fis.match('*.html', {
  optimizer: fis.plugin('html-minifier')
});

// 打包
fis.match('*.js', {
    packTo: '/static/aio.js'
});

// 设置CDN
fis.match('*.{js,css,jpg,jpeg,png,gif}', {
    useHash: true,
    domain: 'http://cdn.xxx.com'
});

// 发布到生产环境
fis.media('prod').match('*', {
    optimizer: null,
    domain: '',
    deploy: fis.plugin('http-push', {
        receiver: 'http://127.0.0.1:8089/upload',
        to: '/home/work/'
    })
});