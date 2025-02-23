---
sidebar_position: 4
---

# parseFloat

`parseFloat` 用于把字符串转化为浮点数字。

## 语法

它的语法非常简单[[1]](#参考)：

```js
parseFloat(string)
```

比起 `parseInt` 算是简单多了。

1. 首先是参数要转化为字符串（如果不是的话）。

之后就可以按照参数是 `String` 的方式来处理了。具体 `ToString` 的逻辑，可以参考另一篇文章 [ToString 处理方案](/js-basic/toString)。

2. 看字符串前面是否有空格之类，有的话可以忽略，如：

```js
parseFloat('  123.45') //=> 123.45
```

3. 如果字符串一开始是合法的，后续有不合法字符，则合法字符部分正常解析，不合法部分忽略：

```js
parseFloat('123.45ea123') //=> 123.45

parseFloat('123.45e3a123')
// 等价于
parseFloat('123450a123') //=> 123450
```

4. 如果带有负号，则负号可以提取出来，最后再拼接：

```js
parseFloat('-123.45')
// 等价于
- parseFloat('-123.45') //=> -123.45
```

5. 接上一条，要注意的是，字符串如果是 `-0`，比较特殊，看例子：

```js
parseFloat(+0)
// 等价于
parseFloat('0') //=> 0

parseFloat(-0)
// 等价于
parseFloat('0') //=> 0

parseFloat('+0') //=> 0
parseFloat('-0') //=> -0，这里返回负零
```

6. 如果数字太大太小，则可能返回 `Infinity`：

```js
parseFloat('1.8e308') //=> Infinity
parseFloat('-1.8e308') //=> -Infinity
```

> 为何是 1.8e308，还不明确。

## 参考

[1]&nbsp;[window.setTimeout MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/setTimeout)
