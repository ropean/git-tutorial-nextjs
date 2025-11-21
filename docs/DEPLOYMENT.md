# 部署到 CloudFlare Pages

本项目已配置为完全静态导出，可以轻松部署到 CloudFlare Pages。

## 📦 构建输出

运行构建命令后，静态文件会生成在 `out/` 目录中：

```bash
pnpm build
```

构建完成后会生成：
- 33 个静态页面（包括所有教程和练习）
- 所有必要的静态资源（CSS、JavaScript、图片等）
- `.nojekyll` 文件（确保静态托管正常工作）

## 🚀 部署方法

### 方法 1: 通过 Git 自动部署（推荐）

1. **将代码推送到 Git 仓库**（GitHub、GitLab 等）

2. **登录 CloudFlare Pages**
   - 访问 https://dash.cloudflare.com/
   - 选择 "Workers & Pages" > "Pages"

3. **连接 Git 仓库**
   - 点击 "Create a project" > "Connect to Git"
   - 选择你的仓库

4. **配置构建设置**
   ```
   构建命令: pnpm build
   构建输出目录: out
   环境变量: (不需要)
   ```

5. **部署**
   - 点击 "Save and Deploy"
   - CloudFlare 会自动构建并部署你的网站
   - 每次推送到主分支都会自动重新部署

### 方法 2: 手动上传

1. **本地构建**
   ```bash
   pnpm build
   ```

2. **上传到 CloudFlare Pages**
   - 访问 CloudFlare Pages 控制台
   - 点击 "Create a project" > "Direct Upload"
   - 上传 `out/` 文件夹中的所有内容

### 方法 3: 使用 Wrangler CLI

1. **安装 Wrangler**
   ```bash
   npm install -g wrangler
   ```

2. **登录**
   ```bash
   wrangler login
   ```

3. **部署**
   ```bash
   pnpm build
   wrangler pages deploy out --project-name=git-tutorial
   ```

## 📝 部署后

部署成功后，你会获得：
- 一个 CloudFlare Pages URL（例如：`git-tutorial.pages.dev`）
- 免费的 SSL 证书（HTTPS）
- 全球 CDN 加速
- 自动化的部署流程（Git 部署方式）

## 🔧 配置自定义域名（可选）

1. 在 CloudFlare Pages 项目设置中
2. 点击 "Custom domains"
3. 添加你的域名
4. 按照提示配置 DNS 记录

## ✅ 项目特点

- ✨ **完全静态**：无需服务器，加载速度快
- 🌍 **全球 CDN**：CloudFlare 的全球网络分发
- 🔒 **HTTPS**：自动配置 SSL 证书
- 🚀 **零配置**：开箱即用
- 💰 **免费托管**：CloudFlare Pages 免费计划已足够

## 📊 构建信息

当前配置生成的页面：
- 主页和导航页：9 个
- 练习题页面：10 个
- 教程页面：11 个
- 总计：33 个静态页面

所有页面在构建时预渲染（SSG），确保最佳性能。
