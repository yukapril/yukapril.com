---
title: "使用 webpack 编译 less 后 z-index 值改变处理"
date: 2018-02-10 17:10:00 GMT+0800
tags: [ webpack, less, OptimizeCssAssetsPlugin, cssnano ]
---

在一个老项目中新增加了功能，使用 webpack 编译后，发现其 `z-index` 被改变了，原本有的组件设置类似为 999 的都被优化为 1～9 了。看来得在插件上找问题。

老项目仅仅是用 webpack 进行打包，同时使用了 less 进行开发。首先可以判断不是 less 转码的问题，否则 less 就太乱来了。

剩下就是在js 中完成 css 的抽取，以及 css 的压缩优化。

<!-- truncate -->

## 问题处理

重点需要关注 css 优化部分，使用的是 `optimize-css-assets-webpack-plugin` 插件，插件内部调用 `cssnano` 处理器。

项目编译配置如下：

```js
let OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
// ...

new OptimizeCssAssetsPlugin({
  assetNameRegExp: /\.css$/g,
  cssProcessor: require('cssnano'),
  cssProcessorOptions: {
    discardComments: {removeAll: true},
    autoprefixer: {add: true, browsers: ['last 2 versions']},
    reduceIdents: false
  },
  canPrint: true
})
```

查阅 [optimize-css-assets-webpack-plugin](https://github.com/NMFR/optimize-css-assets-webpack-plugin) 简陋的文档：

![image](https://cdn1.yukapril.com/2018-02-10-webpack-less.png)

意思是说，啥都没做，只是把 `cssProcessorOptions` 的配置传给处理器 `cssProcessor` 而已。

再查阅 [cssnano](http://cssnano.co/guides/optimisations/) 文档：

可以看到，默认情况下，`autoprefixer` `postcss-discard-unused` `postcss-merge-idents` `postcss-reduce-idents` `postcss-zindex` 都是不开启的，但是在项目中莫名其妙默认开启了。

其中 `autoprefixer` 确实需要，所以进行了配置。`postcss-discard-unused` 和 `postcss-merge-idents` 没有什么危害，也就没有注意到。

但是曾经遇到过 `@keyframes` 样式被改名的情况（效果参见[这里](http://cssnano.co/optimisations/reduceidents/)），所以特意进行配置 `false` 了。

所以这次还应该进行配置，增加一条：

```js
new OptimizeCssAssetsPlugin({
  assetNameRegExp: /\.css$/g,
  cssProcessor: require('cssnano'),
  cssProcessorOptions: {
    discardComments: {removeAll: true},
    autoprefixer: {add: true, browsers: ['last 2 versions']},
    reduceIdents: false,
    zindex: false
  },
  canPrint: true
})
```

这样问题就解决了。

## 后记

仔细检查了下，项目中使用的 `cssnano` 是 3.10.0 版本。也就是说，v3 系列默认都是开启的，文档看的是 v4 的。可以参考这个 [issue](https://github.com/ben-eb/cssnano/issues/358)。

同时，3.10.0 源码中也有注意到：

```js
// Prevent PostCSS from throwing when safe is defined
if (options.safe === true) {
  options.isSafe = true;
  options.safe = null;
}

const safe = options.isSafe;
```

```js
opts = assign({},
  defaultOptions[plugin],
  safe ? safeOptions[plugin] : null,
  opts
);
```

如果在参数里面加上 `safe/isSafe` 字段，也可以解决此问题。`safe` 是老版本遗留下来的字段，`isSafe`是新字段而已。
