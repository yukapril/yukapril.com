---
title: 面试题（compose 函数组合）
date: 2021-07-25 12:08:00 GMT+0800
tags: [ 面试, compose ]
---

redux 有一个方法 `compose`。如何实现？

<!-- truncate -->

redux 有一个方法 `compose`，可以实现如下特性：

```js
const fn = compose(f1, f2, f3, ...)
// 等价于
const fn = f1(f2(f3(...)))
// 并且支持如下调用
fn(123)
// 相当于
const fn = f1(f2(f3(123)))
```

来实现 `compose` 函数。

redux 的 `compose` 可以参见[这里](https://github.com/reduxjs/redux/blob/c21ac204e8ef1d6d428ee3b906b3646c73aa9441/src/compose.ts#L46)。

```js
// 方案一，简单的循环
const compose = (...args) => val => {
  let ret = val
  for (let i = args.length; i > 0; i--) {
    const fn = args[i - 1]
    ret = fn(ret)
  }
  return ret
}

// 方案二，上面的循环不就是reduce吗
const compose2 = (...args) => val => {
  return args.reduceRight((a, b) => {
    return b(a)
  }, val)
}

// 测试
const f1 = v => v + '_f1'
const f2 = v => v + '_f2'
const f3 = v => v + '_f3'

// const fn = compose()
// const fn = compose(f1)
const fn = compose(f1, f2, f3)
console.log('result', fn('asdf'))
```

当时没答出来，主要是受到当年网易的考题影响了（`add(1)(2)(3)...`）。网易题解法大概是要重写 `toString`，所以写这道题时候蒙了。想到 `for` 循环了，但是没写完整。

上面的代码其实不难，我也就不多解释了。

关键的点来了，看看官方 redux 的实现：

```js
// 以下代码已把原本的类型部分去掉了
export default function compose(...funcs: Function[]) {
  if (funcs.length === 0) {
    return arg => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  return funcs.reduce(
    (a, b) => args => a(b(...args))
  )
}
```

明明最后的 `reduce` 就行了，为啥还要加上两个额外的判断？

我的理解是，**性能优化**。

举个例子来说明下：

```js
// 有一个函数 fn，支持一个数字参数 n
// 将数字带入一个复杂的 complexFunc 函数中可以进行计算
const fn = n => {
  return complexFunc(n) // 此计算非常耗时
}

// 经过统计分析，95%情况下，入参n=100/200。而且返回值此时固定是 'abc'/'def'
// 那么可以进行优化为
const fn = n => {
  if (n === 100) return 'abc'
  if (n === 200) return 'def'
  return complexFunc(n) // 此计算非常耗时
}

// 一下子性能提升很多有木有！
```

所以官方肯定做过统计调研，把常见的 0~1 个参数的情况特殊优化了下。
