---
layout: post
title: "Shadowsocks 影梭使用"
date: 2017-03-20 23:58:00 +8:00
categories: [软件推荐]
tags:  [影梭,shadowsocks,翻墙]
---

首先，请确保你拥有一个 shadowsocks 的账号。这个账号需要包括：IP（域名）、端口、密码、加密方式。

## 下载 shadowsocks 客户端

github上的下载页面：[所有系统的客户端见此](https://github.com/shadowsocks/shadowsocks/wiki/Ports-and-Clients#linux--server-side)

shadowsocks 官网：[所有客户端](http://shadowsocks.org/en/download/clients.html)

我摘抄了几个：

* OSX [介绍页面](https://github.com/shadowsocks/shadowsocks-iOS/wiki/Shadowsocks-for-OSX-%E5%B8%AE%E5%8A%A9) [官方下载地址](https://sourceforge.net/projects/shadowsocksgui/)
* windows [介绍页面](https://github.com/shadowsocks/shadowsocks-windows/wiki/Shadowsocks-Windows-%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E) [官方下载地址](https://github.com/shadowsocks/shadowsocks-windows/releases)
* linux 这个要么自己编译，要么选择编译好的，Ubuntu下还算方便

>  1. 添加PPA源：  sudo add-apt-repository ppa:hzwhuang/ss-qt5
>  2. 更新软件列表：sudo apt-get update
>  3. 安装shadowsocks：sudo apt-get install shadowsocks-qt5

* iOS 请自行App Store 下载 `wingy`或者`Shadowsocks Wingy`。这两个应该是一个人开发，一个新版一个旧版本，但是界面基本一致。
* Android [官方下载地址](https://github.com/shadowsocks/shadowsocks-android/releases) 

## 桌面端配置 shadowsocks

运行软件后，桌面系统就可以在任务栏中看到软件了。

点击它，可以看到功能。以MAC系统为例：

![image](http://cdn0.yukapril.com/blog/2017-03-20-shadowsocks-1.png-wm.black)	

首先介绍下：

* 自动代理模式：就是匹配网站，匹配成功的，就走代理，匹配不成功的（国内网站），就直接访问。这样可以节约代理流量，速度也会快。
* 全剧模式：所有访问都走代理。省心，但是费流量。
* 服务器：这里进行配置。
* 剩余的选项，如果你不懂PAC和GFWList，就不要动。

我们选择 `服务器` - `打开服务器设定`：

![image](http://cdn0.yukapril.com/blog/2017-03-20-shadowsocks-2.png-wm.black)	

此时可以点击左下角的加号，增加一条服务器。

将你的服务器地址（IP或者域名）、端口号、加密方式、密码依次填入。保存即可。

之后，就可以在 `服务器` 栏目中，看到你配置的服务器了。

此时，就可以浏览境外网站了。

## 移动端配置 shadowsocks

以iPhone为例：

![image](http://cdn0.yukapril.com/blog/2017-03-20-shadowsocks-3.png-wm.black)	

我们点击 `选择线路`，`新增线路`。

![image](http://cdn0.yukapril.com/blog/2017-03-20-shadowsocks-4.png-wm.black)	

这里，要选择 `Shadowsocks` 方式

![image](http://cdn0.yukapril.com/blog/2017-03-20-shadowsocks-5.png-wm.black)	

内容上，和桌面端一致。讲你的账号填入即可：服务器地址（IP或者域名）、端口号、加密方式、密码依次填入。代理方式，就是桌面端的`自动代理`和`全局代理`。

这样，我们就能顺利使用 shadowsocks 了。
