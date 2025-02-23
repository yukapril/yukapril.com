---
title: 面试题（宏任务、微任务）
date: 2021-07-25 12:28:00 GMT+0800
tags:  [面试, 宏任务, 微任务]
---

考验你对宏任务、微任务队列的理解。

<!-- truncate -->

说出下列输出打印顺序：

```js
async function async1() {
  console.log('async1 start')
  await async2()
  console.log('async1 end')
}

async function async2() {
  console.log('async2')
}

console.log('script start')

setTimeout(function () {
  console.log('setTimeout')
}, 0)

async1()

new Promise(function (resolve) {
  console.log('promise1')
  resolve()
}).then(function () {
  console.log('promise2')
})
console.log('script end')
```

答案很容易，放到浏览器里面就看到答案了。

下面标记上答案，并简单解释下：

```js
async function async1 () {
  console.log('async1 start', 2)
  await async2()
  console.log('async1 end', 6)
}

async function async2 () {
  console.log('async2', 3)
}

console.log('script start', 1)

setTimeout(function () {
  console.log('setTimeout', 8)
}, 0)

async1()

new Promise(function (resolve) {
  console.log('promise1', 4)
  resolve()
}).then(function () {
  console.log('promise2', 7)
})
console.log('script end', 5)
```

有两个队列：宏任务、微任务，有微任务时候，先执行，之后才轮到宏任务。

* `setTimeout` `setInterval` 内容是宏任务
* `promise` `MutaionObserver` 内容是微任务

这里只说浏览器，因为 NodeJS 的 `nextTick` 之类，我记得非常复杂。甚至在某些情况（`fs.wirte`）是无规律/反规律的。

1. 代码从上往下执行，首先打印 1 号位，这个不解释了；
2. 来到了 `setTimeout`，把 8 号位推入了【宏任务】；
2. 之后执行 `async1()`，本身此函数是同步函数，所以打印 2 号位；
3. 同理， `async2()` 是彻底的同步函数，因为没有 `await`，继续打印 3 号位；
4. 来到了 6 号位代码位置。由于是 `await` 之后的代码，可以理解为 `new Promise` 了，相当于 6 号位被推入【微任务】；
5. 之后来到了 `promise`，内部 4 号位是同步执行的，所以打印 4 号位；
6. 之后直接 `resolve`，此时执行 `then` 方法，7 号位被推入【微任务】
7. 最后，来到 5 号位，打印 5号位；
8. 代码跑完了，先检查下【微任务】，再检查【宏任务】；
9. 【微任务】中有两个，6 号位和 7 号位，依次执行打印；
10. 【宏任务】中有一个，8 号位，执行打印；
11. 完毕。

我认为稍微细心一点就可以做对了。就是要注意下，`async` 函数和 `promise` 执行起来本身是同步的，不要当做异步来处理就好。
