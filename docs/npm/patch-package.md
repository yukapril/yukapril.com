# patch-package

可以在项目中，修改 node_modules 依赖的一个库，挺有意思的，感觉如果个别项目需要修复依赖的问题也挺实用的。

使用也很简单。

1. 首先编辑调整 `node_modules` 中有问题的文件，比如官方的例子

```sh
vim node_modules/some-package/brokenFile.js
```

2. 执行 `patch-package` 来创建 `.patch` 文件（会自动生成到 `patches` 目录下）

```sh
npx patch-package some-package
```

3. 修改 `package.json` 文件，增加 `postinstall` 字段，使得每次 `npm install` 安装完成后自动执行补丁文件

```json
{
  "scripts": {
    "postinstall": "patch-package"
  }
}
```

4. 提交代码即可，包括 `package.json` 以及 `patches` 目录下文件。

我在一个项目中测试了下，就是把一个内部库增加了一个判断方法，补丁实现起来不复杂还挺有意思。不过目前我的项目还用不到，除了知名的依赖，很多都是公司内部维护的库，不需要特殊打补丁。

如果未来遇到那个依赖不更新了，自己懒得 fork 一份并重新发布 npm，可以考虑此方案。
