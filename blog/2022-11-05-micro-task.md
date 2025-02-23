---
title: 再谈 js 宏任务与微任务
date: 2022-11-05 14:41:00 GMT+0800
tags:  [js, 宏任务, 微任务]
---

之前面试遇到考宏任务、微任务的考题。当时就有一个疑问，如果多个宏任务内，有微任务，那么是执行完毕宏任务、再执行微任务呢，还是如何执行？

<!-- truncate -->

之前的文章，[见此](/blog/2021/07/25/interview-js3)。

## 题目

这次模拟下，宏任务 `setTimeout` 内增加宏任务和微任务。可以先看题试试，下面接着就是答案了。

```js
const p1 = new Promise((resolve) => {
   console.log("promise1");
   resolve();
});
const p2 = new Promise((resolve) => {
   console.log("promise2");
   resolve();
});
const p3 = new Promise((resolve) => {
   console.log("promise3");
   resolve();
});
const p4 = new Promise((resolve) => {
   console.log("promise4");
   resolve();
});

console.log("start");

setTimeout(() => {
   console.log("setTimeout1-run");
   setTimeout(() => {
      console.log("setTimeout1-setTimeout-run");
   });
});

setTimeout(() => {
   console.log("setTimeout2-run");
   p3.then(() => {
      console.log("setTimeout2-promise-run");
   });
});

setTimeout(() => {
   console.log("setTimeout3-run");
   p4.then(() => {
      console.log("setTimeout3-promise-run");
   });
});

p1.then(() => {
   console.log("promise1-run");
});
p2.then(() => {
   console.log("promise2-run");
});

console.log("end");
```

## 答案

直接贴出答案：

```
01 promise1 
02 promise2 
03 promise3 
04 promise4 
05 start 
06 end 
07 promise1-run 
08 promise2-run 
09 setTimeout1-run 
10 setTimeout2-run 
11 setTimeout2-promise-run 
12 setTimeout3-run 
13 setTimeout3-promise-run 
14 setTimeout1-setTimeout-run 
```

## 分析解释

> 文章代码比较多，可以开两个窗口，左边看代码，右边看分析解释。

1. 前 4 个可以看出，Promise 内执行函数不是微任务，而返回 promise 对象调用才是微任务。所以先打印前 4 个
2. 随后执行第一个直接打印，输出 `start`，这个没有问题
3. 执行到到第一个 `setTimeout`，内部的代码放置到宏任务队列，即下面代码：
   ```js
   () => {
      console.log("setTimeout1-run");
      setTimeout(() => {
        console.log("setTimeout1-setTimeout-run");
      });
   }
   ```
4. 执行到到第二个 `setTimeout`，相应代码放置到宏任务队列
5. 执行到到第三个 `setTimeout`，相应代码放置到宏任务队列
6. 执行到到第一个 `promise`，内部的代码放置到微任务队列，即下面代码：
   ```js
   () => {
     console.log("promise1-run");
   }
   ```
7. 执行到到第二个 `promise`，相应代码放置到微任务队列
8. 执行第二个直接打印，输出 `end`
9. 主线程执行完成，此时微任务 2 个（都是 `promise` 创建的），宏任务 3 个（都是 `setTimeout` 创建的）
10. 检查微任务队列（有 2 个），执行微任务（第 6 条内容），输出 `promise1-run`
11. 检查微任务队列（有 1 个），存在任务，执行微任务（第 7 条内容），输出 `promise2-run`
12. 检查微任务队列（无微任务），检查宏任务（有 3 个），执行宏任务（第 3 条内容），输出 `setTimeout1-run`，并把内部的 `setTimeout` 补充到宏任务队列
13. 检查微任务队列（无微任务），检查宏任务（有 3 个），执行宏任务（第 4 条内容），输出 `setTimeout2-run`，并把内部的 `promise` 补充到微任务队列
14. 检查微任务队列，此时存在微任务了（第 13 条中刚添加的）！故执行微任务，输出 `setTimeout2-promise-run`
15. 检查微任务队列，无微任务，检查宏任务（有 2 个），执行宏任务（第 5 条内容），输出 `setTimeout3-run`，并把内部的 `promise` 补充到微任务队列
16. 检查微任务队列，此时又存在微任务了（第 15 条中刚添加的）！故执行微任务，输出 `setTimeout3-promise-run`
17. 检查微任务队列，无微任务，检查宏任务（有 1 个），执行宏任务（第 12 条中添加的），输出 `setTimeout1-setTimeout-run`
18. 主线程、微任务、宏任务均完成，结束

## 小结

通过上面的例子，可以看出，只要是有微任务，那么它一定是优于宏任务先执行的，简单来说，执行规则为：

1. `Promise` 内包裹函数，是同步逻辑，不是异步逻辑。回调的才是 `then` 是微任务；
2. 每次执行，都要判断当前主线程（同步代码）、微任务、宏任务，并按此顺序执行；
3. 执行逻辑中，遇到微任务、宏任务，分别将逻辑按顺序存放到对应的队列中，并按顺序执行。即先放入微任务队列的，后续在执行微任务环节先执行。
