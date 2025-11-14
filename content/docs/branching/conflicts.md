---
title: "解决冲突"
weight: 4
bookToc: true
---

# 解决冲突

当两个分支修改了同一文件的同一部分时，Git 无法自动合并，就会产生冲突。本章将学习如何识别、解决和预防合并冲突。

## 什么是合并冲突

### 冲突产生的原因

当以下情况同时发生时会产生冲突：

1. 两个分支修改了**同一个文件**
2. 修改了**相同的行或相邻的行**
3. Git 无法判断应该保留哪个版本

### 冲突示例场景

```
共同祖先（C1）：
文件内容：
Line 1: Hello
Line 2: World

main 分支（C2）：           feature 分支（C3）：
Line 1: Hello              Line 1: Hello
Line 2: World (from main)  Line 2: World (from feature)

合并时：Git 不知道 Line 2 应该保留哪个版本 → 冲突！
```

## 创建冲突示例

让我们创建一个冲突场景来学习如何解决：

```bash
# 1. 创建仓库和初始文件
mkdir conflict-demo
cd conflict-demo
git init -b main

cat > app.js << 'EOF'
function greet() {
    console.log("Hello");
}

greet();
EOF

git add app.js
git commit -m "Initial commit"

# 2. 创建功能分支并修改
git switch -c feature
cat > app.js << 'EOF'
function greet() {
    console.log("Hello from feature");
}

greet();
EOF

git add app.js
git commit -m "Update greeting in feature"

# 3. 切换回 main 并修改同一位置
git switch main
cat > app.js << 'EOF'
function greet() {
    console.log("Hello from main");
}

greet();
EOF

git add app.js
git commit -m "Update greeting in main"

# 4. 尝试合并（会产生冲突）
git merge feature
```

**输出**：

```
Auto-merging app.js
CONFLICT (content): Merge conflict in app.js
Automatic merge failed; fix conflicts and then commit the result.
```

## 冲突标记解析

打开冲突的文件，你会看到特殊的冲突标记：

```javascript
function greet() {
<<<<<<< HEAD
    console.log("Hello from main");
=======
    console.log("Hello from feature");
>>>>>>> feature
}

greet();
```

### 冲突标记详解

```
<<<<<<< HEAD
当前分支（main）的内容
=======
要合并的分支（feature）的内容
>>>>>>> feature
```

**各部分说明**：

- `<<<<<<< HEAD` - 冲突区域开始，HEAD 表示当前分支
- `=======` - 分隔符，上面是当前分支，下面是要合并的分支
- `>>>>>>> feature` - 冲突区域结束，feature 是要合并的分支名

{{< hint info >}}
**理解冲突标记**：
- HEAD（上方）= 你当前所在的分支（通常是 main）
- 分支名（下方）= 你要合并进来的分支（如 feature）
{{< /hint >}}

### 查看冲突状态

```bash
# 查看冲突文件
git status

# 输出：
# On branch main
# You have unmerged paths.
#   (fix conflicts and run "git commit")
#   (use "git merge --abort" to abort the merge)
#
# Unmerged paths:
#   (use "git add <file>..." to mark resolution)
#         both modified:   app.js
```

## 手动解决冲突

### 步骤 1：编辑文件

打开冲突文件，决定保留哪个版本或者合并两者。

**选择 1：保留当前分支的版本**

```javascript
function greet() {
    console.log("Hello from main");
}

greet();
```

**选择 2：保留要合并分支的版本**

```javascript
function greet() {
    console.log("Hello from feature");
}

greet();
```

**选择 3：合并两个版本**

```javascript
function greet() {
    console.log("Hello from main and feature");
}

greet();
```

**选择 4：完全重写**

```javascript
function greet() {
    console.log("Hello, resolved!");
}

greet();
```

{{< hint warning >}}
**重要**：解决冲突时，必须：
1. 删除所有冲突标记（`<<<<<<<`, `=======`, `>>>>>>>`）
2. 确保代码语法正确
3. 测试代码是否正常工作
{{< /hint >}}

### 步骤 2：标记为已解决

```bash
# 编辑文件解决冲突后，添加到暂存区
git add app.js

# 查看状态
git status
# On branch main
# All conflicts fixed but you are still merging.
#   (use "git commit" to conclude merge)
```

### 步骤 3：完成合并

```bash
# 提交合并（会打开编辑器）
git commit

# 或直接指定提交信息
git commit -m "Merge feature: resolve greeting conflict"
```

### 完整的解决流程

```bash
# 1. 合并产生冲突
git merge feature
# CONFLICT (content): Merge conflict in app.js

# 2. 查看冲突文件
git status
# both modified:   app.js

# 3. 编辑文件解决冲突
vim app.js  # 或使用其他编辑器

# 4. 删除冲突标记，保留想要的内容
# ... 编辑文件 ...

# 5. 标记为已解决
git add app.js

# 6. 完成合并
git commit -m "Resolve merge conflict"

# 7. 验证
git log --oneline --graph
```

## 使用工具解决冲突

### 命令行工具

#### git diff（查看冲突）

```bash
# 查看冲突的详细信息
git diff

# 查看三方差异
git diff --ours    # 当前分支的版本
git diff --theirs  # 要合并分支的版本
git diff --base    # 共同祖先的版本
```

#### git mergetool（图形化工具）

```bash
# 使用配置的合并工具
git mergetool

# 指定特定工具
git mergetool --tool=vimdiff
git mergetool --tool=meld
```

### 配置合并工具

#### VS Code

```bash
# 配置 VS Code 为合并工具
git config --global merge.tool vscode
git config --global mergetool.vscode.cmd 'code --wait $MERGED'

# 使用
git mergetool
```

VS Code 会显示三个面板：
- 左侧：当前分支（Current Change）
- 右侧：要合并的分支（Incoming Change）
- 底部：合并结果

可以点击按钮选择：
- Accept Current Change
- Accept Incoming Change
- Accept Both Changes
- Compare Changes

#### Meld（跨平台）

```bash
# 安装 Meld
# Ubuntu: sudo apt install meld
# macOS: brew install meld
# Windows: 下载安装

# 配置
git config --global merge.tool meld

# 使用
git mergetool
```

#### Beyond Compare

```bash
# 配置
git config --global merge.tool bc3
git config --global mergetool.bc3.path "C:/Program Files/Beyond Compare 4/bcomp.exe"

# 使用
git mergetool
```

#### Kdiff3

```bash
# 配置
git config --global merge.tool kdiff3

# 使用
git mergetool
```

### 合并工具的优势

✅ **可视化对比**：清晰地看到三个版本的差异
✅ **语法高亮**：更容易理解代码
✅ **批量操作**：快速接受多个修改
✅ **撤销功能**：可以撤销错误的选择
✅ **减少错误**：避免手动删除冲突标记时出错

## 查看冲突信息

### git status（查看冲突文件）

```bash
git status

# 输出：
# On branch main
# You have unmerged paths.
#   (fix conflicts and run "git commit")
#
# Unmerged paths:
#   (use "git add <file>..." to mark resolution)
#         both modified:   app.js
#         both added:      config.json
```

### git diff（查看冲突内容）

```bash
# 查看所有冲突
git diff

# 只查看冲突的文件名
git diff --name-only --diff-filter=U

# 查看统计信息
git diff --stat
```

### git ls-files（查看冲突详情）

```bash
# 查看冲突文件的详细信息
git ls-files -u

# 输出示例：
# 100644 a1b2c3d 1	app.js    # 共同祖先
# 100644 d4e5f6g 2	app.js    # 当前分支（ours）
# 100644 g7h8i9j 3	app.js    # 要合并分支（theirs）
```

### git log（查看冲突历史）

```bash
# 查看导致冲突的提交
git log --merge -p

# 查看冲突文件的修改历史
git log --oneline --all --graph -- app.js
```

## 中止合并

如果觉得冲突太复杂，可以中止合并：

```bash
# 中止合并，恢复到合并前的状态
git merge --abort

# 或使用
git reset --merge
```

**使用场景**：
- 冲突太多，需要重新规划
- 发现合并时机不对
- 需要先处理其他问题

{{< hint warning >}}
**注意**：`git merge --abort` 只在合并过程中有效。如果已经完成合并并提交，需要使用 `git revert` 或 `git reset`。
{{< /hint >}}

## 不同类型的冲突

### 内容冲突（最常见）

```bash
# 两个分支修改了同一行
<<<<<<< HEAD
const version = "1.0";
=======
const version = "2.0";
>>>>>>> feature
```

**解决方法**：选择一个版本或合并两者。

### 添加/添加冲突

```bash
# 两个分支都添加了同名文件，但内容不同
# both added: config.json
```

**解决方法**：
1. 决定保留哪个版本
2. 或合并两个文件的内容

```bash
# 查看两个版本
git show :2:config.json  # 当前分支的版本
git show :3:config.json  # 要合并分支的版本

# 解决后添加
git add config.json
```

### 删除/修改冲突

```bash
# 一个分支删除文件，另一个分支修改了它
# deleted by us: old-file.txt
# deleted by them: old-file.txt
```

**解决方法**：
1. 决定是保留修改还是确认删除

```bash
# 保留修改（恢复文件）
git add old-file.txt

# 确认删除
git rm old-file.txt
```

### 重命名/修改冲突

```bash
# 一个分支重命名文件，另一个分支修改了原文件
```

**解决方法**：
1. 确认重命名是否正确
2. 将修改应用到重命名后的文件

## 预防冲突的最佳实践

### 1. 频繁同步

```bash
# 定期从主分支更新功能分支
git switch feature
git merge main  # 或 git rebase main

# 这样可以：
# - 及早发现冲突
# - 冲突更小，更容易解决
# - 避免最后大量冲突
```

### 2. 小步提交

```bash
# 好的做法：每个功能点单独提交
git commit -m "Add user model"
git commit -m "Add user controller"
git commit -m "Add user routes"

# 不好的做法：一次提交所有修改
git commit -m "Add user feature"  # 包含太多修改
```

### 3. 明确分工

```
团队规范示例：
- Alice：负责 frontend/components/
- Bob：负责 backend/api/
- Charlie：负责 database/models/

减少对同一文件的并发修改
```

### 4. 代码审查

```bash
# 合并前审查代码
# 发现可能的冲突
# 提前协调修改
```

### 5. 使用功能分支

```bash
# 每个功能独立分支
git switch -c feature/user-auth
git switch -c feature/product-list

# 完成后立即合并，不要积累
git switch main
git merge feature/user-auth
git branch -d feature/user-auth
```

### 6. 重构单独分支

```bash
# 大规模重构使用独立分支
git switch -c refactor/rename-variables

# 通知团队，避免同时修改
# 尽快完成并合并
```

### 7. 避免修改同一文件

```javascript
// 不好的设计
// config.js - 所有人都修改这个文件
const config = {
    feature1: {...},
    feature2: {...},
    feature3: {...}
};

// 好的设计
// config/feature1.js
// config/feature2.js
// config/feature3.js
// 每个功能独立配置文件
```

### 8. 使用代码格式化工具

```bash
# 统一代码格式，减少格式冲突
# .editorconfig
# .prettierrc
# .eslintrc

# 提交前格式化
npm run format
git add .
git commit -m "Format code"
```

## 高级冲突解决技巧

### 使用 ours/theirs 策略

```bash
# 冲突时全部使用当前分支的版本
git checkout --ours app.js
git add app.js

# 冲突时全部使用要合并分支的版本
git checkout --theirs app.js
git add app.js
```

{{< hint warning >}}
**注意**：这会丢失另一个分支的所有修改，请确保这是你想要的。
{{< /hint >}}

### 逐块选择（patch mode）

```bash
# 交互式选择要保留的部分
git checkout --patch feature -- app.js

# 会逐块询问是否应用修改
```

### 查看三方差异

```bash
# 查看共同祖先的版本
git show :1:app.js

# 查看当前分支的版本
git show :2:app.js

# 查看要合并分支的版本
git show :3:app.js

# 比较三者
diff <(git show :1:app.js) <(git show :2:app.js)
diff <(git show :1:app.js) <(git show :3:app.js)
```

### 重新合并

```bash
# 如果解决得不满意，重新开始
git merge --abort
git merge feature

# 或重置到合并前
git reset --hard ORIG_HEAD
```

## 实战示例

### 示例 1：解决简单冲突

```bash
# 1. 创建冲突
git init -b main
echo "Original line" > file.txt
git add file.txt
git commit -m "Initial"

git switch -c feature
echo "Feature line" > file.txt
git add file.txt
git commit -m "Update in feature"

git switch main
echo "Main line" > file.txt
git add file.txt
git commit -m "Update in main"

# 2. 合并产生冲突
git merge feature
# CONFLICT (content): Merge conflict in file.txt

# 3. 查看冲突
cat file.txt
# <<<<<<< HEAD
# Main line
# =======
# Feature line
# >>>>>>> feature

# 4. 解决冲突
echo "Resolved line" > file.txt

# 5. 完成合并
git add file.txt
git commit -m "Resolve conflict"

# 6. 验证
git log --oneline --graph --all
# *   a1b2c3d (HEAD -> main) Resolve conflict
# |\
# | * d4e5f6g (feature) Update in feature
# * | c3d4e5f Update in main
# |/
# * b2c3d4e Initial
```

### 示例 2：多文件冲突

```bash
# 创建多文件冲突场景
git switch -c multi-conflict
echo "Feature A" > a.txt
echo "Feature B" > b.txt
git add .
git commit -m "Add A and B in feature"

git switch main
echo "Main A" > a.txt
echo "Main B" > b.txt
git add .
git commit -m "Add A and B in main"

# 合并
git merge multi-conflict
# CONFLICT: Merge conflict in a.txt
# CONFLICT: Merge conflict in b.txt

# 查看所有冲突
git status
# both modified:   a.txt
# both modified:   b.txt

# 逐个解决
echo "Resolved A" > a.txt
git add a.txt

echo "Resolved B" > b.txt
git add b.txt

# 提交
git commit -m "Resolve all conflicts"
```

## 命令速查

| 命令 | 说明 |
|------|------|
| `git merge <branch>` | 合并分支（可能产生冲突） |
| `git status` | 查看冲突文件 |
| `git diff` | 查看冲突详情 |
| `git diff --ours` | 查看当前分支版本 |
| `git diff --theirs` | 查看要合并分支版本 |
| `git add <file>` | 标记冲突已解决 |
| `git commit` | 完成合并 |
| `git merge --abort` | 中止合并 |
| `git mergetool` | 使用图形化工具 |
| `git checkout --ours <file>` | 使用当前分支版本 |
| `git checkout --theirs <file>` | 使用要合并分支版本 |
| `git ls-files -u` | 查看冲突文件详情 |

## 下一步

掌握了冲突解决后，接下来学习变基（rebase）操作。

下一节：[变基操作](../rebase/) →

---

## 💡 练习题

{{< expand "练习 1：基础冲突解决" >}}
**任务**：
1. 创建一个冲突场景
2. 手动解决冲突
3. 完成合并

{{< expand "查看答案" >}}
```bash
# 1. 创建仓库和初始文件
mkdir conflict-practice
cd conflict-practice
git init -b main

cat > greeting.js << 'EOF'
function sayHello() {
    console.log("Hello");
}
EOF

git add greeting.js
git commit -m "Initial greeting"

# 2. 创建分支并修改
git switch -c polite
cat > greeting.js << 'EOF'
function sayHello() {
    console.log("Hello, please!");
}
EOF

git add greeting.js
git commit -m "Make greeting polite"

# 3. 在 main 分支也修改同一位置
git switch main
cat > greeting.js << 'EOF'
function sayHello() {
    console.log("Hello, friend!");
}
EOF

git add greeting.js
git commit -m "Make greeting friendly"

# 4. 合并产生冲突
git merge polite
# CONFLICT (content): Merge conflict in greeting.js

# 5. 查看冲突
cat greeting.js
# function sayHello() {
# <<<<<<< HEAD
#     console.log("Hello, friend!");
# =======
#     console.log("Hello, please!");
# >>>>>>> polite
# }

# 6. 解决冲突（合并两个版本）
cat > greeting.js << 'EOF'
function sayHello() {
    console.log("Hello, friend! Please come in!");
}
EOF

# 7. 标记为已解决
git add greeting.js

# 8. 完成合并
git commit -m "Merge polite: combine greetings"

# 9. 验证
git log --oneline --graph
# *   abc123 (HEAD -> main) Merge polite: combine greetings
# |\
# | * def456 (polite) Make greeting polite
# * | 789xyz Make greeting friendly
# |/
# * 012abc Initial greeting
```
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 2：识别冲突类型" >}}
**问题**：判断以下场景会产生冲突吗？

A. main 分支修改了 `file1.txt`，feature 分支修改了 `file2.txt`

B. main 分支在文件末尾添加了一行，feature 分支在文件开头添加了一行

C. main 分支删除了 `old.txt`，feature 分支也删除了 `old.txt`

D. main 分支将函数名从 `foo` 改为 `bar`，feature 分支修改了函数内部实现

{{< expand "查看答案" >}}
**答案**：

**A. 不会冲突**
```bash
# 修改了不同的文件，可以自动合并
git merge feature
# 输出：Merge made by the 'ort' strategy.
```

**B. 不会冲突**
```bash
# 修改了不同的位置，可以自动合并
# main: 在末尾添加
# feature: 在开头添加
# Git 可以智能合并
```

**C. 不会冲突**
```bash
# 两个分支做了相同的操作（都删除）
# Git 认为这是一致的修改
```

**D. 可能冲突**
```bash
# 取决于具体修改：
# - 如果 feature 修改的函数内部没有使用函数名，不冲突
# - 如果 feature 在函数内部调用了自己（递归），会冲突

# 示例 - 不冲突：
# main: function bar() { return 42; }
# feature: function foo() { return 42 * 2; }
# 合并后：function bar() { return 42 * 2; }

# 示例 - 冲突：
# main: function bar() { return bar(); }
# feature: function foo() { return foo() + 1; }
# 冲突：不知道应该是 bar() 还是 foo()
```

**关键原则**：
- 不同文件 → 不冲突
- 同文件不同位置 → 通常不冲突
- 同文件同一行 → 冲突
- 相同操作 → 不冲突
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 3：选择解决策略" >}}
**场景**：你正在合并 feature 分支，遇到了 10 个文件的冲突。

经过检查：
- 8 个文件：feature 分支的修改更正确
- 1 个文件：main 分支的修改更正确
- 1 个文件：需要手动合并

最快的解决方法是什么？

{{< expand "查看答案" >}}
```bash
# 1. 合并产生冲突
git merge feature
# CONFLICT in: file1.txt, file2.txt, ..., file10.txt

# 2. 批量接受 feature 分支的版本（8个文件）
git checkout --theirs file1.txt
git checkout --theirs file2.txt
git checkout --theirs file3.txt
git checkout --theirs file4.txt
git checkout --theirs file5.txt
git checkout --theirs file6.txt
git checkout --theirs file7.txt
git checkout --theirs file8.txt

# 或使用循环
for file in file{1..8}.txt; do
    git checkout --theirs $file
done

# 3. 接受 main 分支的版本（1个文件）
git checkout --ours file9.txt

# 4. 手动解决最后一个文件
vim file10.txt
# ... 编辑解决冲突 ...

# 5. 标记所有文件为已解决
git add .

# 6. 验证
git status
# All conflicts fixed but you are still merging.

# 7. 完成合并
git commit -m "Merge feature: resolve conflicts"
```

**更高效的方法**：

```bash
# 如果大部分文件都应该使用 feature 版本
# 可以直接使用 theirs 策略选项
git merge -X theirs feature

# 但这会影响所有冲突文件
# 所以还是需要手动处理特殊情况
```

**最佳实践**：

1. **分类处理**：
   - 批量处理相同策略的文件
   - 单独处理特殊文件

2. **使用脚本**：
```bash
# resolve-conflicts.sh
#!/bin/bash
# 使用 theirs 的文件列表
theirs_files="file1.txt file2.txt ... file8.txt"
for file in $theirs_files; do
    git checkout --theirs $file
    git add $file
done

# 使用 ours 的文件列表
ours_files="file9.txt"
for file in $ours_files; do
    git checkout --ours $file
    git add $file
done
```

3. **文档记录**：
```bash
# 在合并提交信息中说明解决策略
git commit -m "Merge feature: resolve conflicts

Conflict resolution:
- file1-8: used feature version (theirs)
- file9: used main version (ours)
- file10: manually merged
"
```
{{< /expand >}}
{{< /expand >}}

---

{{< hint success >}}
**检查清单** - 完成本节后，你应该能够：

- [ ] 理解合并冲突产生的原因
- [ ] 识别冲突标记（<<<, ===, >>>）
- [ ] 手动编辑文件解决冲突
- [ ] 使用 `git add` 标记冲突已解决
- [ ] 完成合并提交
- [ ] 使用 `git merge --abort` 中止合并
- [ ] 配置和使用图形化合并工具
- [ ] 使用 `--ours` 和 `--theirs` 选项
- [ ] 查看冲突的详细信息
- [ ] 预防冲突的产生
- [ ] 处理不同类型的冲突
{{< /hint >}}
