#前端demo

## 表单验证demo
今天写一个H5活动，用到了表单验证。 研究了一下jqueryValidate，这个插件是否强大。 看了下菜鸟教程的介绍，总结的很详细，但是写的比较分散，所以还是通读了jqueryValidate源码才看懂自己需要的各个参数的含义和调用方法。 菜鸟教程jQuery Validate：http://www.runoob.com/jquery/jquery-plugin-validate.html 我总结了常用的方法和流程，写成了一个demo。 下面我把我写的demo贴上，方便大家参考使用.

## nodejs demo reptile-api:爬取网页到本地
从nodejs官网爬取api到本地。测试路径：http://nodejs.cn/doc/node/index.html

### 操作步骤
* 下载本代码到本地 git clone https://github.com/jnlong/demo.git
* 安装依赖, 在package.json所在路径执行 npm install
* 爬取网页 执行 node reptile-demo.js

### 功能描述
* 格式化静态文件路径, 下载到本地：
根目录，如 /jquery.js, 格式化全路径为 http://nodejs.cn/jquery.js
当前目录，如 main.js, 格式化全路径为 http://nodejs.cn/doc/node/main.js
外部链接，如http://hm.baidu.com/hm.js，不作处理，直接下载

* 静态文件命名，为了避免重名，命名格式为：当前html名称_静态文件索引_静态文件名称，如 index_0_main.js

* 静态文件排重：
为了避免多次下载同一静态文件，根据静态文件全路径做了排重处理

### 用到的第三方库
log4js： 日志管理
request： http请求管理
cheerio：网页内容管理，支持通过jquery语法对dom进行操作
fs-extro：文件操作，支持readJson，mkdirs等操作
