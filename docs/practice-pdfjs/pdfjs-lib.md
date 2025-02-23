---
sidebar_position: 3
---

# pdfjsLib

需要等 `pdfjsLib` 加载完成后，才可以调用。可使用如下方式：

```js
document.addEventListener('DOMContentLoaded', () => {
  main()
})

function main() {
  // 在这里使用 pdfjsLib
}
```

## pdfjsLib.version

返回当前 pdf.js 的版本。

```js
console.log(pdfjsLib.version) // 4.3.136
```

## pdfjsLib.build

返回当前 pdf.js 的构建版本 git 提交 hash 值。

```js
console.log(pdfjsLib.build) // 0cec64437
```

## pdfjsLib.isPdfFile()

返回指定文件是否是 PDF 文件。这个是通过正则匹配文件名实现，并不一定精准。

```js
console.log(pdfjsLib.isPdfFile('a.pdf')) // true
```

## pdfjsLib.getDocument()

用于加载 PDF 文档。

### 入参

| 参数                  | 例子                                          | 说明                                                         |
|---------------------|---------------------------------------------|------------------------------------------------------------|
| url                 | './demo.pdf' 'https://example.com/test.pdf' | PDF 文件地址，支持本地地址和远程地址                                       |   
| httpHeaders         | \{ Authorization: 'Bearer your_token' }     | 自定义 HTTP 请求头，用于在请求 PDF 文档时添加额外的头信息。这对于需要身份验证或自定义头信息的请求非常有用 |   
| withCredentials     | true                                        | 指定是否在请求中包含凭证信息，比如 cookie                                   |   
| password            | 'password'                                  | 指定 PDF 文档的密码                                               |   
| cMapUrl             | './pdfjs-4.3.136-dist/web/cmaps/'           | 指定字符映射的 URL。通常在处理含有中文、日文、韩文等的 PDF 时使用                      |   
| cMapPacked          | true                                        | 指定字符映射文件是否是打包压缩的                                           |
| docBaseUrl          | 'https://example.com/assets/'               | 为 PDF 文档中的相对 URL 提供基准 URL，通常用于处理文档内的资源（如图片）                |
| range               | \{ begin: 0, end: 1024 }                    | 指定要加载的 PDF 文档的字节范围。对于处理大型 PDF 文件或部分下载非常有用                  |
| verbosity           | pdfjsLib.VerbosityLevel.INFOS               | 设置日志的详细程度                                                  |
| standardFontDataUrl | './pdfjs-4.3.136-dist/web/standard_fonts/'  | 指定标准字体文件的 URL                                              |

以上参数只是列举，还有一些参数可以参考源码。

### 返回值

`PDFDocumentLoadingTask`

具体用法参考 [PDFDocumentLoadingTask](./pdfjs-document-loading-task.md)

### 例子：使用 URL 形式导入 PDF

可以是本地路径，也可以是网络资源。注意不要跨域。

```js
const pdfDocumentLoadingTask = pdfjsLib.getDocument({url: './demo.pdf'})
// 可简写为 pdfjsLib.getDocument('./demo.pdf')
console.log('pdfDocumentLoadingTask', pdfDocumentLoadingTask)
```

### 例子：使用 TypedArray 二进制数据导入 PDF

```js
async function pdf(data) {
  const typedArray = new Uint8Array(data)
  const pdfDocumentLoadingTask = pdfjsLib.getDocument({data: typedArray})
  // 可简写为 pdfjsLib.getDocument(typedArray)
  console.log('pdfDocumentLoadingTask', pdfDocumentLoadingTask)
}

document.getElementById('input').addEventListener('change', event => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = async e => {
      pdf(e.target.result)
    }
    reader.readAsArrayBuffer(file)
  }
})
```




