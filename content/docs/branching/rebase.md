---
title: "变基操作"
weight: 5
bookToc: true
---

# 变基操作

变基（Rebase）是整合分支的另一种方式，它可以创建更线性、更清晰的提交历史。本章将学习变基的原理、用法和注意事项。

## 什么是 Rebase

### 变基的基本概念

**变基（Rebase）**是将一系列提交移动到新的基础提交上。它会：

1. 找到两个分支的共同祖先
2. 提取当前分支的所有提交
3. 将这些提交"重放"到目标分支上

### 可视化理解

**变基前**：
```
         C3 ← C4 (feature)
        ↗
C1 ← C2
        ↘
         C5 ← C6 (main)
```

**执行 `git rebase main`**：
```
C1 ← C2 ← C5 ← C6 (main)
                   ↘
                    C3' ← C4' (feature)
```

注意：
- C3 和 C4 被"重放"到 C6 之后
- C3' 和 C4' 是新的提交（内容相同但哈希不同）
- 历史变成了一条直线

{{< hint info >}}
**理解"变基"这个名字**：
- "基"（base）：分支的起点
- "变"（rebase）：改变分支的起点
- feature 分支的起点从 C2 变成了 C6
{{< /hint >}}

## Rebase vs Merge

### 对比图示

**使用 Merge**：
```
         C3 ← C4
        ↗         ↘
C1 ← C2           M7 (main)
        ↘        ↗
         C5 ← C6

结果：保留完整历史，但可能复杂
```

**使用 Rebase**：
```
C1 ← C2 ← C5 ← C6 ← C3' ← C4' (main)

结果：线性历史，简洁清晰
```

### 特性对比

| 特性 | Merge | Rebase |
|------|-------|--------|
| 历史记录 | 保留原始历史 | 创建线性历史 |
| 分支图 | 显示分支分叉 | 一条直线 |
| 提交哈希 | 不变 | 改变 |
| 安全性 | 安全，不修改历史 | 改写历史，需谨慎 |
| 冲突解决 | 一次解决所有冲突 | 可能多次解决冲突 |
| 适用场景 | 公共分支、团队协作 | 本地分支、整理提交 |
| 回滚 | 容易（revert 合并提交） | 困难 |

## 基本的 Rebase 操作

### 命令语法

```bash
# 将当前分支变基到指定分支
git rebase <base-branch>

# 示例：将 feature 分支变基到 main
git switch feature
git rebase main
```

### 完整示例

```bash
# 1. 创建仓库
mkdir rebase-demo
cd rebase-demo
git init -b main

# 2. 初始提交
echo "Line 1" > file.txt
git add file.txt
git commit -m "C1: Initial"

echo "Line 2" >> file.txt
git add file.txt
git commit -m "C2: Add line 2"

# 3. 创建 feature 分支
git switch -c feature

echo "Line 3 (feature)" >> file.txt
git add file.txt
git commit -m "C3: Feature adds line 3"

echo "Line 4 (feature)" >> file.txt
git add file.txt
git commit -m "C4: Feature adds line 4"

# 4. 切换回 main，添加新提交
git switch main

echo "Line 3 (main)" >> file.txt
git add file.txt
git commit -m "C5: Main adds line 3"

# 5. 查看分支图（变基前）
git log --all --oneline --graph
# * a1b2c3d (HEAD -> main) C5: Main adds line 3
# | * d4e5f6g (feature) C4: Feature adds line 4
# | * c3d4e5f C3: Feature adds line 3
# |/
# * b2c3d4e C2: Add line 2
# * e7f8g9h C1: Initial

# 6. 变基 feature 到 main
git switch feature
git rebase main

# 7. 查看分支图（变基后）
git log --all --oneline --graph
# * h8i9j0k (HEAD -> feature) C4: Feature adds line 4
# * g7h8i9j C3: Feature adds line 3
# * a1b2c3d (main) C5: Main adds line 3
# * b2c3d4e C2: Add line 2
# * e7f8g9h C1: Initial

# 注意：现在是一条直线，feature 在 main 之后
```

### Fast-forward 合并

变基后，合并变成了快进：

```bash
# 切换到 main
git switch main

# 合并 feature（快进）
git merge feature

# 输出：
# Updating a1b2c3d..h8i9j0k
# Fast-forward
#  file.txt | 2 ++
#  1 file changed, 2 insertions(+)

# 查看历史（完全线性）
git log --oneline --graph
# * h8i9j0k (HEAD -> main, feature) C4: Feature adds line 4
# * g7h8i9j C3: Feature adds line 3
# * a1b2c3d C5: Main adds line 3
# * b2c3d4e C2: Add line 2
# * e7f8g9h C1: Initial
```

## 处理 Rebase 冲突

### 冲突场景

当变基时修改与目标分支冲突，Git 会暂停：

```bash
git rebase main

# 输出：
# CONFLICT (content): Merge conflict in file.txt
# error: could not apply c3d4e5f... C3: Feature adds line 3
# Resolve all conflicts manually, mark them as resolved with
# "git add/rm <conflicted_files>", then run "git rebase --continue".
# You can instead skip this commit: "git rebase --skip".
# Or abort the rebase with: "git rebase --abort".
```

### 解决冲突的步骤

```bash
# 1. 查看冲突文件
git status
# rebase in progress; onto a1b2c3d
# You are currently rebasing branch 'feature' on 'a1b2c3d'.
#   (fix conflicts and then run "git rebase --continue")
#
# Unmerged paths:
#   both modified:   file.txt

# 2. 编辑文件解决冲突
vim file.txt
# ... 删除冲突标记，保留想要的内容 ...

# 3. 标记为已解决
git add file.txt

# 4. 继续变基
git rebase --continue

# 5. 如果还有冲突，重复步骤 2-4
# 如果不想继续，可以中止
git rebase --abort
```

### Rebase 冲突 vs Merge 冲突

**Merge**：一次性解决所有冲突
```bash
git merge feature
# 解决所有冲突
git commit
# 完成
```

**Rebase**：可能需要多次解决冲突
```bash
git rebase main
# 解决 C3 的冲突
git add .
git rebase --continue

# 可能还需要解决 C4 的冲突
# 解决 C4 的冲突
git add .
git rebase --continue
# 完成
```

{{< hint warning >}}
**注意**：变基时可能需要多次解决相同文件的冲突，因为是逐个提交重放。这也是为什么大型功能分支更适合用 merge 而不是 rebase。
{{< /hint >}}

## 交互式 Rebase

交互式变基允许你修改提交历史，是 Git 最强大的功能之一。

### 启动交互式 Rebase

```bash
# 交互式变基最近 3 次提交
git rebase -i HEAD~3

# 交互式变基从指定提交开始
git rebase -i <commit-hash>

# 交互式变基到 main
git rebase -i main
```

### 交互式编辑器

执行后会打开编辑器，显示提交列表：

```
pick a1b2c3d Add feature A
pick d4e5f6g Add feature B
pick g7h8i9j Fix typo

# Rebase commands:
# p, pick <commit> = use commit
# r, reword <commit> = use commit, but edit the commit message
# e, edit <commit> = use commit, but stop for amending
# s, squash <commit> = use commit, but meld into previous commit
# f, fixup <commit> = like "squash", but discard this commit's log message
# x, exec <command> = run command (the rest of the line) using shell
# b, break = stop here (continue rebase later with 'git rebase --continue')
# d, drop <commit> = remove commit
# l, label <label> = label current HEAD with a name
# t, reset <label> = reset HEAD to a label
# m, merge [-C <commit> | -c <commit>] <label> [# <oneline>]
```

### 常用操作

#### 1. 修改提交信息（reword）

```bash
# 启动交互式 rebase
git rebase -i HEAD~3

# 将 pick 改为 reword（或简写 r）
reword a1b2c3d Add feature A
pick d4e5f6g Add feature B
pick g7h8i9j Fix typo

# 保存退出，Git 会打开编辑器让你修改提交信息
```

#### 2. 合并提交（squash）

```bash
# 将多个提交合并为一个
pick a1b2c3d Add user model
squash d4e5f6g Add user validation
squash g7h8i9j Fix user model bug

# 保存后，Git 会让你编辑合并后的提交信息
# 结果：三个提交变成一个
```

**squash vs fixup**：
- `squash`：保留所有提交信息，让你编辑
- `fixup`：丢弃该提交的信息，只保留第一个提交的信息

```bash
pick a1b2c3d Add user feature
fixup d4e5f6g Fix typo
fixup g7h8i9j Another fix

# 结果：只保留 "Add user feature" 的提交信息
```

#### 3. 编辑提交（edit）

```bash
# 停在某个提交，允许修改
pick a1b2c3d Add feature A
edit d4e5f6g Add feature B
pick g7h8i9j Fix typo

# 保存后，Git 会停在 d4e5f6g
# 此时可以修改文件、添加文件等
vim file.txt
git add file.txt
git commit --amend

# 继续
git rebase --continue
```

#### 4. 删除提交（drop）

```bash
# 删除某个提交
pick a1b2c3d Add feature A
drop d4e5f6g Temporary debug code
pick g7h8i9j Add feature B

# 或直接删除该行，效果相同
pick a1b2c3d Add feature A
pick g7h8i9j Add feature B
```

#### 5. 重新排序

```bash
# 调整提交顺序（直接移动行）
pick g7h8i9j Add feature B
pick a1b2c3d Add feature A
pick d4e5f6g Add feature C

# 保存后，提交顺序会改变
```

### 完整示例：整理提交历史

```bash
# 1. 创建一些混乱的提交
git commit -m "Add login feature"
git commit -m "Fix typo in login"
git commit -m "Add logout feature"
git commit -m "WIP: debugging"
git commit -m "Fix login bug"
git commit -m "Add documentation"

# 2. 查看历史
git log --oneline
# f6g7h8i Add documentation
# e5f6g7h Fix login bug
# d4e5f6g WIP: debugging
# c3d4e5f Add logout feature
# b2c3d4e Fix typo in login
# a1b2c3d Add login feature

# 3. 交互式变基
git rebase -i HEAD~6

# 4. 编辑：
pick a1b2c3d Add login feature
fixup b2c3d4e Fix typo in login
fixup e5f6g7h Fix login bug
pick c3d4e5f Add logout feature
drop d4e5f6g WIP: debugging
pick f6g7h8i Add documentation

# 5. 结果：
git log --oneline
# h8i9j0k Add documentation
# g7h8i9j Add logout feature
# f6g7h8i Add login feature

# 提交从 6 个变成 3 个，更清晰！
```

## Rebase 到指定提交

### rebase --onto

`--onto` 选项允许更精确地控制变基：

```bash
# 语法
git rebase --onto <newbase> <oldbase> <branch>

# 将 branch 从 oldbase 到 branch 的提交，变基到 newbase
```

### 使用场景

**场景 1：从错误的分支创建了功能分支**

```
main:     A ← B ← C
               ↘
develop:        D ← E
                    ↘
feature:             F ← G

# 应该从 main 创建，但误从 develop 创建
# 想要：
main:     A ← B ← C
                   ↘
feature:             F' ← G'
```

```bash
# 将 feature 从 develop 移到 main
git rebase --onto main develop feature

# 结果：
main:     A ← B ← C ← F' ← G' (feature)
               ↘
develop:        D ← E
```

**场景 2：删除中间的提交**

```
A ← B ← C ← D ← E

# 想删除 C 和 D，保留 E
```

```bash
# 将 E 直接接到 B 后面
git rebase --onto B D E

# 结果：
A ← B ← E'
```

## Rebase 的黄金法则

{{< hint danger >}}
**永远不要变基已经推送到公共仓库的提交！**
{{< /hint >}}

### 为什么？

变基会改写历史（改变提交哈希），如果其他人基于旧的提交工作，会导致混乱。

**问题场景**：

```bash
# Alice 的仓库
main: A ← B ← C

# Bob 基于 C 创建分支
feature: A ← B ← C ← D

# Alice 变基并强制推送
git rebase ...
git push -f
# main: A ← B' ← C'

# Bob 尝试推送
git push
# Error! C 和 C' 是不同的提交
# Bob 的历史基于已不存在的 C
```

### 安全使用 Rebase

✅ **可以变基的情况**：
- 本地分支，未推送
- 个人功能分支，只有你在使用
- 明确告知团队并协调的情况

❌ **不要变基的情况**：
- 已推送到公共仓库的提交
- 其他人基于此工作的分支
- main、develop 等共享分支

### 修复已推送的变基

如果不小心变基了公共分支：

```bash
# 方法 1：恢复到变基前（使用 reflog）
git reflog
git reset --hard HEAD@{1}  # 回到变基前

# 方法 2：告知团队，让大家重新克隆
# （不推荐，会给团队带来麻烦）
```

## Rebase vs Merge：如何选择

### 使用 Merge

```bash
git merge feature
```

**适用场景**：
- ✅ 合并公共分支
- ✅ 保留完整历史
- ✅ 团队协作
- ✅ 代码审查
- ✅ 大型功能分支

**优点**：
- 安全，不修改历史
- 保留完整的分支信息
- 冲突只需解决一次

**缺点**：
- 历史可能复杂
- 分支图可能混乱

### 使用 Rebase

```bash
git rebase main
```

**适用场景**：
- ✅ 整理本地提交
- ✅ 保持历史线性
- ✅ 个人功能分支
- ✅ 小的功能分支
- ✅ 提交前清理

**优点**：
- 历史清晰线性
- 便于理解
- 便于 bisect 等操作

**缺点**：
- 改写历史（危险）
- 可能多次解决冲突
- 不保留分支信息

### 推荐策略

```bash
# 1. 功能分支开发期间：使用 rebase 保持更新
git switch feature
git rebase main  # 定期变基到最新的 main

# 2. 功能完成后：使用 merge 合并到 main
git switch main
git merge feature  # 或 git merge --no-ff feature

# 这样既保持了功能分支的清晰，又保留了合并记录
```

## 常用 Rebase 技巧

### 1. 拉取时自动 Rebase

```bash
# 配置
git config --global pull.rebase true

# 现在 git pull 等同于
git fetch
git rebase origin/main
```

### 2. 保留合并提交

```bash
# 变基时保留合并提交
git rebase -p main
git rebase --preserve-merges main

# 或使用新的选项（推荐）
git rebase --rebase-merges main
```

### 3. 自动 Squash

```bash
# 使用 fixup 标记提交
git commit --fixup=<commit-hash>

# 然后自动 squash
git rebase -i --autosquash main
```

### 4. Rebase 到远程分支

```bash
# 变基到远程分支
git fetch origin
git rebase origin/main
```

## 命令速查

| 命令 | 说明 |
|------|------|
| `git rebase <branch>` | 变基到指定分支 |
| `git rebase -i <commit>` | 交互式变基 |
| `git rebase --continue` | 解决冲突后继续 |
| `git rebase --abort` | 中止变基 |
| `git rebase --skip` | 跳过当前提交 |
| `git rebase --onto <new> <old>` | 变基到指定位置 |
| `git rebase -i HEAD~n` | 交互式变基最近 n 次提交 |
| `git pull --rebase` | 拉取并变基 |
| `git config pull.rebase true` | 配置拉取时自动变基 |

## 下一步

掌握了变基操作后，接下来学习不同的分支管理策略。

下一节：[分支策略](../strategies/) →

---

## 💡 练习题

{{< expand "练习 1：基础 Rebase" >}}
**任务**：
1. 创建 main 和 feature 分支，各有提交
2. 将 feature 变基到 main
3. 快进合并到 main
4. 验证历史是线性的

{{< expand "查看答案" >}}
```bash
# 1. 创建仓库
mkdir rebase-practice
cd rebase-practice
git init -b main

# 2. 在 main 分支提交
echo "Main 1" > main.txt
git add main.txt
git commit -m "M1: Main commit 1"

echo "Main 2" >> main.txt
git add main.txt
git commit -m "M2: Main commit 2"

# 3. 创建 feature 分支
git switch -c feature

echo "Feature 1" > feature.txt
git add feature.txt
git commit -m "F1: Feature commit 1"

echo "Feature 2" >> feature.txt
git add feature.txt
git commit -m "F2: Feature commit 2"

# 4. 在 main 继续提交
git switch main
echo "Main 3" >> main.txt
git add main.txt
git commit -m "M3: Main commit 3"

# 5. 查看分支图（变基前）
git log --all --oneline --graph
# * abc123 (HEAD -> main) M3: Main commit 3
# | * def456 (feature) F2: Feature commit 2
# | * 789xyz F1: Feature commit 1
# |/
# * 012abc M2: Main commit 2
# * 345def M1: Main commit 1

# 6. 变基 feature 到 main
git switch feature
git rebase main

# 输出：
# Successfully rebased and updated refs/heads/feature.

# 7. 查看分支图（变基后）
git log --all --oneline --graph
# * hij789 (HEAD -> feature) F2: Feature commit 2
# * ghi678 F1: Feature commit 1
# * abc123 (main) M3: Main commit 3
# * 012abc M2: Main commit 2
# * 345def M1: Main commit 1

# 注意：现在是一条直线！

# 8. 快进合并到 main
git switch main
git merge feature

# 输出：
# Updating abc123..hij789
# Fast-forward
#  feature.txt | 2 ++
#  1 file changed, 2 insertions(+)

# 9. 验证历史
git log --oneline --graph
# * hij789 (HEAD -> main, feature) F2: Feature commit 2
# * ghi678 F1: Feature commit 1
# * abc123 M3: Main commit 3
# * 012abc M2: Main commit 2
# * 345def M1: Main commit 1

# 完美的线性历史！
```
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 2：交互式 Rebase" >}}
**任务**：
使用交互式 rebase 清理提交历史：
1. 合并相关的提交
2. 修改提交信息
3. 删除临时提交

{{< expand "查看答案" >}}
```bash
# 1. 创建一些混乱的提交
git init -b main
echo "v1" > app.js && git add . && git commit -m "Add app.js"
echo "v2" > app.js && git add . && git commit -m "Update app.js"
echo "v3" > app.js && git add . && git commit -m "Fix typo"
echo "test" > test.js && git add . && git commit -m "Add test"
echo "debug" > debug.js && git add . && git commit -m "WIP: debug"
echo "v4" > app.js && git add . && git commit -m "More fixes"

# 2. 查看历史
git log --oneline
# f6g7h8i More fixes
# e5f6g7h WIP: debug
# d4e5f6g Add test
# c3d4e5f Fix typo
# b2c3d4e Update app.js
# a1b2c3d Add app.js

# 3. 交互式变基
git rebase -i HEAD~6

# 4. 编辑器中修改：
pick a1b2c3d Add app.js
fixup b2c3d4e Update app.js
fixup c3d4e5f Fix typo
fixup f6g7h8i More fixes
pick d4e5f6g Add test
drop e5f6g7h WIP: debug

# 5. 保存退出，查看结果
git log --oneline
# d4e5f6g Add test
# a1b2c3d Add app.js

# 从 6 个提交变成 2 个！

# 6. 如果想修改提交信息
git rebase -i HEAD~2

# 编辑器：
reword a1b2c3d Add app.js
pick d4e5f6g Add test

# 保存后会打开新编辑器修改提交信息
# 改为：Implement main application logic

# 7. 最终结果
git log --oneline
# d4e5f6g Add test
# new-hash Implement main application logic
```

**常见操作总结**：
- `pick`：保持提交
- `reword`：修改提交信息
- `edit`：停下来修改提交内容
- `squash`：合并到前一个提交（保留信息）
- `fixup`：合并到前一个提交（丢弃信息）
- `drop`：删除提交
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 3：Rebase vs Merge 选择" >}}
**问题**：对于以下场景，应该使用 rebase 还是 merge？

A. 你在个人功能分支工作了一周，main 分支有了新提交，你想更新你的分支

B. 你的功能分支已完成并推送，现在要合并到 main

C. 你的本地提交历史很混乱，有很多 "WIP" 提交，准备推送前想清理

D. 团队的 main 分支，要合并一个大型功能分支

{{< expand "查看答案" >}}
**答案**：

**A. 使用 Rebase**
```bash
git switch feature
git rebase main

# 原因：
# - 功能分支是个人的，未推送
# - 保持功能分支历史清晰
# - 避免不必要的合并提交
```

**B. 使用 Merge**
```bash
git switch main
git merge feature

# 或使用 --no-ff
git merge --no-ff feature -m "Merge feature: Add user auth"

# 原因：
# - 功能分支已推送，可能有协作
# - 保留功能分支的合并记录
# - 方便代码审查和回滚
# - 不改写公共历史
```

**C. 使用 Rebase（交互式）**
```bash
git rebase -i HEAD~10

# 在编辑器中：
pick abc123 Implement feature
fixup def456 WIP: testing
fixup 789xyz WIP: fix bug
pick 012abc Add tests
fixup 345def Fix typo

# 原因：
# - 本地提交，未推送
# - 清理提交历史
# - 让历史更专业
```

**D. 使用 Merge（禁用 fast-forward）**
```bash
git switch main
git merge --no-ff feature-big -m "Merge feature: Payment system

Implemented:
- Payment gateway integration
- Transaction history
- Refund processing
"

# 原因：
# - 公共分支，团队协作
# - 大型功能，需要保留分支历史
# - 方便整体回滚
# - 清晰的代码审查边界
```

**决策树**：
```
是否已推送？
├─ 是 → 使用 Merge
└─ 否 →
    ├─ 需要清理历史？→ 使用 Interactive Rebase
    ├─ 更新功能分支？→ 使用 Rebase
    └─ 合并到主分支？→ 使用 Merge
```
{{< /expand >}}
{{< /expand >}}

---

{{< hint success >}}
**检查清单** - 完成本节后，你应该能够：

- [ ] 理解变基的概念和原理
- [ ] 使用 `git rebase` 变基分支
- [ ] 处理变基过程中的冲突
- [ ] 使用交互式变基整理提交历史
- [ ] 理解 rebase 和 merge 的区别
- [ ] 知道何时使用 rebase，何时使用 merge
- [ ] 理解变基的黄金法则（不变基公共提交）
- [ ] 使用 `git rebase --onto` 进行精确变基
- [ ] 使用 squash、fixup、reword 等操作
- [ ] 配置 `pull.rebase` 选项
{{< /hint >}}
