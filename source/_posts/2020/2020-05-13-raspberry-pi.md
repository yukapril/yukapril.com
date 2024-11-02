---
layout: post
title: 树莓派 Raspberry Pi 4B 上手
date: 2020-05-13 23:37:00 GMT+0800
categories: [ 开发板 ]
tags: [ 树莓派 ]
---

从 2018 年就开始考虑入手一个树莓派玩玩，当时还是 Raspberry Pi 3B+ 刚出的时候。后来发现自己没有太多用途，也就没着急入手。一晃到了 2019 年，看了阮一峰老师的文章，介绍树莓派的入门，再次想起了这个东西。可惜当时感觉也没有什么用途，再加上听说要出 Raspberry Pi 4B 了，就特意等了等。

2019 年 6 月，果真推出 Raspberry Pi 4B 了，不过当时价格虚高，等到十一左右才算稳定。而且爆出了供电问题。而且，我还是没什么用途。

2020 年刚过，终于下决心了。这次真的有用途了。

<!-- more -->

## 入手 Raspberry Pi 4B (4GB)

![外包装已经被我打开，因为收到后第一时间就开箱欣赏了](https://cdn1.yukapril.com/2020-05-11-pi-1.jpg)

![配件全家福](https://cdn1.yukapril.com/2020-05-11-pi-2.jpg)

![Raspberry Pi 4B 特写](https://cdn1.yukapril.com/2020-05-11-pi-3.jpg)

![Raspberry Pi 4B 特写](https://cdn1.yukapril.com/2020-05-11-pi-4.jpg)

拿到手之后，才发现他是如此的小巧，和信用卡般的大小，拿在手里迷你至极。甚至打开快递盒后，一度认为电源的盒子内装的才是本体。

同时被它的做工惊艳到了。虽然是开发板，入门级电脑，但做工绝不含糊，规整的电路和清晰的印刷给我留下了极深的印象。

后来甚至在想，要不要再买一个，放在公司或者床头，当个摆件?

## 版本选择

性能上，Raspberry Pi 4B 确实有较大提升，但是温度据说也比较高。日常使用至少建议配散热器（散热壳），中度使用还需要风扇。

Raspberry Pi 3B / 3B+，虽然配置低了些，但是会温度低一些，跑跑日常工具也够用。

价格上，现在（2020-05-11），Raspberry Pi 3B+ 235 元左右，Raspberry Pi 4B 的 2GB 版本 260 元左右，4GB版本 405 元左右。

本着买新不买旧，如果没买过的话，建议 Raspberry Pi 4B。跑小功能的话，2GB版本够用了。如果不差钱，直接 4GB 版本。如果有了 3B 系列，没遇到瓶颈，可以不换。

如果想用桌面的话，建议 Pi 4B 4GB 版本。

如果追求 USB 接口速度，网口速度等，NAS 等用途，选 Pi 4B。

此外，Pi 4B 由于供电问题，新版已经修改了这个硬件 bug，买的时候，询问店家是否是 v1.2 及之后版本。

## Micro SD(TF) 卡选择

Micro SD 卡就是 TF 卡。就是那种非常小，指甲盖大小的卡。如果套上一个外壳，可以变成 SD 卡。

![各种卡介绍](https://cdn1.yukapril.com/2020-05-11-pi-5.jpg)

为了好拼写，下文直接叫做 TF 卡。

由于树莓派 4B 本身 TF 速度大概是读取不到 100M/s，写入 40M/s 左右。所以不需要买比较顶级的卡，一方面是多花钱性能用不到，另一方面可能不兼容。

没听说有用户使用 256GB 的卡，不确定这么大容量是否兼容。128GB 有 4B 用户在用，但也很少。稳妥起见，最大 64GB 为宜。不能小于 16GB，否则空间太小。

根据某个淘宝店家传言，之前树莓派对三星的卡兼容不好，尤其容量大的卡。

大部分人都是选择常规容量卡，如果有额外需求，外挂硬盘。

## 启动树莓派

启动树莓派有几部分内容：

* 硬件的准备（最小规格）
* TF 卡的准备
* 首次进行开机 ssh 和网络的准备
* 开机和其他一些后续建议的设置

接下来我分别说明。

## 硬件的准备

要想用树莓派，硬件必须准备的：

* 树莓派本体
* 电源适配器，4B 建议官方电源或店家电源，因为老的版本硬件有bug，不是所有的 type-C 电源都可用
* 装有系统的 TF 卡
* 最好有网线，操作起来很简单。没有的话就要配置 WiFi

不需要 HDMI 线，不需要额外显示器键盘鼠标等。

## TF 卡的准备

#### 1. 下载  TF卡烧录软件(Raspberry Pi Imager)

> 曾经据说这个软件可能还不稳定，可以用 balena Etcher 等工具替代。不过我建议先用 Raspberry Pi Imager 试试，如果有问题在换。

访问 [官网下载区](https://www.raspberrypi.org/downloads/) 即可下载 Raspberry Pi Imager。

#### 2. 下载操作系统(Raspbian)

> 建议选择官方系统，文档更多。遇到问题也稍微好解决一点。其他的系统最多性能比较好，但维护起来没什么优势。

Raspbian 操作系统官网提供三个版本：

* Raspbian Buster with desktop and recommended software：桌面版，外带一堆软件，不是特别推荐，除非你要作为桌面版拿来体验玩玩。
* Raspbian Buster with desktop ：桌面版，没有附加软件，推荐
* Raspbian Buster Lite：精简版，就是没有桌面，如果主要跑服务，推荐

我选择的是 Raspbian Buster with desktop，后续可以通过 VNC 开远程桌面。不过 VNC 对我来说目前还没什么实际用途。

#### 3. 烧录 TF 卡

![Raspberry Pi Imager](https://cdn1.yukapril.com/2020-05-11-pi-6.jpg)

使用第一步的软件，对第二步的系统 img 文件进行烧录。操作很简单。

唯一要注意的，选择 「Operating System」时候，选择最后一个 「Use Custom」，来选择你下载的文件。

## 首次进行开机 ssh 和网络的准备

烧录完毕 TF 卡，重新插拔后会发现，只能看到一个几百 MB 的 Fat32 分区了。这个是启动分区，Fat32 格式所有电脑都可以识别和修改里面的内容。剩余的空间，会单独分区用作树莓派系统。

此时如果直接插卡开机，是不能通过 ssh 进行连接的。

需要在分区内，增加一个名字叫做 `ssh` 的空文件。

如果使用网线，则不需要额外配置网络。如果想用 WiFi 进行连接，可以搜索下相关文档，看过之后你就知道还是准备条网线才是真香。

## 开机和其他一些后续建议的设置

准备好所有物品，插卡，接入电源，接好网线。

树莓派尾部有两个灯，一红一绿。红色灯是电源指示灯，绿色是硬盘指示灯。一般是红色灯常亮，绿色灯开机亮，之后闪烁。

通过路由或者其他方式，查到树莓派的 IP 地址。下文以 `10.0.0.81` 说明。

```bash
ssh pi@10.0.0.81 # 以用户pi来链接10.0.0.81
# 之后会要求输入密码，默认密码raspberry
```

链接成功后，执行配置工具：

```bash
sudo raspi-config 
```

![raspi-config](https://cdn1.yukapril.com/2020-05-11-pi-7.jpg)

在这里可以修改密码、配置时区、键盘布局、网络 WiFi 等。请自行配置即可，比较容易的。

#### 开启 VNC

如果想远程桌面，可以开启 VNC。单独说下开启 VNC，因为有坑。

进入`5 Interfacing Options` 后，选择 `P3 VNC` 进行开启。之后需要到 `7 Advanced Options`中，配置 `A5 Resolution` 分辨率。**如果不配置分辨率，使用 VNC 链接会屏幕无内容或报错。**

#### 切换到国内源

Raspberry Pi 有两个地方需要修改。建议先备份，再修改。

```bash
sudo cp /etc/apt/sources.list /etc/apt/sources.list.backup
sudo vi /etc/apt/sources.list
# 编辑 URL 部分，都改成 
# http://mirrors.tuna.tsinghua.edu.cn/raspbian/raspbian/
# 其他地方不要改
```

```bash
sudo cp /etc/apt/sources.list.d/raspi.list /etc/apt/sources.list.d/raspi.list.backup
sudo vi /etc/apt/sources.list.d/raspi.list
# 编辑 URL 部分，都改成 
# http://mirrors.tuna.tsinghua.edu.cn/raspberrypi/
# 其他地方不要改
```

#### 更新 EEPROM

**不了解 EEPROM，这个操作可以不做。**

由于 Raspberry Pi 4B 启动代码不是放在 TF 卡里了，所以如果有必要，可以手动更新 EEPROM。

> 目前 4B 的 EEPROM 不支持 USB 等启动，等后续 EEPROM 更新。

```bash
sudo apt install rpi-eeprom
sudo rpi-eeprom-update
```

## 参考文档

* [树莓派LED指示灯状态的解释](https://shumeipai.nxez.com/2014/09/30/raspberry-pi-led-status-detail.html)
* [树莓派 VNC Viewer 远程桌面配置教程](http://www.52pi.net/archives/1729)
* [树莓派4 Buster换源](https://www.quarkbook.com/?p=636)

--END--
