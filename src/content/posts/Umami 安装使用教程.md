---
title: Umami 安装使用教程
published: 2025-09-16
description: ''
image: ''
tags: [Blog,Umami]
category: '笔记'
draft: false 
lang: ''
---

> Umami is a simple, fast, privacy-focused alternative to Google Analytics.
>
> Umami 是一个简单、快速、注重隐私的 Google Analytics 替代品。

![image-20250916112203340](../assets/images/image-20250916112203340.png)

##  1. 什么是 Umami，为什么要使用它？

Umami 是一个简单、快速、注重隐私的开源分析解决方案，是 Google Analytics 的替代品。可轻松收集、分析和了解您的网络数据，同时维护访客隐私和数据所有权。不收集个人身份信息，不使用 Cookie，所有数据都经过匿名处理，符合 GDPR。

它是一个网站统计工具，可以帮助你分析网站的访问情况，比如访问量、访问来源、访问时间等等。这对于静态网站来说是非常有用的，因为静态网站无法像动态网站一样通过后端代码来统计访问情况。

## 2. 安装 Umami

**1Panel 或 宝塔 一键安装** 

打开 `1Panel 或宝塔` 面板，点击 `应用商店`，搜索 `umami`，点击 `安装` 即可。 🛠

🛠**从源码安装**

**要求**

- 具有 Node.js 版本 18.18 或更高版本的服务器
- 数据库。Umami 支持 [MariaDB](https://www.mariadb.org/) （最低版本 v10.5）、 [MySQL](https://www.mysql.com/) （最低版本 v8.0）和 [PostgreSQL](https://www.postgresql.org/) （最低版本 v12.14）数据库。

- 安装 Yarn

```bash
npm install -g yarn
```

- 获取源码并安装依赖

```bash
git clone https://github.com/umami-software/umami.git
cd umami
yarn install
```

- 配置 Umami
  创建一个 `.env` 文件，内容如下：

```bash
DATABASE_URL=connection-url
```

其中 `connection-url` 为数据库连接地址，如

```bash
postgresql://username:mypassword@localhost:5432/mydb
mysql://username:mypassword@localhost:3306/mydb
```

- 构建 Umami

```bash
# 服务器不太行的，卡死这步概率极大
yarn build
```

- 启动 Umami

```bash
yarn start
```

**docker-compose 安装**

下载官方的 docker-compose.yml 文件：

下载官方的 docker-compose.yml 文件：

```bash
wget https://raw.githubusercontent.com/umami-software/umami/master/docker-compose.yml
```

`docker-compose.yml` 的默认数据库是 Postgresql 数据库，如果你想使用 MySQL 数据库，可以修改 `docker-compose.yml`，将 `DATABASE_URL` 的 `postgres` 替换为 `mysql`，并修改 `DATABASE_URL` 为 MySQL 对应的链接。

修改完配置参数后运行：

```bash
docker-compose up -d
```

默认情况下，应用程序将在 [http://localhost:3000](http://localhost:3000/) 上启动。建议使用反向代理避免直接暴露端口。

## 3. 修改 Umami 密码

Umami 启动后，默认用户名为 `admin`，默认密码为 `umami`。

我们先修改密码，选择 `Setting` -> `Profile`，然后设置你的新密码。
![img](../assets/images/v2-8e5d01834b102bd9acedb220fe8cc29f_1440w.webp)

修改密码

点击右上角的地球图标，修改语言为 `中文`。

## 4. 添加网站

点击 `设置` -> `网站` -> `添加网站`，输入你的网站地址，点击 `添加` 即可。
![添加网站](../assets/images/v2-09b94e9c1d79acc10492e9954edd48f8_1440w.webp)

添加网站

填写信息后，点击 `编辑`
![编辑](../assets/images/v2-8c75210e16bdb9ac1ad31ce04ec6014d_1440w.webp)

编辑



再点击 `跟踪代码`，复制代码到你的网站中即可。
![跟踪代码](../assets/images/v2-9da304c3d1550731e064f3d9353b6296_1440w.webp)

跟踪代码

```
<script async src="https://example.com/script.js" data-website-id="xxxxxxxxxxxxxxxxxxxx"></script>
```

如果你在本地写博客，你会发现 `localhost` 也被统计了，可以添加 `data-domains` 属性，只统计你的域名：

```
<script async src="https://example.com/script.js" data-website-id="xxxxxxxxxxxxxxxxxxxx" data-domains="example.com"></script>
```

如果你想遵循访客的 `Do Not Track` 设置，可以添加 `data-do-not-track` 属性：

```
<script async src="https://example.com/script.js" data-website-id="xxxxxxxxxxxxxxxxxxxx" data-do-not-track="true"></script>
```

更多使用方法请参考官方文档：https://umami.is/docs/tracker-configuration

## 5. Umami UV / PV 统计显示

Umami 官方文档并没有直接提供 UV 和 PV 展示的 API，但是我们可以通过编写相应的代码来获取 Umami 的访问量和访问人数。具体操作参考我的另一篇文章：Umami UV / PV 统计显示