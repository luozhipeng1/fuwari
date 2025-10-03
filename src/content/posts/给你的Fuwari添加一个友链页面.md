---
title: 给你的Fuwari添加一个友链页面
published: 2025-10-03
updated: 2025-10-03
description: ''
image: ''
tags: [Astro,Fuwari,博客]
category: '前端'
draft: false 
lang: ''
pinned: false
series: '改造博客'
---



# 创建友链页面

:::tip[防404]

在`src\content\spec`目录下新建文件`friends.md`，这个就是友链页面的文件

:::

在`src\types\config.ts`文件内添加以下内容

```js title="src\types\config.ts" ins={5}
export enum LinkPreset {
	Home = 0,
	Archive = 1,
	About = 2,
	Friends = 3,
	Series = 4,
}
```

在`src\i18n\i18nKey.ts`文件内添加以下内容

```js title="src\i18n\i18nKey.ts" ins={40} collapse={1-31}
enum I18nKey {
	home = "home",
	about = "about",
	archive = "archive",
	search = "search",

	tags = "tags",
	categories = "categories",
	recentPosts = "recentPosts",

	comments = "comments",

	untitled = "untitled",
	uncategorized = "uncategorized",
	noTags = "noTags",

	wordCount = "wordCount",
	wordsCount = "wordsCount",
	minuteCount = "minuteCount",
	minutesCount = "minutesCount",
	postCount = "postCount",
	postsCount = "postsCount",

	themeColor = "themeColor",

	lightMode = "lightMode",
	darkMode = "darkMode",
	systemMode = "systemMode",

	more = "more",

	author = "author",
	publishedAt = "publishedAt",
	license = "license",

	pinned = "pinned",

	series = "series",

	friends = "friends",
}

export default I18nKey;

```

按照自己的语言，在 `src\i18n\languages` 目录中编辑相应语言文件
这里拿 `zh_CN.ts` 举例：

```js title="src\i18n\languages\zh_CN.ts" ins={43} collapse={1-34}
import Key from "../i18nKey";
import type { Translation } from "../translation";

export const zh_CN: Translation = {
	[Key.home]: "主页",
	[Key.about]: "关于",
	[Key.archive]: "归档",
	[Key.search]: "搜索",

	[Key.tags]: "标签",
	[Key.categories]: "分类",
	[Key.recentPosts]: "最新文章",

	[Key.comments]: "评论",

	[Key.untitled]: "无标题",
	[Key.uncategorized]: "未分类",
	[Key.noTags]: "无标签",

	[Key.wordCount]: "字",
	[Key.wordsCount]: "字",
	[Key.minuteCount]: "分钟",
	[Key.minutesCount]: "分钟",
	[Key.postCount]: "篇文章",
	[Key.postsCount]: "篇文章",

	[Key.themeColor]: "主题色",

	[Key.lightMode]: "亮色",
	[Key.darkMode]: "暗色",
	[Key.systemMode]: "跟随系统",

	[Key.more]: "更多",

	[Key.author]: "作者",
	[Key.publishedAt]: "发布于",
	[Key.license]: "许可协议",

	[Key.pinned]: "置顶",

	[Key.series]: "系列",

	[Key.friends]: "友链",
};

```

```js title="举例"
// en.ts
[Key.friends]: "Friends",
    
// es.ts
[Key.friends]: "Amigos",
    
// id.ts
[Key.friends]: "Teman",
    
// ja.ts
[Key.friends]: "友達",
    
// ko.ts
[Key.friends]: "친구",    
   
// th.ts
[Key.friends]: "เพื่อน",
 
// tr.ts
[Key.friends]: "Arkadaşlar",

// vi.ts
[Key.friends]: "Bạn bè",
    
// zh_TW.ts
[Key.friends]: "友鏈",    
```

在 `src\constants\link-presets.ts` 文件内添加下方内容

```js title="src\constants\link-presets.ts" ins={7-10}
export const LinkPresets: { [key in LinkPreset]: NavBarLink } = {
  // ...
  [LinkPreset.Archive]: {
     name: i18n(I18nKey.archive),
     url: '/archive/',
   },
  [LinkPreset.Friends]: {
		name: i18n(I18nKey.friends),
		url: "/friends/",
   },
  [LinkPreset.Series]: {
    name: i18n(I18nKey.series),
    url: '/series/',
  },
}
```

最后一步，在 `src\config.ts` 文件内添加内容，注意要在 `LinkPreset.About` 末尾添加`,`

```js title="src\config.ts" ins={6}
export const navBarConfig: NavBarConfig = {
  links: [
    LinkPreset.Home,
    LinkPreset.Archive,
    LinkPreset.About,
    LinkPreset.Friends,
    {
        // ....
```

在 `src\pages` 目录下，创建 `friends.astro` 文件

```js title="src\pages\friends.astro"
---
import { getEntry, render } from "astro:content";
import Markdown from "@components/misc/Markdown.astro";
import I18nKey from "../i18n/i18nKey";
import { i18n } from "../i18n/translation";
import MainGridLayout from "../layouts/MainGridLayout.astro";

const friendsPost = await getEntry("spec", "friends");

if (!friendsPost) {
	throw new Error("friends page content not found");
}

const { Content } = await friendsPost.render();

const items = [
	{
		title: "鹏星导航",
		imgurl: "https://px.lzphy.top/favicon.ico",
		desc: "爱你所爱，一切美好！",
		siteurl: "https://px.lzphy.top",
		tags: ["html,前端"],
	},
];
---
<MainGridLayout title={i18n(I18nKey.friends)} description={i18n(I18nKey.friends)}>
    <div class="flex w-full rounded-[var(--radius-large)] overflow-hidden relative min-h-32">
        <div class="card-base z-10 px-9 py-6 relative w-full ">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8 my-4" id="friends-list">
                {items.map((item) => (
                  <div class="friend-card flex flex-nowrap items-stretch h-28 gap-4 rounded-[var(--radius-large)] hover:border-2 hover:border-blue-500 transition-all duration-300 ease-in-out cursor-pointer" data-url={item.siteurl}>
                    <div class="w-28 h-28 flex-shrink-0 rounded-lg overflow-hidden bg-zinc-200 dark:bg-zinc-900">
                      <img src={item.imgurl} alt="站点头像" class="w-full h-full object-cover" />
                    </div>
                    <div class="grow w-full">
                      <div class="font-bold transition text-lg text-neutral-900 dark:text-neutral-100 mb-1">{item.title}</div>
                      <div class="text-50 text-sm font-medium">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            <Markdown class="mt-2">
                <Content />
            </Markdown>
        </div>
    </div>
 <!--在此处👇插入随机排列JS脚本 -->
 <script>
    window.addEventListener('DOMContentLoaded', () => {
        const container = document.getElementById('friends-list');
        if (!container) return;
        const cards = Array.from(container.children);
        // 洗牌算法
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
        // 重新插入
        cards.forEach(card => container.appendChild(card));
        
        // 添加点击事件委托
        container.addEventListener('click', (e) => {
            if (e.target && e.target instanceof Element) {
                const friendCard = e.target.closest('.friend-card');
                if (friendCard) {
                    const url = (friendCard as HTMLElement).dataset.url;
                    if (url) {
                        window.open(url, '_blank');
                    }
                }
            }
        });
    });
    </script>
    <!--在此处👆插入随机排列JS脚本 -->
                                
    <style>
       /* 定义一些变量 */
:root {
  --radius-large: 12px;
}

.friend-card:hover {
  border: 2px solid #007bff; /* 鼠标悬停时显示蓝色边框 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
}
.friend-card:hover .font-bold {
  color: #007bff; /* 鼠标悬停时标题文字显示为蓝色 */
}
    </style>
</MainGridLayout>
```

至此，友链页面完成创建

`const items` 部分就是添加的友链部分可以往下面继续添加

`friends.md`文章就是写页面介绍，和 `about.md`作用一样