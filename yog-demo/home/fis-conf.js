/**
 * @file FIS 配置
 * @author
 */

fis.config.set('namespace', 'home');

// chrome下可以安装插件实现livereload功能
// https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei
fis.config.set('livereload.port', 35729);

fis.match('{node_modules,doc,mock}/**', {
    release: false
})
fis.match('package.json', {
    release: false
})
fis.match('/client/**.js', {
    isMod: true
})
fis.match('/client/static/nomod/**.js', {
    isMod: false
})

// 启用npm管理前端组件
fis.enableNPM({
    autoPack: true
});

fis.set('project.fileType.text', 'es');
fis.match('*.{js,es}', {
    parser: fis.plugin('babel-5.x', {
        blacklist: ['regenerator'],
        stage: 3
    }),
    rExt: 'js',
    useHash: true,
});

if (fis.IS_FIS3) {
    fis.media('debug').match('*', {
        optimizer: null,
        useHash: false,
        deploy: fis.plugin('http-push', {
            receiver: 'http://127.0.0.1:8089/yog/upload',
            to: '/'
        })
    });
    fis.media('debug-prod').match('*', {
        deploy: fis.plugin('http-push', {
            receiver: 'http://127.0.0.1:8089/yog/upload',
            to: '/'
        })
    });
}
else {
    fis.config.set('deploy', {
        debug: {
            to: '/',
            // yog2 默认的部署入口，使用调试模式启动 yog2 项目后，这个入口就会生效。IP与端口请根据实际情况调整。
            receiver: 'http://127.0.0.1:8085/yog/upload'
        }
    });
}
