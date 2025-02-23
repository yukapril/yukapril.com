---
title: "webpack uglifyJS 在 IE8 下的兼容处理"
date: 2017-08-05 11:34:00 GMT+0800
tags: [ webpack, uglifyjs, ie8 ]
---

最近在做组件项目，写 ES6 代码，通过 webpack3 进行打包，中途用 uglifyjs-webpack-plugin 插件进行压缩。

考虑到各个项目都能用得上，所以最终打包格式选择了 `umd`。

<!-- truncate -->

## 基础处理

首先，IE8 不支持的东西太多了，所以必须用垫片修补下。

由于我确实不了解 `babel-polyfill`，而且组件可能不只这一个，也不可能只在一个项目中去用，看了下 `babel-polyfill` 的引入方式，基本上都是直接放到最终代码中的，在大项目中我认为算是首选。

所以采用了 `shim` + `sham` 的方案，个别功能（比如 `Element.prototype.classList`），采用自己写补丁的方式实现。

最终，在页面这样写：

```html
<!doctype html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Test</title>
    <!--[if lt IE 9]>
    <script src="../lib/es5-shim.min.js"></script>
    <script src="../lib/es5-sham.min.js"></script>
    <![endif]-->
    <!--[if lte IE 9]>
    <script src="../lib/ie.min.js"></script>
    <![endif]-->
</head>
<body>
...
</body>
</html>
```

通过 IE 的注释语法，特定情况下加载特定 JS 来实现。

由于我需要针对 IE9 做一些补丁，所以额外打了一个 ie.min.js 补丁。

这样，大部分ES5 的兼容性问题都可以解决了。

## webpack

首先说说 webpack，这个网上有人说，webpack1 支持 IE8，从 webpack2 开始不支持了。

具体我没有深究，但是我用 webpack3，是可以实现兼容的。

首先是必须打上面的补丁，让 IE8 支持 ES5，最重要的是 `sham` 也是必须的，主要用来实现 `Object.defineProperty` ，虽然可能稳定性欠佳。

webpack 打包（`umd` 方式）后，未压缩的代码部分：

```js
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var Checkbox = function () {
  function Checkbox(element) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    _classCallCheck(this, Checkbox);
  }

  _createClass(Checkbox, [{
    key: 'on',
    value: function on() {
    }
  }]);
  return Checkbox;
}();
```

之后，webpack 采用 defineProperty 进行定义属性，所以才必须打这个补丁。

可能 webpack1 最终打包的方式不同，不需要对 `Object.defineProperty` 打补丁，才有人说 webpack1 才支持 IE8 这种说法。

本身，webpack 不需要做任何兼容处理修改，只需要之前的补丁即可。

#### 小问题

但是，在编译过程中，曾经遇到了一个问题，随后莫名其妙自己没问题了，尚不清楚原因所在。

在上面代码中，有一步 `_classCallCheck(this,Checkbox)`，这个竟然 `throw new TypeError` 了，原本上用 `class Checkbox`，改成了 `function Checkbox(){}`，最后又改回去了，自己就好了。

## 代码压缩 uglifyJS

这个问题比较大，不过还好可以通过配置来解决。

首先，webpack3 的插件 `uglifyjs-webpack-plugin` 目前只支持 `uglify-js` 2.x 系列。所以必须确保 `uglify-js` 是2.x 版本。

> 就在写这篇文章前 9 天，`uglifyjs-webpack-plugin` 开始支持 `uglify-js` 3.x 系列了。

上面这个解决，下面的问题就好说了。

说先明确下，uglifyJS 默认压缩，不兼容 IE8 的，但是它有一个配置，可以兼容 IE8。

方法描述摘抄如下：

> ```
>--screw-ie8     Use this flag if you don't wish to support
>                Internet Explorer 6/7/8.
>                By default UglifyJS will not try to be IE-proof.
>--support-ie8   Use this flag to support Internet Explorer 6/7/8.
>                Equivalent to setting `screw_ie8: false` in `minify()`
>                for `compress`, `mangle` and `output` options.
>```

意思是说， `--screw-ie8` 开启后，不支持IE6/7/8。但是可以关闭啊。默认是开启的。`--support-ie8` 也行，等同于设置 balabala 很多兼容 IE 的参数。

这里有个坑，那就是：`uglifyjs-webpack-plugin` 不支持 `--support-ie8` 这个参数。[issue 见此](https://github.com/webpack/webpack/issues/3614)

所以换成 `--screw-ie8`  就好了。具体配置如下：

```js
new UglifyJSPlugin({
  compress: {screw_ie8: false},
  output: {screw_ie8: false},
  mangle: {
    screw_ie8: false,
    except: ['$']
  },
  support_ie8: true
})
```

就是在 `compress` 中写入 `screw_ie8` 就好了。

**至于网上说的什么 IE8 不能支持混淆啥的，我没发现问题，可以使用混淆。**













