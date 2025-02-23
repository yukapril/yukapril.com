---
sidebar_position: 11
---

# QMK 固件之 VIA 使用

## 启动工具和配置

访问[在线工具](https://usevia.app/)，或者启动你的本地 APP 工具。本地 APP 工具肯能有汉化版，很多停留在 1.x 版本。我建议直接使用在线版本。

打开网址或工具后，点击中间的 “Authorize device”，之后选择你的键盘。

如果你的键盘是官方认证的，那么可能直接就可以识别了（不需要布局 JSON 文件）。否则，请准备键盘对应的布局 JSON 文件。没有此文件，无法使用
VIA。

```
在线工具访问网络速度可能很慢，或者反复无法加载，请考虑配置代理。

此外工具 UI 可能会发生变化，以实际为准。但操作基本不变。
```

## 非认证键盘配置布局 JSON

如果你的键盘可以直接识别，那么可以忽略此步骤。否则可以这样操作进行开启 JSON 配置上传：

![via](https://cdn1.yukapril.com/knowledge/use-via-1.png)

点击最后一个齿轮进行“设置”，之后开启 “Show Design tab”，顶部就出现了第三个选项卡。

![via](https://cdn1.yukapril.com/knowledge/use-via-2.png)

点击第三个选项卡，选择 “Load Draft Definition” 即可。如果你的布局 JSON 不能识别，可以尝试开启 “Use V2 definitions (
deprecated)” 选项。如果还不能识别，那么可能 JSON 文件无效。

## 功能区域说明

![via](https://cdn1.yukapril.com/knowledge/use-via-3.png)

页面顶部，四个选项卡，分别是 “键盘配置”、“键盘测试”、“键盘设计”、“设置”。

我们主要在第一个选项卡中进行操作改键。第二个选项卡在测试键盘按键时候会使用到。

之后中间部分是 “LAYER” 键盘层数，当前是 “0” 层。以及键盘具体的按键信息。

最下面部分，是配置区域。最左侧主选项卡有：

- KEYMAP 键盘布局
- MACROS 宏命令
- SAVE LOAD 加载保存
- LIGHTING 灯光

不同键盘，对应功能不同，比如你的键盘没有灯光，就会缺少对应的选项。

## 键盘改键配置

下面以我的 KeyChron Q5 来说明。

我的键盘 Windows 下使用 LAYER 2 3 4 5 层。2 层为默认层。 3 层为标准 FN 层。

```
注：我的 KeyChron Q5 刷过自定义固件，所以有 6 层，默认它只有 4 层。
```

在 2 层空格右侧，有个按键已经定义为 `MO(3)`（表示瞬间切换到 3 层）。按这个键的同时，再按其他按键，就可以执行对应 3 层的功能了。

![via](https://cdn1.yukapril.com/knowledge/use-via-4.png)

如果要改变 3 层主键盘 `1` 的功能，改为字母 `A`。可以进行如下操作：

1. 点击 LAYER 3，切换到第 3 层
2. 点击选中这个键位，使得这个按键闪烁
3. 在下面配置区域，左侧主选项卡，选择 “KEYMAP 键盘布局”
4. 之后次级选项卡选择 “BASIC”，再选择字母 `A` 即可
5. 修改实时生效，不用插拔键盘

如图所示：

![via](https://cdn1.yukapril.com/knowledge/use-via-4.png)

这里次级选项卡区分为：

- BASIC 最基础的按键，基本上就是键盘默认的按键
- MEDIA 媒体按键，如播放、静音之类
- MACRO 宏命令（配置完成后，还要有对应的宏功能，否则没有效果）
- LAYER 层操作，如层切换之类
- SPECIAL 特殊键，一些不常用的按键在此，同时 `ANY` 键也在这个栏目里
- LIGHTING 灯光控制键，如上一个灯光、下一个灯光、灯光开启关闭等
- CUSTOM 个性化栏目，这个和键盘固件有关，并非所有键盘都有。如我的键盘提供配置 `SIRI` 等按键

```
ANY 键作用：
如果你知道 VIA 的功能命令，比如 LT(4,KC_P0)。但是网页或者 APP 工具中，找不到对应的按键。
此时可以将指定的按键设置为 ANY，就允许你直接编辑键值了。
```

各个按键名称及功能，可以参考这里：[QMK Keycodes 官方文档](https://docs.qmk.fm/#/keycodes)。
