---
title: Umami UV / PV 统计显示 
published: 2025-09-16
updated: 2025-09-16
description: '本文将介绍如何通过 Umami 的 API 获取网站的 UV 和 PV 数据，并在页面上展示。'
image: ''
tags: [Blog,Umami]
category: '笔记'
draft: false 
lang: ''
pinned: false
series: 'Umami'
---

> Umami 官方文档并没有提供 UV 和 PV 展示的 API，但是我们可以通过 Umami 的访客 API 获取到网站的访问量和访问人数。
>
> 本文将介绍如何通过 Umami 的 API 获取网站的 UV 和 PV 数据，并在页面上展示。



这是本站的 Umami 访问统计页面，显示了每日的访问量和访问人数，链接：

https://us.umami.is/websites/f11536ad-eac1-434b-a0c7-fc78faa63405

![image-20250916104118792](../_assets/images/image-20250916104118792.png)

我们在前文介绍过如何安装 Umami：[Umami 安装使用教程](https://blog.ovvv.top/posts/f7a090e6/)

下面我们将新建用户，通过 Umami 的 API 调用，编写一个简单的页面来显示 Umami 的 UV, PV 访问情况。本文使用类似于 `postman` 的 API 测试工具来发送 `GET`, `POST` 请求。你也可以使用 `hoppscotch`、`curl` 等工具。

## 1. 新建 `View only` 权限的用户

点击 `Settings` -> 点击 `Users` -> 点击 `Create user` -> 填写账号密码，`Role` 选择 `View only` -> 点击 `Save`

![image-20250916104609380](../_assets/images/image-20250916104609380.png)

> 
>
> 肯定有读者很疑惑，为什么不直接调用 Umami 的 API 获取数据，而是要额外创建一个账户。
>
> 因为我的博客是 **静态开源无服务器** 的，所有代码都展示在前端，包括 API 调用。而 Umami 的 `admin` API 权限太大了，如果使用 `admin` 权限的 API Token，那么这个 token 可以获取、修改、删除所有网站的数据，会有严重的安全隐患。
>
> 所以我们需要创建一个 `View only` 权限的用户，使用这个 `低权限的用户`的 API Token 来访问我们的浏览量等数据。

## 2. 新建 `Team` 并添加用户和网站

点击 `Settings` -> 点击 `Teams` -> 点击 `Create team` -> 填写名称 -> 点击 `Save`

`Teams` 中选择你刚创建的 Team 点击 `view` -> 复制 `Access code`，点击 `Websites`，点击 `Add website` 添加你想共享的网站。

![image-20250916105721328](../_assets/images/image-20250916105721328.png)

如果你的网站之前属于个人账户，那么你可以将其转移到团队账户上。

![image-20250916110027185](../_assets/images/image-20250916110027185.png)

换一个浏览器登录 Umami（使用 `View only` 权限的用户） -> `Settings` -> `Teams` -> `Join team` -> 输入 `Access code` -> `Join` -> 如果没有出错的话，点击 `Dashboard` 就可以看到你刚刚添加的网站了。

## 3. 获取 `View only` 用户的 API Token

```apl
POST /api/auth/login
```

例如 你的网站地址为 `example.com`，那么你需要使用 `View only` 的账户密码向 `https://example.com/api/auth/login` 发送一个 `POST` 请求，请求体为：

```json
{
  "username": "your-username",
  "password": "your-password"
}
```

如果成功，你应该会得到以下的结果：

```json
{
    "token": "39FFnY1og2MSPWg46alFZfS++akKpey37bRcp9D3oH6CsCMvaCbClN2Qbqq0QhUyZBD1FlHQ9UzUwYOS+J0JKSYnOR7SjftGEuCGj+QBY9RFHxJQBJtpZJmtBvodjgsY0ov8e3jLIClNsfyAecZ3RDXnarsZt+hZwRAFL+5WlOShQP1Bg6e6UyJuUD7f/NWfU94C0ZKYkAgg3b66ATWnkh23UuM3LP3EyYBiQXX3T2PmtN5gSFf7XkS0yRLOP4OCkKUn15j6KzGWHkFsWalwfIz3yECPdZgEWZyDtAnxB5i52N/+t9XIdiR2TDy1LpNj7h7D/dgfue6YO9U5akCauecGniXD7ZPdP1awPvXC/oOLl8TzQCuL+yM0JMN8",
    "user": {
        "id": "41e2b680-648e-4b09-bcd7-3e2b10c06264",
        "username": "admin",
        "role": "admin",
        "createdAt": "2025-09-15T02:10:42.209Z",
        "isAdmin": true
    }
}
```

保存 token 值，并在所有请求中发送带 `Bearer <token>` 值的 `Authorization` 标头。请求标头应该如下所示：

```apl
Authorization: Bearer 39FFnY1og2MSPWg46a...yM0JMN8
```

![image-20250916110646498](../_assets/images/image-20250916110646498.png)

## 4. 发送请求获取数据

先分析一下官方文档的 API 接口：

```apl
# 获取网站所有数据汇总
GET /api/websites/{websiteId}/stats
```

![API](../_assets/images/v2-3c570a96d2d263c81415fea5a97a94fd_1440w.webp)

有两个必填的 查询参数：`startAt` 和 `endAt`，都是 Unix 毫秒时间戳，表示开始时间和结束时间

`websiteId` 和 `startAt` 需要我们自己获取

`websiteId` 可以在 `Dashboard` -> 点击你网站的 `View details` -> 浏览器栏的地址 `https://example.com/websites/{websiteId}` 中找到 {websiteId}

```html
https://example.com/websites/8dd154a4-2073-415e-830e-3a82444b6bb6
```

如上链接中的 `8dd154a4-2073-415e-830e-3a82444b6bb6` 就是 `websiteId`。

`startAt` 可发送 `GET` 请求到 `https://example.com/api/websites/{websiteId}`，带上上文获取的请求头

```apl
Authorization: Bearer 39FFnY1og2MSPWg46a...yM0JMN8
```

在返回结果中找到 `createdAt` 字段，这个字段就是 `startAt` 的值，也就是你的网站创建时间，数据的开始时间

![createdAt](../_assets/images/v2-0f39fd39907c3d7bd911395ba890d82e_1440w.webp)

##  5. 编写页面

![页面展示](../_assets/images/v2-c07238914da7b6773ee1d26f03ace7f0_1440w.webp)

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <div style="text-align:center;">
        <h1>Umami 网站统计</h1>
        <span>总访问量 <span id="umami-site-pv"></span> 次</span>

        <span>总访客数 <span id="umami-site-uv"></span> 人</span>
    </div>

    <script>
        // umami 的 website id
        const website_id = 'xxx';

        // 拼接请求地址
        const request_url = 'https://xxx.com' + '/api/websites/' + website_id + '/stats';

        const start_time = new Date('2024-01-01').getTime(); // 你的网站创建时间
        const end_time = new Date().getTime();

        const token = 'xxxxxx';

        // 检查配置是否为空
        if (!website_id) {
            throw new Error("Umami website_id is empty");
        }
        if (!request_url) {
            throw new Error("Umami request_url is empty");
        }
        if (!start_time) {
            throw new Error("Umami start_time is empty");
        }
        if (!token) {
            throw new Error("Umami token is empty");
        }

        const params = new URLSearchParams({
            startAt: start_time,
            endAt: end_time,
        });

        const request_header = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
        };

        async function allStats() {
            try {
                const response = await fetch(`${request_url}?${params}`, request_header);
                const data = await response.json();
                const uniqueVisitors = data.uniques.value; // 获取独立访客数
                const pageViews = data.pageviews.value; // 获取页面浏览量

                let ele1 = document.querySelector("#umami-site-pv")
                if (ele1) {
                    ele1.textContent = pageViews; // 设置页面浏览量
                }

                let ele2 = document.querySelector("#umami-site-uv")
                if (ele2) {
                    ele2.textContent = uniqueVisitors;
                }

                console.log(uniqueVisitors, pageViews);
                console.log(data);
            } catch (error) {
                console.error(error);
                return "-1";
            }
        }
        allStats();
    </script>
</body>

</html>
```

