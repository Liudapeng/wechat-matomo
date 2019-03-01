
# wechat-matomo

[![npm](https://img.shields.io/npm/v/wechat-matomo.svg)](https://www.npmjs.com/package/wechat-matomo)

Link your Piwik/Matomo installation

## Installation

```bash
npm install --save wechat-matomo
```

## Usage

### init

```js

/**
 * 注意初始化动作需要再 app class 执行之前初始化，否则无法自动追踪App生命周期事件
 *    trackerApiUrl:
 *      生产：待定
 *      测试：http://172.18.62.201:7080/piwik.php
 *    siteId:
 *      生产：待定，每个应用申请一个
 *      测试：1
 */
app.js

import mamoto from 'wechat-matomo'
const pageTitles = { // 页面标题翻译
  'pages/home/index': '页面标题1111',
  'pages/reduceActivity/index': '页面标题2222',
   ……
}
matomo.initTracker(reportUrl, siteId, { pageTitles })

export default class extends wepy.app {
  config = {
    pages: [
      'pages/home/index',
```

### through

```js
/**
 * 用户绑定
 * eg:
 *  this.$parent.$wxapp.matomo.setUserId(11123)
 */
this.$parent.$wxapp.matomo.setUserId(userId or email)

/**
 * 用户解绑, 小程序一般不需要
 * eg:
 *  this.$parent.$wxapp.matomo.resetUserId()
 */
this.$parent.$wxapp.matomo.resetUserId()  

/**
 * 自定义事件追踪
 * eg:
 *  this.$parent.$wxapp.matomo.trackEvent('Share', '商品分享', '商品名称', 1)
 * category: 事件分类
 * action: 动作
 * name: 具体目标名称， 非必填
 * num: 事件动作的数值型参数，非必填，数值类型
 */
this.$parent.$wxapp.matomo.trackEvent('category', 'action', 'name', num)

/**
 * 自定义页面追踪
 * 小程序会通过page.onLoad自动追踪页面事件
 * eg:
 *  this.matomo.setCustomUrl(this.$parent.$wxapp.matomo.pageScheme + this.route + '?' + serialiseObject(options))
 *  this.matomo.trackPageView('直播页')
 * customUrl: 自定义页面链接，注意格式需要指定scheme前缀，比如 mp://xxxx/xxxx/xxxx
 * pageTile: 页面的Title
 */
this.$parent.$wxapp.matomo.setCustomUrl(customUrl)
this.$parent.$wxapp.matomo.trackPageView(pageTile)

```

For available operations see the [matomo api docs](https://developer.matomo.org/api-reference/tracking-javascript)

## License

[MIT](http://opensource.org/licenses/MIT)
