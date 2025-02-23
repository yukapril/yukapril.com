---
title: 使用 cloudflare 实现访问代理
date: 2020-03-14 18:50:00 GMT+0800
tags: [ cloudflare, workers, proxy ]
photos: [ https://cdn1.yukapril.com/2020-03-14-cloudflare-proxy.png ]
---

昨天写了一篇文章，讲到可以使用 `nvm` 来部署 node。其中第一步安装的时候，要访问 github 的资源服务器。这一步的访问可能在国内非常不畅。这就需要有一个访问代理来协助。

<!-- truncate -->

之前听说函数计算可以实现一些简单的功能。就比如访问代理，只需要函数计算实现参数接收、代理请求、结果返回三步就够了。正好我也一直比较好奇函数计算，就此也尝试下。

原则上讲，国内的阿里云、腾讯云都可以实现函数计算服务，但是他们服务器在国内，无法实现访问 github。也就没有考虑。

我选择了 cloudflare workers。和函数计算一个意思。对于个人使用的偶尔使用，免费的量非常充裕。主要就是限制每天 10 万次请求，最多 30 个 workers。足够了。

**新建 workers**

访问 [cloudflare workers](https://workers.cloudflare.com/) 页面，注册登录。

cloudflare workers 提供本地编程的工具包，但是我的需求很简单，直接在线编辑测试就可以了。

![cloudflare workers](https://cdn1.yukapril.com/2020-03-14-cloudflare-proxy.png)

选择页面上的 `Start Building` 开始。之后可以选择右侧的 Workers 栏目进入。

之后需要建立自己的子域，一般是 `xxxx.workers.dev` 形式。

比如建立一个叫做 `my` 的子域，那么完整的子域地址是 `my.workers.dev`。

创建每个 workers，系统会默认起名字，可以改的。比如我们要做一个文件代理，名字我们就叫做 `proxy`，那么这个 workers 的访问地址就是 `proxy.my.workers.dev`。

**编写脚本**

直接进入编辑模式，可以写入如下脚本，完成对 `https://raw.githubusercontent.com` 地址的代理：

```js
addEventListener('fetch', event => {
  // event 包含
  // actorState: 不知道是啥
  // request: 请求包
  // type: 类型，此处为 "fetch"
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // 获取请求的 url
  const url = request.url
  // 构造 URL 对象，方便解析出 pathname
  const urlObj = new URL(url)
  const pathname = urlObj.pathname

  if (pathname === '/') {
    // 访问根节点，直接返回空内容
    return new Response('', { status: 200 })
  } else {
    // 抓取内容
    const html = await getHtml('https://raw.githubusercontent.com' + pathname)
    return new Response(html, { status: 200 })
  }
}

/**
 * 获取指定地址的 html
 */
async function getHtml(url) {
  const res = await fetch(url, { method: 'GET' })
  if (res.status === 200) {
    return await res.text()
  }
  return ''
}
```

写好脚本后，使用 <key>Ctrl</key>/<key>Cmd</key> + <key>S</key> 进行保存即可。

我们就可以浏览器测试了。

比如 `nvm` 的安装脚本地址是：

```
https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh
```

我们只需要更换为我们的域名即可(域名要换成你自己创建的)：
```
https://proxy.my.workers.dev/nvm-sh/nvm/v0.35.3/install.sh
```
