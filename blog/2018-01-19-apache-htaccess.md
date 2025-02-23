---
title: "虚拟主机 Apache 一个目录划分多个域名使用"
date: 2018-01-19 22:52:00 GMT+0800
tags: [ apache, htaccess ]
---

apache 下的空间，其实很容易实现一个目录下，绑定多个网站域名。

<!-- truncate -->

这都要说到想当初，在阿里云域名转入后，提示了一个广告，允许低价购买共享虚拟主机，这个阿里云的空间一直就保留着。现在续费大概也就是每年 60 块左右。虽然是垃圾配置，也不能弄 https，但是国内访问速度绝对一流，做个博客还是很适合的。

本身虚拟主机是 apache + php 的方案，也带有 mySql，但是我还是用了 jekyll 静态页面博客。这么说就远了...回归主题。

## 如何配置

首先要能通过 ftp 连接到虚拟主机，因为不是 vps 机器，通过 ftp 是我们和虚拟主机唯一的通讯方式...

在网页目录下，可以上传一个 `.htaccess` 文件。

这个有技巧，有的系统不方便创建和操作（比如 Mac 和 linux 会隐藏，Windows 下貌似是非法文件），可以直接创建一个 `htaccess` 文件，上传到 ftp 后，再进行改名。

## 访问地址 301，302 跳转

比如我可以配置凡是访问 `/about` 路径，直接访问 `aboutme/about.php`

```
Redirect permanent about aboutme/about.php
order deny,allow
```

## 根据主机头访问不同目录

这才是这篇文章的重点。

我希望用户访问 `yukapril.com` 后，访问 `yukapril_com` 目录；

访问 `my.yukapril.com` 后，访问 `my_yukapril_com` 目录。

```
RewriteEngine on

RewriteCond %{HTTP_HOST} yukapril.com
RewriteCond %{REQUEST_URI} !^/yukapril_com
RewriteRule ^(.*)$ /yukapril_com/$1

RewriteCond %{HTTP_HOST} my.yukapril.com
RewriteCond %{REQUEST_URI} !^/my_yukapril_com
RewriteRule ^(.*)$ /my_yukapril_com/$1

order deny,allow
```

每配置一个域名，复制三行就行了。

`.htaccess` 还有很多玩法，可以自行搜索看看～

## 小问题

按照上面这么配置，也会有一些体验上的问题。

比如，你的网站有链接 `http://yukapril.com/2018/01/01.html`，此时如果你访问 `http://yukapril.com/2018` 那么肯定是 403 错误（Forbidden）。

此时因为我是静态页面，没有进行错误处理，所以错误消息会提示 `The requested URL /yukapril_com/2018/ was not found on this server.`

这个我就不会直接配置了。

一般虚拟主机商支持配置一个通用的错误页面，你的各个域名，如果相同错误码，错误页面也相同，那就好办。直接配置下就行了。但是如果不同的域名要求错误页不同，这个需要变换思路解决。

变相的解决方案是，在每个域名对应目录里面，再次添加 `.htaccess` 文件。

大致写法如下：

```
ErrorDocument 403 /403.html
ErrorDocument 404 /404.html
order deny,allow
```
