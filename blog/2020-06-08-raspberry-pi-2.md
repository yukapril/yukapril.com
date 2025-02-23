---
title: 树莓派 Raspberry Pi (二)：DDNS 动态域名解析实现
date: 2020-06-08 21:11:00 GMT+0800
tags: [ 开发板, 树莓派, node ]
---

如果想从外网访问家里的树莓派，除了家里要有外网 IP 外，还需要配置动态域名解析。

<!-- truncate -->

首先是外网 IP，这个必须要有。否则不能采用直连的方案，也就不能用动态域名解析的方案了。

但这不代表外网一定访问不了。比如花生壳穿透，ngrok 等之类内网穿透软件，还是可以实现的。不过穿透方案，有很大局限性，比如 gnrok 国内环境不稳定，还有各种收费等。

本文就单说有外网 IP，但是会经常变化的情况。

## 使用光猫、路由实现

如果光猫、路由支持 DDNS（动态域名解析），可以考虑直接使用。

我家里联通光猫支持 TZO、Oray、DynDNS，而网件路由支持 NetGear、NO-IP、3322、Oray、DynDNS。

反正我都不熟悉，或者有的根本就是收费服务。

## 使用支持 API 的域名解析服务商

首先要明确一点，基本上支持域名解析 API 调用的服务商，都支持类似 `https://api.xxx.com/ddns?token=xxx&ip=xxx` 这种通过连接形式修改的方法。而且上述光猫、路由中，可能还会支持自定义服务商，相当于定义好相关字段，当外网 IP 改变后，自动实现调用。

我的域名托管在阿里云。也有 API 调用的方法。方法思路也一样，定时检测自己的 IP 地址，发现阿里云填写的地址不同，则重新变更下域名解析就行了。

## 使用阿里云 DDNS API 实现动态域名解析

#### 创建账号，获取 KEY

首先，要创建一个新账号，并开通 API 相应权限权限。

到阿里云 `RAM 访问控制` 中，新建账号，权限的话，分配 `AliyunDNSFullAccess` 就够了。之后会得到 AccessKeyId、accessKeySecret。留好备用。

#### Node 官方实现

参考文档：[https://help.aliyun.com/document_detail/124923.html?spm=a2c4g.11186623.6.621.5ad930b1uJsGI4#title-fbv-si0-ict](https://help.aliyun.com/document_detail/124923.html?spm=a2c4g.11186623.6.621.5ad930b1uJsGI4#title-fbv-si0-ict)

```js
const Core = require('@alicloud/pop-core');

// 创建连接
var client = new Core({
  accessKeyId: '<accessKeyId>',
  accessKeySecret: '<accessSecret>',
  endpoint: 'https://alidns.aliyuncs.com', // 不要改
  apiVersion: '2015-01-09' // 不要改
});

var params = {
  "DomainName": "dns-example.com", // 你要修改的跟域名
  "RR": "apitest1", // 修改的子域名，比如 test.aa.com，这里填写 test
  "Type": "A", // 修改类型，这里为A记录
  "Value": "3.0.3.0" // 修改后的值
}

var requestOption = {
  method: 'POST'
};

client.request('AddDomainRecord', params, requestOption).then((result) => {
  console.log(JSON.stringify(result));
}, (ex) => {
  console.log(ex);
})
```

#### Node 我的实现

参考代码：[https://github.com/yukapril/network-service/blob/master/app/service/net.js](https://github.com/yukapril/network-service/blob/master/app/service/net.js)

我用的是 eggjs，配置好了定时任务。以下代码为核心逻辑：

首先是完成查询自己的 IP，我用的 ip-api 的接口：

```js
function myIp() {
  const {ctx} = this
  return new Promise(async (resolve, reject) => {
    try {
      const result = await ctx.curl('http://ip-api.com/json', {dataType: 'json'})
      const json = result.data
      resolve(json)
    } catch (e) {
      reject(e)
    }
  })
}  
```

再写一个查询阿里云当前 DNS 配置的方法。通过此方法，我们可以查到指定子域名的相关数据。后续更新的时候要用到的：

```js
const Core = require('@alicloud/pop-core')

const getDnsRecord = (subdomain) => {
  // 参考官方例子，填好自己的id/secret
  const client = new Core({
    accessKeyId: 'xxx',
    accessKeySecret: 'xxx',
    endpoint: 'https://alidns.aliyuncs.com', // 不要改
    apiVersion: '2015-01-09' // 不要改
  })

  const requestOption = {
    method: 'POST'
  }

  const params = {
    RegionId: 'cn-hangzhou', // 好像所有人都是这个
    DomainName: 'abc.com', // 填写自己的域名
    PageSize: 500 // 一次性多查点，省的翻页了
  }

  return new Promise(async (resolve, reject) => {
    try {
      const result = await client.request('DescribeDomainRecords', params, requestOption)
      const record = result.DomainRecords.Record.filter(item => {
        return item.RR === subdomain
      })[0]
      resolve(record)
    } catch (ex) {
      reject(ex)
    }
  })
}
```

如果发现当前 IP 和阿里云中查询的 IP 不同，则需要更新。写一个更新方法：

```js
const Core = require('@alicloud/pop-core')

const updateDnsRecord = (recordId, rr, ip) => {
  // 参考官方例子，填好自己的id/secret
  const client = new Core({
    accessKeyId: 'xxx',
    accessKeySecret: 'xxx',
    endpoint: 'https://alidns.aliyuncs.com', // 不要改
    apiVersion: '2015-01-09' // 不要改
  })

  const requestOption = {
    method: 'POST'
  }

  const params = {
    RegionId: 'cn-hangzhou',
    RecordId: recordId,
    RR: rr,
    Type: 'A',
    Value: ip
  }

  return new Promise(async (resolve, reject) => {
    try {
      const result = await client.request('UpdateDomainRecord', params, requestOption)
      resolve()
    } catch (ex) {
      reject(ex)
    }
  })
}
```

最后，对以上的方法，进行组合：

```js
// 自己要修改的子域名
const rr = 'test'

// 查询自己的 IP
const ipData = await myIp()
const ip = ipData.query

// 查询阿里云配置的记录
const record = await getDnsRecord(rr)
// 如果配置的记录和当前 IP 相同，可以结束了
if (record.Value === ip) return
// 否则要更新阿里云 IP
await updateDnsRecord(record.RecordId, rr, ip)
```

整体写完后，其实也很简单的嘛~没有那么复杂。

