---
title: "储藏更改"
weight: 2
bookToc: true
---

# 储藏更改

Git Stash 允许你临时保存工作目录的修改，而不需要提交。当你需要切换分支但又不想提交未完成的工作时，Stash 非常有用。

## 什么是 Git Stash

Stash（储藏）可以将当前工作目录的改动保存到一个栈中，然后恢复到一个干净的工作目录。这样你可以切换到其他分支工作，之后再回来继续。

### 使用场景

**场景 1：紧急切换分支**
```bash
# 你正在开发新功能，突然需要修复紧急 bug
# 但当前代码还没写完，不想提交
git stash
git checkout hotfix
# 修复 bug...
git checkout feature-branch
git stash pop  # 恢复之前的工作
```

**场景 2：临时测试**
```bash
# 你想测试没有当前修改的代码
git stash
# 运行测试...
git stash pop  # 恢复修改继续开发
```

**场景 3：错误的分支**
```bash
# 你在错误的分支上进行了修改
git stash
git checkout correct-branch
git stash pop  # 在正确的分支恢复修改
```

## 基本用法

### 保存工作进度

```bash
# 储藏当前修改
git stash

# 等同于
git stash push

# 储藏时添加说明
git stash save "WIP: working on user authentication"

# 推荐使用新语法
git stash push -m "WIP: working on user authentication"
```

执行后输出：

```
Saved working directory and index state WIP on main: abc1234 Last commit message
```

### 查看储藏列表

```bash
# 查看所有储藏
git stash list

# 输出：
# stash@{0}: WIP on main: abc1234 working on feature
# stash@{1}: WIP on develop: def5678 fixing bug
# stash@{2}: On main: 1234abc testing changes
```

`stash@{0}` 是最新的储藏，数字越大越旧。

### 恢复储藏

```bash
# 恢复最新的储藏并删除
git stash pop

# 恢复指定的储藏并删除
git stash pop stash@{1}

# 恢复最新的储藏但不删除
git stash apply

# 恢复指定的储藏但不删除
git stash apply stash@{1}
```

{{< hint info >}}
**pop vs apply**：
- `pop`：恢复后从列表删除
- `apply`：恢复但保留在列表中（可以多次应用）
{{< /hint >}}

### 查看储藏内容

```bash
# 查看最新储藏的修改
git stash show

# 查看详细的差异
git stash show -p

# 查看指定储藏
git stash show stash@{1}
git stash show -p stash@{1}
```

### 删除储藏

```bash
# 删除最新的储藏
git stash drop

# 删除指定的储藏
git stash drop stash@{1}

# 删除所有储藏
git stash clear
```

{{< hint warning >}}
**警告**：`git stash clear` 会删除所有储藏且无法恢复，请谨慎使用！
{{< /hint >}}

## 高级用法

### 储藏未跟踪的文件

默认情况下，`git stash` 只储藏已跟踪的文件。

```bash
# 查看当前状态
git status
# 修改了：  tracked-file.txt
# 未跟踪的：untracked-file.txt

# 普通储藏（不包含 untracked-file.txt）
git stash

# 储藏包括未跟踪的文件
git stash -u
# 或
git stash --include-untracked

# 储藏所有文件，包括被 .gitignore 忽略的
git stash -a
# 或
git stash --all
```

### 部分储藏（交互式）

只储藏部分修改：

```bash
# 交互式选择要储藏的改动
git stash -p
# 或
git stash --patch
```

Git 会逐个显示改动，询问是否储藏：

```
diff --git a/file.txt b/file.txt
--- a/file.txt
+++ b/file.txt
@@ -1,3 +1,4 @@
 Line 1
+New line
 Line 2

Stash this hunk [y,n,q,a,d,e,?]?
```

选项说明：
- `y` - 储藏这个改动
- `n` - 不储藏这个改动
- `q` - 退出，不储藏剩余改动
- `a` - 储藏这个文件的所有改动
- `d` - 不储藏这个文件的所有改动
- `e` - 手动编辑这个改动
- `?` - 帮助

### 从储藏创建分支

如果储藏恢复时有冲突，可以创建新分支：

```bash
# 从储藏创建新分支
git stash branch new-branch-name

# 从指定储藏创建分支
git stash branch new-branch-name stash@{1}
```

这个命令会：
1. 创建新分支
2. 检出储藏时所在的提交
3. 应用储藏
4. 如果成功，删除储藏

### 储藏时保留索引

默认情况下，储藏会同时保存工作目录和暂存区的修改。

```bash
# 查看状态
git status
# 修改：     file1.txt (已暂存)
# 修改：     file2.txt (未暂存)

# 储藏但保持暂存状态
git stash --keep-index

# 之后，file1.txt 仍然在暂存区
git status
# 修改：     file1.txt (已暂存)
```

### 储藏特定文件

Git 2.13+ 支持储藏指定文件：

```bash
# 储藏指定文件
git stash push -m "Stash specific files" file1.txt file2.txt

# 储藏指定路径
git stash push -m "Stash frontend" src/frontend/
```

## 实战场景

### 场景 1：紧急修复 bug

```bash
# 正在 feature 分支开发
git branch
# * feature-login

# 突然需要修复 main 分支的紧急 bug
# 但当前代码未完成，不想提交

# 1. 储藏当前工作
git stash save "WIP: implementing login form"

# 2. 切换到 main 分支
git checkout main

# 3. 创建 hotfix 分支
git checkout -b hotfix-critical-bug

# 4. 修复 bug
echo "bug fixed" > fix.txt
git add fix.txt
git commit -m "fix: resolve critical bug"

# 5. 合并到 main
git checkout main
git merge hotfix-critical-bug

# 6. 回到 feature 分支继续工作
git checkout feature-login
git stash pop

# 7. 继续开发
```

### 场景 2：在错误的分支工作

```bash
# 在 main 分支误开发了功能
git branch
# * main

git status
# 修改：     new-feature.txt

# 1. 储藏修改
git stash

# 2. 创建正确的功能分支
git checkout -b feature-new

# 3. 恢复修改
git stash pop

# 4. 提交
git add new-feature.txt
git commit -m "feat: add new feature"
```

### 场景 3：临时测试

```bash
# 开发中想测试上一个提交的代码

# 1. 储藏当前修改
git stash

# 2. 运行测试
npm test

# 3. 恢复修改
git stash pop

# 4. 继续开发
```

### 场景 4：在多个分支间工作

```bash
# 在多个功能间切换

# 在 feature-A 工作
git stash save "feature-A: partial implementation"

# 切换到 feature-B
git checkout feature-B
git stash apply stash@{1}  # 应用 feature-B 的储藏
# 工作...
git stash save "feature-B: WIP"

# 回到 feature-A
git checkout feature-A
git stash pop  # 恢复 feature-A 的工作
```

### 场景 5：清理工作目录

```bash
# 临时清理所有修改以查看原始代码

# 1. 储藏所有修改（包括未跟踪文件）
git stash -u

# 2. 查看干净的代码
ls
git status

# 3. 恢复修改
git stash pop
```

## 管理多个储藏

### 给储藏添加描述性名称

```bash
# 使用描述性信息
git stash save "feature-login: implemented email validation"
git stash push -m "bugfix: trying to fix memory leak"
```

### 查看储藏的详细信息

```bash
# 列出所有储藏
git stash list

# 查看特定储藏的摘要
git stash show stash@{0}

# 查看特定储藏的详细改动
git stash show -p stash@{0}

# 查看储藏的完整信息（包括未跟踪文件）
git show stash@{0}
```

### 重新组织储藏

```bash
# 应用旧的储藏并删除
git stash apply stash@{2}
git stash drop stash@{2}

# 等同于
git stash pop stash@{2}
```

## 常见问题

### Stash 冲突

恢复储藏时可能遇到冲突：

```bash
git stash pop
# 自动合并 file.txt
# 冲突（内容）：合并冲突于 file.txt
```

解决方法：

```bash
# 1. 查看冲突
git status

# 2. 手动解决冲突
vim file.txt

# 3. 标记为已解决
git add file.txt

# 4. 储藏不会自动删除，需手动删除
git stash drop
```

### 误删储藏

如果刚刚删除了储藏：

```bash
# 查看 stash 的 reflog
git fsck --unreachable | grep commit | cut -d ' ' -f3 | xargs git log --merges --no-walk

# 或
git log --graph --oneline --all $(git fsck --no-reflogs 2>/dev/null | awk '/dangling commit/ {print $3}')

# 找到丢失的储藏提交后恢复
git stash apply <commit-hash>
```

{{< hint info >}}
**提示**：这个方法只在储藏刚被删除时有效，Git 垃圾回收后无法恢复。
{{< /hint >}}

### Stash 和 .gitignore

使用 `git stash -a` 会储藏被 `.gitignore` 忽略的文件，恢复时要小心。

```bash
# 只储藏未跟踪的文件（不包括 ignored）
git stash -u

# 储藏所有文件（包括 ignored）
git stash -a
```

### Stash 在团队协作中

{{< hint warning >}}
**注意**：Stash 是本地操作，不会同步到远程仓库。不要依赖 stash 共享代码。
{{< /hint >}}

如果需要在多台电脑间共享未完成的工作：

```bash
# 方法 1：创建临时分支
git checkout -b wip-temp
git add .
git commit -m "WIP: temp commit"
git push origin wip-temp

# 在另一台电脑
git fetch origin
git checkout wip-temp

# 方法 2：使用 patch
git stash show -p > stash.patch
# 传输 stash.patch 文件
git apply stash.patch
```

## 最佳实践

1. **使用描述性消息**
   ```bash
   # ✅ 推荐
   git stash save "feature-login: WIP on OAuth integration"

   # ❌ 不推荐
   git stash
   ```

2. **及时清理储藏**
   ```bash
   # 定期查看并清理不需要的储藏
   git stash list
   git stash drop stash@{3}
   ```

3. **不要长期依赖 stash**
   - Stash 是临时解决方案，不是版本控制
   - 尽快创建提交或分支

4. **使用 `apply` 而非 `pop` 测试**
   ```bash
   # 先用 apply 测试，确认无误再 drop
   git stash apply
   # 测试...
   git stash drop
   ```

5. **结合分支使用**
   ```bash
   # 如果工作超过一天，考虑创建分支
   git stash branch wip-feature
   ```

6. **包含未跟踪文件**
   ```bash
   # 通常使用 -u 以免遗漏新文件
   git stash -u
   ```

## 命令速查

| 命令 | 说明 |
|------|------|
| `git stash` | 储藏当前修改 |
| `git stash save "msg"` | 储藏并添加说明（旧语法） |
| `git stash push -m "msg"` | 储藏并添加说明（新语法） |
| `git stash list` | 查看所有储藏 |
| `git stash show` | 查看最新储藏的摘要 |
| `git stash show -p` | 查看最新储藏的详细改动 |
| `git stash pop` | 恢复并删除最新储藏 |
| `git stash apply` | 恢复但不删除最新储藏 |
| `git stash drop` | 删除最新储藏 |
| `git stash clear` | 删除所有储藏 |
| `git stash -u` | 储藏包括未跟踪文件 |
| `git stash -a` | 储藏所有文件（含忽略文件） |
| `git stash -p` | 交互式部分储藏 |
| `git stash branch <name>` | 从储藏创建分支 |
| `git stash push <file>` | 储藏指定文件 |

## 下一步

掌握了 Git Stash 后，接下来学习如何使用子模块管理项目依赖。

下一节：[子模块](../submodules/) →

---

## 💡 练习题

完成以下练习，巩固所学知识：

{{< expand "练习 1：基本储藏操作" >}}
**任务**：
1. 创建一个文件并修改（不提交）
2. 储藏这个修改
3. 查看储藏列表
4. 查看储藏的内容
5. 恢复储藏

{{< expand "查看答案" >}}
```bash
# 1. 创建并修改文件
echo "Hello" > test.txt
git add test.txt
echo "World" >> test.txt

# 2. 储藏修改
git stash save "Testing stash functionality"

# 3. 查看储藏列表
git stash list
# 输出：stash@{0}: On main: Testing stash functionality

# 4. 查看储藏内容
git stash show
git stash show -p

# 5. 恢复储藏
git stash pop

# 验证
cat test.txt
# 输出：
# Hello
# World
```
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 2：紧急切换分支" >}}
**任务**：模拟紧急修复 bug 的场景

1. 在 main 分支创建一个文件并修改（不提交）
2. 需要紧急修复，储藏当前工作
3. 修复 bug 并提交
4. 恢复之前的工作

{{< expand "查看答案" >}}
```bash
# 1. 在 main 分支工作
git checkout main
echo "New feature" > feature.txt
git add feature.txt

# 2. 储藏工作
git stash save "WIP: new feature development"

# 确认工作目录干净
git status
# 输出：nothing to commit, working tree clean

# 3. 修复 bug
echo "Fixed bug" > bugfix.txt
git add bugfix.txt
git commit -m "fix: critical bug"

# 4. 恢复之前的工作
git stash pop

# 5. 继续开发
git status
# 输出：修改：     feature.txt
```
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 3：部分储藏" >}}
**任务**：
1. 修改两个不同的文件
2. 只储藏其中一个文件的修改
3. 验证另一个文件的修改仍然存在

{{< expand "查看答案" >}}
```bash
# 1. 修改两个文件
echo "Change 1" > file1.txt
echo "Change 2" > file2.txt
git add file1.txt file2.txt

# 2. 只储藏 file1.txt
git stash push -m "Stash file1 only" file1.txt

# 3. 验证
git status
# 输出：修改：     file2.txt
# file1.txt 已被储藏

# 查看储藏
git stash show
# 输出：file1.txt | 1 +

# 4. 恢复 file1.txt
git stash pop

# 现在两个文件都在工作目录中
git status
# 输出：
# 修改：     file1.txt
# 修改：     file2.txt
```
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 4：管理多个储藏" >}}
**任务**：
1. 创建 3 个不同的储藏
2. 查看所有储藏
3. 恢复第 2 个储藏（不删除）
4. 删除第 3 个储藏
5. 清除所有储藏

{{< expand "查看答案" >}}
```bash
# 1. 创建 3 个储藏
echo "Stash 1" > s1.txt
git add s1.txt
git stash save "First stash"

echo "Stash 2" > s2.txt
git add s2.txt
git stash save "Second stash"

echo "Stash 3" > s3.txt
git add s3.txt
git stash save "Third stash"

# 2. 查看所有储藏
git stash list
# 输出：
# stash@{0}: On main: Third stash
# stash@{1}: On main: Second stash
# stash@{2}: On main: First stash

# 3. 恢复第 2 个储藏（不删除）
git stash apply stash@{1}

# 验证
ls s*.txt
# 输出：s2.txt

# 4. 删除第 3 个储藏
git stash drop stash@{2}

# 查看剩余储藏
git stash list
# 输出：
# stash@{0}: On main: Third stash
# stash@{1}: On main: Second stash

# 5. 清除所有储藏
git stash clear

# 验证
git stash list
# 输出：（空）
```
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 5：从储藏创建分支" >}}
**问题**：什么情况下需要从储藏创建分支？如何操作？

{{< expand "查看答案" >}}
**需要创建分支的情况**：
1. 储藏恢复时有冲突
2. 储藏的工作需要独立开发
3. 想在不影响当前分支的情况下测试储藏的代码

**操作步骤**：

```bash
# 1. 创建一些修改并储藏
echo "Feature work" > feature.txt
git add feature.txt
git stash save "WIP: new feature"

# 2. 在 main 分支继续工作（可能产生冲突）
echo "Other work" > feature.txt
git add feature.txt
git commit -m "Other changes"

# 3. 从储藏创建新分支
git stash branch feature-new-branch stash@{0}

# 这个命令会：
# - 创建并切换到 feature-new-branch
# - 在储藏创建时的提交上建立分支
# - 应用储藏
# - 如果成功，删除储藏

# 4. 验证
git branch
# 输出：
# * feature-new-branch
#   main

git status
# 输出：修改：     feature.txt
```

**优势**：
- 避免冲突
- 保持代码历史清晰
- 可以独立开发和测试
{{< /expand >}}
{{< /expand >}}

---

{{< hint success >}}
**检查清单** - 完成本节后，你应该能够：

- [ ] 理解 Git Stash 的作用和使用场景
- [ ] 使用 `git stash` 保存和恢复工作进度
- [ ] 查看和管理储藏列表
- [ ] 使用 `git stash -u` 储藏未跟踪文件
- [ ] 使用 `git stash -p` 部分储藏
- [ ] 从储藏创建分支
- [ ] 解决储藏恢复时的冲突
- [ ] 在实际工作中灵活运用 stash
{{< /hint >}}
