---
title: 域名邮箱操作指南 - cloudflare 邮件转发
date: 2022-11-27 20:01:00 GMT+0800
tags: [ email, 邮箱, 域名邮箱, cloudflare ]
---

这次要做的是，使用 cloudflare 绑定域名，托管 DNS 解析，并配置邮件转发。

<!-- truncate -->

> 系列文章：
>
> 1. [再谈域名邮箱](/blog/2022/11/06/email)
> 2. [域名邮箱操作指南 - zoho 域名邮箱配置方法](/blog/2022/11/12/email-zoho)
> 3. [域名邮箱操作指南 - 网易域名邮箱配置方法](/blog/2022/11/20/email-netease)
> 4. [域名邮箱操作指南 - cloudflare 邮件转发](/blog/2022/11/27/email-cloudflare)
> 5. [域名邮箱操作指南 - Gmail 及 Outlook、网易邮件代发](/blog/2022/12/01/email-gmail)

## 前提条件

首先访问 [cloudflare](https://www.cloudflare.com/zh-cn/)，注册并完成登录。具体方法网上教程很多，请自行查询。

## 完成域名在 cloudflare 的NDS解析

> 如果你的域名已经托管在 cloudflare 这步直接忽略。

进入后，可以选择中文（在右上角有选项）。下面我按照默认的英文方式进行介绍。

左侧选择 `websites`。右边选择 `Add a site`。

<img src="https://cdn.nlark.com/yuque/0/2022/png/86612/1669549820261-ca93c07b-2683-4b38-8a75-c4282916d2da.png" referrerpolicy="no-referrer" alt="添加站点" />

之后让选择套餐，我们选择免费的 Free。

<img src="https://cdn.nlark.com/yuque/0/2022/png/86612/1669549579839-556fee65-b880-4aac-9d80-f40dcea4529d.png" referrerpolicy="no-referrer" alt="选择免费版本" />

之后，cloudflare 会自动扫描你的域名 DNS 原有的配置，并帮你带入过来。这个不一定准，可以自己后续维护。

最后一步，要求你把 NS 解析到 cloudflare 上。一般是如下两个：

```
eva.ns.cloudflare.com
roan.ns.cloudflare.com
```

你需要在域名注册商那里修改为这两个值。具体生效时间不确定，最慢 48 小时。

## 在 DNS 解析中配置邮件转发

还是在首页，左侧选择 `websites`。右边查看你的你的域名。你的域名应该是 `Active` 状态才是生效。

### 第一步，配置邮件 DNS

左侧选择 `Email - Email Routing`，右侧选择 `routes`。

<img src="https://cdn.nlark.com/yuque/0/2022/png/86612/1669549608266-efbfbdf1-7298-4744-8608-d2a8cdab5486.png" referrerpolicy="no-referrer" alt="邮件转发配置" />

我们先要配置好 DNS 的 `MX` 记录，点击黄色区域的 `Enable Email Routing`，cloudflare 可以自动来配置。点击后，会提示要配置的内容选项（默认情况下都是 Missing 未配置状态），再次点击 `Enable Email Routing` 以及确认即可。

> 随后我们就可以在左侧 `DNS - Records` 中看到新增的 `MX` `TXT` 记录了。

### 第二步，配置转发的邮箱

点击 `Destination addresses` 的 `Add destination address`，输入转发邮箱保存即可。

之后要在邮箱中点击链接进行验证才算完成。

### 第三步，配置邮件转发

点击 `Create address`，创建新的邮件转发。

<img src="https://cdn.nlark.com/yuque/0/2022/png/86612/1669549614041-00bb5313-ef82-4d18-a608-fe8e14861081.png" referrerpolicy="no-referrer" alt="创建邮件转发" />

输入自己希望的邮件名，即可配置。支持转发 `