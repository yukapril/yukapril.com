---
title: 域名邮箱操作指南 - 网易域名邮箱配置方法
date: 2022-11-20 16:48:00 GMT+0800
tags: [ email, 邮箱, 域名邮箱, 网易 ]
---

这篇文章来写如何配置网易域名邮箱。

<!-- truncate -->

> 系列文章：
>
> 1. [再谈域名邮箱](/blog/2022/11/06/email)
> 2. [域名邮箱操作指南 - zoho 域名邮箱配置方法](/blog/2022/11/12/email-zoho)
> 3. [域名邮箱操作指南 - 网易域名邮箱配置方法](/blog/2022/11/20/email-netease)
> 4. [域名邮箱操作指南 - cloudflare 邮件转发](/blog/2022/11/27/email-cloudflare)
> 5. [域名邮箱操作指南 - Gmail 及 Outlook、网易邮件代发](/blog/2022/12/01/email-gmail)

## 网易域名邮箱配置方法

访问地址：[https://ym.163.com](https://ym.163.com)。直接输入手机号完成登录，之后输入域名等用户信息即可创建。

随后即可进入默认赠送的网易域名的邮箱。整体还算干净简洁好用。此时还是默认送的域名，我们要改成自己的域名。

<img src="https://cdn.nlark.com/yuque/0/2022/jpeg/86612/1668933696374-823084d7-cd17-4f28-8db3-8bd9d36a25c0.jpeg" referrerpolicy="no-referrer" alt="网易域名邮箱页面" />

1、点击左上角头像，选择"管理后台"栏目。

2、找到"组织机构管理"-"域名管理"。

<img src="https://cdn.nlark.com/yuque/0/2022/jpeg/86612/1668933720823-1c090f43-9404-4264-85af-0e0787f301ea.jpeg" referrerpolicy="no-referrer" alt="域名管理栏目" />

3、点击验证中的域名，会提示如何配置，按此配置好即可。这一步验证，网易应该是定时轮询，所以需要等待比较久。

<img src="https://cdn.nlark.com/yuque/0/2022/jpeg/86612/1668933733937-7b552bf5-eaac-49bd-9d53-06863581ed23.jpeg" referrerpolicy="no-referrer" alt="配置对应的CNAME" />

## 网易域名邮箱使用体验

可以访问[网易域名邮箱首页](https://ym.163.com)，登录手机号后，选择域名邮箱进行跳转。

同样的，也可以配置好域名邮箱首页。具体的 DNS 配置方法，参考[这里](https://qiye.163.com/help/dns.html#domain=test.com&display_domain=test.com)。

> 配置的时候，注意选择"其他域名注册商"、"已备案"。这样直接会给出配置方法。方法中的第三步就是域名邮箱首页的配置。

进入邮箱后，页面非常干净简洁。

<img src="https://cdn.nlark.com/yuque/0/2022/jpeg/86612/1668933987312-bf964e40-569a-492e-af11-9ff9fdb66a00.jpeg" referrerpolicy="no-referrer" alt="换绑域名后的首页" />

功能上，有外出回复、邮件分类、自动转发、反垃圾配置。功能稍微有点少。

上面截图的是新版网易灵犀办公的邮箱，还可以尝试访问[这里](https://mailhz.qiye.163.com)来登录，使用网易老的域名邮箱页面。老的系统可以配置的稍微多一点点而已。由于不是官方的方案，所以不能长久使用。

## 小结

网易域名邮箱界面简洁，功能一般，常用的功能还算都提供。配置起来也算不太复杂。而且本身就是国内，访问非常便利。

缺点就是功能上稍微少了点。未来不确定是不是所有域名都支持（曾经不支持 `.tk` 等域名），而且不确定未来是否要求域名必须备案。
