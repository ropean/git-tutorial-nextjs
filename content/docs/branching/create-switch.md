---
title: "创建和切换分支"
weight: 2
bookToc: true
---

# 创建和切换分支

本章将学习如何创建、切换、查看、重命名和删除分支。掌握这些操作是使用 Git 分支的基础。

## git branch - 分支管理命令

`git branch` 是管理分支的主要命令，用于创建、列出、重命名和删除分支。

### 查看分支

```bash
# 查看本地分支
git branch

# 输出示例：
#   feature-login
# * main              # * 表示当前分支
#   bugfix-navbar

# 查看所有分支（包括远程）
git branch -a
git branch --all

# 查看远程分支
git branch -r
git branch --remote

# 查看分支及其最后一次提交
git branch -v
git branch --verbose

# 输出示例：
#   feature-login  a1b2c3d Add login form
# * main           d4e5f6g Update README
#   bugfix-navbar  g7h8i9j Fix navbar styling
```

### 查看分支详细信息

```bash
# 查看已合并到当前分支的分支
git branch --merged

# 查看未合并到当前分支的分支
git branch --no-merged

# 查看包含指定提交的分支
git branch --contains <commit-hash>

# 查看分支的上游分支
git branch -vv
```

**实例**：

```bash
# 查看已合并的分支（可以安全删除）
git branch --merged
#   feature-done
#   bugfix-old
# * main

# 查看未合并的分支（删除会丢失工作）
git branch --no-merged
#   feature-in-progress
#   experiment
```

## 创建分支

### 使用 git branch 创建

```bash
# 创建新分支（但不切换）
git branch <branch-name>

# 示例
git branch feature-search
git branch bugfix-login
git branch experiment/new-design
```

{{< hint info >}}
**注意**：`git branch` 只创建分支，不会自动切换到新分支。你仍然在原来的分支上。
{{< /hint >}}

### 从指定提交创建分支

```bash
# 从指定提交创建分支
git branch <branch-name> <commit-hash>

# 从指定分支创建分支
git branch <new-branch> <existing-branch>

# 示例
git branch hotfix abc1234        # 从提交 abc1234 创建
git branch feature-v2 develop    # 从 develop 分支创建
```

**实例**：

```bash
# 查看提交历史
git log --oneline
# d4e5f6g (HEAD -> main) Latest commit
# c3d4e5f Previous commit
# b2c3d4e Older commit

# 从旧提交创建分支
git branch restore-point b2c3d4e

# 验证
git log --oneline restore-point
# b2c3d4e (restore-point) Older commit
# ...
```

## 切换分支

Git 提供了两种切换分支的命令：`git checkout` 和 `git switch`（Git 2.23+）。

### git checkout - 传统方式

```bash
# 切换到已存在的分支
git checkout <branch-name>

# 创建并切换到新分支
git checkout -b <branch-name>

# 从指定提交创建并切换
git checkout -b <branch-name> <commit-hash>
```

**示例**：

```bash
# 切换到已存在的分支
git checkout feature-login

# 创建并切换到新分支
git checkout -b feature-search

# 从指定提交创建并切换
git checkout -b hotfix abc1234
```

### git switch - 现代方式（推荐）

Git 2.23 引入了 `git switch`，专门用于切换分支，语义更清晰。

```bash
# 切换到已存在的分支
git switch <branch-name>

# 创建并切换到新分支
git switch -c <branch-name>
git switch --create <branch-name>

# 切换到上一个分支
git switch -

# 强制切换（丢弃本地修改）
git switch -f <branch-name>
git switch --force <branch-name>
```

**示例**：

```bash
# 切换到 main 分支
git switch main

# 创建并切换到新分支
git switch -c feature-payment

# 切换到上一个分支（类似 cd -）
git switch -
```

### git checkout vs git switch

| 特性 | git checkout | git switch |
|------|-------------|-----------|
| 切换分支 | ✅ `git checkout branch` | ✅ `git switch branch` |
| 创建并切换 | ✅ `git checkout -b branch` | ✅ `git switch -c branch` |
| 切换到上一个分支 | ✅ `git checkout -` | ✅ `git switch -` |
| 恢复文件 | ✅ `git checkout -- file` | ❌ 使用 `git restore` |
| 分离 HEAD | ✅ `git checkout <commit>` | ✅ `git switch --detach <commit>` |
| 语义清晰度 | 功能过多，容易混淆 | 专门用于分支，更清晰 |

{{< hint info >}}
**推荐**：使用 `git switch` 切换分支，使用 `git restore` 恢复文件。这样命令的职责更单一，不容易出错。
{{< /hint >}}

## 创建并切换分支的完整流程

### 方式 1：分两步（传统）

```bash
# 1. 创建分支
git branch feature-login

# 2. 切换到分支
git checkout feature-login
# 或
git switch feature-login
```

### 方式 2：一步完成（推荐）

```bash
# 使用 checkout
git checkout -b feature-login

# 使用 switch（推荐）
git switch -c feature-login
```

### 实战示例

```bash
# 场景：开发新功能
# 1. 确保在 main 分支且是最新的
git switch main
git pull origin main

# 2. 创建并切换到功能分支
git switch -c feature/user-profile

# 3. 开发功能
echo "User profile code" > profile.js
git add profile.js
git commit -m "Add user profile feature"

# 4. 查看当前分支
git branch
#   main
# * feature/user-profile

# 5. 查看分支图
git log --oneline --graph --all
# * a1b2c3d (HEAD -> feature/user-profile) Add user profile feature
# * d4e5f6g (main) Previous commit
```

## 切换分支时的注意事项

### 未提交的修改

切换分支时，Git 会检查工作区：

```bash
# 当前在 main 分支，修改了文件但未提交
echo "Changes" >> file.txt

# 尝试切换分支
git switch feature
```

**三种可能的结果**：

1. **成功切换**：如果修改不会冲突，Git 会保留修改
2. **拒绝切换**：如果修改会冲突，Git 报错
3. **提示暂存**：建议提交或暂存修改

**错误示例**：

```bash
$ git switch feature
error: Your local changes to the following files would be overwritten by checkout:
        file.txt
Please commit your changes or stash them before you switch branches.
Aborting
```

### 处理未提交的修改

**方式 1：提交修改**

```bash
# 提交当前修改
git add .
git commit -m "Work in progress"

# 然后切换分支
git switch feature
```

**方式 2：暂存修改（推荐）**

```bash
# 暂存当前修改
git stash

# 切换分支
git switch feature

# 在新分支工作后，切换回来
git switch main

# 恢复暂存的修改
git stash pop
```

**方式 3：强制切换（危险）**

```bash
# 强制切换，丢弃所有未提交的修改
git switch -f feature
git switch --force feature
```

{{< hint danger >}}
**警告**：`--force` 会永久丢失未提交的修改，请谨慎使用！
{{< /hint >}}

## 重命名分支

### 重命名当前分支

```bash
# 重命名当前分支
git branch -m <new-name>
git branch --move <new-name>

# 示例
git branch -m feature/new-name
```

### 重命名其他分支

```bash
# 重命名指定分支
git branch -m <old-name> <new-name>

# 示例
git branch -m feature-old feature-new
```

### 强制重命名（覆盖已存在的分支）

```bash
# 强制重命名（即使新名称已存在）
git branch -M <new-name>
git branch --move --force <new-name>
```

**实例**：

```bash
# 查看当前分支
git branch
# * feature-user-login
#   main

# 重命名当前分支
git branch -m feature/user-authentication

# 验证
git branch
# * feature/user-authentication
#   main

# 重命名其他分支
git branch -m main trunk
git branch
# * feature/user-authentication
#   trunk
```

{{< hint info >}}
**GitHub 默认分支改名**：
GitHub 已将默认分支从 `master` 改为 `main`。如果你的仓库还在使用 `master`，可以重命名：

```bash
git branch -m master main
git push -u origin main
git push origin --delete master
```
{{< /hint >}}

## 删除分支

### 删除已合并的分支

```bash
# 删除已合并的分支（安全）
git branch -d <branch-name>
git branch --delete <branch-name>

# 示例
git branch -d feature-done
```

**安全检查**：

```bash
# 如果分支未合并，Git 会拒绝删除
$ git branch -d feature-in-progress
error: The branch 'feature-in-progress' is not fully merged.
If you are sure you want to delete it, run 'git branch -D feature-in-progress'.
```

### 强制删除分支

```bash
# 强制删除分支（即使未合并）
git branch -D <branch-name>
git branch --delete --force <branch-name>

# 示例
git branch -D experiment
```

{{< hint warning >}}
**注意**：强制删除会丢失该分支上未合并的提交。删除前请确认不需要这些提交。
{{< /hint >}}

### 删除远程分支

```bash
# 删除远程分支
git push origin --delete <branch-name>

# 或使用简写
git push origin :<branch-name>

# 示例
git push origin --delete feature-done
```

### 批量删除分支

```bash
# 删除所有已合并的分支（除了当前分支和 main）
git branch --merged | grep -v "\*" | grep -v "main" | xargs -n 1 git branch -d

# 删除匹配模式的分支
git branch | grep "feature/" | xargs -n 1 git branch -d
```

**实例**：

```bash
# 查看分支
git branch
#   feature-done
#   feature-in-progress
# * main
#   bugfix-done

# 删除已完成的功能分支
git branch -d feature-done
# Deleted branch feature-done (was a1b2c3d).

# 尝试删除未完成的分支
git branch -d feature-in-progress
# error: The branch 'feature-in-progress' is not fully merged.

# 确认后强制删除
git branch -D feature-in-progress
# Deleted branch feature-in-progress (was d4e5f6g).
```

## 分支管理工作流

### 开始新功能

```bash
# 1. 更新 main 分支
git switch main
git pull origin main

# 2. 创建功能分支
git switch -c feature/shopping-cart

# 3. 开发功能
# ... 编写代码 ...
git add .
git commit -m "Add shopping cart functionality"

# 4. 推送到远程（如果需要）
git push -u origin feature/shopping-cart
```

### 完成功能

```bash
# 1. 确保功能分支是最新的
git switch feature/shopping-cart
git add .
git commit -m "Finalize shopping cart"

# 2. 切换到 main 分支
git switch main

# 3. 合并功能分支（将在下一章学习）
git merge feature/shopping-cart

# 4. 删除功能分支
git branch -d feature/shopping-cart

# 5. 删除远程分支
git push origin --delete feature/shopping-cart
```

### 紧急修复

```bash
# 1. 从 main 创建 hotfix 分支
git switch main
git switch -c hotfix/critical-bug

# 2. 修复 bug
# ... 修复代码 ...
git add .
git commit -m "Fix critical bug in checkout process"

# 3. 合并到 main
git switch main
git merge hotfix/critical-bug

# 4. 也合并到 develop（如果有）
git switch develop
git merge hotfix/critical-bug

# 5. 删除 hotfix 分支
git branch -d hotfix/critical-bug
```

## 查看分支历史

```bash
# 查看所有分支的提交历史
git log --all --oneline --graph

# 查看分支分叉情况
git log --all --graph --decorate --oneline

# 查看特定分支的历史
git log feature-branch --oneline

# 比较两个分支
git log main..feature-branch      # feature 比 main 多的提交
git log feature-branch..main      # main 比 feature 多的提交
```

**输出示例**：

```bash
$ git log --all --graph --oneline --decorate
* d4e5f6g (HEAD -> feature) Add feature
| * c3d4e5f (main) Update main
|/
* b2c3d4e Initial commit
```

## 分支别名和快捷方式

可以设置别名简化分支操作：

```bash
# 设置别名
git config --global alias.br branch
git config --global alias.co checkout
git config --global alias.sw switch
git config --global alias.br-new 'switch -c'

# 使用别名
git br              # 等同于 git branch
git co main         # 等同于 git checkout main
git sw feature      # 等同于 git switch feature
git br-new feat     # 等同于 git switch -c feat
```

**更复杂的别名**：

```bash
# 查看分支图
git config --global alias.tree "log --all --graph --decorate --oneline"

# 删除已合并的分支
git config --global alias.br-clean "!git branch --merged | grep -v '*' | xargs -n 1 git branch -d"

# 使用
git tree
git br-clean
```

## 命令速查

| 命令 | 说明 |
|------|------|
| `git branch` | 查看本地分支 |
| `git branch -a` | 查看所有分支（含远程） |
| `git branch -v` | 查看分支及最后提交 |
| `git branch <name>` | 创建分支 |
| `git branch -m <new>` | 重命名当前分支 |
| `git branch -d <name>` | 删除已合并分支 |
| `git branch -D <name>` | 强制删除分支 |
| `git switch <name>` | 切换分支 |
| `git switch -c <name>` | 创建并切换分支 |
| `git switch -` | 切换到上一个分支 |
| `git checkout -b <name>` | 创建并切换分支（旧方式） |
| `git branch --merged` | 查看已合并分支 |
| `git branch --no-merged` | 查看未合并分支 |

## 下一步

掌握了分支的创建和切换后，接下来学习如何合并分支。

下一节：[合并分支](../merge/) →

---

## 💡 练习题

{{< expand "练习 1：创建和切换分支" >}}
**任务**：
1. 创建一个新仓库
2. 创建两个分支：`feature-a` 和 `feature-b`
3. 在每个分支上创建不同的文件
4. 切换分支并验证文件的变化

{{< expand "查看答案" >}}
```bash
# 1. 创建仓库
mkdir branch-practice
cd branch-practice
git init -b main

# 2. 初始提交
echo "Main content" > main.txt
git add main.txt
git commit -m "Initial commit"

# 3. 创建并切换到 feature-a
git switch -c feature-a
echo "Feature A" > feature-a.txt
git add feature-a.txt
git commit -m "Add feature A"

# 4. 创建并切换到 feature-b
git switch -c feature-b
echo "Feature B" > feature-b.txt
git add feature-b.txt
git commit -m "Add feature B"

# 5. 查看当前分支的文件
ls
# feature-b.txt  main.txt    # 注意：没有 feature-a.txt

# 6. 切换到 feature-a
git switch feature-a
ls
# feature-a.txt  main.txt    # 注意：没有 feature-b.txt

# 7. 切换到 main
git switch main
ls
# main.txt                    # 只有初始文件

# 8. 查看所有分支
git branch
#   feature-a
#   feature-b
# * main
```

**关键观察**：
- 切换分支时，工作区的文件会改变
- 每个分支有自己独立的文件和历史
- 在 main 分支看不到 feature 分支的文件
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 2：处理未提交的修改" >}}
**场景**：你在 `feature` 分支上修改了文件但未提交，现在需要切换到 `main` 分支处理紧急问题。

正确的操作步骤是什么？

{{< expand "查看答案" >}}
```bash
# 当前状态：在 feature 分支，有未提交的修改
git status
# On branch feature
# Changes not staged for commit:
#   modified:   app.js

# 方式 1：提交修改（如果工作已完成）
git add app.js
git commit -m "Complete feature work"
git switch main

# 方式 2：暂存修改（推荐，工作未完成时）
git stash
# Saved working directory and index state WIP on feature

git switch main
# ... 处理紧急问题 ...

# 处理完后，回到 feature 分支
git switch feature
git stash pop
# ... 继续之前的工作 ...

# 方式 3：创建临时提交
git add app.js
git commit -m "WIP: temporary commit"
git switch main
# ... 处理紧急问题 ...

git switch feature
# 撤销临时提交，恢复修改
git reset HEAD~1

# 方式 4：强制切换（危险，会丢失修改）
git switch -f main
# 修改会永久丢失！
```

**推荐方式**：
- 工作完成 → 提交
- 工作未完成 → 使用 `git stash`
- 避免使用 `--force`
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 3：分支清理" >}}
**任务**：你的仓库有很多分支，需要清理：

```bash
# 当前分支列表
$ git branch
  feature-done
  feature-in-progress
  hotfix-merged
* main
  old-experiment
```

问题：
1. 如何找出已经合并的分支？
2. 如何安全地删除它们？
3. 如何删除未合并的实验分支？

{{< expand "查看答案" >}}
```bash
# 1. 查看已合并的分支
git branch --merged
#   feature-done
#   hotfix-merged
# * main

# 2. 安全删除已合并的分支
git branch -d feature-done
# Deleted branch feature-done (was a1b2c3d).

git branch -d hotfix-merged
# Deleted branch hotfix-merged (was b2c3d4e).

# 3. 查看未合并的分支
git branch --no-merged
#   feature-in-progress
#   old-experiment

# 4. 检查未合并分支的内容
git log main..feature-in-progress --oneline
# d4e5f6g Important work

git log main..old-experiment --oneline
# c3d4e5f Old test

# 5. 保留重要的工作，删除无用的实验
# 保留 feature-in-progress（有重要工作）
# 删除 old-experiment（已过时）

git branch -D old-experiment
# Deleted branch old-experiment (was c3d4e5f).

# 6. 验证剩余分支
git branch
#   feature-in-progress
# * main
```

**批量清理已合并分支**：
```bash
# 删除所有已合并的分支（除了当前分支和 main）
git branch --merged | \
  grep -v "\*" | \
  grep -v "main" | \
  xargs -n 1 git branch -d
```

**注意**：
- 使用 `--merged` 查找安全删除的分支
- 使用 `--no-merged` 查找可能丢失工作的分支
- 删除前检查分支内容
- 重要的未合并分支不要删除
{{< /expand >}}
{{< /expand >}}

---

{{< hint success >}}
**检查清单** - 完成本节后，你应该能够：

- [ ] 使用 `git branch` 查看分支列表
- [ ] 使用 `git branch <name>` 创建新分支
- [ ] 使用 `git switch` 或 `git checkout` 切换分支
- [ ] 使用 `git switch -c` 创建并切换分支
- [ ] 理解 `git checkout` 和 `git switch` 的区别
- [ ] 处理切换分支时的未提交修改
- [ ] 使用 `git branch -m` 重命名分支
- [ ] 使用 `git branch -d` 删除已合并分支
- [ ] 使用 `git branch -D` 强制删除分支
- [ ] 查看已合并和未合并的分支
- [ ] 切换到上一个分支（`git switch -`）
{{< /hint >}}
