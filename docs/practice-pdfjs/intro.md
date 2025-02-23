---
sidebar_position: 1
---

# PDF.js 的上手

PDF.js 是前端展示 PDF 文件非常常用的工具库。可是它的文档写的过于简单，很难直接进行参考。本系列文章就来把我学习了解到的 API 的使用方法罗列出来。

要注意的是，PDF.js 更多用于展示 PDF，如果是需要进行创建、编辑 PDF，则需要考虑使用 [`pdf-lib`](https://pdf-lib.js.org/) 这个库。

## 安装

* 方法一，直接下载资源包。访问 [官方文档的起始页](https://mozilla.github.io/pdf.js/getting_started/)，找到 Download 部分进行下载。
* 方法二，使用 CDN 方式引入。因为国内的 CDN 只能提供 js 文件，不提供字体文件，会导致部分 PDF 功能异常。使用这种方式，还需要自备字体文件等，比较麻烦。我不推荐这种方式。
* 方法三，使用 `npm` 安装，`npm i pdfjs-dist` 即可。此方法也需要自备字体文件等，暂时还没能解决直接引用 `npm` 包中的文件。

需要注意的是，本系列撰写时的最新版 V4 只提供 `mjs` 格式的文件（浏览器需要支持模块引入），要想使用 `js` 格式，需要下载 V2 版本。

如果需要下载其他版本，可以访问 [GitHub 上 pdf.js 的 tag 页面](https://github.com/mozilla/pdf.js/tags) 查找并下载。

本系列撰写，按照 V4 版本 API 来实现，其他版本估计大同小异，请参考对应官方文档。

## 注意

由于 `PDF.js` 需要加载一些资源，故需要启动一个服务来访问对应的页面，而不是直接双击 `index.html` 打开页面文件。

我使用的是 `WebStorm`，可以自动创建一个 `localhost:63342/pdfjs-demo` 服务。后续代码中的路径等，需要与你的服务相匹配。后续我使用本地资源包形式来做说明。

资源要全部引入，否则可能因为缺少字体导致解析的数据有缺失。下面的例子中，不导入字体等文件依然可以正常运行，因为仅仅是加载 PDF，还没有做其他复杂操作。

资源包方式下载和 npm 方式获取的包，目录结构是有差异的，注意关注你选用方式的路径。

## 使用

下面两种方案，都是实现读取 PDF，并获取页数。

### 本地资源包形式

需要先到 [官方文档的起始页](https://mozilla.github.io/pdf.js/getting_started/) 下载好资源包，再创建如下 `index.html` 文件。

```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>PDF</title>
    <script type="module" src="./pdfjs-4.3.136-dist/build/pdf.mjs"></script>
</head>
<body>
<script>
    document.addEventListener('DOMContentLoaded', () => {
        main()
    })

    function main() {
        pdfjsLib.GlobalWorkerOptions.workerSrc = './pdfjs-4.3.136-dist/build/pdf.worker.mjs'
        const pdfDocumentLoadingTask = pdfjsLib.getDocument({
            url: './demo.pdf',
            cMapUrl: './pdfjs-4.3.136-dist/web/cmaps/',
            cMapPacked: true,
            standardFontDataUrl: './pdfjs-4.3.136-dist/web/standard_fonts/',
        })
        pdfDocumentLoadingTask.promise.then(pdfDocumentProxy => {
            console.log('pdf page count:', pdfDocumentProxy.numPages)
        })
    }
</script>
</body>
</html>


```

访问后，日志中展示了解析后的页数数据。

### npm 包形式

```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>PDF</title>
</head>
<body>
<script src="./dist.js"></script>
</body>
</html>
```

```js
import {getDocument, GlobalWorkerOptions} from 'pdfjs-dist'

const PDF_URL = './demo.pdf'
const PDF_WORKER_PATH = '/pdfjs-demo/npm/pdfjs/pdf.worker.mjs'
const PDF_CMAP_PATH = '/pdfjs-demo/npm/pdfjs/cmaps/'
const PDF_STANDARD_FONT_PATH = '/pdfjs-demo/npm/pdfjs/standard_fonts/'

// 设置 workerSrc 的路径
GlobalWorkerOptions.workerSrc = PDF_WORKER_PATH

const pdfDocumentLoadingTask = getDocument({
  url: PDF_URL,
  cMapUrl: PDF_CMAP_PATH,
  cMapPacked: true,
  standardFontDataUrl: PDF_STANDARD_FONT_PATH
})

pdfDocumentLoadingTask.promise.then(pdfDocumentProxy => {
  console.log('pdf page count:', pdfDocumentProxy.numPages)
})
```

同样的，访问后，日志中展示了解析后的页数数据。
