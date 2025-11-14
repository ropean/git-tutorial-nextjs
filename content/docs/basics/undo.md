---
title: "撤销更改"
weight: 5
bookToc: true
---

# 撤销更改

本章将学习如何在 Git 中撤销各种操作。这是 Git 最强大但也需要谨慎使用的功能之一。

{{< hint danger >}}
**重要警告**：某些撤销操作是不可逆的！特别是那些会丢弃修改或重写历史的命令。使用前请确保了解后果。
{{< /hint >}}

## 撤销的三个层次

根据修改所在的位置，撤销操作分为三个层次：

```
工作区修改 ──────────────→ git restore <file>
                          git checkout -- <file>

暂存区修改 ──────────────→ git restore --staged <file>
                          git reset HEAD <file>

仓库修改（提交）─────────→ git reset
                          git revert
                          git commit --amend
```

## 撤销工作区修改

### git restore（推荐，Git 2.23+）

`git restore` 是新版 Git 引入的命令，用于恢复工作区文件。

```bash
# 撤销工作区的修改（恢复到暂存区或最后一次提交的状态）
git restore <file>

# 撤销所有工作区的修改
git restore .

# 撤销多个文件
git restore file1.txt file2.txt

# 从指定提交恢复
git restore --source=<commit> <file>
```

**实例**：

```bash
# 修改文件
echo "Wrong content" >> README.md

# 查看修改
git diff README.md

# 撤销修改（恢复到修改前）
git restore README.md

# 再次查看，修改已消失
git diff README.md
```

{{< hint danger >}}
**警告**：`git restore` 会永久丢弃工作区的修改，无法恢复！
{{< /hint >}}

### git checkout --（旧版本）

在旧版本 Git 中，使用 `git checkout --` 撤销工作区修改：

```bash
# 撤销工作区的修改
git checkout -- <file>

# 撤销所有修改
git checkout -- .
```

**实例**：

```bash
# 修改文件
echo "Mistake" > file.txt

# 撤销修改
git checkout -- file.txt
```

### 实战示例

```bash
# 初始化测试环境
mkdir undo-demo
cd undo-demo
git init -b main

# 创建并提交文件
echo "Original content" > file.txt
git add file.txt
git commit -m "Initial commit"

# 场景 1：撤销未暂存的修改
echo "Mistake" >> file.txt
git status
# modified:   file.txt

git restore file.txt
# 修改被撤销

# 场景 2：选择性撤销
echo "Change 1" > file1.txt
echo "Change 2" > file2.txt
git restore file1.txt
# 只撤销 file1.txt，保留 file2.txt 的修改
```

## 取消暂存

如果误将文件添加到暂存区，可以取消暂存而不丢失修改。

### git restore --staged（推荐）

```bash
# 取消暂存单个文件
git restore --staged <file>

# 取消暂存所有文件
git restore --staged .

# 文件会回到工作区，修改不会丢失
```

### git reset HEAD（旧版本）

```bash
# 取消暂存
git reset HEAD <file>

# 取消所有暂存
git reset HEAD
```

### 实战示例

```bash
# 修改多个文件
echo "Update 1" >> file1.txt
echo "Update 2" >> file2.txt
echo "Secret" >> password.txt

# 误将所有文件添加到暂存区
git add .

git status
# Changes to be committed:
#   modified:   file1.txt
#   modified:   file2.txt
#   new file:   password.txt

# 取消暂存敏感文件
git restore --staged password.txt

git status
# Changes to be committed:
#   modified:   file1.txt
#   modified:   file2.txt
# Untracked files:
#   password.txt

# password.txt 回到工作区，内容不变
```

## 修改最后一次提交

### git commit --amend

`--amend` 选项用于修改最后一次提交。

```bash
# 修改提交信息
git commit --amend -m "新的提交信息"

# 添加遗漏的文件到上次提交
git add forgotten-file.txt
git commit --amend --no-edit

# 修改提交信息（打开编辑器）
git commit --amend
```

{{< hint warning >}}
**注意**：
- `--amend` 会替换最后一次提交，而不是创建新提交
- 不要修改已经推送到远程的提交
- 会改变提交的哈希值
{{< /hint >}}

### 实战示例

#### 场景 1：修改提交信息

```bash
# 提交时写错了信息
git commit -m "Add new featur"  # 拼写错误

# 修改提交信息
git commit --amend -m "Add new feature"
```

#### 场景 2：添加遗漏的文件

```bash
# 提交了功能，但忘记添加测试文件
git add feature.js
git commit -m "Add new feature"

# 发现忘记添加测试
git add feature.test.js
git commit --amend --no-edit

# 现在上次提交包含两个文件
git show --name-only
# feature.js
# feature.test.js
```

#### 场景 3：修改提交内容

```bash
# 提交后发现代码有小错误
git commit -m "Add login function"

# 修复错误
vim login.js
git add login.js

# 修正上次提交
git commit --amend --no-edit
```

## git reset - 重置到指定状态

`git reset` 是强大的撤销工具，可以重置到任何提交。

### 三种模式

```bash
# --soft：只移动 HEAD，保留暂存区和工作区
git reset --soft <commit>

# --mixed（默认）：移动 HEAD，重置暂存区，保留工作区
git reset --mixed <commit>
git reset <commit>

# --hard：移动 HEAD，重置暂存区和工作区（危险！）
git reset --hard <commit>
```

### 模式对比

| 模式 | HEAD | 暂存区 | 工作区 | 使用场景 |
|------|------|--------|--------|----------|
| `--soft` | 重置 | 保留 | 保留 | 修改提交，保留修改 |
| `--mixed` | 重置 | 重置 | 保留 | 取消暂存，保留修改 |
| `--hard` | 重置 | 重置 | 重置 | 完全撤销，丢弃所有修改 |

### 可视化理解

```
原始状态：
A --- B --- C --- D (HEAD)

执行 git reset --soft B：
A --- B --- C --- D
      ↑
     HEAD
工作区和暂存区保留 C 和 D 的修改

执行 git reset --mixed B：
A --- B --- C --- D
      ↑
     HEAD
工作区保留修改，暂存区清空

执行 git reset --hard B：
A --- B --- C --- D (孤立)
      ↑
     HEAD
工作区和暂存区都被重置，C 和 D 的修改丢失
```

### 实战示例

#### 场景 1：撤销最后一次提交，保留修改（--soft）

```bash
# 创建提交
echo "Content" > file.txt
git add file.txt
git commit -m "Add file"

# 撤销提交，但保留修改在暂存区
git reset --soft HEAD^

git status
# Changes to be committed:
#   new file:   file.txt

# 可以重新提交或继续修改
```

#### 场景 2：撤销提交和暂存，保留工作区修改（--mixed）

```bash
# 创建提交
echo "Content" > file.txt
git add file.txt
git commit -m "Add file"

# 撤销提交和暂存
git reset HEAD^
# 等同于
git reset --mixed HEAD^

git status
# Untracked files:
#   file.txt

# 修改保留在工作区，可以继续编辑
```

#### 场景 3：完全撤销，丢弃所有修改（--hard）

```bash
# 创建一些提交
echo "v1" > file.txt && git add . && git commit -m "v1"
echo "v2" >> file.txt && git add . && git commit -m "v2"
echo "v3" >> file.txt && git add . && git commit -m "v3"

# 完全回退到 v1
git reset --hard HEAD~2

# 所有修改丢失
cat file.txt
# v1
```

{{< hint danger >}}
**危险操作**：`git reset --hard` 会永久丢弃所有修改！使用前请确保：
- 不需要这些修改，或
- 已经备份了修改，或
- 知道如何用 `git reflog` 恢复
{{< /hint >}}

### 常用的 reset 操作

```bash
# 撤销最后一次提交
git reset HEAD^
git reset HEAD~1

# 撤销最后 3 次提交
git reset HEAD~3

# 回到指定提交
git reset abc1234

# 取消所有暂存
git reset

# 完全重置到远程分支状态
git reset --hard origin/main
```

## git revert - 安全的撤销提交

`git revert` 创建一个新提交来撤销之前的提交，不会改写历史。

### 基本用法

```bash
# 撤销指定提交
git revert <commit>

# 撤销最后一次提交
git revert HEAD

# 撤销多个提交
git revert <commit1> <commit2>

# 撤销一系列提交
git revert <commit1>..<commit2>
```

### reset vs revert

```
git reset（改写历史）：
A --- B --- C --- D (HEAD)
          ↓ git reset B
A --- B (HEAD)
# C 和 D 消失（但可以用 reflog 找回）

git revert（保留历史）：
A --- B --- C --- D (HEAD)
          ↓ git revert C
A --- B --- C --- D --- C' (HEAD)
# C' 是撤销 C 的新提交
```

{{< hint info >}}
**何时使用**：
- `git reset` - 撤销本地提交（未推送）
- `git revert` - 撤销已推送的提交（安全）
{{< /hint >}}

### 实战示例

```bash
# 创建一些提交
echo "Line 1" > file.txt && git add . && git commit -m "Add line 1"
echo "Line 2" >> file.txt && git add . && git commit -m "Add line 2"
echo "Line 3" >> file.txt && git add . && git commit -m "Add line 3"

git log --oneline
# c3d4e5f Add line 3
# b2c3d4e Add line 2
# a1b2c3d Add line 1

# 撤销 "Add line 2"
git revert b2c3d4e

# Git 会打开编辑器让你编辑提交信息
# 默认信息：Revert "Add line 2"

# 查看历史
git log --oneline
# d4e5f6a Revert "Add line 2"
# c3d4e5f Add line 3
# b2c3d4e Add line 2
# a1b2c3d Add line 1

# 查看文件内容
cat file.txt
# Line 1
# Line 3
# Line 2 被移除了
```

### revert 选项

```bash
# 撤销但不自动提交（可以修改后再提交）
git revert --no-commit <commit>
git revert -n <commit>

# 撤销合并提交（需要指定父提交）
git revert -m 1 <merge-commit>

# 编辑提交信息
git revert --edit <commit>

# 不编辑提交信息
git revert --no-edit <commit>
```

## git reflog - 找回丢失的提交

`reflog` 记录了 HEAD 的所有移动，即使提交被删除也能找回。

### 基本用法

```bash
# 查看 reflog
git reflog

# 查看详细信息
git reflog show

# 查看指定分支的 reflog
git reflog show <branch>
```

### 输出格式

```bash
$ git reflog

3a7d2f9 HEAD@{0}: commit: Add new feature
1b2c3d4 HEAD@{1}: commit: Fix bug
a1b2c3d HEAD@{2}: reset: moving to HEAD^
5c6d7e8 HEAD@{3}: commit: Bad commit
a1b2c3d HEAD@{4}: commit: Initial commit
```

### 恢复丢失的提交

```bash
# 场景：错误地使用了 reset --hard
echo "Important work" > work.txt
git add work.txt
git commit -m "Important work"

# 记下这个提交的哈希
git log --oneline
# abc1234 Important work

# 错误地重置
git reset --hard HEAD^

# 工作丢失了！
# 别慌，用 reflog 找回

# 查看 reflog
git reflog
# HEAD@{0}: reset: moving to HEAD^
# HEAD@{1}: commit: Important work

# 恢复到那个提交
git reset --hard HEAD@{1}
# 或
git reset --hard abc1234

# 工作找回了！
cat work.txt
# Important work
```

### 实战示例

#### 场景 1：找回误删的分支

```bash
# 创建分支并工作
git checkout -b feature
echo "Feature work" > feature.txt
git add feature.txt
git commit -m "Add feature"

# 切换回 main
git checkout main

# 误删分支
git branch -D feature
# Deleted branch feature (was abc1234).

# 使用 reflog 找回
git reflog
# abc1234 HEAD@{1}: commit: Add feature

# 恢复分支
git checkout -b feature abc1234

# 分支恢复了！
```

#### 场景 2：撤销错误的 rebase

```bash
# rebase 前
git reflog
# 记住当前位置

# 执行 rebase（假设出错了）
git rebase main

# 撤销 rebase
git reset --hard HEAD@{1}
# 或使用 ORIG_HEAD
git reset --hard ORIG_HEAD
```

## 撤销场景速查

### 场景 1：撤销工作区修改

```bash
# 问题：修改了文件但还没有 add
# 解决：
git restore <file>
# 或旧版本
git checkout -- <file>
```

### 场景 2：取消暂存

```bash
# 问题：git add 了不该添加的文件
# 解决：
git restore --staged <file>
# 或旧版本
git reset HEAD <file>
```

### 场景 3：修改最后一次提交

```bash
# 问题：提交信息写错了
# 解决：
git commit --amend -m "正确的信息"

# 问题：忘记添加文件
# 解决：
git add forgotten-file.txt
git commit --amend --no-edit
```

### 场景 4：撤销最后一次提交，保留修改

```bash
# 解决：
git reset --soft HEAD^
# 或
git reset HEAD^
```

### 场景 5：完全撤销最后一次提交

```bash
# 解决（谨慎）：
git reset --hard HEAD^
```

### 场景 6：撤销已推送的提交

```bash
# 解决（安全）：
git revert <commit>
```

### 场景 7：回到某个历史版本

```bash
# 临时查看：
git checkout <commit>

# 永久回退（未推送）：
git reset --hard <commit>

# 永久回退（已推送）：
git revert <commit>
```

### 场景 8：找回丢失的提交

```bash
# 解决：
git reflog
git reset --hard <commit-hash>
```

## 安全撤销的最佳实践

### 1. 撤销前先备份

```bash
# 创建备份分支
git branch backup

# 进行撤销操作
git reset --hard HEAD~3

# 如果出错，可以恢复
git reset --hard backup

# 确认无误后删除备份
git branch -d backup
```

### 2. 使用 --hard 前先检查

```bash
# 查看将要丢失的内容
git diff HEAD~3 HEAD

# 确认后再执行
git reset --hard HEAD~3
```

### 3. 已推送的提交用 revert

```bash
# 不要用 reset
# git reset --hard HEAD^  # ❌ 危险

# 使用 revert
git revert HEAD  # ✅ 安全
```

### 4. 定期查看 reflog

```bash
# 了解你的操作历史
git reflog

# 知道如何找回误删的内容
```

### 5. 使用 stash 临时保存

```bash
# 在做危险操作前，先保存工作区
git stash

# 进行操作
git reset --hard HEAD^

# 如果需要，恢复工作区
git stash pop
```

## 危险操作警告

{{< hint danger >}}
以下操作会永久丢失数据，使用前请三思：

1. **git reset --hard**
   - 永久丢弃工作区和暂存区的修改
   - 除非用 reflog，否则无法恢复

2. **git clean -fd**
   - 删除未跟踪的文件和目录
   - 无法恢复

3. **修改已推送的历史**
   - `git push --force` 会覆盖远程历史
   - 影响其他协作者

4. **git filter-branch / git filter-repo**
   - 重写整个历史
   - 几乎不可逆

**安全提示**：
- 使用 `--dry-run` 选项预览结果
- 创建备份分支
- 先在测试分支上练习
- 不确定时寻求帮助
{{< /hint >}}

## 命令速查

| 场景 | 命令 | 安全性 |
|------|------|--------|
| 撤销工作区修改 | `git restore <file>` | ⚠️ 丢失修改 |
| 取消暂存 | `git restore --staged <file>` | ✅ 安全 |
| 修改最后提交 | `git commit --amend` | ⚠️ 改写历史 |
| 撤销提交（本地） | `git reset HEAD^` | ⚠️ 改写历史 |
| 撤销提交（已推送） | `git revert <commit>` | ✅ 安全 |
| 完全重置 | `git reset --hard <commit>` | ⛔ 危险 |
| 找回丢失提交 | `git reflog` + `git reset` | ✅ 救命稻草 |

## 下一步

掌握了撤销操作后，接下来学习如何忽略不想跟踪的文件。

下一节：[忽略文件](../gitignore/) →

---

## 💡 练习题

{{< expand "练习 1：撤销工作区修改" >}}
**任务**：
1. 创建仓库并提交一个文件
2. 修改文件但不暂存
3. 撤销修改
4. 验证文件恢复到原始状态

{{< expand "查看答案" >}}
```bash
# 1. 创建仓库
mkdir undo-practice
cd undo-practice
git init -b main

# 创建并提交文件
echo "Original content" > file.txt
git add file.txt
git commit -m "Initial commit"

# 2. 修改文件
echo "Mistake" >> file.txt
cat file.txt
# Original content
# Mistake

# 3. 撤销修改
git restore file.txt

# 4. 验证
cat file.txt
# Original content
# 修改已被撤销
```
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 2：理解 reset 的三种模式" >}}
**任务**：创建提交，然后分别尝试三种 reset 模式，观察区别

{{< expand "查看答案" >}}
```bash
# 准备环境
git init -b main
echo "v1" > file.txt
git add file.txt
git commit -m "v1"
echo "v2" >> file.txt
git add file.txt
git commit -m "v2"

# 场景 1：--soft
git reset --soft HEAD^
git status
# Changes to be committed:
#   modified:   file.txt
# 提交被撤销，但修改保留在暂存区

# 恢复
git commit -m "v2"

# 场景 2：--mixed（默认）
git reset HEAD^
git status
# Changes not staged for commit:
#   modified:   file.txt
# 提交和暂存都被撤销，修改保留在工作区

# 恢复
git add file.txt
git commit -m "v2"

# 场景 3：--hard
git reset --hard HEAD^
git status
# nothing to commit, working tree clean
cat file.txt
# v1
# 所有修改都被丢弃
```

**总结**：
- `--soft`：只撤销提交
- `--mixed`：撤销提交和暂存
- `--hard`：撤销一切（危险！）
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 3：用 reflog 找回丢失的提交" >}}
**场景**：你做了一些工作，提交后又误删了，现在要找回来。

{{< expand "查看答案" >}}
```bash
# 创建重要工作
git init -b main
echo "Important work" > work.txt
git add work.txt
git commit -m "Important work"

# 记住这个提交
git log --oneline
# abc1234 Important work

# 误删（使用 reset --hard）
git reset --hard HEAD^

# 工作丢失了
ls
# 文件不见了

# 使用 reflog 找回
git reflog
# HEAD@{0}: reset: moving to HEAD^
# HEAD@{1}: commit: Important work

# 方法 1：使用 reflog 引用
git reset --hard HEAD@{1}

# 方法 2：使用提交哈希
git reset --hard abc1234

# 验证
ls
# work.txt
cat work.txt
# Important work
# 成功找回！
```

**关键点**：
- `reflog` 记录了所有 HEAD 的移动
- 即使提交看起来"消失"了，也能找回
- `HEAD@{n}` 表示 HEAD 之前的第 n 个位置
{{< /expand >}}
{{< /expand >}}

---

{{< hint success >}}
**检查清单** - 完成本节后，你应该能够：

- [ ] 使用 `git restore` 撤销工作区修改
- [ ] 使用 `git restore --staged` 取消暂存
- [ ] 使用 `git commit --amend` 修改最后一次提交
- [ ] 理解 `git reset` 的三种模式
- [ ] 区分 `git reset` 和 `git revert`
- [ ] 使用 `git reflog` 找回丢失的提交
- [ ] 知道哪些操作是危险的
- [ ] 在实际场景中选择合适的撤销方法
{{< /hint >}}
