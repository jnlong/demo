// less转换
fis.match('*.less', {
    parser: fis.plugin('less'),
    rExt: '.css'
});

// sass转换
fis.match('**/*.scss', {
    rExt: '.css',
    parser: fis.plugin('sass')
});

// 启用 es6-babel 插件，解析 .es6 后缀为 .js
// npm install -g fis-parser-es6-babel
fis.match('*.es6', {
  rExt: '.js',
  parser: fis.plugin('es6-babel')
});
