---
sidebar_position: 6
---

# PDFPageProxy

## pdfPageProxy.pageNumber

获取当前页码，从 `1` 开始。

```js
const pdfDocumentLoadingTask = pdfjsLib.getDocument({url: './demo.pdf'})
pdfDocumentLoadingTask.promise.then(pdfDocumentProxy => {
  pdfDocumentProxy.getPage(1).then(pdfPageProxy => {
    console.log(pdfPageProxy.pageNumber)
  })
})
```

## pdfPageProxy.rotate

获取当前页面旋转角度。

* 0：页面不旋转，保持默认方向
* 90：页面顺时针旋转 90 度
* 180：页面旋转 180 度
* 270：页面顺时针旋转 270 度

```js
const pdfDocumentLoadingTask = pdfjsLib.getDocument({url: './demo.pdf'})
pdfDocumentLoadingTask.promise.then(pdfDocumentProxy => {
  pdfDocumentProxy.getPage(1).then(pdfPageProxy => {
    console.log(pdfPageProxy.rotate)
  })
})
```

## pdfPageProxy.getViewport

获取 PDF 当前页面的页面视窗。一般后续进行渲染使用。

```js
const pdfDocumentLoadingTask = pdfjsLib.getDocument({url: './demo.pdf'})
pdfDocumentLoadingTask.promise.then(pdfDocumentProxy => {
  pdfDocumentProxy.getPage(1).then(pdfPageProxy => {
    const viewport = pdfPageProxy.getViewport({
      scale: 1, // 缩放比例(必需)
      rotation: 0, // 旋转角度
      offsetX: 0, // X 偏移量
      offsetY: 0, // Y 偏移量
      dontFlip: true // 禁用水平翻转，true-禁用水平翻转，false-启用水平翻转
    })
    console.log(viewport)
    // {
    //   "viewBox": [0, 0, 612, 792],
    //   "scale": 1,
    //   "rotation": 0,
    //   "offsetX": 0,
    //   "offsetY": 0,
    //   "transform": [1, 0, 0, -1, 0, 792],
    //   "width": 612,
    //   "height": 792,
    //   "rawDims": {"pageWidth": 612, "pageHeight": 792, "pageX": 0, "pageY": 0}
    // }
  })
})
```

## pdfPageProxy.render

将 PDF 视窗内容渲染到 canvas 上。

```js
const pdfDocumentLoadingTask = pdfjsLib.getDocument({url: './demo.pdf'})
pdfDocumentLoadingTask.promise.then(pdfDocumentProxy => {
  pdfDocumentProxy.getPage(1).then(pdfPageProxy => {
    const viewport = pdfPageProxy.getViewport({scale: 1})
    const canvas = document.querySelector('#canvas')
    const ctx = canvas.getContext('2d')
    pdfPageProxy.render({canvasContext: ctx, viewport})
  })
})
```
