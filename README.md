# 婵媛造型 Static Site

这是一个可直接部署到 Vercel 的静态化妆师官网，核心目标是：

- 首屏清晰展示品牌、服务与预约入口
- 预约信息先在前端收集，再跳转到飞书表单
- 作品展示内容从独立配置文件读取，方便后续替换
- 保持无后台、便于长期维护

## 主要文件

- `index.html`：页面结构
- `styles.css`：页面样式与响应式布局
- `main.js`：页面渲染与预约跳转逻辑
- `data/site-config.json`：品牌信息、服务、流程、联系方式、飞书表单地址
- `data/portfolio.json`：作品展示数据
- `assets/portfolio/`：作品区与首屏视觉素材

## 维护方式

### 1. 替换飞书表单地址

编辑 `data/site-config.json` 中的 `bookingFormUrl`：

```json
{
  "bookingFormUrl": "https://你的真实飞书表单链接"
}
```

### 2. 修改作品展示内容

编辑 `data/portfolio.json`：

```json
[
  {
    "title": "作品标题",
    "description": "一句简短描述",
    "image": "./assets/portfolio/look-01.svg"
  }
]
```

如果要换成真实作品图，把图片放到站点目录下并更新 `image` 路径即可。

### 3. 修改服务与联系方式

统一在 `data/site-config.json` 中调整：

- `services`
- `bookingProcess`
- `contact`
- `contactCards`

## 本地预览

这是纯静态站，任选一种方式启动本地服务即可：

```bash
python3 -m http.server 4173
```

然后访问：

```bash
http://localhost:4173
```

如果本机环境限制端口监听，也可以直接部署到 Vercel 预览。

## 部署

直接以静态站方式部署到 Vercel 即可，默认入口为根目录下的 `index.html`。
