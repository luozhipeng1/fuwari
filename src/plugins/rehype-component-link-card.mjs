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