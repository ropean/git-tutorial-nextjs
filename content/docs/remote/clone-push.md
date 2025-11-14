---
title: "克隆与推送"
weight: 2
bookToc: true
---

# 克隆与推送

学习如何从远程仓库获取代码（克隆），以及如何将本地更改发送到远程仓库（推送）。

## git clone 深入

**`git clone`** 是从远程仓库获取完整项目副本的命令。

### 基本用法

```bash
# 基本克隆
git clone <远程仓库URL>

# 克隆到指定目录
git clone <远程仓库URL> <目录名>

# 示例
git clone https://github.com/torvalds/linux.git
git clone https://github.com/user/repo.git my-project
```

### clone 做了什么

执行 `git clone` 时，Git 会：

```
步骤 1：创建目录
  └─ 创建项目目录

步骤 2：初始化本地仓库
  └─ git init

步骤 3：添加远程仓库
  └─ git remote add origin <URL>

步骤 4：下载所有数据
  └─ 获取所有提交、分支、标签

步骤 5：检出默认分支
  └─ git checkout main/master

步骤 6：设置跟踪关系
  └─ 本地分支跟踪远程分支
```

**实际示例**：
```bash
# 克隆仓库
git clone https://github.com/user/hello-world.git

# 等同于：
mkdir hello-world
cd hello-world
git init
git remote add origin https://github.com/user/hello-world.git
git fetch origin
git checkout -b main origin/main
```

{{< hint info >}}
**完整副本**

克隆后，你得到的是：
- ✅ 完整的项目历史
- ✅ 所有分支和标签
- ✅ 完整的提交记录
- ✅ 所有文件的所有版本

这就是 Git 分布式的体现！
{{< /hint >}}

### clone 选项

#### 1. 克隆特定分支

```bash
# 只克隆指定分支
git clone -b <分支名> <URL>

# 示例
git clone -b develop https://github.com/user/repo.git

# 也可以克隆标签
git clone -b v1.0.0 https://github.com/user/repo.git
```

#### 2. 浅克隆（Shallow Clone）

```bash
# 只克隆最近的 N 次提交
git clone --depth <深度> <URL>

# 示例：只克隆最近 1 次提交
git clone --depth 1 https://github.com/torvalds/linux.git
```

**浅克隆对比**：
```
完整克隆：
  C1 ← C2 ← C3 ← C4 ← C5 ← C6 ← C7 ← C8 ← C9 ← C10
  └─────────────── 全部历史 ──────────────┘
  大小：~500 MB

浅克隆（depth=1）：
                                        C10
                                         ↑
                                    只有最新提交
  大小：~50 MB
```

**使用场景**：
```bash
✅ 适合浅克隆：
- CI/CD 构建（只需要最新代码）
- 快速查看项目
- 磁盘空间有限
- 网络带宽有限

❌ 不适合浅克隆：
- 需要完整历史
- 需要切换到旧提交
- 需要查看完整日志
```

#### 3. 单分支克隆

```bash
# 只克隆单个分支
git clone --single-branch --branch <分支名> <URL>

# 示例
git clone --single-branch --branch main https://github.com/user/repo.git
```

**对比**：
```
完整克隆：
  origin/main
  origin/develop
  origin/feature-a
  origin/feature-b
  └─ 所有分支

单分支克隆：
  origin/main
  └─ 只有 main 分支
```

#### 4. 镜像克隆

```bash
# 创建裸仓库镜像（用于服务器）
git clone --mirror <URL>

# 创建裸仓库（不含工作目录）
git clone --bare <URL>
```

**用途**：
```bash
# 用于创建备份或镜像服务器
git clone --mirror https://github.com/user/repo.git
cd repo.git
git remote set-url --push origin https://backup-server/repo.git

# 定期同步
git fetch -p origin
git push --mirror
```

#### 5. 递归克隆子模块

```bash
# 同时克隆子模块
git clone --recurse-submodules <URL>

# 示例
git clone --recurse-submodules https://github.com/user/project-with-submodules.git
```

### 克隆后的仓库结构

```bash
# 克隆后查看
git clone https://github.com/user/repo.git
cd repo

# 查看远程仓库
git remote -v
# 输出：
# origin  https://github.com/user/repo.git (fetch)
# origin  https://github.com/user/repo.git (push)

# 查看分支
git branch -a
# 输出：
# * main                    # 本地分支（当前）
#   remotes/origin/HEAD -> origin/main
#   remotes/origin/main     # 远程分支
#   remotes/origin/develop  # 远程分支

# 查看分支跟踪关系
git branch -vv
# 输出：
# * main 7a8b9c0 [origin/main] Latest commit
```

**目录结构**：
```
repo/
├── .git/              # Git 仓库数据
│   ├── config         # 仓库配置（包含远程仓库信息）
│   ├── refs/
│   │   ├── heads/     # 本地分支
│   │   └── remotes/   # 远程分支
│   │       └── origin/
│   │           ├── main
│   │           └── develop
│   └── ...
├── README.md          # 项目文件
├── src/
└── ...
```

## git remote 管理

**`git remote`** 命令用于管理远程仓库。

### 查看远程仓库

```bash
# 列出远程仓库
git remote
# 输出：
# origin

# 显示详细信息（URL）
git remote -v
# 输出：
# origin  https://github.com/user/repo.git (fetch)
# origin  https://github.com/user/repo.git (push)

# 查看远程仓库详细信息
git remote show origin
```

**`git remote show` 输出示例**：
```
* remote origin
  Fetch URL: https://github.com/user/repo.git
  Push  URL: https://github.com/user/repo.git
  HEAD branch: main
  Remote branches:
    main    tracked
    develop tracked
  Local branch configured for 'git pull':
    main merges with remote main
  Local ref configured for 'git push':
    main pushes to main (up to date)
```

### 添加远程仓库

```bash
# 添加远程仓库
git remote add <名称> <URL>

# 示例
git remote add origin https://github.com/user/repo.git
git remote add backup https://gitee.com/user/repo.git
git remote add upstream https://github.com/original/repo.git
```

**使用场景**：

**场景 1：本地项目推送到远程**
```bash
# 1. 创建本地项目
mkdir my-project
cd my-project
git init

# 2. 在 GitHub 创建仓库（网页操作）

# 3. 关联远程仓库
git remote add origin https://github.com/user/my-project.git

# 4. 推送代码
git add .
git commit -m "Initial commit"
git push -u origin main
```

**场景 2：Fork 工作流**
```bash
# 1. Fork 别人的项目（网页操作）

# 2. 克隆你的 Fork
git clone https://github.com/yourname/repo.git
cd repo

# 3. 添加上游仓库
git remote add upstream https://github.com/original/repo.git

# 4. 查看远程仓库
git remote -v
# origin    https://github.com/yourname/repo.git (fetch)
# origin    https://github.com/yourname/repo.git (push)
# upstream  https://github.com/original/repo.git (fetch)
# upstream  https://github.com/original/repo.git (push)
```

### 重命名远程仓库

```bash
# 重命名
git remote rename <旧名称> <新名称>

# 示例
git remote rename origin github
git remote -v
# github  https://github.com/user/repo.git (fetch)
# github  https://github.com/user/repo.git (push)
```

### 修改远程仓库 URL

```bash
# 修改 URL
git remote set-url <名称> <新URL>

# 示例：从 HTTPS 切换到 SSH
git remote set-url origin git@github.com:user/repo.git

# 示例：修改到新的仓库地址
git remote set-url origin https://new-server.com/user/repo.git
```

**常见场景**：
```bash
# 1. HTTPS → SSH
git remote set-url origin git@github.com:user/repo.git

# 2. SSH → HTTPS
git remote set-url origin https://github.com/user/repo.git

# 3. 更换托管平台
git remote set-url origin https://gitee.com/user/repo.git

# 4. 更新用户名
git remote set-url origin https://github.com/newname/repo.git
```

### 删除远程仓库

```bash
# 删除远程仓库引用
git remote remove <名称>
# 或
git remote rm <名称>

# 示例
git remote remove backup
```

{{< hint warning >}}
**注意**

`git remote remove` 只是删除本地的远程仓库引用，不会删除远程服务器上的仓库。

远程服务器上的仓库需要在平台网页上删除。
{{< /hint >}}

### 修剪远程分支引用

```bash
# 删除已经不存在的远程分支引用
git remote prune origin

# 或在 fetch 时自动修剪
git fetch --prune origin
# 简写
git fetch -p origin
```

**场景**：
```bash
# 问题：远程分支已删除，但本地还有引用
git branch -a
# * main
#   remotes/origin/main
#   remotes/origin/old-feature    # 这个分支在远程已删除

# 修剪
git remote prune origin

# 再次查看
git branch -a
# * main
#   remotes/origin/main           # old-feature 引用已删除
```

## git push 详解

**`git push`** 将本地提交推送到远程仓库。

### 基本用法

```bash
# 推送到远程仓库
git push <远程仓库> <分支>

# 示例
git push origin main
git push origin feature-branch

# 推送所有分支
git push origin --all
```

### push 的工作原理

```
本地仓库                     远程仓库
main: C1 ← C2 ← C3 ← C4     main: C1 ← C2
              ↑
          新提交 C3, C4

执行：git push origin main
              ↓
本地仓库                     远程仓库
main: C1 ← C2 ← C3 ← C4     main: C1 ← C2 ← C3 ← C4
                                              ↑
                                          推送成功
```

### 首次推送

```bash
# -u 参数设置上游分支（upstream）
git push -u origin main

# 等同于
git push --set-upstream origin main
```

**设置上游分支后**：
```bash
# 第一次推送
git push -u origin main

# 之后可以简化为
git push    # 自动推送到 origin/main
git pull    # 自动从 origin/main 拉取
```

**跟踪关系**：
```
本地 main 分支                远程 origin/main 分支
      ↓                              ↑
   设置跟踪关系（-u）
      ↓                              ↑
   git push/pull 自动知道推送/拉取到哪里
```

### 推送选项

#### 1. 强制推送

```bash
# 强制推送（危险！）
git push -f origin main
# 或
git push --force origin main

# 更安全的强制推送
git push --force-with-lease origin main
```

**危险示例**：
```
远程：C1 ← C2 ← C3 ← C4
本地：C1 ← C2 ← C5

# 普通 push 会失败（历史不一致）
git push origin main
# 错误：Updates were rejected

# 强制推送会覆盖远程历史（危险！）
git push -f origin main

# 结果：
远程：C1 ← C2 ← C5  # C3, C4 丢失了！
```

{{< hint danger >}}
**强制推送警告**

- ❌ **永远不要**强制推送到共享分支（main、develop）
- ❌ 会丢失其他人的提交
- ❌ 会破坏团队协作
- ✅ 只在自己的分支上使用
- ✅ 使用 `--force-with-lease` 更安全
{{< /hint >}}

**`--force-with-lease` 的安全性**：
```bash
# 场景：你和同事都在开发 feature 分支

# 同事推送了提交
# 远程：C1 ← C2 ← C3

# 你本地 rebase 后
# 本地：C1 ← C2' ← C3'

# 使用 --force-with-lease
git push --force-with-lease origin feature

# 如果远程有新提交（你不知道的），push 会失败
# 这保护了同事的工作
```

#### 2. 推送标签

```bash
# 推送单个标签
git push origin <标签名>
git push origin v1.0.0

# 推送所有标签
git push origin --tags

# 推送代码和标签
git push origin main --tags
```

#### 3. 删除远程分支

```bash
# 删除远程分支
git push origin --delete <分支名>
git push origin -d <分支名>

# 示例
git push origin --delete feature-old

# 旧语法（仍然有效）
git push origin :feature-old
```

**完整流程**：
```bash
# 1. 删除本地分支
git branch -d feature-completed

# 2. 删除远程分支
git push origin --delete feature-completed

# 3. 其他人更新远程分支列表
git fetch --prune
```

#### 4. 推送到不同的远程分支

```bash
# 语法
git push <远程仓库> <本地分支>:<远程分支>

# 示例：本地 main 推送到远程 develop
git push origin main:develop

# 示例：本地 feature 推送到远程 feature-new
git push origin feature:feature-new
```

### 推送冲突处理

**场景**：远程有新提交，本地也有新提交

```bash
# 推送失败
git push origin main
# 错误：
# ! [rejected]        main -> main (non-fast-forward)
# error: failed to push some refs to 'origin'
# hint: Updates were rejected because the remote contains work that you do
# hint: not have locally.
```

**解决方案 1：先拉取再推送**
```bash
# 1. 拉取远程更改
git pull origin main

# 2. 解决冲突（如果有）
# ... 解决冲突 ...
git add .
git commit

# 3. 推送
git push origin main
```

**解决方案 2：使用 rebase**
```bash
# 1. 使用 rebase 拉取
git pull --rebase origin main

# 2. 解决冲突（如果有）
# ... 解决冲突 ...
git add .
git rebase --continue

# 3. 推送
git push origin main
```

**对比**：
```
方案 1：merge
远程：A ← B ← C
本地：A ← B ← D

拉取后：
  A ← B ← C
       ↘   ↘
        D ← M (merge commit)

方案 2：rebase
远程：A ← B ← C
本地：A ← B ← D

rebase 后：
  A ← B ← C ← D' (更简洁的历史)
```

## 推送分支和标签

### 推送新分支

```bash
# 创建并切换到新分支
git checkout -b feature/new-feature

# 开发并提交
echo "New feature" > feature.txt
git add feature.txt
git commit -m "Add new feature"

# 推送新分支到远程
git push -u origin feature/new-feature
```

**首次推送新分支**：
```bash
# 推送并设置跟踪
git push -u origin feature/new-feature

# 以后就可以简化
git push
git pull
```

### 推送并创建不同名称的远程分支

```bash
# 本地分支：feature-local
# 远程分支：feature-remote
git push -u origin feature-local:feature-remote

# 查看跟踪关系
git branch -vv
# feature-local abc123 [origin/feature-remote] Latest commit
```

### 管理标签

**创建标签**：
```bash
# 轻量标签
git tag v1.0.0

# 附注标签（推荐）
git tag -a v1.0.0 -m "Release version 1.0.0"

# 查看标签
git tag
# v1.0.0
# v1.1.0

# 查看标签详情
git show v1.0.0
```

**推送标签**：
```bash
# 推送单个标签
git push origin v1.0.0

# 推送所有标签
git push origin --tags

# 推送代码和标签
git push origin main && git push origin --tags
```

**删除标签**：
```bash
# 删除本地标签
git tag -d v1.0.0

# 删除远程标签
git push origin --delete v1.0.0
# 或
git push origin :refs/tags/v1.0.0
```

### 批量操作

```bash
# 推送所有分支
git push origin --all

# 推送所有标签
git push origin --tags

# 推送所有分支和标签
git push origin --all && git push origin --tags

# 强制推送所有分支（危险！）
git push origin --all --force
```

## 推送策略配置

### 配置默认推送行为

```bash
# 查看当前配置
git config --get push.default

# 设置推送策略
git config --global push.default <策略>
```

**推送策略选项**：

| 策略 | 行为 | 说明 |
|------|------|------|
| **simple** | 推送当前分支到同名远程分支 | 默认（推荐） |
| **current** | 推送当前分支到同名远程分支 | 即使没设置上游 |
| **upstream** | 推送到上游分支 | 可能名称不同 |
| **matching** | 推送所有同名分支 | 旧版默认（不推荐） |
| **nothing** | 不自动推送 | 必须明确指定 |

**推荐配置**：
```bash
# 设置为 simple（现代 Git 的默认值）
git config --global push.default simple

# 设置自动设置上游分支
git config --global push.autoSetupRemote true
```

### 配置自动修剪

```bash
# fetch 时自动修剪已删除的远程分支
git config --global fetch.prune true

# pull 时自动修剪
git config --global remote.origin.prune true
```

## 实战示例

### 场景 1：克隆项目并开始开发

```bash
# 1. 克隆项目
git clone https://github.com/company/project.git
cd project

# 2. 创建开发分支
git checkout -b feature/user-login

# 3. 开发功能
# ... 编写代码 ...
git add src/login.js
git commit -m "Implement user login"

# 4. 推送分支
git push -u origin feature/user-login

# 5. 继续开发
# ... 更多代码 ...
git add .
git commit -m "Add login validation"

# 6. 推送更新（已设置上游，可简化）
git push
```

### 场景 2：多个远程仓库

```bash
# 1. 克隆主仓库
git clone https://github.com/user/repo.git
cd repo

# 2. 添加备份仓库
git remote add backup https://gitee.com/user/repo.git

# 3. 添加部署仓库
git remote add production https://prod-server.com/repo.git

# 4. 查看所有远程仓库
git remote -v
# origin      https://github.com/user/repo.git (fetch)
# origin      https://github.com/user/repo.git (push)
# backup      https://gitee.com/user/repo.git (fetch)
# backup      https://gitee.com/user/repo.git (push)
# production  https://prod-server.com/repo.git (fetch)
# production  https://prod-server.com/repo.git (push)

# 5. 推送到不同仓库
git push origin main        # 推送到 GitHub
git push backup main        # 推送到 Gitee（备份）
git push production v1.0.0  # 推送标签到生产环境
```

### 场景 3：从零开始推送项目

```bash
# 1. 创建本地项目
mkdir my-awesome-project
cd my-awesome-project
git init

# 2. 创建文件并提交
echo "# My Awesome Project" > README.md
echo "console.log('Hello');" > index.js
git add .
git commit -m "Initial commit"

# 3. 在 GitHub 创建空仓库（网页操作）
# 不要初始化 README、.gitignore 或 LICENSE

# 4. 关联远程仓库
git remote add origin https://github.com/user/my-awesome-project.git

# 5. 推送代码
git push -u origin main

# 6. 推送标签
git tag -a v0.1.0 -m "Initial release"
git push origin v0.1.0
```

### 场景 4：Fork 项目并贡献代码

```bash
# 1. Fork 项目（GitHub 网页操作）

# 2. 克隆你的 Fork
git clone https://github.com/yourname/project.git
cd project

# 3. 添加上游仓库
git remote add upstream https://github.com/original/project.git

# 4. 创建功能分支
git checkout -b feature/improve-docs

# 5. 修改并提交
# ... 编辑文件 ...
git add docs/
git commit -m "Improve documentation"

# 6. 推送到你的 Fork
git push -u origin feature/improve-docs

# 7. 在 GitHub 创建 Pull Request

# 8. 同步上游更新
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

## 常见问题和解决方案

### 问题 1：推送被拒绝

```bash
# 错误信息
$ git push origin main
To https://github.com/user/repo.git
 ! [rejected]        main -> main (non-fast-forward)
error: failed to push some refs to 'https://github.com/user/repo.git'
```

**原因**：远程有新提交，本地没有

**解决方案**：
```bash
# 方案 1：拉取并合并
git pull origin main
git push origin main

# 方案 2：拉取并 rebase
git pull --rebase origin main
git push origin main
```

### 问题 2：认证失败

```bash
# HTTPS 认证失败
remote: Invalid username or password.
fatal: Authentication failed
```

**解决方案**：
```bash
# GitHub 已禁用密码认证，使用 Personal Access Token

# 1. 生成 Token（GitHub 网页）
# Settings → Developer settings → Personal access tokens

# 2. 使用 Token 作为密码
# 或配置凭据管理器

# 3. 或切换到 SSH
git remote set-url origin git@github.com:user/repo.git
```

### 问题 3：推送速度慢

```bash
# 大文件或大量提交导致推送缓慢
```

**解决方案**：
```bash
# 1. 使用浅克隆
git clone --depth 1 https://github.com/user/repo.git

# 2. 使用 SSH 替代 HTTPS
git remote set-url origin git@github.com:user/repo.git

# 3. 增加缓冲区
git config --global http.postBuffer 524288000  # 500 MB

# 4. 使用更快的网络或 VPN
```

### 问题 4：误推送敏感信息

```bash
# 误将密码、密钥推送到远程
```

**解决方案**：
```bash
# 立即采取行动！

# 1. 删除本地敏感文件
git rm config/secrets.yml
git commit -m "Remove secrets"

# 2. 强制推送（如果是私有仓库且无人拉取）
git push -f origin main

# 3. 如果已被拉取，必须重写历史
git filter-branch --index-filter \
  'git rm --cached --ignore-unmatch config/secrets.yml' HEAD

# 4. 或使用 BFG Repo-Cleaner（更快）
bfg --delete-files secrets.yml

# 5. 强制推送
git push -f origin --all

# 6. 立即更改泄露的密码/密钥
```

{{< hint danger >}}
**重要**

如果敏感信息已推送到公开仓库：
1. ⚠️ 立即更改所有泄露的凭据
2. ⚠️ 通知安全团队
3. ⚠️ 历史记录永远存在（即使删除）
4. ⚠️ 可能需要删除并重建仓库
{{< /hint >}}

## 下一步

学习了克隆和推送后,接下来学习如何拉取和获取远程更新。

下一节：[拉取与获取](../pull-fetch/) →

---

## 💡 练习题

{{< expand "练习 1：理解 clone 的深度" >}}
**问题**：以下两个命令的区别是什么？

```bash
# 命令 A
git clone https://github.com/user/repo.git

# 命令 B
git clone --depth 1 https://github.com/user/repo.git
```

什么时候应该使用命令 B？

{{< expand "查看答案" >}}
**答案**：

**命令 A：完整克隆**
```bash
git clone https://github.com/user/repo.git

特点：
✅ 包含完整历史（所有提交）
✅ 可以切换到任何提交
✅ 可以查看完整日志
✅ 可以切换到所有分支
❌ 下载时间长
❌ 占用空间大

适用场景：
- 长期开发
- 需要完整历史
- 需要切换分支
- 本地主要开发环境
```

**命令 B：浅克隆（depth=1）**
```bash
git clone --depth 1 https://github.com/user/repo.git

特点：
✅ 只包含最近 1 次提交
✅ 下载速度快
✅ 占用空间小
❌ 没有历史记录
❌ 不能切换到旧提交
❌ git log 只显示 1 次提交

适用场景：
- CI/CD 构建（只需要最新代码）
- 快速查看项目
- 磁盘空间有限
- 网络带宽有限
- 一次性使用
```

**实际对比**：
```bash
# Linux 内核仓库

# 完整克隆
git clone https://github.com/torvalds/linux.git
# 大小：~3.5 GB
# 时间：~30 分钟（取决于网络）

# 浅克隆
git clone --depth 1 https://github.com/torvalds/linux.git
# 大小：~300 MB
# 时间：~3 分钟
```

**转换为完整仓库**：
```bash
# 如果后来需要完整历史
git fetch --unshallow
# 或
git fetch --depth=100  # 获取更多历史
```

**最佳实践**：
```yaml
# CI/CD 配置（GitHub Actions）
steps:
  - uses: actions/checkout@v2
    with:
      fetch-depth: 1  # 使用浅克隆加速构建

# 开发环境
git clone https://github.com/user/repo.git  # 使用完整克隆
```
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 2：推送冲突解决" >}}
**问题**：遇到以下情况应该如何处理？

```bash
$ git push origin main
To https://github.com/user/repo.git
 ! [rejected]        main -> main (fetch first)
error: failed to push some refs
hint: Updates were rejected because the remote contains work that you do
hint: not have locally. This is usually caused by another repository pushing
hint: to the same ref.
```

提供两种解决方案并说明区别。

{{< expand "查看答案" >}}
**答案**：

**场景分析**：
```
远程仓库（origin/main）：
  A ← B ← C ← D ← E
              ↑
         同事推送的 E

本地仓库（main）：
  A ← B ← C ← D ← F
              ↑
         你的提交 F

冲突原因：
- 远程有新提交 E（你本地没有）
- 本地有新提交 F（远程没有）
- 历史出现分叉
```

**解决方案 1：merge（合并）**
```bash
# 1. 拉取远程更改
git pull origin main
# 或
git fetch origin
git merge origin/main

# 2. Git 自动创建合并提交（如果无冲突）
# 或手动解决冲突
# ... 解决冲突 ...
git add .
git commit  # 完成合并

# 3. 推送
git push origin main

# 结果：
#   A ← B ← C ← D ← E ← M
#                ↘     ↗
#                  F
# 其中 M 是合并提交
```

**解决方案 2：rebase（变基）**
```bash
# 1. 使用 rebase 拉取
git pull --rebase origin main
# 或
git fetch origin
git rebase origin/main

# 2. 解决冲突（如果有）
# ... 解决冲突 ...
git add .
git rebase --continue

# 3. 推送
git push origin main

# 结果：
#   A ← B ← C ← D ← E ← F'
# F' 是 F 的副本，应用在 E 之后
```

**两种方案对比**：

| 特性 | merge | rebase |
|------|-------|--------|
| **历史记录** | 保留分叉，有合并提交 | 线性历史，无合并提交 |
| **提交图** | 可能复杂 | 简洁清晰 |
| **提交哈希** | 不变 | 会改变 |
| **冲突解决** | 一次性解决所有冲突 | 可能多次解决冲突 |
| **适用场景** | 公共分支 | 私有分支 |
| **团队协作** | 保留完整历史 | 保持历史整洁 |

**推荐实践**：
```bash
# 公共分支（main、develop）：使用 merge
git pull origin main
git push origin main

# 私有功能分支：使用 rebase
git pull --rebase origin feature-branch
git push origin feature-branch

# 配置默认行为
git config pull.rebase true  # 默认使用 rebase
```

**图解对比**：
```
初始状态：
远程：A ← B ← C ← D ← E
本地：A ← B ← C ← D ← F

使用 merge 后：
      A ← B ← C ← D ← E
                   ↘   ↘
                     F ← M (merge commit)

使用 rebase 后：
      A ← B ← C ← D ← E ← F'
      (简洁的线性历史)
```

**何时使用哪种方案**：

✅ **使用 merge**：
- 在共享的主分支上（main、develop）
- 想保留完整的历史记录
- 团队成员都熟悉 merge
- 不想改变提交哈希

✅ **使用 rebase**：
- 在个人功能分支上
- 想要简洁的线性历史
- 准备提交 Pull Request 前
- 已经熟悉 rebase 的工作原理

**配置建议**：
```bash
# 设置 pull 时默认使用 rebase
git config --global pull.rebase true

# 或只对当前仓库设置
git config pull.rebase true

# 保留本地的合并提交
git config --global pull.rebase merges
```
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 3：远程仓库管理" >}}
**问题**：Fork 了一个开源项目，如何配置远程仓库才能：
1. 推送到你的 Fork
2. 从原始项目拉取更新
3. 保持你的 Fork 同步

写出完整的命令序列。

{{< expand "查看答案" >}}
**答案**：

**完整工作流程**：

**步骤 1：Fork 项目**
```
在 GitHub 网页上：
1. 访问原始项目：https://github.com/original/project
2. 点击右上角的 "Fork" 按钮
3. Fork 到你的账号：https://github.com/yourname/project
```

**步骤 2：克隆你的 Fork**
```bash
# 克隆你的 Fork（不是原始项目）
git clone https://github.com/yourname/project.git
cd project

# 查看远程仓库
git remote -v
# origin  https://github.com/yourname/project.git (fetch)
# origin  https://github.com/yourname/project.git (push)
```

**步骤 3：添加上游仓库**
```bash
# 添加原始项目作为 upstream
git remote add upstream https://github.com/original/project.git

# 查看所有远程仓库
git remote -v
# origin    https://github.com/yourname/project.git (fetch)
# origin    https://github.com/yourname/project.git (push)
# upstream  https://github.com/original/project.git (fetch)
# upstream  https://github.com/original/project.git (push)
```

**架构图**：
```
                upstream
           (原始项目仓库)
      github.com/original/project
                ↓ fork
                ↓
              origin
           (你的 Fork)
      github.com/yourname/project
                ↓ clone
                ↓
              local
          (你的本地仓库)
```

**步骤 4：开发新功能**
```bash
# 1. 确保在最新的 main 分支
git checkout main
git pull upstream main

# 2. 创建功能分支
git checkout -b feature/add-awesome-feature

# 3. 开发功能
# ... 编写代码 ...
git add .
git commit -m "Add awesome feature"

# 4. 推送到你的 Fork
git push -u origin feature/add-awesome-feature
```

**步骤 5：保持同步**
```bash
# 定期从上游拉取更新
git checkout main
git fetch upstream
git merge upstream/main
# 或使用 rebase
git rebase upstream/main

# 更新你的 Fork
git push origin main
```

**步骤 6：创建 Pull Request**
```
在 GitHub 网页上：
1. 访问你的 Fork
2. 点击 "Compare & pull request"
3. 填写 PR 描述
4. 提交 Pull Request
```

**步骤 7：PR 被合并后的清理**
```bash
# 1. 更新本地 main
git checkout main
git pull upstream main

# 2. 更新 Fork
git push origin main

# 3. 删除功能分支
git branch -d feature/add-awesome-feature
git push origin --delete feature/add-awesome-feature
```

**完整工作流程脚本**：
```bash
#!/bin/bash
# sync-fork.sh - 同步 Fork 的脚本

# 1. 切换到 main 分支
git checkout main

# 2. 从上游拉取最新更改
git fetch upstream

# 3. 合并上游更改
git merge upstream/main

# 4. 推送到你的 Fork
git push origin main

echo "Fork 已同步！"
```

**使用别名简化操作**：
```bash
# 配置别名
git config --global alias.sync-fork '!git checkout main && git fetch upstream && git merge upstream/main && git push origin main'

# 使用
git sync-fork
```

**日常开发流程**：
```bash
# 每天开始工作前
git checkout main
git pull upstream main     # 获取上游最新代码

# 创建功能分支
git checkout -b feature/my-feature

# 开发
# ...

# 提交到 Fork
git push -u origin feature/my-feature

# 如果上游有更新，同步到功能分支
git fetch upstream
git rebase upstream/main

# 更新 Fork 的功能分支
git push -f origin feature/my-feature
```

**多个上游仓库**：
```bash
# 有时可能需要跟踪多个上游

# 原始官方仓库
git remote add upstream https://github.com/official/project.git

# 另一个活跃的 Fork
git remote add upstream2 https://github.com/active-fork/project.git

# 从不同上游拉取
git fetch upstream
git fetch upstream2

# 选择性合并
git merge upstream/main
# 或
git cherry-pick upstream2/feature-x
```

**检查状态**：
```bash
# 查看远程仓库配置
git remote -v

# 查看分支跟踪情况
git branch -vv

# 查看远程分支
git branch -r

# 查看上游的变化
git fetch upstream
git log --oneline --graph main..upstream/main
```
{{< /expand >}}
{{< /expand >}}

---

{{< hint success >}}
**检查清单** - 完成本节后，你应该能够：

- [ ] 使用 git clone 克隆远程仓库
- [ ] 理解克隆的不同选项（depth、branch 等）
- [ ] 使用 git remote 管理远程仓库
- [ ] 添加、删除、重命名远程仓库
- [ ] 使用 git push 推送代码
- [ ] 理解 -u 参数设置上游分支
- [ ] 推送和删除远程分支
- [ ] 推送和管理标签
- [ ] 处理推送冲突
- [ ] 理解强制推送的风险
- [ ] 配置多个远程仓库
- [ ] 管理 Fork 工作流
{{< /hint >}}
