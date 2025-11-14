---
title: "文件操作"
weight: 2
bookToc: true
---

# 文件操作

本章将学习 Git 中最基础也是最常用的两个命令：`git add` 和 `git commit`。理解暂存区的概念对掌握 Git 至关重要。

## Git 的三个区域

在学习具体命令之前，必须理解 Git 的三个工作区域：

```
┌─────────────────┐
│   工作区        │  你编辑文件的地方
│ Working Dir     │
└────────┬────────┘
         │ git add
         ▼
┌─────────────────┐
│   暂存区        │  准备提交的文件
│ Staging Area    │
└────────┬────────┘
         │ git commit
         ▼
┌─────────────────┐
│   仓库          │  永久保存的历史
│ Repository      │
└─────────────────┘
```

**工作区（Working Directory）**
- 你实际操作文件的目录
- 可以编辑、创建、删除文件
- 未跟踪的文件和已修改的文件都在这里

**暂存区（Staging Area / Index）**
- 临时存放即将提交的修改
- 可以精确控制提交哪些内容
- 使用 `git add` 将文件从工作区添加到暂存区

**仓库（Repository）**
- 存储所有提交历史的地方
- 使用 `git commit` 将暂存区的内容永久保存
- 每次提交都会生成一个快照

{{< hint info >}}
**为什么需要暂存区？**

暂存区让你可以精确控制每次提交的内容。例如，你修改了 3 个文件，但只想提交其中 2 个，暂存区就能帮你实现这个需求。
{{< /hint >}}

## git add - 添加到暂存区

`git add` 命令用于将文件从工作区添加到暂存区，准备提交。

### 基本用法

```bash
# 添加单个文件
git add filename.txt

# 添加多个文件
git add file1.txt file2.txt file3.txt

# 添加当前目录下所有文件
git add .

# 添加所有修改（包括删除）
git add -A

# 添加所有修改（等同于 -A）
git add --all
```

### 详细选项

#### 添加指定文件

```bash
# 添加单个文件
git add README.md

# 添加多个指定文件
git add index.html style.css script.js

# 使用通配符
git add *.js           # 添加所有 .js 文件
git add src/*.py       # 添加 src 目录下所有 .py 文件
```

#### 添加目录

```bash
# 添加整个目录
git add src/

# 添加多个目录
git add src/ docs/ tests/
```

#### 添加所有文件

```bash
# 方式 1：添加当前目录及子目录的所有文件（不包括删除）
git add .

# 方式 2：添加所有修改（包括删除）
git add -A
git add --all

# 方式 3：添加所有已跟踪文件的修改（不包括新文件）
git add -u
git add --update
```

**区别对比**：

| 命令 | 新文件 | 修改 | 删除 |
|------|-------|------|------|
| `git add .` | ✅ | ✅ | ✅ |
| `git add -A` | ✅ | ✅ | ✅ |
| `git add -u` | ❌ | ✅ | ✅ |

{{< hint warning >}}
**注意**：`git add .` 和 `git add -A` 在 Git 2.x 中效果相同，但在旧版本中可能有差异。推荐使用 `git add -A` 更明确。
{{< /hint >}}

#### 交互式添加（-p / --patch）

交互式添加允许你部分添加文件的修改：

```bash
# 交互式选择要添加的内容
git add -p filename.txt
git add --patch filename.txt
```

执行后会逐块显示修改，你可以选择：
- `y` - 添加这块修改
- `n` - 不添加这块修改
- `s` - 将这块修改分割成更小的块
- `e` - 手动编辑这块修改
- `q` - 退出
- `?` - 查看帮助

**使用场景**：
```bash
# 你在一个文件中做了多处修改，但只想提交其中一部分
git add -p app.js

# Git 会显示每一块修改，让你选择
```

### 实战示例

#### 示例 1：添加新文件

```bash
# 创建新文件
echo "Hello Git" > hello.txt

# 查看状态
git status
# On branch main
# Untracked files:
#   hello.txt

# 添加到暂存区
git add hello.txt

# 再次查看状态
git status
# On branch main
# Changes to be committed:
#   new file:   hello.txt
```

#### 示例 2：添加修改的文件

```bash
# 修改已存在的文件
echo "New line" >> README.md

# 查看状态
git status
# Changes not staged for commit:
#   modified:   README.md

# 添加修改
git add README.md

# 查看状态
git status
# Changes to be committed:
#   modified:   README.md
```

#### 示例 3：选择性添加

```bash
# 创建项目结构
mkdir src tests
echo "console.log('app')" > src/app.js
echo "console.log('test')" > tests/test.js
echo "# Config" > config.txt

# 只添加 src 目录
git add src/

# 查看状态
git status
# Changes to be committed:
#   new file:   src/app.js
#
# Untracked files:
#   tests/
#   config.txt
```

## git commit - 提交更改

`git commit` 命令将暂存区的内容永久保存到仓库。

### 基本用法

```bash
# 提交暂存区的所有文件（会打开编辑器写提交信息）
git commit

# 直接在命令行指定提交信息（推荐）
git commit -m "提交信息"

# 提交并显示详细的差异信息
git commit -v

# 跳过暂存区，直接提交所有已跟踪文件的修改
git commit -a -m "提交信息"
```

### 提交信息

提交信息是 Git 历史的重要组成部分，应该清晰描述本次提交的目的。

#### 单行提交信息

```bash
# 简短的提交信息（50 字符以内）
git commit -m "添加用户登录功能"

git commit -m "修复导航栏样式问题"

git commit -m "更新 README 文档"
```

#### 多行提交信息

```bash
# 使用多个 -m 选项
git commit -m "添加用户认证系统" \
           -m "实现了用户注册、登录和登出功能" \
           -m "使用 JWT 进行身份验证"
```

或者不加 `-m`，让 Git 打开编辑器：

```bash
git commit

# 编辑器中：
添加用户认证系统

实现了以下功能：
- 用户注册（邮箱验证）
- 用户登录（记住密码）
- 用户登出（清除 session）

使用 JWT 进行身份验证，提高安全性。
```

### 提交选项

#### 跳过暂存区（-a）

```bash
# 自动添加所有已跟踪文件的修改并提交
git commit -a -m "Update all tracked files"

# 简写
git commit -am "Update all tracked files"
```

{{< hint danger >}}
**注意**：`-a` 选项只对已跟踪的文件有效，新建的文件仍需要先 `git add`。
{{< /hint >}}

#### 修改最后一次提交（--amend）

```bash
# 修改最后一次提交的信息
git commit --amend -m "新的提交信息"

# 添加遗漏的文件到最后一次提交
git add forgotten-file.txt
git commit --amend --no-edit
```

**使用场景**：
- 提交后发现提交信息写错了
- 忘记添加某个文件
- 发现有小错误需要修复

{{< hint warning >}}
**警告**：不要修改已经推送到远程仓库的提交，这会导致历史不一致。只修改本地的提交。
{{< /hint >}}

#### 允许空提交（--allow-empty）

```bash
# 创建一个空提交（没有任何文件更改）
git commit --allow-empty -m "触发 CI/CD 流程"
```

**使用场景**：
- 触发 CI/CD 管道
- 标记特定的时间点

### 实战示例

#### 示例 1：完整的添加和提交流程

```bash
# 1. 创建新文件
echo "# My Project" > README.md
mkdir src
echo "console.log('Hello')" > src/index.js

# 2. 查看状态
git status
# Untracked files:
#   README.md
#   src/

# 3. 添加到暂存区
git add README.md src/

# 4. 查看将要提交的内容
git status
# Changes to be committed:
#   new file:   README.md
#   new file:   src/index.js

# 5. 提交
git commit -m "Initial project setup"

# 6. 查看提交历史
git log --oneline
# abc1234 Initial project setup
```

#### 示例 2：部分提交

```bash
# 修改了 3 个文件
echo "content" >> file1.txt
echo "content" >> file2.txt
echo "content" >> file3.txt

# 只提交其中 2 个
git add file1.txt file2.txt
git commit -m "Update file1 and file2"

# file3.txt 仍在工作区，未被提交
git status
# Changes not staged for commit:
#   modified:   file3.txt
```

#### 示例 3：快速提交已跟踪文件

```bash
# 修改了已存在的文件
echo "update" >> README.md
echo "update" >> src/index.js

# 直接提交所有已跟踪文件（跳过 git add）
git commit -am "Quick update to tracked files"
```

#### 示例 4：修正上次提交

```bash
# 提交了代码
git add feature.js
git commit -m "Add new featur"

# 发现提交信息拼写错误，修正它
git commit --amend -m "Add new feature"

# 或者发现忘记添加文件
git add feature.css
git commit --amend --no-edit
```

## 提交最佳实践

### 1. 编写清晰的提交信息

**好的提交信息**：
```bash
git commit -m "修复用户登录页面的表单验证错误"
git commit -m "添加商品搜索功能的单元测试"
git commit -m "优化首页加载性能"
```

**不好的提交信息**：
```bash
git commit -m "修复"              # 太模糊
git commit -m "update"            # 没说明更新了什么
git commit -m "修复了一些bug"     # 不够具体
```

### 2. 遵循提交信息规范

许多团队使用 **Conventional Commits** 规范：

```bash
# 格式：<类型>(<范围>): <描述>

git commit -m "feat: 添加用户登录功能"
git commit -m "fix: 修复导航栏样式问题"
git commit -m "docs: 更新 API 文档"
git commit -m "style: 格式化代码"
git commit -m "refactor: 重构用户认证模块"
git commit -m "test: 添加单元测试"
git commit -m "chore: 更新依赖包"
```

**常用类型**：
- `feat` - 新功能
- `fix` - 修复 bug
- `docs` - 文档更新
- `style` - 代码格式（不影响功能）
- `refactor` - 重构代码
- `test` - 测试相关
- `chore` - 构建过程或辅助工具的变动

### 3. 小步提交，频繁提交

```bash
# 好的做法：每个功能点单独提交
git add login.html
git commit -m "添加登录页面 HTML 结构"

git add login.css
git commit -m "添加登录页面样式"

git add login.js
git commit -m "添加登录表单验证逻辑"

# 不好的做法：一次提交太多内容
git add .
git commit -m "完成登录功能"  # 包含了太多改动
```

### 4. 提交前检查

```bash
# 查看将要提交的内容
git status

# 查看具体的修改
git diff --staged

# 确认无误后再提交
git commit -m "提交信息"
```

### 5. 避免提交这些内容

- ❌ 生成的文件（编译产物、日志等）
- ❌ 依赖包（node_modules、vendor 等）
- ❌ 敏感信息（密码、密钥、token）
- ❌ 临时文件（.DS_Store、*.swp 等）
- ❌ 编辑器配置（.vscode、.idea 等，除非团队共享）

使用 `.gitignore` 文件来忽略这些文件（详见后续章节）。

## 查看暂存状态

### git status - 查看状态

```bash
# 查看详细状态
git status

# 查看简短状态
git status -s
git status --short
```

**输出示例**：

```bash
$ git status
On branch main
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        modified:   README.md
        new file:   src/app.js

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   package.json

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        temp.txt
```

**简短状态**：

```bash
$ git status -s
M  README.md      # 已暂存的修改
A  src/app.js     # 已暂存的新文件
 M package.json   # 未暂存的修改
?? temp.txt       # 未跟踪的文件
```

状态标记：
- `??` - 未跟踪
- `A` - 新添加到暂存区
- `M` - 修改
- `D` - 删除
- `R` - 重命名

### git diff - 查看差异

```bash
# 查看工作区和暂存区的差异（未暂存的修改）
git diff

# 查看暂存区和最后一次提交的差异（将要提交的修改）
git diff --staged
git diff --cached

# 查看工作区和最后一次提交的差异（所有修改）
git diff HEAD
```

## 取消暂存

如果错误地添加了文件到暂存区：

```bash
# 取消暂存单个文件（保留修改）
git restore --staged filename.txt

# 取消暂存所有文件
git restore --staged .

# 旧版本 Git 使用
git reset HEAD filename.txt
```

## 完整工作流示例

```bash
# 1. 创建新功能分支
git checkout -b feature-user-profile

# 2. 开发功能，创建文件
mkdir components
echo "// User Profile Component" > components/UserProfile.js
echo "/* Profile Styles */" > components/UserProfile.css

# 3. 查看状态
git status
# Untracked files:
#   components/

# 4. 添加文件到暂存区
git add components/

# 5. 查看将要提交的内容
git status
# Changes to be committed:
#   new file:   components/UserProfile.js
#   new file:   components/UserProfile.css

# 6. 提交
git commit -m "feat: 添加用户资料组件"

# 7. 继续开发，修改文件
echo "// Add display name" >> components/UserProfile.js

# 8. 快速提交（已跟踪文件）
git commit -am "feat: 添加用户名显示功能"

# 9. 查看提交历史
git log --oneline
# def5678 feat: 添加用户名显示功能
# abc1234 feat: 添加用户资料组件
```

## 命令速查

| 命令 | 说明 |
|------|------|
| `git add <file>` | 添加文件到暂存区 |
| `git add .` | 添加当前目录所有文件 |
| `git add -A` | 添加所有修改（包括删除） |
| `git add -u` | 添加已跟踪文件的修改 |
| `git add -p` | 交互式添加 |
| `git commit -m "msg"` | 提交并附带信息 |
| `git commit -am "msg"` | 添加已跟踪文件并提交 |
| `git commit --amend` | 修改最后一次提交 |
| `git status` | 查看状态 |
| `git status -s` | 查看简短状态 |
| `git diff` | 查看未暂存的修改 |
| `git diff --staged` | 查看已暂存的修改 |
| `git restore --staged <file>` | 取消暂存 |

## 下一步

掌握了添加和提交文件后，接下来学习如何查看仓库状态和历史。

下一节：[查看状态和历史](../status-log/) →

---

## 💡 练习题

{{< expand "练习 1：基础添加和提交" >}}
**任务**：
1. 创建一个新的 Git 仓库
2. 创建 3 个文件：`index.html`、`style.css`、`script.js`
3. 只添加和提交 HTML 和 CSS 文件
4. 查看状态，确认 JS 文件未被提交

{{< expand "查看答案" >}}
```bash
# 1. 创建并初始化仓库
mkdir web-project
cd web-project
git init -b main

# 2. 创建文件
echo "<!DOCTYPE html>" > index.html
echo "body { margin: 0; }" > style.css
echo "console.log('Hello');" > script.js

# 3. 添加并提交 HTML 和 CSS
git add index.html style.css
git commit -m "添加 HTML 和 CSS 文件"

# 4. 查看状态
git status
```

**预期输出**：
```
On branch main
Untracked files:
  (use "git add <file>..." to include in what will be committed)
        script.js

nothing added to commit but untracked files present
```
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 2：理解暂存区" >}}
**问题**：按照以下步骤操作后，`README.md` 的哪个版本会被提交？

```bash
# 步骤 1
echo "Version 1" > README.md
git add README.md

# 步骤 2
echo "Version 2" > README.md

# 步骤 3
git commit -m "Add README"
```

A. 空文件
B. "Version 1"
C. "Version 2"
D. 同时包含 Version 1 和 Version 2

{{< expand "查看答案" >}}
**答案**：B

**解析**：
1. 步骤 1：`README.md` 的内容是 "Version 1"，并被添加到暂存区
2. 步骤 2：修改了工作区的 `README.md` 为 "Version 2"，但**没有执行 `git add`**
3. 步骤 3：提交时，只提交暂存区的内容，即 "Version 1"

**关键点**：提交的是暂存区的内容，而不是工作区的内容！

**验证方法**：
```bash
# 提交后查看状态
git status
# 会显示：
# Changes not staged for commit:
#   modified:   README.md
```
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 3：修正提交" >}}
**场景**：你提交了代码后，发现：
1. 提交信息拼写错误
2. 忘记添加一个重要文件

应该如何修正？

{{< expand "查看答案" >}}
```bash
# 假设你刚才的提交
git add feature.js
git commit -m "Add new featur"  # 拼写错误

# 修正 1：修改提交信息
git commit --amend -m "Add new feature"

# 修正 2：添加遗漏的文件
git add feature-test.js
git commit --amend --no-edit  # --no-edit 保持原提交信息不变

# 查看结果
git log -1
# 只有一个提交，包含了所有文件和正确的提交信息
```

**注意**：
- `--amend` 会替换最后一次提交，而不是创建新提交
- 不要对已推送的提交使用 `--amend`
- `--no-edit` 表示不修改提交信息
{{< /expand >}}
{{< /expand >}}

---

{{< hint success >}}
**检查清单** - 完成本节后，你应该能够：

- [ ] 理解工作区、暂存区、仓库的关系
- [ ] 使用 `git add` 添加文件到暂存区
- [ ] 理解 `git add .`、`git add -A`、`git add -u` 的区别
- [ ] 使用 `git commit` 提交更改
- [ ] 编写清晰的提交信息
- [ ] 使用 `git commit -a` 快速提交
- [ ] 使用 `git commit --amend` 修正提交
- [ ] 使用 `git status` 查看状态
- [ ] 使用 `git diff` 查看修改
- [ ] 取消暂存文件
{{< /hint >}}
