---
sidebar_position: 2
---

# ToString 处理方案

一个值，执行 `String(value)` 后，有的时候相当于调用自身的 `value.toString()` 方法，有时候又是规定规范返回值。此外，针对数字转字符串，还有一些坑。

这个问题，根据规范<sup>[[1]](#参考)</sup>，我们可以分开讨论。

## Undefined

规范约定，返回定值字符串 `undefined`：

```js
String(undefined) // 返回字符串 undefined
```

## Null

规范约定，返回定值字符串 `null`：

```js
String(null) // 返回字符串 null
```

## Boolean

规范约定，根据情况返回字符串 `true` `false`：

```js
String(true) // 返回字符串 true
String(false) // 返回字符串 false
```

## String

规范约定，原样返回：

```js
String('abc') // 返回字符串 abc
```

## Symbol

规范约定，抛出 `TypeError` 错误，但是实际测试来看是返回字符串 `Symbol()`

```js
String(Symbol()) // 返回字符串 Symbol()
```

## Number

数字类型麻烦一些，要区分对待。

1. 如果是 `NaN`，则返回定值字符串 `NaN`

```js
String(NaN) // 返回字符串 NaN
```

2. 如果是 `+0` `-0`，则返回无符号定值字符串 `0`

```js
String(+0)
// 等价于
String(0) // 返回字符串 0

String(-0) // 返回字符串 0
```

3. 如果是小于零，则变成计算相反的数值，最终拼接负号

> 后续只考虑正向即可，负向只需参考本规则

```js
String(-20)
// 等价于
"-" + String(20) // 返回字符串 -20
```

4. 如果是 `+∞`，则返回定值字符串 `Infinity`

```js
String(Infinity) // 返回字符串 Infinity
```

如果是 `-∞`，则返回定值字符串 `-Infinity` （可以参考规则 3）

```js
String(-Infinity) // 返回字符串 -Infinity
```

5. 如果比较大，大于 `Number.MAX_SAFE_INTEGER`，则返回不准确

```js
String(Number.MAX_SAFE_INTEGER) // 返回字符串 9007199254740991，是正确的
String(Number.MAX_SAFE_INTEGER + 2) // 返回字符串 9007199254740992，应该是 9007199254740993
```

6. 如果特别大，超过 `1e21`，不论是按照科学计数法还是直接写数字，都会采用科学计数法表示

```js
String(1e20)
// 等价于
String(100000000000000000000) // 返回字符串 100000000000000000000

String(1e21)
// 等价于
String(1000000000000000000000) // 返回字符串 1e+21

String(1E21)
// 等价于
String(1000000000000000000000) // 返回字符串 1e+21
```

7. 如果特别小，超过 `1e-7`，不论是按照科学计数法还是直接写数字，都会采用科学计数法表示

```js
String(0.0000001)
// 等价于
String(1e-7) // 返回字符串 1e-7
```

## BigInt

这个还没有进入正式规范。但大致是类似 `Number`

```js
String(+0n) // 错误！见下文
String(0n) // 返回字符串 0
String(-0n) // 返回字符串 0
String(9007199254740991234n) // 返回字符串 9007199254740991234
String(BigInt(1e23)) // 返回字符串 99999999999999991611392，也是不准的
```

为了兼容 asm.js ，BigInt 不支持单目 (+) 运算符。<sup>[[2]](#参考)</sup>

## Object

规范中要求先执行 `ToPrimitive`，转成原始类型，之后再进行 `ToString`。

`ToPrimitive` 简单说就是：

* 先执行 `valueOf`，如果能得到原始类型，结束
* 其次执行 `toString`，如果能得到原始类型，结束
* 抛错

但是，如果 `ToPrimitive` 首选类型是 `String`，则先执行 `toString`，之后再执行 `valueOf`！

比如本处就是如此。

具体看下面的例子来理解：

```js
const obj1 = {
  valueOf () {
    console.log('valueOf')
    return '123'
  },
  toString () {
    console.log('toString')
    return 234
  }
}

String(obj1)
// 打印 toString
// 由于调用 toString 后返回了基础类型，ToPrimitive 逻辑结束
// 返回字符串 234
```

```js
const obj2 = {
  valueOf () {
    console.log('valueOf')
    return '123'
  },
  toString () {
    console.log('toString')
    return {}
  }
}

String(obj2)
// 打印 toString
// 由于调用 toString 后返回非基础类型，则继续调用 valueOf
// 打印 valueOf
// 由于调用 valueOf 后返回了基础类型，ToPrimitive 逻辑结束
// 返回字符串 123
```

## 参考

[1]&nbsp;[ECMA-6 规范-ToString](https://262.ecma-international.org/6.0/#sec-tostring)

[2]&nbsp;[BigInt MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
