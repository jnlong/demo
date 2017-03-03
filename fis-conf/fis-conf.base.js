// 设置命名空间，引用时使用，如require('home:static/index.js')
fis.config.set('namespace', 'home');

// 设置不发布的文件
fis.match('{node_modules,doc,mock}/**', {
	release: false 
});

// 代码校验eslint
// npm install fis-lint-eslint
var eslintConf = {
    ignoreFiles: ['static/common/**.js', 'js-conf.js'],
    envs: ['browser', 'node'],
    globals: ['$', 'Zepto'],
    rules: {
        'semi': [0],
        'no-undef': [1],
        'no-use-before-define': [0],
        'no-unused-vars': [0],
        'no-eval': [0],
        'use-isnan': [2],
        'valid-typeof': [2],
        'no-unreachable': [1],
        'no-dupe-args': [1],
        'no-dupe-keys': [1]
    }
};
fis.match('**.js', {
    lint: fis.plugin('eslint', eslintConf)
});