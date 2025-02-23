---
title: useragent 详解
date: 2018-10-13 22:02:00 GMT+0800
tags: [ useragent ]
---

因为工作需要，稍微认真的了解了下 useragent，发现它的配置理想和现实还是差距很大的。至于历史什么的，详细的就不多说了，很多网站可以搜索到。总之，各个浏览器厂商为了能所谓的页面兼容，useragent 也越来越相似。

也正是因为现行技术实现上，这些所谓的适配，大部分时候都是根据正则表达式来匹配相关字段，匹配成功即认定当前设备符合预期。但鲜有文章去详谈 useragent 每个字段的具体含义。这也正是本文要做的事情。

由于没有找到相关的资料，有的结论论断和理解方式，只是我自己的想法，可能与实际有出入。

<!-- truncate -->

## useragent 的使用

在做各种 web 时候，经常会根据用户的 useragent 来进行一些判断。比如设备机型、系统、浏览器类型等。

有些是需要进行统计分析。如百度/google 统计之类，获取用户当前所有设备的信息，用于数据的分析和业务支撑。

有些是需要风控需要。这里尤其金融方向的业务用的颇多，通过判断用户设配类型、IP等是否与之前一致，来确认用户账号是否被盗。

还有一些时候是业务逻辑的设计需要。比如 iOS 和 Android 用户要区分对待，不同系统可能要展示的功能有区别等。（为了抵消歧视，你可以想做帮助页面，iOS 和 Android 因为按钮位置等不同，截图也不相同，帮助文档也是不同的）

还有一些功能逻辑，是需要单独处理的。比如适配特殊机型，iPhone X 长屏幕优化等。

以上的这些功能，都需要依赖 useragent 的适配。

## useragent 的入门

说到 useragent，就必须先说它的获取方式：

```
window.navigator.userAgent // 可以省略window，简写 navigator.userAgent
// Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36
```

关于 useragent 的介绍，可以参考这里：[https://zh.wikipedia.org/wiki/用户代理](https://zh.wikipedia.org/wiki/用户代理)。我把关键的信息摘出来。

useragent 的标准格式应该是：

```
Mozilla/[version] ([system and browser information]) [platform] ([platform details]) [extensions] 
```

在我看来，useragent 应该由 5 个字段组成：

- **Mozilla 前缀**：这个已经是兼容后的产物了，没什么意义了。即 `Mozilla/5.0`。
- **系统和浏览器信息**：即 `(Windows NT 10.0; Win64; x64)`。这个字段需要用括号括起来。
- **浏览器渲染引擎**：即 `AppleWebKit/537.36`。
- **浏览器渲染其他补充信息**：我认为各个浏览器为了兼容，这个字段已经没有了实际意义，即 `(KHTML, like Gecko)`。这个字段同样需要用括号括起来。
- **扩展字段**：这个字段内容最为丰富，主要描述了浏览器信息，以及各个浏览器自己添加的自定义字段等。即 `Chrome/70.0.3538.5 Safari/537.36`。

或许你会好奇，在第二个字段中应该描述的浏览器信息呢？怎么却要在第五个字段中出现？这可能还要涉及一些历史。

## useragent 历史

最早做 useragent 规划的时候，是这样设计的。

```
AppName/version (extensions)
```

比如这样子：

```
Mozilla/3.0 (Win95; I)
```

你如果开发了一个微博浏览器，按规矩应该这么叫：

```
WeiboBroswer/1.0 (Windows NT 10)
```

那个年代，IE 发展太慢，别人支持的他不支持。所以部分功能，要对 IE 屏蔽掉。代码大致还是这么写的：

```js
var ua = window.navigator.userAgent
if (ua.indexOf('Mozilla') === 0) {
  // 开启xxx功能
}
```

这就导致后续 IE 升级，即便支持了新功能，用户最终也不能使用上。因为网站没有更新代码。

所以，IE 干脆就是也叫作了：

```
Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1)
```

就这样，第 1 字段就没什么意义了，第 2 字段开始描述浏览器信息了。

虽然和现代的格式不同（5 段结构），但是可以将浏览器信息等当做第 5 段内容，故本文还是更多的按照现有的风格来说明 useragent。

## Mozilla 前缀

目前我只见过 `4.0` 和 `5.0` 两种。

IE8 及以下浏览器（我查询到 IE5），是 `Mozilla/4.0`，之后都是 `Mozilla/5.0` 了。具体的版本含义不清楚。

需要特殊说明的是，这个字段还可能是 `Opera/9.80` 这种形式。opera 当初是比较规矩的。

## 系统和浏览器信息

这个字段最为复杂。一方面涉及老的 IE，这里面什么信息都有；一方面不同平台，也没有个规律规矩，甚至是顺序都没有规定。唯一确定的，就是**使用分号进行分隔**。

同时，由于不同系统、浏览器差异，有的字段会出现在第 2 字段中，而有的却出现在第 3、5 字段中。这里主要说重点字段，对于那些可能出现在 3、5 字段的，则按照后面出现为准。

我先列出几个 useragent，为了看着方便，只列出前两个字段：

```
// windows
// IE 系列
Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)
Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)
Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0)
Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)
Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; WOW64; Trident/6.0)
Mozilla/5.0 (compatible, MSIE 11, Windows NT 6.1; Trident/7.0; rv:11.0)
Mozilla/5.0 (compatible; MSIE 7.0; Windows NT 5.1; Trident/4.0; KB974489; Maxthon 2.0)
Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/4.0; WOW64; Trident/5.0; Maxthon 2.0)
// edge
Mozilla/5.0 (Windows NT 6.1; WOW64)
Mozilla/5.0 (Windows NT 10.0; Win64; x64)
// firefox
Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0)
Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:61.0)
// chrome
Mozilla/5.0 (Windows NT 10.0; Win64; x64)
    
// Mac
Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10; rv:33.0)
Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3)
    
// Linux
Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:18.0)
Mozilla/5.0 (X11; Linux i586; rv:31.0)
    
// iOS
Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X)
Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X)
Mozilla/5.0 (iPod; U; CPU iPhone OS 4_3_3 like Mac OS X; en-us)
    
// Android
Mozilla/5.0 (Linux; U; Android 2.3.7; en-us; NexusOneBuild/FRF91)
    
// 其他设备
Mozilla/5.0 (BlackBerry; U; BlackBerry 9900; en)
Mozilla/5.0 (hp-tablet; Linux; hpwOS/3.0.0; U; en-US)
```

我们主要关注重点字段，非重点的可以忽略。

**平台及系统字段：**

* `Windows NT x.x`：Windows 系统环境
    * `5.0`： Windows 2000
    * `5.1`： Windows XP
    * `6.0`： Windows Vista / Windows Server 2008
    * `6.1`： Windows 7 / Windows Server 2008 R2
    * `6.2`： Windows 8 / Windows RT / Windows Server 2012
    * `6.3`： Windows 8.1 / Windows Server 2012 R2
* `Macintosh`：苹果 Mac 系统环境
* `Intel Mac OS X x_x_x`：苹果 Mac 系统及版本号
* `x11`：X窗口系统，指代 Linux 系统，并不是所有 Linux 浏览器都有此字段
* `Linux xxxx`：Linux 系统环境，也可能不带有CPU信息
    * `i586`：很老的处理器（貌似指不含 MMX 指令集的 CPU）
    * `i686`：一般 CPU
    * `x86_64`：64 位 CPU
    * `mips`：MIPS 处理器
    * `ppc`：PowerPC
    * `amd64`：因该是指 AMD64 专属 CPU，并非常见的 `x86_64`
    * `armv7l`：ARM v7 处理器
* `Linux x.x.x.xxxx`：Linux 系统环境，后面跟着内核版本号，例如 `Linux 2.6.31-16-generic`，这种写法不常见。
* `iPhone` `iPad` `iPod`：苹果相应的设备
* `Android`：一般会跟在 `Linux` 字段后面。安卓设备，后面还可能跟有设备信息。
* `U` `I` `N`：加密等级，`U`-强安全加密，`I`-弱安全加密，`N`-无安全加密

**Windows 专属字段：**

* `compatible`：仅在 IE 浏览器中出现，表示兼容 `Mozilla/4.0` `Mozilla/5.0`，常见于 IE 浏览器，其他早些的浏览器比如 `Konqueror` 也有使用到。
* `Trident/x.x`：仅在 IE 浏览器中出现，表示 Trident 渲染引擎版本。对于第三方浏览器，比如 Mathon，可能会出现两个值
* `MSIE x.x`：IE浏览器版本，不一定带有小数点，而且老的版本可能是 `MSIE 6.0b` `MSIE 5.50` 这种形式
* `WOW64`：仅在 Windows中出现，是 `Windows(32) on Windows 64`，表示当前浏览器是 32 位，运行在 64 位系统上，但是一般却不合 `x64` 连用，但系统确实是 64 位
* `Win64`：表示当前浏览器是64位的，一般和 `x64` 连用
* `x64`：表示系统是64位的

**其他字段：**

* `rv:x.x`：当前浏览器版本，一般 IE11 和 Firefox 才会有此字段，Chrome 从未见过用此字段。如果是第三方浏览器，这里也指代当前利用的 IE版本

**额外说明：**

IE 的浏览器，还可能带上补丁号（类似 `KB974489`），系统 .NET 插件等信息等。

有的浏览器还会带上浏览器语言，比如 `en-US`。

Linux / BSD 系统，可能会带上发行版信息，比如 `(X11; Ubuntu; Linux x86_64; rv:61.0)` 但这个不是必须的。发行版信息，也可能在第 5 字段中出现。

## 浏览器渲染引擎及其他补充信息

这个字段现代浏览器比较好说明，要么没有，要么就是缺少补充信息（括号内的内容）

```
AppleWebKit/604.1.34 (KHTML, like Gecko)
Gecko/20100101
Presto/2.9.201
like Gecko
```

现在一般都是 `AppleWebKit` `Gecko`，指代的是渲染引擎版本号。

很久以前 Opera 浏览器是 `Presto`。

IE 11 开始写上了 `like Gecko`，我认为没什么用。此外，IE浏览器渲染引擎及版本在上一节中有提到。

## 扩展字段

这个字段内容最多，不过还好主要的字段不复杂。字段采用**空格进行分隔**。

先看例子，下面只展示 useragent 的扩展字段内容：

```
// Desktop
Chrome/69.0.3497.81 Safari/537.36
Firefox/61.0
Version/7.0.3 Safari/7046A194A

// Mobile
Version/10.0 Mobile/14E304 Safari/602.1
Version/11.0 Mobile/15A5341f Safari/604.1
Version/4.0 Chrome/69.0.3497.81 Mobile Safari/537.363

// Other
Mobile/16A366 MicroMessenger/6.7.2 NetType/WIFI Language/zh_CN // 微信
Mobile/16A366 ChannelId(36) NebulaSDK/1.8.100112 Nebula PSDType(1) AlipayDefined(nt:WIFI,ws:414|672|3.0,ac:T) AliApp(AP/10.1.32.600) AlipayClient/10.1.32.600 Alipay Language/zh-Hans // 支付宝
```

首先，由于历史原因，Chrome 浏览器也会带有 Safari 字段。

**主流字段：**

* `Safari`：Safari 版本号
* `Chrome`：Chrome 版本号
* `Version`：系统版本号，一般移动设备和 Mac 设备拥有
* `Mobile`：移动设备版本号，一般指内部版本号，苹果设备拥有版本号，安卓设备不含版本号

**其他浏览器字段：**

主要就是各种第三方浏览器，包括 APP 内嵌入的 WebView 等。为了方便自我识别，都是在这里加上各个 APP 独有的信息。

一般来讲，都是采用标准的 `key/value` 形式，但不是所有字段都符合这个规律。

基本上要判断什么浏览器（或者WebView），需要看下它的 useragent，单独处理了。
