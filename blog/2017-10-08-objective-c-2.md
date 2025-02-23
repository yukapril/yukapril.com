---
title: "Objective-C 学习（二）- NSDictionary NSSet 类型转换 NSData NSError"
date: 2017-10-08 18:03:00 GMT+0800
tags: [ 编程, Objective-C ]
---

记录学习过程，做好笔记。

<!-- truncate -->

## NSDictionary

#### 创建

```objective-c
NSDictionary *dic1 = @{@"apple": @1.5, @"banana": @1.2};
NSDictionary<NSString *, NSNumber *> *dic2 = [NSDictionary dictionaryWithObjectsAndKeys:@1.5, @"apple", @1.2, @"banana", nil];s
```

#### 读取

```objective-c
for (id key in dic1.allKeys) {
  id v = dic1[key];
  // id v = [dic1 objectForKey:key];
  NSLog(@"<1>key:%@, value:%@", key, v);
}
for (NSString *key in dic2.allKeys) {
  NSNumber *v = dic1[key];
  NSLog(@"<2>key:%@, value:%@", key, v);
}

for (id key in dic1.allKeys) {
  id v = dic1[key];
  // id v = [dic1 objectForKey:key];
  NSLog(@"<1>key:%@, value:%@", key, v);
}
for (NSString *key in dic2.allKeys) {
  NSNumber *v = dic1[key];
  NSLog(@"<2>key:%@, value:%@", key, v);
}
```

#### 转换

```objective-c
NSArray *keys = dic2.allKeys;
NSArray *values = dic2.allValues;
NSLog(@"keys: %@", keys);
NSLog(@"values: %@", values);
```

#### 写入读取

```objective-c
NSMutableDictionary *dicm1 = [NSMutableDictionary dictionaryWithObjectsAndKeys:@1.5, @"apple", nil];
// [dicm1 setObject:@1.2 forKey:@"banana"];
dicm1[@"banana"] = @1.2;
NSLog(@"dicm1: %@", dicm1);
```

## NSSet

#### 创建读取

```objective-c
NSSet *set1 = [NSSet setWithObjects:@1, @2, @3, @4, @1, nil];
NSLog(@"set1: %@", set1);
for (NSNumber *n in set1) {
  NSLog(@"set1 value: %@", n);
}

NSMutableSet *setu1 = [NSMutableSet setWithObjects:@1, @2, @3, @4, nil];
[setu1 removeObject:@4];
[setu1 addObject:@5];
NSLog(@"setu1: %@", setu1);
```

## 类型转换

#### NSString NSNumber

```objective-c
NSString *ageStr1 = @"18";
NSNumber *age1 = @([ageStr1 integerValue]);

NSNumber *age2 = @19;
NSString *ageStr2 = [age2 stringValue];
```

#### NSString NSArray

```objective-c
NSString *names = @"apple,banana";
NSArray *nameArr = [names componentsSeparatedByString:@","];
NSLog(@"%@", nameArr);

NSArray *arr = @[@"apple",@"banana"];
NSString *arrStr = [arr componentsJoinedByString:@"-"];
NSLog(@"%@", arrStr);
```

#### NSArray NSSet

```objective-c
NSArray *arr = @[@"apple", @"banana", @"apple", @"orange"];
NSSet *set = [NSSet setWithArray:arr];
NSLog(@"set %@", set);

NSSet *set2 = [NSSet setWithObjects:@"orange", @"banana", @"apple", nil];
NSMutableArray *arrm2 = [NSMutableArray array];
for (id value in set2) {
  [arrm2 addObject:value];
}
NSLog(@"arrm2: %@", arrm2);
```

#### NSArray NSDictionary

```objective-c
NSArray *arr1 = @[@"apple", @"banana"];
NSArray *arr2 = @[@1.5, @1.2];
NSDictionary *dic = [NSDictionary dictionaryWithObjects:arr2 forKeys:arr1];
NSLog(@"%@", dic);

NSDictionary *dic2 = @{@"apple": @1.5, @"banana": @1.2};
NSArray *arr3 = dic2.allKeys;
NSArray *arr4 = dic2.allValues;
```

## NSData

```objective-c
NSString *str = @"apple";
NSData *data = [str dataUsingEncoding:NSUTF8StringEncoding];
NSLog(@"%@", data);

NSString *str2 = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
NSLog(@"%@", str2);
```

## NSError

```objective-c
#import <Foundation/Foundation.h>

typedef NS_ENUM(NSUInteger, CheckError) {
    CheckErrorTooMax = 1
};

NSError *check(NSArray *arr) {
    for (NSNumber *v in arr) {
        int r = [v compare:@10];
        NSLog(@"value:%@, result:%i", v, r);
        if ([v compare:@10] == 1) {
            NSDictionary *userInfo = @{@"number": v};
            return [NSError errorWithDomain:@"check failed" code:CheckErrorTooMax userInfo:userInfo];
        }
    }
    return nil;
}

int main(int argc, const char *argv[]) {
    @autoreleasepool {
        NSArray *arr = @[@1, @4, @7, @9, @12];
        NSError *err = check(arr);
        NSLog(@"%@", err);
    }
    return 0;
}
```
