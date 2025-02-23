---
title: 树莓派 Raspberry Pi (三)：安装RSS TT-RSS
date: 2020-07-05 16:05:00 GMT+0800
tags: [ 开发板, 树莓派, Tiny Tiny, rss ]
---

一直在加班，可算抽出点时间可以写博客了。不过由于 TTRSS 安装复杂，我也在测试它的稳定性。结果，上次树莓派重启后，果真挂了，所以只能大概说说当时安装时候的经验，可以参考。但不推荐在树莓派上跑。

<!-- truncate -->

安装过程其实挺简单的，但是 TTRSS 的 docker 中用了一个服务器软件，没有 ARM 版本的，所以直接安装必定失败。

安装过程，参考官方文档[这里](https://git.tt-rss.org/fox/ttrss-docker-compose)。

**大致说来，也就几步：**

**首先，确保机器环境。**

确保你树莓派上有 docker 和docker-compose，以及使用源码安装，需要 git。

**其次，下载源码。**

执行下脚本，就可以克隆源码了。

```bash
git clone https://git.tt-rss.org/fox/ttrss-docker-compose.git ttrss-docker && cd ttrss-docker
```

**再后，完成配置文件。**

把 `.env-dist` 拷贝一个，改名为 `.env`，然后可以配置下机器 IP 等。这里建议直接配本机 `127.0.0.1`。后续外网访问的话，在机器上起一个 Nginx 做个前置。

**修改源码。**

如果是 ARM 架构的 CPU，比如是树莓派，此步骤必须。其他架构的 CPU，比如 x86/amd64，此步骤可以不做。

这个问题参考来源[这里](https://community.tt-rss.org/t/cant-install-ttrss-on-a-raspberry-pi-4-with-docker/3135)。

修改 `/web/Dockerfile` 文件:

```Dockerfile
# FROM abiosoft/caddy:no-stats
# 需要原有的修改为 jessestuart/caddy
FROM jessestuart/caddy
```

**最后，完成构建并启动。**

执行下列脚本，即可完成构建并启动。可以在树莓派中，访问 `127.0.0.1:8280` 来试试了。

```bash
docker-compose up --build
```

## 小结

方法是这样，但是用了一个月后，重启了树莓派，项目就再也启动不了了。突然报错了，所以还是不太建议树莓派来启动。

原本从 Feedly 切换到 TT-RSS，结果又出问题，只能在切换会 Feedly，每次看新闻还得科学上网。
