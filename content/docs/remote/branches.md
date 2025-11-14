---
title: "远程分支"
weight: 4
bookToc: true
---

# 远程分支

深入学习远程分支的概念、跟踪关系、以及如何管理和同步远程分支。

## 远程分支概念

**远程分支**是远程仓库中分支的引用（指针）。

### 分支的完整架构

```
┌────────────────────────────────────┐
│      远程仓库（GitHub）            │
│                                    │
│  main      : A ← B ← C ← D        │
│  develop   : A ← B ← E ← F        │
│  feature-x : A ← B ← C ← G        │
└────────────────────────────────────┘
              ↓ clone/fetch
┌────────────────────────────────────┐
│      本地仓库                      │
│                                    │
│  远程跟踪分支（只读）：             │
│    origin/main    : A ← B ← C ← D │
│    origin/develop : A ← B ← E ← F │
│    origin/feature-x: A ← B ← C ← G│
│                                    │
│  本地分支（可修改）：               │
│    main      : A ← B ← C ← D ← H  │
│    develop   : A ← B ← E ← F      │
│    my-feature: A ← B ← C ← D ← I  │
└────────────────────────────────────┘
```

### 三种分支类型

**1. 远程仓库分支**
```bash
# 在远程服务器上的实际分支
# 例如 GitHub 上的 main、develop 等
```

**2. 远程跟踪分支**
```bash
# 本地仓库中远程分支的引用
# 格式：<远程仓库>/<分支名>
# 例如：origin/main、origin/develop

# 特点：
✅ 存在于本地仓库
✅ 只读（不能直接修改）
✅ 通过 fetch/pull 更新
✅ 作为本地和远程的桥梁
```

**3. 本地分支**
```bash
# 你的工作分支
# 例如：main、develop、feature-x

# 特点：
✅ 可以自由修改
✅ 可以提交
✅ 可以推送到远程
✅ 可以跟踪远程分支
```

### 查看分支

```bash
# 查看本地分支
git branch
# * main
#   develop
#   feature-x

# 查看远程分支
git branch -r
# origin/main
# origin/develop
# origin/feature-x

# 查看所有分支
git branch -a
# * main                    # 本地分支
#   develop                 # 本地分支
#   feature-x               # 本地分支
#   remotes/origin/main     # 远程跟踪分支
#   remotes/origin/develop  # 远程跟踪分支
#   remotes/origin/feature-x# 远程跟踪分支

# 查看分支详细信息（包括跟踪关系）
git branch -vv
# * main      abc123 [origin/main] Latest commit
#   develop   def456 [origin/develop: ahead 2] Local commits
#   feature-x ghi789 Add new feature
```

### 远程跟踪分支的本质

```bash
# 远程跟踪分支实际上是什么？
cat .git/refs/remotes/origin/main
# abc123def456...  （指向一个提交的哈希值）

# 它只是一个指针，指向最后一次通信时远程分支的位置
```

**图解**：
```
最近一次 fetch/pull 时：

远程仓库：
  main: A ← B ← C ← D

本地仓库：
  origin/main: A ← B ← C ← D  （快照）
  main: A ← B ← C ← D

之后远程有新提交：

远程仓库：
  main: A ← B ← C ← D ← E ← F

本地仓库：
  origin/main: A ← B ← C ← D  （过时了）
  main: A ← B ← C ← D

执行 fetch 更新快照：

远程仓库：
  main: A ← B ← C ← D ← E ← F

本地仓库：
  origin/main: A ← B ← C ← D ← E ← F  （已更新）
  main: A ← B ← C ← D  （本地分支未变）
```

## 跟踪分支

**跟踪分支**是与远程分支有直接关系的本地分支。

### 什么是跟踪

```
跟踪关系：

本地分支 main
    ↓ 跟踪
远程分支 origin/main

当设置了跟踪关系后：
- git pull   自动知道从哪里拉取
- git push   自动知道推送到哪里
- git status 能显示领先/落后的提交数
```

### 建立跟踪关系

**方式 1：克隆时自动建立**
```bash
# 克隆仓库
git clone https://github.com/user/repo.git

# main 分支自动跟踪 origin/main
git branch -vv
# * main abc123 [origin/main] Latest commit
```

**方式 2：推送时使用 -u**
```bash
# 创建新分支
git checkout -b feature-x

# 首次推送时设置跟踪
git push -u origin feature-x

# 查看跟踪关系
git branch -vv
# * feature-x abc123 [origin/feature-x] Add feature
```

**方式 3：创建分支时设置**
```bash
# 从远程分支创建本地分支并跟踪
git checkout -b local-name origin/remote-name

# 示例
git checkout -b develop origin/develop

# 如果本地和远程同名，可以简写
git checkout develop  # 自动创建并跟踪 origin/develop
```

**方式 4：手动设置跟踪**
```bash
# 为现有分支设置跟踪
git branch -u origin/main main
# 或在当前分支
git branch -u origin/main

# 使用 --set-upstream-to（同义）
git branch --set-upstream-to=origin/main main
```

**方式 5：使用 git switch（推荐，Git 2.23+）**
```bash
# 创建并跟踪远程分支
git switch -c local-name origin/remote-name

# 同名简写
git switch develop  # 自动创建并跟踪 origin/develop
```

### 取消跟踪关系

```bash
# 取消当前分支的跟踪
git branch --unset-upstream

# 取消指定分支的跟踪
git branch --unset-upstream feature-x
```

### 查看跟踪关系

```bash
# 查看所有分支的跟踪关系
git branch -vv
# * main      abc123 [origin/main] Latest commit
#   develop   def456 [origin/develop: ahead 2, behind 3] Commits
#   feature-x ghi789 Add feature  （无跟踪）

# 查看特定分支的跟踪
git rev-parse --abbrev-ref --symbolic-full-name @{u}
# origin/main
```

**跟踪状态解读**：
```bash
git branch -vv

# [origin/main]
# → 与远程同步

# [origin/main: ahead 2]
# → 本地领先 2 个提交（需要 push）

# [origin/main: behind 3]
# → 本地落后 3 个提交（需要 pull）

# [origin/main: ahead 2, behind 3]
# → 本地领先 2 个，落后 3 个（需要 pull 再 push）

# 无跟踪信息
# → 未设置跟踪关系
```

### 跟踪关系的作用

**1. 简化命令**
```bash
# 有跟踪关系
git pull    # 自动从 origin/main 拉取
git push    # 自动推送到 origin/main

# 无跟踪关系
git pull origin main    # 必须指定远程和分支
git push origin feature-x
```

**2. 状态提示**
```bash
# 有跟踪关系
git status
# On branch main
# Your branch is ahead of 'origin/main' by 2 commits.
#   (use "git push" to publish your local commits)

# 无跟踪关系
git status
# On branch feature-x
# nothing to commit, working tree clean
# （没有领先/落后的信息）
```

**3. 自动补全**
```bash
# 有跟踪关系，可以使用简写
git pull
git push

# 配置自动设置跟踪
git config --global push.autoSetupRemote true
# 现在首次 push 也会自动设置跟踪
git push  # 即使首次推送也能工作
```

## 删除远程分支

### 删除方式

**方式 1：使用 git push --delete**
```bash
# 删除远程分支
git push origin --delete <分支名>

# 示例
git push origin --delete feature-old
```

**方式 2：使用冒号语法**
```bash
# 旧语法（仍然有效）
git push origin :<分支名>

# 示例
git push origin :feature-old

# 原理：推送"空"到远程分支
# git push origin <本地分支>:<远程分支>
# git push origin :<远程分支>  （本地为空）
```

**方式 3：在托管平台删除**
```
在 GitHub/GitLab/Gitee 网页上：
1. 进入仓库
2. 点击 "Branches"
3. 找到要删除的分支
4. 点击删除按钮
```

### 完整删除流程

```bash
# 场景：功能分支已合并，需要清理

# 1. 确认分支已合并
git checkout main
git branch --merged
# feature-completed

# 2. 删除本地分支
git branch -d feature-completed

# 3. 删除远程分支
git push origin --delete feature-completed

# 4. 其他开发者更新（在其他人的电脑上）
git fetch --prune
# 或
git remote prune origin
```

### 批量删除

```bash
# 删除所有已合并的本地分支
git branch --merged main | grep -v "^*" | grep -v "main" | xargs git branch -d

# 删除所有已合并的远程分支
git branch -r --merged main | grep "origin/" | grep -v "main" | sed 's/origin\///' | xargs -I {} git push origin --delete {}
```

### 恢复误删的远程分支

```bash
# 如果刚删除，可以恢复

# 1. 找到分支最后的提交哈希
git reflog
# 或查看其他开发者的仓库

# 2. 重新创建分支
git branch feature-recovered <commit-hash>

# 3. 推送到远程
git push origin feature-recovered

# 或一步完成
git push origin <commit-hash>:refs/heads/feature-recovered
```

{{< hint warning >}}
**删除远程分支注意事项**

- ⚠️ 删除前确认分支已合并
- ⚠️ 通知团队成员
- ⚠️ 可能影响正在进行的 Pull Request
- ⚠️ 某些分支可能有保护规则
- ✅ 删除前做好备份
{{< /hint >}}

## 同步远程分支

### 更新远程分支列表

```bash
# 获取远程所有分支
git fetch origin

# 获取并修剪（删除不存在的远程分支引用）
git fetch --prune origin
# 简写
git fetch -p origin

# 配置自动修剪
git config --global fetch.prune true
```

### 查看远程分支变化

```bash
# 查看本地和远程的差异
git fetch origin
git log --oneline main..origin/main  # 远程新增的提交
git log --oneline origin/main..main  # 本地新增的提交

# 图形化查看
git log --oneline --graph --all
```

### 同步所有分支

**场景：更新所有跟踪分支**
```bash
# 方法 1：使用 fetch --all
git fetch --all

# 方法 2：循环更新所有分支
git branch -r | grep -v '\->' | while read remote; do
  git branch --track "${remote#origin/}" "$remote" 2>/dev/null
done
git fetch --all
git pull --all
```

### 克隆所有远程分支

```bash
# 克隆后，只有 main 在本地

# 方法 1：手动创建每个分支
git checkout -b develop origin/develop
git checkout -b feature-x origin/feature-x

# 方法 2：使用脚本创建所有远程分支
for branch in $(git branch -r | grep -v '\->'); do
  git branch --track ${branch#origin/} $branch
done

# 方法 3：使用别名
git config --global alias.clone-branches '!git branch -r | grep -v "\->" | sed "s,origin/,," | xargs -I {} git branch --track {} origin/{}'
git clone-branches
```

### 保持 Fork 同步

```bash
# 场景：你 Fork 了一个项目

# 1. 配置上游仓库（一次性）
git remote add upstream https://github.com/original/repo.git

# 2. 获取上游更新
git fetch upstream

# 3. 查看上游的新分支
git branch -r
# origin/main
# origin/develop
# upstream/main
# upstream/develop
# upstream/new-feature  （上游新增的分支）

# 4. 同步主分支
git checkout main
git merge upstream/main
# 或
git rebase upstream/main

# 5. 推送到你的 Fork
git push origin main

# 6. 同步其他分支
git checkout develop
git merge upstream/develop
git push origin develop
```

### 重置分支到远程状态

```bash
# 场景：本地分支混乱，想重置为远程状态

# 1. 获取最新远程状态
git fetch origin

# 2. 重置本地分支（危险！会丢失本地更改）
git reset --hard origin/main

# 3. 清理未跟踪文件
git clean -fd

# 警告：这会删除所有本地更改！
```

**更安全的方式**：
```bash
# 1. 备份当前工作
git stash

# 2. 或创建备份分支
git branch backup-main

# 3. 重置
git fetch origin
git reset --hard origin/main

# 4. 如需恢复
git reset --hard backup-main
```

### 同步脚本

```bash
#!/bin/bash
# sync-all-branches.sh - 同步所有分支

echo "Fetching all remotes..."
git fetch --all --prune

echo "Syncing main branch..."
git checkout main
git pull origin main

echo "Syncing develop branch..."
git checkout develop
git pull origin develop

echo "Checking for new remote branches..."
for branch in $(git branch -r | grep -v '\->' | grep -v 'main' | grep -v 'develop'); do
  local_branch=${branch#origin/}
  if ! git show-ref --verify --quiet refs/heads/$local_branch; then
    echo "Creating local branch: $local_branch"
    git branch --track $local_branch $branch
  fi
done

echo "Sync complete!"
git checkout main
```

## 远程分支工作流

### 功能分支工作流

```bash
# 1. 确保主分支最新
git checkout main
git pull origin main

# 2. 创建功能分支
git checkout -b feature/user-authentication

# 3. 开发功能
# ... 编写代码 ...
git add .
git commit -m "Implement user login"

# 4. 推送到远程
git push -u origin feature/user-authentication

# 5. 继续开发
# ... 更多代码 ...
git commit -am "Add password validation"
git push  # 已设置跟踪，可简化

# 6. 同步主分支的更新
git fetch origin
git rebase origin/main
# 或
git merge origin/main

# 7. 推送更新（rebase 后需要强制推送）
git push -f origin feature/user-authentication
# 或使用更安全的 --force-with-lease
git push --force-with-lease origin feature/user-authentication

# 8. 创建 Pull Request（网页操作）

# 9. PR 合并后，清理分支
git checkout main
git pull origin main
git branch -d feature/user-authentication
git push origin --delete feature/user-authentication
```

### 发布分支工作流

```bash
# 准备发布 v1.0.0

# 1. 从 develop 创建发布分支
git checkout develop
git pull origin develop
git checkout -b release/v1.0.0

# 2. 推送发布分支
git push -u origin release/v1.0.0

# 3. 在发布分支上进行 bug 修复
git commit -am "Fix bug before release"
git push

# 4. 合并到 main
git checkout main
git pull origin main
git merge --no-ff release/v1.0.0
git push origin main

# 5. 创建标签
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# 6. 合并回 develop
git checkout develop
git merge --no-ff release/v1.0.0
git push origin develop

# 7. 删除发布分支
git branch -d release/v1.0.0
git push origin --delete release/v1.0.0
```

### 热修复工作流

```bash
# 生产环境紧急 bug

# 1. 从 main 创建热修复分支
git checkout main
git pull origin main
git checkout -b hotfix/critical-security-bug

# 2. 修复 bug
git commit -am "Fix security vulnerability"

# 3. 推送并立即部署
git push -u origin hotfix/critical-security-bug

# 4. 合并到 main
git checkout main
git merge --no-ff hotfix/critical-security-bug
git push origin main

# 5. 创建紧急版本标签
git tag -a v1.0.1 -m "Hotfix: security patch"
git push origin v1.0.1

# 6. 合并到 develop
git checkout develop
git merge --no-ff hotfix/critical-security-bug
git push origin develop

# 7. 删除热修复分支
git branch -d hotfix/critical-security-bug
git push origin --delete hotfix/critical-security-bug
```

## 远程分支管理最佳实践

### 1. 命名规范

```bash
# 功能分支
feature/user-authentication
feature/payment-integration
feature/JIRA-123-add-search

# Bug 修复
bugfix/fix-login-error
bugfix/ISSUE-456-crash-on-startup

# 热修复
hotfix/security-patch
hotfix/critical-production-bug

# 发布分支
release/v1.0.0
release/2024-Q1

# 实验分支
experiment/new-architecture
experiment/performance-test
```

### 2. 分支保护

在 GitHub/GitLab 设置：
```
主分支保护规则：
✅ 要求 Pull Request 审查
✅ 要求状态检查通过
✅ 要求分支是最新的
✅ 包括管理员
❌ 禁止强制推送
❌ 禁止删除
```

### 3. 定期清理

```bash
# 删除已合并的分支
git branch --merged main | grep -v "^*" | grep -v "main" | xargs git branch -d

# 修剪远程分支引用
git fetch --prune

# 查看过时的分支
git for-each-ref --sort=-committerdate refs/heads/ --format='%(refname:short) %(committerdate:relative)'
```

### 4. 同步策略

```bash
# 每天开始工作前
git checkout main
git pull origin main

# 开发过程中定期同步
git fetch origin
git rebase origin/main  # 在功能分支上

# 提交 PR 前最后同步
git fetch origin
git rebase origin/main
git push -f origin feature-branch
```

### 5. 团队协作规范

```bash
# 1. 从最新的 main 创建分支
git checkout main
git pull origin main
git checkout -b feature/my-feature

# 2. 频繁提交，清晰的提交信息
git commit -m "feat: add user login form"
git commit -m "fix: validate email format"

# 3. 推送前整理提交
git rebase -i origin/main  # 合并、重排提交

# 4. 推送到远程
git push -u origin feature/my-feature

# 5. 创建 Pull Request

# 6. 根据审查意见修改
git commit -m "address review comments"
git push

# 7. 合并后删除分支
git branch -d feature/my-feature
git push origin --delete feature/my-feature
```

## 下一步

学习了远程分支管理后，接下来学习 Fork 和 Pull Request 工作流。

下一节：[Fork与Pull Request](../fork-pr/) →

---

## 💡 练习题

{{< expand "练习 1：理解分支跟踪" >}}
**问题**：以下场景中的分支跟踪关系是什么？

```bash
# 场景 A
git clone https://github.com/user/repo.git
git branch -vv

# 场景 B
git checkout -b feature-x
git push origin feature-x
git branch -vv

# 场景 C
git checkout -b feature-y
git push -u origin feature-y
git branch -vv
```

每个场景中 main 和新分支的跟踪关系如何？

{{< expand "查看答案" >}}
**答案**：

**场景 A：克隆后**
```bash
git clone https://github.com/user/repo.git
git branch -vv

# 输出：
# * main abc123 [origin/main] Latest commit

# 跟踪关系：
main → origin/main  ✅ 自动跟踪

# 解释：
克隆时，Git 自动为 main 分支设置跟踪关系。
可以直接使用 git pull 和 git push。
```

**场景 B：创建分支但首次推送未用 -u**
```bash
git checkout -b feature-x
git push origin feature-x
git branch -vv

# 输出：
#   main      abc123 [origin/main] Latest commit
# * feature-x def456 Add feature

# 跟踪关系：
main → origin/main      ✅ 有跟踪
feature-x → 无跟踪      ❌ 无跟踪

# 解释：
创建新分支并推送，但没有使用 -u 参数。
远程有 origin/feature-x，但本地分支不跟踪它。

# 后果：
git pull   # 错误！不知道从哪里拉取
git push   # 错误！不知道推送到哪里

# 必须指定：
git pull origin feature-x
git push origin feature-x

# 补救措施：
git branch -u origin/feature-x
# 或
git push -u origin feature-x
```

**场景 C：使用 -u 推送**
```bash
git checkout -b feature-y
git push -u origin feature-y
git branch -vv

# 输出：
#   main      abc123 [origin/main] Latest commit
#   feature-x def456 Add feature
# * feature-y ghi789 [origin/feature-y] New feature

# 跟踪关系：
main → origin/main          ✅ 有跟踪
feature-y → origin/feature-y  ✅ 有跟踪（使用了 -u）

# 解释：
使用 -u（或 --set-upstream）参数推送。
自动设置跟踪关系。

# 优势：
git pull   # ✅ 自动从 origin/feature-y 拉取
git push   # ✅ 自动推送到 origin/feature-y
```

**对比总结**：

| 操作 | main 跟踪 | 新分支跟踪 |
|------|----------|-----------|
| **git clone** | ✅ origin/main | - |
| **git push origin branch** | - | ❌ 无 |
| **git push -u origin branch** | - | ✅ origin/branch |

**最佳实践**：
```bash
# 方案 1：每次都用 -u（推荐）
git push -u origin feature-x

# 方案 2：配置自动设置跟踪（推荐）
git config --global push.autoSetupRemote true
# 之后
git push  # 首次推送也自动设置跟踪

# 方案 3：先设置跟踪再推送
git checkout -b feature-x
git branch -u origin/feature-x
git push
```

**检查跟踪状态**：
```bash
# 详细查看
git branch -vv

# 查看当前分支的上游
git rev-parse --abbrev-ref --symbolic-full-name @{u}

# 检查是否有跟踪
if git rev-parse --abbrev-ref @{u} >/dev/null 2>&1; then
  echo "有跟踪分支"
else
  echo "无跟踪分支"
fi
```
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 2：删除远程分支" >}}
**问题**：feature-x 分支已合并到 main，如何完整地删除它（包括本地和远程）？

写出完整的命令序列，并说明每一步的作用。

{{< expand "查看答案" >}}
**答案**：

**完整删除流程**：

```bash
# 步骤 1：确认分支已合并
git checkout main
git pull origin main

# 查看已合并的分支
git branch --merged
# main
# feature-x  ← 确认已合并

# 或检查特定分支
git branch --merged main | grep feature-x
# feature-x

# 步骤 2：删除本地分支
git branch -d feature-x

# 解释：
# -d (delete) 只删除已合并的分支（安全）
# 如果未合并，会报错：
# error: The branch 'feature-x' is not fully merged.

# 强制删除（如果确定要删除未合并的分支）
git branch -D feature-x  # 慎用！

# 步骤 3：删除远程分支
git push origin --delete feature-x

# 或使用旧语法
git push origin :feature-x

# 步骤 4：其他团队成员同步（在其他人的电脑上）
git fetch --prune
# 或
git remote prune origin

# 步骤 5：验证删除成功
git branch -a
# main
# remotes/origin/main
# remotes/origin/develop
# （feature-x 应该不在列表中）
```

**图解过程**：

```
初始状态：
本地：
  main      : A ← B ← C ← D
  feature-x : A ← B ← C ← E (已合并到 main)

远程：
  origin/main      : A ← B ← C ← D
  origin/feature-x : A ← B ← C ← E

步骤 1：删除本地分支
git branch -d feature-x

本地：
  main : A ← B ← C ← D
  （feature-x 已删除）

远程：
  origin/main      : A ← B ← C ← D
  origin/feature-x : A ← B ← C ← E （仍存在）

步骤 2：删除远程分支
git push origin --delete feature-x

本地：
  main : A ← B ← C ← D

远程：
  origin/main : A ← B ← C ← D
  （origin/feature-x 已删除）
```

**批量删除已合并的分支**：

```bash
# 删除所有已合并到 main 的本地分支
git branch --merged main | \
  grep -v "^*" | \
  grep -v "main" | \
  grep -v "develop" | \
  xargs git branch -d

# 删除所有已合并的远程分支
git branch -r --merged main | \
  grep "origin/" | \
  grep -v "main" | \
  grep -v "develop" | \
  sed 's/origin\///' | \
  xargs -I {} git push origin --delete {}
```

**安全检查**：

```bash
# 1. 在删除前列出将被删除的分支
echo "本地将删除的分支："
git branch --merged main | grep -v "^*" | grep -v "main"

echo "远程将删除的分支："
git branch -r --merged main | grep "origin/" | grep -v "main"

# 2. 确认后再删除
read -p "确定要删除这些分支吗？(y/n) " confirm
if [ "$confirm" = "y" ]; then
  # 执行删除
  git branch --merged main | grep -v "^*" | grep -v "main" | xargs git branch -d
fi
```

**恢复误删的分支**：

```bash
# 如果不小心删除了分支

# 方法 1：使用 reflog
git reflog
# abc123 HEAD@{0}: checkout: moving from feature-x to main
# def456 HEAD@{1}: commit: Last commit on feature-x

# 恢复本地分支
git branch feature-x def456

# 恢复远程分支
git push origin feature-x

# 方法 2：如果其他人还有这个分支
# 从其他人的仓库拉取
git fetch teammate feature-x:feature-x
git push origin feature-x
```

**GitHub/GitLab 网页删除**：

```
GitHub：
1. 进入仓库
2. 点击 "Branches"
3. 找到 feature-x
4. 点击垃圾桶图标删除

GitLab：
1. 进入仓库
2. Repository → Branches
3. 找到 feature-x
4. 点击删除按钮

优势：
✅ 可视化操作
✅ 可以看到分支是否已合并
✅ 有确认提示
❌ 本地分支仍需手动删除
```

**自动化脚本**：

```bash
#!/bin/bash
# cleanup-branches.sh

echo "Cleaning up merged branches..."

# 更新远程分支列表
git fetch --prune

# 切换到 main
git checkout main
git pull origin main

# 列出已合并的分支
merged_branches=$(git branch --merged main | grep -v "^*" | grep -v "main" | grep -v "develop")

if [ -z "$merged_branches" ]; then
  echo "No merged branches to delete."
  exit 0
fi

echo "Following branches will be deleted:"
echo "$merged_branches"
read -p "Continue? (y/n) " confirm

if [ "$confirm" = "y" ]; then
  # 删除本地分支
  echo "$merged_branches" | xargs git branch -d

  # 删除远程分支
  echo "$merged_branches" | xargs -I {} git push origin --delete {}

  echo "Cleanup complete!"
else
  echo "Cleanup cancelled."
fi
```

**注意事项**：

```bash
# ⚠️ 删除前检查
✅ 确认分支已合并
✅ 通知团队成员
✅ 检查是否有未关闭的 PR
✅ 备份重要分支

# ⚠️ 不要删除
❌ main/master 主分支
❌ develop 开发分支
❌ release/* 发布分支（使用中）
❌ 有保护规则的分支
```
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 3：同步 Fork" >}}
**问题**：你 Fork 了一个开源项目，原项目有新的提交和新的分支。如何同步？

写出完整的同步流程，包括：
1. 同步 main 分支
2. 同步新增的远程分支
3. 更新你正在开发的功能分支

{{< expand "查看答案" >}}
**答案**：

**初始设置（一次性）**：

```bash
# 1. Fork 项目（GitHub 网页操作）

# 2. 克隆你的 Fork
git clone https://github.com/yourname/project.git
cd project

# 3. 添加上游仓库
git remote add upstream https://github.com/original/project.git

# 4. 验证远程仓库
git remote -v
# origin    https://github.com/yourname/project.git (fetch)
# origin    https://github.com/yourname/project.git (push)
# upstream  https://github.com/original/project.git (fetch)
# upstream  https://github.com/original/project.git (push)

# 5. 配置不推送到 upstream（安全措施）
git remote set-url --push upstream no_push
git remote -v
# upstream  https://github.com/original/project.git (fetch)
# upstream  no_push (push)  ← 防止误推送
```

**日常同步流程**：

**任务 1：同步 main 分支**
```bash
# 1. 切换到 main 分支
git checkout main

# 2. 从上游获取更新
git fetch upstream

# 3. 查看上游有哪些新提交
git log --oneline main..upstream/main
# d3e4f5a (upstream/main) Fix bug
# c2d3e4f Add new feature

# 4. 合并上游更新
git merge upstream/main
# 或使用 rebase（保持历史整洁）
git rebase upstream/main

# 5. 推送到你的 Fork
git push origin main

# 现在三个仓库的 main 分支都同步了：
# upstream/main (原始项目)
# origin/main (你的 Fork)
# main (本地)
```

**任务 2：同步新增的远程分支**
```bash
# 1. 获取上游所有分支
git fetch upstream

# 2. 查看上游有哪些分支
git branch -r
# origin/main
# origin/develop
# upstream/main
# upstream/develop
# upstream/feature-new  ← 新分支

# 3. 创建本地分支跟踪上游新分支
git checkout -b feature-new upstream/feature-new
# 或使用 switch（Git 2.23+）
git switch -c feature-new upstream/feature-new

# 4. 推送到你的 Fork
git push -u origin feature-new

# 现在你的 Fork 也有这个分支了
```

**任务 3：更新正在开发的功能分支**
```bash
# 假设你在 feature-my-contribution 分支上开发

# 1. 确保 main 分支是最新的
git checkout main
git fetch upstream
git merge upstream/main
git push origin main

# 2. 切换到功能分支
git checkout feature-my-contribution

# 3. 将 main 的更新合并到功能分支
# 方案 A：使用 merge
git merge main

# 方案 B：使用 rebase（推荐，历史更整洁）
git rebase main
# 或直接 rebase 到上游
git rebase upstream/main

# 4. 解决冲突（如果有）
# ... 解决冲突 ...
git add .
git rebase --continue

# 5. 推送到你的 Fork（rebase 后需要强制推送）
git push -f origin feature-my-contribution
# 或使用更安全的
git push --force-with-lease origin feature-my-contribution
```

**完整同步脚本**：

```bash
#!/bin/bash
# sync-fork.sh

echo "🔄 Syncing fork with upstream..."

# 1. 确保有 upstream 远程仓库
if ! git remote | grep -q upstream; then
  echo "❌ Error: upstream remote not found"
  echo "Run: git remote add upstream <upstream-url>"
  exit 1
fi

# 2. 保存当前分支
current_branch=$(git branch --show-current)

# 3. 获取上游所有更新
echo "📥 Fetching upstream..."
git fetch upstream
git fetch origin

# 4. 同步 main 分支
echo "🔄 Syncing main branch..."
git checkout main
git merge upstream/main
git push origin main

# 5. 同步 develop 分支（如果有）
if git show-ref --verify --quiet refs/heads/develop; then
  echo "🔄 Syncing develop branch..."
  git checkout develop
  git merge upstream/develop
  git push origin develop
fi

# 6. 检查上游新增的分支
echo "🔍 Checking for new upstream branches..."
for branch in $(git branch -r | grep "upstream/" | grep -v "HEAD" | sed 's/upstream\///'); do
  if ! git show-ref --verify --quiet refs/heads/$branch; then
    echo "➕ New branch found: $branch"
    read -p "Create local branch and push to origin? (y/n) " confirm
    if [ "$confirm" = "y" ]; then
      git checkout -b $branch upstream/$branch
      git push -u origin $branch
    fi
  fi
done

# 7. 回到原来的分支
echo "↩️  Returning to $current_branch..."
git checkout $current_branch

# 8. 如果当前分支不是 main/develop，询问是否更新
if [ "$current_branch" != "main" ] && [ "$current_branch" != "develop" ]; then
  read -p "Rebase $current_branch onto main? (y/n) " confirm
  if [ "$confirm" = "y" ]; then
    git rebase main
    echo "⚠️  Remember to force push: git push -f origin $current_branch"
  fi
fi

echo "✅ Sync complete!"
```

**使用别名简化操作**：

```bash
# 配置别名
git config alias.sync-fork '!git fetch upstream && git checkout main && git merge upstream/main && git push origin main'

# 使用
git sync-fork

# 更完整的别名
git config alias.sync-all '!f() {
  git fetch upstream &&
  git checkout main &&
  git merge upstream/main &&
  git push origin main &&
  git checkout ${1:-main};
}; f'

# 使用
git sync-all          # 同步后停留在 main
git sync-all develop  # 同步后切换到 develop
```

**图解同步过程**：

```
初始状态：
upstream/main: A ← B ← C ← D ← E ← F (原项目)
origin/main:   A ← B ← C ← D       (你的 Fork)
main:          A ← B ← C ← D       (本地)
feature:       A ← B ← C ← D ← G   (你的功能分支)

同步 main 后：
upstream/main: A ← B ← C ← D ← E ← F
origin/main:   A ← B ← C ← D ← E ← F ✅
main:          A ← B ← C ← D ← E ← F ✅
feature:       A ← B ← C ← D ← G   (待更新)

更新功能分支（rebase）：
upstream/main: A ← B ← C ← D ← E ← F
origin/main:   A ← B ← C ← D ← E ← F
main:          A ← B ← C ← D ← E ← F
feature:       A ← B ← C ← D ← E ← F ← G' ✅
```

**定期同步计划**：

```bash
# 每天开始工作前
git sync-fork

# 提交 PR 前
git checkout main
git pull upstream main
git checkout feature-branch
git rebase main
git push -f origin feature-branch

# 每周一次全面同步
./sync-fork.sh  # 运行完整的同步脚本
```

**注意事项**：

```bash
# ✅ 最佳实践
- 频繁同步，避免积累太多差异
- 使用 rebase 保持历史整洁
- 使用 --force-with-lease 而不是 -f
- 在功能分支上工作，不要直接在 main 上提交

# ⚠️ 注意
- 强制推送前确认没有协作者
- 同步前保存当前工作（git stash）
- 不要推送到 upstream（配置 no_push）
```
{{< /expand >}}
{{< /expand >}}

---

{{< hint success >}}
**检查清单** - 完成本节后，你应该能够：

- [ ] 理解远程分支、远程跟踪分支、本地分支的区别
- [ ] 使用 git branch -r 查看远程分支
- [ ] 使用 git branch -vv 查看跟踪关系
- [ ] 建立和取消分支跟踪关系
- [ ] 理解跟踪关系的作用
- [ ] 删除远程分支
- [ ] 恢复误删的分支
- [ ] 同步远程分支列表
- [ ] 克隆所有远程分支
- [ ] 保持 Fork 与上游同步
- [ ] 使用远程分支工作流
- [ ] 遵循分支命名规范
{{< /hint >}}
