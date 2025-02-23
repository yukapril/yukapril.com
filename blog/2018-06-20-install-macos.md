---
title: "重装 macOS"
date: 2018-06-20 23:46:00 GMT+0800
tags: [ macOS, 重装系统 ]
---

最近觉得 mac 垃圾文件太多了，也懒得清理，就找了了些重装 macOS 的资料，整理下写成文章。

<!-- truncate -->

## 下载 MacOS

访问 [https://support.apple.com/zh-cn/HT201475](https://support.apple.com/zh-cn/HT201475)，下载最新的系统。

目前最新的是 High Sierra，地址为 [http://appstore.com/mac/macoshighsierra](http://appstore.com/mac/macoshighsierra)，此地址会跳转 App Store，如果你已经下载过了，就不用重新下载了。

High Sierra 系统大概是 5.23G。

## 将系统写入启动 U 盘

> 参考文章：[https://support.apple.com/zh-cn/HT201372](https://support.apple.com/zh-cn/HT201372)

这一步需要敲命令，不过非常简单。

1. 前提：你的 U 盘，不少于 12G。这个容量是苹果给出的。我用的16G的。

2. 首先确保你的 U 盘卷标为 `SYS`，如果不是的话，下面的 `SYS` 需要替换成你的 U 盘卷标。

3. 建议用全大写单词，减少错误出现。

   > 修改卷标的方法
   >
   > Mac 系统，插入 U 盘，桌面会出现图标。点击图标，按 `回车` 键。修改后，按 `回车` 键确认。

4. 打开 `终端`，根据你的系统，参考上面的文章，敲命令。我的是 High Sierra，命令如下：

    ```bash
    sudo /Applications/Install\ macOS\ High\ Sierra.app/Contents/Resources/createinstallmedia --volume /Volumes/SYS --applicationpath /Applications/Install\ macOS\ High\ Sierra.app
    ```

   > 如果按照原文操作，提示错误：
   >
   > ```bash
    > /Volumes/MyVolume is not a valid volume mount point.
    > ```
   >
   > 则表示找不到 `MyVolume` 的 U 盘，可能是你名称不对，也可能是系统给你改名了，比如改成了 `MyVolume 1`。（可以到 `/Volumes/` 目录检查下）
   >
   > 建议重新改个全大写的单词，重新插拔 U 盘就可以了。

5. 上一步之后，会要求输入系统密码（密码输入时候不会有任何提示），输入完成，回车确认。
6. 当提示 `If you wish to continue type (Y) then press return: ` 时候，输入 `Y`，并且 `回车`。
7. 等待，我大概等了5分钟（和 U 盘速度有关）。
8. 直到出现以下内容，就算完成了：

    ```bash
    Erasing Disk: 0%... 10%... 20%... 30%...100%...
    Copying installer files to disk...
    Copy complete.
    Making disk bootable...
    Copying boot files...
    Copy complete.
    Done.
    ```

**安装盘制作完毕。**

## 安装系统

1. 插好 U 盘
2. 重启 Mac 电脑，重启时候按住 `option` 键，直到看到硬盘选择的界面，选择 `Install MacOS` 这个，需要点击下方的箭头：
   ![img](https://cdn1.yukapril.com/2018-06-20-install-macos-1.jpg)
3. 之后会询问安装到哪里，因为只有一块硬盘（第二个是插入的 U 盘），所以默认选择第一个就行，点击 `安装`
   ![img](https://cdn1.yukapril.com/2018-06-20-install-macos-2.jpg)
4. 进入实用工具界面，由于我是打算清空硬盘所有内容，再安装。所以先进入 `磁盘工具`，格式化整块硬盘：
   ![img](https://cdn1.yukapril.com/2018-06-20-install-macos-3.jpg)
5. 选择硬盘后，点击 `抹掉`，可以选择格式。建议选择区分大小写，这样和 linux 是一致的。至于加密与否，我觉得无所谓吧。默认是 `加密（不区分大小写）`：
   ![img](https://cdn1.yukapril.com/2018-06-20-install-macos-4.jpg)
6. 最后返回到第四步的实用工具页，选择 `安装 macOS` 就好了。剩下的就没什么可说的了：
   ![img](https://cdn1.yukapril.com/2018-06-20-install-macos-5.jpg)

## 小结

我一直以为 macOS 很稳定，所以重装做的也非常复杂。其实跟着步骤操作，比起 Windows 可能还要更简单。

唯独的问题就是你必须有一个正常运行的 macOS 系统来制作第一步的启动盘。

其实启动盘可以不提前做，据说可以安装时候自动下载，不过这么大的容量，估计网络安装会非常慢。大部分人都不推荐这么做，除非真的 mac 已经启动不了了吧。
