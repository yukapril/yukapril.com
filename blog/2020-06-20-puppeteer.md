---
title: puppeteer 安装和启动
date: 2020-06-20 16:30:00 GMT+0800
tags: [ puppeteer, npm ]
---

puppeteer 入门其实挺容易的，但是想安装成功确有难度。自己找了点配置，贴出来算作备份。

<!-- truncate -->

## npm 安装依赖

首先配置 `.npmrc` ，防止依赖和资源无法下载：

```
home=https://npm.taobao.org
registry=https://registry.npm.taobao.org/
sass_binary_site=https://npm.taobao.org/mirrors/node-sass/
phantomjs_cdnurl=http://cnpmjs.org/downloads
electron_mirror=https://npm.taobao.org/mirrors/electron/
sqlite3_binary_host_mirror=https://foxgis.oss-cn-shanghai.aliyuncs.com/
profiler_binary_host_mirror=https://npm.taobao.org/mirrors/node-inspector/
chromedriver_cdnurl=https://cdn.npm.taobao.org/dist/chromedriver
puppeteer_download_host https://npm.taobao.org/mirrors=true
```

之后直接进行常规安装即可：

```bash
npm install puppeteer
```

安装依赖以及安装软件包后，会有以下提示：

```
Downloading Chromium r756035 - 124.1 Mb [====================] 100% 0.0s
Chromium (756035) downloaded to /Users/xxx/Workspace/puppeteer/node_modules/puppeteer/.local-chromium/mac-756035
```

按照你的地址，就可以找到 Chromium 的安装位置了。我习惯把它拷贝到项目里。以后就不用再次下载了。

> 我还听说可以用 cnpm 来安装，但我没用过，可以参考下。
>
> 但单独调整 npm 为国内源（比如使用 nrm），只能解决下载 npm 的问题，依赖的 chromium 还是下载不了。
>
> 所以既要调整 npm 为国内源，还要解决软件包下载的代理。

## 启动

编写一个 `index.js` 文件，注意如果调整过 Chromium 位置，则要进行配置下。

```jsx
const puppeteer = require('puppeteer')
const iPhone6P = puppeteer.devices['iPhone 6 Plus']

const log = (...args) => {
    console.log('[PUPPETEER]', ...args)
  }

;(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'Chromium/Chromium.app/Contents/MacOS/Chromium',
    headless: false,
    devtools: true,
  })

  const version = await browser.version()
  log('Chromium Version:', version)

  // page
  const page0 = await browser.newPage()
  await page0.emulate(iPhone6P)
  await page0.goto('https://m.so.com')
  await page0.type('.search-txt', 'yukapril', {delay: 100})
  await page0.click('.search-btn')
})()
```
