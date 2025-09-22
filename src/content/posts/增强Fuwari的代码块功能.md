---
title: 增强Fuwari的代码块功能
published: 2025-09-17
updated: 2025-09-17
description: ''
image: ''
tags: [Astro,Fuwari,博客]
category: '前端'
draft: false 
lang: ''
pinned: false
series: '改造博客'
---

> 使用现在最新的🍥Fuwari博客已经引入了`astro-expressive-code`包，不需要额外安装了，直接使用就完事了
>
> 折叠与行数都已经配置好了，``@expressive-code/plugin-collapsible-sections`` 与 ``@expressive-code/plugin-line-numbers`` 不用额外安装



# 使用格式方法

## 标题

```js  title="标题"
console.log("Line 1");
console.log("Line 2");
let a = 1;
let b = 2;
```

## 高亮指定行

```js  {2,4-5} ins={3,7}
console.log("Line 1");
console.log("Line 2");
let a = 1;
let b = 2;
let c = 3;
let d = 4;
let e = 5;
let f = 6;
let g = 7;
console.log(a + b);
let h = 4;
let i = 5;
let j = 6;
let k = 7;
let l = 7;
```

## 新增/删除指定行

```js   ins={3,7} del={6}
console.log("Line 1");
console.log("Line 2");
let a = 1;
let b = 2;
let c = 3;
let d = 4;
let e = 5;
let f = 6;
let g = 7;
console.log(a + b);
let h = 4;
let i = 5;
let j = 6;
let k = 7;
let l = 7;
```

## 高亮块

```js  "a + b" del="let g = 7"
​```js  "a + b" del="let g = 7"
//{2,4-5}高亮 ins={3,7}新增 del={6}删除
console.log("Line 1");
console.log("Line 2");
let a = 1;
let b = 2;
let c = 3;
let d = 4;
let e = 5;
let f = 6;
let g = 7;
console.log(a + b);
let h = 4;
let i = 5;
let j = 6;
let k = 7;
let l = 7;
```

## 折叠代码/代码行数

```js   collapse={8-13, 15-16} startLineNumber=7
//collapse={8-13, 15-16} 折叠 startLineNumber=7
console.log("Line 1");
console.log("Line 2");
let a = 1;
let b = 2;
let c = 3;
let d = 4;
let e = 5;
let f = 6;
let g = 7;
console.log(a + b);
let h = 4;
let i = 5;
let j = 6;
let k = 7;
let l = 7;
```