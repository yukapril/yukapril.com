---
title: "codewars - Father and son"
date: 2016-10-31 22:14:00 GMT+0800
tags: [ codewars ]
---

在 codewars 上面做题，有这样[一道题](https://www.codewars.com/kata/shortest-code-father-and-son)。

<!-- truncate -->

> Every uppercase letter is Father, The corresponding lowercase letters is the Son.
>
> Give you a string s, If the father and son both exist, keep them. If it is a separate existence, delete them. Return the result.
>
> For example:
>
> * sc("Aab") should return "Aa"
>
> * sc("AabBc") should return "AabB"
>
> * sc("AaaaAaab") should return "AaaaAaa"(father can have a lot of son)
>
> * sc("aAAAaAAb") should return "aAAAaAA"(son also can have a lot of father

这道题不难。稍微用几分钟就能写完了。但是这道题有个难度，那就是要求120字符完成代码。

所以，这道题还有一个简单的版本，[见此](http://www.codewars.com/kata/coding-3min-father-and-son/)。

原始版本   (length=187)

```js
function sc(s) {
  return s.split('').map((v) => {
    if (v.toLowerCase() == v && s.indexOf(v.toUpperCase()) >= 0) {
      return v
    } else if (v.toUpperCase() == v && s.indexOf(v.toLowerCase()) >= 0) {
      return v
    }
  }).join('')
}
```

替换了toLowerCase/toUpperCase  (length=186)，这是我所了解的终极写法了..

竟然长度基本没有减少...要命啊，看来重复次数太少了，不太管用。

```js
function sc(s) {
  var l = 'toLowerCase', u = 'toUpperCase'
  return s.split('').map((v) => {
    if (v[l]() == v && s.indexOf(v[u]()) >= 0) {
      return v
    } else if (v[u]() == v && s.indexOf(v[l]()) >= 0) {
      return v
    }
  }).join('')
}
```

删除else if (length=169)，这句话可以合并的。

```js
function sc(s) {
  var l = 'toLowerCase', u = 'toUpperCase'
  return s.split('').map((v) => {
    if (v[l]() == v && s.indexOf(v[u]()) >= 0 || v[u]() == v && s.indexOf(v[l]()) >= 0) {
      return v
    }
  }).join('')
}
```

去掉没用的括号 (length=165)

```js
function sc(s) {
  var l = 'toLowerCase', u = 'toUpperCase'
  return s.split('').map(v => {
    if (v[l]() == v && s.indexOf(v[u]()) >= 0 || v[u]() == v && s.indexOf(v[l]()) >= 0) return v
  }).join('')
}
```

这样来试，看来是不行的，必须要优化下逻辑了。

仔细研究下，其实if语句内容是多余的，直接判断当前字符在字符串里面，必须有大写和小写就行了，没必要进行区分(length=143)

```js
function sc(s) {
  var l = 'toLowerCase', u = 'toUpperCase'
  return s.split('').map(v => {
    if (s.indexOf(v[l]()) >= 0 && s.indexOf(v[u]()) >= 0) return v
  }).join('')
}
```

突然发现，只要函数正确，也可以修改自带的函数结构的。调整为ES6格式。(length=132)

```js
sc = s => {
  var l = 'toLowerCase', u = 'toUpperCase'
  return s.split('').map(v => {
    if (s.indexOf(v[l]()) >= 0 && s.indexOf(v[u]()) >= 0) return v
  }).join('')
}
```

之后的路，就非常艰辛了。我也参考了简单问题中的部分答案。比如说用到了`filter` `includes`。

这个确实要说，我数组用的不好，刚刚才能用上reduce，虽然听说过filter，但是没有实际应用过。

查过[资料](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)得知，类似于`map`，同样为`return`控制，只不过返回`true` `false`来控制新数组是否包含当前数据而已。

举个非常简单的例子：

```js
var filtered = [12, 5, 8, 130, 44].filter((el) => el >= 10)
// [12, 130, 44]
```

改造下，试试看。(length=121)

```js
sc = s => {
  var l = 'toLowerCase', u = 'toUpperCase'
  return s.split('').filter(v => s.indexOf(v[l]()) >= 0 && s.indexOf(v[u]()) >= 0).join('')
}
```

这次虽然是121字符，但是实际可以通过了，刷个流氓就能（去掉`var`）。

很明显，这么做不好。那么研究下`includes`。这个方法我都没有听说过。

文档见[这里](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/includes)。因为实在也是太简单了，直接上例子：

```js
[1, 2, 3].includes(2); // true
```

使用`includes`有个好处，那就是省去了判断符号`>=`。我来看看。

```js
sc = s => {
  var l = 'toLowerCase', u = 'toUpperCase'
  return s.split('').filter(v => s.includes(v[l]()) && s.includes(v[u]())).join('')
}
```

写的时候我就能感觉到，这次肯定更短了！省去了很多字符...果真，length=117。

老规矩，替换字符法。结果发现，竟然还多了一个字符...哎...代码量太少，没办法这么优化啊。

所以，整理下格式，正确答案就是：

```js
//length=117
sc = s => {
  var l = 'toLowerCase',
    u = 'toUpperCase'
  return s.split('').filter(
    v => s.includes(v[l]()) && s.includes(v[u]())
  ).join('')
}
```

如果耍个流氓，那么会更短

```js
//length=113
sc = s => {
  l = 'toLowerCase',
    u = 'toUpperCase'
  return s.split('').filter(
    v => s.includes(v[l]()) && s.includes(v[u]())
  ).join('')
}
```

当然，这里也可以去掉定义了。还能省去很多长度。这样可以做到：

```js
//length=94
sc = s => s.split('').filter(v => s.includes(v.toLowerCase()) && s.includes(v.toUpperCase())).join('')
```

这恐怕是最短的结果了。我看了看别的答案，没有什么好的思路了。

看来编译不好使啊！还不如直接来的省事。
