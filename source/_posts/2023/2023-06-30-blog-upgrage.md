---
layout: post
title: 博客再次升级，文章写在 Gist 里，并用 Actions 一键部署
date: 2023-06-30 23:35:00 GMT+0800
categories: [ 技术 ]
tags: [ 博客 ]
---

每次写个博客，都要用电脑，准备环境。所以写博客电脑基本上是固定的。上次升级后，终于可以随意了。网页就可以实现了。终于可以使用 iPad 写博客了。

<!-- more -->

## 2016 远古时代 Jekyll

最早的时候，刚开始自建博客，选用的是 Jekyll，因为 Github 可以直接部署静态网页（Github Pages）。

那时候非常痛苦，因为是 Ruby 语言，电脑要准备 Ruby 环境，还有自己不了解 Ruby，也不会开发功能。基本上就是有啥用啥。

## 2019 近些年 Hexo

由于自己不太懂，再加上都说 Jekyll 文章多了编译就慢了，正好 Hexo 又可以“零成本”迁移。也打算升级挑战下，就这么决定了。

代码的改造就不说了，其实迁移文章还好，主要就是兼容老的文章链接风格。如果说费事的话，就是自己改造了点皮肤，花了点时间。

此时需要准备的环境，电脑除了网络通畅外，还要安装工具。这时候的完整的工作流是这样的：

1. 准备 git，下载、上传代码用；
2. 准备 node，打包用；
3. 准备腾讯云 COS 文件管理器，最终静态网站文件上传用；
4. git 克隆代码仓库；
2. 本地 `npm install` 安装依赖；
3. 本地写好文章；
4. 本地 `npm run build` 构建静态网站；
5. 因为我的静态网站部署在腾讯云 COS 上，使用对应工具上传上去，当然用网页端上传也行；
6. 网站整体套了 CDN，故还要手动去腾讯云刷新 CDN；
7. 检查网站内容，有问题的话，重新做 3-7 步；
8. 没问题，最终提交代码到 git 仓库。

安装工具太多，步骤太长了。所以写文章我几乎不换电脑，这样可以省去准备环境，后续再次写文章工作流可以精简掉前两步。

## 2022 初步现代化 Github Actions 自动打包部署

现在回想起来，真是很近的事情。

有一天，终于忍受不了繁杂的步骤了，也想尝试能否用网页写博客，而且 Github Actions 如日中天，为何不尝试下呢。

在项目内指定目录新建文件，或者干脆直接访问 Github Actions，选一个最接近的 Node 部署方案，自己修改了下，下面的是目前最新的：

```yml
name: build-and-deploy

on:
  push:
    branches:
      - master

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout master
        uses: actions/checkout@v3
        with:
          ref: master

      - name: Setup node
        uses: actions/setup-node@v3
        with:
          node-version: "16"

      - name: Build project
        run: npm i && npm run build

      - name: Upload COS
        uses: zkqiang/tencent-cos-action@v0.1.0
        with:
          args: delete -r -f / && upload -r ./public/ /
          secret_id: ${{ secrets.COS_SECRET_ID }}
          secret_key: ${{ secrets.COS_SECRET_KEY }}
          bucket: ${{ secrets.COS_BUCKET }}
          region: ${{ secrets.COS_REGION }}
```

以上大致逻辑为：

* 触发条件为 `master` 分支 `push`；
* 有一个 jobs，叫做 `build`；
* 包含 4 步，拣代码，配置 Node，打包，上传 COS；
* COS 的密钥等，不能泄露，单独在 GitHub 配置了。

就是增加了上面的文件，以及配置了 4 个密钥参数，工作流程大幅缩减。

如果不涉及本地开发代码、本地调试，只是写文章的话，那么只需要：

1. 准备 git 环境，下载上传代码用；
2. git 克隆代码仓库；
3. 本地写好文章；
4. 提交代码到 git 仓库，等待 Github Actions 自动部署；
5. 网站整体套了 CDN，要手动去腾讯云刷新 CDN；
6. 检查网站内容，有问题的话，重新做 3-6 步。

虽然步骤仍然很多，但是已经不再用安装 Node，也不用自己上传了。

其实这个时候，iPad 是可以写博客了，只需要准备 git 工具就好了。代码下载到 iPad 后，markdown 编辑工具就非常容易解决了。最终再提交代码，去腾讯云网页刷新 CDN 就好。

或者直接访问在线版 git 代码仓库，新增 markdown 文章，直接提交。之后再去刷新 CDN。

在网页端、iPad 写文章，已经初显雏形。虽然需要刷新 CDN，但是还算能接受。

其实这种方案，有一个很大的弊端，那就是文章必须一次性写好。如果要分多次写，则要反复提交 git，对于洁癖的我受不了。还有就是虽然没写好，可以通过文章类型设置为草稿，但是实际文章内容已经提交，通过 git 可以查阅到了。

> 那为什么博客仓库要开源呢，一方面很多人都这样做，又没什么安全风险，同时可以方便别人参考自己的改造方案，方便 Fork 之类。而且很多博客用了 Issues 作为评论系统，不开源也不行。

非要这么用也不是不行，单独找地方存放文章内容，写完之后再用上面的方案发布。

存放文章我考虑了 iCloud，公司的 Windows 同步比较麻烦，而且短时间反复保存容易出现冲突。

也考虑了其他同步工具，但都需要安装客户端。好不容易精简了步骤，又要安装新的，不能够认可。

考虑 Notion，所有设备想顺畅访问，网络上是个问题，写文章体验还行，但是它粘贴出来不太好。

## 2023 文章写在 Gist 里，并用 Actions 一键部署

思前想后，也没想到好的临时存放文章的位置。但在一次学习 GitHub API 时候，突然看到了 Gist。

不考虑网络因素的话，Gist 是个好东西，它支持 markdown 语法，写起来很方便。

也支持 GitHub API，可以和项目联动。

这样，流程就变成了：

1. Gist 上写文章（有格式要求），写的时候可以是 Private，最后要发布时候改成 Public，而且可以方便编辑修改，还有历史记录；
2. 手工触发 Actions，抓取文章，并且推送到 git 仓库；
3. 自动触发原有的自动部署 Actions；
4. 原有自动部署 Actions，把刷新 CDN 能力加上。

首先是手动触发 Actions 的思路：

```yml
name: auto-publisher

on:
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    defaults:
      run:
        shell: bash
        working-directory: auto-publisher
    steps:
      - name: Checkout master
        uses: actions/checkout@v3
        with:
          ref: master

      - name: Setup node
        uses: actions/setup-node@v3
        with:
          node-version: "16"
          cache: npm
      - run: npm i
      - run: GH_AUTH_SECRET=${{ secrets.GH_AUTH_SECRET }} node ./publisher.js
```

简单解释下：

* 要开启 `workflow_dispatch`，这样后续可以手动触发，其他触发方式不用管；
* 要执行的代码在 `auto-publisher` 下，所有默认改下目录；
* 执行 2 个任务，拣代码（否则怎么执行对应的 js），配置 Node，并且执行 `publisher.js`；
* 本来是想用 `env` 环境变量来做的，但是脚本内死活接收不到，干脆就直接把密钥传递给执行脚本了。

下面是 `publisher.js`：

```js
const {Octokit} = require('octokit')
const CryptoJS = require('crypto-js')
const CryptoBase64 = require('crypto-js/enc-base64')

const auth = process.env.GH_AUTH_SECRET // Github 密钥
const owner = 'yukapril' // 个人名
const repo = 'yukapril.com' // 仓库名

const octokit = new Octokit({auth})

const Base64 = str => {
  const wordArray = CryptoJS.enc.Utf8.parse(str)
  return CryptoBase64.stringify(wordArray)
}

const getGistList = async () => {
  const json = await octokit.request('GET /users/yukapril/gists', {
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })
  return json.data
}

const getGist = async gistId => {
  const json = await octokit.request(`GET /gists/${gistId}`, {
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })
  return json.data
}

const delGist = async gistId => {
  const json = await octokit.request(`DELETE /gists/${gistId}`, {
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })
  return json.status === 204
}

const uploadContent = async (filename, content, branch) => {
  const year = filename.match(/^\d{4}/)[0]
  const path = `source/_posts/${year}/${filename}`
  const json = await octokit.request(`PUT /repos/${owner}/${repo}/contents/${path}`, {
    message: `add files ${filename}`,
    committer: {
      name: 'actions-bot',
      email: 'your-email@abc.com',
    },
    author: {
      name: 'yukapril',
      email: 'your-email@abc.com',
    },
    content: Base64(content),
    branch,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })
  return json.data
}

const main = async () => {
  const gists = await getGistList()
  gists.forEach(gist => {
    Object.keys(gist.files).forEach(async key => {
      const gistFile = gist.files[key]
      if (/^\d{4}-\d{2}-\d{2}/.test(gistFile.filename)) {
        console.log(`[FIND] find available gist, gistId=${gist.id}, filename=${gistFile.filename}`)
        const gistInfo = await getGist(gist.id)
        for (const gistFileKey of Object.keys(gistInfo.files)) {
          const gistFileInfo = gistInfo.files[gistFileKey]
          console.log(`[QUERY] query content, gistId=${gist.id}, length=${gistFileInfo.content.length}`)
          const uploadResult = await uploadContent(gistFile.filename, gistFileInfo.content, 'master')
          if (uploadResult?.commit?.sha) {
            console.log(`[UPLOAD] upload success! gistId=${gist.id}`)
            const result = await delGist(gist.id)
            if (result) {
              console.log(`[DELETE] delete success! gistId=${gist.id}`)
            }
          }
        }
      }
    })
  })
}

main()
```

代码比较粗糙，尤其没做异常处理，因为我自己会按照规则做，一般不会出现异常情况。

逻辑是：

1. 抓取 Gist，我规定的标题必须是 `2023-06-30` 这种日期格式开头的文章才算；
2. 抓取对应的内容；
3. 将内容上传到 git，我这里处理了上传路径、上传人信息等；
4. 删除对应的 Gist，防止以后再次处理。

这个流程只能新增不能修改，因为修改的话，直接去代码仓库编辑就好了，不用这么复杂。

最后，补充下自动刷新 CDN 的 Actions：

```yml
      - name: Upload COS
        uses: zkqiang/tencent-cos-action@v0.1.0
        with:
          args: delete -r -f / && upload -r ./public/ /
          secret_id: ${{ secrets.COS_SECRET_ID }}
          secret_key: ${{ secrets.COS_SECRET_KEY }}
          bucket: ${{ secrets.COS_BUCKET }}
          region: ${{ secrets.COS_REGION }}
      # 以上为原有，以下为新增
      - name: Flush CDN
        uses: keithnull/tencent-cloud-cdn-purge-cache@v1.0
        env:
          SECRET_ID: ${{ secrets.CDN_SECRET_ID}}
          SECRET_KEY: ${{ secrets.CDN_SECRET_KEY }}
          PATHS: "https://www.yukapril.com/"
          FLUSH_TYPE: "flush" # optional
```

至此，算是比较圆满的解决了。

以上涉及的代码，参考博客 git，见[这里](https://github.com/yukapril/yukapril.com)。代码随时会修改，可能与本文有些许不同。

## 最后

对于我来说，日常博客没问题了，但是一旦涉及文章图片，还是比较麻烦。文章图片我回自己上传对应平台获取链接，插入文章没问题。但是我习惯原始图片也上传到代码仓库留一份备份，这个目前还没办法自动化。

还好，带图片的文章很少。遇到了，就单独人工上传代码仓库吧。

--END--
