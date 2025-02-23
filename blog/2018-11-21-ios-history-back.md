---
title: iOS safari 后退 js 不执行的问题
date: 2018-11-21 21:36:00 GMT+0800
tags: [ ios, safari, history, 后退 ]
---

今天偶遇一个问题：iOS 10 safari 浏览器中，后退后，页面 js 没有运行。

之前也遇到过这个问题，因为加入风控的代码，就好了。就没有深究。这次发现，风控的代码不好使了😂。也可能是这次 iOS 版本问题，之前没有测试过 iOS 10 系统。

<!-- truncate -->

网上搜索之，整理方案如下：

```js
window.onpageshow = function (e) {
  var isIos = function () {
    var ua = window.navigator.userAgent
    return /iphone|ipad|ipod/i.test(ua)
  }
  if (isIos() && e.persisted) {
    window.location.reload(true)
  }
}
```

简单来说，通过监听 `pageshow` 事件，判断 `event.persisted` 当前页面是否是读取缓存，来决定是否进行刷新。上面代码放置在公共 js 里，全站后退问题均可解决。

不过这样做有个小问题，页面先进行了后退，显示了历史数据，然后 js 执行了页面刷新，看到了浏览器进度条。由于服务器及网络原因，需要几秒时间。

这个刷新动作能不能优化呢？我认为还是有空间的。比如有的页面，明确就是需要刷新某一个接口数据即可。

那么我们可以对其进行调整，比如执行全局方法 `historyBack`，根据返回值来决定是否进行全页面刷新。

```js
// 全局代码
window.onpageshow = function (e) {
  var isIos = function () {
    var ua = window.navigator.userAgent
    return /iphone|ipad|ipod/i.test(ua)
  }
  if (isIos() && e.persisted) {
    var cb = window.historyBack
    if (typeof cb === 'function') {
      if (cb()) {
        window.location.reload(true)
      }
    } else {
      window.location.reload(true)
    }
  }
}
```

```js
// 页面代码
var page = {
  getData: function () {
    ajax().then(function (json) {
      this.render(json)
    })
  },
  render: function () {
  },
  init: function () {
    this.getData()
  }
}
page.init()

window.historyBack = function () {
  page.getData()
  return false // 阻止全局刷新
}
```

这样是我目前能想到的比较好的处理方法。可以全局配置默认强制刷新代码，每个页面也支持自定义刷新方案。代码量还不算太多。
