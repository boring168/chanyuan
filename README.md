# 婵媛造型最小可用接单站

这个版本只保留第一版接单必须的能力：

- 首页展示品牌、作品、服务、微信与收款码
- 独立预约页在站内直接提交需求
- Vercel Serverless 接口写入 Supabase
- 独立记录页查看预约记录

## 主要页面

- `index.html`：首页
- `booking.html`：预约页
- `records-login.html`：内部记录登录页
- `bookings.html`：预约记录查看页

## 主要文件

- `main.js`：首页数据渲染与微信复制
- `booking.js`：预约页渲染与提交
- `bookings.js`：预约记录查看页
- `api/bookings.js`：预约提交与记录读取接口
- `data/site-config.json`：品牌、服务、联系、收款码配置
- `data/portfolio.json`：作品配置
- `supabase/bookings.sql`：Supabase 建表 SQL

## 预约链路

客户提交预约 -> `/api/bookings` -> Supabase `bookings` 表 -> `bookings.html` 查看记录

邮件通知仍然保留为可选项：

- 如果配置了 `RESEND_API_KEY`
- `BOOKING_NOTIFY_EMAIL`
- `BOOKING_FROM_EMAIL`

就会在写入成功后再发通知邮件。

## 必需环境变量

最小可用版本至少需要：

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `BOOKINGS_ADMIN_KEY`

如果要开邮件通知，再额外配置：

- `RESEND_API_KEY`
- `BOOKING_NOTIFY_EMAIL`
- `BOOKING_FROM_EMAIL`

## 上线前必须做的事

1. 在 Supabase 执行 `supabase/bookings.sql`
2. 在 Vercel 填好最小可用环境变量
3. 部署后打开 `/booking` 提交一条测试预约
4. 去 Supabase `bookings` 表确认有新记录
5. 打开 `/records-login` 输入 `BOOKINGS_ADMIN_KEY`，再进入 `/bookings` 确认能看到记录
