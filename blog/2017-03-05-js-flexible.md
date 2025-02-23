---
title: "移动端采用flexible布局 安卓机华为vivo 10rem大于屏幕宽度的解决办法"
date: 2017-03-05 22:35:00 GMT+0800
tags: [ flexible ]
---

在我们的新项目中，依旧采用了传统的flexible思路，对屏幕进行分割，通过 rem 来进行比例适配。

<!-- truncate -->

## 简易 flexible 的思路

首先获得屏幕宽度，并将其平均分10份，比如安卓机，屏幕宽度360px，每一份就是36px。

然后把一份的宽度写入根节点。 `html style="font-size:36px"`。之后，如果想用25%的屏幕宽度，直接写2.5rem就行了。这样好处是不用从父级到子级一层一层的传递宽度，尤其是每次都要写100%。

之后，还应该把body元素字体重设下。这样em也可以很好的使用。`body style="font-size:16px"`。

正常情况下，只需要四行代码就可以搞定。

* 获取屏幕宽度
* 将屏幕宽度分成10份
* 将每一份宽度写入根节点
* 重设下body字体大小

如果你更希望更好一些，可以把屏幕旋转加上，旋转后触发这四步操作。

基本上就这样，在不考虑dpr为 2 或者 3 的时候，这样做已经完全满足了。

> 为什么不是平分100份呢？比如iPhone 6s Plus，屏幕宽度414px（默认dpr=1），如果分成100份，每份是4.14px，太小了，很多时候支持不了。和文字过小被限制差不多。如果分成25份，额，计算太麻烦了而已。

## 问题出现

之前一直按照上文那么做，也没发现问题。应该是也没接到问题反馈。

但是这次遇到了一个奇葩情况。

360px宽度的安卓机vivo，html已经设置为36px。有元素10rem，正常情况下，别的机型都是等于360px宽（屏宽），但是此机型奇葩，通过js计算后获取，值为392.03125px。如果不用rem，用100%，则没有问题。

问题出现在安卓APP的webview中。至于手机浏览器中是否会出问题，我忘记了。

网上也没有关于这方面的资料。

唯独一条记录在这里：[segmentfault](https://segmentfault.com/q/1010000006851410)

## 问题的解决

后来曾经巧合，阅读到一篇文章，大概也是说页面缩放-375px屏幕的实现。出的问题结果和我们的情况是一致的。意思是 `initial-scale`
要进行设置。我检查了下，我们的代码也写好了。但还是不行。[文章见此](https://github.com/ShowJoy-com/showjoy-blog/issues/6) ，以及他的文章参考了[这里](http://lvdada.org/2016/01/28/viewport-and-flexibleJs/)。

他的文章思路是修改scale数值，以便达到用360px宽度的屏幕，显示375px的内容。

而我们思考的方向，是针对出问题的机型，进行fontSize修复。

我们的思路是，首先用标准方案（上文四步方法），然后进行检查。安卓机全部要添加一个10rem元素，检查其计算宽度和屏幕宽度的比例，如果10rem元素超过屏幕宽度了，那就是当前机器出问题，此时需要进行修复。

修复方法和他们的计算一致，看看尺寸比正常的屏幕宽度大了多少倍。大了多少倍，就把fontSize缩小多少倍。

**这两种方式的区别：**

* 他们的是定宽（此时所有机器都采用了设计稿的一半，375px）但是修复起来简单质量高，缺点是414px的iPhone，也要降低屏幕宽度，在文字显示上吃亏，因为屏幕最多只有375px，文字是按照px定义的。（我这么认为的）
* 我们是常规宽，大屏机用自己的大宽度，小屏机用自己的小屏宽度，图片缩放和他们一样都是屏幕比例，但是文字展示上不会受影响。

> 一般情况下，用了flexible方案，仅仅对布局使用rem，而对文字之类，还是使用px或em为单位。用了rem或进行等比缩小，小屏手机文字会看不清或者浏览器禁止设置过小的字体。

## 最后，附上我们的解决方案代码

```js
(function (win) {
  // html根元素
  var HTML_ELEMENT = document.documentElement;
  // 屏幕宽度
  var SCREEN_WIDTH = 0;
  // 标准fontSize计算值
  var BASE_FONT_SIZE = 0;
  // 处理后的fontSize计算值
  var REAL_BASE_FONT_SIZE = 0;

  /**
   * 修复异常的fontSize代码
   */
  var fix = function () {
    var ua = navigator.userAgent;
    var isIOS = /(iPhone|iPad|iPod)/.test(ua);
    // 非苹果设备，均进行检测
    if (!isIOS) {
      var div = win.document.createElement('div');
      div.style.width = '10rem';
      win.document.body.appendChild(div);
      win.setTimeout(function () {
        var getWidth = parseFloat(win.getComputedStyle(div).width);
        if (getWidth > SCREEN_WIDTH) {
          // 此时是出问题的情况
          var ratio = getWidth / SCREEN_WIDTH;
          REAL_BASE_FONT_SIZE = (BASE_FONT_SIZE / ratio).toFixed(4);
          HTML_ELEMENT.style.fontSize = REAL_BASE_FONT_SIZE + 'px';
        }
        div.remove();
      }, 100);
    }
  };

  /**
   * 调整根元素fontSize
   */
  var setBaseFontSize = function () {
    // 获取屏幕宽度
    SCREEN_WIDTH = HTML_ELEMENT.clientWidth;
    // 将屏幕分成10份，获取每一份宽度
    BASE_FONT_SIZE = SCREEN_WIDTH / 10;
    // 写入html元素fontSize
    HTML_ELEMENT.style.fontSize = BASE_FONT_SIZE + 'px';
    fix();
  };

  /**
   *手机旋转控制
   */
  var tid;
  if (win.onorientationchange) {
    win.onorientationchange = function () {
      clearTimeout(tid);
      tid = setTimeout(function () {
        setBaseFontSize();
      }, 300);
    }
  } else {
    win.onresize = function () {
      clearTimeout(tid);
      tid = setTimeout(function () {
        setBaseFontSize();
      }, 300);
    };
  }
  setBaseFontSize();
})(window);
```
