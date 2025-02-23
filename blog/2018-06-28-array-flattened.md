---
title: js 数组扁平化与反扁平化处理（下）
date: 2018-06-28 00:24:00 GMT+0800
tags: [ js, 扁平化 ]
---

上一次我们写了一个函数，将扁平化的数组转为非扁平化。这次我们继续，将上次最终的结果，进行扁平化处理。

<!-- truncate -->

首先准备出上次的最终结果，作为需要处理的数据：

```js
const unflattenedArr = [
  {
    "id": 1,
    "text": "A",
    "children": [
      {"id": 4, "text": "A1"},
      {"id": 5, "text": "A2"}
    ]
  },
  {
    "id": 2,
    "text": "B",
    "children": [
      {
        "id": 6,
        "text": "B1"
      },
      {
        "id": 7,
        "text": "B2",
        "children": [
          {"id": 8, "text": "B21"},
          {"id": 9, "text": "B22"}
        ]
      }
    ]
  },
  {
    "id": 3,
    "text": "C"
  }
]
```

想把复杂的结构扁平化，就是一层一层递归输出。写法还算简单：

```js
const flatten = arr => {
  let unflattenedArr = JSON.parse(JSON.stringify(arr))
  let ret = []
  // 循环遍历
  unflattenedArr.forEach(item => {
    // 直接放置到存储数组中
    let obj = {
      id: item.id,
      text: item.text
    }
    ret.push(obj)

    // 如果存在子节点，还需要递归遍历
    if (item.children) {
      let temp = flatten(item.children)
      // 将子节点数据合并到存储数组中
      ret = [...ret, ...temp]
    }
  })
  return ret
}
let flattenedArr = flatten(unflattenedArr)
console.log('unflattenedArr:', unflattenedArr)
console.log('flattenedArr:', flattenedArr)
```

通过这么处理，所有的节点都可以扁平化了。但是有个问题，没有父节点 `pid` 信息，这个需要再补充。

每次递归时候，必须带上父节点信息，否则怎么知道属于那个节点呢？所以函数签名（参数）也需要改造下：

```js
const flatten = (arr, pid) => {
  let unflattenedArr = JSON.parse(JSON.stringify(arr))
  let ret = []
  // 循环遍历
  unflattenedArr.forEach(item => {
    // 直接放置到存储数组中
    let obj = {
      id: item.id,
      text: item.text
    }
    if (pid) obj.pid = pid
    ret.push(obj)

    // 如果存在子节点，还需要递归遍历
    if (item.children) {

      let temp = flatten(item.children, item.id)
      // 将子节点数据合并到存储数组中
      ret = [...ret, ...temp]
    }
  })
  return ret
}

let flattenedArr = flatten(unflattenedArr)
console.log('unflattenedArr:', unflattenedArr)
console.log('flattenedArr:', flattenedArr)
```

这样就搞定了。

本文代码见此：[Github](https://github.com/yukapril/learning/blob/master/array-flattened/flattened.html)
