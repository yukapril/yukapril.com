---
title: "js 模板编译的实现"
date: 2017-01-09 21:03:00 GMT+0800
tags: [ 模板, 编译 ]
---

看过很多模板，语法各不相同，执行效率也差异很大。在用angular 1 的时候，有一个名词是编译（$compile）。我很诧异，js作为解释型语言，为什么要编译？

后来我也看过一些模板文章，终于明白的编译的用意。

<!-- truncate -->

## 编译是什么

我认为编译是一种格式变成另一种格式的过程。编译会导致好的结果，比如书写简单的代码，编译出来复杂的代码；或者，提高代码的使用性能。

比如说`jade` （现在改名叫做`pug`），就是编译从简单到复杂的过程

```html
p hello!
```

这和html也相差太远了吧？所以，需要用插件对其进行编译，编译成`<p>hello!</p>`，之后我们就可以拿着编译后的内容随意使用了。

**这里我更想说模板。** 写一个最简单的模板。

```html
<p>Hello, { {name} }!</p>
```

这个模板用数据`{name:'world'}`渲染后的结果就是：

```html
<p>Hello, world!</p>
```

来个问题，这个你怎么实现？

## 模板的简单实现

继续说上一个问题。来看看如何实现。

如果项目非常简单，都不用任何框架，自己写一个就好。写法原理很简单：正则查找替换就行了。

```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>template</title>
</head>

<body>
<script>
    var template = function (tpl, data) {
        var ret = tpl;
        for (var item in data) {
            // 遍历data每一个字段
            if (data.hasOwnProperty(item)) {
                var re = new RegExp('{ {' + item + '} }', 'g');
                ret = ret.replace(re, data[item]);
            }
        }
        return ret;
    };

    var tpl = "<p>Hello, I'm { {name} }! { {age} } years old!</p>";
    var data = {
        name: 'Jason',
        age: 25
    };
    var result = template(tpl, data);
    console.log(result);
</script>
</body>

</html>
```

这个难度很低，直接正则替换就实现了，不做解释了。这个真的太简单了，因为除了正则替换字段，啥都干不了。

不信看看这个简单的需求：

模板：

```html
<p>Hello, I'm { {user.name} }! { {user.age} } years old!</p>
```

渲染数据是：

```js
var data = {
  user: {
    name: 'Jason',
    age: 25
  }
}
```

还用上面的方法，就失效了。还用正则的话，就很难来做了。因为需要做语法/词法分析，看看大括号内写的是什么了。

## 模板编译

我们先回到最简单的例子上来说。

上面，我们实现的思路是，每次传入模板和数据，执行正则替换。假设10个字段，就是替换10次。这样性能也是个问题，因为每次都要跑循环去正则去替换。而且这还仅仅是单数据渲染，如果要是加上 `if` `for` 这样的语法可咋办？

对于上面的这个模板，其实也可以这样来写：

```js
var tpl = function (data) {
  return "<p>Hello, I'm " + data.name + "! " + data.age + " years old!</p>";
}
```

这么写的好处：只需一次**编译**，之后再使用只需直接填充数据即可。而且可以方便的支持 `data.user.name` 这种形式。

这里涉及一个功能点，一般可能用不到，我点一下。

#### 通过字符串生成函数

我们要生成一个函数，传入 `x` `y` ，执行 `return x + y`来获得求和功能。

可以这样写：

```js
var fn = new Function('x', 'y', 'return x + y');

console.log(fn);

// 返回
(function (x, y
           /**/) {
  return x + y
})
```

通过`new Function`，我们可以创造函数。下文会用到。

#### 模板编译

我们先整理下思路，应该是传入tpl模板字符串，通过 `new Function` 方式返回一个新函数。新函数接收一个对象，我叫做 `obj`。

```js
var template = function (tpl) {
  // 模板字符串
  var retStr = '';
  //...
  return new Function('obj', retStr);
};
```

我们接下来要做的是，把`{ {xxx.xxx} }`部分都找出来，替换为`obj.xxx.xxx`就行了。

```js
var template = function (tpl) {
  // 模板字符串
  var retStr = tpl.replace(/{ {(.+?)} }/g, 'obj.$1');
  retStr = 'return "' + retStr + '"';
  return new Function('obj', retStr);
};

var tpl = "<p>Hello, I'm { {user.name} }! { {user.age} } years old!</p>";
var render = template(tpl);
console.log(render);
```

这样写，发现函数是

```js
function anonymous(obj
                   /**/) {
  return "<p>Hello, I'm obj.user.name! obj.user.age years old!</p>"
}
```

很明显不行，至少应该把正则替换那句修改下，前后加上引号和加号才行。最终变成这样子：

```js
var template = function (tpl) {
  // 模板字符串
  var retStr = tpl.replace(/{ {(.+?)} }/g, '" + obj.$1 + "');
  retStr = 'return "' + retStr + '"';
  return new Function('obj', retStr);
};

var tpl = "<p>Hello, I'm { {user.name} }! { {user.age} } years old!</p>";
var data = {
  user: {
    name: 'Jason',
    age: 25
  }
};
var render = template(tpl);
console.log(render);
var result = render(data);
console.log(result);
```

我们可以看到结果正常了

函数是：

```js
function anonymous(obj
                   /**/) {
  return "<p>Hello, I'm " + obj.user.name + "! " + obj.user.age + " years old!</p>"
}
```

渲染结果是：

```html
<p>Hello, I'm Jason! 25 years old!</p>
```

## 高级模板编译

上面的例子，可以处理各种对象形式的赋值。我们还应该支持 `if` `for` 这样的语法。 这里我就不展开写了。代码我放在了 [Github - template-render](https://github.com/yukapril/template-render)
。代码是ES6的，可以放在最新的浏览器执行，或者**自行**去编译。

我说下过程：

1. 字符串模板解析：要从模板中分析出那些是普通字符串，那些是模板代码。见 [`parse2array`](https://github.com/yukapril/template-render/blob/master/template.js#L27) 方法。
2. 合成返回函数主体：可以直接写入字符串，也有人喜欢写入数组（最后执行`arr.join('')`
   ）。要区分三种情况，普通字符串（直接简单处理返回就行），普通赋值语法（稍作处理返回），高级语法字符串（需要根据你自己定义的模板语法来写解释器）。见 [编译为函数](https://github.com/yukapril/template-render/blob/master/template.js#L92)
   和 [高级语法处理 - syntaxParse](https://github.com/yukapril/template-render/blob/master/template.js#L67)。
3. 将第二步的内容稍加处理，采用 `new Function` 返回就行了。见 [最后处理并返回](https://github.com/yukapril/template-render/blob/master/template.js#L109)

还有一些经验可以借鉴：

1. 使用`with`语法。这样可以方便的处理多层的对象，对上文来说，就是可以省去正则替换后中的 `obj` 了。这个灵感好像来源于Vue，我记得在哪里听说过。
   这个语法我没用过，曾经听说是效率低下，现在不太清楚。可以参见[这里](https://www.zhihu.com/question/49929356)。

2. 我对逻辑循环等语法进行了设计，比如：

```html
{ {# each hobbys as item } }
<li>{ {$index+1} }/{ {$length} } - { {item} }</li>
{ {# endeach } }
```

我也见有人这里干脆不设计，直接就用原生js语法，那么上面的三步过程，可以调整为两步：第一步解析，第二步当做js语法进行拼接处理。

思路例子总归是例子，虽然功能可以用，但是还有许多需要完善的地方，比如要渲染的字符串是html怎么办，应该需要转义处理；模板换行等需要处理（例子里面我已经处理了），如果渲染的字段不是字符串而是函数要处理（例子里面部分位置已经处理），渲染数据缺失情况等处理。

----

通过做模板编译这个例子，就会感觉到React的JSX设计还是有道理的，方便解析，方便书写，就是不方便理解...
