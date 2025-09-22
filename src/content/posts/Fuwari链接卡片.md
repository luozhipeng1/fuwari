---
title: Fuwari链接卡片
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

## 第一种实现方案   链接卡片

参考了[feat: add link-card feature](https://github.com/saicaca/fuwari/pull/324/commits)

> :::note[小声说]
>
> 我采用这个方法，使用起来怪怪的，就放弃了，链接虽然直接就转为卡片，但是自主性太差了

## 第一种实现方案 

1. 创建组件 新建一个`src/plugins/rehype-component-link-card.mjs`组件

```js title="src/plugins/rehype-component-link-card.mjs" ins={1-228}
/// <reference types="mdast" />
import { h } from "hastscript";

// 常量定义
const CONSTANTS = {
  FAVICON_API: 'https://www.google.com/s2/favicons',
  FAVICON_SIZE: 32,
  ID_PREFIX: 'LC',
  LOADING_TITLE: 'Loading...',
  LOADING_DESC: 'Loading description...',
};

// 错误信息
const ERRORS = {
  INVALID_DIRECTIVE: 'Invalid directive. ("link-card" directive must be leaf type "::link-card{url="https://example.com"}")',
  INVALID_URL: 'Invalid URL. ("url" attribute must be a valid HTTP/HTTPS URL)',
};

/**
 * 生成唯一的卡片ID
 * 使用时间戳和随机数确保唯一性
 */
function generateCardId() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 8);
  return `${CONSTANTS.ID_PREFIX}${timestamp}${random}`;
}

/**
 * 安全地提取域名
 */
function extractDomain(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return 'unknown';
  }
}

/**
 * 验证URL是否有效
 */
function isValidUrl(url) {
  if (!url) return false;
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
}

/**
 * 转义字符串用于安全插入到JavaScript中
 */
function escapeForScript(str) {
  return JSON.stringify(str);
}

/**
 * 生成获取元数据的脚本
 * 使用IIFE避免全局污染，使用JSON.stringify防止XSS
 */
function generateMetadataScript(cardId, url, domain) {
  return `
    (function() {
      'use strict';
      try {
        const cardElement = document.getElementById('${cardId}-card');
        const titleElement = document.getElementById('${cardId}-title');
        const descElement = document.getElementById('${cardId}-description');

        if (!cardElement || !titleElement || !descElement) {
          console.warn('[LINK-CARD] Elements not found for ${cardId}');
          return;
        }

        // 只有在没有自定义内容时才设置默认值
        if (!titleElement.dataset.hasCustomTitle) {
          titleElement.textContent = ${escapeForScript(domain)};
        }
        if (!descElement.dataset.hasCustomDesc) {
          descElement.textContent = ${escapeForScript(`Visit ${domain}`)};
        }

        cardElement.classList.remove("fetch-waiting");
        console.log("[LINK-CARD] Loaded card for:", ${escapeForScript(url)}, "|", "${cardId}");
      } catch (err) {
        console.error("[LINK-CARD] Error loading card:", err);
        const cardEl = document.getElementById('${cardId}-card');
        if (cardEl) {
          cardEl.classList.add("fetch-error");
          cardEl.classList.remove("fetch-waiting");
        }
      }
    })();
  `;
}

/**
 * Creates a Link Card component for third-party links.
 * @param {Object} properties - The properties for the link card
 * @param {string} properties.url - The URL to link to (required)
 * @param {string} [properties.title] - Custom title for the card
 * @param {string} [properties.description] - Custom description
 * @param {string} [properties.image] - Custom image URL
 * @param {string} [properties.icon] - Custom favicon URL
 * @param {Array} children - Should be empty for leaf directive
 * @returns {Object} HAST element representing the link card
 */
export function LinkCardComponent(properties = {}, children = []) {
  // 验证：确保是叶子指令（没有子元素）
  if (Array.isArray(children) && children.length !== 0) {
    return h("div", { class: "hidden" }, ERRORS.INVALID_DIRECTIVE);
  }

  // 验证URL
  if (!isValidUrl(properties.url)) {
    return h("div", { class: "hidden" }, ERRORS.INVALID_URL);
  }

  const url = properties.url;
  const domain = extractDomain(url);
  const cardId = generateCardId();

  // 解构自定义属性，提供默认值
  const {
    title: customTitle = null,
    description: customDescription = null,
    image: customImage = null,
    icon: customIcon = null
  } = properties;

  // 判断是否需要获取元数据
  const needsFetch = !customTitle || !customDescription;

  // 构建favicon URL，使用自定义图标或Google的favicon服务
  const iconUrl = customIcon ||
    `${CONSTANTS.FAVICON_API}?domain=${encodeURIComponent(domain)}&sz=${CONSTANTS.FAVICON_SIZE}`;

  // 创建favicon元素
  const nFavicon = h(`div#${cardId}-favicon`, {
    class: "lc-favicon",
    style: `background-image: url(${iconUrl})`,
    // 添加错误处理：如果图标加载失败，使用默认背景色
    onerror: "this.style.backgroundImage='none'; this.style.backgroundColor='#f0f0f0';"
  });

  // 创建标题栏
  const nTitle = h("div", { class: "lc-titlebar" }, [
    h("div", { class: "lc-titlebar-left" }, [
      h("div", { class: "lc-site" }, [
        nFavicon,
        h("div", { class: "lc-domain" }, domain),
      ]),
    ]),
    h("div", { class: "lc-external-icon" }),
  ]);

  // 创建卡片标题
  const nCardTitle = h(
    `div#${cardId}-title`,
    {
      class: "lc-card-title",
      ...(customTitle && { 'data-has-custom-title': 'true' })
    },
    customTitle || CONSTANTS.LOADING_TITLE
  );

  // 创建描述
  const nDescription = h(
    `div#${cardId}-description`,
    {
      class: "lc-description",
      ...(customDescription && { 'data-has-custom-desc': 'true' })
    },
    customDescription || CONSTANTS.LOADING_DESC
  );

  // 构建卡片内容数组
  const cardContent = [nTitle, nCardTitle, nDescription];

  // 如果有自定义图片，添加图片元素
  if (customImage) {
    const nImage = h(
      `div#${cardId}-image`,
      { class: "lc-image" },
      h("img", {
        src: customImage,
        alt: customTitle || "Link preview",
        loading: "lazy", // 添加懒加载
        onerror: "this.style.display='none';" // 图片加载失败时隐藏
      })
    );
    cardContent.push(nImage);
  }

  // 如果需要获取元数据，添加脚本
  if (needsFetch) {
    const nScript = h(
      `script#${cardId}-script`,
      {
        type: "text/javascript",
        defer: true
      },
      generateMetadataScript(cardId, url, domain)
    );
    cardContent.push(nScript);
  }

  // 创建并返回链接卡片
  return h(
    `a#${cardId}-card`,
    {
      class: needsFetch ? "card-link fetch-waiting no-styling" : "card-link no-styling",
      href: url,
      target: "_blank",
      rel: "noopener noreferrer", // 安全性：防止新页面访问 window.opener
      'data-url': url,
      'aria-label': `Link to ${domain}`, // 无障碍：添加屏幕阅读器标签
      title: customTitle || `Visit ${domain}` // 添加悬停提示
    },
    cardContent
  );
}

// 导出默认函数，保持向后兼容
export default LinkCardComponent;
```

2. 新建样式 我这里选择新建`src/styles/link-card.styl`,当然也可以选择在`src/styles/markdown-extend.styl`中添加以下样式

   > :::tip[样式]
   >
   > 这里参考[鱼的样式](https://blog.fis.ink/posts/30/)

```js title="src/styles/link-card.styl" ins={1-98}
// Link Card Styles
a.card-link
  display: block
  text-decoration: none
  border: 1px solid var(--line-divider)
  border-radius: 8px
  padding: 16px
  margin: 16px 0
  background-color: var(--card-bg)
  transition: all 0.2s ease
  position: relative
  overflow: hidden
  color: inherit

  &:hover
    background-color: var(--btn-regular-bg-hover)

    .lc-titlebar
      .lc-external-icon
        opacity: 1

  &:active
    transform: translateY(0)
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1)

  .lc-titlebar
    display: flex
    justify-content: space-between
    align-items: center
    margin-bottom: 8px

    .lc-titlebar-left
      display: flex
      align-items: center

    .lc-site
      display: flex
      align-items: center
      gap: 8px

    .lc-favicon
      width: 16px
      height: 16px
      background-size: contain
      background-repeat: no-repeat
      background-position: center
      flex-shrink: 0

    .lc-domain
      font-size: 14px
      color: var(--text-color-secondary)
      font-weight: 500

    .lc-external-icon
      width: 16px
      height: 16px
      opacity: 0.6
      transition: opacity 0.2s ease
      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15,3 21,3 21,9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>')
      background-size: contain
      background-repeat: no-repeat
      background-position: center

  .lc-card-title
    font-size: 18px
    font-weight: 600
    color: var(--text-color-primary)
    margin-bottom: 8px
    line-height: 1.3

  .lc-description
    font-size: 14px
    color: var(--text-color-secondary)
    line-height: 1.4
    margin-bottom: 12px

  .lc-image
    margin-top: 12px

    img
      width: 100%
      max-height: 200px
      object-fit: cover
      border-radius: 4px

  &.fetch-waiting
    .lc-card-title, .lc-description
      animation: pulse 1.5s ease-in-out infinite

  &.fetch-error
    border-color: var(--error-color)
    background-color: var(--error-bg)

@keyframes pulse
  0%, 100%
    opacity: 1
  50%
    opacity: 0.5
```

然后在`src/styles/markdown-extend.styl`中导入

```js title="src/styles/markdown-extend.styl" ins={1}
@import 'link-card.styl' // 在文件末尾添加就行
```

3. 配置Astro 在`astro.config.mjs`文件中导入组件并注册

```js title="astro.config.mjs" 
// 添加导入
import { LinkCardComponent } from "./src/plugins/rehype-component-link-card.mjs";

// 在 rehypeComponents 配置中添加
rehypeComponents,
{
  components: {
    "link-card": LinkCardComponent, // 添加这一行
    // ... 其他组件
  },
},
```

## 使用方法

> :::note[注意]
>
> - 确保URL以`http://`或`https://`开头
> - 自定义图片建议使用合适的尺寸和格式 '''

```js title="demo.md"
// 基本用法
::link-card{url="https://example.com"}

// 自定义标题和描述
::link-card{url="https://github.com" title="GitHub" description="代码托管平台"}

// 带自定义图片
::link-card{url="https://vercel.com" title="Vercel" description="部署平台" image="https://example.com/image.png"}

// 自定义图标
::link-card{url="https://github.com" title="GitHub" description="代码托管平台" icon="https://github.com/favicon.ico"}

// 我自定义的
::link-card{url="https://pengxing.dpdns.org/posts/umami-uv--pv-%E7%BB%9F%E8%AE%A1%E6%98%BE%E7%A4%BA/" title="Umami UV / PV 统计显示" description="Umami 统计显示" icon="https://pengxing.dpdns.org/favicon/favicon.ico" image="https://pengxing.dpdns.org/_astro/image-20250916112203340.CqtaXT93_Z1Bppgg.webp" }
```

::link-card{url="https://pengxing.dpdns.org/posts/umami-uv--pv-%E7%BB%9F%E8%AE%A1%E6%98%BE%E7%A4%BA/" title="Umami UV / PV 统计显示" description="Umami 统计显示" icon="https://pengxing.dpdns.org/favicon/favicon.ico" image="https://pengxing.dpdns.org/_astro/image-20250916112203340.CqtaXT93_Z1Bppgg.webp" }