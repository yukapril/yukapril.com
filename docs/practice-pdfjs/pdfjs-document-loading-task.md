---
sidebar_position: 4
---

# PDFDocumentLoadingTask

## pdfDocumentLoadingTask.docId

处理文档的 `id` 编号。加载多个 PDF 文件后，可以用于区分。

以字母 `d` 开头，后接数字。如 `d0` `d1` ...

```js
const pdfDocumentLoadingTask = pdfjsLib.getDocument({url: './demo.pdf'})
console.log(pdfDocumentLoadingTask.docId) // d0
```

## pdfDocumentLoadingTask.promise

获取 PDF 文档的内容

返回值 `PDFDocumentProxy`

具体用法参考 [PDFDocumentProxy](./pdfjs-document-proxy.md)

## pdfDocumentLoadingTask.onProgress

监听加载进度

## pdfDocumentLoadingTask.destroy()

取消当前加载任务

## 综合例子

```js
const pdfDocumentLoadingTask = pdfjsLib.getDocument({url: './demo.pdf'})
console.log('pdfDocumentLoadingTask', pdfDocumentLoadingTask)

pdfDocumentLoadingTask.onProgress = progress => {
  console.log('progress', progress)
}
pdfDocumentLoadingTask.promise.then(pdfDocumentProxy => {
  console.log('pdfDocumentProxy', pdfDocumentProxy)
}).catch(err => {
  console.error('error', err)
})

setTimeout(() => {
  pdfDocumentLoadingTask.destroy().then(() => {
    console.log('task cancelled')
  })
}, 2000)
```
