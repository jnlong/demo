// 开启模块化开发
// npm install fis3-postpackager-loader
// fis.hook('module');
fis.match('*.es6', {
  isMod: true
});
fis.match('::package', {
    // 分析 __RESOURCE_MAP__ 结构，来解决资源加载问题
    postpackager: fis.plugin('loader', {
        // resourceType: 'commonJs',
        useInlineMap: true // 资源映射表内嵌
    })
});

// 启用npm管理前端组件,支持直接require npm安装的包，如require('vue')
// fis.enableNPM({
// 	autoPack: true
// });

// 启用同名依赖 useSameNameRequire: true,

/* 像webpack那样开发
	https://www.npmjs.com/package/fis3-hook-node_modules
	通过这个插件, fis3已经完整实现通过 require语法加载node_modules, css, js, image等资源文件, 并支持整个npm生态圈

	需要的插件
	fis3-hook-node_modules
	fis3-hook-commonjs
	fis3-preprocessor-js-require-css
	fis3-preprocessor-js-require-file
*/

// 添加css和image加载支持
fis.match('*.{js,jsx,ts,tsx,es}', {
    preprocessor: [
      fis.plugin('js-require-css'),
      fis.plugin('js-require-file', {
        useEmbedWhenSizeLessThan: 10 * 1024 // 小于10k用base64
      })
    ]
})

// npm install fis3-hook-node_modules -g
// ignoreDependencies 默认为空，用来忽略掉对某些资源 require，一般用来忽略掉内部实现的 require 资源。
fis.hook('commonjs', {
    extList: ['.js', '.jsx', '.es', '.ts', '.tsx'],
    ignoreDependencies: [
		'angular2/**',
	]
});

fis.match('/node_modules/**.js', {
    isMod: true,
    useSameNameRequire: true
});

// 禁用components
fis.unhook('components')
fis.hook('node_modules')

fis.match('/client/index.jsx', {
  isMod: false
})