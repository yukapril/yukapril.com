---
title: 项目 node 的升级
date: 2024-02-27 14:02:00 GMT+0800
tags: [ node ]
---

公司的项目，部署是先在专用服务器 docker 中打包，之后再推送部署到 nginx docker 上。

打包机还是运行的 node 12，比较老了。对于新的 vite 等，已经不能进行打包了。就在想如何升级 node 版本。

<!-- truncate -->

最简单方案当然是让运维升级，但是考虑到众多的项目都在用 node 12，很明显不能直接升上去。最后人家帮忙给我单独做了一个打包镜像，由于是从零单独做的（我也不知道为啥要从零），一开始甚至连 zip 都没有，打包后传输都是问题。考虑到后续可能出现其他缺少命令的情况，我也就没采用这个方案。

曾经听说好像是腾讯，为了运行稳定，直接把 node 以及 node_modules 提交到代码库，直接上线部署的方案。想着不复杂，单独提交个 node 就行了，我也计划试试。

## 尝试升级

在官网直接下载 linux 版 node 16，本地解压缩，放到项目里。

还需要修改下 `.gitlab-ci.yml`，从远端连接中复制内容，放到本地，并追加配置 node 的位置：

```
before_script:
    - export PATH=./node/bin:$PATH
```

本以为就完事了，结果出了两个问题。

## 问题一，node 跑不起来

服务器跑的是 Alpine Linux，这个 linux 版本比较特殊。简单来说就是正常的 node 运行不了。

> Alpine Linux 使用 musl libc，而 Node.js 默认情况下使用 glibc。

找到一个 node 官方网站给出的的非官方下载地址，里面就有对应的 musl 版本： https://unofficial-builds.nodejs.org/download/release/

我本地安装 Alpine Linux 测试了下，正常版本确实不行。但上面的非官方版本可以。

这里还有一个点，那就是 Alpine Linux 必须要更新并安装过 node，比如运行过如下代码：

```
apk add --update nodejs-dev
```

否则直接用非官方版本仍然会缺少组件。

就这样，node 在打包机上就可以跑起来了。

## 问题二，npm 配置有问题

之前再用 node 12 时候，`.gitlab-ci.yml` 文件中，前端配置镜像有类似如下代码（今天再去服务器上查看，竟然他们自己移除了，估计是现在没人用了）：

```
npm config set SASS_BINARY_SITE=xxxx
```

这行内容在 node 16 是不认的，要改成下面的方式：

```
before_script:
    - export SASS_BINARY_SITE=$(echo $BINARY_SITE)
```

## 后记

那对于项目来讲，有没有办法判断 node 版本号，具体是哪个官方版还是非官方版呢？

版本号好办，读取 `process.version` 即可。

如果是想区分官方版还是非官方版本，倒是有一个获取 node 源码包地址的参数 `process.release.sourceUrl` 。

正常的官方版，大概返回：

```
https://nodejs.org/download/release/v16.20.2/node-v16.20.2.tar.gz
```

不过这个我自己测试，有的行有的不行。

比如 Windows 下，都是返回上面官方这种版本。没问题。

docker下，通过 `apk add --update nodejs-dev` 安装的，我认为应该都是非官方版本。但是也返回：

```
https://nodejs.org/download/release/v16.20.2/node-v16.20.2.tar.gz
```

这个不知如何解释。

不过自己拷贝的非官方 node，返回是确实是非官方的地址，即：

```
https://unofficial-builds.nodejs.org/download/release/v18.19.1/node-v18.19.1.tar.gz
```

至于 docker 上默认通过 apk 安装的版本，是官方版本，还不知道如何区分。

官方 linux 版本在 Alpine Linux 跑不起来，才换成了非官方版本。但是默认安装却可以安装官方版本，令人费解。
