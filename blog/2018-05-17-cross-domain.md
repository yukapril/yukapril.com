---
title: "前端 ajax 请求跨域处理"
date: 2018-05-17 23:23:00 GMT+0800
tags: [ cross domain, ajax, jquery, axios ]
---

最近在做一个前后端分离的项目，业务管理平台。一个前端项目要对应多个后端接口地址，免不了各种跨域，查了一些资料，做一个小结。

<!-- truncate -->

## 什么是跨域

或许，什么不是跨域更好来解释：

比如网站A，请求了网站B `https://abc.com:8080/api/test`

* 协议相同，比如 https
* 域名相同，比如 abc.com（或者是 IP 相同）
* 端口相同，比如 8080

要注意的是，不仅仅是 js 可能跨域，css iframe 都有可能跨域。

跨域主要限制在脚本（js css）请求上，对于 html 中加载资源，不算跨域。

比如 网站A `http://abc.com`，有：

```html
<img src="http://12.34.56.78/xx.png">
<script src="https://cdn.abc.com/xx.js"></script>
```

这些都不算做跨域。

但是上面这个 js，只能往当前网站A 的 `http://abc.com` 下发送请求，否则就算跨域。

也就是说，当前网站地址是啥，就只能往哪里发送请求（iframe 不再考虑范围内）。

**跨域的重点说明：**

跨域发出的请求，是默认放行而且可以成功的，因为浏览器不清楚服务器端是否支持跨域。

但是成功的请求，如果跨域了，是不会回调 js 代码的，这个是浏览器的保护机制。所以，下文的预请求原因很关键。

## 说明

前端的话，主要以 `jQuery` 或 `axios` 为例。

由于后端代码实现语言不同，故这里只说接口的响应头应该带有哪些信息，具体实现方法或者框架（库 / 包）请自行搜索。主要关注 `cors` `headers` 关键词。本文以 nodejs 的 `koa2` 框架为例。

比如 JAVA spring 框架，可以考虑 ：

```java
response.setHeader("Access-Control-Allow-Origin", "*")
```

也可以考虑注解形式（`@CrossOrigin`），好像是 4.2 之后的版本开始支持注解。

演示代码在这里：[Github](https://github.com/yukapril/learning/tree/master/cross-domain)

以下约定：

前端页面使用：`http://127.0.0.1:3100`

后端接口使用：`http://localhost:3000`

这样故意制造跨域。

此外，本文指的是真真正的的跨域，访问真正的数据接口，而不是 JSONP 接口。

## 简单的跨域处理

简单的跨域主要指发起了简单的请求。

满足简单请求的要求是：

1. 只能是 `GET` `POST` `HEAD` 请求方法。而且如果是 `POST` 的话，发送数据类型必须是 `application/x-www-form-urlencoded`、`multipart/form-data`、`text/plain` 之一，其他类型不可以。
2. 不能自定义请求头，比如加上 `x-token` 什么的。当然也不能带上 `cookie`。

实现跨域非常简单，后端接口需要返回以下一个响应头即可：

```js
ctx.set('Access-Control-Allow-Origin', 'http://127.0.0.1:3000') // 可以用 * 代替网址
```

**前端代码无需特殊处理，即可正常接收数据。例子参考 DEMO1。**

或许你见过 `ctx.set('Access-Control-Allow-Methods', 'GET, POST, HEAD, DELETE, OPTIONS')` 这种写法，我们这就来说。

上面的简单跨域，只能是 `GET` `POST` `HEAD` 方法，如果我是 RESTful 风格的接口，偏偏要用 `DELETE` 怎么办？

或者，我们交互数据，默认类型不是表单格式 `application/x-www-form-urlencoded`，是 `application/json` 格式？

再或者，需要上送特殊的请求头，比如 `x-token` ？

这时候，就是非简单的请求了。

## 高级跨域处理（预请求）

上面说到了非简单请求，这种请求有个特点，要先发送一次请求，查一下服务器支持那些特性。这个是通过 `OPTIONS` 方法请求出去的。

为什么要有预请求？

> 假设你要跨域删除一条数据，使用 `DELETE` 方法。
>
> 此时你请求发出去了，服务器正常处理删除了数据。但是由于跨域，导致了前端代码无法成功接收到状态，也就无法进行后续处理，对于操作的用户，不知道是否成功了。
>
> 那么，用户可能会反复进行删除，或者进行了更进一步错误的操作。
>
> 这就麻烦了，跨域请求发出去了，也成功了，但是前端代码收不到结果...
>
> 所以，在发送 `DELETE` 请求前，先发送一个 `OPTIONS` 方法的请求，确认下能否跨域，如果可以的话，在发送第二条真正的删除请求。否则，第二条干脆就不发送了。这样就不会遇到上面的问题了。

**所以，预请求用来查明该站点是否允许跨域请求，这样可以避免跨域请求可能带来的数据破坏。**

这种情况实现也还好，不过要注意需要实现 `OPTIONS` 方法：

```js
router.options('/deleteData', (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', 'http://127.0.0.1:3000')
  ctx.set('Access-Control-Allow-Methods', 'GET, POST, HEAD, DELETE, OPTIONS')
  ctx.set('Access-Control-Allow-Headers', 'x-token')
  // OPTIONS 方法不需要返回任何实体内容，而且应该与最终调用的方法返回的头信息保持一致
})

router.delete('/deleteData', (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', 'http://127.0.0.1:3000')
  ctx.set('Access-Control-Allow-Methods', 'GET, POST, HEAD, DELETE, OPTIONS')
  ctx.set('Access-Control-Allow-Headers', 'x-token')
  // ...
})
```

**前端代码的话，都还是正常写就可以了。不需要加任何额外的参数属性。例子参考 DEMO2。**

对于上面的允许的 Headers 头部配置，这个含义是可以支持带有 `x-token` 的请求，当然你不带上也是可以的。但是你带上了其他字段，比如 `x-abc`，那么就不行了。

## 带 cookie 的请求

上面的两个例子，对于跨域来说，基本上能解决很多问题，比如请求第三方查天气接口，每次请求带上自己的 key 就可以了。跨域处理起来也不算太难。

下面开始说说复杂一点的。

需求是这样的：

* 前后端分离项目，不部署在一起。为了和代码统一，下文用本地环境说明

* 前端域名A (`http://127.0.0.1:3000`)，后端接口域名B (`http://localhost:3100`)

* 前端要先调用登录接口，同时接口会返回状态，并写入 `cookie` （其实就是 `session`）

* 前端调用其他接口，需要带上当前的 `cookie`（这样后端相当于知道了 `session` 就知道是谁了），才可以获取数据

这次就必须前后端都要修改代码了。

#### 首先是前端部分，相对简单一些：

```js
$.ajax({
  url: 'http://localhost:3100/login',
  type: 'post',
  xhrFields: {
    withCredentials: true
  }
})
```

需要增加 `withCredentials` 字段，axios 也是需要设置此字段。

**只有设置 `withCredentials` 字段，才能发送/接收 cookie**。比如上面的这个登录接口，虽然不需要上送 cookie，但是要接收后端的响应头 `Set-Cookie`，所以登录接口就必须开启。

可以在控制台中查看下，跨域请求 `http://localhost:3100/login` ，返回时候有响应头：

```
Set-Cookie: SESSION=123456789; path=/; httponly
```

这个 cookie 是属于 localhost 域名下的，**所以在 `http://127.0.0.1:3000` 下查看 cookie 是看不到的**。

如果非要想看下，那么只能访问 `http://localhost:3000`，然后在控制台中查阅 Application 选项卡内容。

后续请求数据的接口亦如此，否则不能上送登录接口获取到的 cookie。

#### 后端部分

```js
router.post('/login', (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', 'http://127.0.0.1:3000')
  ctx.set('Access-Control-Allow-Credentials', true)
  ctx.cookies.set('SESSION', '123456789')
  ctx.body = {code: 0, data: 'login ok!'}
  next()
})

router.post('/loginedData', (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', 'http://127.0.0.1:3000')
  ctx.set('Access-Control-Allow-Credentials', true)
  ctx.body = {code: 0, data: ctx.headers}
  next()
})
```

后端部分，难度不大， 但是要注意几点：

* `Access-Control-Allow-Origin` 不可以是 `*` （星号），必须是具体网站地址
* `Access-Control-Allow-Credentials` 必须配置为 `true`
* 如果是非简单请求，还需要像 DEMO2 一样，返回 `Access-Control-Allow-Methods` 字段
* 如果是非简单请求，注意实现 `OPTIONS` 方法，这个例子是简单请求，所以就没实现 `OPTIONS`

## 总结

#### 前端

1. 标准的 ajax 跨域请求，只要不需要带上cookie，那么和常规 ajax 写法一样，不需要额外加任何参数；
2. 如果 ajax 要带上 cookie 进行跨域，那么必须增加 `withCredentials` 字段。

#### 后端

1. 请使用封装好的库、插件、组件等，本文以上内容，基本上都可以直接用插件直接解决，不需要自己手动配置；

2. 非要手动配置，可以参考如下方案配置：

* 只要是跨域，就必须增加 `Access-Control-Allow-Origin`

* 需要带上（处理）cookie，就必须增加 `Access-Control-Allow-Credentials`，而且 `Access-Control-Allow-Origin` 不可以设置为 `*`

* 请求是简单请求吗？简单请求的定义参考上文 “简单的跨域处理” 部分。是的话不需要其他字段了，不是的话，根据情况增加字段：
  | 响应头 | 解释 | 备注 |
  | ------------------------------ | ---------- | ---------------------------------------- |
  | `Access-Control-Allow-Methods` | 服务器接受那些方法 | 不配置的话，默认相当于 "HEAD, GET, POST"            |
  | `Access-Control-Allow-Headers` | 服务器接受那些请求头 | 请求中带有或不带有此字段，可以成功；请求中带有其他字段，整个请求失败（没有通过 `OPTIONS` 请求） |

  其他响应头，建议搜索查表。我认为用的很少，就不列举了。

## 参考文章

[跨域的那些事儿](https://zhuanlan.zhihu.com/p/28562290)

[CORS详解](https://github.com/hstarorg/HstarDoc/blob/master/%E5%89%8D%E7%AB%AF%E7%9B%B8%E5%85%B3/CORS%E8%AF%A6%E8%A7%A3.md)

[跨域资源共享 CORS 详解](http://www.ruanyifeng.com/blog/2016/04/cors.html)

[HTTP Headers - MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers)
