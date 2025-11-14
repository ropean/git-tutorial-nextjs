---
title: "远程仓库概念"
weight: 1
bookToc: true
---

# 远程仓库概念

远程仓库是 Git 分布式版本控制系统的核心特性，使团队协作和代码共享成为可能。

## 什么是远程仓库

**远程仓库（Remote Repository）**是托管在网络上的项目版本库。它可以在互联网上，也可以在本地网络中。

### 基本定义

```
远程仓库 = 托管在其他位置的 Git 仓库
         = 团队协作的中心枢纽
         = 代码备份和共享的平台
```

{{< hint info >}}
**关键理解**

虽然叫"远程"仓库，但它可以在：
- ☁️ 云服务器上（如 GitHub、GitLab）
- 🖥️ 公司内部服务器上
- 💻 同事的电脑上
- 📁 甚至本机的另一个目录中

"远程"只是相对于当前工作目录而言。
{{< /hint >}}

### 远程仓库的存在形式

```
┌─────────────────────────────────────┐
│         远程仓库托管位置             │
├─────────────────────────────────────┤
│                                     │
│  🌐 互联网上                        │
│     └─ GitHub, GitLab, Gitee        │
│                                     │
│  🏢 公司内网                        │
│     └─ 自建 GitLab/Gitea 服务器     │
│                                     │
│  💻 局域网                          │
│     └─ 局域网内的服务器             │
│                                     │
│  📂 本地文件系统                    │
│     └─ /path/to/repo.git           │
│                                     │
└─────────────────────────────────────┘
```

## 本地仓库 vs 远程仓库

### 架构对比

**集中式版本控制（如 SVN）**：
```
        服务器（中央仓库）
              ↕
    ┌─────────┼─────────┐
    ↕         ↕         ↕
  开发者A   开发者B   开发者C
  (工作副本) (工作副本) (工作副本)

❌ 问题：
- 必须连接服务器才能提交
- 服务器故障影响所有人
- 无法离线工作
```

**分布式版本控制（Git）**：
```
        远程仓库（GitHub）
        完整的版本历史
              ↕
    ┌─────────┼─────────┐
    ↕         ↕         ↕
  开发者A   开发者B   开发者C
  完整仓库   完整仓库   完整仓库

✅ 优势：
- 每个人都有完整的历史
- 可以离线提交
- 多个备份保证安全
```

### 特性对比

| 特性 | 本地仓库 | 远程仓库 |
|------|---------|---------|
| **位置** | 你的电脑上 | 服务器或其他位置 |
| **作用** | 个人开发和版本控制 | 团队协作和代码共享 |
| **可见性** | 只有你能访问 | 团队成员可访问 |
| **离线工作** | ✅ 完全支持 | ❌ 需要网络连接 |
| **完整性** | ✅ 包含完整历史 | ✅ 包含完整历史 |
| **备份** | ❌ 需要手动备份 | ✅ 自动备份 |

### 工作流程

```
┌──────────────────────────────────────────────┐
│              远程仓库 (origin)               │
│         https://github.com/user/repo         │
│                                              │
│  main: C1 ← C2 ← C3 ← C4                    │
└──────────────────────────────────────────────┘
                    ↕
          git clone / git fetch
          git push / git pull
                    ↕
┌──────────────────────────────────────────────┐
│              本地仓库 (local)                │
│              /home/user/project              │
│                                              │
│  main: C1 ← C2 ← C3 ← C4 ← C5 (未推送)     │
│  origin/main: C1 ← C2 ← C3 ← C4            │
└──────────────────────────────────────────────┘
                    ↕
              工作目录修改
```

## 远程仓库的作用

### 1. 代码共享与协作

远程仓库是团队协作的中心枢纽。

```
团队协作流程：

开发者 A                 远程仓库                 开发者 B
   │                        │                        │
   │──── push 功能 A ───→   │                        │
   │                        │   ←─── pull 代码 ─────│
   │                        │                        │
   │                        │   ←─── push 功能 B ────│
   │──── pull 代码 ───→     │                        │
   │                        │                        │
```

**实际场景**：
```bash
# 开发者 A 推送新功能
git push origin feature/user-login

# 开发者 B 获取最新代码
git pull origin main

# 开发者 C 审查代码并合并
git pull origin feature/user-login
# 审查后合并到 main
```

### 2. 代码备份

远程仓库提供了安全的代码备份。

```
本地电脑故障场景：

本地仓库                远程仓库
   💻  ──── push ──→      ☁️
   │                      │
   ❌ 硬盘损坏             │ ✅ 代码安全
   │                      │
   💻  ←─── clone ────    ☁️
   新电脑                 完整恢复
```

{{< hint warning >}}
**重要提醒**

即使是个人项目，也应该：
- 定期推送到远程仓库
- 使用多个远程仓库备份重要项目
- 不要依赖单一存储位置
{{< /hint >}}

### 3. 持续集成/部署 (CI/CD)

远程仓库触发自动化流程。

```
开发流程自动化：

开发者提交代码
      ↓
  git push
      ↓
┌──────────────┐
│  远程仓库    │
│  (GitHub)    │
└──────────────┘
      ↓
  触发 CI/CD
      ↓
┌──────────────┐
│  自动测试    │ → ✅ 通过 / ❌ 失败
└──────────────┘
      ↓
┌──────────────┐
│  自动部署    │ → 🚀 上线
└──────────────┘
```

**示例配置**（GitHub Actions）：
```yaml
# .github/workflows/test.yml
name: Run Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run tests
        run: npm test
```

### 4. 版本发布

远程仓库管理软件版本。

```
版本管理：

main 分支
  ↓
┌──────────────┐
│   v1.0.0     │ ← 稳定版本
└──────────────┘
  ↓
┌──────────────┐
│   v1.1.0     │ ← 功能更新
└──────────────┘
  ↓
┌──────────────┐
│   v2.0.0     │ ← 重大更新
└──────────────┘
```

**发布流程**：
```bash
# 创建版本标签
git tag -a v1.0.0 -m "Release version 1.0.0"

# 推送标签到远程
git push origin v1.0.0

# GitHub 自动创建 Release 页面
# 用户可以下载对应版本
```

### 5. 代码审查

通过 Pull Request 进行代码审查。

```
代码审查流程：

开发者编写代码
      ↓
创建 Pull Request
      ↓
┌──────────────────┐
│   代码审查       │
│  - 检查代码质量  │
│  - 提出改进建议  │
│  - 讨论实现方案  │
└──────────────────┘
      ↓
    审查通过
      ↓
   合并到主分支
```

### 6. 项目展示

远程仓库作为项目的展示窗口。

```
GitHub 项目页面包含：

┌─────────────────────────────┐
│  项目名称和描述              │
├─────────────────────────────┤
│  📄 README.md - 项目介绍     │
│  📊 代码统计                 │
│  ⭐ Star 数量                │
│  🍴 Fork 数量                │
│  📝 Issues（问题跟踪）       │
│  🔀 Pull Requests            │
│  📚 Wiki（文档）             │
│  🏷️ Releases（版本发布）     │
└─────────────────────────────┘
```

## 常见托管平台介绍

### GitHub

**全球最大的代码托管平台**

```
📊 统计数据（2024年）：
- 👥 1亿+ 用户
- 📦 3亿+ 仓库
- 🏢 用于无数开源和私有项目
```

**主要特性**：
- ✅ 免费的公开和私有仓库
- ✅ GitHub Actions（CI/CD）
- ✅ GitHub Pages（免费网站托管）
- ✅ 强大的社区和生态系统
- ✅ Issues、Projects、Wiki
- ✅ 代码审查工具

**适用场景**：
```bash
# 开源项目
# 个人项目展示
# 技术学习和分享
# 企业级协作
```

**访问地址**：https://github.com

### GitLab

**功能全面的 DevOps 平台**

**主要特性**：
- ✅ 完整的 DevOps 工具链
- ✅ 内置 CI/CD（无需额外配置）
- ✅ 可自托管（私有部署）
- ✅ 免费的私有仓库
- ✅ 容器镜像仓库
- ✅ Issue 跟踪和看板

**架构**：
```
GitLab 平台：

代码托管 → CI/CD → 安全扫描 → 部署
    ↓        ↓         ↓         ↓
  Git    Pipeline   Security   K8s
```

**适用场景**：
```bash
# 企业内部部署
# 需要完整 DevOps 流程
# 注重隐私和数据控制
# 复杂的 CI/CD 需求
```

**访问地址**：https://gitlab.com

### Gitee（码云）

**国内领先的代码托管平台**

**主要特性**：
- ✅ 访问速度快（国内服务器）
- ✅ 中文界面
- ✅ 免费私有仓库
- ✅ Gitee Pages
- ✅ Issues、Pull Request
- ✅ 企业版支持

**优势**：
```
国内使用优势：

访问速度：⚡⚡⚡ 快
网络稳定：✅ 稳定
中文支持：✅ 友好
学习资源：✅ 丰富
```

**适用场景**：
```bash
# 国内团队协作
# 需要快速访问
# 中文用户友好
# 企业私有部署
```

**访问地址**：https://gitee.com

### Bitbucket

**Atlassian 公司的代码托管服务**

**主要特性**：
- ✅ 与 Jira 深度集成
- ✅ 小团队免费
- ✅ Bitbucket Pipelines（CI/CD）
- ✅ 支持 Git 和 Mercurial

**适用场景**：
```bash
# 使用 Atlassian 生态系统的团队
# 需要与 Jira 集成
# 小型团队（5 人以下免费）
```

**访问地址**：https://bitbucket.org

### Azure Repos

**微软 Azure DevOps 的一部分**

**主要特性**：
- ✅ 与 Microsoft 生态集成
- ✅ 支持 Git 和 TFVC
- ✅ Azure Pipelines 集成
- ✅ 企业级安全和权限管理

**适用场景**：
```bash
# 使用 Microsoft 技术栈
# .NET 开发团队
# Azure 云服务用户
```

### 平台对比表

| 特性 | GitHub | GitLab | Gitee | Bitbucket |
|------|--------|--------|-------|-----------|
| **免费私有仓库** | ✅ | ✅ | ✅ | ✅ |
| **国内访问速度** | ⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| **CI/CD** | Actions | Built-in | 企业版 | Pipelines |
| **自托管** | ❌ | ✅ | 企业版 | ❌ |
| **社区规模** | 最大 | 大 | 国内大 | 中等 |
| **开源项目** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **企业功能** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **学习曲线** | 简单 | 中等 | 简单 | 简单 |

### 如何选择

**个人开发者**：
```bash
✅ 首选：GitHub
   - 最大的开源社区
   - 最好的项目展示平台
   - 丰富的学习资源

✅ 备选：Gitee
   - 国内访问快
   - 中文友好
```

**国内团队**：
```bash
✅ 首选：Gitee
   - 访问速度快
   - 符合国内习惯

✅ 备选：自建 GitLab
   - 数据完全掌控
   - 定制化需求
```

**企业用户**：
```bash
✅ 大型企业：
   - 自建 GitLab（完整 DevOps）
   - GitHub Enterprise（生态系统）

✅ 小型企业：
   - GitHub Teams
   - Gitee 企业版
```

**开源项目**：
```bash
✅ 必选：GitHub
   - 最大的用户群体
   - 最好的社区氛围
   - 最多的贡献者
```

## 远程仓库的命名约定

### 默认远程仓库名称

Git 使用 **origin** 作为默认的远程仓库名称。

```bash
# 克隆仓库时自动创建 origin
git clone https://github.com/user/repo.git

# 查看远程仓库
git remote -v
# 输出：
# origin  https://github.com/user/repo.git (fetch)
# origin  https://github.com/user/repo.git (push)
```

{{< hint info >}}
**为什么叫 origin？**

"origin" 只是一个约定俗成的名称，表示"源头"、"起源"。你可以：
- 使用其他名称
- 添加多个远程仓库
- 重命名远程仓库

但大多数情况下，使用 "origin" 是最佳实践。
{{< /hint >}}

### 多个远程仓库

一个本地仓库可以关联多个远程仓库。

```bash
# 添加额外的远程仓库
git remote add upstream https://github.com/original/repo.git
git remote add backup https://gitee.com/user/repo.git

# 查看所有远程仓库
git remote -v
# 输出：
# origin    https://github.com/user/repo.git (fetch)
# origin    https://github.com/user/repo.git (push)
# upstream  https://github.com/original/repo.git (fetch)
# upstream  https://github.com/original/repo.git (push)
# backup    https://gitee.com/user/repo.git (fetch)
# backup    https://gitee.com/user/repo.git (push)
```

**常见远程仓库命名**：
```bash
origin     # 你自己的远程仓库
upstream   # 上游仓库（Fork 的源仓库）
backup     # 备份仓库
production # 生产环境仓库
staging    # 预发布环境仓库
```

### 使用场景

**Fork 工作流**：
```
upstream（上游仓库）
    ↓ fork
origin（你的 Fork）
    ↓ clone
local（本地仓库）

# 配置：
git remote add origin https://github.com/yourname/repo.git
git remote add upstream https://github.com/original/repo.git

# 工作流程：
git pull upstream main        # 从上游拉取最新代码
git push origin feature-x     # 推送到你的 Fork
```

**多环境部署**：
```bash
# 开发环境
git remote add dev https://dev-server/repo.git

# 测试环境
git remote add test https://test-server/repo.git

# 生产环境
git remote add prod https://prod-server/repo.git

# 部署到不同环境
git push dev main       # 部署到开发环境
git push test main      # 部署到测试环境
git push prod v1.0.0    # 部署到生产环境
```

## 远程仓库 URL 格式

### HTTPS 协议

```bash
# 格式
https://[域名]/[用户名]/[仓库名].git

# 示例
https://github.com/torvalds/linux.git
https://gitlab.com/gitlab-org/gitlab.git
https://gitee.com/oschina/gitee.git
```

**特点**：
- ✅ 简单易用
- ✅ 防火墙友好（使用 443 端口）
- ✅ 支持双因素认证
- ⚠️ 每次需要输入密码（可使用凭据管理器）

### SSH 协议

```bash
# 格式
git@[域名]:[用户名]/[仓库名].git

# 示例
git@github.com:torvalds/linux.git
git@gitlab.com:gitlab-org/gitlab.git
git@gitee.com:oschina/gitee.git
```

**特点**：
- ✅ 使用 SSH 密钥认证
- ✅ 无需重复输入密码
- ✅ 更安全
- ⚠️ 需要配置 SSH 密钥
- ⚠️ 某些网络可能阻止 SSH（22 端口）

### Git 协议

```bash
# 格式（只读）
git://[域名]/[用户名]/[仓库名].git

# 示例
git://github.com/torvalds/linux.git
```

**特点**：
- ⚡ 最快的传输速度
- ❌ 没有认证（只读）
- ❌ 不安全（不加密）
- ⚠️ 很少使用

### 本地路径

```bash
# 文件系统路径
/path/to/repo.git
file:///path/to/repo.git

# 示例
git clone /srv/git/project.git
git clone file:///srv/git/project.git
```

**使用场景**：
- 本地测试
- 局域网共享
- 备份仓库

### 协议对比

| 协议 | 速度 | 安全性 | 认证 | 使用难度 |
|------|------|--------|------|----------|
| **HTTPS** | ⭐⭐⭐ | ⭐⭐⭐⭐ | 密码/Token | ⭐ 简单 |
| **SSH** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | SSH 密钥 | ⭐⭐ 中等 |
| **Git** | ⭐⭐⭐⭐⭐ | ⭐ 低 | ❌ 无 | ⭐ 简单 |
| **Local** | ⭐⭐⭐⭐⭐ | - | 文件权限 | ⭐ 简单 |

## 快速开始

让我们通过一个完整示例理解远程仓库：

### 场景：创建并使用远程仓库

**1. 在 GitHub 上创建仓库**
```
访问 https://github.com
点击 "New repository"
填写仓库名称：my-project
选择 Public 或 Private
创建仓库
```

**2. 将本地项目关联到远程仓库**
```bash
# 假设你已有本地项目
cd my-project
git init

# 添加远程仓库
git remote add origin https://github.com/username/my-project.git

# 查看远程仓库
git remote -v

# 创建初始提交
echo "# My Project" > README.md
git add README.md
git commit -m "Initial commit"

# 推送到远程仓库
git push -u origin main
```

**3. 从远程仓库克隆项目**
```bash
# 在另一台电脑或另一个目录
git clone https://github.com/username/my-project.git
cd my-project

# 查看远程仓库（自动配置为 origin）
git remote -v
```

**4. 协作开发**
```bash
# 开发者 A：修改代码并推送
echo "New feature" >> feature.txt
git add feature.txt
git commit -m "Add new feature"
git push origin main

# 开发者 B：拉取最新代码
git pull origin main

# 现在开发者 B 也有了最新的代码
```

## 理解检查点

在继续下一章之前，确保你理解：

1. **什么是远程仓库**？
   - 托管在网络上的 Git 仓库，用于团队协作和代码共享

2. **本地仓库和远程仓库的区别**？
   - 本地仓库在你的电脑上，远程仓库在服务器上
   - 两者都包含完整的版本历史

3. **远程仓库的主要作用**？
   - 代码共享、备份、协作、CI/CD、版本发布、代码审查

4. **常见的代码托管平台有哪些**？
   - GitHub（全球最大）、GitLab（功能全面）、Gitee（国内快速）

5. **origin 是什么**？
   - 默认的远程仓库名称，代表仓库的源头

6. **HTTPS 和 SSH 协议的区别**？
   - HTTPS 需要密码，SSH 使用密钥，SSH 更方便但需要配置

## 下一步

理解了远程仓库的概念后，接下来学习如何克隆和推送代码。

下一节：[克隆与推送](../clone-push/) →

---

## 💡 练习题

{{< expand "练习 1：理解远程仓库的本质" >}}
**问题**：以下关于远程仓库的说法，哪些是正确的？

A. 远程仓库必须在互联网上
B. 远程仓库只包含代码的一部分历史
C. 一个本地仓库只能关联一个远程仓库
D. 远程仓库可以在本机的另一个目录中

{{< expand "查看答案" >}}
**答案**：D 正确

**解析**：

**A. ❌ 错误**
- 远程仓库可以在互联网上，也可以在局域网、甚至本机的其他目录
- "远程"只是相对于当前工作目录而言

**B. ❌ 错误**
- 远程仓库是完整的 Git 仓库，包含完整的版本历史
- 这是 Git 分布式架构的核心特性

**C. ❌ 错误**
- 一个本地仓库可以关联多个远程仓库
- 例如：origin、upstream、backup 等

**D. ✅ 正确**
```bash
# 在本机创建"远程"仓库
mkdir /tmp/remote-repo.git
cd /tmp/remote-repo.git
git init --bare

# 从另一个目录克隆
cd ~/my-project
git clone /tmp/remote-repo.git
```

**关键概念**：
- Git 是完全分布式的
- 每个仓库都是平等的
- "远程"只是逻辑概念，不是物理位置
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 2：选择合适的托管平台" >}}
**问题**：为以下场景选择最合适的代码托管平台：

A. 个人开源项目，希望获得更多关注
B. 国内企业内部项目，需要快速访问
C. 需要完整 DevOps 流程的企业项目
D. 学生学习 Git，希望免费使用

{{< expand "查看答案" >}}
**答案**：

**A. 个人开源项目 → GitHub**
```
理由：
✅ 全球最大的开源社区
✅ 最多的用户和关注度
✅ 最好的项目展示效果
✅ 丰富的开源生态系统

示例：
- Linux 内核：https://github.com/torvalds/linux
- React：https://github.com/facebook/react
- Vue：https://github.com/vuejs/vue
```

**B. 国内企业内部项目 → Gitee 或自建 GitLab**
```
Gitee 优势：
✅ 国内访问速度快
✅ 符合国内使用习惯
✅ 中文界面和支持
✅ 企业版功能完善

自建 GitLab 优势：
✅ 完全掌控数据
✅ 定制化配置
✅ 符合安全合规要求
```

**C. 完整 DevOps 流程 → GitLab**
```
理由：
✅ 内置完整的 CI/CD
✅ 从代码到部署的全流程
✅ 安全扫描和合规检查
✅ 容器镜像仓库
✅ Kubernetes 集成

GitLab DevOps 流程：
代码托管 → CI/CD → 测试 → 安全扫描 → 部署 → 监控
```

**D. 学生学习 → GitHub 或 Gitee**
```
GitHub：
✅ 学生包（GitHub Student Pack）
✅ 免费私有仓库
✅ 最多的学习资源
✅ 最佳的简历展示平台

Gitee：
✅ 访问速度快（国内学生）
✅ 中文文档友好
✅ 免费私有仓库
✅ 简单易用
```

**通用建议**：
```bash
# 推荐策略：多平台使用
1. GitHub - 开源项目和个人展示
2. Gitee - 国内访问和学习
3. GitLab - 企业项目和 DevOps

# 同一项目可以镜像到多个平台
git remote add origin https://github.com/user/repo.git
git remote add gitee https://gitee.com/user/repo.git
git push origin main
git push gitee main
```
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 3：理解 HTTPS vs SSH" >}}
**问题**：以下场景应该使用 HTTPS 还是 SSH？

场景 A：在公司电脑上工作，有严格的防火墙限制
场景 B：个人电脑，频繁 push 代码
场景 C：临时在朋友的电脑上克隆项目查看
场景 D：服务器上的自动部署脚本

{{< expand "查看答案" >}}
**答案**：

**场景 A：严格防火墙 → HTTPS**
```bash
# HTTPS 使用 443 端口，通常不会被防火墙阻止
git clone https://github.com/user/repo.git

原因：
✅ HTTPS (443 端口) 通常被允许
❌ SSH (22 端口) 可能被防火墙阻止
✅ 适合受限网络环境
```

**场景 B：频繁 push → SSH**
```bash
# SSH 使用密钥认证，无需重复输入密码
git clone git@github.com:user/repo.git

配置 SSH 密钥：
# 1. 生成 SSH 密钥
ssh-keygen -t ed25519 -C "your_email@example.com"

# 2. 添加公钥到 GitHub
cat ~/.ssh/id_ed25519.pub
# 复制内容到 GitHub Settings → SSH Keys

# 3. 测试连接
ssh -T git@github.com

优势：
✅ 一次配置，永久使用
✅ 无需重复输入密码
✅ 更安全（基于密钥）
✅ 适合频繁操作
```

**场景 C：临时查看 → HTTPS**
```bash
# 公开仓库用 HTTPS，无需配置
git clone https://github.com/user/repo.git

原因：
✅ 无需任何配置
✅ 快速使用
✅ 适合一次性操作
❌ SSH 需要配置密钥（费时）
```

**场景 D：自动部署 → SSH**
```bash
# 服务器脚本使用 SSH 密钥
# deploy.sh
#!/bin/bash
cd /var/www/app
git pull origin main

配置：
# 1. 在服务器生成 SSH 密钥
ssh-keygen -t ed25519 -C "deploy@server"

# 2. 添加公钥到 GitHub Deploy Keys
# Settings → Deploy Keys → Add key

# 3. 设置只读权限（安全）
# ✅ Allow read access only

优势：
✅ 无人工干预
✅ 安全（不暴露密码）
✅ 可限制权限
✅ 审计日志清晰
```

**对比总结**：

| 场景 | 推荐协议 | 原因 |
|------|---------|------|
| **受限网络** | HTTPS | 443 端口通常开放 |
| **频繁使用** | SSH | 无需重复认证 |
| **临时使用** | HTTPS | 无需配置 |
| **自动化** | SSH | 安全且无人工干预 |
| **首次学习** | HTTPS | 简单易懂 |
| **长期开发** | SSH | 配置一次，长期受益 |

**切换协议**：
```bash
# 查看当前远程 URL
git remote -v

# 从 HTTPS 切换到 SSH
git remote set-url origin git@github.com:user/repo.git

# 从 SSH 切换到 HTTPS
git remote set-url origin https://github.com/user/repo.git
```

**最佳实践**：
```bash
# 个人项目：配置 SSH
✅ 长期使用
✅ 频繁操作
✅ 更方便

# 临时项目：使用 HTTPS
✅ 快速开始
✅ 无需配置
✅ 一次性使用
```
{{< /expand >}}
{{< /expand >}}

---

{{< hint success >}}
**检查清单** - 完成本节后，你应该能够：

- [ ] 解释什么是远程仓库
- [ ] 区分本地仓库和远程仓库
- [ ] 理解远程仓库的作用（协作、备份、CI/CD 等）
- [ ] 了解主流代码托管平台的特点
- [ ] 根据场景选择合适的托管平台
- [ ] 理解 origin 的含义
- [ ] 区分 HTTPS 和 SSH 协议
- [ ] 知道何时使用哪种协议
- [ ] 理解 Git 的分布式架构
{{< /hint >}}
