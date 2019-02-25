
# wechat-matomo

[![npm](https://img.shields.io/npm/v/wechat-matomo.svg)](https://www.npmjs.com/package/wechat-matomo) 

Link your Piwik/Matomo installation

## Installation

```bash
npm install --save wechat-matomo
```

## Usage

### Bundler  

```js 
import Matomo from 'wechat-matomo'

app.js

onLaunch() {
    this.globalData.Matomo = Matomo.getTracker('https://hostname/piwik.php', 2)
    this.globalData.Matomo.trackPageView('trackPageView-Launch-Title')
    this.globalData.Matomo.trackEvent('category', 'action', 'name', 'value')
}

// through
var app = getApp();
app.Matomo.trackEvent('category', 'action', 'name', 'value')
```

For available operations see the [matomo api docs](https://developer.matomo.org/api-reference/tracking-javascript)
 
## License

[MIT](http://opensource.org/licenses/MIT)
