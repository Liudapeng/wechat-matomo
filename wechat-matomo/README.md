
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

app.js

import Matomo from 'wechat-matomo'
matomo.initTracker("https://hostname/piwik.php", siteId)
 

export default class extends wepy.app {
  config = {
    pages: [
      'pages/home/index',

// through
this.$parent.$wxapp.matomo.trackEvent('category', 'action', 'name', 'value') 

```

For available operations see the [matomo api docs](https://developer.matomo.org/api-reference/tracking-javascript)
 
## License

[MIT](http://opensource.org/licenses/MIT)
