---
layout: post
title: 网页增加水印 
date: 2021-04-26 22:08:00 GMT+0800
categories: [前端]
tags:  [水印]
---

之前看到有的内部项目，为了防止外放，再或者为了方便调试，都会为项目页面增加水印。

<!-- more -->

特意找了个网上的项目，查看了一下，结果发现实现起来特别简单。

```html
<style>
    .wm {
        position: fixed;
        top: 0;
        left: 0;
        overflow: hidden;
        z-index: 9999;
        display: block;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
    }

    .wm div {
        margin-bottom: 200px;
        font-size: 12px;
        color: #f1f1f1;
        transform: rotate(-45deg);
    }
</style>

<div class="wm">
    <div>
        <p>项目水印@13901234567</p>
        <p>ver:1.3.0,time:2021-04-26 20:00:00</p>
    </div>
    <div>
        <p>项目水印@13901234567</p>
        <p>ver:1.3.0,time:2021-04-26 20:00:00</p>
    </div>
</div>
```

主要就是加一个水印图层，控制好展示位置和效果就行了。文案可以写上一些调试信息，页面 url 之类，防止无法追溯。

其中关键的代码是：

```css
z-index: 9999;
pointer-events: none;
```

* 要保持水印图层是最高层级的。

* 同时这个图层屏蔽掉所有事件，否则就会变成常用的遮罩层，遮挡正常的业务点击了。

效果如下：

![水印效果](https://cdn0.yukapril.com/2021-04-26-watermark.png-wm.black)

这个功能还挺实用的。在多个业务之间互相跳转，或者后退，还有可能白屏的时候，加上水印，没有水印就不是自己的项目，可以防止项目间扯皮。

--END--
