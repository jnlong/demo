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
    allInOne: {
      js: function (file) {
        return "/static/js/" + file.filename + "_aio.js";
      },
      css: function (file) {
        return "/static/css/" + file.filename + "_aio.css";
      }
    }
  })
});
// fis.match('*.tpl', {
//   loaderLang: false
// });
// fis.match('::package', {
//   packager: fis.plugin('map', {
//     'static/lib_$0.js': '/client/static/lib/**/(*.js)',
//     'static/css/comm.css': '/client/static/comm/**.css',
//     'static/icon.css': '/client/static/comm/icon.css',
//   })
// })

//压缩
// 设置CDN
fis.match('*.{js,css,jpg,jpeg,png,gif}', {
    useHash: true,
    domain: 'http://s0.m.hao123img.com'
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
//prod
fis.media('prod').match('*', {
    optimizer: null,
    domain: '',
    deploy: fis.plugin('http-push', {
        receiver: 'http://127.0.0.1:8089/yog/upload',
        to: '/'
    })
});