---
title: 面试题（判断对象类型、数组拍平、字符重复）
date: 2021-07-25 12:22:00 GMT+0800
tags: [ 面试, type, flat, repeat ]
---

这次的题目都不太复杂。但是深究起来还挺难的。

<!-- truncate -->

## 判断对象类型

如果只是简单的判断，可以直接 `typeof` `instanceof` `Array.isArray` 之类。但是项目上，一般常用 `Object toString` 方案。

这个非常简单啊，凡是稍微写过前端的，几乎都知道：

```js
const type = n => Object.prototype.toString.call(n)
```

那么问题来了，这个能简写吗？

我能想到这么写：

```js
{}.toString.call() // 可能报错
```

但是其实这么写有些时候是错的，比如 F12 调试工具里面，需要加上括号：

```js
({}).toString.call()
```

这么写的坏处，我记得有两方面（只是个人感觉啊，不一定对）：

* 一是需要括号，意味着括号之前要加分号（上面的例子没有加）
* 好像是对象可能被篡改，导致不能如期返回要的内容（不过我现在没想出来如何复现）

所以我一直都用最长完整的写法。

那么问题来了，是否可以这么写？

```js
Object.toString.call(n)
```

我记得曾经这么写过报错，但是具体原因不详。

具体解释看[这里](https://segmentfault.com/a/1190000039034404)和[这里](https://juejin.cn/post/6844903604990509063)，我就不搬运了。

## 数组拍平

有个多维数组，要求把它拍平。

```js
const arr = [
  1, 2, 3, 4,
  [1, 2, 3, [1, 2, 3, [1, 2, 3]]],
  5, 'string',
  {name: '弹铁蛋同学'}
]
```

面试时候还好我想到了 ES9 （查了下，其实是 ES10 的）有一个新语法 `flat`，只不过细节参数记不住了。

查了下，很简单：

```js
console.log(arr.flat(Infinity))
```

曾经写过手动拍平，现在凑合再写下吧：

```js
const flat = arr => {
  const isArray = n => Object.prototype.toString.call(n) === '[object Array]'

  if (isArray(arr)) {
    // 是数组，反复迭代
    return arr.reduce((a, b) => {
      a.push(...flat(b))
      return a
    }, [])
  } else {
    // 不是数组，直接包裹为数组后返回
    // 主要是为了上面的迭代方便，让 flat 函数返回永远是数组
    return [arr]
  }
}

console.log(flat(arr))
```

实际项目的话，`isArray` 放在函数外面更好。反复定义变量伤性能。

在深入一点，可以考虑尾递归优化。

## 字符串重复

有一个函数，可以满足：

```
repeat('a', 3) => 'aaa'
repeat('ab', 3) => 'ababab'
```

这个就比较简单了：

```js
const repeat = (str, n) => {
  let ret = ''
  for (let i = 0; i < n; i++) {
    ret += str
  }
  return ret
}
```

问题又来了，如何用递归来实现呢？还是面试时候答不上来，感觉自己智商不够，得慢慢想下。

```js
const repeat = (str, n, temp = '') => {
  if (n === 0) return str
  return repeat(str + temp, n - 1, str)
}

console.log(repeat('ab', 3))
// 执行过程是这样的
// repeat('ab', 3)
// repeat('ab', 2, 'ab')
// repeat('abab', 1, 'ab')
// repeat('ababab', 0, 'ab')
```

还好几天前再次复习了尾递归优化，否则现在肯定是写不出来了。

我自认为，尾递归优化能做还是做下。虽然尾递归优化在浏览器和 NodeJS 上面没什么用。

（其实 safari 浏览器是支持尾递归优化的，其他浏览器都不行）
