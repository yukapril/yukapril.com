---
title: CSS世界阅读笔记（二）
date: 2020-11-22 16:26:00 GMT+0800
tags: [ css, 读书 ]
---

今年特别忙。年初看的《CSS 世界》，刚有时间看第二次。

<!-- truncate -->

## 替换元素（图片替换）

比如图片悬停遮罩之类功能，一般正如作者所说，使用两个元素，用 js 控制。

完全没想到还有 `content` 这种用法。

```html

<style>
    img {
        width: 100px;
        height: 100px;
    }

    img:hover {
        content: url("https://images.unsplash.com/photo-1586971934493-d6829d89393c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80");
    }
</style>


<img src="https://images.unsplash.com/photo-1562887284-8ba6b7c90fd8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80"/>

```

不仅如此， `h1` 之类的元素，加入 `content` 也可以变成替换元素。

## 伪元素单冒号双冒号

貌似 IE8 开始，及之后浏览器支持伪元素。

而 IE8 只支持单冒号的写法，其他后续浏览器支持双冒号写法。

所以一般要支持 IE8 的话，就要写单冒号。常见于 `:after`。

## 标签元素内置的 padding

我知道很多元素都有内 padding，一般简单来说就是全局重置下：

```css
* {
    margin: 0;
    padding: 0;
}
```

button 比较特殊，据说火狐浏览器用上述方案还会左右留下内边距。可能是我很多年没有在做过 PC 端研发了，这个完全不清楚。需要对按钮特殊处理下：

```css
button::-moz-focus-inner {
    padding: 0;
}
```

不过类似的问题我倒是遇到过，大致是在 safari 下，按钮样式和其他浏览器有些许不同。也是需要改变私有属性。当时我记得是：

```css
button {
    -webkit-appearance: none;
}

```

## 绘制三道杠（移动端常见菜单按钮图标）

如果是我估计就会直接用元素画一根线，剩余两根用两个伪元素来实现。书中给出了用 `border` 来进行画上下两根线的方案。关键是我就算知道这个思路也画不出来，因为没用过也不会用 `background-clip`：

```html

<div class="flex">
    <div class="div1"></div>
    <div>&nbsp;</div>
    <div class="div2"></div>
</div>
```

```css
.flex {
    display: flex;
}

/* 常规伪元素画法 */
.div1 {
    position: relative;
    margin-bottom: 10px;
    width: 13px;
    height: 3px;
    background-color: #000;
}

.div1::before {
    content: '';
    position: relative;
    top: 5px;
    display: block;
    width: 13px;
    height: 3px;
    background-color: #000;
}

.div1::after {
    content: '';
    position: relative;
    top: 7px;
    display: block;
    width: 13px;
    height: 3px;
    background-color: #000;
}

/* 简便方法 */
.div2 {
    padding: 2px 0;
    width: 13px;
    height: 3px;
    border-top: 3px solid #000;
    border-bottom: 3px solid #000;
    background-color: #000;
    background-clip: content-box;
}
```

具体例子参见[这里](https://demo.cssworld.cn/4/2-4.php)。

## 左右等高

常见的，一个容器内左右两侧内容不一样多，但是要求两侧的元素是一样高的，而且常见两侧元素有不同的背景（或颜色）。

这种情况主要是不确定那一侧内容比较多，而且大小不是固定的。因为如果已知内容高度，那么左右两侧直接写死高度就行了。

现在的我只能想到 `flex` 写法，非常简单就能实现。

文中给出了负 margin 解法，也听说过，不过也早忘记了。

```html

<div class="box">
    <div class="div1">
        <p>1</p>
        <p>2</p>
        <p>3</p>
        <p>4</p>
    </div>
    <div class="div2">
        <p>1</p>
    </div>
</div>
```

```css
.box {
    overflow: hidden;
}

.div1 {
    background-color: red;
}

.div2 {
    background-color: blue;
}

.div1, .div2 {
    float: left;
    margin-bottom: -9999px;
    padding-bottom: 9999px;
    width: 100px;
}
```

此外文章还提到了 `table-cell` 解法，连查待尝试，摸索出来了。

```css
.box {
}

.div1 {
    background-color: red;
}

.div2 {
    background-color: blue;
}

.div1, .div2 {
    display: table-cell;
    width: 100px;
}
```

具体例子参见[这里](https://demo.cssworld.cn/4/3-2.php)。
