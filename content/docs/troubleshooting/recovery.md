---
title: "恢复数据"
weight: 2
bookToc: true
---

# 恢复数据

本章将学习如何在 Git 中恢复看似"丢失"的数据。Git 的设计使得大多数数据都是可恢复的，只要你知道正确的方法。

{{< hint info >}}
**好消息**：Git 很少真正删除数据。即使你认为数据丢失了，通常也能找回来！
{{< /hint >}}

## 找回删除的分支

### 场景：误删了分支

```bash
# 场景
git branch feature
echo "important work" > feature.txt
git add feature.txt
git commit -m "Important feature"

# 切换回 main
git checkout main

# 不小心删除了 feature 分支
git branch -D feature
# Deleted branch feature (was abc1234).

# 糟糕！刚才的工作不见了！
```

### 解决方案 1：使用 git reflog

`git reflog` 记录了 HEAD 的所有移动，包括被删除分支的提交。

```bash
# 查看 reflog
git reflog

# 输出示例
# abc1234 HEAD@{0}: checkout: moving from feature to main
# abc1234 HEAD@{1}: commit: Important feature
# def5678 HEAD@{2}: checkout: moving from main to feature

# 找到删除前分支的提交（abc1234）
# 恢复分支
git checkout -b feature abc1234

# 或者
git branch feature abc1234
git checkout feature

# 验证
ls
# feature.txt 回来了！
```

### 解决方案 2：使用 git fsck

如果 reflog 也被清理了，可以使用 `git fsck` 找到悬空的提交。

```bash
# 查找悬空的提交
git fsck --lost-found

# 输出示例
# dangling commit abc1234567890...

# 查看悬空提交的内容
git show abc1234

# 如果是你要找的，恢复分支
git branch recovered-branch abc1234
```

### 实战示例

```bash
# 完整演示
mkdir branch-recovery-demo
cd branch-recovery-demo
git init -b main

# 创建初始提交
echo "main content" > main.txt
git add main.txt
git commit -m "Initial commit on main"

# 创建并切换到 feature 分支
git checkout -b feature

# 做一些重要工作
echo "Feature 1" > feature1.txt
git add feature1.txt
git commit -m "Add feature 1"

echo "Feature 2" > feature2.txt
git add feature2.txt
git commit -m "Add feature 2"

# 记录最后一次提交的哈希
git log --oneline
# abc1234 Add feature 2
# def5678 Add feature 1

# 切换回 main
git checkout main

# 误删 feature 分支
git branch -D feature
# Deleted branch feature (was abc1234).

# 方法 1：使用 reflog 恢复
git reflog | grep "feature"
# abc1234 HEAD@{1}: commit: Add feature 2
# def5678 HEAD@{2}: commit: Add feature 1

git checkout -b feature abc1234

# 验证恢复
git log --oneline
# abc1234 Add feature 2
# def5678 Add feature 1

ls
# feature1.txt  feature2.txt
```

## 恢复丢失的提交

### 场景 1：使用 reset --hard 后的恢复

```bash
# 创建一些提交
git init -b main
echo "v1" > file.txt && git add . && git commit -m "v1"
echo "v2" >> file.txt && git add . && git commit -m "v2"
echo "v3" >> file.txt && git add . && git commit -m "v3"

git log --oneline
# c3d4e5f v3
# b2c3d4e v2
# a1b2c3d v1

# 误操作：回退太多了
git reset --hard a1b2c3d

# v2 和 v3 的工作丢失了！
cat file.txt
# v1

# 使用 reflog 恢复
git reflog
# a1b2c3d HEAD@{0}: reset: moving to a1b2c3d
# c3d4e5f HEAD@{1}: commit: v3
# b2c3d4e HEAD@{2}: commit: v2

# 恢复到 v3
git reset --hard c3d4e5f

# 验证
cat file.txt
# v1
# v2
# v3
```

### 场景 2：丢失的 amend 提交

```bash
# 创建提交
echo "original" > file.txt
git add file.txt
git commit -m "Original commit"

# 记住这个提交
git log --oneline
# abc1234 Original commit

# 修改提交（会替换原提交）
echo "amended" > file.txt
git commit -a --amend -m "Amended commit"

# 新的哈希值
git log --oneline
# def5678 Amended commit

# 如果想找回原始提交
git reflog
# def5678 HEAD@{0}: commit (amend): Amended commit
# abc1234 HEAD@{1}: commit: Original commit

# 查看原始提交
git show abc1234

# 如果需要，创建分支保存
git branch original-version abc1234
```

### 场景 3：恢复 rebase 前的状态

```bash
# 创建一些提交
git init -b main
echo "1" > file.txt && git add . && git commit -m "commit 1"
echo "2" >> file.txt && git add . && git commit -m "commit 2"
echo "3" >> file.txt && git add . && git commit -m "commit 3"

# 创建 feature 分支
git checkout -b feature
echo "4" >> file.txt && git add . && git commit -m "commit 4"
echo "5" >> file.txt && git add . && git commit -m "commit 5"

# 执行 rebase（假设出错了）
git rebase main

# 想撤销 rebase
git reflog
# 或使用 ORIG_HEAD（Git 在危险操作前会保存）
git reset --hard ORIG_HEAD

# 验证：回到 rebase 前的状态
git log --oneline
```

## 找回删除的文件

### 场景 1：找回已提交但被删除的文件

```bash
# 创建并提交文件
echo "important data" > important.txt
git add important.txt
git commit -m "Add important file"

# 后来删除了文件
git rm important.txt
git commit -m "Remove important file"

# 想找回这个文件

# 方法 1：查看包含该文件的提交
git log --all --full-history -- important.txt

# 输出示例
# commit abc1234
#     Add important file

# 从该提交恢复文件
git checkout abc1234 -- important.txt

# 或者从提交的前一个版本恢复
git checkout abc1234^ -- important.txt
```

### 场景 2：找回从未提交的删除文件

如果文件从未被提交，Git 无法恢复。但如果曾经被 `git add` 过，可能还有机会：

```bash
# 创建文件并添加到暂存区
echo "staged content" > staged.txt
git add staged.txt

# 还没提交就删除了
rm staged.txt

# 从暂存区恢复
git restore --staged --worktree staged.txt
# 或
git checkout -- staged.txt
```

### 场景 3：从特定提交恢复文件版本

```bash
# 查看文件的修改历史
git log --oneline -- file.txt

# 查看特定版本的文件内容
git show abc1234:file.txt

# 恢复特定版本
git checkout abc1234 -- file.txt

# 恢复到上一次提交的状态
git checkout HEAD -- file.txt

# 恢复到 3 个提交前的状态
git checkout HEAD~3 -- file.txt
```

## 使用 git reflog

### reflog 基础

`git reflog` 是 Git 的安全网，记录了所有改变 HEAD 的操作。

```bash
# 查看 reflog
git reflog

# 查看详细信息
git reflog show HEAD

# 查看特定分支的 reflog
git reflog show main

# 限制显示数量
git reflog -n 10

# 显示相对时间
git reflog --date=relative

# 显示绝对时间
git reflog --date=iso
```

### reflog 输出格式

```bash
$ git reflog

# 格式：<commit-hash> <reference> <action>: <description>
c3d4e5f HEAD@{0}: commit: Add new feature
b2c3d4e HEAD@{1}: commit: Fix bug
a1b2c3d HEAD@{2}: reset: moving to HEAD^
5c6d7e8 HEAD@{3}: commit: Bad commit (被 reset 了)
a1b2c3d HEAD@{4}: commit: Initial commit
```

### HEAD@{n} 语法

```bash
# HEAD@{0} - 当前位置
git show HEAD@{0}

# HEAD@{1} - 前一个位置
git show HEAD@{1}

# HEAD@{2.days.ago} - 2 天前的位置
git show HEAD@{2.days.ago}

# 使用 reflog 引用
git diff HEAD@{0} HEAD@{3}
git checkout HEAD@{5}
```

### reflog 实战技巧

#### 找回被覆盖的提交

```bash
# 创建测试场景
git init -b main
echo "v1" > file.txt && git add . && git commit -m "v1"
echo "v2" >> file.txt && git add . && git commit -m "v2"
echo "v3" >> file.txt && git add . && git commit -m "v3"

# 不小心重置了
git reset --hard HEAD~2

# 使用 reflog 找回
git reflog
# HEAD@{0}: reset: moving to HEAD~2
# HEAD@{1}: commit: v3

# 恢复
git reset --hard HEAD@{1}
```

#### 找回删除的 stash

```bash
# 创建 stash
echo "work in progress" > wip.txt
git add wip.txt
git stash

# 查看 stash
git stash list
# stash@{0}: WIP on main: abc1234 Initial commit

# 不小心删除了
git stash drop

# stash 列表空了
git stash list
# (空)

# 使用 reflog 找回
git reflog show stash
# abc1234 stash@{0}: WIP on main: abc1234 Initial commit

# 或查看所有 reflog
git fsck --unreachable | grep commit
# unreachable commit abc1234

# 恢复（创建新分支保存 stash 内容）
git checkout -b recovered-stash abc1234
```

## 使用 git fsck

`git fsck` (file system check) 可以检查仓库完整性并找到悬空对象。

### 基本用法

```bash
# 检查仓库完整性
git fsck

# 完整检查
git fsck --full

# 查找悬空对象
git fsck --lost-found

# 查找未引用的对象
git fsck --unreachable
```

### 输出类型

```bash
$ git fsck --unreachable

# dangling commit - 悬空的提交（可能是被删除的分支）
dangling commit abc1234567890...

# dangling blob - 悬空的文件内容（被 git add 但未提交）
dangling blob def5678901234...

# dangling tree - 悬空的目录树
dangling tree 567890123456...
```

### 恢复悬空对象

#### 恢复悬空的提交

```bash
# 查找悬空提交
git fsck --lost-found | grep commit

# 查看提交内容
git show abc1234

# 如果是想要的，恢复到分支
git branch recovered abc1234
```

#### 恢复悬空的 blob

```bash
# 查找悬空 blob
git fsck --lost-found | grep blob
# dangling blob abc1234

# 查看内容
git show abc1234

# 保存到文件
git show abc1234 > recovered-file.txt
```

### 实战示例：完整恢复流程

```bash
# 场景：做了很多工作，但因为复杂的 Git 操作丢失了

# 步骤 1：先用 reflog 查找
git reflog
# 查找最近的操作

# 步骤 2：如果 reflog 找不到，使用 fsck
git fsck --lost-found
# dangling commit abc1234
# dangling commit def5678
# dangling commit 890abcd

# 步骤 3：逐个检查悬空提交
for commit in $(git fsck --lost-found | grep commit | awk '{print $3}'); do
  echo "=== Commit: $commit ==="
  git log -1 --oneline $commit
  git show --stat $commit
  echo ""
done

# 步骤 4：找到目标提交后恢复
git branch recovered-work abc1234

# 步骤 5：验证
git checkout recovered-work
git log
ls
```

## 恢复已推送但被强制覆盖的提交

### 场景

```bash
# 团队成员 A 推送了提交
git push origin feature

# 团队成员 B 强制推送，覆盖了 A 的工作
git push --force origin feature

# 成员 A 的提交丢失了
```

### 解决方案

#### 方案 1：在本地找回

```bash
# 成员 A 在自己的机器上
git reflog
# 提交还在本地的 reflog 中

# 创建新分支保存
git branch recovered HEAD@{3}

# 推送到远程
git push origin recovered
```

#### 方案 2：从其他克隆恢复

如果其他人有该仓库的克隆：

```bash
# 其他人的机器上
git fetch origin

# 查看他们的本地分支
git log feature

# 如果提交还在，推送到新分支
git push origin feature:recovered-feature
```

#### 方案 3：联系服务器管理员

GitHub/GitLab 等平台通常会保留被覆盖的提交一段时间：

```bash
# GitHub 示例
# 访问：https://github.com/user/repo/commit/<commit-hash>
# 即使提交不在分支上，通过哈希仍可访问（约 90 天）
```

## 保护数据的最佳实践

### 1. 定期备份

```bash
# 备份整个仓库
cp -r project-repo project-repo-backup

# 或使用 Git 克隆
git clone project-repo project-repo-backup
```

### 2. 使用远程仓库

```bash
# 添加多个远程仓库（额外的备份）
git remote add github https://github.com/user/repo.git
git remote add gitlab https://gitlab.com/user/repo.git

# 推送到所有远程仓库
git push --all github
git push --all gitlab
```

### 3. 保护重要分支

```bash
# GitHub：在设置中启用分支保护
# - Require pull request reviews
# - Prevent force push
# - Require status checks

# GitLab：设置 Protected Branches
# - Allowed to merge: Maintainers
# - Allowed to push: No one
```

### 4. 危险操作前创建标签

```bash
# 在做危险操作前打标签
git tag before-dangerous-operation
git tag -a backup-2024-01-15 -m "Backup before rebase"

# 如果出错，可以恢复到标签
git reset --hard before-dangerous-operation
```

### 5. 使用别名简化恢复

```bash
# 创建有用的别名
git config --global alias.undo 'reset --soft HEAD^'
git config --global alias.unstage 'restore --staged'
git config --global alias.last 'log -1 HEAD'
git config --global alias.visual 'log --oneline --graph --all'

# 查看最近删除的提交
git config --global alias.lost 'fsck --lost-found'

# 使用
git undo
git lost
```

## reflog 的生命周期

### reflog 保留时间

```bash
# 查看 reflog 配置
git config --get gc.reflogExpire
# 默认：90 days

git config --get gc.reflogExpireUnreachable
# 默认：30 days

# 修改保留时间
git config gc.reflogExpire "180 days"
git config gc.reflogExpireUnreachable "60 days"

# 永不过期（不推荐）
git config gc.reflogExpire "never"
```

### 手动清理 reflog

```bash
# 查看当前 reflog
git reflog

# 清理旧的 reflog 条目
git reflog expire --expire=30.days.ago --all

# 清理未引用的 reflog
git reflog expire --expire-unreachable=now --all

# 完全清理（危险！）
git reflog delete HEAD@{5}

# 运行垃圾回收
git gc --prune=now
```

---

## 💡 练习题

{{< expand "练习 1：恢复删除的分支" >}}
**任务**：
1. 创建分支并做一些提交
2. 删除分支
3. 使用 reflog 恢复分支

{{< expand "查看答案" >}}
```bash
# 1. 创建仓库和分支
git init -b main
echo "main" > main.txt
git add main.txt
git commit -m "Initial commit"

# 创建 feature 分支
git checkout -b feature
echo "feature work 1" > feature1.txt
git add feature1.txt
git commit -m "Feature work 1"

echo "feature work 2" > feature2.txt
git add feature2.txt
git commit -m "Feature work 2"

# 记住最后的提交
git log --oneline
# abc1234 Feature work 2
# def5678 Feature work 1

# 2. 删除分支
git checkout main
git branch -D feature
# Deleted branch feature (was abc1234).

# 3. 使用 reflog 恢复
git reflog | grep feature
# abc1234 HEAD@{1}: commit: Feature work 2

# 恢复分支
git checkout -b feature abc1234

# 验证
git log --oneline
ls
# feature1.txt  feature2.txt
```

**关键点**：
- reflog 记录了所有 HEAD 的移动
- 删除分支不会删除提交
- 可以通过提交哈希恢复分支
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 2：恢复 reset --hard 丢失的提交" >}}
**场景**：你做了很多提交，然后用 `reset --hard` 回退太多了

{{< expand "查看答案" >}}
```bash
# 创建多个提交
git init -b main
for i in {1..5}; do
  echo "Version $i" > file.txt
  git add file.txt
  git commit -m "Version $i"
done

# 查看历史
git log --oneline
# e5f6g7h Version 5
# d4e5f6g Version 4
# c3d4e5f Version 3
# b2c3d4e Version 2
# a1b2c3d Version 1

# 误操作：回退太多
git reset --hard a1b2c3d

# 查看文件
cat file.txt
# Version 1
# 糟糕！Version 2-5 的工作都丢了

# 使用 reflog 找回
git reflog
# a1b2c3d HEAD@{0}: reset: moving to a1b2c3d
# e5f6g7h HEAD@{1}: commit: Version 5
# d4e5f6g HEAD@{2}: commit: Version 4

# 恢复到 Version 5
git reset --hard e5f6g7h

# 验证
cat file.txt
# Version 5

git log --oneline
# 所有提交都回来了！
```

**学到的技巧**：
- `git reset --hard` 看起来很危险，但可以用 reflog 恢复
- reflog 是你的救命稻草
- 养成操作前先 `git tag backup` 的习惯
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 3：找回删除的文件" >}}
**任务**：找回一个已被删除的文件的历史版本

{{< expand "查看答案" >}}
```bash
# 创建文件并多次修改
git init -b main
echo "Version 1" > important.txt
git add important.txt
git commit -m "Add important file v1"

echo "Version 2" >> important.txt
git commit -am "Update to v2"

echo "Version 3" >> important.txt
git commit -am "Update to v3"

# 删除文件
git rm important.txt
git commit -m "Remove important file"

# 现在想找回 v2 版本的文件

# 方法 1：查看文件历史
git log --all --full-history -- important.txt
# commit xyz789: Remove important file
# commit abc456: Update to v3
# commit def123: Update to v2
# commit ghi890: Add important file v1

# 从 v2 提交恢复
git checkout def123 -- important.txt

# 查看内容
cat important.txt
# Version 1
# Version 2

# 方法 2：查看并选择版本
git show def123:important.txt

# 方法 3：恢复到工作区但不提交
git restore --source=def123 -- important.txt
```

**技巧**：
- `--all --full-history` 可以找到已删除文件的历史
- `git checkout <commit> -- <file>` 恢复特定版本
- 可以先用 `git show` 预览再决定恢复
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 4：使用 fsck 找回孤立的提交" >}}
**高级练习**：模拟复杂的数据丢失并用 fsck 恢复

{{< expand "查看答案" >}}
```bash
# 创建复杂场景
git init -b main
echo "1" > file.txt && git add . && git commit -m "commit 1"

# 创建分支并做工作
git checkout -b feature
echo "2" >> file.txt && git commit -am "commit 2"
echo "3" >> file.txt && git commit -am "commit 3"

# 记住最后的提交
COMMIT=$(git rev-parse HEAD)
echo "Feature commit: $COMMIT"

# 切回 main 并删除分支
git checkout main
git branch -D feature

# 假设 reflog 也被清理了（模拟真实场景）
git reflog expire --expire=now --all
git gc --prune=now

# 现在 reflog 找不到了
git reflog | grep feature
# (空)

# 使用 fsck 查找
git fsck --lost-found

# 查找悬空提交
for commit in $(git fsck --unreachable | grep commit | cut -d' ' -f3); do
  echo "=== $commit ==="
  git log --oneline -1 $commit
done

# 应该能看到 commit 2 和 commit 3

# 恢复
git branch recovered-feature $COMMIT

# 验证
git checkout recovered-feature
cat file.txt
# 1
# 2
# 3
```

**关键点**：
- `fsck` 是最后的救命稻草
- 即使 reflog 被清理，fsck 仍能找到对象
- 定期备份仍然是最好的策略
{{< /expand >}}
{{< /expand >}}

---

{{< hint success >}}
**检查清单** - 完成本节后，你应该能够：

- [ ] 使用 `git reflog` 找回删除的分支
- [ ] 恢复被 `reset --hard` 删除的提交
- [ ] 找回删除的文件的历史版本
- [ ] 理解 reflog 的工作原理和语法
- [ ] 使用 `git fsck` 找到悬空对象
- [ ] 恢复复杂场景下丢失的数据
- [ ] 实施数据保护的最佳实践
- [ ] 配置 reflog 的保留策略
{{< /hint >}}

{{< hint warning >}}
**重要提醒**：
- Git 很少真正删除数据，但也有限制
- reflog 默认保留 90 天
- 运行 `git gc --prune=now` 后可能无法恢复
- 最好的恢复策略是不要丢失：定期推送到远程！
{{< /hint >}}
