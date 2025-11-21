# Git Tutorial Website

一个专业、易用的 Git 版本控制教程网站，使用 Next.js 14 构建。

## 功能特性

- ✅ **现代化技术栈**: Next.js 14 + TypeScript + Tailwind CSS
- ✅ **MDX 支持**: 支持在 Markdown 中使用 React 组件
- ✅ **代码高亮**: 使用 highlight.js 实现语法高亮
- ✅ **深色模式**: 支持浅色/深色主题切换
- ✅ **响应式设计**: 完美适配移动端和桌面端
- ✅ **SEO 优化**: 内置 SEO 最佳实践
- ✅ **分类教程**: 入门、进阶、实战项目三大类别
- ✅ **速查手册**: 快速查找常用 Git 命令
- ✅ **FAQ 页面**: 常见问题解答

## 项目结构

```
git-tutorial/
├── app/                    # Next.js App Router 页面
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 首页
│   ├── globals.css        # 全局样式
│   ├── tutorials/         # 教程页面
│   ├── playground/        # 练习场(待开发)
│   ├── cheatsheet/        # 速查手册
│   ├── faq/               # 常见问题
│   └── search/            # 搜索页面(待开发)
├── components/            # React 组件
│   ├── layout/            # 布局组件
│   │   ├── Header.tsx     # 顶部导航
│   │   └── Footer.tsx     # 页脚
│   ├── ui/                # UI 组件
│   │   ├── CourseCard.tsx # 课程卡片
│   │   └── FeatureCard.tsx# 功能卡片
│   └── ThemeProvider.tsx  # 主题提供者
├── content/               # MDX 教程内容
│   ├── beginner/          # 入门教程
│   ├── advanced/          # 进阶教程
│   └── projects/          # 实战项目
├── lib/                   # 工具函数
│   └── mdx.ts            # MDX 处理函数
└── public/               # 静态资源

```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看网站。

### 3. 构建生产版本

```bash
npm run build
npm start
```

## 技术栈

- **框架**: [Next.js 14](https://nextjs.org/)
- **语言**: [TypeScript](https://www.typescriptlang.org/)
- **样式**: [Tailwind CSS](https://tailwindcss.com/)
- **内容**: [MDX](https://mdxjs.com/)
- **代码高亮**: [highlight.js](https://highlightjs.org/)
- **Markdown 处理**: [gray-matter](https://github.com/jonschlinkert/gray-matter), [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote)

## 添加新教程

### 1. 创建 MDX 文件

在 `content/` 目录下创建新的 `.mdx` 文件：

```bash
content/
  beginner/         # 入门教程
  advanced/         # 进阶教程
  projects/         # 实战项目
```

### 2. 添加 Frontmatter

每个教程文件必须包含以下 frontmatter:

```mdx
---
title: "教程标题"
description: "教程描述"
category: "beginner"  # beginner | advanced | projects
level: "入门"
duration: "15 分钟"
tags: ["标签1", "标签2"]
date: "2024-01-01"
---

# 教程内容

这里是教程的正文内容...
```

### 3. 使用 Markdown 和 React 组件

MDX 支持标准 Markdown 语法和自定义 React 组件。

## 开发指南

### 主题定制

在 `tailwind.config.js` 中修改主题配置：

```js
theme: {
  extend: {
    colors: {
      primary: {
        // 自定义主色调
      }
    }
  }
}
```

### 添加新页面

在 `app/` 目录下创建新文件夹和 `page.tsx`:

```
app/
  new-page/
    page.tsx
```

### 添加新组件

在 `components/` 目录下创建新组件：

```tsx
// components/ui/NewComponent.tsx
export function NewComponent() {
  return <div>...</div>
}
```

## 部署

### Vercel (推荐)

1. 推送代码到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 自动部署完成

### 其他平台

```bash
# 构建
npm run build

# 导出静态文件
npm run export
```

## 待开发功能

- [ ] 交互式 Git 练习场
- [ ] 全文搜索功能 (Algolia)
- [ ] 用户评论系统 (Giscus)
- [ ] 视频教程集成
- [ ] 用户进度追踪
- [ ] 完成证书生成
- [ ] 更多教程内容

## 贡献指南

欢迎贡献新教程或改进现有内容！

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/new-tutorial`)
3. 提交更改 (`git commit -m '添加新教程'`)
4. 推送到分支 (`git push origin feature/new-tutorial`)
5. 创建 Pull Request

## License

MIT

## 联系方式

- 网站: [ropean.org](https://ropean.org)
- GitHub: [https://github.com/ropean/git-tutorial](https://github.com/ropean/git-tutorial)
- 问题反馈: [Issues](https://github.com/ropean/git-tutorial/issues)

---

**用 Git 学习 Git！** 🚀
