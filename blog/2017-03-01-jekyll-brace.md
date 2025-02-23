---
title: "jekyll 下文章无法显示双大括号{{ }}和{% %}的处理"
date: 2017-03-01 21:25:00 GMT+0800
tags: [ jekyll, 括号, 转义 ]
---

在前些天写一篇渲染的文章时候，文章内容反复出现了 `{ { name } }` 这种格式的代码。

之前也遇到过一次，是代码中有 `{ %  % }` 的部分，也没办法处理。

思考很久，也查阅了很多文章，始终无法解决。

<!-- truncate -->

jekyll 会把模板中 `{ { ... } }` 当做语法串进行处理，最终传输到页面就是空串了。

查阅 jekyll 的文档，没发现有能忽略 `{ { } }` 的配置。我尝试用 `{ { "..." | html } }` 这种形式，通过管道运算符来处理，结果还是不行。

最终考虑一种方案，将符号转义，让 jekyll 直接将符号输出到页面吧，多出的转义符号，交给js来处理。

经过研究，只能使用 `\{ \{ ... \} \}`(去掉空格) 这种形式，不能用 `{\{ ... }\}` 这种形式，原因在于，后者代码的展现配色效果不如前者好。

之后，加入js代码，作用很简单，找到页面存在问题的部分，然后依次用正则替换为正确的展现。

```js
var fixBrace = function () {
  var list = document.querySelectorAll('code');
  list.forEach(function (item) {
    if (item.innerHTML.indexOf('\\{\\{') >= 0) {
      item.innerHTML = item.innerHTML.replace(/\\{\\{/g, '{ {');
    }
    if (item.innerHTML.indexOf('\\}\\}') >= 0) {
      item.innerHTML = item.innerHTML.replace(/\\}\\}/g, '} }');
    }
    if (item.innerHTML.indexOf('\\{\\%') >= 0) {
      item.innerHTML = item.innerHTML.replace(/\\{\\%/g, '\{\%');
    }
    if (item.innerHTML.indexOf('\\%\\}') >= 0) {
      item.innerHTML = item.innerHTML.replace(/\\%\\}/g, '\%\}');
    }
  });
};
```

完毕，搞定。
