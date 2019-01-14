# static_aisc

## 工程简介

工程/项目的说明

## 开发流程

### 安装依赖

clone代码库后，安装npm依赖：

```
$ tnpm i
```

如果没有node, tnpm等前端环境，可参考[这里](https://lark.alipay.com/yefeng/aone-fullstack/fe_lesson_prepare)安装。


### 开启本地开发环境

执行`fie start`命令即可开启本地开发环境：

```
$ fie start
```

### 使用页面模板新增页面

当要开发一个新页面时，可以根据设计稿选取相近的页面模板，使用`fie add template [templateName] [pageName]`命令基于页面模板添加一个页面。详情可参考[这里](https://lark.alipay.com/yefeng/aone-fullstack/fe_template)。

### node/vm中的资源引用
 
真实环境（node、vm）的html模板可以参考项目根目录下的`index.html`进行配置。

除了固定的aisc、aone-layout、react等依赖，页面需引入3个项目打包资源，即：`[pageName].bundle.css`、`vendor.js`、`[pageName].js`

不同环境下这三个资源的地址也不同，分别为：

- 本地：`http://127.0.0.1:9000/build/[pageName].js`
- 日常：`//g.assets.daily.taobao.net/git-group/git-project/x.y.z/[pageName].js`
- 预发、线上：`//g.alicdn.com/git-group/git-project/x.y.z/[pageName].js`

### 代码编译和打包

开发完成后，执行`fie build`命令进行编译打包：

```
$ fie build
```

### 代码发布


#### 提交代码：

```
$ git add .
$ git commit -m "commit信息"
```

需注意，由于工具链默认开启了eslint卡点，这时如果commit的文件eslint校验不通过，会阻止提交：
![image.png | center | 998x406](https://private-alipayobjects.alipay.com/alipay-rmsdeploy-image/skylark/png/ddce8f47dfda4f5c.png "")

#### 发布日常：

```
$ git push origin daily/x.y.z
```

#### 发布线上：

```
$ git tag publish/x.y.z
$ git push origin publish/x.y.z
```

## 目录结构

```
.
├── build (编译后的文件存放地点，也是cdn实际发布的内容)
├── mock (mock数据目录)
│   └── breadcrumb.json
├── src (源码目录)
│   ├── components (项目级组件存放)
│   │   └── common/index.scss (项目级样式文件)
│   ├── images (图片目录)
│   ├── pages (页面打包入口目录)
│   │   └── index (举例-index页面)
│   │       ├── actions/ (redux actions目录)
│   │       ├── containers/ (redux containers目录)
│   │       ├── reducers/ (redux reducers目录)
│   │       ├── store/ (redux store目录)
│   │       ├── index.jsx (页面打包入口文件)
│   │       └── index.scss (页面级样式文件)
│   └── utils (辅助工具目录)
│       ├── apimap/ (API管理)
│       ├── index.js (一些工具函数)
│       └── locale.json (国际化文件)
├── .babelrc (babel配置文件)
├── .eslintrc (eslint配置文件)
├── fie.config.js (fie配置文件)
├── index.html (前端工程demo html)
├── README.md
├── .gitignore
├── package.json
└── webpack.config.js (webpack配置文件)
```

## Release notes

项目如果有外链的Release notes，可以写在这里。也可以使用gitlab提供的CHANGELOG。


## 相关链接

- [Aone React开发套件详细文档](https://lark.alipay.com/yefeng/aone-fullstack/fe_react#aone-react%E5%BC%80%E5%8F%91%E5%A5%97%E4%BB%B6)
- [Aone UED文档](https://lark.alipay.com/yefeng/aone-fullstack)
- [Aone吊顶文档](https://lark.alipay.com/aonelayout/reworkreadme/corp-setting) 使用问题可咨询绘萌
