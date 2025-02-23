---
sidebar_position: 5
---

# javascript 判断类型的方法

在前端项目中，很多时候都要判断对象的类型，根据类型进一步再做处理。判断类型的方法上，有很多方式方法。本文进行依次讨论。

## javascript 类型

首先要了解 javascript 的类型。类型分为基本类型和引用类型。

基本类型有：

`string`、`number`、`boolean`、 `null`、`undefined`、`symbol` ES6(2015) 新增、`bigint` ES10(2019) 新增。

引用类型，常见有：

`object` 普通对象、`array` 数组、`function` 函数等。

## typeof

最基础最简单莫过于 `typeof` 了，语法非常简单。 使用 `typeof` 可以返回以下结果：

```js
const type = s => {
  return typeof s
}

console.log(type('abc')) //=> string
console.log(type(123)) //=> number
console.log(type(NaN)) //=> number
console.log(type(BigInt(1))) //=> bigint
console.log(type(true)) //=> boolean
console.log(type(undefined)) //=> undefined
console.log(type(null)) //=> object
console.log(type(Symbol())) //=> symbol
console.log(type(function () {})) //=> function
console.log(type(class B extends A {})) //=> function
console.log(type(class A {})) //=> function
console.log(type([])) //=> object
console.log(type({ a: 1 })) //=> object
console.log(type(/a/g)) //=> object
console.log(type(document.createElement('div'))) //=> object
```

对于基本类型，除了 `null` 不可以判断外，其他都可以准确判断。当然，`null` 再稍微判断处理下也可以的。

下面实现了一个方法，可以准确判断出基本类型，对于引用类型，直接默认都是 `object`：

```js
const type = s => {
  return s === null ? null : typeof s
}
```

## constructor.name

通过构造器来判断类型，这个方案并不常用。因为对于基础类型 `undefined` `null` 还不能直接判断。
不过好在对于一些原生的引用对象类型，可以区分出来。而且它还可以直接识别包装类型，比如 `new Number(1)`，会认为是 `Number` 类型。

相应返回值参考如下：

```js
const type = s => {
  return s.constructor.name
}
console.log(type([]))
console.log(type('abc')) //=> String
console.log(type(123)) //=> Number
console.log(type(NaN)) //=> Number
console.log(type(BigInt(1))) //=> BigInt
console.log(type(true)) //=> Boolean
console.log(type(undefined)) //=> 报错
console.log(type(null)) //=> 报错
console.log(type(Symbol())) //=> Symbol
console.log(type(function () {})) //=> Function
console.log(type(class A {})) //=> Function
console.log(type(class B extends A {})) //=> Function
console.log(type([])) //=> Array
console.log(type({ a: 1 })) //=> Object
console.log(type(/a/g)) //=> RegExp
console.log(type(document.createElement('div'))) //=> HTMLDivElement
console.log(type(new Number(1))) //=> Number
```

除了判断 `constructor.name` 外，有的项目可能直接用 `constructor` 来实现：

```js
const isNumber = s => {
  return s.constructor === Number
}
console.log(isNumber(123)) //=> true
```

由于下面提到的 `Object.prototype.toString.call` 方法比这个更加稳定好用，所以我几乎没见项目使用过。

## Object.prototype.toString.call

这个是项目上非常常用的判断方式，原生的类型不论是基础类型还是引用类型，都可以一步到位。
除非是对象继承没办法判断。而且它还可以直接识别包装类型，比如 `new Number(1)`，会认为是 `Number` 类型。

```js
const type = s => {
  return Object.prototype.toString.call(s)
}

console.log(type('abc')) //=> [object String]
console.log(type(123)) //=> [object Number]
console.log(type(NaN)) //=> [object Number]
console.log(type(BigInt(1))) //=> [object BigInt]
console.log(type(true)) //=> [object Boolean]
console.log(type(undefined)) //=> [object Undefined]
console.log(type(null)) //=> [object Null]
console.log(type(Symbol())) //=> [object Symbol]
console.log(type(function () {})) //=> [object Function]
console.log(type(class A {})) //=> [object Function]
console.log(type(class B extends A {})) //=> [object Function]
console.log(type([])) //=> [object Array]
console.log(type({ a: 1 })) //=> [object Object]
console.log(type(/a/g)) //=> [object RegExp]
console.log(type(document.createElement('div'))) //=> [object HTMLDivElement]
console.log(type(new Number(1))) //=> [object Number]
```

`Object.prototype.toString` 经过查阅规范<sup>[[1]](#参考)</sup>可以返回如下类型：

* `[object Undefined]`
* `[object Null]`
* `[object Array]`
* `[object String]`
* `[object Arguments]`
* `[object Function]`
* `[object Error]`
* `[object Boolean]`
* `[object Number]`
* `[object Date]`
* `[object RegExp]`
* `[object Object]`

项目中，为了判断省事，常常会对返回值进行截取及大小写处理，一般为：

```js
const type = s => {
  return Object.prototype.toString.call(s).slice(8, -1).toLowerCase()
}
console.log(type('abc')) //=> string
```

此外，有的项目可能用 `Reflect` 来实现：

```js
const type = s => {
  return Reflect.apply(Object.prototype.toString, s, [])
}
```

返回的这个类型，一般叫做 tag。要注意的是，这个 tag 是可以人为干扰和定义的（参考<sup>[[2]](#参考)</sup>），比如如下逻辑：

```js
const o = {}
o[Symbol.toStringTag] = "ASDF"
console.log(Object.prototype.toString.call(o)) //=> [object ASDF]
```

这个我看文档，理解为：如果部署了 `[Symbol.toStringTag]` 就应该以部署内容为准（`undefined` `null` 除外）。

但实际测试来看，只有引用类型会受到部署 `[Symbol.toStringTag]` 影响，基本类型不会受到影响，可能部署方法不能生效，也可能规范我理解不对。这个问题原因尚不明确。

## 函数继承判断 instanceof

首先说明的是，`instanceof` 只能判断引用类型，基本类型是判断不了的。因为本质它查询的是继承关系。

```js
console.log('abc' instanceof 'abc') //=> TypeError
console.log('abc' instanceof String) //=> false
console.log(new String('abc') instanceof String) //=> true
```

```js
console.log({} instanceof Object) //=> true
console.log((() => {}) instanceof Function) //=> true
console.log((() => {}) instanceof Object) //=> true
class A {}

class B extends A {}

const b = new B()
console.log(B instanceof A) //=> false
console.log(b instanceof B) //=> true
console.log(b instanceof A) //=> true
```

而且判断时候，应该依次从最小集合逐步开始，比如上例，`b` 要先用 `B` 判断。如果上来就用 `A` 或者 `Object` 判断，不能说明任何继承关系。

实际上，我们也可以自己模拟这个语法，参考<sup>[[3]](#参考)</sup>的代码，贴出如下：

```js
function myInstanceof (left, right) {
  let rightPrototype = right.prototype; // 获取构造函数的显式原型
  let leftProto = left.__proto__; // 获取实例对象的隐式原型
  while (true) {
    // 说明到原型链顶端，还未找到，返回 false
    if (leftProto === null) {
      return false;
    }
    // 隐式原型与显式原型相等
    if (leftProto === rightPrototype) {
      return true;
    }
    // 获取隐式原型的隐式原型，重新赋值给 leftProto
    leftProto = leftProto.__proto__
  }
}
```

所以，更改了父类 `prototype` 或者子类 `__proto__`，都会导致不准。

## 其他的一些判断方式

对于数组判断，可以考虑使用：

```js
Array.isArray([]) //=> true
```

对于数值类 `NaN` `Infinity` 等判断，可以使用以下方法，但要确保是传入是 `Number` 类型：

```js
Number.isNaN(NaN) //=> 数字是否是NaN：true
Number.isFinite(Infinity) //=> 数字是否有限：false
```

## 小结

对于以上方法，整理到表格中，如下：

| 类型                          | typeof | constructor.name | Object.prototype.toString.call | instanceof |
|-----------------------------|--------|------------------|--------------------------------|------------|
| string                      | √      | √                | √                              | X          |
| number                      | √      | √                | √                              | X          |
| bigint                      | √      | √                | √                              | X          |
| boolean                     | √      | √                | √                              | X          |
| null                        | X      | X                | √                              | X          |
| undefined                   | √      | X                | √                              | X          |
| symbol                      | √      | √                | √                              | X          |
| object-普通对象（以object计）       | √      | √                | √                              | √          |
| object-包装基本类型（以原基本类型计）      | X      | √                | √                              | √          |
| object-function（以function计） | √      | √                | √                              | √          |
| object-array（以array计）       | X      | √                | √                              | √          |
| object-其他对象（以对应扩展类型计）       | X      | X                | X                              | √          |
| object-函数继承                 | X      | X                | X                              | √          |

可以看出，如果是基本类型判断，直接使用 `typeof` 或者其补丁版本是非常方便的。

之后更推荐用 `Object.prototype.toString.call` 来判断，一次书写，几乎常规类型都可以判断完成。

如果你的项目带有大量继承关系，而且要对继承关系判断，可以使用 `instanceof`。

## 参考

[1]&nbsp;[ECMA-6 规范-object.prototype.tostring](https://262.ecma-international.org/6.0/#sec-object.prototype.tostring)

[2]&nbsp;[从深入到通俗：Object.prototype.toString.call()](https://zhuanlan.zhihu.com/p/118793721)

[3]&nbsp;[instanceof实现的原理是什么？](https://zhuanlan.zhihu.com/p/521832918)
