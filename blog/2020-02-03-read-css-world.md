---
title: CSS世界阅读笔记（一）
date: 2020-02-03 22:18:00 GMT+0800
tags: [ css, 读书 ]
---

过节实在是无聊，也没办法出门，就拿出书看看，结果收获颇多。

<!-- truncate -->

## 文本少居中，多时候左对齐

这个特别有趣，自己一时没想到。

```html
HTML：
<div class="box">
    <p class="content">文字内容</p>
</div>
```

```css
.box {
    padding: 10px;
    background-color: #cd0000;
    text-align: center;
}

.content {
    display: inline-block;
    text-align: left;
}
```

父元素设置文字居中，子元素设置为行内块。这样文字内容少的时候，行内块没办法撑满整个父元素宽度，表现出居中特性。此时子元素对齐方式没有任何效果。

当子元素文字过多时候，会撑满父元素宽度。此时父元素文字居中对齐就没有效果了。子元素撑满父元素后，子元素的对齐方式开始起作用。

具体例子参见[这里](https://demo.cssworld.cn/3/2-5.php)。

## 父元素宽度为 0

如果把父元素宽度改为 0，那么子元素默认宽度 `width: auto` 不会继承 0，而是看看子元素文字等宽度，比如文字设置 `font-size: 20px`，那么子元素宽度大概是 `20px` 多一点。

## 利用首选最小宽度画凹凸

把块元素宽度改为 0，利用文字不同宽度和换行，实现描边。

这个太有创意了，但感觉实际项目没啥用途。

具体例子参见[这里](https://demo.cssworld.cn/3/2-6.php)。

## box-sizing

写页面经常先写上这句话：

```css
body * {
    box-sizing: border-box;
}
```

后续直接定义宽度 width 就好了，不会导致元素超过尺寸，但是具体为什么，也不清楚。

看过书才明白，原来它是决定宽度 width 作用在什么盒子上。

从元素本身开始，由内到外依次是：

```
content --> padding --> border --> margin
```

对应的属性是：

```
content-box --> padding-box --> border-box --> margin-box
```

默认情况下，宽度作用在元素本身，所以调整 `padding` `border` 会导致元素尺寸变化！

但如果作用到 `border` 上呢？自然这个问题迎刃而解。

除了默认的 `content-box` 和常用的 `border-box` 外，另外两个基本上浏览器不支持。
