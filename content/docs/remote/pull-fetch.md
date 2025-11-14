---
title: "拉取与获取"
weight: 3
bookToc: true
---

# 拉取与获取

学习如何从远程仓库获取更新，理解 `git fetch` 和 `git pull` 的区别和使用场景。

## git fetch 详解

**`git fetch`** 从远程仓库下载数据，但不会自动合并到本地分支。

### 基本概念

```bash
# 获取远程仓库的更新
git fetch <远程仓库>

# 示例
git fetch origin
git fetch upstream
```

### fetch 做了什么

```
执行前：
本地仓库                远程仓库（origin）
main: A ← B ← C        main: A ← B ← C ← D ← E
origin/main: A ← B ← C

执行：git fetch origin

执行后：
本地仓库                远程仓库（origin）
main: A ← B ← C        main: A ← B ← C ← D ← E
                ↑
            你的工作未受影响
origin/main: A ← B ← C ← D ← E
                ↑
            远程分支引用已更新
```

{{< hint info >}}
**关键理解**

`git fetch` 只更新远程跟踪分支（如 `origin/main`），不会修改你的本地分支（如 `main`）。

这是一个**安全**的操作，不会破坏你的本地工作。
{{< /hint >}}

### fetch 基本用法

```bash
# 获取默认远程仓库的所有更新
git fetch

# 获取指定远程仓库的所有更新
git fetch origin

# 获取指定远程仓库的指定分支
git fetch origin main

# 获取所有远程仓库的更新
git fetch --all
```

### 查看 fetch 的结果

```bash
# 1. 执行 fetch
git fetch origin

# 2. 查看远程分支
git branch -r
# origin/main
# origin/develop
# origin/feature-x

# 3. 查看远程和本地的差异
git log --oneline main..origin/main
# d3e4f5a (origin/main) Fix bug
# c2d3e4f Add feature

# 4. 查看图形化历史
git log --oneline --graph --all
# * d3e4f5a (origin/main) Fix bug
# * c2d3e4f Add feature
# | * b1c2d3 (HEAD -> main) Local work
# |/
# * a1b2c3d Common ancestor
```

### fetch 选项

#### 1. 获取所有远程仓库

```bash
# 获取所有远程仓库的更新
git fetch --all
```

**示例场景**：
```bash
# 有多个远程仓库
git remote -v
# origin    https://github.com/yourname/repo.git
# upstream  https://github.com/original/repo.git
# backup    https://gitee.com/yourname/repo.git

# 一次性获取所有更新
git fetch --all
# 获取 origin 的更新
# 获取 upstream 的更新
# 获取 backup 的更新
```

#### 2. 修剪已删除的远程分支

```bash
# 删除本地的远程分支引用（如果远程已删除）
git fetch --prune
# 简写
git fetch -p
```

**使用场景**：
```bash
# 远程分支已被删除
# 远程仓库：main, develop
# 本地引用：origin/main, origin/develop, origin/old-feature

# 执行修剪
git fetch -p origin

# 结果：origin/old-feature 被删除
# 本地引用：origin/main, origin/develop
```

**配置自动修剪**：
```bash
# 设置全局自动修剪
git config --global fetch.prune true

# 现在每次 fetch 都会自动修剪
git fetch origin  # 自动修剪已删除的分支
```

#### 3. 获取标签

```bash
# 不获取标签
git fetch --no-tags

# 只获取标签
git fetch --tags

# 获取所有标签（包括不在分支上的）
git fetch origin 'refs/tags/*:refs/tags/*'
```

#### 4. 浅层获取

```bash
# 限制获取深度
git fetch --depth=<深度>

# 示例
git fetch --depth=1 origin main
```

### fetch 后的操作

**方案 1：查看更改**
```bash
# 1. 获取更新
git fetch origin

# 2. 查看有哪些新提交
git log --oneline main..origin/main

# 3. 查看具体更改
git diff main origin/main

# 4. 决定是否合并
```

**方案 2：合并更改**
```bash
# 1. 获取更新
git fetch origin

# 2. 合并到当前分支
git merge origin/main

# 或直接使用 pull（等同于 fetch + merge）
git pull origin main
```

**方案 3：变基到远程分支**
```bash
# 1. 获取更新
git fetch origin

# 2. 变基到远程分支
git rebase origin/main

# 或直接使用 pull --rebase
git pull --rebase origin main
```

**方案 4：检出远程分支**
```bash
# 1. 获取更新
git fetch origin

# 2. 创建本地分支跟踪远程分支
git checkout -b feature origin/feature
# 或使用现代语法
git switch -c feature origin/feature
```

## git pull 详解

**`git pull`** = **`git fetch`** + **`git merge`**

从远程仓库获取更新并自动合并到当前分支。

### 基本用法

```bash
# 拉取当前分支的上游分支
git pull

# 拉取指定远程仓库的指定分支
git pull <远程仓库> <分支>

# 示例
git pull origin main
git pull upstream develop
```

### pull 的工作原理

```
执行：git pull origin main

等同于：
git fetch origin
git merge origin/main

过程：
步骤 1：fetch
  本地 origin/main: A ← B ← C
  远程 main: A ← B ← C ← D ← E
      ↓
  本地 origin/main: A ← B ← C ← D ← E

步骤 2：merge
  本地 main: A ← B ← C ← F (你的本地提交)
  origin/main: A ← B ← C ← D ← E
      ↓
  本地 main: A ← B ← C ← D ← E ← F' ← M
                      ↘       ↗
                         F
  (创建合并提交 M)
```

### pull 选项

#### 1. 使用 rebase 而不是 merge

```bash
# 使用 rebase 拉取
git pull --rebase origin main

# 等同于
git fetch origin
git rebase origin/main
```

**对比**：
```
git pull（默认 merge）：
      C ← D (origin/main)
     ↗     ↘
  A ← B     M (merge commit)
     ↘   ↗
      E ← F (local)

git pull --rebase：
  A ← B ← C ← D ← E' ← F'
                ↑
          (线性历史，无合并提交)
```

#### 2. 快进合并

```bash
# 只允许快进合并
git pull --ff-only origin main

# 如果不能快进，拉取失败
```

**快进合并示例**：
```
场景 1：可以快进
远程：A ← B ← C ← D
本地：A ← B

拉取后：
本地：A ← B ← C ← D  （快进成功）

场景 2：不能快进
远程：A ← B ← C
本地：A ← B ← D

拉取失败：
fatal: Not possible to fast-forward, aborting.
```

**使用场景**：
```bash
# 确保历史是线性的
git config pull.ff only

# 如果不能快进，需要先 rebase
git pull --ff-only origin main  # 失败
git pull --rebase origin main   # 使用 rebase
```

#### 3. 拉取时的策略

```bash
# 使用 merge 策略（默认）
git pull --no-rebase origin main

# 使用 rebase 策略
git pull --rebase origin main

# 保留本地合并提交的 rebase
git pull --rebase=merges origin main
```

#### 4. 拉取所有分支

```bash
# 拉取所有跟踪分支
git pull --all

# 注意：这会更新所有跟踪分支，但只合并当前分支
```

### 配置 pull 行为

```bash
# 配置默认的 pull 策略

# 方案 1：merge（默认）
git config pull.rebase false

# 方案 2：rebase
git config pull.rebase true

# 方案 3：仅快进
git config pull.ff only

# 全局配置
git config --global pull.rebase true
```

**推荐配置**：
```bash
# 推荐使用 rebase，保持历史整洁
git config --global pull.rebase true

# 在 rebase 时保留合并提交
git config --global pull.rebase merges

# 自动修剪已删除的远程分支
git config --global fetch.prune true
```

## fetch vs pull

### 核心区别

| 特性 | git fetch | git pull |
|------|-----------|----------|
| **安全性** | ✅ 安全（不修改本地分支） | ⚠️ 可能有冲突 |
| **自动合并** | ❌ 不会 | ✅ 会 |
| **适合场景** | 检查更新、保守操作 | 快速同步、日常开发 |
| **控制力** | 🎯 精确控制 | 🚀 快速便捷 |
| **工作流** | fetch → 检查 → 决定 | 直接同步 |

### 图解对比

**git fetch**：
```
远程仓库（GitHub）
  main: A ← B ← C ← D ← E
           ↓ fetch
本地仓库
  origin/main: A ← B ← C ← D ← E  ✅ 更新
  main: A ← B ← C                 ⛔ 不变（安全）
```

**git pull**：
```
远程仓库（GitHub）
  main: A ← B ← C ← D ← E
           ↓ pull
本地仓库
  origin/main: A ← B ← C ← D ← E  ✅ 更新
  main: A ← B ← C ← D ← E         ✅ 自动合并
```

### 使用场景对比

**使用 fetch**：
```bash
# 场景 1：检查更新但不想立即合并
git fetch origin
git log --oneline main..origin/main  # 查看有什么新内容
git diff main origin/main             # 查看具体更改
# 决定后再合并
git merge origin/main

# 场景 2：多人协作，想先看看别人的更改
git fetch --all
git log --oneline --graph --all  # 查看所有分支
# 决定如何处理

# 场景 3：持续集成，检查是否有新提交
git fetch origin
if [ "$(git rev-parse main)" != "$(git rev-parse origin/main)" ]; then
  echo "有新提交"
fi
```

**使用 pull**：
```bash
# 场景 1：日常开发，快速同步
git pull origin main

# 场景 2：开始工作前同步最新代码
git checkout main
git pull
git checkout -b feature/new-feature

# 场景 3：CI/CD 拉取最新代码
git pull origin main
npm test
```

### 最佳实践

**保守工作流（推荐）**：
```bash
# 1. 先 fetch 检查
git fetch origin

# 2. 查看有什么更新
git log --oneline main..origin/main

# 3. 决定如何合并
# 如果没有本地提交，直接 merge
git merge origin/main

# 如果有本地提交，使用 rebase
git rebase origin/main
```

**快速工作流**：
```bash
# 直接 pull，使用 rebase
git pull --rebase origin main
```

**团队协作建议**：
```bash
# 主分支：使用 pull（merge）
git checkout main
git pull origin main

# 功能分支：使用 pull --rebase
git checkout feature/my-feature
git pull --rebase origin feature/my-feature
```

## 处理拉取冲突

### 识别冲突

```bash
# 拉取时遇到冲突
$ git pull origin main
Auto-merging file.txt
CONFLICT (content): Merge conflict in file.txt
Automatic merge failed; fix conflicts and then commit the result.
```

### merge 冲突处理

**步骤**：

```bash
# 1. 拉取（遇到冲突）
git pull origin main
# CONFLICT (content): Merge conflict in file.txt

# 2. 查看冲突文件
git status
# Unmerged paths:
#   both modified:   file.txt

# 3. 打开文件解决冲突
# file.txt 内容：
<<<<<<< HEAD
local changes
=======
remote changes
>>>>>>> origin/main

# 4. 手动编辑，保留需要的内容
# file.txt 修改后：
local and remote changes combined

# 5. 标记为已解决
git add file.txt

# 6. 完成合并
git commit -m "Merge remote changes"
# 或直接提交（Git 会生成默认消息）
git commit

# 7. 推送
git push origin main
```

### rebase 冲突处理

```bash
# 1. 使用 rebase 拉取（遇到冲突）
git pull --rebase origin main
# CONFLICT (content): Merge conflict in file.txt
# error: could not apply abc123... Local commit

# 2. 查看状态
git status
# rebase in progress
# Unmerged paths:
#   both modified:   file.txt

# 3. 解决冲突（同上）
# 编辑 file.txt，解决冲突

# 4. 标记为已解决
git add file.txt

# 5. 继续 rebase（注意：不是 commit）
git rebase --continue

# 6. 如果有多个提交，可能需要多次解决冲突
# 重复步骤 3-5

# 7. rebase 完成后推送
git push origin main
```

**rebase 冲突可选操作**：
```bash
# 继续 rebase
git rebase --continue

# 跳过当前提交
git rebase --skip

# 中止 rebase，恢复到 rebase 前的状态
git rebase --abort
```

### 冲突解决工具

**命令行工具**：
```bash
# 使用 git mergetool
git mergetool

# 配置默认工具
git config --global merge.tool vimdiff
git config --global merge.tool vscode
```

**图形化工具**：
```bash
# VS Code（推荐）
git config --global merge.tool vscode
git config --global mergetool.vscode.cmd 'code --wait $MERGED'

# 使用
git mergetool  # 在 VS Code 中打开冲突文件
```

**手动选择版本**：
```bash
# 完全使用我们的版本
git checkout --ours file.txt
git add file.txt

# 完全使用他们的版本
git checkout --theirs file.txt
git add file.txt
```

{{< hint warning >}}
**ours vs theirs 在 merge 和 rebase 中的含义不同**

**merge 时**：
- `--ours` = 当前分支（你的更改）
- `--theirs` = 被合并的分支（远程更改）

**rebase 时**：
- `--ours` = 被 rebase 到的分支（远程更改）
- `--theirs` = 当前分支（你的更改）

是的，在 rebase 时含义相反！
{{< /hint >}}

### 预防冲突

**最佳实践**：

```bash
# 1. 频繁同步
# 每天开始工作前
git pull --rebase origin main

# 2. 小步提交
# 频繁提交小的更改，而不是大的更改
git add feature.js
git commit -m "Add feature part 1"
# ... 继续开发 ...
git add feature.js
git commit -m "Add feature part 2"

# 3. 及时推送
# 不要积累太多本地提交
git push origin feature-branch

# 4. 沟通协作
# 如果多人编辑同一文件，提前沟通
# 分工明确，减少冲突

# 5. 使用分支
# 不同功能使用不同分支
git checkout -b feature/user-auth
git checkout -b feature/payment
```

### 复杂冲突解决

**场景：多个文件有冲突**
```bash
# 1. 拉取遇到冲突
git pull origin main
# CONFLICT in file1.txt
# CONFLICT in file2.txt
# CONFLICT in file3.txt

# 2. 逐个解决
# 编辑 file1.txt，解决冲突
git add file1.txt

# 编辑 file2.txt，解决冲突
git add file2.txt

# 编辑 file3.txt，解决冲突
git add file3.txt

# 3. 完成合并
git commit
```

**场景：撤销冲突的合并**
```bash
# 如果解决冲突时出错，想重新开始
git merge --abort   # 取消 merge
git rebase --abort  # 取消 rebase

# 重新拉取
git pull origin main
```

**场景：查看冲突的不同版本**
```bash
# 查看冲突文件的不同版本
git show :1:file.txt  # 共同祖先版本
git show :2:file.txt  # 当前分支版本（ours）
git show :3:file.txt  # 远程分支版本（theirs）

# 比较版本
git diff :2:file.txt :3:file.txt
```

## 实战示例

### 场景 1：查看远程更新

```bash
# 1. 获取更新但不合并
git fetch origin

# 2. 查看有哪些新提交
git log --oneline main..origin/main
# d3e4f5a Fix critical bug
# c2d3e4f Add new feature
# b1c2d3e Update documentation

# 3. 查看具体更改
git diff main origin/main

# 4. 查看特定文件的更改
git diff main origin/main -- src/app.js

# 5. 决定合并
git merge origin/main
```

### 场景 2：保持 Fork 同步

```bash
# 配置（一次性）
git remote add upstream https://github.com/original/repo.git

# 日常同步流程
# 1. 获取上游更新
git fetch upstream

# 2. 切换到主分支
git checkout main

# 3. 合并上游更新
git merge upstream/main
# 或使用 rebase
git rebase upstream/main

# 4. 推送到你的 Fork
git push origin main

# 5. 更新功能分支
git checkout feature/my-feature
git rebase main
git push -f origin feature/my-feature
```

### 场景 3：多分支同步

```bash
# 同时维护多个分支

# 1. 获取所有更新
git fetch origin

# 2. 更新 main 分支
git checkout main
git merge origin/main
git push origin main

# 3. 更新 develop 分支
git checkout develop
git merge origin/develop
git push origin develop

# 4. 更新功能分支（基于 develop）
git checkout feature/my-feature
git rebase develop
git push -f origin feature/my-feature
```

### 场景 4：CI/CD 中的拉取

```bash
#!/bin/bash
# deploy.sh - 部署脚本

# 1. 拉取最新代码
cd /var/www/app
git fetch origin

# 2. 检查是否有更新
LOCAL=$(git rev-parse main)
REMOTE=$(git rev-parse origin/main)

if [ $LOCAL = $REMOTE ]; then
    echo "No updates"
    exit 0
fi

# 3. 有更新，拉取代码
git pull origin main

# 4. 安装依赖
npm install

# 5. 运行测试
npm test

# 6. 重启服务
systemctl restart app

echo "Deployment completed"
```

### 场景 5：解决复杂冲突

```bash
# 场景：长时间未同步，多个文件有冲突

# 1. 尝试拉取
git pull origin main
# CONFLICT in src/app.js
# CONFLICT in src/utils.js
# CONFLICT in README.md

# 2. 查看冲突文件列表
git status
# both modified:   src/app.js
# both modified:   src/utils.js
# both modified:   README.md

# 3. 逐个解决
# 使用工具打开冲突文件
git mergetool

# 4. 或手动编辑每个文件
vim src/app.js      # 解决冲突
git add src/app.js

vim src/utils.js    # 解决冲突
git add src/utils.js

vim README.md       # 解决冲突
git add README.md

# 5. 验证所有冲突已解决
git status
# All conflicts fixed

# 6. 完成合并
git commit

# 7. 运行测试确保没问题
npm test

# 8. 推送
git push origin main
```

## 下一步

学习了拉取和获取后，接下来深入学习远程分支的管理。

下一节：[远程分支](../branches/) →

---

## 💡 练习题

{{< expand "练习 1：fetch vs pull 的选择" >}}
**问题**：以下场景应该使用 `git fetch` 还是 `git pull`？为什么？

A. 你想查看同事推送了什么代码，但还不确定是否要合并
B. 每天早上开始工作，需要同步最新代码
C. CI/CD 流程中需要检查是否有新提交
D. 正在开发功能，想快速同步主分支的更新

{{< expand "查看答案" >}}
**答案**：

**A. 查看但不合并 → git fetch**
```bash
# 使用 fetch（安全，不会修改本地代码）
git fetch origin

# 查看同事推送了什么
git log --oneline main..origin/main
# d3e4f5a (origin/main) Fix bug in payment
# c2d3e4f Add user validation

# 查看具体更改
git diff main origin/main

# 查看特定文件的更改
git diff main origin/main -- src/payment.js

# 决定后再合并
git merge origin/main
# 或
git rebase origin/main

# 为什么选择 fetch：
✅ 安全（不修改工作目录）
✅ 可以先检查再决定
✅ 避免意外冲突
✅ 了解更改内容后再合并
```

**B. 每天开始工作 → git pull**
```bash
# 使用 pull（快速同步）
git checkout main
git pull origin main

# 或使用 rebase 保持历史整洁
git pull --rebase origin main

# 为什么选择 pull：
✅ 快速便捷
✅ 日常操作，不需要检查
✅ 主分支通常是稳定的
✅ 节省时间

# 推荐配置
git config --global pull.rebase true  # 默认使用 rebase
```

**C. CI/CD 检查新提交 → git fetch**
```bash
#!/bin/bash
# check-updates.sh

# 使用 fetch（只检查，不修改）
git fetch origin

# 比较本地和远程
LOCAL=$(git rev-parse main)
REMOTE=$(git rev-parse origin/main)

if [ "$LOCAL" != "$REMOTE" ]; then
    echo "有新提交，触发构建"
    git pull origin main
    npm install
    npm test
    npm run build
else
    echo "没有更新"
fi

# 为什么选择 fetch：
✅ 只检查，不修改
✅ 可以根据结果决定后续操作
✅ 更灵活的控制
✅ 适合自动化脚本
```

**D. 开发中快速同步 → git pull --rebase**
```bash
# 正在开发功能分支
git checkout feature/my-feature

# 同步主分支的更新
git pull --rebase origin main

# 或分两步
git fetch origin
git rebase origin/main

# 为什么选择 pull --rebase：
✅ 快速同步
✅ 保持线性历史
✅ 避免不必要的合并提交
✅ 功能分支上的常规操作

# 如果遇到冲突
# ... 解决冲突 ...
git add .
git rebase --continue
```

**总结对比**：

| 场景 | 命令 | 原因 |
|------|------|------|
| **检查更新** | `git fetch` | 安全，可先查看 |
| **日常同步** | `git pull` | 快速便捷 |
| **自动化脚本** | `git fetch` | 灵活控制 |
| **功能分支** | `git pull --rebase` | 保持整洁历史 |
| **主分支** | `git pull` | 快速同步 |
| **不确定时** | `git fetch` | 保守安全 |

**推荐工作流**：
```bash
# 保守但安全的工作流
git fetch origin                    # 1. 先获取
git log --oneline main..origin/main # 2. 检查更新
git diff main origin/main           # 3. 查看更改
git merge origin/main               # 4. 决定合并

# 快速工作流（适合日常）
git pull --rebase origin main       # 一步到位
```
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 2：解决拉取冲突" >}}
**问题**：在以下场景中如何处理冲突？

场景：你修改了 `app.js`，同事也修改了同一个文件并推送到了远程。现在你想拉取最新代码。

```bash
# 你的更改
function greet() {
    console.log("Hello, World!");
}

# 同事的更改（远程）
function greet() {
    console.log("你好，世界！");
}
```

使用 `git pull` 拉取时会遇到什么？应该如何解决？

{{< expand "查看答案" >}}
**答案**：

**步骤 1：拉取遇到冲突**
```bash
# 尝试拉取
$ git pull origin main
Auto-merging app.js
CONFLICT (content): Merge conflict in app.js
Automatic merge failed; fix conflicts and then commit the result.
```

**步骤 2：查看冲突**
```bash
# 查看状态
$ git status
On branch main
You have unmerged paths.
  (fix conflicts and run "git commit")

Unmerged paths:
  (use "git add <file>..." to mark resolution)
        both modified:   app.js

# 查看冲突文件
$ cat app.js
function greet() {
<<<<<<< HEAD
    console.log("Hello, World!");
=======
    console.log("你好，世界！");
>>>>>>> origin/main
}
```

**冲突标记说明**：
```
<<<<<<< HEAD              # 冲突开始
    你的更改
=======                   # 分隔符
    远程更改
>>>>>>> origin/main       # 冲突结束
```

**步骤 3：解决冲突**

**方案 1：保留你的更改**
```javascript
// 编辑 app.js
function greet() {
    console.log("Hello, World!");
}

// 标记为已解决
git add app.js
git commit -m "Merge remote changes, keep local greeting"
```

**方案 2：保留远程更改**
```javascript
// 编辑 app.js
function greet() {
    console.log("你好，世界！");
}

// 标记为已解决
git add app.js
git commit -m "Merge remote changes, use remote greeting"
```

**方案 3：合并两个更改**
```javascript
// 编辑 app.js
function greet() {
    console.log("Hello, World!");  // 英文
    console.log("你好，世界！");    // 中文
}

// 标记为已解决
git add app.js
git commit -m "Merge remote changes, support both languages"
```

**方案 4：完全重写**
```javascript
// 编辑 app.js
function greet(language = 'en') {
    const greetings = {
        en: "Hello, World!",
        zh: "你好，世界！"
    };
    console.log(greetings[language]);
}

// 标记为已解决
git add app.js
git commit -m "Merge remote changes, add language support"
```

**步骤 4：使用命令行工具快速选择**

**完全使用你的版本**：
```bash
git checkout --ours app.js
git add app.js
git commit -m "Use local version"
```

**完全使用远程版本**：
```bash
git checkout --theirs app.js
git add app.js
git commit -m "Use remote version"
```

**步骤 5：使用图形化工具**

**VS Code**：
```bash
# 在 VS Code 中打开冲突文件
code app.js

# VS Code 会显示：
# Accept Current Change | Accept Incoming Change | Accept Both Changes

# 点击相应按钮即可
```

**git mergetool**：
```bash
# 使用配置的合并工具
git mergetool

# 配置 VS Code 为默认工具
git config --global merge.tool vscode
git config --global mergetool.vscode.cmd 'code --wait $MERGED'
```

**步骤 6：验证和推送**
```bash
# 验证解决正确
git status
# On branch main
# All conflicts fixed but you are still merging.

# 测试代码
node app.js

# 完成合并
git commit

# 推送
git push origin main
```

**使用 rebase 的情况**：

如果使用 `git pull --rebase`：
```bash
# 拉取遇到冲突
$ git pull --rebase origin main
CONFLICT (content): Merge conflict in app.js
error: could not apply abc123... Update greeting

# 解决冲突（同上）
# 编辑 app.js，解决冲突

# 标记为已解决（注意：不是 commit）
git add app.js

# 继续 rebase
git rebase --continue

# 如果有多个提交，可能需要多次解决
# 重复上述步骤

# 完成后推送
git push origin main
```

**rebase 中的 ours vs theirs（反向）**：
```bash
# 注意：在 rebase 中，ours 和 theirs 的含义相反

# merge 中：
# --ours = 当前分支（你的）
# --theirs = 远程分支

# rebase 中：
# --ours = 远程分支（被 rebase 到的）
# --theirs = 当前分支（你的）

# 所以在 rebase 中：
git checkout --theirs app.js  # 使用你的版本
git checkout --ours app.js    # 使用远程版本
```

**预防类似冲突**：
```bash
# 1. 频繁拉取
git pull --rebase origin main  # 每天多次

# 2. 小步提交
# 不要积累大量更改

# 3. 沟通协作
# 如果多人编辑同一文件，提前沟通

# 4. 代码审查
# 通过 Pull Request 减少直接冲突
```

**撤销冲突的合并**：
```bash
# 如果解决冲突时出错，想重新开始
git merge --abort   # 取消 merge
git rebase --abort  # 取消 rebase

# 重新开始
git pull origin main
```
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 3：配置最佳实践" >}}
**问题**：为了更好地使用 `git fetch` 和 `git pull`，应该如何配置 Git？

写出推荐的配置命令并解释原因。

{{< expand "查看答案" >}}
**答案**：

**推荐配置命令**：

```bash
# 1. 设置 pull 默认使用 rebase
git config --global pull.rebase true

# 2. 自动设置上游分支
git config --global push.autoSetupRemote true

# 3. 自动修剪已删除的远程分支
git config --global fetch.prune true

# 4. 在 rebase 时保留合并提交
git config --global pull.rebase merges

# 5. 配置默认远程仓库
git config --global remote.origin.prune true

# 6. 设置快进合并为默认
git config --global merge.ff only

# 7. 配置合并工具
git config --global merge.tool vscode
git config --global mergetool.vscode.cmd 'code --wait $MERGED'

# 8. 禁用合并工具的备份文件
git config --global mergetool.keepBackup false

# 9. 显示原始冲突风格（更清晰）
git config --global merge.conflictstyle diff3
```

**详细解释**：

**1. pull 默认使用 rebase**
```bash
git config --global pull.rebase true

原因：
✅ 保持线性历史
✅ 避免不必要的合并提交
✅ 历史更整洁
✅ 更容易理解

效果：
# 之前
git pull origin main  # 创建合并提交

# 之后
git pull origin main  # 自动使用 rebase
```

**2. 自动设置上游分支**
```bash
git config --global push.autoSetupRemote true

原因：
✅ 首次推送无需 -u
✅ 简化工作流
✅ 减少命令输入

效果：
# 之前
git push -u origin feature-branch

# 之后
git push  # 自动设置跟踪
```

**3. 自动修剪远程分支**
```bash
git config --global fetch.prune true

原因：
✅ 自动删除已删除的远程分支引用
✅ 保持本地引用整洁
✅ 避免混淆

效果：
# 远程分支被删除后
git fetch  # 自动删除本地的远程引用
# 不需要手动 git fetch -p
```

**4. 保留合并提交**
```bash
git config --global pull.rebase merges

原因：
✅ 保留有意义的合并提交
✅ 保持功能分支的完整性
✅ 更好的历史追溯

效果：
# 有合并提交时，rebase 会保留它们
# 而不是展开成单个提交
```

**5. 快进合并为默认**
```bash
git config --global merge.ff only

原因：
✅ 确保历史是线性的
✅ 不能快进时会提示
✅ 强制使用 rebase

注意：
⚠️ 这是严格模式
⚠️ 可能需要经常 rebase
⚠️ 适合要求高的团队
```

**6. 配置合并工具**
```bash
git config --global merge.tool vscode
git config --global mergetool.vscode.cmd 'code --wait $MERGED'

原因：
✅ 图形化界面更直观
✅ 提高解决冲突的效率
✅ 减少错误

使用：
git mergetool  # 在 VS Code 中打开冲突
```

**7. 冲突风格配置**
```bash
git config --global merge.conflictstyle diff3

原因：
✅ 显示三方对比
✅ 更容易理解冲突原因
✅ 做出更好的决策

效果：
# 默认风格
<<<<<<< HEAD
你的更改
=======
他们的更改
>>>>>>> branch

# diff3 风格
<<<<<<< HEAD
你的更改
||||||| merged common ancestors
原始内容
=======
他们的更改
>>>>>>> branch
```

**完整配置脚本**：

```bash
#!/bin/bash
# git-config-best-practices.sh

echo "配置 Git 最佳实践..."

# Pull 和 Merge 配置
git config --global pull.rebase true
git config --global pull.rebase merges
git config --global merge.conflictstyle diff3

# Push 配置
git config --global push.autoSetupRemote true
git config --global push.default simple

# Fetch 配置
git config --global fetch.prune true
git config --global remote.origin.prune true

# 合并工具配置
git config --global merge.tool vscode
git config --global mergetool.vscode.cmd 'code --wait $MERGED'
git config --global mergetool.keepBackup false

# 颜色配置
git config --global color.ui auto

# 别名配置（可选）
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.cm commit
git config --global alias.lg "log --oneline --graph --all"
git config --global alias.sync "!git fetch --all && git pull --rebase"

echo "配置完成！"

# 查看配置
git config --global --list | grep -E "(pull|push|fetch|merge)"
```

**团队协作配置**：

```bash
# .gitconfig (团队共享)
[pull]
    rebase = true
    rebase = merges
[push]
    autoSetupRemote = true
    default = simple
[fetch]
    prune = true
[merge]
    conflictstyle = diff3
    tool = vscode
[mergetool "vscode"]
    cmd = code --wait $MERGED
[mergetool]
    keepBackup = false
```

**验证配置**：

```bash
# 查看所有配置
git config --global --list

# 查看特定配置
git config --get pull.rebase
git config --get fetch.prune

# 测试配置
git pull  # 应该使用 rebase
git fetch # 应该自动修剪
```

**根据项目调整**：

```bash
# 某些项目可能需要不同配置
cd my-project

# 仅在此项目使用 merge
git config pull.rebase false

# 检查项目配置
git config --local --list
```
{{< /expand >}}
{{< /expand >}}

---

{{< hint success >}}
**检查清单** - 完成本节后，你应该能够：

- [ ] 理解 git fetch 的作用（只下载，不合并）
- [ ] 理解 git pull 的作用（下载并合并）
- [ ] 区分 fetch 和 pull 的使用场景
- [ ] 使用 fetch 检查远程更新
- [ ] 使用 pull 同步远程代码
- [ ] 理解 pull --rebase 的优势
- [ ] 处理 merge 冲突
- [ ] 处理 rebase 冲突
- [ ] 配置 pull 的默认行为
- [ ] 使用工具解决冲突
- [ ] 预防和处理复杂冲突
- [ ] 理解 --ours 和 --theirs 在不同场景的含义
{{< /hint >}}
