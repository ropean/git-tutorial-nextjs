# 贡献指南

感谢你考虑为 Git 完全指南做出贡献！🎉

## 如何贡献

### 报告问题

如果你发现了错误或有改进建议：

1. 在 [Issues](https://github.com/ropean/git-tutorial/issues) 中搜索，确保问题尚未被报告
2. 创建新的 Issue，清晰描述问题
3. 如果可能，提供复现步骤或截图

### 贡献内容

#### 1. Fork 和克隆

```bash
# Fork 本仓库，然后克隆你的 fork
git clone https://github.com/YOUR_USERNAME/git-tutorial.git
cd git-tutorial

# 添加上游仓库
git remote add upstream https://github.com/ropean/git-tutorial.git
```

#### 2. 创建分支

```bash
# 创建并切换到新分支
git checkout -b feature/your-feature-name

# 分支命名规范：
# feature/xxx - 新功能
# fix/xxx - 错误修复
# docs/xxx - 文档改进
# style/xxx - 样式调整
```

#### 3. 本地开发

```bash
# 初始化主题（首次）
git submodule update --init --recursive

# 启动开发服务器
hugo server -D

# 访问 http://localhost:1313
```

#### 4. 提交更改

```bash
# 添加更改
git add .

# 提交（使用规范的提交信息）
git commit -m "feat: 添加 Git rebase 详细说明"

# 提交信息规范：
# feat: 新功能
# fix: 修复错误
# docs: 文档更新
# style: 代码格式（不影响功能）
# refactor: 重构
# test: 测试相关
# chore: 构建/工具相关
```

#### 5. 推送和创建 PR

```bash
# 推送到你的 fork
git push origin feature/your-feature-name

# 在 GitHub 上创建 Pull Request
```

## 内容编写规范

### Markdown 格式

- 使用标准 Markdown 语法
- 代码块必须指定语言：````bash`、````javascript` 等
- 使用 Hugo shortcodes 增强内容

### 内容结构

每个章节应包含：

```markdown
---
title: "章节标题"
weight: 1
bookToc: true
---

# 章节标题

## 简介
简短介绍本章内容

## 学习目标
列出学习后能掌握的技能

## 详细内容
...

## 练习题
{{< expand "练习 1" >}}
...
{{< /expand >}}

## 下一步
链接到下一章节
```

### 代码示例

```bash
# 总是添加注释说明
git commit -m "添加用户登录功能"

# 使用实际可运行的示例
git log --oneline --graph --all
```

### 使用 Hugo Shortcodes

提示框：

```markdown
{{< hint info >}}
**提示**：这是一条有用的信息
{{< /hint >}}

{{< hint warning >}}
**注意**：需要特别注意的内容
{{< /hint >}}

{{< hint danger >}}
**警告**：危险操作
{{< /hint >}}
```

可折叠内容：

```markdown
{{< expand "点击展开" >}}
隐藏的内容
{{< /expand >}}
```

分栏：

```markdown
{{< columns >}}
左侧内容
<--->
右侧内容
{{< /columns >}}
```

### 练习题格式

```markdown
{{< expand "练习 1：概念理解" >}}
**问题**：描述问题

A. 选项 A
B. 选项 B
C. 选项 C
D. 选项 D

{{< expand "查看答案" >}}
**答案**：C

**解析**：
详细解释为什么选择这个答案
{{< /expand >}}
{{< /expand >}}
```

## 文件组织

```
content/docs/
├── getting-started/      # 快速开始
│   ├── _index.md        # 章节首页
│   ├── introduction.md   # 具体页面
│   └── ...
├── basics/              # 基础操作
├── branching/           # 分支管理
├── remote/              # 远程协作
├── advanced/            # 进阶技巧
├── best-practices/      # 最佳实践
└── troubleshooting/     # 问题排查
```

## 样式指南

### 术语一致性

使用统一的术语翻译：

| 英文 | 中文 |
|------|------|
| Repository | 仓库 |
| Commit | 提交 |
| Branch | 分支 |
| Merge | 合并 |
| Pull Request | Pull Request（保留）|
| Fork | Fork（保留）|
| Clone | 克隆 |
| Push | 推送 |
| Pull | 拉取 |
| Fetch | 获取 |
| Stage | 暂存 |

### 代码高亮

指定正确的语言：

- Bash 命令：````bash`
- Git 配置：````ini`
- JavaScript：````javascript`
- Python：````python`
- JSON：````json`
- YAML：````yaml`

### 图片

- 放在 `static/images/` 目录
- 使用描述性文件名：`git-workflow-diagram.svg`
- 优先使用 SVG 格式
- 添加 alt 文本

## 本地测试

提交前请确保：

```bash
# 1. 检查构建
hugo

# 2. 检查没有错误
# 3. 本地预览效果正常
hugo server -D

# 4. 检查链接有效性
hugo --gc --minify
```

## Pull Request 清单

提交 PR 前确认：

- [ ] 代码没有语法错误
- [ ] 内容格式正确
- [ ] 链接都有效
- [ ] 代码示例可运行
- [ ] 包含必要的练习题
- [ ] 本地构建成功
- [ ] 提交信息清晰
- [ ] 已从上游拉取最新代码

## Code Review

我们会尽快审查你的 PR：

- 通常在 1-3 天内回复
- 可能会要求修改
- 请耐心等待和配合修改
- 通过后会合并到主分支

## 社区准则

- 保持友善和尊重
- 欢迎新手提问
- 建设性地提出批评
- 专注于内容质量
- 遵守开源协议

## 获取帮助

如有疑问：

- 查看现有 [Issues](https://github.com/ropean/git-tutorial/issues)
- 在 [Discussions](https://github.com/ropean/git-tutorial/discussions) 提问
- 参考现有章节的写作风格

## 许可证

贡献的内容将采用 MIT 许可证。

---

再次感谢你的贡献！🙏
