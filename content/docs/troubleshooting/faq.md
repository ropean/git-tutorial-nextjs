---
title: "常见问题"
weight: 5
bookToc: true
---

# 常见问题

本章收集了 Git 使用过程中最常见的问题和详细解答。

## Git 基础问题

### Q1: Git 和 GitHub 有什么区别？

**A:** 这是最常见的混淆：

- **Git** 是一个分布式版本控制系统（软件工具）
  - 由 Linus Torvalds 于 2005 年创建
  - 安装在本地计算机上
  - 命令行工具（也有 GUI）
  - 开源且免费

- **GitHub** 是一个代码托管平台（网站服务）
  - 基于 Git 提供托管服务
  - 添加了协作功能（Issues、Pull Requests 等）
  - 提供免费和付费计划
  - 类似服务：GitLab、Bitbucket

**类比**：Git 像是邮件协议（SMTP），GitHub 像是 Gmail。

```bash
# Git 是工具
git init
git commit -m "message"

# GitHub 是服务
git push github main  # 推送到 GitHub
```

### Q2: 什么时候应该提交（commit）？

**A:** 提交的最佳实践：

**应该提交的时机**：
- 完成一个逻辑单元的工作
- 修复一个 bug
- 添加一个功能
- 代码可以通过测试
- 达到一个稳定状态

**提交频率建议**：
```bash
# ✅ 好的提交习惯
git commit -m "Add user authentication"
git commit -m "Fix login button alignment"
git commit -m "Update documentation for API"

# ❌ 不好的提交习惯
# 提交太少
git commit -m "All changes from last week"

# 提交太频繁
git commit -m "Add semicolon"
git commit -m "Fix typo"
git commit -m "Another typo"
```

**原则**：
1. **原子性**：每个提交应该是一个完整的逻辑单元
2. **可逆性**：可以安全地回退这个提交
3. **可读性**：提交信息清晰描述了做了什么

### Q3: .git 目录是什么？可以删除吗？

**A:** `.git` 目录是 Git 仓库的核心：

**内容**：
```bash
.git/
├── objects/      # 所有文件内容和提交
├── refs/         # 分支和标签引用
├── HEAD          # 当前分支指针
├── config        # 仓库配置
├── index         # 暂存区
└── logs/         # 操作日志（reflog）
```

**删除后果**：
```bash
# ⚠️ 删除 .git 会：
rm -rf .git

# - 失去所有历史记录
# - 失去所有分支
# - 失去所有提交
# - 仓库变成普通目录
# - 无法使用任何 Git 命令

# 如果想重新开始：
git init  # 创建全新的仓库（历史丢失）
```

**何时删除**：
- 想将 Git 仓库转换为普通目录
- 重新初始化仓库
- **但要确保**：已备份或不需要历史

### Q4: 如何撤销 git add？

**A:** 取消暂存有多种方法：

```bash
# 方法 1：使用 git restore（推荐，Git 2.23+）
git restore --staged <file>
git restore --staged .  # 取消所有暂存

# 方法 2：使用 git reset（传统方法）
git reset HEAD <file>
git reset HEAD  # 取消所有暂存

# 方法 3：使用 git rm --cached（首次添加的文件）
git rm --cached <file>

# 实例
echo "content" > file.txt
git add file.txt

# 取消暂存
git restore --staged file.txt

git status
# Untracked files:
#   file.txt
```

**区别**：
- `git restore --staged` - 现代命令，语义清晰
- `git reset HEAD` - 传统命令，但可能混淆
- 两者都不会删除文件内容

### Q5: HEAD、工作区、暂存区是什么关系？

**A:** 这是 Git 的三个核心概念：

```
┌─────────────────────────────────────────────────────────┐
│                      工作区 (Working Directory)          │
│  你能看到和编辑的文件                                      │
│  ├── file1.txt                                          │
│  ├── file2.txt                                          │
│  └── file3.txt                                          │
└─────────────────────────────────────────────────────────┘
                        ↓ git add
┌─────────────────────────────────────────────────────────┐
│                    暂存区 (Staging Area/Index)           │
│  准备提交的文件快照                                        │
│  存储在 .git/index                                       │
└─────────────────────────────────────────────────────────┘
                        ↓ git commit
┌─────────────────────────────────────────────────────────┐
│                   仓库 (Repository)                      │
│  提交历史，存储在 .git/objects                            │
│  HEAD → main → 最新提交                                  │
└─────────────────────────────────────────────────────────┘
```

**文件的生命周期**：
```bash
# 1. 创建文件（工作区）
echo "hello" > file.txt
git status  # Untracked files

# 2. 添加到暂存区
git add file.txt
git status  # Changes to be committed

# 3. 提交到仓库
git commit -m "Add file"
git status  # nothing to commit, working tree clean

# 4. 修改文件（工作区）
echo "world" >> file.txt
git status  # Changes not staged for commit

# 5. 再次添加到暂存区
git add file.txt
git status  # Changes to be committed
```

**HEAD**：
- 指向当前分支的最新提交
- 像是一个"你在这里"的指针

```bash
# 查看 HEAD
cat .git/HEAD
# ref: refs/heads/main

cat .git/refs/heads/main
# abc1234... (提交哈希)
```

## 分支和合并问题

### Q6: 为什么我的分支显示"已同步"但无法删除？

**A:** 这通常涉及本地分支和远程分支的关系：

```bash
# 场景
git branch
# * main
#   feature
#   old-feature

# 尝试删除
git branch -d old-feature
# error: The branch 'old-feature' is not fully merged.

# 原因 1：分支未合并到当前分支
git log main..old-feature  # 查看未合并的提交

# 解决方案 1：先合并
git checkout main
git merge old-feature
git branch -d old-feature

# 解决方案 2：强制删除（确认不需要这些提交）
git branch -D old-feature

# 原因 2：分支已合并到远程但未同步到本地
git fetch origin
git branch -d old-feature
```

### Q7: merge 和 rebase 有什么区别？什么时候用哪个？

**A:** 这是 Git 中最重要的问题之一：

**git merge** - 保留历史：
```bash
# 在 main 分支
git merge feature

# 结果：
#     A---B---C (main)
#          \
#           D---E---F (feature)
#                    \
#                     M (merge commit)

# 优点：
# - 保留完整历史
# - 安全，不改写历史
# - 清晰显示分支合并点

# 缺点：
# - 历史图可能复杂
# - 多余的合并提交
```

**git rebase** - 线性历史：
```bash
# 在 feature 分支
git rebase main

# 结果：
#     A---B---C (main)
#              \
#               D'---E'---F' (feature)

# 优点：
# - 历史线性、整洁
# - 没有合并提交
# - 易于理解

# 缺点：
# - 改写历史（危险）
# - 可能需要解决多次冲突
```

**使用建议**：

| 场景 | 使用 | 原因 |
|------|------|------|
| 更新功能分支 | `rebase` | 保持历史整洁 |
| 合并到主分支 | `merge` | 保留分支历史 |
| 公共分支 | `merge` | 不改写历史 |
| 本地分支 | `rebase` | 整理提交 |
| 已推送的提交 | `merge` | 安全 |
| 团队协作 | `merge` | 避免混乱 |

```bash
# 推荐工作流
# 1. 在功能分支工作
git checkout -b feature
# ... 做一些提交

# 2. 定期从 main 获取更新（使用 rebase）
git fetch origin
git rebase origin/main

# 3. 功能完成，合并到 main（使用 merge）
git checkout main
git merge feature
```

### Q8: 如何解决"拒绝合并无关历史"错误？

**A:** 这通常发生在关联两个独立创建的仓库时：

**错误信息**：
```bash
git pull origin main
# fatal: refusing to merge unrelated histories
```

**原因**：
- 本地仓库和远程仓库独立创建
- 它们没有共同的祖先提交
- Git 默认拒绝合并无关历史

**解决方案**：
```bash
# 方案 1：允许合并无关历史（常用）
git pull origin main --allow-unrelated-histories

# 如果有冲突，解决后提交
git add .
git commit -m "Merge remote repository"

# 方案 2：强制推送（会覆盖远程，危险！）
git push origin main --force

# 方案 3：重新开始
# 删除本地仓库，重新克隆
rm -rf .git
git clone <url> .
```

**正确的初始化流程**：
```bash
# 推荐：先创建远程仓库，然后克隆
git clone https://github.com/user/repo.git
cd repo
# 开始工作

# 如果已有本地仓库：
cd existing-repo
git remote add origin https://github.com/user/repo.git
git fetch origin

# 如果远程有内容，先拉取
git pull origin main --allow-unrelated-histories

# 或推送到空仓库
git push -u origin main
```

### Q9: 为什么我的分支落后于远程很多提交？

**A:** 这涉及本地分支和远程跟踪分支的同步：

**查看状态**：
```bash
git status
# On branch main
# Your branch is behind 'origin/main' by 5 commits, and can be fast-forwarded.

git log --oneline --graph --all
# * abc1234 (origin/main) Latest remote commit
# * def5678 Remote commit 4
# * ...
# * 890abcd (HEAD -> main) Your last commit
```

**原因**：
- 其他人推送了新提交到远程
- 你的本地分支还在旧的提交上

**解决方案**：
```bash
# 方案 1：Fast-forward（没有本地修改）
git pull
# 或
git merge origin/main

# 方案 2：Rebase（有本地修改，保持线性）
git pull --rebase

# 方案 3：Merge（有本地修改，保留历史）
git pull
# 会创建合并提交

# 方案 4：查看差异后决定
git fetch origin
git log main..origin/main  # 查看远程的新提交
git diff main origin/main  # 查看具体差异
git merge origin/main      # 确认后合并
```

## 远程仓库问题

### Q10: 如何更改远程仓库的 URL？

**A:** 有多种场景需要更改远程 URL：

**场景 1：从 HTTPS 切换到 SSH**
```bash
# 查看当前 URL
git remote -v
# origin  https://github.com/user/repo.git (fetch)
# origin  https://github.com/user/repo.git (push)

# 更改为 SSH
git remote set-url origin git@github.com:user/repo.git

# 验证
git remote -v
# origin  git@github.com:user/repo.git (fetch)
# origin  git@github.com:user/repo.git (push)
```

**场景 2：仓库被重命名或移动**
```bash
# 更新 URL
git remote set-url origin https://github.com/user/new-repo-name.git

# 测试
git fetch origin
```

**场景 3：更改托管平台**
```bash
# 从 GitHub 迁移到 GitLab
git remote set-url origin https://gitlab.com/user/repo.git

# 推送
git push -u origin main
```

**场景 4：添加多个远程仓库**
```bash
# 保留 origin，添加 gitlab
git remote add gitlab https://gitlab.com/user/repo.git

# 查看
git remote -v
# origin    https://github.com/user/repo.git (fetch)
# origin    https://github.com/user/repo.git (push)
# gitlab    https://gitlab.com/user/repo.git (fetch)
# gitlab    https://gitlab.com/user/repo.git (push)

# 推送到多个远程
git push origin main
git push gitlab main

# 创建别名同时推送
git remote add all https://github.com/user/repo.git
git remote set-url --add --push all https://github.com/user/repo.git
git remote set-url --add --push all https://gitlab.com/user/repo.git

git push all main  # 同时推送到两个远程
```

### Q11: git pull 和 git fetch 有什么区别？

**A:** 这是理解远程同步的关键：

**git fetch** - 只下载：
```bash
# 下载远程更新，但不合并
git fetch origin

# 查看远程更新
git log --oneline origin/main
git diff main origin/main

# 手动决定是否合并
git merge origin/main
# 或
git rebase origin/main
```

**git pull** - 下载并合并：
```bash
# 等同于 fetch + merge
git pull origin main
# = git fetch origin + git merge origin/main

# 使用 rebase
git pull --rebase origin main
# = git fetch origin + git rebase origin/main
```

**可视化**：
```
初始状态：
Local:  A---B---C (main)
Remote: A---B---C---D---E (origin/main)

执行 git fetch：
Local:  A---B---C (main)
        A---B---C---D---E (origin/main) ← 下载到本地

执行 git merge origin/main：
Local:  A---B---C-------M (main)
                      /
        A---B---C---D---E (origin/main)
```

**使用建议**：
```bash
# 安全的工作流（推荐）
git fetch origin          # 先下载
git log main..origin/main # 查看差异
git diff main origin/main # 查看具体改动
git merge origin/main     # 确认后合并

# 快速工作流
git pull  # 如果你信任远程更改

# 保持线性历史
git pull --rebase
```

### Q12: 如何删除远程分支？

**A:** 删除远程分支的方法：

```bash
# 方法 1：使用 git push（推荐）
git push origin --delete feature-branch

# 方法 2：使用推送空分支
git push origin :feature-branch

# 方法 3：使用 Git 2.8+ 的简写
git push -d origin feature-branch

# 删除本地分支
git branch -d feature-branch

# 清理本地的远程跟踪分支
git fetch --prune
# 或
git remote prune origin
```

**完整清理流程**：
```bash
# 1. 删除远程分支
git push origin --delete old-feature

# 2. 删除本地分支
git branch -d old-feature

# 3. 删除远程跟踪引用
git fetch --prune

# 4. 验证
git branch -a
# 应该看不到 old-feature 了
```

**批量删除**：
```bash
# 删除所有已合并的分支
git branch --merged main | grep -v "main" | xargs git branch -d

# 删除远程已删除的本地跟踪分支
git fetch --prune

# 查看将被删除的分支（dry run）
git remote prune origin --dry-run
```

## 性能问题

### Q13: 为什么 Git 命令越来越慢？

**A:** Git 性能问题通常有几个原因：

**原因 1：仓库太大**
```bash
# 检查仓库大小
du -sh .git

# 查看对象数量
git count-objects -vH

# 解决：垃圾回收
git gc --aggressive --prune=now
```

**原因 2：太多松散对象**
```bash
# 检查松散对象
git count-objects -v

# 输出示例
# count: 5000        ← 太多松散对象！
# size: 20 MB

# 解决：打包对象
git repack -a -d
git gc
```

**原因 3：大文件在历史中**
```bash
# 查找大文件
git rev-list --objects --all | \
  git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | \
  awk '/^blob/ {print substr($0,6)}' | \
  sort -k2 -n -r | \
  head -10

# 解决：移除大文件或使用 Git LFS
git filter-repo --path large-file.bin --invert-paths
```

**原因 4：工作区文件太多**
```bash
# 使用 .gitignore 排除不必要的文件
cat >> .gitignore << 'EOF'
node_modules/
*.log
.DS_Store
EOF

# 清理未跟踪的文件
git clean -fd
```

**性能优化配置**：
```bash
# 启用文件系统缓存（Windows）
git config --global core.fscache true

# 启用并行索引
git config --global feature.manyFiles true

# 使用 split index
git config --global core.splitIndex true

# 启用 commit graph
git config --global core.commitGraph true
git commit-graph write

# 优化 status 性能
git config --global core.untrackedCache true
git config --global core.fsmonitor true
```

### Q14: 克隆大仓库太慢怎么办？

**A:** 有多种方法加速克隆：

**方法 1：浅克隆**
```bash
# 只克隆最近的历史
git clone --depth 1 https://github.com/user/large-repo.git

# 克隆指定深度
git clone --depth 50 https://github.com/user/large-repo.git

# 后续获取完整历史
git fetch --unshallow
```

**方法 2：单分支克隆**
```bash
# 只克隆主分支
git clone --single-branch --branch main https://github.com/user/repo.git

# 后续获取其他分支
git remote set-branches origin '*'
git fetch -v
```

**方法 3：部分克隆（Git 2.19+）**
```bash
# 不下载 blob 对象
git clone --filter=blob:none https://github.com/user/repo.git

# 按大小过滤
git clone --filter=blob:limit=1m https://github.com/user/repo.git
```

**方法 4：组合使用**
```bash
# 最快的克隆方式
git clone \
  --depth 1 \
  --single-branch \
  --branch main \
  --filter=blob:none \
  https://github.com/user/large-repo.git
```

**方法 5：使用代理或镜像**
```bash
# 使用国内镜像（GitHub）
git clone https://github.com.cnpmjs.org/user/repo.git

# 配置代理
git config --global http.proxy http://127.0.0.1:7890
git config --global https.proxy https://127.0.0.1:7890
```

### Q15: 如何减小仓库体积？

**A:** 综合多种策略：

**策略 1：垃圾回收**
```bash
# 基本清理
git gc

# 激进清理
git gc --aggressive --prune=now

# 查看效果
du -sh .git
```

**策略 2：移除大文件**
```bash
# 使用 git filter-repo
git filter-repo --strip-blobs-bigger-than 10M

# 使用 BFG
java -jar bfg.jar --strip-blobs-bigger-than 10M
```

**策略 3：使用 Git LFS**
```bash
# 安装 LFS
git lfs install

# 迁移大文件到 LFS
git lfs migrate import --include="*.zip,*.iso"

# 推送 LFS 对象
git lfs push --all origin
```

**策略 4：shallow clone 的仓库**
```bash
# 如果只需要最近的历史
git clone --depth 1 <url>
```

**完整清理流程**：
```bash
# 1. 备份
cp -r repo repo-backup

# 2. 清理大文件
git filter-repo --strip-blobs-bigger-than 10M

# 3. 清理 reflog
git reflog expire --expire=now --all

# 4. 垃圾回收
git gc --aggressive --prune=now

# 5. 验证大小
du -sh .git

# 6. 推送（需要 force）
git push --force --all
git push --force --tags
```

## 工作流问题

### Q16: 如何在多台电脑上同步工作？

**A:** 使用远程仓库作为中心：

**工作流程**：
```bash
# === 在电脑 A ===
# 初始设置
git clone https://github.com/user/project.git
cd project

# 做一些工作
echo "work from computer A" >> file.txt
git add file.txt
git commit -m "Work from A"
git push origin main

# === 在电脑 B ===
# 初始设置（首次）
git clone https://github.com/user/project.git
cd project

# 或者更新已有仓库
cd project
git pull origin main

# 做一些工作
echo "work from computer B" >> file.txt
git add file.txt
git commit -m "Work from B"
git push origin main

# === 回到电脑 A ===
# 获取 B 的更改
git pull origin main

# 继续工作...
```

**处理未推送的更改**：
```bash
# 场景：在电脑 A 有未提交的更改，现在在电脑 B

# 在电脑 A（离开前）
git status
# 如果有未提交的更改

# 方案 1：提交并推送
git add .
git commit -m "WIP: work in progress"
git push origin main

# 方案 2：使用 stash
git stash push -m "WIP on computer A"
git push origin main

# 在电脑 B
git pull origin main

# 回到电脑 A
git pull origin main
git stash pop  # 如果用了 stash
```

**最佳实践**：
```bash
# 1. 每次工作前先拉取
git pull origin main

# 2. 经常提交
git add .
git commit -m "Descriptive message"

# 3. 及时推送
git push origin main

# 4. 使用分支隔离工作
git checkout -b feature-on-computer-a
git push -u origin feature-on-computer-a
```

### Q17: 如何处理"accidentally committed to the wrong branch"？

**A:** 不小心在错误的分支提交的解决方案：

**场景 1：还没推送**
```bash
# 情况：在 main 分支提交了，但应该在 feature 分支

# 当前状态
git branch
# * main  ← 在这里提交了
#   feature

git log --oneline -3
# abc1234 (HEAD -> main) My commit (应该在 feature)
# def5678 Previous commit

# 解决方案
# 1. 复制提交到正确的分支
git checkout feature
git cherry-pick abc1234

# 2. 回到 main 并重置
git checkout main
git reset --hard HEAD^

# 验证
git log --oneline -1
# def5678 Previous commit

git checkout feature
git log --oneline -1
# abc1234 My commit
```

**场景 2：已经推送**
```bash
# 如果已经推送到 main，需要更谨慎

# 1. 创建备份
git branch backup

# 2. 在正确的分支应用提交
git checkout feature
git cherry-pick abc1234
git push origin feature

# 3. 恢复 main（需要团队协调）
git checkout main
git revert abc1234  # 安全方法：创建回退提交
git push origin main

# 或强制重置（危险，需要团队同意）
git reset --hard HEAD^
git push --force origin main
```

**场景 3：多个提交在错误的分支**
```bash
# 多个提交需要移动
git log --oneline -5
# aaa1111 Commit 3
# bbb2222 Commit 2
# ccc3333 Commit 1
# ddd4444 Previous commit

# 移动最近 3 个提交到 feature
git checkout feature
git cherry-pick ddd4444..aaa1111

# 重置 main
git checkout main
git reset --hard ddd4444
```

### Q18: 如何在团队中使用 Git？

**A:** 团队协作的最佳实践：

**工作流选择**：

**1. Feature Branch Workflow**（推荐小团队）
```bash
# 每个功能一个分支
git checkout -b feature/user-login
# 开发功能
git push -u origin feature/user-login

# 完成后创建 Pull Request
# 代码审查通过后合并到 main
```

**2. Git Flow**（适合发布周期明确的项目）
```bash
# 主要分支
main        # 生产代码
develop     # 开发分支

# 支持分支
feature/*   # 功能分支
release/*   # 发布分支
hotfix/*    # 紧急修复

# 工作流程
# 开发新功能
git checkout -b feature/new-feature develop
# ... 开发
git checkout develop
git merge feature/new-feature

# 准备发布
git checkout -b release/1.0.0 develop
# ... 测试和修复
git checkout main
git merge release/1.0.0
git tag v1.0.0

# 紧急修复
git checkout -b hotfix/critical-bug main
# ... 修复
git checkout main
git merge hotfix/critical-bug
git checkout develop
git merge hotfix/critical-bug
```

**3. GitHub Flow**（适合持续部署）
```bash
# 简化流程
# 1. main 分支始终可部署
# 2. 创建描述性分支
git checkout -b fix-login-bug

# 3. 提交并推送
git commit -m "Fix login validation"
git push -u origin fix-login-bug

# 4. 创建 Pull Request
# 5. 讨论和审查
# 6. 合并并部署
```

**团队规范**：
```bash
# 1. 提交信息规范
git commit -m "feat: add user authentication"
git commit -m "fix: resolve login button issue"
git commit -m "docs: update API documentation"

# 2. 分支命名规范
feature/user-profile
bugfix/login-error
hotfix/critical-security-issue

# 3. 代码审查
# - 所有代码通过 Pull Request
# - 至少一人审查
# - 通过 CI 测试

# 4. 保护主分支
# GitHub Settings → Branches → Branch protection rules
# ✓ Require pull request reviews
# ✓ Require status checks to pass
# ✓ Prevent force push
```

**冲突处理**：
```bash
# 更新功能分支
git checkout feature-branch
git fetch origin
git rebase origin/main

# 解决冲突
# 编辑冲突文件
git add .
git rebase --continue

# 推送（需要 force）
git push --force-with-lease origin feature-branch
```

### Q19: 如何撤销已推送的提交？

**A:** 根据情况选择方法：

**方法 1：git revert（推荐，安全）**
```bash
# 创建新提交来撤销
git revert abc1234

# 撤销最近的提交
git revert HEAD

# 撤销多个提交
git revert HEAD~3..HEAD

# 推送
git push origin main

# 优点：
# - 不改写历史
# - 安全，适合公共分支
# - 保留完整记录
```

**方法 2：git reset + force push（危险）**
```bash
# ⚠️ 仅在确定的情况下使用

# 重置到之前的提交
git reset --hard HEAD^

# 强制推送
git push --force origin main

# 更安全的版本
git push --force-with-lease origin main

# 危险性：
# - 改写历史
# - 影响其他协作者
# - 可能丢失数据
```

**方法 3：交互式 rebase（重写多个提交）**
```bash
# 重写最近 3 个提交
git rebase -i HEAD~3

# 在编辑器中：
# pick abc1234 Commit 1
# drop def5678 Commit 2  ← 删除这个
# pick 890abcd Commit 3

# 强制推送
git push --force-with-lease origin feature-branch
```

**团队协调**：
```bash
# 如果必须使用 force push：

# 1. 通知团队
echo "⚠️ I need to force push to main. Please commit and push your work."

# 2. 等待确认
# 3. 执行操作
git push --force-with-lease origin main

# 4. 通知团队更新
echo "Force push complete. Please run: git fetch && git reset --hard origin/main"
```

### Q20: 如何查看谁修改了某一行代码？

**A:** 使用 `git blame` 和相关工具：

```bash
# 基本用法
git blame file.txt

# 输出示例
# abc1234 (John Doe 2024-01-15 10:30:00 +0800 1) First line
# def5678 (Mary Smith 2024-01-20 14:20:00 +0800 2) Second line

# 只显示特定行范围
git blame -L 10,20 file.txt

# 显示邮箱
git blame -e file.txt

# 忽略空白更改
git blame -w file.txt

# 查看更多详情
git blame -c file.txt

# 跟踪行的历史（即使文件被重命名）
git blame -C file.txt
git blame -C -C file.txt  # 更激进的检测

# 在特定提交时的 blame
git blame abc1234 -- file.txt
```

**使用 git log 查找**：
```bash
# 查找修改某行的提交
git log -S "function myFunction" --source --all

# 查找修改某个函数的提交
git log -L :myFunction:file.js

# 查看文件的修改历史
git log --follow -p -- file.txt

# 查找特定作者的修改
git log --author="John Doe" -- file.txt
```

**图形化工具**：
```bash
# 使用 gitk
gitk file.txt

# 使用 tig（终端）
tig blame file.txt

# VS Code 中使用 GitLens 插件
# GitHub/GitLab 网页界面的 Blame 视图
```

---

## 💡 练习题

{{< expand "练习 1：理解工作区、暂存区、仓库" >}}
**任务**：通过实验理解三个区域的关系

{{< expand "查看答案" >}}
```bash
# 1. 创建仓库
git init -b main

# 2. 创建文件（工作区）
echo "version 1" > file.txt
git status
# Untracked files: file.txt

# 3. 添加到暂存区
git add file.txt
git status
# Changes to be committed: new file: file.txt

# 4. 修改文件（工作区）
echo "version 2" >> file.txt
git status
# Changes to be committed: new file: file.txt
# Changes not staged for commit: modified: file.txt

# 5. 查看差异
git diff           # 工作区 vs 暂存区
git diff --staged  # 暂存区 vs 仓库

# 6. 提交到仓库
git commit -m "Initial commit"
git status
# Changes not staged for commit: modified: file.txt

# 7. 添加并提交第二次修改
git add file.txt
git commit -m "Second version"

# 8. 验证
git log --oneline
# 应该看到两个提交
```

**关键理解**：
- 工作区：你编辑的文件
- 暂存区：git add 后的快照
- 仓库：git commit 后的历史
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 2：比较 merge 和 rebase" >}}
**任务**：创建相同场景，分别使用 merge 和 rebase，观察区别

{{< expand "查看答案" >}}
```bash
# === 场景 1：使用 merge ===
git init -b main
echo "1" > file.txt && git add . && git commit -m "C1"
echo "2" >> file.txt && git add . && git commit -m "C2"

# 创建分支
git checkout -b feature
echo "3" >> file.txt && git add . && git commit -m "C3"

# 回到 main，做新提交
git checkout main
echo "4" >> file.txt && git add . && git commit -m "C4"

# 合并
git merge feature -m "Merge feature"

# 查看历史
git log --oneline --graph --all
# *   Merge feature
# |\
# | * C3
# * | C4
# |/
# * C2
# * C1

# === 场景 2：使用 rebase ===
cd ..
git init -b main rebase-demo
cd rebase-demo

echo "1" > file.txt && git add . && git commit -m "C1"
echo "2" >> file.txt && git add . && git commit -m "C2"

git checkout -b feature
echo "3" >> file.txt && git add . && git commit -m "C3"

git checkout main
echo "4" >> file.txt && git add . && git commit -m "C4"

# Rebase
git checkout feature
git rebase main

# 查看历史
git log --oneline --graph --all
# * C3 (feature)
# * C4 (main)
# * C2
# * C1

# 线性历史！
```

**对比**：
- merge：保留分支结构，有合并提交
- rebase：线性历史，更整洁
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 3：团队协作模拟" >}}
**任务**：模拟两个开发者的协作流程

{{< expand "查看答案" >}}
```bash
# === 设置"服务器" ===
mkdir server
cd server
git init --bare project.git
cd ..

# === 开发者 A ===
git clone server/project.git dev-a
cd dev-a
git config user.name "Developer A"
git config user.email "dev-a@example.com"

# A 做一些工作
echo "Feature A" > featureA.txt
git add featureA.txt
git commit -m "Add feature A"
git push origin main

cd ..

# === 开发者 B ===
git clone server/project.git dev-b
cd dev-b
git config user.name "Developer B"
git config user.email "dev-b@example.com"

# B 做一些工作
echo "Feature B" > featureB.txt
git add featureB.txt
git commit -m "Add feature B"

# B 推送前，A 已经推送了
git push origin main
# 被拒绝！

# B 先拉取
git pull origin main
# 或使用 rebase
git pull --rebase origin main

# 解决冲突（如果有）
git push origin main

cd ../dev-a

# A 拉取 B 的更改
git pull origin main

# 查看历史
git log --oneline --graph --all
```

**学到的**：
- 推送前先拉取
- 处理冲突
- 团队协作流程
{{< /expand >}}
{{< /expand >}}

---

{{< hint success >}}
**检查清单** - 完成本节后，你应该能够：

- [ ] 理解 Git 和 GitHub 的区别
- [ ] 掌握工作区、暂存区、仓库的关系
- [ ] 区分 merge 和 rebase 的使用场景
- [ ] 处理常见的远程仓库问题
- [ ] 优化 Git 性能
- [ ] 实施团队协作最佳实践
- [ ] 解决日常使用中的各种问题
{{< /hint >}}

{{< hint info >}}
**寻求帮助**：
- **官方文档**：https://git-scm.com/doc
- **Pro Git 书**：https://git-scm.com/book/zh/v2
- **Stack Overflow**：https://stackoverflow.com/questions/tagged/git
- **GitHub 社区**：https://github.community
- **Git 邮件列表**：https://git.wiki.kernel.org/index.php/GitCommunity
{{< /hint >}}
