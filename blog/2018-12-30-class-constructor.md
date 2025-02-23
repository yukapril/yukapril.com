---
title: class 的 constructor 什么时候可以不写
date: 2018-12-30 18:38:00 GMT+0800
tags: [ constructor ]
---

最近写 React 项目时候，本来觉得自己清楚 `constructor` 的写法，但是还是发现不够清晰，特查询总结下。

<!-- truncate -->

首先必须说明的是，`constructor` 必须用在类方法里面，普通的 `function` 是没有的。

## MDN 的 `constructor` 文档说明

阅读 [MDN文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes/constructor)，简单说来:

* `constructor` 在类里面只能写一个，感觉像是废话...
* 如果需要调用父类构造方法，必须写 `constructor`，因为 `super` 方法只能写在 `constructor` 里面。
* 如果你不写 `constructor`，那么代码执行上会给你增加一个默认的 `constructor`。

关于最后一条，默认构造函数，基类默认的 `constructor` 是：

```
constructor() {} // 就是啥都不干
```

派生类默认的 `constructor` 是：

```
constructor(...args) {
  super(...args) // 用派生类实例的参数调用下基类构造函数
}
```

可以说，如果你的类不需要特殊处理参数（与默认的构造函数一致），那么可以省略 `constructor`。

## 基类

先用一个简单的类来说：

```js
class A {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
}
```

构造器主要完成了类的参数处理，此例子中将类的参数放到了实例上。由于需要处理数据，所以此时 `constructor` 必定不能省略。

但是如果一个简单的类，不需要处理数据，比如：

```js
class B {
  constructor() {
  } // 可以不写
  say() {
    console.log('hello')
  }
}
```

这时候可以不写 `constructor` 了。

## 派生类

**例一，用一个 react 常用的风格来说明：**

```js
class C extends A {
  constructor(props) {
    super(props) // 可以省略
  }
}
```

在派生类集成的过程中，可以使用 `super` 方法，我还真没遇到过不调用父类构造函数的情况...😓

由于此时的 `constructor` 属于默认情形，所以也可以省略。

**例二，再复杂一点的 react 例子：**

```js
class C extends A {
  constructor(props) {
    super(props)
    this.state = {val: ''}
  }
}
```

由于 `constructor` 中写了 state，没办法，此时必然不可以像上文一样省略。**但是**，这个例子可以改写成如下形式：

```js
class C extends A {
  constructor(props) {
    super(props) // 此时可以省略
  }

  state = {val: ''}
}
```

这样的话，`constructor` 又可以省略了。

## 小结

总之，一个很简单的原则，如果 `constructor` 是默认情况，那么就可以省略。其他时候不能省略。

不省略的话，派生类写 `constructor` 的时候，必须要写 `super` 方法。而基类写 `constructor` 的时候绝对不能写 `super`（因为没有继承啊）。


