/* This is a script to create a new post markdown file with front-matter */

import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import bcrypt from "bcryptjs";

// 创建交互接口
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

function getDate() {
	const today = new Date();
	const year = today.getFullYear();
	const month = String(today.getMonth() + 1).padStart(2, "0");
	const day = String(today.getDate()).padStart(2, "0");

	return `${year}-${month}-${day}`;
}

// 密码加密函数
async function encryptPassword(password) {
	const saltRounds = 10;
	return await bcrypt.hash(password, saltRounds);
}

const args = process.argv.slice(2);

if (args.length === 0) {
	console.error(`Error: No filename argument provided
Usage: npm run new-post -- <filename>`);
	process.exit(1); // Terminate the script and return error code 1
}

let fileName = args[0];

// Add .md extension if not present
const fileExtensionRegex = /\.(md|mdx)$/i;
if (!fileExtensionRegex.test(fileName)) {
	fileName += ".md";
}

const targetDir = "./src/content/posts/";
const fullPath = path.join(targetDir, fileName);

if (fs.existsSync(fullPath)) {
	console.error(`Error: File ${fullPath} already exists `);
	process.exit(1);
}

// recursive mode creates multi-level directories
const dirPath = path.dirname(fullPath);
if (!fs.existsSync(dirPath)) {
	fs.mkdirSync(dirPath, { recursive: true });
}

// 交互式询问是否需要加密
rl.question("是否需要为文章设置密码保护? (y/N) ", (needPassword) => {
	if (needPassword.trim().toLowerCase() !== "y") {
		// 不设置密码，直接创建文章
		const content = `---
title: ${args[0]}
published: ${getDate()}
updated: ${getDate()}
description: ''
image: ''
tags: []
category: ''
draft: false 
lang: ''
pinned: false
series: ''
---
`;

		fs.writeFileSync(fullPath, content);
		console.log(`Post ${fullPath} created (未加密)`);
		rl.close();
	} else {
		// 设置密码并加密
		rl.question("请输入密码: ", async (password) => {
			rl.question("请再次确认密码: ", async (confirmPassword) => {
				if (password !== confirmPassword) {
					console.error("错误：两次输入的密码不一致");
					rl.close();
					process.exit(1);
				}

				try {
					const hashedPassword = await encryptPassword(password);
					const content = `---
title: ${args[0]}
published: ${getDate()}
updated: ${getDate()}
description: ''
image: ''
tags: []
category: ''
draft: false 
lang: ''
pinned: false
series: ''
password: '${hashedPassword}'
encryptedScript: true
---
`;
					fs.writeFileSync(fullPath, content);
					console.log(`Post ${fullPath} created (已加密)`);
				} catch (err) {
					console.error("密码加密失败:", err);
					process.exit(1);
				} finally {
					rl.close();
				}
			});
		});
	}
});
