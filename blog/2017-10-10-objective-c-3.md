---
title: "Objective-C 学习（三） - 内存管理 KVC"
date: 2017-10-10 22:23:00 GMT+0800
tags: [ 编程, Objective-C ]
---

记录学习过程，做好笔记。

<!-- truncate -->

## 内存管理

#### ARC 管理

ARC 管理下，一般情况下，无需手动管理内存。

需要注意的是，防止出现循环引用。此时可使用弱引用来解决。

```objective-c
@property (weak) NSString *str;
```

#### 手动管理

在OC 1.0时，需要手动调用 `release`来进行触发。

在使用 `CoreFoundation` 对象中，使用 `CFRelease(str)`。

#### 内容释放通知

```objective-c
- (void)dealloc {
  NSLog(@"dealloc");
}
```

#### 变量在 ARC 和手动管理下转换

* `__bridge` 不修改内存管理方式
* `__bridge_retained` 修改为手动管理
* `__bridge_transfer` 修改为 ARC 管理

```objective-c
NSString *str1 = @"apple";
// str1 强转，并且保留 str1 的 ARC 管理
CFStringRef str2 = (__bridge CFStringRef) str1;
// str1 强转，并修改内存管理方式为手动管理
CFStringRef str21 = (__bridge_retained CFStringRef) str1;

CFStringRef str3 = CFStringCreateWithCString(NULL, "apple", kCFStringEncodingUTF8);
// str3 强转，并且保留 str3 的 ARC 管理
NSString *str4 = (__bridge NSString *) str3;
// str3 强转，并修改内存管理方式为手动管理
NSString *str41 = (__bridge_transfer NSString *) str3;
```

## @property

```objective-c
@property (weak) NSString *str;
@property (strong) NSString *str;
@property (assign) CGFloat *num; 

@property (assign) NSString *str;
// 等同于
@property (unsafe_unretained) NSString *str;

@property (copy) NSString *str;

@property (readonly) NSString *str;
```

OC对象：默认修饰符是 `strong`

非OC对象：默认修饰符是 `assign`

`assign` 可以修饰 OC 对象，也可以修饰非 OC 对象，均表示弱引用（引用计数不增加）

内存回收后，`weak` 的对象返回 nil，`assign` 的对象返回原始值

## KVC

通过 `setValue: forKey:` 快速赋值：

```objective-c
- (instancetype)initWithDict:(NSDictionary *)dict {
    self = [super init];
    if (self) {
        [dict enumerateKeysAndObjectsUsingBlock:^(id key, id obj, BOOL *stop) {
            [self setValue:obj forKey:key];
        }];
    }
    return self;
}
```

赋值时，对于不存在的 key，则会调用 `setValue: forUndefinedKey:`：

```objective-c
- (void)setValue:(id)value forUndefinedKey:(NSString *)key {
    NSLog(@"undefined key:%@, value:%@", key, value);
}
```

读取时候，不存在 key，则会调用 `valueForUndefinedKey:`：

```objective-c
- (id)valueForUndefinedKey:(NSString *)key {
    return nil;
}
```

读取嵌套对象

```objective-c
Address *addr = [[Address alloc] initWithProvince:@"北京" city:@"北京" county:@"东城区"];
NSDictionary *dict = @{@"name": @"小明", @"age": @18, @"address": addr};
User *user = [[User alloc] initWithDict:dict];
NSString *city1 = [[user valueForKey:@"address"] valueForKey:@"city"];
NSString *city2 = [user valueForKeyPath:@"address.city"];
```

KVC集合操作：

```objective-c
NSMutableArray *arr = [NSMutableArray array];
{
  NSDictionary *dict = @{@"name": @"小明", @"age": @18};
  User *user = [[User alloc] initWithDict:dict];
  [arr addObject:user];
}
{
  NSDictionary *dict = @{@"name": @"小王", @"age": @16};
  User *user = [[User alloc] initWithDict:dict];
  [arr addObject:user];
}
{
  NSDictionary *dict = @{@"name": @"小刘", @"age": @20};
  User *user = [[User alloc] initWithDict:dict];
  [arr addObject:user];
}

// 计算平均年龄
// CGFloat sum = 0;
// for (User *user in arr) {
//     sum = user.age;
// }
// CGFloat avg = sum / arr.count;
CGFloat avg = [[arr valueForKeyPath:@"@avg.age"] floatValue];
```

支持的5种语法：

```objective-c
[arr valueForKeyPath:@"@avg.age"];
[arr valueForKeyPath:@"@sum.age"];
[arr valueForKeyPath:@"@max.age"];
[arr valueForKeyPath:@"@min.age"];
[arr valueForKeyPath:@"@count"];
```
