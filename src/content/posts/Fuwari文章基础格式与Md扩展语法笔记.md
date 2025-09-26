---
title: Fuwari文章基础格式与Md扩展语法笔记
published: 2025-09-26
updated: 2025-09-26
description: ''
image: ''
tags: [Fuwari,Markdown]
category: '笔记'
draft: false 
lang: ''
pinned: false
series: ''
---

## 文章开头

每篇通过`pnpm new-post <文章名称>`创建的文章，都会有的东西

```js title="开头标记"
---
title: Fuwari文章基础格式与Md扩展语法笔记
published: 2025-09-26
updated: 2025-09-26
description: ''
image: ''
tags: [Fuwari,Markdown]
category: '笔记'
draft: false 
lang: ''
pinned: false
series: ''
---
```

| Attribute     | Description                                            |
| ------------- | ------------------------------------------------------ |
| `title`       | 文章标题                                               |
| `published`   | 文章发布日期                                           |
| `updated`     | 文章更新日期，需要手动更改                             |
| `description` | 文章描述                                               |
| `image`       | 文章封面 可以是绝对路径、相对路径或http链接            |
| `tags`        | 文章标签                                               |
| `category`    | 文章分类                                               |
| `draft`       | 是否为草稿                                             |
| `lang`        | 仅当文章语言与 `config.ts` 中的网站语言不同时需要设置  |
| `pinned`      | 仅当置顶该文章时设置 需修改新增配置才可使用 默认不支持 |
| `series`      | 文章同一系列                                           |

## 创建GitHub仓库卡片

```
::github{repo="luozhipeng1/fuwari"}
```

例子：

::github{repo="luozhipeng1/fuwari"}



## 警告语法

支持的警告类型如下: `note` `tip` `important` `warning` `caution`

```js title="语法警告"
:::note
高亮内容，突出信息
:::

:::tip
提示性
:::

:::important
重点突出
:::

:::warning
警示性内容
:::

:::caution
警告性内容
:::

:::note[自定义标题]
自己取名
:::
```

:::note
高亮内容，突出信息
:::

:::tip
提示性
:::

:::important
重点突出
:::

:::warning
警示性内容
:::

:::caution
警告性内容
:::

:::note[自定义标题]
自己取名
:::



## GitHub提示语法

```
> [!NOTE]
> The GitHub syntax is also supported.

> [!TIP]
> The GitHub syntax is also supported.
```

> [!NOTE]
> The GitHub syntax is also supported.

> [!TIP]
> The GitHub syntax is also supported.