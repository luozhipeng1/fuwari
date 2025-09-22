---
title: 在Fuwari中添加系列页面
published: 2025-09-22
updated: 2025-09-22
description: ''
image: ''
tags: [Astro,Fuwari,博客]
category: '前端'
draft: false 
lang: ''
pinned: false
series: '改造博客'
---

> :::note[前言]
>
> 接上回 *《在Fuwari中添加系列栏》*
>
> 在导航栏上加一个**系列**按钮，点击进入，可以看到一个用来查看所有**系列**的页面

::link-card{url="https://pengxing.dpdns.org/posts/%E5%9C%A8fuwari%E4%B8%AD%E6%B7%BB%E5%8A%A0%E7%B3%BB%E5%88%97%E6%A0%8F/" title="在Fuwari中添加系列栏" description="显示同一个系列文章" icon="https://pengxing.dpdns.org/favicon/favicon.ico" image="https://pengxing.dpdns.org/_assets/images/image-20250922161527224.png" }

## 改动点

1. 修改`src\constants\link-presets.ts`、`src\config.ts`、`src\types\config.ts`三个文件

```js title="src\constants\link-presets.ts" ins={7-10}
export const LinkPresets: { [key in LinkPreset]: NavBarLink } = {
  // ...
  [LinkPreset.Friends]: {
    name: i18n(I18nKey.friends),
    url: '/friends/',
  },
  [LinkPreset.Series]: {
    name: i18n(I18nKey.series),
    url: '/series/',
  },
}
```

```js title="src\config.ts" ins={5}  collapse={8-12}
export const navBarConfig: NavBarConfig = {
  links: [
    LinkPreset.Home,
    LinkPreset.Archive,
    LinkPreset.Series,
    LinkPreset.About,
    LinkPreset.Friends,
    {
      name: 'GitHub',
      url: 'https://github.com/ikamusume7/fuwari',     // Internal links should not include the base path, as it is automatically added
      external: true,                               // Show an external link icon and will open in a new tab
    },
  ],
}
```

```js title="src\types\config.ts" ins={6}
export enum LinkPreset {
  Home = 0,
  Archive = 1,
  About = 2,
  Friends = 3,
  Series = 4,
}
```

2. 新增`src\pages\series.astro`、`src\components\SeriesPanel.astro`两个文件

```js title="src\pages\series.astro"
---
import MainGridLayout from '@layouts/MainGridLayout.astro'
import SeriesPanel from '@components/SeriesPanel.astro'
import { i18n } from '@i18n/translation'
import I18nKey from '@i18n/i18nKey'
---

<MainGridLayout title={i18n(I18nKey.series)}>
    <SeriesPanel></SeriesPanel>
</MainGridLayout>
```

```js title="src\components\SeriesPanel.astro"
---
import { UNCATEGORIZED } from '@constants/constants'
import I18nKey from '../i18n/i18nKey'
import { i18n } from '../i18n/translation'
import { getSortedPosts } from '../utils/content-utils'
import { getPostUrlBySlug } from '../utils/url-utils'
import { getCategoryUrl } from '../utils/url-utils'

interface Props {
  keyword?: string
  tags?: string[]
  categories?: string[]
}

let posts = await getSortedPosts()

interface Series {
  count: number
  name: string
  posts: typeof posts
}

const groups: { category: string; series: Series[] }[] = (() => {
  const groupedSeries = posts.reduce(
    (grouped: { [category: string]: {[seriesName: string]: Series} }, post) => {
      const category = post.data.category || UNCATEGORIZED
      const series = post.data.series || UNCATEGORIZED
      if (category == UNCATEGORIZED || series === UNCATEGORIZED) {
        return grouped
      }
      if (!grouped[category]) {
        grouped[category] = {}
      }
      if (!grouped[category][series]) {
        grouped[category][series] = {
          count: 0,
          name: series,
          posts: [],
        }
      }
      grouped[category][series].count++
      grouped[category][series].posts.push(post)
      return grouped
    },
    {},
  )

  // convert the object to an array
  const groupedSeriesArray = Object.keys(groupedSeries).map(key => ({
    category: key,
    series: Object.values(groupedSeries[key]),
  }))

  return groupedSeriesArray
})()
---

<div class="card-base px-8 py-6">
    {
        groups.map(group => (
            <div>
                <div class="flex flex-row w-full items-center h-[3.75rem]">
                    <div class="w-[20%] md:w-[15%] transition text-2xl font-bold text-right text-75 flex flex-row justify-end">
                      <a aria-label={group.category} href={getCategoryUrl(group.category)}
                          class="btn-plain scale-animation rounded-lg h-11 font-bold px-2 active:scale-95"
                      >
                          {group.category}
                      </a>
                    </div>
                    <div class="w-[15%] md:w-[10%]">
                        <div class="h-3 w-3 bg-none rounded-full outline outline-[var(--primary)] mx-auto -outline-offset-[2px] z-50 outline-3"></div>
                    </div>
                    <div class="w-[65%] md:w-[75%] transition text-left text-50">{group.series.length} 个{i18n(I18nKey.series)}</div>
                </div>
                {group.series.map(series => (
                    <a href={getPostUrlBySlug(series.posts[series.posts.length-1].slug)}
                       aria-label={series.name}
                       class="group btn-plain !block h-10 w-full rounded-lg hover:text-[initial]"
                    >
                        <div class="flex flex-row justify-start items-center h-full">
                            <!-- count -->
                            <div class="w-[20%] md:w-[15%] transition text-sm text-right text-50">
                                { series.count } 篇文章
                            </div>
                            <!-- dot and line -->
                            <div class="w-[15%] md:w-[10%] relative dash-line h-full flex items-center">
                                <div class="transition-all mx-auto w-1 h-1 rounded group-hover:h-5
                                bg-[oklch(0.5_0.05_var(--hue))] group-hover:bg-[var(--primary)]
                                outline outline-4 z-50
                                outline-[var(--card-bg)]
                                group-hover:outline-[var(--btn-plain-bg-hover)]
                                group-active:outline-[var(--btn-plain-bg-active)]
                                "
                                ></div>
                            </div>
                            <!-- post title -->
                            <div class="w-[65%] md:max-w-[75%] md:w-[75%] text-left font-bold
                                group-hover:translate-x-1 transition-all group-hover:text-[var(--primary)]
                                text-75 pr-8 whitespace-nowrap overflow-ellipsis overflow-hidden"
                            >
                                    {series.name}
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        ))
    }
</div>
```

