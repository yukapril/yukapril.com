---
title: "Objective-C 学习（一）- 字符串 数字 数组 NSIndexSet"
date: 2017-10-03 23:35:00 GMT+0800
tags: [ 编程, Objective-C ]
---

记录学习过程，做好笔记。

<!-- truncate -->

## 字符串

#### 创建

```objective-c
// 直接创建
NSString *str1 = @"test";

// 从C字符串创建
NSString *str21 = [[NSString alloc] initWithUTF8String:"hello"];
NSString *str22 = [NSString stringWithUTF8String:"hello"];

// 格式化创建
NSString *str31 = [[NSString alloc] initWithFormat:@"hello %@", @"world"];
NSString *str32 = [NSString stringWithFormat:@"hello %@", @"world"];
```

#### 比较

```objective-c
NSString *str41 = @"abc";
NSString *str42 = @"bcd";
// 直接比较
BOOL result41 = [str41 isEqualToString:str42];
// 忽略大小写比较
BOOL result42 = [str41 compare:str42 options:NSCaseInsensitiveSearch] == 0;
```

#### 获取长度

```objective-c
NSString *str5 = @"abcde";
NSUInteger length5 = str5.length;
NSLog(@"len: %lu", (unsigned long)length5);
```

#### 查找替换

```objective-c
NSString *str6 = @"abcdxyzabcd";
NSRange range6 = [str6 rangeOfString:@"xyz"];
if (range6.location == NSNotFound) {
  NSLog(@"not found!");
} else {
  NSLog(@"location: %ld, length:%ld", range6.location, range6.length);
}
```

#### 修改原文

```objective-c
NSString *str71 = @"hello world";
str71 = [str71 stringByReplacingOccurrencesOfString:@"world" withString:@"yukapril"];
NSLog(@"%@", str71);
NSMutableString *str72 = [NSMutableString stringWithUTF8String:"hello world"];
[str72 appendString:@"!"];
NSLog(@"%@", str72);
```

## 数字

#### 转换

```objective-c
NSNumber *num1 = @(100);
NSInteger int1 = [num1 integerValue];
```

## 数组

#### 创建和读取

```objective-c
NSArray<NSString *> *arr1 = @[@"a", @"b"];
NSString *arr1Temp = arr1[1];
NSLog(@"%@", arr1Temp);

NSInteger arr2Temp = 10;
NSArray<NSNumber *> *arr2 = @[@1, @2, @3, @(arr2Temp)];
for (NSNumber *v in arr2) {
  NSLog(@"arr2: %@", v);
}

NSArray <id> *arr3 = @[@"a", @1, @(YES)];
for (id v in arr3) {
  NSLog(@"arr3:%@", v);
}

NSArray *arr4 = [[NSArray alloc] initWithObjects:@1, @2, @3, [NSNull null], @5, nil];
for (id v in arr4) {
  NSLog(@"arr4:%@", v);
}

NSNumber *valueFirst = arr4.firstObject;
NSNumber *valueLast = arr4.lastObject;
NSLog(@"valueFirst:%@, valueLast: %@", valueFirst, valueLast);
if ([arr4 count] >= 4) {
  NSLog(@"someValue:%@", arr4[3]);
}
```

#### 查找

```objective-c
NSArray<NSString *> *arr5 = @[@"a", @"b"];
NSUInteger index5 = [arr5 indexOfObject:@"b"];
NSLog(@"index5:%@, count5:%@", @(index5), @([arr5 count]));
```

#### 替换

```objective-c
NSMutableArray *arr6 = [@[@"a", @"b", @"c"] mutableCopy];
// NSMutableArray *arr6 = [[NSMutableArray alloc] initWithObjects:@"a", @"b", @"c", nil];
[arr6 addObject:@"d"];
[arr6 removeLastObject];
[arr6 removeObject:@"c"];
NSLog(@"%@", arr6);
```

## NSIndexSet

```objective-c
NSMutableArray *arr = [@[@1, @2, @3, @4, @5] mutableCopy];
NSMutableIndexSet *indexSet = [NSMutableIndexSet indexSetWithIndex:1];
[indexSet addIndexesInRange:NSMakeRange(3, 2)];
[arr removeObjectsAtIndexes:indexSet];
NSLog(@"NSIndexSet %@", arr);
```
