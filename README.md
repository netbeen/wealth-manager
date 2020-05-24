# wealth-manager

Statistics for foundation investment.

## QuickStart

<!-- add docs here for user -->

see [egg docs][egg] for more detail.

### Development

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```


### Deploy

```bash
$ npm start
$ npm stop
```

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.
- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.


### Release Note

-4.0 开发中
    - 技术栈：Node.js、React、Typescript
    - 框架/库：Midway、Sequelize、React Router、AISC、G2
    - 新功能/改进点：
        1. 使用Midway框架，引入TypeScript进行强类型约束
        2. 面向Serverless架构改造，使之可以运行在FaaS平台上

- 3.0 开发于 2019-01-20 [项目地址](https://github.com/netbeen/wealth-manager)
    - 技术栈：Node.js、React
    - 框架/库：Egg、Sequelize、React Router、AISC、G2
    - 新功能/改进点：
        1. 用React组件库重写UI，提升美观度
        2. 用egg重写后端逻辑，提高可维护性
        3. 支持web端CRUD，支持多用户使用
        4. 全站SPA+PWA实践，提升性能
        5. Docker化部署
    - 预览：
        - ![v3预览图](https://raw.githubusercontent.com/netbeen/wealth-manager/master/readme/v3.png)


- 2.0 发布于 2016-09-30 [项目地址](https://github.com/netbeen/FundManagerWeb)
    - 技术栈：Node.js、JavaScript
    - 框架/库：Express、Bootstrap、jQuery、ECharts
    - 新功能/改进点：
        1. 由单机爬虫的形式转型为Web站点
        2. 后台数据由配置文件转为DB存储
        3. 新增财富大图功能
        4. 新增自动化监控，实现止盈点邮件通知
    - 预览：
        - ![v2预览图](https://raw.githubusercontent.com/netbeen/wealth-manager/master/readme/v2.png)


- 1.0 发布于 2016-01-12 [项目地址](https://github.com/netbeen/FundManager)
    - 技术栈：Python、JavaScript
    - 框架/库： ECharts
    - 主要功能：
        1. 使用`urllib`抓取基金净值
        2. 根据持仓信息计算年化收益
        3. 使用`ECharts`绘制可视化趋势图
    - 预览：
        - ![v1预览图](https://raw.githubusercontent.com/netbeen/wealth-manager/master/readme/v1.jpg)
