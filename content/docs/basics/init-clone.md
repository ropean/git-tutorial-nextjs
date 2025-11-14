---
title: "仓库初始化"
weight: 1
bookToc: true
---

# 仓库初始化

本章将学习如何创建新的 Git 仓库，以及如何克隆现有的仓库。这是使用 Git 的第一步。

## git init - 初始化新仓库

`git init` 命令用于在现有目录中创建一个新的 Git 仓库。

### 基本用法

```bash
# 在当前目录初始化仓库
git init

# 初始化并指定目录名
git init my-project
```

### 工作原理

执行 `git init` 后，Git 会在目录中创建一个 `.git` 子目录，这个目录包含了 Git 仓库的所有必要文件：

```
my-project/
└── .git/
    ├── HEAD           # 当前分支指针
    ├── config         # 仓库配置
    ├── description    # 仓库描述
    ├── hooks/         # 钩子脚本
    ├── info/          # 额外信息
    ├── objects/       # 所有对象数据
    └── refs/          # 分支和标签引用
```

{{< hint info >}}
**提示**：`.git` 目录是隐藏的，在 Linux/macOS 使用 `ls -a` 查看，Windows 需要显示隐藏文件。
{{< /hint >}}

### 实战示例

创建一个新项目：

```bash
# 创建项目目录
mkdir my-website
cd my-website

# 初始化 Git 仓库
git init

# 输出：
# Initialized empty Git repository in /home/user/my-website/.git/
```

验证仓库已创建：

```bash
# 查看 .git 目录
ls -la .git

# 查看 Git 状态
git status

# 输出：
# On branch main
# No commits yet
# nothing to commit (create/copy files and use "git add" to track)
```

### 指定初始分支名

从 Git 2.28 开始，可以在初始化时指定默认分支名：

```bash
# 使用 main 作为初始分支名
git init -b main

# 或者
git init --initial-branch=main
```

{{< hint warning >}}
**注意**：如果你的 Git 版本较旧，可以先 `git init` 然后用 `git branch -m master main` 重命名分支。
{{< /hint >}}

### 初始化裸仓库

裸仓库（bare repository）没有工作目录，通常用作服务器端的中央仓库：

```bash
# 创建裸仓库
git init --bare my-project.git
```

裸仓库的特点：
- 不包含工作目录，只有 `.git` 目录的内容
- 不能在其中直接编辑文件
- 主要用于团队协作的中央仓库
- 通常以 `.git` 结尾命名

## git clone - 克隆现有仓库

`git clone` 命令用于复制一个远程仓库到本地。

### 基本用法

```bash
# 克隆仓库
git clone <repository-url>

# 克隆并指定本地目录名
git clone <repository-url> <directory-name>
```

### HTTPS vs SSH

Git 支持多种协议克隆仓库，最常用的是 HTTPS 和 SSH。

#### HTTPS 克隆

```bash
# GitHub 示例
git clone https://github.com/username/repository.git

# GitLab 示例
git clone https://gitlab.com/username/repository.git

# Gitee 示例
git clone https://gitee.com/username/repository.git
```

**优点**：
- ✅ 简单易用，无需配置
- ✅ 适合克隆公开仓库
- ✅ 可以在任何网络环境使用

**缺点**：
- ❌ 每次推送需要输入密码
- ❌ 可能需要配置凭据管理器

#### SSH 克隆

```bash
# GitHub 示例
git clone git@github.com:username/repository.git

# GitLab 示例
git clone git@gitlab.com:username/repository.git

# Gitee 示例
git clone git@gitee.com:username/repository.git
```

**优点**：
- ✅ 无需每次输入密码
- ✅ 更安全
- ✅ 适合频繁推送

**缺点**：
- ❌ 需要先配置 SSH 密钥
- ❌ 某些网络环境可能限制 SSH 端口

{{< hint info >}}
**如何选择**：
- 只是查看或学习代码 → 使用 HTTPS
- 需要频繁提交代码 → 使用 SSH
{{< /hint >}}

### 克隆选项

#### 指定目录名

```bash
# 克隆到指定目录
git clone https://github.com/username/repo.git my-project

# 会创建 my-project 目录而不是 repo 目录
```

#### 浅克隆（--depth）

浅克隆只获取最近的提交历史，可以大大减少克隆时间和空间：

```bash
# 只克隆最近 1 次提交
git clone --depth 1 https://github.com/username/large-repo.git

# 只克隆最近 10 次提交
git clone --depth 10 https://github.com/username/repo.git
```

**适用场景**：
- 仓库历史很长，完整克隆很慢
- 只需要最新代码，不关心历史
- CI/CD 环境中快速部署

**注意事项**：
- 浅克隆的仓库某些操作会受限
- 可以后续用 `git fetch --unshallow` 转换为完整仓库

#### 克隆指定分支（--branch）

```bash
# 克隆指定分支
git clone -b develop https://github.com/username/repo.git

# 同时使用浅克隆
git clone -b develop --depth 1 https://github.com/username/repo.git
```

#### 递归克隆子模块（--recursive）

如果仓库包含子模块，需要递归克隆：

```bash
# 克隆仓库及其所有子模块
git clone --recursive https://github.com/username/repo.git

# 或者使用长选项
git clone --recurse-submodules https://github.com/username/repo.git
```

#### 克隆到当前目录

```bash
# 克隆到当前目录（当前目录必须为空）
git clone https://github.com/username/repo.git .
```

### 实战示例

#### 示例 1：克隆开源项目

```bash
# 克隆 Vue.js 仓库
git clone https://github.com/vuejs/core.git vue-core

# 进入目录
cd vue-core

# 查看分支
git branch -a

# 查看远程仓库
git remote -v

# 输出：
# origin  https://github.com/vuejs/core.git (fetch)
# origin  https://github.com/vuejs/core.git (push)
```

#### 示例 2：浅克隆大型仓库

```bash
# Linux 内核仓库非常大，使用浅克隆
git clone --depth 1 https://github.com/torvalds/linux.git

# 查看日志（只有 1 次提交）
cd linux
git log --oneline

# 如果需要完整历史，可以取消浅克隆
git fetch --unshallow
```

#### 示例 3：克隆特定分支进行开发

```bash
# 只克隆开发分支
git clone -b development --single-branch \
  https://github.com/username/project.git

# 查看当前分支
git branch

# 输出：
# * development
```

### 克隆后的配置

克隆完成后，Git 自动配置了远程仓库：

```bash
# 查看远程仓库
git remote -v

# 输出：
# origin  https://github.com/username/repo.git (fetch)
# origin  https://github.com/username/repo.git (push)

# 查看远程仓库详细信息
git remote show origin
```

`origin` 是远程仓库的默认名称，可以通过克隆时指定：

```bash
# 使用自定义远程仓库名
git clone -o upstream https://github.com/username/repo.git
```

## 常见使用场景

### 场景 1：开始新项目

```bash
# 创建项目目录
mkdir my-app
cd my-app

# 初始化 Git
git init

# 创建文件
echo "# My App" > README.md

# 添加并提交
git add README.md
git commit -m "Initial commit"
```

### 场景 2：参与开源项目

```bash
# 1. Fork 项目到自己的账号（在 GitHub 网页操作）

# 2. 克隆你 fork 的仓库
git clone https://github.com/YOUR_USERNAME/project.git

# 3. 添加上游仓库
cd project
git remote add upstream https://github.com/ORIGINAL_OWNER/project.git

# 4. 查看远程仓库
git remote -v
# origin    https://github.com/YOUR_USERNAME/project.git (fetch)
# origin    https://github.com/YOUR_USERNAME/project.git (push)
# upstream  https://github.com/ORIGINAL_OWNER/project.git (fetch)
# upstream  https://github.com/ORIGINAL_OWNER/project.git (push)
```

### 场景 3：快速部署

```bash
# 在服务器上快速部署最新代码
git clone --depth 1 --single-branch --branch main \
  https://github.com/username/webapp.git /var/www/app

# 进入目录
cd /var/www/app

# 安装依赖和启动服务
npm install
npm start
```

## 常见问题

### 克隆速度慢

如果克隆速度很慢，可以尝试：

1. **使用浅克隆**：
```bash
git clone --depth 1 <url>
```

2. **使用镜像源**（针对国内用户）：
```bash
# GitHub 镜像（非官方）
git clone https://github.com.cnpmjs.org/username/repo.git
```

3. **使用代理**：
```bash
# HTTP 代理
git config --global http.proxy http://127.0.0.1:7890
git config --global https.proxy https://127.0.0.1:7890

# 取消代理
git config --global --unset http.proxy
git config --global --unset https.proxy
```

### Permission denied (publickey)

SSH 克隆时出现此错误：

```bash
# 检查 SSH 密钥
ssh -T git@github.com

# 如果失败，需要添加 SSH 密钥
# 参考「安装配置」章节的 SSH 配置
```

### 仓库已存在

如果目录已经初始化过，会报错：

```bash
$ git init
# Reinitialized existing Git repository in /path/to/repo/.git/
```

这是安全的，不会覆盖现有数据。

## 最佳实践

### 初始化仓库

1. **设置合适的初始分支名**
```bash
git init -b main
```

2. **立即添加 .gitignore**
```bash
# 根据项目类型添加 .gitignore
echo "node_modules/" > .gitignore
git add .gitignore
git commit -m "Add .gitignore"
```

3. **创建有意义的首次提交**
```bash
git commit -m "Initial commit: Project setup"
```

### 克隆仓库

1. **选择合适的协议**
   - 公开仓库 → HTTPS
   - 私有仓库且频繁推送 → SSH

2. **大仓库使用浅克隆**
```bash
git clone --depth 1 <url>
```

3. **克隆后检查远程配置**
```bash
git remote -v
git branch -a
```

## 命令速查

| 命令 | 说明 |
|------|------|
| `git init` | 初始化新仓库 |
| `git init -b main` | 初始化并指定初始分支 |
| `git init --bare` | 初始化裸仓库 |
| `git clone <url>` | 克隆仓库 |
| `git clone <url> <dir>` | 克隆到指定目录 |
| `git clone --depth 1` | 浅克隆（只克隆最近历史） |
| `git clone -b <branch>` | 克隆指定分支 |
| `git clone --recursive` | 递归克隆子模块 |
| `git remote -v` | 查看远程仓库 |

## 下一步

现在你已经知道如何创建和克隆仓库了，接下来让我们学习如何添加和提交文件。

下一节：[文件操作](../add-commit/) →

---

## 💡 练习题

完成以下练习，巩固所学知识：

{{< expand "练习 1：创建并初始化仓库" >}}
**任务**：
1. 创建一个名为 `git-practice` 的目录
2. 初始化为 Git 仓库，使用 `main` 作为初始分支
3. 创建一个 `README.md` 文件，写入项目介绍
4. 查看仓库状态

{{< expand "查看答案" >}}
```bash
# 1. 创建并进入目录
mkdir git-practice
cd git-practice

# 2. 初始化仓库
git init -b main

# 3. 创建文件
echo "# Git Practice Project" > README.md

# 4. 查看状态
git status
```

**预期输出**：
```
On branch main

No commits yet

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        README.md

nothing added to commit but untracked files present (use "git add" to track)
```
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 2：克隆开源项目" >}}
**任务**：
1. 浅克隆一个公开项目（只获取最新 1 次提交）
2. 查看克隆下来的分支
3. 查看远程仓库配置
4. 查看提交历史

推荐项目：`https://github.com/github/gitignore`

{{< expand "查看答案" >}}
```bash
# 1. 浅克隆项目
git clone --depth 1 https://github.com/github/gitignore.git

# 2. 进入目录并查看分支
cd gitignore
git branch -a

# 3. 查看远程仓库
git remote -v

# 4. 查看提交历史
git log --oneline
```

**说明**：
- `--depth 1` 只克隆最近一次提交，节省时间和空间
- `git branch -a` 显示所有分支（本地和远程）
- `git log --oneline` 显示简洁的提交历史
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 3：对比 HTTPS 和 SSH" >}}
**问题**：以下场景应该使用 HTTPS 还是 SSH 克隆？

A. 你想快速查看一个开源项目的代码
B. 你要参与一个项目的开发，需要频繁提交代码
C. 你在公司内网，SSH 端口被封禁
D. 你刚学 Git，还没配置 SSH 密钥

{{< expand "查看答案" >}}
**答案**：

A. **HTTPS** - 快速查看不需要配置，HTTPS 更方便
B. **SSH** - 频繁提交用 SSH 可以避免每次输入密码
C. **HTTPS** - SSH 端口被禁时只能用 HTTPS
D. **HTTPS** - 新手先用 HTTPS，之后再配置 SSH

**总结**：
- 临时、只读访问 → HTTPS
- 长期、频繁写入 → SSH
- 网络限制 → HTTPS
{{< /expand >}}
{{< /expand >}}

---

{{< hint success >}}
**检查清单** - 完成本节后，你应该能够：

- [ ] 使用 `git init` 创建新仓库
- [ ] 理解 `.git` 目录的作用
- [ ] 使用 `git clone` 克隆远程仓库
- [ ] 区分 HTTPS 和 SSH 克隆方式
- [ ] 使用 `--depth` 选项进行浅克隆
- [ ] 使用 `-b` 选项克隆指定分支
- [ ] 查看和管理远程仓库配置
{{< /hint >}}
