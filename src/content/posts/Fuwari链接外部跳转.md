---
title: Fuwari链接外部跳转
published: 2025-09-22
updated: 2025-09-22
description: '网站内的链接点击直接新标签页打开'
image: ''
tags: [Astro,Fuwari,博客]
category: '前端'
draft: false 
lang: ''
pinned: false
series: '改造博客'
---

## 话说在前

用 `Fuwari` 模板搭建博客的各位肯定遇到过这种情况:

> 网站内的链接点击直接在内部跳转,而不是新标签页打开 （ 就很烦! ）

那么,在灌水的时候也是看到群U分享了一个很好用的插件可以解决这个问题

## 使用方法

1. 使用包管理器安装`rehype-external-links`插件

> 以pnpm举例

```js title="rehype-external-links"
pnpm add rehype-external-links
```

2. 修改`astro.config.mjs`,导入并配置

```js title="astro.config.mjs"
其他导入...

// 导入rehype-external-links插件
import rehypeExternalLinks from 'rehype-external-links';

...

  markdown: {
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
        target: '_blank',
        },
      ],
...
```

然后我们就大功告成了