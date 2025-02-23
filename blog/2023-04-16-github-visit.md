---
title: Github 访问加速方案
date: 2023-04-16 12:02:00 GMT+0800
tags: [ github ]
---

访问 Github 速度比较慢，我找了一些可行的方案。

<!-- truncate -->

## 使用现有的某些技术方案

可以访问任何网站那种。这种成本最高，需要自己购买。根据自己的需求和习惯，浏览器访问 GitHub 可能需要安装切换分流等插件，以及命令行配置代理即可。或者可以直接配置好【设置系统 Proxy】。

```sh
export https_proxy=http://127.0.0.1:7890
export http_proxy=http://127.0.0.1:7890
export all_proxy=socks5://127.0.0.1:7890
```

## 使用第三方专用工具

这种工具一般都需要安装证书，这会使得工具可以明文解析受限网站，安全性待考证。不过个别工具有开源，请自行考量。

比如 [Watt Toolkit](https://steampp.net/)，支持 Github Google 字体等，但不支持 Google。相对稳定。下载工具后注意，下载后不需要开启任何脚本，直接一键加速即可。

再比如 [FastGithub](https://github.com/dotnetcore/FastGithub)。使用简单，只支持 Github。

## 使用改 host 方案

这种就是定期扫描可用 IP，稳不稳主要看剩余可用 IP 多少。

比如 [GitHub520](https://github.com/521xueweihan/GitHub520)，对应的 gitee 地址是 [GitHub520 - gitee](https://gitee.com/klmahuaw/GitHub520)。gitee 更新不如 GitHub 快。

## 使用游戏加速器

嗯，这个比较冷门，但确实有效。

比如 网易UU，它竟然真的可以加速 GitHub。

## 代码克隆方案

如果仅仅是想下载代码和最终产物，那么可以考虑在 gitee 进行克隆。具体可以参考 [gitee - mirrors](https://gitee.com/mirrors)。

## 下载文件方案

如果仅仅要下载最终产物，那么可以考虑这种方案。之前基本上都是个人使用 cloudflare 自建的方案，也有一些成品的服务。由于限制比较多，而且不太好找，基本上不太推荐。
