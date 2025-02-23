---
sidebar_position: 2
---

# API 全览

官方文档 API 地址见此： [https://mozilla.github.io/pdf.js/api/](https://mozilla.github.io/pdf.js/api/)

亦可自行点击 API 地址中的 `source` 地址。

本文主要参考了 GitHub 4.3.136 源码中 API.js 文件。[https://github.com/mozilla/pdf.js/blob/v4.3.136/src/display/api.js](https://github.com/mozilla/pdf.js/blob/v4.3.136/src/display/api.js)

## pdfjsLib

| API                      | 描述                                    |
|--------------------------|---------------------------------------|
| `pdfjsLib.version`       | 返回当前 pdf.js 的版本                       |
| `pdfjsLib.build`         | 返回当前 pdf.js 的构建版本 git 提交 hash 值       |
| `pdfjsLib.isPdfFile()`   | 返回指定文件是否是 PDF 文件                      |
| `pdfjsLib.getDocument()` | 加载 PDF 文档，返回 `PDFDocumentLoadingTask` |

## PDFDocumentLoadingTask

| API                                 | 描述                                 |
|-------------------------------------|------------------------------------|
| `pdfDocumentLoadingTask.docId`      | 返回 PDF 文档的 id 号                    |
| `pdfDocumentLoadingTask.promise`    | 获取 PDF 文档的内容，返回 `PDFDocumentProxy` |
| `pdfDocumentLoadingTask.onProgress` | 监听加载进度                             |
| `pdfDocumentLoadingTask.destroy()`  | 取消当前加载任务                           |

## PDFDocumentProxy

| API                                           | 描述                              |
|-----------------------------------------------|---------------------------------|
| `pdfDocumentProxy.annotationStorage`          | 读取/写入临时注释                       |
| `pdfDocumentProxy.filterFactory`              | 过滤工厂实例，可以追加各种过滤器                |
| `pdfDocumentProxy.numPages`                   | 获取 PDF 总页数                      |
| `pdfDocumentProxy.loadingTask`                | 获取用于加载 PDF 文档对象                 |
| `pdfDocumentProxy.fingerprints`               | 获取 PDF 的指纹                      |
| `pdfDocumentProxy.isPureXfa`                  | 获取 PDF 文档是否为 纯 XFA 文档           |
| `pdfDocumentProxy.allXfaHtml()`               | 获取纯 XFA 的 PDF 文档的 HTML 数据       |
| `pdfDocumentProxy.getPage()`                  | 获取 PDF 指定页面内容，返回 `PDFPageProxy` |
| `pdfDocumentProxy.getPageIndex()`             | 通过页面 ref 获取当前页码                 |
| `pdfDocumentProxy.getDestinations()`          | 获取 PDF 中所有命名目标                  |
| `pdfDocumentProxy.getDestination()`           | 获取 PDF 中指定页码的命名目标               |
| `pdfDocumentProxy.getPageLabels()`            | 获取 PDF 文档中每一页的标签                |
| `pdfDocumentProxy.getPageLayout()`            | 获取 PDF 文档的布局方式                  |
| `pdfDocumentProxy.getPageMode()`              | 获取 PDF 文档的页面模式                  |
| `pdfDocumentProxy.getViewerPreferences()`     | 获取 PDF 文档中定义的查看器偏好设置            |
| `pdfDocumentProxy.getOpenAction()`            |                                 |
| `pdfDocumentProxy.getAttachments()`           | 获取 PDF 文档中的附件                   |
| `pdfDocumentProxy.getJSActions()`             |                                 |
| `pdfDocumentProxy.getOutline()`               |                                 |
| `pdfDocumentProxy.getOptionalContentConfig()` |                                 |
| `pdfDocumentProxy.getPermissions()`           |                                 |
| `pdfDocumentProxy.getMetadata()`              | 获取 PDF 文档的元信息                   |
| `pdfDocumentProxy.getMarkInfo()`              |                                 |
| `pdfDocumentProxy.getData()`                  | 获取 PDF 原文档的 Unit8Array 格式数据     |
| `pdfDocumentProxy.saveDocument()`             | 获取 PDF 修改后的 Unit8Array 格式数据     |
| `pdfDocumentProxy.getDownloadInfo()`          | 获取 PDF 原文档的长度大小                 |
| `pdfDocumentProxy.cleanup()`                  |                                 |
| `pdfDocumentProxy.destroy()`                  |                                 |
| `pdfDocumentProxy.cachedPageNumber()`         |                                 |
| `pdfDocumentProxy.loadingParams`              |                                 |
| `pdfDocumentProxy.getFieldObjects()`          |                                 |
| `pdfDocumentProxy.hasJSActions()`             |                                 |
| `pdfDocumentProxy.getCalculationOrderIds()`   |                                 |

## PDFPageProxy

| API                                | 描述                     |
|------------------------------------|------------------------|
| `pdfPageProxy.pageNumber`          | 获取当前页码，从 `1` 开始        |
| `pdfPageProxy.rotate`              | 获取当前页面旋转角度             |
| `pdfPageProxy.ref`                 |                        |
| `pdfPageProxy.userUnit`            |                        |
| `pdfPageProxy.view`                |                        |
| `pdfPageProxy.getViewport()`       | 获取 PDF 当前页面的页面视窗       |
| `pdfPageProxy.getAnnotations()`    |                        |
| `pdfPageProxy.getJSActions()`      |                        |
| `pdfPageProxy.filterFactory`       |                        |
| `pdfPageProxy.isPureXfa`           |                        |
| `pdfPageProxy.getXfa`              |                        |
| `pdfPageProxy.render()`            | 将 PDF 视窗内容渲染到 canvas 上 |
| `pdfPageProxy.getOperatorList()`   |                        |
| `pdfPageProxy.streamTextContent()` |                        |
| `pdfPageProxy.getTextContent()`    |                        |
| `pdfPageProxy.getStructTree()`     |                        |
| `pdfPageProxy.cleanup()`           |                        |
| `pdfPageProxy.stats`               |                        |
