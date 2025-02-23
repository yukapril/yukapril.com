---
title: "node npm入门"
date: 2016-12-01 10:18:00 GMT+0800
tags: [ node, npm ]
---

这篇文章，主要介绍了npm的各种使用方法，从如何创建配置文件、安装、全局安装、项目安装、卸载组件、启动脚本等。

<!-- truncate -->

> 其实一直想好好总结下，把学过的东西认真的整理一遍，同时，也希望能在整理过程中，去学习更细致的使用。就这样，我开始进行各种工具的入门了。

## 安装node npm

安装node：建议直接访问[官网](https://nodejs.org)，下载合适的安装包。这样安装的好处是，不需要处理任何环境变量等。

安装好node后，会自动带有npm。也就是说npm也安装好了。

启动终端/命令控制台，输入

* `node -v` : 可以看到当前安装node的版本号，比如v6.2.1

* `npm -v` : 可以看到当前安装npm的版本号，比如3.9.3

如果没有出现版本号，那么，请重新安装。

## 使用node

node是一个运行环境，我们可以写代码在这个环境里运行。

如果仅仅是调试个别代码，或者说是测试下而已，可以在终端/命令控制台，输入`node`，之后会出现一个`>`符号，此时就可以写代码了。实时显示。

不过一般我们都是把代码写到文件里，在进行执行。

比如，我在`/Users/yukapril`下新建了一个`test.js`文件，写上一句代码：

```js
console.log('hello world!');
```

之后，我们执行

```bash
cd /Users/yukapril #进入文件目录
node test.js
```

这样，我们在我们可以看到结果，返回了一句话`hello world!`。

那node有什么用呢？

我们可以编写一些有用的代码，比如说，删除某个目录下的文件，再将某个目录下的文件拷贝一份过来等等。

反正有强大的语法，无所不能！具体写法，可以参见[API](https://nodejs.org/docs/latest/api/)。

这么做的人不是很多，因为在npm上面，有很多已经写好的工具包了。

npm？npm是工具，是帮我们找到需要的工具包的工具。可以简单理解为下载工具。

## 使用npm

#### 创建`package.json`文件

使用npm，就要创建配置文件。我相信大部分人都见过`package.json`文件。那么这个文件是如何生成的呢？

除了我们复制一个已有的`package.json`文件，我们是可以用npm进行生成的。

方法是进入项目目录后，执行`npm init`。他会询问你一些问题，来协助生成`package.json`文件。内容如下：

```
Press ^C at any time to quit.
name: (test) 
version: (1.0.0) 
description: 
entry point: (test.js) 
test command: 
git repository: 
keywords: 
author: 
license: (ISC) 
About to write to /Users/yukapril/test/package.json:

{
  "name": "test",
  "version": "1.0.0",
  "description": "",
  "main": "test.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}


Is this ok? (yes) yes
```

一开始，先会询问项目名字，版本等。你可以直接按回车，使用默认值（即括号内的值）。

最后，他会让你确认生成的json是否合你意，确认请输入`yes`即可。

我一般都是使用默认值，有问题的话，再去`package.json`中修改。

#### 安装依赖包

假设，我们要做一个基于`express`框架的服务器端程序。

* 我们可以在全局安装 `npm install -g express`

* 也可以在项目中安装 `npm install express`

这两种方式的区别：

* 全局安装：在任何一个目录下，都可以直接使用`express`。

* 项目安装：只能在当前项目使用`express`，不在项目目录下，无法使用。会将代码写到`node_modules`目录下。

* 都不改`package.json`文件

除了个别通用性很强的工具（比如`webpack`或者`gulp`），我个人不建议全局安装任何软件工具，因为你可以方便的使用，但是分享给别人的代码中，是不带有此工具的，所以可能是不能运行的。

使用项目安装工具的话，建议使用以下两个参数：

* `npm install express -save` : 项目安装express，同时修改`package.json`的依赖（`dependencies`字段）

* `npm install express -save-dev` : 项目安装express，同时修改`package.json`的开发依赖（`devDependencies`字段）

**这样写的好处是**：安装了那些依赖工具，会在`package.json`中体现出来。如果将项目分享给别人，可以清晰的看到，并安装。

**这两种写法的区别是**：如果是普通依赖，那么说明这个依赖包的代码会最终体现到我们的程序中，如果是开发依赖，那么仅仅在开发过程中需要，最终的程序代码中不含有此依赖。

举个例子说明：我们要基于`express`框架，开发一个网站。开发过程中，要使用`eslint`对代码质量进行测试，同时要使用`karma`做测试用例。那么，`express`就是项目普通依赖，`eslint`和`karma`就是开发依赖。

不过不必担心，这两种依赖并不是严格区分，比如你把上面的例子的三个依赖，全部安装到普通依赖，或者开发依赖，在**本地调试**仍然可以正常启动或编译。因为不论是什么依赖，都是安装为目的。但是可能在服务器上无法运行，因为有的服务器配置上，默认只会安装普通依赖！他认为开发依赖是不需要的！

#### 删除依赖包

有了安装，就要有删除。其实为了省事，可以直接找到已经安装的包，拖拽到回收站。但是windows下，由于文件路径/文件名等原因，可能这样无法删除。

如果想手动删除目录，那么要先确认安装在了哪里：

* `npm root -g` : 获取全局安装路径，返回比如`/usr/local/lib/node_modules`的路径

* `npm root` : 获取当前项目安装的路径，返回比如`/Users/yukapril/test/node_modules`的路径，需要注意的是，如果当前项目没有`package.json` `node_modules`目录，也会有一个返回值，这一点我也不能理解，可能是说，如果需要安装包的话，应该是那个目录。

如果想检查当前项目安装了那些包，使用 `npm list`，我基本上没用过。

删除一个依赖包，也很简单，不过要区分是全局删除，还是项目删除。

* `npm uninstall express -g` : 全局删除依赖

* `npm uninstall express` : 项目删除依赖

#### 批量安装依赖包

还有这种情况，你从网上下载了一个项目，或者要启动别人的项目。项目为了节省空间，一般都不会带有`node_modules`目录的。这时候，就需要你按照`package.json`文件中的依赖，进行安装了。

方法很简单：`npm install`即可。

#### 其他命令

更新一个依赖包，`npm update express`，这个命令我很少用，一般在出现问题时候可能会用到。

## 使用npm srcipts

在使用`npm init`创建的`package.json`，默认如下：

```json
{
  "name": "test",
  "version": "1.0.0",
  "description": "",
  "main": "test.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}
```

我们可以在`scripts`字段下，增加我们需要的命令。

比如，以后会用到的`webpack`，项目安装后，即可以使用命令`webpack main.js app.js`执行操作了。我们增加到`build`命令上。

```json
{
  "name": "test",
  "version": "1.0.0",
  "description": "",
  "main": "test.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack main.js app.js"
  },
  "author": "",
  "license": "ISC"
}
```

这样，我们就可以使用`npm run build`来执行对应命令了。

所有的`scripts`下的命令，都可以用`npm run xxx`来执行。

但是有两个特殊命令，有简写方法，他们是：

* `npm run start` : 简写为`npm start`

* `npm run test` : 简写为`npm test`

可能是这两个命令使用率太高，所以有简写方法。

## npm scripts 高级一点的用法

比如我们要做多件事，可以这样来写：

```json
{
  "name": "test",
  "version": "1.0.0",
  "description": "",
  "main": "test.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack main.js app.js",
    "build2": "webpack other.js app2.js",
    "task1": "npm run build & npm run build2",
    "task2": "cd test && mkdir abc",
    "show-name": "echo npm_package_name"
  },
  "author": "",
  "license": "ISC"
}
```

其中`task1`和`task2`主要差别在中间的`&`上。一个`&`表示两个任务是并行的，两个`&`表示先执行第一个，成功后执行第二个。

如果要获取`package.json`配置文件内容使用呢？

* 在`srcipts`中，可以使用`npm_package_`前缀来获取`package.json`中的字段值。

  比如：`npm_package_name` `npm_package_scripts_test`。

  由于`scripts`里面是bash脚本，所以只能使用bash语法。不支持js语法的。

* 在项目代码中，要读取`package.json`中的`name`字段，那么怎么来处理？只能使用常规的读取文件方案。

```js
var package = require('./package.json');
console.log('项目名：', package.name);
```

## 小结

npm语法，其中`init` `install` `run`为重点

* `npm init` : 创建`package.json`

* `npm install` : 根据`package.json`安装依赖

* `npm install -g some-package` : 全局安装包

* `npm install some-package` : 项目安装包

* `npm install some-package -save` : 项目安装包，并更新`package.json`的普通依赖

* `npm install some-package -save-dev` : 项目安装包，并更新`package.json`的开发依赖

* `npm root -g` : 获取npm依赖包全局安装路径

* `npm root` : 获取npm依赖包项目安装路径

* `npm list` : 列出当前项目的依赖包

* `npm uninstall some-package -g` : 全局删除依赖包

* `npm uninstall some-package` : 项目删除依赖包

* `npm update some-package` : 更新依赖包

* `npm run some-scripts` : 执行制定脚本
