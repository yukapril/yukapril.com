---
layout: post
title: iOS disabled 颜色样式过浅问题
date: 2021-04-28 21:11:00 GMT+0800
categories: [前端]
tags:  [disabled]
---

之前一次在做输入框 `disabled` 时候，发现电脑浏览器模拟没问题，安卓手机没问题，但是 iPhone 手机竟然获取不到内容。反复排查，才发现是输入框中有内容，但是文字颜色太浅了，导致肉眼极难看见。

<!-- more -->

当时项目是输入框只有一条横线，背景也是要求透明。当 `disabled` 后，要求默认颜色变成浅灰。结果背景也是稍微带有点点灰色。

最早遇到这个问题，临时解决起来方案就是——不用 `disabled` 就行了。改用 `readonly` 了。

这次特意查了一下，需要增加 `-webkit-text-fill-color` 以及要调整  `opacity`，这算是受教了。

对比代码如下：

```html
<style>
    h1 {
        font-size: 20px;
    }

    input,
    textarea {
        display: block;
        margin: 4px 0;
        width: 200px;
    }

    .disabled {
        color: #ccc;
    }

    .fix-disabled {
        opacity: 1;
        -webkit-text-fill-color: #ccc;
        color: #ccc;
    }
</style>
<div>
    <h1>默认情况</h1>
    <input type="text" disabled value="测试内容">
    <textarea disabled>测试内容</textarea>
</div>
<div>
    <h1>直接修改disabled颜色</h1>
    <input class="disabled" type="text" disabled value="测试内容">
    <textarea class="disabled" disabled>测试内容</textarea>
</div>
<div>
    <h1>修改调整后disabled颜色</h1>
    <input class="fix-disabled" type="text" disabled value="测试内容">
    <textarea class="fix-disabled" disabled>测试内容</textarea>
</div>
```

实际安卓手机效果图：

![安卓效果](https://cdn0.yukapril.com/2021-04-28-disabled-1.png-wm.black)

实际 iPhone 效果图：

> 直接修改 `disabled` 颜色，会导致文字特别浅，配合灰色背景很可能看不到。

![iPhone 效果](https://cdn0.yukapril.com/2021-04-28-disabled-2.png-wm.black)

--END--
