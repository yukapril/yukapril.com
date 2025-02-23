---
title: "JS的__proto__ prototype constructor理解"
date: 2017-02-26 23:51:00 GMT+0800
tags: [ js, proto, prototype, constructor ]
---

Javascript 下的 `__proto__` `prototype` `constructor`，我一直都很困惑。

看过了一些文章，加上自己粗浅的理解，整理如下。

<!-- truncate -->

首先，要想明白这三个对象的含义，就需要先知道JS的类型。这里简单说下：

```js
// js的五个基本类型（值类型）和对象类型（引用类型）
// typeof 的结果

var str = 'asdf'; // string

var num = 1234; // number

var bool = true; // boolean（但是有constructor）

var nullObj = null; // object

var undefinedObj = undefined; // undefined

var obj = {}; // object

// 对象类型种类非常多，比如object / array / function等。

// 唯独，这三个比较特殊，一般也没人这么写，暂时忽略
// 这种写法仅仅是给值类型的数据包裹了一层而已
var str2 = new String('asdf') // object
var num2 = new Number(1234) // object
var bool2 = new Boolean(true); // object
```

## 先来聊一聊 原型 `__proto__`

首先呢，这个东西，是现代浏览器才能看到的，比如chrome的devtools。但是这个概念是一直有的，只不过老的浏览器禁止查看而已。

要想好好解释，那就说来话长。我还是简短的说吧。

一开始没有对象，只有 `null` 类型，后来在 `null` 基础上扩展出了 `object` 类型。再后来，有了 `function` 等类型。

**可以说，每个对象都有 `__proto__`，他就是指向自己的直接父辈。**

来看张图：

![image](https://cdn1.yukapril.com/2017-02-26-javascript-proto.png)

对象 `obj` 的父辈是 `Object`，对象 `arr` 的父辈是 `Array`。

可以写作

```js
var obj = {};
var arr = [];
obj.__proto__ === Object.prototype
arr.__proto__ === Array.prototype

Array.__proto__ === Object
```

这里为什么不是 `obj.__proto__ === Object` 呢？`Object` 是个构造函数，它的操作方法都放在 `prototype` 原型对象上。下文会说到。

而且：

```js
arr.__proto__ === Array.prototype
Array.prototype.__proto__ === Object.prototype
Object.prototype.__proto__ === null

// 综上，可以为
arr.__proto__.__proto__.__proto__ === null 
```

这样，一层一层的往自己的父辈上找原型，就是原型链了。

由于 `__proto__` 是个内部方法，所以其实不必太在意，知道有这个东西就行了。

这玩意除了别人考你 new关键字的原理时候会用到，其他时候我没注意有啥用途。

```js
function New(f) {
  var n = {};
  n.__proto__ = f.prototype;
  return function () {
    f.apply(n, arguments);
    return n;
  };
}
```

**当然，你应该知道，js一切皆对象，所以创建的一切变量（也就是一切都是对象）都是有 `__proto__` 的，`null` 除外。**

## 再聊一聊 原型对象 `prototype`

这个应该最常见。比如ES5代码中：

```js
function Person() {
}

Person.prototype.canSpeak = true;

var p = new Person();
console.log(p.canSpeak); // true
```

这里面有几个重要的点：

* `Person` 是函数，准确地讲，是构造函数。直白一点，这个函数最终主要使用方法是 `new Person` 这种形式。
* 绑定的 `canSpeak` 方法，可以是函数，也可以直接是字面量（字符串/数字等），这个无所谓。
* 由于`canSpeak`绑定在 `prototype` 上，所以必须要实例化（`var p = new Person()`），`p` 就是实例化后的对象。
* 实例化的 `p`，是对象。它绝对不是函数！

在有一个`Person`构造函数上，我们在它的原型对象上（`prototype`）绑有一个`canSpeak`方法，结果他的实例化对象就有了这个方法。原因就是上文的new原理。

我们查看下这个对象的结构：

![image](https://cdn1.yukapril.com/2017-02-26-javascript-prototype.png)

当我们访问 `p.canSpeak`时候，由于对象上本身没有 `canSpeak` 方法，就去它的原型去找此方法。说白了，自己没有，就去看看父辈那里有没有这种方法。

这里有一个有意思的实验：

```js
function Person() {
}

Person.prototype.canSpeak = true;

var p = new Person();
p.canSpeak = 123;

console.log(p.canSpeak); // 123
```

我们看看它的结果：

![image](https://cdn1.yukapril.com/2017-02-26-javascript-prototype2.png)

这就说明了，如果自己本身有这个方法，是不会去父辈（原型链）那里寻找的。

**小结**

* 只有函数（function）才会有原型对象 `prototype`
* 一个函数，当做构造函数被new之后，每个实例都可以使用原型对象的方法，`prototype` 相当于共享方法。
* 如果我们想生成一些对象，默认每个对象都拥有一些相同的方法，就可以创建构造函数，然后实例化的对象就是我们想要的东西。

在ES6里面，构造函数有了新的定义方法：

```js
class Person {
  constructor() {
  }

  canSpeak() {
    return 'yes';
  };
}

var p = new Person();
console.log(p.canSpeak());
```

不过，我不太清楚如何想上面一样定义返回普通值的方法，而不是现在ES6中的函数。

## 最后提一提 构造器 `constructor`

先来说普通对象（万物皆对象）

```js
var str = 'abc';

str.prototype; //是不存在的，prototype存在于构造函数中
str.__proto__ === String.prototype; // 字符串的父辈是String

String.prototype.constructor === String;
// 即
str.__proto__.constructor === String;
// 每个构造函数，其prototype中，constructor是指向自己的

// 同时有
str.__proto__.constructor === str.constructor;
// 即
str.constructor === String;
```

它存在于 `.__proto__.constructor` 下。因为他的 `__proto__` 是 `父辈.prototype` ，相当于父辈是构造函数。（当然，你也可以直接通过 `.constructor`  访问到，因为自己找不到就会到原型中找啊~）

再来说构造函数

```js
var Foo = function () {
};
Foo.prototype.bar = function () {
};
Foo.prototype.constructor === Foo; //  每个构造函数，其prototype中，constructor是指向自己的

// 同时有
Foo.__proto__ === Function.prototype;
Foo.__proto__.constructor === Function; // Foo的原型是Function，所以其原型的constructor是Function

// 再来看看构造函数的实例，和普通对象没区别
var f = new Foo();
f.prototype; //是不存在的，prototype存在于构造函数中
f.__proto__ === Foo.prototype;
f.__proto__.constructor === Foo;
```

看到这里，我们得到结论，所有构造函数，自己的 `prototype`中，除了我们定义的原型对象外，还有一个隐藏的 `constructor`，他不是通过其 `__proto__`得到的，而是真真正正自己的。而且 `constructor` 指向自己。

**小结**

* `constructor` 是构造函数特有的东西。
* 构造函数本身自己的 `prototype` 中要有一个`constructor`，这样自己的实例才能指向到构造函数本身。
* 所有对象，都是被父辈构造函数实例化出来的，所以他们`.__proto__.constructor`指向父辈。
* **“`constructor`指向自己” —— 很关键，js实现继承的时候，需要提到。**

## 说一下js的继承

在ES6之前，没有class extend方法，只能使用ES5的 `Object.create` 方法，或者下文：

```js
function extend(Child, Parent) {
  var F = function () {
  };

  F.prototype = Parent.prototype;

  Child.prototype = new F();

  Child.prototype.constructor === Child;

  Child.uber = Parent.prototype;
  // 这句话写不写无所谓，给Child构造函数增加一个静态方法，指向父辈原型对象，纯粹为了使用方便而已，不影响继承
}
```

解释下：

```js
var F = function () {
}; 
```

创建一个新的构造函数，下文可以使用。

```js
F.prototype = Parent.prototype; 
```

把F构造函数的原型对象指向父辈原型对象，相当于把父辈的共享方法拷贝过来。

这样通过 new Foo() 的实例，才会具有父辈的共享方法。

```js
Child.prototype = new F();
```

为了好说明，我们先定义 f，这样看的清晰：

```js
var f = new F();
Child.prototype = f;
```

此时有：`f.__proto__ === F.prototype`

但是 `f.__proto__.constructor !== F`，

因为 `F.prototype = Parent.prototype`，

所以 `f.__proto__.constructor === Parent`。

综合一下，本处的结果是：

```js
Child.prototype = f;
Child.prototype.__proto__ === F.prototype;
Child.prototype.__proto__.constructor === Parent;
```

也就是说，经过本函数传入的Child只能是空构造函数  `function(){...}`，绝对不能带有原定对象内容。

因为如果进入本函数前定义了其原型对象 `Child.prototype.testChild = function(){}`，经过本函数后，原型对象也会被覆盖！

既然被覆盖，那么Child.prototype里面没有任何内容，

此时 `Child.prototype.constructor` 也就指向了  `Child.prototype.__proto__.constructor`

即：`Child.prototype.constructor === Parent`。

**晕，Child的构造器指向了Parent，这是问题！**

所以继承函数中，应该有这一行代码：

```js
Child.prototype.constructor === Child;
```

我们必须修正下构造器指向。

分析结束。

我们测试下：

```js
var Parent = function () {
};
Parent.prototype.running = function () {
}; // 父亲会跑步
Parent.prototype.swiming = function () {
}; // 父亲会游泳

var Child = function () {
};
Child.prototype.pingpong = function () {
}; //孩子会乒乓球

extend(Child, Parent);


var xiaoming = new Child();
xiaoming.running();
xiaoming.swiming();
xiaoming.pingpong(); // TypeError，Child没有pingpong方法
```

我们先定义父亲和孩子两个构造函数，并赋予他们不同的能力，经过继承后，结果孩子的能力消失了！因为在继承前，子类任何原型对象均会被覆盖！

所以一定要在继承后，在添加原型对象：

```js
var Parent = function () {
};
Parent.prototype.running = function () {
}; // 父亲会跑步
Parent.prototype.swiming = function () {
}; // 父亲会游泳

var Child = function () {
};

extend(Child, Parent);

Child.prototype.pingpong = function () {
}; //孩子会乒乓球


var xiaohua = new Child();
xiaohua.running();
xiaohua.swiming();
xiaohua.pingpong(); 
```

== 本文完 ==
