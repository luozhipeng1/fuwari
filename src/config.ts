import type {
	ExpressiveCodeConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
	UmamiConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	title: "PengXing's Blog",
	subtitle: "爱你所爱！",
	lang: "zh_CN", // Language code, e.g. 'en', 'zh_CN', 'ja', etc.
	themeColor: {
		hue: 250, // Default hue for the theme color, from 0 to 360. e.g. red: 0, teal: 200, cyan: 250, pink: 345
		fixed: false, // Hide the theme color picker for visitors
	},
	banner: {
		enable: true, // Display a banner image at the top of the homepage and post pages
		src: "assets/images/demo-banner.png", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
		position: "center", // Equivalent to object-position, only supports 'top', 'center', 'bottom'. 'center' by default
		credit: {
			enable: false, // Display the credit text of the banner image
			text: "", // Credit text to be displayed
			url: "", // (Optional) URL link to the original artwork or artist's page
		},
	},
	toc: {
		enable: true, // Display the table of contents on the right side of the post
		depth: 2, // Maximum heading depth to show in the table, from 1 to 3
	},
	favicon: [
		// Leave this array empty to use the default favicon
		{
			src: "/favicon/favicon.ico", // Path of the favicon, relative to the /public directory
			theme: "light", // (Optional) Either 'light' or 'dark', set only if you have different favicons for light and dark mode
			sizes: "32x32", // (Optional) Size of the favicon, set only if you have favicons of different sizes
		},
	],
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		LinkPreset.Series,
		LinkPreset.About,
		LinkPreset.Friends,
		{
			name: "访客统计",
			url: "https://cloud.umami.is/share/i6f3UwPY4n0w1LJa/pengxing.dpdns.org", // Internal links should not include the base path, as it is automatically added
			external: true, // Show an external link icon and will open in a new tab
		},
		{
			name: "网盘资源",
			url: "https://docs.qq.com/aio/DYmZYVGpFVGxOS3NE", // Internal links should not include the base path, as it is automatically added
			external: true, // Show an external link icon and will open in a new tab
		},
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "assets/images/demo-avatar.png", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
	name: "鹏星",
	bio: "Love what you love,  all will be well! / 爱你所爱，一切美好！",
	links: [
		// {
		// 	name: "Twitter",
		// 	icon: "fa6-brands:twitter", // Visit https://icones.js.org/ for icon codes
		// 	// You will need to install the corresponding icon set if it's not already included
		// 	// `pnpm add @iconify-json/<icon-set-name>`
		// 	url: "https://twitter.com",
		// },
		// {
		// 	name: "Steam",
		// 	icon: "fa6-brands:steam",
		// 	url: "https://store.steampowered.com",
		// },
		// {
		// 	name: "GitHub",
		// 	icon: "fa6-brands:github",
		// 	url: "https://github.com/saicaca/fuwari",
		// },
		{
			name: "QQ频道",
			icon: "fa6-brands:qq",
			url: "https://pd.qq.com/s/38it5vmzn",
		},
		{
			name: "link3",
			icon: "fa6-brands:staylinked",
			url: "https://link3.cc/pyxh",
		},
	],
};

// 在 config.ts 中配置 Umami 相关信息
export const umamiConfig: UmamiConfig = {
	enable: true,
	baseUrl: "https://us.umami.is",
	shareId: "i6f3UwPY4n0w1LJa",
	timezone: "Asia/Shanghai",
};

export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	// Note: Some styles (such as background color) are being overridden, see the astro.config.mjs file.
	// Please select a dark theme, as this blog theme currently only supports dark background color
	themes: ["github-light", "github-dark"], // Theme for light mode and dark mode respectively, visit https://expressive-code.github.io/docs/themes/ for all available themes
};

export const statsConfig = {
	viewsText: "浏览量",
	visitsText: "访客",
	loadingText: "统计加载中...",
	unavailableText: "统计不可用。",
	getStatsText: (pageViews: number, visits: number) =>
		`${statsConfig.viewsText} ${pageViews} · ${statsConfig.visitsText} ${visits}`,
};
