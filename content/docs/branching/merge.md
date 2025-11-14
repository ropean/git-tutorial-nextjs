---
title: "合并分支"
weight: 3
bookToc: true
---

# 合并分支

合并（Merge）是将一个分支的修改整合到另一个分支的过程。本章将学习 Git 的合并机制和各种合并策略。

## 合并的基本概念

合并是将不同分支的工作整合在一起的过程。最常见的场景是将功能分支合并回主分支。

### 合并命令

```bash
# 将指定分支合并到当前分支
git merge <branch-name>

# 示例：将 feature 分支合并到 main
git switch main          # 先切换到目标分支
git merge feature        # 合并 feature 分支
```

{{< hint info >}}
**重要**：合并是将指定分支合并**到当前分支**。所以要先切换到接收合并的分支（通常是 main）。
{{< /hint >}}

## Fast-forward 合并（快进合并）

当目标分支没有新的提交时，Git 会执行快进合并。

### 什么是 Fast-forward？

```
初始状态：
main:    C1 ← C2
              ↘
feature:       C3 ← C4

执行 git merge feature 后：
main:    C1 ← C2 ← C3 ← C4
                        ↑
                     feature
```

Git 只是将 main 指针向前移动到 feature 的位置，没有创建新的提交。

### Fast-forward 示例

```bash
# 1. 创建仓库和初始提交
mkdir merge-demo
cd merge-demo
git init -b main
echo "Initial" > README.md
git add README.md
git commit -m "C1: Initial commit"

# 2. 创建功能分支
git switch -c feature

# 3. 在功能分支上提交
echo "Feature 1" > feature.txt
git add feature.txt
git commit -m "C2: Add feature 1"

echo "Feature 2" >> feature.txt
git add feature.txt
git commit -m "C3: Add feature 2"

# 4. 切换回 main 并合并
git switch main
git merge feature

# 输出：
# Updating a1b2c3d..d4e5f6g
# Fast-forward
#  feature.txt | 2 ++
#  1 file changed, 2 insertions(+)
#  create mode 100644 feature.txt
```

### 查看合并结果

```bash
# 查看提交历史
git log --oneline --graph

# 输出：
# * d4e5f6g (HEAD -> main, feature) C3: Add feature 2
# * c3d4e5f C2: Add feature 1
# * a1b2c3d C1: Initial commit
```

注意：`main` 和 `feature` 都指向同一个提交，历史是一条直线。

### 禁用 Fast-forward

有时你希望保留分支合并的记录，即使可以快进：

```bash
# 禁用快进，创建合并提交
git merge --no-ff feature -m "Merge feature branch"
```

**结果**：

```
Before (允许 fast-forward):
main: C1 ← C2 ← C3

After (--no-ff):
main: C1 ← C2 ← C3
            ↘     ↗
             M (merge commit)
```

{{< hint info >}}
**使用场景**：
- 保留分支历史：想在历史中看到功能分支的合并点
- 回滚方便：可以整个撤销功能分支的所有修改
- 团队规范：某些团队要求所有合并都创建合并提交
{{< /hint >}}

## 三方合并（3-way Merge）

当两个分支都有新的提交时，Git 会执行三方合并。

### 什么是三方合并？

```
初始状态：
         C3 ← C4 (feature)
        ↗
C1 ← C2
        ↘
         C5 ← C6 (main)

执行 git merge feature 后：
         C3 ← C4 (feature)
        ↗         ↘
C1 ← C2           M7 (main)
        ↘        ↗
         C5 ← C6
```

Git 创建一个新的**合并提交**（M7），它有两个父提交（C6 和 C4）。

### 为什么叫"三方"合并？

Git 比较三个版本：
1. **共同祖先**（C2）- 两个分支分叉前的状态
2. **当前分支的最新提交**（C6）- main 的修改
3. **要合并的分支的最新提交**（C4）- feature 的修改

通过比较这三个版本，Git 可以智能地合并修改。

### 三方合并示例

```bash
# 1. 创建仓库
git init -b main
echo "Line 1" > file.txt
git add file.txt
git commit -m "C1: Initial"

echo "Line 2" >> file.txt
git add file.txt
git commit -m "C2: Add line 2"

# 2. 创建分支并修改
git switch -c feature
echo "Line 3 (feature)" >> file.txt
git add file.txt
git commit -m "C3: Feature adds line 3"

# 3. 切换回 main 并修改
git switch main
echo "Line 3 (main)" >> file.txt
git add file.txt
git commit -m "C4: Main adds line 3"

# 4. 合并（会产生冲突，下一章学习解决）
# 为了演示无冲突的三方合并，我们修改不同的文件

# 重新开始，修改不同文件
git reset --hard HEAD~1  # 撤销 C4

# 在 main 分支创建新文件
echo "Main file" > main.txt
git add main.txt
git commit -m "C4: Add main.txt"

# 5. 执行三方合并
git merge feature

# 输出：
# Merge made by the 'ort' strategy.
#  file.txt | 1 +
#  1 file changed, 1 insertion(+)
```

### 查看合并提交

```bash
# 查看合并历史
git log --oneline --graph

# 输出：
# *   e7f8g9h (HEAD -> main) Merge branch 'feature'
# |\
# | * c3d4e5f (feature) C3: Feature adds line 3
# * | d4e5f6g C4: Add main.txt
# |/
# * b2c3d4e C2: Add line 2
# * a1b2c3d C1: Initial

# 查看合并提交的详细信息
git show e7f8g9h

# 输出会显示：
# commit e7f8g9h (HEAD -> main)
# Merge: d4e5f6g c3d4e5f       ← 两个父提交
# Author: ...
# Date: ...
#
#     Merge branch 'feature'
```

## 合并策略

Git 支持多种合并策略，会根据情况自动选择。

### 主要策略

| 策略 | 说明 | 使用场景 |
|------|------|----------|
| `fast-forward` | 快进合并，不创建新提交 | 目标分支无新提交 |
| `ort` | 递归三方合并（Git 2.33+默认） | 一般情况的三方合并 |
| `recursive` | 递归三方合并（旧版本默认） | 一般情况的三方合并 |
| `octopus` | 合并多个分支 | 同时合并 3 个以上分支 |
| `ours` | 使用当前分支的版本 | 记录合并但忽略对方修改 |
| `subtree` | 子树合并 | 合并子项目 |

### 指定合并策略

```bash
# 使用特定策略
git merge -s <strategy> <branch>

# 示例：使用 ours 策略（保留当前分支的所有修改）
git merge -s ours feature
```

### ort vs recursive 策略

从 Git 2.33 开始，默认策略从 `recursive` 改为 `ort`（Ostensibly Recursive's Twin）。

**ort 的优势**：
- 更快的合并速度
- 更好的重命名检测
- 更准确的冲突检测
- 更清晰的冲突标记

```bash
# 显式使用 ort 策略
git merge -s ort feature

# 显式使用 recursive 策略
git merge -s recursive feature
```

### 策略选项

可以为策略指定选项：

```bash
# 冲突时优先使用当前分支的版本
git merge -X ours feature

# 冲突时优先使用对方分支的版本
git merge -X theirs feature

# 忽略空白字符的差异
git merge -X ignore-space-change feature
```

{{< hint warning >}}
**注意区别**：
- `-s ours`（策略）：完全忽略对方的修改
- `-X ours`（选项）：只在冲突时优先使用己方版本，非冲突部分仍会合并
{{< /hint >}}

## 合并示例

### 示例 1：无冲突的功能合并

```bash
# 1. 在 main 分支
git switch main
echo "Initial content" > README.md
git add README.md
git commit -m "Initial commit"

# 2. 创建功能分支
git switch -c feature/add-login

# 3. 开发登录功能
mkdir auth
echo "login code" > auth/login.js
git add auth/
git commit -m "Add login functionality"

echo "auth tests" > auth/login.test.js
git add auth/
git commit -m "Add login tests"

# 4. 切换回 main，添加其他功能
git switch main
mkdir utils
echo "helper functions" > utils/helpers.js
git add utils/
git commit -m "Add helper utilities"

# 5. 合并功能分支
git merge feature/add-login

# 输出：
# Merge made by the 'ort' strategy.
#  auth/login.js      | 1 +
#  auth/login.test.js | 1 +
#  2 files changed, 2 insertions(+)

# 6. 查看结果
git log --oneline --graph --all
# *   a1b2c3d (HEAD -> main) Merge branch 'feature/add-login'
# |\
# | * d4e5f6g (feature/add-login) Add login tests
# | * c3d4e5f Add login functionality
# * | b2c3d4e Add helper utilities
# |/
# * e7f8g9h Initial commit

# 7. 删除功能分支
git branch -d feature/add-login
```

### 示例 2：快进合并

```bash
# 1. 在 main 分支
git switch main

# 2. 创建功能分支
git switch -c feature/update-readme

# 3. 修改 README
echo "## Features" >> README.md
git add README.md
git commit -m "Add features section"

echo "## Installation" >> README.md
git add README.md
git commit -m "Add installation section"

# 4. 切换回 main（没有新提交）
git switch main

# 5. 合并（快进）
git merge feature/update-readme

# 输出：
# Updating e7f8g9h..a1b2c3d
# Fast-forward
#  README.md | 2 ++
#  1 file changed, 2 insertions(+)

# 6. 查看历史（一条直线）
git log --oneline --graph
# * a1b2c3d (HEAD -> main, feature/update-readme) Add installation section
# * d4e5f6g Add features section
# * e7f8g9h Initial commit
```

### 示例 3：禁用快进合并

```bash
# 同样的场景，但禁用快进
git switch main
git merge --no-ff feature/update-readme -m "Merge feature: Update README"

# 输出：
# Merge made by the 'ort' strategy.
#  README.md | 2 ++
#  1 file changed, 2 insertions(+)

# 查看历史（有合并提交）
git log --oneline --graph --all
# *   b2c3d4e (HEAD -> main) Merge feature: Update README
# |\
# | * a1b2c3d (feature/update-readme) Add installation section
# | * d4e5f6g Add features section
# |/
# * e7f8g9h Initial commit
```

## 合并后的清理

### 删除已合并的分支

```bash
# 删除本地分支
git branch -d feature/add-login

# 删除远程分支
git push origin --delete feature/add-login

# 或使用简写
git push origin :feature/add-login
```

### 查看未清理的分支

```bash
# 查看已合并的分支（可以安全删除）
git branch --merged

# 查看未合并的分支（删除会丢失工作）
git branch --no-merged
```

### 批量清理

```bash
# 删除所有已合并的分支（除了当前分支和 main）
git branch --merged | \
  grep -v "\*" | \
  grep -v "main" | \
  grep -v "develop" | \
  xargs -n 1 git branch -d
```

## 查看合并历史

```bash
# 查看合并提交
git log --merges

# 查看非合并提交
git log --no-merges

# 图形化查看所有历史
git log --all --graph --decorate --oneline

# 查看某个分支合并了哪些提交
git log main..feature

# 查看两个分支的差异
git log --left-right main...feature
# < a1b2c3d Commit in main
# > d4e5f6g Commit in feature
```

## 合并最佳实践

### 1. 合并前更新分支

```bash
# 合并前确保目标分支是最新的
git switch main
git pull origin main

# 然后再合并功能分支
git merge feature/new-feature
```

### 2. 小步合并，频繁合并

```bash
# 好的做法：功能完成一个模块就合并
git merge feature/module-1
git merge feature/module-2

# 不好的做法：等所有功能都完成才合并
# 容易产生大量冲突
```

### 3. 合并前测试

```bash
# 在合并前确保代码通过测试
git switch feature/new-feature
npm test  # 或其他测试命令

# 测试通过后再合并
git switch main
git merge feature/new-feature
```

### 4. 使用有意义的合并信息

```bash
# 好的合并信息
git merge feature/user-auth -m "Merge user authentication feature

Implements:
- User login
- Password reset
- Email verification
"

# 不好的合并信息
git merge feature  # 使用默认信息，不够清晰
```

### 5. 保持主分支稳定

```bash
# 只合并经过测试的代码到 main
# 开发中的代码保留在功能分支

# 好的做法
git switch feature
# ... 开发和测试 ...
git switch main
git merge feature  # 确认无误后才合并

# 不好的做法
git switch main
# 直接在 main 上开发，容易破坏稳定性
```

## 合并 vs 变基

合并和变基（rebase）都可以整合分支，但方式不同：

**合并（Merge）**：
```
        C3 ← C4 (feature)
       ↗         ↘
C1 ← C2           M5 (main)
       ↘         ↗
        C6 ← C7

优点：保留完整历史
缺点：历史可能复杂
```

**变基（Rebase）**：
```
C1 ← C2 ← C6 ← C7 ← C3' ← C4' (main)

优点：历史是直线，清晰
缺点：改写历史，可能危险
```

我们将在下一章详细学习变基。

## 命令速查

| 命令 | 说明 |
|------|------|
| `git merge <branch>` | 合并指定分支到当前分支 |
| `git merge --no-ff <branch>` | 禁用快进合并 |
| `git merge -s <strategy>` | 使用指定策略合并 |
| `git merge -X <option>` | 传递选项给合并策略 |
| `git merge --abort` | 中止合并 |
| `git log --merges` | 查看合并提交 |
| `git log --no-merges` | 查看非合并提交 |
| `git branch --merged` | 查看已合并分支 |
| `git branch --no-merged` | 查看未合并分支 |

## 下一步

掌握了合并的基础后，接下来学习如何处理合并冲突。

下一节：[解决冲突](../conflicts/) →

---

## 💡 练习题

{{< expand "练习 1：快进合并" >}}
**任务**：
1. 创建仓库并提交初始文件
2. 创建功能分支并添加两次提交
3. 合并到 main（应该是快进合并）
4. 验证历史是一条直线

{{< expand "查看答案" >}}
```bash
# 1. 创建仓库
mkdir ff-merge
cd ff-merge
git init -b main

# 2. 初始提交
echo "Hello" > README.md
git add README.md
git commit -m "Initial commit"

# 3. 创建功能分支
git switch -c feature

# 4. 在功能分支添加提交
echo "Feature 1" > feature1.txt
git add feature1.txt
git commit -m "Add feature 1"

echo "Feature 2" > feature2.txt
git add feature2.txt
git commit -m "Add feature 2"

# 5. 切换回 main（没有新提交）
git switch main

# 6. 合并（快进）
git merge feature

# 预期输出：
# Updating abc123..def456
# Fast-forward           ← 注意这里
#  feature1.txt | 1 +
#  feature2.txt | 1 +
#  2 files changed, 2 insertions(+)

# 7. 验证历史
git log --oneline --graph
# * def456 (HEAD -> main, feature) Add feature 2
# * abc123 Add feature 1
# * 789xyz Initial commit

# 注意：历史是一条直线，main 和 feature 指向同一提交
```

**关键点**：
- main 分支没有新提交 → 可以快进
- 不创建新的合并提交
- 历史保持线性
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 2：三方合并" >}}
**任务**：
1. 创建仓库
2. 创建功能分支并提交
3. 在 main 分支也添加提交
4. 合并（应该创建合并提交）
5. 观察分支图

{{< expand "查看答案" >}}
```bash
# 1. 创建仓库和初始提交
git init -b main
echo "Initial" > README.md
git add README.md
git commit -m "C1: Initial"

# 2. 创建功能分支并修改
git switch -c feature
echo "Feature work" > feature.txt
git add feature.txt
git commit -m "C2: Add feature"

# 3. 切换到 main 并修改
git switch main
echo "Main work" > main.txt
git add main.txt
git commit -m "C3: Add main work"

# 4. 合并（三方合并）
git merge feature

# 预期输出：
# Merge made by the 'ort' strategy.   ← 注意这里
#  feature.txt | 1 +
#  1 file changed, 1 insertion(+)

# 5. 查看分支图
git log --oneline --graph --all

# 输出：
# *   abc123 (HEAD -> main) Merge branch 'feature'
# |\
# | * def456 (feature) C2: Add feature
# * | 789xyz C3: Add main work
# |/
# * 012abc C1: Initial

# 6. 查看合并提交的父提交
git show --format="%P" HEAD | head -1
# 789xyz def456  ← 两个父提交
```

**关键点**：
- 两个分支都有新提交 → 必须三方合并
- 创建新的合并提交
- 合并提交有两个父提交
- 分支图显示分叉和合并
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 3：禁用快进合并" >}}
**问题**：为什么有时要禁用快进合并？如何实现？

**场景**：你希望在历史中明确看到每个功能分支的合并点。

{{< expand "查看答案" >}}
```bash
# 场景：两个功能分支的开发
git init -b main
echo "Initial" > README.md
git add README.md
git commit -m "Initial"

# 功能 1
git switch -c feature-1
echo "Feature 1" > f1.txt
git add f1.txt
git commit -m "Add feature 1"

git switch main
git merge --no-ff feature-1 -m "Merge feature-1"
# 即使可以快进，也创建合并提交

# 功能 2
git switch -c feature-2
echo "Feature 2" > f2.txt
git add f2.txt
git commit -m "Add feature 2"

git switch main
git merge --no-ff feature-2 -m "Merge feature-2"

# 查看历史
git log --oneline --graph

# 输出：
# *   def456 (HEAD -> main) Merge feature-2
# |\
# | * abc123 (feature-2) Add feature 2
# |/
# *   789xyz Merge feature-1
# |\
# | * 012abc (feature-1) Add feature 1
# |/
# * 345def Initial
```

**使用 --no-ff 的好处**：

1. **保留分支历史**：
```bash
# 可以看到每个功能的开始和结束
```

2. **方便回滚**：
```bash
# 回滚整个功能分支
git revert -m 1 def456  # 回滚 feature-2 的所有修改
```

3. **清晰的代码审查**：
```bash
# 查看某个功能的所有修改
git log feature-2
```

**配置默认行为**：
```bash
# 设置为总是禁用快进
git config --global merge.ff false

# 只在可以快进时才合并，否则拒绝
git config --global merge.ff only
```

**团队规范示例**：
```bash
# 功能分支合并：不使用快进
git merge --no-ff feature/xxx

# hotfix 合并：允许快进
git merge hotfix/xxx
```
{{< /expand >}}
{{< /expand >}}

---

{{< hint success >}}
**检查清单** - 完成本节后，你应该能够：

- [ ] 理解合并的基本概念
- [ ] 执行基本的分支合并
- [ ] 区分快进合并和三方合并
- [ ] 理解合并提交的结构（两个父提交）
- [ ] 使用 `--no-ff` 选项
- [ ] 了解不同的合并策略
- [ ] 查看合并历史
- [ ] 清理已合并的分支
- [ ] 遵循合并的最佳实践
{{< /hint >}}
