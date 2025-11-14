---
title: "重写历史"
weight: 7
bookToc: true
---

# 重写历史

Git 提供了多种工具来修改提交历史，但这些操作需要谨慎使用。本章将介绍如何安全地重写历史记录。

## 为什么要重写历史

### 常见场景

- **清理提交历史**：使提交记录更清晰易读
- **修复错误**：修改提交信息、作者信息
- **移除敏感信息**：删除误提交的密码、密钥
- **合并提交**：将多个小提交合并为一个
- **拆分提交**：将大提交拆分为多个小提交

### 风险和警告

{{< hint danger >}}
**危险操作警告**：

- ⚠️ 重写历史会改变提交 SHA-1
- ⚠️ 已推送的提交不应该重写
- ⚠️ 团队协作时需要协调
- ⚠️ 可能导致其他人的仓库冲突
- ⚠️ 错误操作可能丢失代码

**黄金法则**：永远不要重写已经推送到公共仓库的历史！
{{< /hint >}}

## git commit --amend

修改最后一次提交。

### 修改提交信息

```bash
# 修改最后一次提交的信息
git commit --amend -m "New commit message"

# 交互式修改（打开编辑器）
git commit --amend
```

### 添加遗漏的文件

```bash
# 忘记添加文件
git add forgotten-file.txt
git commit --amend --no-edit

# --no-edit 保持提交信息不变
```

### 修改作者信息

```bash
# 修改最后一次提交的作者
git commit --amend --author="New Author <email@example.com>"

# 修改为当前配置的用户
git commit --amend --reset-author
```

### 实战示例

```bash
# 提交后发现提交信息有错别字
git commit -m "Fix teh bug"

# 修改提交信息
git commit --amend -m "Fix the bug"

# 提交后发现漏了一个文件
git add missed-file.txt
git commit --amend --no-edit
```

{{< hint warning >}}
**注意**：如果已经推送，使用 `git push --force-with-lease` 强制推送。但这在团队协作中要谨慎！
{{< /hint >}}

## git rebase -i（交互式变基）

交互式变基是最强大的历史重写工具。

### 基本用法

```bash
# 修改最近 3 次提交
git rebase -i HEAD~3

# 从特定提交开始
git rebase -i <commit-hash>

# 变基到特定分支
git rebase -i main
```

### 交互式选项

执行后会打开编辑器，显示类似内容：

```
pick abc1234 Commit message 1
pick def5678 Commit message 2
pick 9876543 Commit message 3

# Commands:
# p, pick = use commit
# r, reword = use commit, but edit the commit message
# e, edit = use commit, but stop for amending
# s, squash = use commit, but meld into previous commit
# f, fixup = like "squash", but discard this commit's log message
# d, drop = remove commit
```

**命令说明**：

- `pick`：保持提交不变
- `reword`：修改提交信息
- `edit`：修改提交内容
- `squash`：合并到上一个提交，保留提交信息
- `fixup`：合并到上一个提交，丢弃提交信息
- `drop`：删除提交

### 修改提交信息

```bash
# 1. 开始交互式变基
git rebase -i HEAD~3

# 2. 将要修改的提交从 pick 改为 reword
# pick abc1234 Commit 1
# reword def5678 Commit 2  <- 修改这个
# pick 9876543 Commit 3

# 3. 保存退出，Git 会打开编辑器让你修改提交信息

# 4. 修改完成后保存退出
```

### 合并提交（Squash）

```bash
# 场景：将多个小提交合并为一个

# 1. 开始变基
git rebase -i HEAD~4

# 2. 修改编辑器内容
# pick abc1234 feat: add login form
# squash def5678 fix: validation
# squash 9876543 fix: styling
# pick aaa1111 feat: add logout

# 3. 保存后，Git 会让你编辑合并后的提交信息

# 4. 编辑提交信息
feat: add login form

- Implement login form
- Add validation
- Fix styling

# 5. 保存完成合并
```

### 删除提交

```bash
# 1. 开始变基
git rebase -i HEAD~3

# 2. 删除不需要的提交
# pick abc1234 Good commit
# drop def5678 Bad commit  <- 删除这个
# pick 9876543 Good commit

# 或直接删除那一行
# pick abc1234 Good commit
# pick 9876543 Good commit

# 3. 保存退出
```

### 重新排序提交

```bash
# 1. 开始变基
git rebase -i HEAD~3

# 2. 调整提交顺序
# pick 9876543 Commit 3
# pick abc1234 Commit 1
# pick def5678 Commit 2

# 3. 保存退出，提交会按新顺序排列
```

### 拆分提交

```bash
# 1. 开始变基
git rebase -i HEAD~3

# 2. 标记要拆分的提交为 edit
# pick abc1234 Commit 1
# edit def5678 Large commit  <- 拆分这个
# pick 9876543 Commit 3

# 3. Git 会停在 def5678，撤销该提交
git reset HEAD^

# 4. 分别提交
git add file1.txt
git commit -m "Part 1: Feature A"

git add file2.txt
git commit -m "Part 2: Feature B"

# 5. 继续变基
git rebase --continue
```

## git filter-branch（已弃用）

{{< hint warning >}}
**已弃用**：`git filter-branch` 已被标记为弃用，推荐使用 `git filter-repo`。
{{< /hint >}}

### 为什么弃用

- 速度慢
- 容易出错
- 内存占用大
- 不够安全

## git filter-repo

`git filter-repo` 是官方推荐的历史重写工具。

### 安装

```bash
# macOS
brew install git-filter-repo

# Ubuntu/Debian
apt install git-filter-repo

# 或使用 pip
pip install git-filter-repo
```

### 移除文件

```bash
# 从所有历史中移除文件
git filter-repo --path path/to/file --invert-paths

# 移除多个文件
git filter-repo --path passwords.txt --path secrets.json --invert-paths

# 移除目录
git filter-repo --path node_modules/ --invert-paths
```

### 移除敏感信息

```bash
# 移除包含特定文本的文件
git filter-repo --path-glob '*.env' --invert-paths

# 替换文本内容
git filter-repo --replace-text replacements.txt
```

**replacements.txt** 内容：

```
PASSWORD123==>***REMOVED***
secret_key_abc==>***REMOVED***
```

### 修改作者信息

```bash
# 修改所有提交的作者
git filter-repo --email-callback '
  return email.replace(b"old@example.com", b"new@example.com")
'

# 使用映射文件
git filter-repo --mailmap mailmap.txt
```

**mailmap.txt** 内容：

```
New Name <new@example.com> Old Name <old@example.com>
New Name <new@example.com> <old@example.com>
```

### 重命名文件或目录

```bash
# 重命名文件
git filter-repo --path-rename old-name.txt:new-name.txt

# 重命名目录
git filter-repo --path-rename old-dir/:new-dir/
```

### 提取子目录

```bash
# 将子目录提取为独立仓库
git filter-repo --subdirectory-filter path/to/subdir

# 这会将 path/to/subdir 变成仓库根目录
```

## BFG Repo-Cleaner

BFG 是另一个流行的历史清理工具，比 filter-branch 快得多。

### 安装和使用

```bash
# 下载 BFG
# https://rtyley.github.io/bfg-repo-cleaner/

# 移除大文件（超过 100MB）
java -jar bfg.jar --strip-blobs-bigger-than 100M repo.git

# 删除特定文件
java -jar bfg.jar --delete-files passwords.txt repo.git

# 替换敏感文本
java -jar bfg.jar --replace-text passwords.txt repo.git

# 清理
cd repo.git
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

## 实战场景

### 场景 1：清理提交历史

```bash
# 将最近 5 次提交合并为 1 个
git rebase -i HEAD~5

# 在编辑器中
pick abc1234 Initial implementation
squash def5678 Add feature A
squash 9876543 Add feature B
squash aaa1111 Fix bugs
squash bbb2222 Update docs

# 编辑合并后的提交信息
feat: implement new feature

- Initial implementation
- Add feature A and B
- Fix bugs
- Update documentation

# 保存完成
```

### 场景 2：移除敏感信息

```bash
# 误提交了包含密码的配置文件

# 方法 1：使用 filter-repo
git filter-repo --path config/secrets.yml --invert-paths

# 方法 2：使用 BFG
java -jar bfg.jar --delete-files secrets.yml

# 清理引用
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# 强制推送（如果已推送）
git push --force-with-lease
```

### 场景 3：修改历史中的作者信息

```bash
# 公司邮箱变更，需要更新所有提交

# 创建映射文件
cat > mailmap.txt << EOF
New Name <new@company.com> Old Name <old@company.com>
EOF

# 应用映射
git filter-repo --mailmap mailmap.txt

# 推送更新
git push --force-with-lease
```

### 场景 4：拆分大仓库

```bash
# 将项目中的某个模块提取为独立仓库

# 1. 克隆仓库
git clone original-repo new-module-repo
cd new-module-repo

# 2. 提取子目录
git filter-repo --subdirectory-filter modules/new-module

# 3. 添加新的远程仓库
git remote add origin <new-repo-url>
git push -u origin main
```

### 场景 5：移除大文件

```bash
# 查找大文件
git rev-list --objects --all | \
  git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | \
  sed -n 's/^blob //p' | \
  sort --numeric-sort --key=2 | \
  tail -n 10

# 使用 BFG 移除
java -jar bfg.jar --strip-blobs-bigger-than 50M

# 或使用 filter-repo
git filter-repo --strip-blobs-bigger-than 50M

# 清理
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

## 撤销重写操作

### 使用 reflog 恢复

```bash
# 重写历史前的状态记录在 reflog 中

# 1. 查看 reflog
git reflog

# 2. 找到重写前的状态
# abc1234 HEAD@{1}: rebase -i (finish): ...
# def5678 HEAD@{2}: checkout: moving from main to ...

# 3. 恢复到重写前
git reset --hard HEAD@{2}
```

### 创建备份分支

```bash
# 重写前创建备份
git branch backup-before-rewrite

# 如果出错，可以恢复
git reset --hard backup-before-rewrite

# 清理备份分支
git branch -D backup-before-rewrite
```

## 团队协作中的历史重写

### 沟通协调

1. **提前通知团队**
   ```markdown
   # 通知示例
   团队注意：
   - 我将在今天下午 3 点重写 feature-branch 的历史
   - 请在此之前推送所有更改
   - 重写后需要重新克隆或 reset 到新历史
   ```

2. **选择合适的时间**
   - 团队成员较少时
   - 没有人正在该分支工作时
   - 周末或下班后

3. **提供迁移步骤**
   ```bash
   # 给团队成员的迁移指南

   # 1. 保存本地修改
   git stash

   # 2. 获取新历史
   git fetch origin

   # 3. 重置到新历史
   git reset --hard origin/feature-branch

   # 4. 恢复本地修改
   git stash pop
   ```

### force push 的安全选项

```bash
# ❌ 危险：直接强制推送
git push --force

# ✅ 安全：使用 --force-with-lease
git push --force-with-lease

# --force-with-lease 会检查远程分支是否被其他人更新
# 如果是，推送会失败，保护他人的工作
```

### 保护分支

在 GitHub/GitLab 中设置分支保护：

- 禁止强制推送
- 要求 Pull Request 审核
- 要求状态检查通过
- 限制谁可以推送

## 最佳实践

1. **重写前备份**
   ```bash
   git branch backup
   git tag backup-$(date +%Y%m%d)
   ```

2. **只重写本地提交**
   ```bash
   # 只重写未推送的提交
   git log origin/main..HEAD
   ```

3. **使用 --force-with-lease**
   ```bash
   git push --force-with-lease origin feature-branch
   ```

4. **小步快跑**
   - 一次只做一种修改
   - 每步都测试
   - 出错及时回滚

5. **文档化操作**
   ```bash
   # 记录重写原因和步骤
   git commit -m "Rewrite history to remove sensitive data

   Reason: Accidentally committed passwords.txt
   Action: Used git filter-repo to remove it
   Date: 2024-01-15
   "
   ```

6. **清理垃圾**
   ```bash
   # 重写后清理
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive
   ```

## 常见问题

### 重写后推送失败

```bash
# 错误：Updates were rejected because the tip of your current branch is behind

# 使用 --force-with-lease
git push --force-with-lease

# 如果还是失败，检查是否有他人更新
git fetch origin
git log HEAD..origin/main
```

### 重写导致合并冲突

```bash
# 重写历史可能导致后续合并冲突

# 解决方法：
# 1. 在重写前先合并所有分支
# 2. 或告知团队 rebase 到新历史
git fetch origin
git rebase origin/main
```

### 无法恢复重写前的状态

```bash
# 如果 reflog 过期或被清理

# 1. 检查是否有备份分支或标签
git branch -a
git tag

# 2. 联系团队成员获取旧历史
# 3. 从备份恢复（如果有）
```

## 命令速查

| 命令 | 说明 |
|------|------|
| `git commit --amend` | 修改最后一次提交 |
| `git rebase -i HEAD~N` | 交互式变基最近 N 次提交 |
| `git filter-repo --path <file> --invert-paths` | 从历史中移除文件 |
| `git filter-repo --replace-text <file>` | 替换敏感文本 |
| `git push --force-with-lease` | 安全的强制推送 |
| `git reflog` | 查看引用日志 |
| `git reset --hard HEAD@{N}` | 恢复到某个状态 |

## 下一步

掌握了历史重写技巧后，接下来学习如何优化 Git 仓库性能。

下一节：[性能优化](../performance/) →

---

## 💡 练习题

完成以下练习，巩固所学知识：

{{< expand "练习 1：修改最后一次提交" >}}
**任务**：
1. 创建一个提交
2. 修改提交信息
3. 添加遗漏的文件到该提交

{{< expand "查看答案" >}}
```bash
# 1. 创建提交
echo "Feature A" > feature.txt
git add feature.txt
git commit -m "Add featrue A"  # 故意拼错

# 2. 修改提交信息
git commit --amend -m "Add feature A"

# 3. 添加遗漏的文件
echo "Documentation" > README.md
git add README.md
git commit --amend --no-edit

# 验证
git log -1
git show HEAD
```
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 2：合并多个提交" >}}
**任务**：
1. 创建 4 个连续的提交
2. 将后 3 个提交合并为 1 个
3. 编辑合并后的提交信息

{{< expand "查看答案" >}}
```bash
# 1. 创建 4 个提交
echo "Line 1" > file.txt
git add file.txt
git commit -m "Initial commit"

echo "Line 2" >> file.txt
git commit -am "Add line 2"

echo "Line 3" >> file.txt
git commit -am "Add line 3"

echo "Line 4" >> file.txt
git commit -am "Add line 4"

# 2. 查看提交历史
git log --oneline

# 3. 开始交互式变基
git rebase -i HEAD~3

# 4. 在编辑器中修改
# pick abc1234 Add line 2
# squash def5678 Add line 3
# squash 9876543 Add line 4

# 5. 保存后编辑合并的提交信息
# feat: add lines 2-4
#
# - Add line 2
# - Add line 3
# - Add line 4

# 6. 验证
git log --oneline
# 应该只有 2 个提交了
```
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 3：删除历史中的提交" >}}
**任务**：
1. 创建 5 个提交
2. 删除中间的一个提交
3. 验证删除成功

{{< expand "查看答案" >}}
```bash
# 1. 创建 5 个提交
for i in {1..5}; do
    echo "Commit $i" > file$i.txt
    git add file$i.txt
    git commit -m "Commit $i"
done

# 2. 查看提交
git log --oneline

# 3. 开始交互式变基
git rebase -i HEAD~5

# 4. 删除第 3 个提交
# pick abc1234 Commit 1
# pick def5678 Commit 2
# drop 1111111 Commit 3  <- 删除或直接删除这行
# pick 2222222 Commit 4
# pick 3333333 Commit 5

# 5. 保存退出

# 6. 验证
git log --oneline
# 应该只有 4 个提交

ls -la
# file3.txt 应该不存在
```
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 4：拆分大提交" >}}
**任务**：
1. 创建一个包含多个文件的提交
2. 使用交互式变基拆分这个提交
3. 将文件分成两个独立的提交

{{< expand "查看答案" >}}
```bash
# 1. 创建大提交
echo "Feature A" > featureA.txt
echo "Feature B" > featureB.txt
git add featureA.txt featureB.txt
git commit -m "Add features A and B"

# 2. 开始交互式变基
git rebase -i HEAD~1

# 3. 标记为 edit
# edit abc1234 Add features A and B

# 4. Git 停在该提交，撤销它
git reset HEAD^

# 5. 分别提交
git add featureA.txt
git commit -m "feat: add feature A"

git add featureB.txt
git commit -m "feat: add feature B"

# 6. 继续变基
git rebase --continue

# 7. 验证
git log --oneline
# 应该有两个独立的提交
```
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 5：安全的强制推送" >}}
**思考题**：

A. `git push --force` 和 `git push --force-with-lease` 有什么区别？
B. 什么时候可以安全地使用强制推送？
C. 如何在团队中协调历史重写？

{{< expand "查看答案" >}}
**答案**：

**A. force vs force-with-lease**：

```bash
# --force：无条件覆盖远程分支
git push --force
# 风险：会覆盖其他人的工作

# --force-with-lease：检查远程是否有更新
git push --force-with-lease
# 安全：如果远程有其他人的更新，推送会失败

# 示例场景
# 你本地： A -> B -> C
# 远程：   A -> B -> C -> D（同事推送了 D）

# 使用 --force
git push --force
# 结果：远程变成 A -> B -> C（D 丢失！）

# 使用 --force-with-lease
git push --force-with-lease
# 结果：推送失败，提示远程有更新
```

**B. 何时可以安全使用强制推送**：

1. **个人分支**：
```bash
# 在自己的功能分支上
git push --force-with-lease origin feature/my-work
```

2. **明确告知团队**：
```bash
# 发送通知后
# "我将在 10 分钟后强制推送 feature-branch"
git push --force-with-lease origin feature-branch
```

3. **紧急修复敏感信息**：
```bash
# 误提交密码，必须立即移除
git filter-repo --path passwords.txt --invert-paths
git push --force-with-lease origin main
```

4. **PR 分支整理**：
```bash
# 在 Pull Request 合并前整理提交
git rebase -i HEAD~5
git push --force-with-lease origin feature-branch
```

**C. 团队协调历史重写**：

**步骤 1：提前通知**
```markdown
# 在团队聊天或邮件
主题：[重要] feature-branch 历史重写通知

大家好，

我需要重写 feature-branch 的历史以移除敏感信息。

**时间**：今天下午 3:00 PM
**影响**：在该分支工作的所有人
**操作前**：请推送所有本地更改
**操作后**：需要重新同步（见下方步骤）

如有问题请立即联系我。
```

**步骤 2：提供迁移指南**
```bash
# 给团队的迁移步骤

# 1. 保存本地工作
git stash

# 2. 备份当前分支（可选）
git branch backup-feature-branch

# 3. 获取新历史
git fetch origin

# 4. 重置到新历史（这会丢弃本地提交）
git reset --hard origin/feature-branch

# 5. 恢复本地工作
git stash pop

# 6. 如果有本地提交，需要重新 rebase
git rebase origin/feature-branch
```

**步骤 3：执行重写**
```bash
# 1. 确保是最新代码
git pull

# 2. 创建备份
git branch backup-$(date +%Y%m%d)

# 3. 执行重写
git filter-repo --path secrets.txt --invert-paths

# 4. 强制推送
git push --force-with-lease origin feature-branch

# 5. 通知团队完成
```

**最佳实践**：
- ✅ 只在必要时重写历史
- ✅ 使用 `--force-with-lease` 而非 `--force`
- ✅ 重写前创建备份分支
- ✅ 提前通知并协调团队
- ✅ 提供清晰的迁移步骤
- ❌ 不要重写公共分支（main/master）
- ❌ 不要在团队活跃工作时重写
{{< /expand >}}
{{< /expand >}}

---

{{< hint success >}}
**检查清单** - 完成本节后，你应该能够：

- [ ] 使用 `git commit --amend` 修改最后一次提交
- [ ] 使用交互式变基重写历史
- [ ] 合并、拆分、删除提交
- [ ] 使用 filter-repo 移除敏感信息
- [ ] 理解历史重写的风险
- [ ] 安全地使用 `--force-with-lease`
- [ ] 在团队中协调历史重写
- [ ] 使用 reflog 恢复误操作
{{< /hint >}}
