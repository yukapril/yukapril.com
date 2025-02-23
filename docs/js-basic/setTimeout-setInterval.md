---
sidebar_position: 1
---

# setTimeout 与 setInterval

`setTimeout` 可以起到延迟一定时间后，再执行函数，以及实现异步效果。 除此外，`setInterval` 可以进行重复的执行函数，相当于嵌套调用 `setTimeout`。

这两个日常开发经常遇到，但是它的参数以及一些细节却很多。

由于 `setTimeout` 和 `setInterval` 绝大部分都有类似的语法特性，本文主要以 `setTimeout` 为主。特殊的地方进行单独标注。

## 用法

`setTimeout` 的语法：

```js
var timeoutID = scope.setTimeout(function[, delay, arg1, arg2, ...]);
var timeoutID = scope.setTimeout(function[, delay]);
var timeoutID = scope.setTimeout(code[, delay]);
```

第一，支持传递给执行函数参数方式调用（但是不兼容IE9等旧浏览器）：

```js
const param1 = 'a'
const param2 = 'b'
const param3 = 'c'
setTimeout((a, b, c) => {
  console.log(a, b, c)
}, 1000, param1, param2, param3)

// 1s 后打印出 a b c
```

这种方式我从来没用过，因为可以直接通过外层获取参数。

```js
const param1 = 'a'
const param2 = 'b'
const param3 = 'c'
setTimeout(() => {
  console.log(param1, param2, param3)
}, 1000)

// 1s 后打印出 a b c
```

这么做好处是更加简单，缺点我认为是外层变量不能被垃圾回收。

第一，支持不写延迟时间方式（相当于写 `0`）：

```js
setTimeout(() => {
  console.log('a')
})

// 立即打印出 a
```

第三，支持直接写代码方式（而不是函数）：

```js
const param1 = 'a'
setTimeout('console.log(param1)', 1000)
// 1s 后打印出 a
```

这种方式理论上先执行了 `eval`，也就继承了 `eval` 的缺点，而且我从来没想到项目中有什么场景要用到。

## 场景

最常见的用法就是延迟执行，比如：

- 中间页，几秒后跳转到另一个页面；
- 弹窗关闭是有动画的，所以调用关闭方法后，再等待一小会，执行清理弹窗的 DOM 结构；
- 轮询，间隔多少秒就请求接口查询状态。

还有就是强行改异步作用，比如如下代码：

```js
const myFn = (callback) => {
  try {
    // some code ...
    callback()
    setTimeout(callback)
  } catch (e) {
    console.log('inner catch', e)
  }
}

myFn(() => {
  window.abc()
})

// 错误 inner catch TypeError: window.abc is not a function
```

我写了一个公共方法，自己捕捉错误（`inner catch`）。调用方调用，结果外层代码有 bug，反而被我捕获到了。

此时强行改成异步，可以防止自己捕获错误信息。

```js
const myFn = (callback) => {
  try {
    // some code ...
    setTimeout(callback) // 改成异步
  } catch (e) {
    console.log('inner catch', e)
  }
}

myFn(() => {
  window.abc()
})

// 错误 Uncaught TypeError: window.abc is not a function
```

上面这里例子只是用途参考，实际这样写代码，外层自己也不能捕获到错误。

## 细节点

#### 第一，最终执行时间受到当前线程任务时间影响。

比如如下代码：

```js
console.time('setTimeout')
setTimeout(() => {
  console.timeEnd('setTimeout')
})

for (let i = 0; i < 10e7; i++) {}
```

如果没有最有一句 `for` 循环，则统计时间为 1ms 左右。但加入占用大量时间的 `for` 之后，统计时间超过 60ms。

#### 第二，存在最小间隔时间。

如果 `setTimeout` 存在嵌套调用，那么系统会设置最短时间间隔为 4ms。

```js
function cb () { setTimeout(cb, 0) }

setTimeout(cb, 0)
```

> 是因为在 Chrome 中，定时器被嵌套调用 5 次以上，系统会判断该函数方法被阻塞了，如果定时器的调用时间间隔小于 4 毫秒，那么浏览器会将每次调用的时间间隔设置为 4 毫秒。<sup>[[1]](#参考)</sup>

> 在Chrome 和 Firefox中， 定时器的第5次调用被阻塞了；在Safari是在第6次；Edge是在第3次。Gecko 从这个版本 version 56开始对 setInterval() 开始采用这样的机制。<sup>[[2]](#参考)</sup>

表现为前 5 次正常，之后间隔变为 4ms。

具体参考源码[这里](https://source.chromium.org/chromium/chromium/src/+/master:third_party/blink/renderer/core/frame/dom_timer.cc;l=48)。

2023-10-26 测试发现：

`setTimeout` chrome 系列新版浏览器，最小时间可以为 0，那么大约执行时机为 0.1 ms 左右。测试方法：

```js
console.time('timeout')
setTimeout(() => { console.timeEnd('timeout') }, 0)
```

但是嵌套调用，仍然存在 4ms 时间间隔。

但是，`setInterval` 最小时间间隔则仍为 1ms（即传入 0，当作 1 看待）。嵌套调用，也是 4ms。<sup>[[3]](#参考)</sup>

#### 第三，如果页面未激活，那么延迟时间最小为 1000ms。

```js
console.log('当前时间', new Date().toJSON())
setTimeout(() => {
  setTimeout(() => {
    console.log('3s后时间', new Date().toJSON())
  }, 0)
}, 3000)
```

如果页面激活状态，则可以看到以下日志，间隔正好是 3s 左右：

```js
// 当前时间 2021-12-02T06:24:46.910Z
// 3s后时间 2021-12-02T06:24:49.915Z
```

如果页面未激活状态，则可以看到以下日志，除去 3s 延迟，还有 1s+ 的等待：

```js
// 当前时间 2021-12-02T06:25:12.062Z
// 3s后时间 2021-12-02T06:25:16.315Z
```

`setInterval` 同理，也有此问题。

#### 第四，延时执行时间有最大值。

> Chrome、Safari、Firefox 都是以 32 个 bit 来存储延时值的，32bit 最大只能存放的数字是 2147483647 毫秒，这就意味着，如果 setTimeout 设置的延迟值大于 2147483647 毫秒（大约 24.8 天）时就会溢出，那么相当于延时值被设置为 0 了，这导致定时器会被立即执行。<sup>[[1]](#参考)</sup>

```js
Math.pow(2, 31) - 1 === 2147483647
```

#### 第五，返回值为数字，且 `setTimeout` 和 `setInterval` 共用一个编号池。

> setTimeout()和setInterval()共用一个编号池，技术上，clearTimeout()和 clearInterval() 可以互换。但是，为了避免混淆，不要混用取消定时函数。<sup>[[2]](#参考)</sup>

使用 `clearInterval` 取消 `setTimeout` 定时器：

```js
const timeout1 = setTimeout(() => {
  console.log('ok1')
}, 1000)
clearInterval(timeout1)
```

没有获取返回值，一样可以取消定时器：

```js
const timeout1 = setTimeout(() => {
  console.log('ok1')
}, 1000)
setTimeout(() => {
  console.log('ok2')
}, 1000)
setTimeout(() => {
  console.log('ok3')
}, 1000)

clearTimeout(timeout1 + 1)
clearTimeout(timeout1 + 2)

// 1s 后只打印出 ok1
```

#### 第六，`this` 指针指向问题。

不论是 `setTimeout` 还是 `setInterval`，都存在 `this` 指向问题。

看一个例子：

```js
const myArray = ['zero', 'one', 'two']
myArray.myMethod = function (sProperty) {
  console.log(this, this[sProperty])
}

myArray.myMethod(1) //=> [zero,one,two] one
setTimeout(myArray.myMethod, 2000, 1) //=> [object Window] undefined
```

正常调用 `myArray.myMethod(1)` 是正常的，但是在 `setTimeout` 中，`this` 丢失。

解法1：再次包装一层。我基本上都这么用，简单省事。

```js
const myArray = ['zero', 'one', 'two']
myArray.myMethod = function (sProperty) {
  console.log(this, this[sProperty])
}

setTimeout((a) => {
  myArray.myMethod(a)
}, 1000, 1)
//=> [zero,one,two] one
```

解法2：使用 `bind`。

```js
const myArray = ['zero', 'one', 'two']
myArray.myMethod = function (sProperty) {
  console.log(this, this[sProperty])
}

const myMethodBind = (myArray.myMethod).bind(myArray)

myMethodBind(2) //=> [zero,one,two] two
setTimeout(myMethodBind, 2000, 2) //=> [zero,one,two] two
```

解法3：改写原生 `setTimeout` `setInterval`。

此方案过于生猛，请直接参考[MDN 这里](https://developer.mozilla.org/zh-CN/docs/Web/API/setTimeout#%E5%8F%AF%E8%83%BD%E7%9A%84%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88)。

## 参考

[1]&nbsp;[浏览器工作原理与实践](https://time.geekbang.org/column/article/134456)

[2]&nbsp;[window.setTimeout MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/setTimeout)

[3]&nbsp;[为什么这段代码在Chrome环境中不符合事件循环机制？](https://www.zhihu.com/question/619560968/answer/3188678764)

