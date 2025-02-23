# Surge 部署教程

[Surge](https://surge.sh) 是一个静态服务部署平台。它通过纯命令行完成所有部署操作。免费版不限制项目个数，也可以自定义域名，部署起来非常便捷。

> 受限于网络原因，Surge 官网、部署后的资源，可能无法访问。

## 环境准备

Surge 是 Node.js 的一个命令行工具。所以你需要先准备安装好 Node.js。

之后，使用 `npm` 命令全局安装好 Surge 工具：

```bash
npm install --global surge
```

## 常用的命令和功能

### 部署

```bash
# 部署当前目录
surge

# 指定部署的目录
surge path/to/my-project

# 指定域名（建议直接在要部署的目录下，增加 CNAME 文件，文件内容为要部署的域名）
surge --domain vancouver.surge.sh
surge --domain example.com # 这样部署，访问 www.example.com，自动跳转到 example.com
surge --domain www.example.com # 这样部署，访问 example.com，自动跳转到 www.example.com

# 同时指定部署目录和域名
surge path/to/my-project my-custom-domain.com
```

### 查看所有部署的项目

```bash
surge list
```

### 关停一个域名

```bash
surge teardown vancouver.surge.sh
```

### 增加项目协作者

```bash
surge --add xx2@xx.com
```

### 增加 404 错误页

直接在要部署的目录下，增加 `404.html` 文件。

### 增加 200 访问页

如果找不到对应页面的话，默认会指向 200 页。根据这个特性，我们可以处理前端控制的路有问题（CSR）。

直接在要部署的目录下，增加 `200.html` 文件。

### 增加部署忽略文件

项目下增加`.surgeignore`，用法同 `.gitignore`。

### 高级功能

注，以下功能，在付费高级版本才提供：

- 自定义 SSL 证书

- HTTP 重定向到 HTTPS

- AUTH 文件（实现访问验证使用）

- CORS 文件

- ROUTER 文件（自定义重定向使用）

## 实践：把前端项目部署到 Surge

本项目最终代码参考这里：[demo-surge](https://github.com/yukapril/demo-surge)

### 准备好要部署的代码

```bash
# 使用 vue-cli 创建一个 vue 的 demo 项目（这里需要提前安装好 vue-cli）
vue create demo-surge

# 项目编译打包
npm run build
```

### 部署

进入 `dist` 目录后（因为我们要部署这个目录内容），输入 `surge`，会要求登录或注册。

```bash
surge

# Welcome to surge! (surge.sh)
#   Login (or create surge account) by entering email & password.
#
#          email: xx@xx.com
#       password: 
```

输入完成后，会确认你的邮箱，以及项目路径、部署域名。此时我们使用默认域名即可，当然你也可以修改。

```bash
#   Running as xx@xxx.com (Student)
#
#        project: /Users/xxx/Github/demo-surge/dist/
#         domain: doubtful-wool.surge.sh
```

完成后，Surge 开始自动上传资源。

```bash
 # project: /Users/xxx/Github/demo-surge/dist/
 #        domain: doubtful-wool.surge.sh
 #        upload: [====================] 100% eta: 0.0s (9 files, 1099690 bytes)
 #           CDN: [====================] 100%
 #    encryption: *.surge.sh, surge.sh (276 days)
 #            IP: 138.197.235.123
```

上传可能失败，比如域名冲突之类。重新输入 `surge` 再确认一次项目路径、域名就好。

每次的部署域名，都不相同。

访问部署的域名，比如我的是 [doubtful-wool.surge.sh](https://doubtful-wool.surge.sh)，便可以看到部署的项目了。

### 绑定域名

这里，我绑定的域名是 [surge.demo.yukapril.com](https://surge.demo.yukapril.com)。

首先到域名服务商那里去修改 DNS。根据官方要求，需要对要配置的域名配置一条 CNAME
记录，指向 `https://na-west1.surge.sh`。对于本例子，就是：

```
CNAME 记录
surge.demo.yukapril.com --> na-west1.surge.sh
```

如果你的域名服务商不支持 `CNAME`，也可以使用他们的 IP，即配置一条 A 记录：

```
A 记录
surge.demo.yukapril.com --> 45.55.110.124
```

之后，在 dist 目录下增加一个 `CNAME` 文件，内容是自定义域名。用命令来创建就是：

```bash
echo surge.demo.yukapril.com > CNAME
```

最后，使用 `surge` 部署一次。

```bash
surge
# Running as xx@xx.com (Student)
#
#        project: /Users/xxx/Github/demo-surge/dist/
#         domain: surge.demo.yukapril.com
#         upload: [====================] 100% eta: 0.0s (10 files, 1099714 bytes)
#            CDN: [====================] 100%
#             IP: 138.197.235.123
```

完成后，就可以使用自定义域名访问了。但是此时访问，是不支持 HTTPS 的。**由于 Surge 限制，免费版不能上传 HTTPS 的 SSL 证书。**

而且，如果你访问页面的 About 页，是可以看到内容的。但是刷新之后，就报错了，找不到页面。

### 解决路由刷新后不能访问问题

由于没有 `/about.html` 文件，所以访问就失败了。

根据官方的指南，凡是找不到的页面，都会尝试加载 `200.html` 这个页面。所以我们就要利用这个特性来实现。

我们把 `index.html` 复制一份。即：

```bash
cp index.html 200.html
```

之后输入 `surge` 再次进行部署。

再测试下我们的域名，发现这个问题已经解决掉了！

### 再次打包，结果 CNAME、200.html 文件都没了

由于上面我们都是直接在 dist 目录操作的，一旦重新打包  `npm run build`，dist 目录就被替换为最新内容了。 所以我们需要分别处理下。

首先在项目根目录，创建好 `CNAME` 文件。 我们只需在打包完成后，把这个 `CNAME` 文件拷贝到 dist 目录下即可。

编辑 `package.json` 文件，修改构建脚本命令：

```diff
{
-  "build": "vue-cli-service build"
+  "build": "vue-cli-service build && cp CNAME ./dist"
}
```

还有 `200.html` 文件，我们也需要在打包完成后，从 `index.html` 拷贝一个。再次编辑 `package.json` 文件：

```diff
{
-  "build": "vue-cli-service build && cp CNAME ./dist"
+  "build": "vue-cli-service build && cp CNAME ./dist && cp ./dist/index.html ./dist/200.html"
}
```

这样处理后，每次打包，我们要部署的的文件都不会少。

> `cp` 是 Linux MacOS 下的拷贝命令。如果希望跨平台，可以考虑用 Node.js 来写脚本。

### 整合打包脚本

每次打包后，还需要再执行 `surge`，并且需要按一次回车键来确认。我们可以把部署的命令写到 `package.json` 中，这样就方便一些了。

在 `package.json` 中，增加一条 `script` 命令，如下：

```JSON
{
  "publish": "surge ./dist"
}
```

执行此命令，就不用再输入回车了。

以后打包+部署，可以直接输入命令：

```bash
npm run build && npm run publish
```
