---
sidebar_position: 7
---

# 固件

机械键盘固件有很多。我听说过的主要是如下一些。

## TMK

开源地址：https://github.com/tmk/tmk_keyboard

算是客制化固件的鼻祖了。支持的键盘种类不是太多，主要是一些老型号键盘，保有量最大的就是 GH60 系列，现在已经不太常见了。

一般我也没见过有人改源码编译的，都是通过网页形式改键，下载固件再刷回键盘。

改键过程不是很方便，具体可以参考[这里](/keyboard/firmware-tmk)。

## QMK（VIA，VIAL）

开源地址：https://github.com/qmk/qmk_firmware

QMK 也是基于 TMK 的，但是支持的键盘很多，也扩展了很多功能。比如常见的 VIA VIAL 就是基于 QMK 做的实时改键可视化工具。

此外 QMK 支持的芯片也比较多、比较主流。目前在插线版本的客制化键盘上，用的非常广。

官方 QMK ToolBox 运行时候提示如下：

```
* Supported bootloaders:
*  - ARM DFU (APM32, Kiibohd, STM32, STM32duino) and RISC-V DFU (GD32V) via dfu-util (http://dfu-util.sourceforge.net/)
*  - Atmel/LUFA/QMK DFU via dfu-programmer (http://dfu-programmer.github.io/)
*  - Atmel SAM-BA (Massdrop) via Massdrop Loader (https://github.com/massdrop/mdloader)
*  - BootloadHID (Atmel, PS2AVRGB) via bootloadHID (https://www.obdev.at/products/vusb/bootloadhid.html)
*  - Caterina (Arduino, Pro Micro) via avrdude (http://nongnu.org/avrdude/)
*  - HalfKay (Teensy, Ergodox EZ) via Teensy Loader (https://pjrc.com/teensy/loader_cli.html)
*  - LUFA/QMK HID via hid_bootloader_cli (https://github.com/abcminiuser/lufa)
*  - WB32 DFU via wb32-dfu-updater_cli (https://github.com/WestberryTech/wb32-dfu-updater)
*  - LUFA Mass Storage
* Supported ISP flashers:
*  - AVRISP (Arduino ISP)
*  - USBasp (AVR ISP)
*  - USBTiny (AVR Pocket)
```

可以见得，主流的 STM32 系列、还有 ATMega32U4 等，都可以用。

常见的主控有：Teensy 系列，Pro Micro 系列。

单纯 QMK 刷固件也不是特别方便，主要是需要本地准备开发环境。如果为了改键，有源码的话还好，否则需要自己移植。虽然有不少型号的键盘可以参考，但对于非专业的人员来讲，移植难度依然很大。

这个固件好处是，一旦升级刷了 VIA/VAIL 后，改键不再需要刷固件了，属于后续一劳永逸。

## ZMK

开源地址：https://github.com/zmkfirmware/zmk

ZMK 在一些蓝牙键盘中常见一些，主要是因为 QMK 的蓝牙相对薄弱。

我还没有接触过这个固件键盘，我猜测国内的一些高端蓝牙键盘是基于它进行改进并做成可视化工具的。

此外，据说知名的怒喵键盘，就是基于 ZMK 做的固件。

## KMK

开源地址：https://github.com/KMKfw/kmk_firmware/

由于 KMK 支持 RP2040 芯片让我了解到它。KMK 比较特殊，它使用了 CircuitPython 进行开发，上手可以算是最简单的了。

比如我刷树莓派 PICO 进行测试，就是去 CircuitPython 下载底层包，像拷贝U盘文件一样放到 PICO 上。之后自己写几个 python 文件就完成了一个简单的键盘固件。

不过作为固件来讲，没有可视化的改键工具。我估计这种工具未来可以被轻松开发出来。因为本质就是读取和修改U盘的 python 文件而已。

在现阶段没有可视化工具的时候，改键就要自己修改U盘中的 python 文件。

缺点是插上键盘，就多了一个U盘，有些别扭。而且会不会键盘 python 中毒？

## BlueMicro

开源地址：https://github.com/jpconstantineau/BlueMicro_BLE

主要在一些蓝牙键盘中使用，支持 nRF52 系列芯片（常见于 nrf52840），有一定群体，尤其是分体键盘。如果不是这个系列芯片，也用不了这个固件。

## LotLab（TMK）

开源地址：https://github.com/Lotlab

一个基于 TMK 的蓝牙改进版本。曾经我见过，但是实际键盘应用上并不常见。
