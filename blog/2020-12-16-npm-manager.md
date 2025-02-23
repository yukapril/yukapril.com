---
title: npm 私服 - 源管理及私有包管理篇
date: 2020-12-16 21:13:00 GMT+0800
tags: [ npm, 私服, Verdaccio, nexus ]
---

上一篇文章介绍了私服的搭建，这次我们来说如何切换到私服上。

<!-- truncate -->

## 切换源

* 修改 `~/.npmrc` 文件。将 `registry` 修改成你的私服地址。这是最底层的方案，对所有 npm 都生效：

```
registry=http://localhost:8081/repository/npm-group/
```

* 使用 `npm config set ` 来切换源。本质和修改 `~/.npmrc` 一样：

```sh
npm config set registry http://localhost:8081/repository/npm-group/
```

* 临时切换源。命令最后跟上 `--registry` 参数，仅对当前命令生效：

```sh
npm i xxx --registry http://localhost:8081/repository/npm-group/
```

* 使用第三方工具。比如 `nrm`。其本质还是修改 `~/.npmrc`。但是可以实现多个源切换，免去拿小本本自己记录了。

总之，不管用什么方法切换源都行，但是不推荐每次命令都加上 `-registry`。

## 通过私服下载包

临时通过私服下载包（不推荐）：

```sh
npm i xxx --registry http://localhost:8081/repository/npm-group/
```

或者配置好 `registry`，直接使用 npm：

```sh
npm i xxx
```

唯独要注意下，使用 nexus 部署的话，需要用 group 的链接，不能用 hosted 链接。因为 hosted 不能下载。

如果用 verdaccio 则不存在此问题。

## 通过私服发布私有包

首先确保 `registry` 已经调整为私服。否则每个命令都要加上 `--registry` 参数。

比如我用 nexus 搭建，私服地址是：

```
http://localhost:8081/repository/npm-group/
```

首先进行登录：

```sh
npm login

  Username: yukapril
  Password:
  Email: (this IS public) 123@123.com
  Logged in as yukapril on http://localhost:8081/repository/npm-group/.
```

之后直接发布就好了：

```sh
npm publish
```

如果私服是 nexus，则需要继续往下看。

因为此时你执行上面命令直接发布包，会报错的，上篇文章已经提到，group 链接非 PRO-licensed 是不让提交的。

我们有两种方案来解决：

* 每次提交指定 `registry`（不推荐）

每次提交时候，命令加上 regsitry，简洁明了，缺点是每次提交都要记着 url，太麻烦。

```sh
npm publish --registry http://localhost:8081/repository/npm-hosted/
```

* 项目中配置 `registry`（推荐）

我们需要修改 `package.json` 文件，增加一段，地址填上 hosted 的地址：

```json
{
  ...
  "publishConfig": {
    "registry": "http://localhost:8081/repository/npm-hosted/"
  }
}
```

之后再发布就好了：

```sh
npm publish
```

这个配置只影响发布，不影响下载其他依赖。

最后，nexus 可以在 http://localhost:8081/#browse/browse:npm-hosted 这里来看到已经发布的包。

verdaccio 也可以访问首页来看到。

## 发布如 @abc/bcd 形式的组织包

一开始我特别好奇，npm 上面的组织包都是如何发布的。

正规的做法应该是 npm 登录组织账号，创建组织下的一个包。

但我测试来看，可以直接编辑 `package.json`，修改其中的 `name`：

```json
{
  "name": "@yukapril/test2"
  ...
}
```

之后直接发布即可。

恩，就这么简单。

npm 官方源也可以发布组织包，免费用户的要求是公开。应该是先去 npm 网站建立自己的组织，之后就可以发布了。直接发布感觉应该是提示没有对应权限。

## 包撤回

> 此系列命令在 nexus 中无效。Verdaccio 支持。

* 彻底移除一个包：

```sh
npm unpublish @yukapril/test2 --force
```

* 移除指定个一个版本：

```sh
npm unpublish test1@1.0.0
```

## 包tag管理

npm 上搜索 react，Versions 板块中可以看到它的各个版本：

```
Current Tags
17.0.1                       ----latest
0.0.0-8e5adfbd7              ----next
0.0.0-experimental-4ead6b530 ----experimental
16.14.0                      ----untagged
```

这样，我们可以通过各种 tags 来安装不同的版本，比如：

```sh
npm i react  # 不传版本号，等同于 latest
npm i react@latest
npm i react@next
```

版本 tag 功能，可以使用 `dist-tag` 来实现。

```sh
npm dist-tag add test1@1.2.0 next
```

这样，就可以增加对 `test1@1.2.0` 版本，增加一个 `next` 标签。

后续可以通过下列命令安装这个标签版本：

```sh
npm i test1@next
```

## 废弃一个包

我测试 Verdaccio 私服不会报错，但是也没见什么效果。依然可以下载已经废弃的包（版本），不知道是不是没实现这个逻辑。

```sh
npm deprecate test1@1.2.0 "" # message 可以写可以不写
```
