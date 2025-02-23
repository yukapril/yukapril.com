---
title: npm 私服 - 搭建和发布篇
date: 2020-12-13 13:07:00 GMT+0800
tags: [ npm, 私服, Verdaccio, nexus ]
---

有的时候，我们需要使用 npm 私服，这篇文章就来介绍如何搭建 npm 私服。

<!-- truncate -->

npmjs 上要想发布私有包，必须选择 Pro 版本（付费）。公司内部想有私有仓库的话，基本上无能为例。

如果是银行之类的企业，很多研发人员没有外网，或者公司网络较差，使用 npm 淘宝源访问也压力较大。

上面两种情况，一般常见都是采用自建自有仓库的方案。就是自己搭建私服来解决。

## 插曲

如果仅仅是想私有化包仓库，而且公司的私有包也不是很多的话，可以使用 github gitlab 等来存储代码，并通过此来安装：

```sh
npm install git+https://github.com/yukapril/camera-h5.git#v1.3.0
```

其中 `git+https://` 这么写大部分管理工具 `npm` `yarn` 都可以识别，后面的 `#v1.3.0` 表示代码的 tag，可以用来管理安装的版本。

这么做只需关注私有包代码就行了，都不用管理发布的流程。

而且还有一个好处，那就是可以管理权限，你没有访问私有包仓库的权限，就不能下载私有包依赖。

后续说到的各个私服，好像都没办法管理权限。

## npm 私服

npm 私服搭建工具不多，主要有三个：Verdaccio、sinopia、nenus。

### Verdaccio

官网：[https://verdaccio.org](https://verdaccio.org)

号称零配置的私服，直接用 node 启动就行，还提供 docker 版本。

体验下来，我觉得好处就是安装特别省事，无需太关注复杂的技术，也可以不用太配置，还带有个简洁的 UI 页面。

单纯是 npm 私服的话，我认为用它非常适合。而且体验和 npm 官网非常类似，支持的 npm 语法也非常好。

### sinopia

Github：[https://github.com/rlidwka/sinopia](https://github.com/rlidwka/sinopia)

一样号称零配置的私服，整体和 Verdaccio 差不多。

功能比 Verdaccio 更简单，也具有简洁的 UI 页面。简单体验了下，大体也和 Verdaccio 差不多。感觉就是 Verdaccio 的精简版吧。

### Nenus

官网：[https://www.sonatype.com/nexus/repository-oss](https://www.sonatype.com/nexus/repository-oss)

下载地址：[https://www.sonatype.com/nexus/repository-oss/download](https://www.sonatype.com/nexus/repository-oss/download)

非常强大，各个公司基本上用的都是它！因为它可以同时处理 maven npm 等私有仓库。所以为了省事，很多公司就不会单独再部署其他私服了。

## Verdaccio 安装和使用

首先保证机器装有 node。

```sh
npm install -g verdaccio # 安装 verdaccio
npm install -g pm2 # 建议用 pm2 来管理启动，这样后续省事
pm2 start verdaccio # 使用 pm2 启动 verdaccio
```

Verdaccio 启动后会打印日志，显示默认地址和端口，使用 pm2 命令查看日志：

```sh
pm2 log

    # 其中一行为：
    warn --- http address - http://localhost:4873/ - verdaccio/4.9.1
```

可以看到，我们本地的私服地址是 `http://localhost:4873/`。

具体的 Verdaccio 配置，pm2 启动管理，请查阅对应[文档](https://verdaccio.org/docs/en/configuration)。

我们为私服增加一个账号：

```sh
npm adduser --registry http://localhost:4873/

# 依次输入用户名密码邮箱数据
Username: admin
Password:
Email: (this IS public) admin@123.com
Logged in as admin on http://localhost:4873/.
```

进入一个项目目录，发布试试看：

```sh
npm publish --registry http://localhost:4873/
```

之后可以到私服地址上看看 `http://localhost:4873/`，能看到自己刚刚发布的包。

<img src="https://cdn.nlark.com/yuque/0/2021/png/86612/1633354342742-79c9953d-e28b-4e36-a0ff-b15806fc2761.png" referrerpolicy="no-referrer" alt="已经发布的包" />

通过 Verdaccio 私服，也可以安装其他公网的包：

```sh
npm install lodash --registry http://localhost:4873/
```

默认配置下，从速度测试来看，安装公网的包感觉像是流量透传，没有缓存。

但实际默认配置（缓存）位置为： `~/.config/verdaccio`

## Nexus 安装和 npm 私服配置方法

官网下载好像要输入邮箱等，但是没什么用，错误的邮箱地址也不影响下载。

官网下载好包后，解压缩就可以了，都不用安装。下文我以 MacOS 来说明。

首先确保服务器上有 java 环境，没有请自行搜索安装 jdk 1.8。官网需要登录后才能下载 jdk，可以考虑其他下载地址。

进入下载的目录后，执行脚本启动 Nexus3：

```sh
./nexus-3.28.0-01/bin/nexus start 
```

稍微得过一会，之后可以访问了（启动很慢）： `http://localhost:8081/`

此时如果你点击登录按钮，会提示：

> Your **admin** user password is located in
>
> **/Users/xxx/Applications/nexus-3.28.0-01-mac/sonatype-work/nexus3/admin.password** on the server.

他告诉你了密码位置，你可以到机器上查询下。之后使用 admin 账号登录。

点击顶部的设置按钮，左侧选择 `Repository` - `Repositories`。

之后选择 `Create repository`。可以看到有 `npm(proxy)` `npm(hosted)` `npm(group)`。

* `npm(proxy)` 就是代理仓库，可以缓存已下载的包，后续就不用下载了。它只能实现代理的功能，不能实现私有包的托管。
* `npm(hosted)` 就是存储私有包的仓库，可以允许提交包。但不能实现代理功能。
* `npm(group)` 就是将以上两种仓库合并下，一个地址就能实现代理和私有包托管，免去来回切换地址的麻烦。

**建立 `npm(proxy)`**

<img src="https://cdn.nlark.com/yuque/0/2021/png/86612/1633354341103-096c6bb2-c0aa-4bef-8cbb-a465395d9e74.png" referrerpolicy="no-referrer" alt="创建 npm proxy" />

Name 随意，就是区分，我这里叫做 `npm-proxy`。

Remote storage，远程代理的地址，这里我用了官方源 `https://registry.npmjs.org/`，也可以用淘宝之类的源。

其他都不用管，默认就好。

返回后，可以看到多了一条 `npm-proxy` 记录。后面有一个 URL copy 的按钮。复制后就获得了地址 `http://localhost:8081/repository/npm-proxy/`。

通过此代理 url，可以进行访问代理。比如进行安装包，是完全可行的：

```sh
npm install xxx --registry http://localhost:8081/repository/npm-proxy/
```

但是不能进行 `npm adduser`，会报错。

**建立 `npm(hosted)`**

<img src="https://cdn.nlark.com/yuque/0/2021/png/86612/1633354341005-ba412bb2-77dd-47e9-95c2-b7355d8955fb.png" referrerpolicy="no-referrer" alt="建立 npm hosted" />

Name 随意，就是区分，我这里叫做 `npm-hosted`。

其他都不用管，默认就好。

返回后，可以看到多了一条 `npm-hosted` 记录。同样的，复制后就获得了地址 `http://localhost:8081/repository/npm-hosted/`。

这个地址不能用于代理，比如 `npm i xxx`，会提示找不到对应的包。

此时你不能通过 `npm adduser` 来增加账号。需要通过 nexus 来增加用户。

首先要增加一个 npm 角色组，我分配了所有 npm 的权限。参见如下：

<img src="https://cdn.nlark.com/yuque/0/2021/png/86612/1633354341046-e5db6e20-519c-4a43-a313-05f2dd833b5a.png" referrerpolicy="no-referrer" alt="配置权限" />

之后新增一个账号，参见如下：

<img src="https://cdn.nlark.com/yuque/0/2021/png/86612/1633354342875-4b9e3800-a3af-4d57-9206-b79b9d1c0be5.png" referrerpolicy="no-referrer" alt="增加用户" />

最后，还要修改下 Realms。把 `npm Bearer Token Realm` 弄到右侧激活区。

<img src="https://cdn.nlark.com/yuque/0/2021/png/86612/1633354340959-47c21016-c8da-4254-85f6-1c82cdbe9cd2.png" referrerpolicy="no-referrer" alt="处理 Realms" />

否则后续操作可能会遇到如下错误：

```
Unable to authenticate, need: BASIC realm="Sonatype Nexus Repository > Manager"
```

建立好账号后，使用以下命令来进行登录。

```sh
npm login --registry http://localhost:8081/repository/npm-hosted/
```

之后可以发布包了：

```sh
npm publish --registry http://localhost:8081/repository/npm-hosted/
```

这个仓库地址只能发布私有包，不能下载其他的公有包。

**建立 `npm(group)`**

<img src="https://cdn.nlark.com/yuque/0/2021/png/86612/1633354340968-a8a887aa-cbe5-4bf1-8ac4-63c0f8f76935.png" referrerpolicy="no-referrer" alt="建立 npm group" />

Name 随意，就是区分，我这里叫做 `npm-group`。

Member repositories，需要选择已经建立好的 2 个 npm 仓库。

Blob store，表示缓存位置，可以自己在建立一个存储区域。我这里用了默认的。

其他都不用管，默认就好。

完成后，获得新的 url `http://localhost:8081/repository/npm-group/`。

使用此地址可以下载公共包，以及发布私有包。

但是发布私有包时候，报错了...没交钱的错：

```sh
npm ERR! code E403
npm ERR! 403 403 Forbidden - PUT http://localhost:8081/repository/npm-group/test 
         - Deploying to groups is a PRO-licensed feature. 
           See https://links.sonatype.com/product-nexus-repository
npm ERR! 403 In most cases, you or one of your dependencies are requesting
npm ERR! 403 a package version that is forbidden by your security policy.
```

发布到 group 为啥是 `PRO-licensed` 的特色啊，我怎么记得几个月前我测试时候还行啊。看来这个只能到此为止了。

后续也有变通方法处理这种情况。
