fis.config.set('namespace', 'home');
fis.config.set('livereload.port', 35729);

fis.match('{node_modules,doc,mock}/**', {release: false })
fis.match('/client/**.js', {isMod: true })
fis.match('/client/static/lib/nomod/**.js', {isMod: false });

fis.enableNPM({autoPack: true });// 启用npm管理前端组件

fis.set('project.fileType.text', 'es');
fis.match('*.{js,es}', {
    parser: fis.plugin('babel-5.x', {
        blacklist: ['regenerator'],
        stage: 3
    }),
    rExt: 'js',
    useHash: true,
});

//合并
fis.match('::package', {
  postpackager: fis.plugin('loader', {
    allInOne: true
  })
});
fis.match('::package', {
  packager: fis.plugin('map', {
    '/client/static/lib/**/(*).js': '/client/static/$0.js',
    '/client/static/comm/**/(*).css': '/client/static/comm.css',
    '/client/static/comm/icon.css': '/client/static/icon.css',
  })
})

//压缩
// 设置CDN
fis.match('*.{js,css,jpg,jpeg,png,gif}', {
    useHash: true,
    domain: 'http://s0.m.hao123img.com'
});

// less
fis.match('*.less', {
    parser: fis.plugin('less'),
    // .less 文件后缀构建后被改成 .css 文件
    rExt: '.css',
    optimizer: fis.plugin('clean-css')
});

// CSS
fis.match('*.css', {
    // 压缩css
    optimizer: fis.plugin('clean-css')
});

fis.match('*.png', {
    // 压缩PNG
    optimizer: fis.plugin('png-compressor', {
        type: 'pngquant'
    })
});

// js
fis.match('*.js', {
    // 压缩JS
    optimizer: fis.plugin('uglify-js')
});

//debug
fis.media('zxl').match('*', {
    useHash: false,
    useSprite: false,
    optimizer: null,
    domain: '',
    deploy: fis.plugin('http-push', {
        receiver: 'http://127.0.0.1:8089/yog/upload',
        to: '/'
    })
});