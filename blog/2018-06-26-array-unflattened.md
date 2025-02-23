---
title: js 数组扁平化与反扁平化处理（上）
date: 2018-06-26 00:56:00 GMT+0800
tags: [ js, 扁平化 ]
---

在做业管项目时候，遇到老的接口返回的是扁平化的数据结构，但是使用 ElementUI 的 `树状控件` （ `Tree` ）时候，他需要的是非扁平化的数据结构，这就需要对数据进行一次处理了。

一开始思考了很久，但是一旦拿笔写些思路，突然就有了灵感，而且其实非常简单。简单的网上我都找不到这种写法。

**让我们开始吧！**

<!-- truncate -->

先准备一个扁平化的数据：

```js
const flattenedArr = [
  {id: 1, text: 'A'},
  {id: 2, text: 'B'},
  {id: 3, text: 'C'},
  {id: 4, text: 'A1', pid: 1},
  {id: 5, text: 'A2', pid: 1},
  {id: 6, text: 'B1', pid: 2},
  {id: 7, text: 'B2', pid: 2},
  {id: 8, text: 'B21', pid: 7},
  {id: 9, text: 'B22', pid: 7}
]
```

我们最终希望变成这样的数组结构：

```js
[
  {
    id: 1,
    text: "A",
    children: [
      {id: 4, text: "A1"},
      {id: 5, text: "A2"}
    ]
  },
  {
    id: 2,
    text: "B",
    children: [
      {id: 6, text: "B1"},
      {
        id: 7,
        text: "B2",
        children: [
          {id: 8, text: "B21"},
          {id: 9, text: "B22"}
        ]
      }
    ]
  },
  {
    id: 3,
    text: "C"
  }
]
```

看着好像很复杂的样子，每个子节点要放置到对应的父节点的 `chilren` 上。

> 为了简单起见，我们不考虑异常数据。
>
> 即：所有子节点，对应关系都是正确的。

如果要想把子节点放到父节点上，必须要考虑父节点必须已经存在，才能把子节点放置到 `chilren` 上。而且节点层次多起来，如何一层层定位指定的父节点也是问题。

考虑许久，我认为建立一个数组索引会比较方便：

```js
const unflattened = arr => {
  // 拷贝一下原有数组，防止后续修改会影响原数组
  const flattenedArr = JSON.parse(JSON.stringify(arr))

  // 临时缓存索引(id 为下标的对象)
  // 大致这个样子 { 1:{},2:{},3:{} }
  let cache = {}

  flattenedArr.forEach(item => {
    // 使用 id 做缓存索引
    // 之后只需要知道 id，就可以直接找到数据对象
    cache[item.id] = item
  })
}
```

这样处理后，解决了一个大问题，我们只要知道 id，就可以方便的找到该 id 对应的数据。比如要找 id=7：

```js
let item = cache['7']
console.log(item)
// { id: 7, text: 'B2', pid: 2 }
```

后面就容易多了，我们需要把子节点放到父节点上，这时候发现是没有 `children` 字段的，为了方便（省去各种处理判断），我觉得还是统一给所有节点加上比较快：

```js
const unflattened = arr => {
  // 拷贝一下原有数组，防止后续修改会影响原数组
  const flattenedArr = JSON.parse(JSON.stringify(arr))

  // 临时缓存索引(id 为下标的对象)
  // 大致这个样子 { 1:{},2:{},3:{} }
  let cache = {}

  flattenedArr.forEach(item => {
    // 每一个元素都加上 children 字段
    item.children = []

    // 使用 id 做缓存索引
    // 之后只需要知道 id，就可以直接找到数据对象
    cache[item.id] = item
  })
}
```

**下面，我们就要考虑如何进行构建期望的数据结构了。**

因为数组的顺序不一定是根结点在最前，所以要找到最基础的根结点比较重要，后续才能踏踏实实的子节点往上挂载。

先创建一个最终返回的数组 `unflattenedArr`，这里面目前主要放根节点，在这个例子中，根节点有 3 个。

此外，再创建一个临时数组 `tempArr`，主要用于记录非根节点。本例子中，共有 9 个节点，排除 3 个根节点外，剩下的 6 个节点，应临时放置在这里。后续我们可以方便的再处理这 6 个节点的数据。

```js
const unflattened = arr => {
  // 拷贝一下原有数组，防止后续修改会影响原数组
  const flattenedArr = JSON.parse(JSON.stringify(arr))

  // 临时缓存索引(id 为下标的对象)
  // 大致这个样子 { 1:{},2:{},3:{} }
  let cache = {}
  // 最终要返回的非扁平化数组
  let unflattenedArr = []
  // 存放非根结点的数组
  let tempArr = []

  flattenedArr.forEach(item => {
    // 每一个元素都加上 children 字段
    item.children = []
    // 使用 id 做缓存索引
    // 之后只需要知道 id，就可以直接找到数据对象
    cache[item.id] = item
    if (!item.pid) {
      // 不存在 pid 属性，当前元素为根结点
      // 直接放到最终的返回对象里面，后续元素可以直接挂载
      unflattenedArr.push(item)
    } else {
      // 子节点，放到新对象里面，后续会用到
      tempArr.push(item)
    }
  })
  return unflattenedArr
}
```

通过这次调整，我们已经安置好根节点了（`unflattenedArr`），而且非根节点也知道了（`tempArr`）。

现在，我们需要把非根节点放置到相应位置了。还记得上面的 `cache` 吗，我们可以非常方便的找到任何一个 id 的节点位置。

```js
const unflattened = arr => {
  // 拷贝一下原有数组，防止后续修改会影响原数组
  const flattenedArr = JSON.parse(JSON.stringify(arr))

  // 临时缓存索引(id 为下标的对象)
  // 大致这个样子 { 1:{},2:{},3:{} }
  let cache = {}

  // 最终要返回的非扁平化数组
  let unflattenedArr = []
  // 存放非根结点的数组
  let tempArr = []

  flattenedArr.forEach(item => {
    // 每一个元素都加上 children 字段
    item.children = []

    // 使用 id 做缓存索引
    // 之后只需要知道 id，就可以直接找到数据对象
    cache[item.id] = item

    if (!item.pid) {
      // 不存在 pid 属性，当前元素为根结点
      // 直接放到最终的返回对象里面，后续元素可以直接挂载
      unflattenedArr.push(item)
    } else {
      // 子节点，放到新对象里面，后续会用到
      tempArr.push(item)
    }
  })

  // 处理非根子节点
  tempArr.forEach(item => {
    // 当前 item 的父节点 id
    const pid = item.pid
    // 通过上面的 cache 索引，直接将子节点挂到对应的父节点上
    cache[pid].children.push(item)
  })

  return unflattenedArr
}
```

这时我们可以看下返回数据，已经非常好了。的确如此，完全可以直接使用了。

```js
[
  {
    "id": 1,
    "text": "A",
    "children": [
      {
        "id": 4,
        "text": "A1",
        "pid": 1,
        "children": []
      },
      {
        "id": 5,
        "text": "A2",
        "pid": 1,
        "children": []
      }
    ]
  },
  {
    "id": 2,
    "text": "B",
    "children": [
      {
        "id": 6,
        "text": "B1",
        "pid": 2,
        "children": []
      },
      {
        "id": 7,
        "text": "B2",
        "pid": 2,
        "children": [
          {
            "id": 8,
            "text": "B21",
            "pid": 7,
            "children": []
          },
          {
            "id": 9,
            "text": "B22",
            "pid": 7,
            "children": []
          }
        ]
      }
    ]
  },
  {
    "id": 3,
    "text": "C",
    "children": []
  }
]
```

对于一些细节上，我们还有提升输出质量的空间：

1. `pid` 字段，因为已经是嵌套结构，这个字段不再有价值
2. `children` 字段，末端子节点是没有意义的，当然如果有扩展的话，还是保留着好。

对于这两个细节上，也很好解决，因为我们有所有节点的索引嘛。再第二个循环后面，再加一个循环处理下：

```js
Object.keys(cache).forEach(id => {
  const item = cache[id]
  if (item.children.length === 0) {
    delete item.children
  }
  delete item.pid
})
```

这样就彻底搞定了。

本文代码见此：[Github](https://github.com/yukapril/learning/blob/master/array-flattened/unflattened.html)

