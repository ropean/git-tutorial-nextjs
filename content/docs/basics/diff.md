---
title: "比较差异"
weight: 4
bookToc: true
---

# 比较差异

本章将学习如何使用 `git diff` 命令比较文件和提交之间的差异。这是理解代码变化的重要工具。

## git diff 基础

`git diff` 用于显示文件内容的差异，它可以比较：
- 工作区和暂存区
- 暂存区和最后一次提交
- 两次提交之间
- 两个分支之间

### 基本用法

```bash
# 查看工作区和暂存区的差异（未暂存的修改）
git diff

# 查看暂存区和最后一次提交的差异（将要提交的修改）
git diff --staged
git diff --cached

# 查看工作区和最后一次提交的差异（所有修改）
git diff HEAD

# 查看两次提交之间的差异
git diff <commit1> <commit2>

# 查看两个分支之间的差异
git diff branch1 branch2
```

## 理解 diff 输出

让我们通过一个实例理解 diff 的输出格式。

### 创建示例

```bash
# 初始化仓库
mkdir diff-demo
cd diff-demo
git init -b main

# 创建并提交文件
cat > hello.py << 'EOF'
def greet(name):
    print("Hello, " + name)

greet("World")
EOF

git add hello.py
git commit -m "Initial commit"

# 修改文件
cat > hello.py << 'EOF'
def greet(name):
    print(f"Hello, {name}!")

def goodbye(name):
    print(f"Goodbye, {name}!")

greet("World")
goodbye("World")
EOF
```

### 查看差异

```bash
git diff hello.py
```

**输出解析**：

```diff
diff --git a/hello.py b/hello.py
index 1234567..abcdefg 100644
--- a/hello.py
+++ b/hello.py
@@ -1,4 +1,7 @@
 def greet(name):
-    print("Hello, " + name)
+    print(f"Hello, {name}!")

+def goodbye(name):
+    print(f"Goodbye, {name}!")
+
 greet("World")
+goodbye("World")
```

**各部分说明**：

1. **文件头**
```diff
diff --git a/hello.py b/hello.py
```
- `a/hello.py` - 修改前的文件
- `b/hello.py` - 修改后的文件

2. **索引信息**
```diff
index 1234567..abcdefg 100644
```
- `1234567` - 修改前的对象哈希
- `abcdefg` - 修改后的对象哈希
- `100644` - 文件权限

3. **文件标记**
```diff
--- a/hello.py
+++ b/hello.py
```
- `---` 表示修改前的文件
- `+++` 表示修改后的文件

4. **变更块（Hunk）**
```diff
@@ -1,4 +1,7 @@
```
- `-1,4` - 旧文件从第 1 行开始，共 4 行
- `+1,7` - 新文件从第 1 行开始，共 7 行

5. **内容变化**
```diff
 def greet(name):           # 无前缀 = 未改变
-    print("Hello, " + name) # - 前缀 = 删除
+    print(f"Hello, {name}!") # + 前缀 = 添加
```

{{< hint info >}}
**颜色说明**（终端中）：
- 红色：删除的内容（`-` 开头）
- 绿色：添加的内容（`+` 开头）
- 白色：未改变的上下文
{{< /hint >}}

## 工作区、暂存区、仓库之间的比较

### 三个区域的关系

```
┌─────────────┐
│   工作区    │  你正在编辑的文件
│  Working    │
└──────┬──────┘
       │
       │ git diff (默认)
       ▼
┌─────────────┐
│   暂存区    │  准备提交的文件
│  Staging    │
└──────┬──────┘
       │
       │ git diff --staged
       ▼
┌─────────────┐
│   仓库      │  已提交的文件
│ Repository  │
└─────────────┘
```

### 实战示例

```bash
# 初始状态
echo "Line 1" > file.txt
git add file.txt
git commit -m "Initial"

# 修改并添加到暂存区
echo "Line 2" >> file.txt
git add file.txt

# 再次修改（不添加到暂存区）
echo "Line 3" >> file.txt

# 现在我们有三个不同的版本：
# - 仓库中：只有 Line 1
# - 暂存区：有 Line 1 和 Line 2
# - 工作区：有 Line 1, Line 2, Line 3

# 查看工作区 vs 暂存区（只显示 Line 3）
git diff

# 查看暂存区 vs 仓库（只显示 Line 2）
git diff --staged

# 查看工作区 vs 仓库（显示 Line 2 和 Line 3）
git diff HEAD
```

### 各命令详解

#### git diff（工作区 vs 暂存区）

```bash
# 查看所有未暂存的修改
git diff

# 查看指定文件
git diff file.txt

# 查看指定目录
git diff src/
```

**使用场景**：
- 查看刚刚做了哪些修改
- 决定是否要暂存这些修改
- 提交前最后检查

#### git diff --staged（暂存区 vs 仓库）

```bash
# 查看将要提交的内容
git diff --staged

# 或使用 --cached（效果相同）
git diff --cached

# 查看特定文件
git diff --staged file.txt
```

**使用场景**：
- 提交前审查将要提交的内容
- 确认暂存的修改是否正确
- 编写提交信息时参考

#### git diff HEAD（工作区 vs 仓库）

```bash
# 查看所有修改（包括已暂存和未暂存）
git diff HEAD

# 等同于
git diff HEAD~0
```

**使用场景**：
- 查看自上次提交以来的所有修改
- 不关心是否已暂存

## 比较分支和提交

### 比较两次提交

```bash
# 比较两次具体的提交
git diff <commit1> <commit2>

# 比较 HEAD 和上一次提交
git diff HEAD^ HEAD
git diff HEAD~1 HEAD

# 比较 HEAD 和上 3 次提交
git diff HEAD~3 HEAD

# 简写（只显示上一次的修改）
git diff HEAD^
```

**实例**：

```bash
# 创建几次提交
echo "v1" > file.txt && git add . && git commit -m "Version 1"
echo "v2" >> file.txt && git add . && git commit -m "Version 2"
echo "v3" >> file.txt && git add . && git commit -m "Version 3"

# 查看提交历史
git log --oneline
# c3d4e5f Version 3
# b2c3d4e Version 2
# a1b2c3d Version 1

# 比较 Version 1 和 Version 3
git diff a1b2c3d c3d4e5f

# 比较上两次提交
git diff HEAD~2 HEAD
```

### 比较分支

```bash
# 比较两个分支
git diff branch1 branch2

# 比较当前分支和 main 分支
git diff main

# 比较当前分支和远程分支
git diff origin/main

# 只显示文件名
git diff --name-only main feature

# 显示文件名和状态
git diff --name-status main feature
```

**实例**：

```bash
# 创建分支并修改
git checkout -b feature
echo "Feature code" > feature.txt
git add feature.txt
git commit -m "Add feature"

# 切换回 main
git checkout main

# 比较两个分支
git diff main feature

# 只查看文件差异
git diff --name-status main feature
# A       feature.txt
```

### 三点比较（...）

```bash
# 比较 feature 分支相对于共同祖先的修改
git diff main...feature

# 等价于
git diff $(git merge-base main feature) feature
```

**二点 vs 三点**：

```
# 分支历史：
A --- B --- C (main)
       \
        D --- E (feature)

# 二点比较：main..feature
# 显示：B, C, D, E 之间的所有差异

# 三点比较：main...feature
# 显示：feature 分支相对于共同祖先 B 的修改（D, E）
```

## diff 选项和技巧

### 只显示文件名

```bash
# 只显示修改的文件名
git diff --name-only

# 显示文件名和状态
git diff --name-status

# 输出示例：
# M       README.md     # Modified
# A       new-file.txt  # Added
# D       old-file.txt  # Deleted
```

### 显示统计信息

```bash
# 显示简单的统计信息
git diff --stat

# 输出示例：
#  README.md  | 10 +++++-----
#  src/app.js | 25 +++++++++++++++++++++++++
#  2 files changed, 30 insertions(+), 5 deletions(-)

# 更紧凑的统计
git diff --shortstat
#  2 files changed, 30 insertions(+), 5 deletions(-)

# 数字统计
git diff --numstat
# 25      0       src/app.js
# 5       5       README.md
```

### 忽略某些差异

```bash
# 忽略空白字符的变化
git diff -w
git diff --ignore-all-space

# 忽略行尾空白字符
git diff --ignore-space-at-eol

# 忽略空白行的变化
git diff --ignore-blank-lines
```

### 上下文行数

```bash
# 显示更多上下文（默认 3 行）
git diff -U5      # 5 行上下文
git diff -U10     # 10 行上下文
git diff -U0      # 不显示上下文，只显示改动

# 全文显示
git diff --no-prefix
```

### 单词级别的差异

```bash
# 显示单词级别的差异（而不是行级别）
git diff --word-diff

# 输出示例：
# def greet(name):
#     print([-"Hello, " + name-]{+"Hello, {name}!"+})
```

**颜色模式**：

```bash
# 彩色单词差异
git diff --word-diff=color

# 只显示修改的单词
git diff --word-diff=plain
```

### 比较特定路径

```bash
# 只比较某个目录
git diff src/

# 只比较某个文件
git diff README.md

# 比较多个路径
git diff src/ tests/ README.md

# 使用通配符
git diff '*.js'
```

## 查看特定文件的历史差异

```bash
# 查看文件在某次提交中的内容
git show <commit>:path/to/file

# 比较文件在两次提交中的差异
git diff <commit1>:<file> <commit2>:<file>

# 查看文件在不同分支的差异
git diff main:file.txt feature:file.txt
```

**实例**：

```bash
# 查看 README.md 在上次提交时的内容
git show HEAD^:README.md

# 比较 README.md 在两个分支的差异
git diff main:README.md feature:README.md
```

## 可视化 diff 工具

### 配置外部 diff 工具

Git 支持使用外部图形化工具查看差异。

#### VS Code

```bash
# 配置 VS Code 作为 diff 工具
git config --global diff.tool vscode
git config --global difftool.vscode.cmd 'code --wait --diff $LOCAL $REMOTE'

# 使用
git difftool
```

#### Meld（跨平台）

```bash
# 安装 Meld
# Ubuntu: sudo apt install meld
# macOS: brew install meld
# Windows: 下载安装包

# 配置
git config --global diff.tool meld

# 使用
git difftool
```

#### Beyond Compare

```bash
# 配置 Beyond Compare
git config --global diff.tool bc
git config --global difftool.bc.path "c:/Program Files/Beyond Compare 4/bcomp.exe"

# 使用
git difftool
```

#### Kdiff3

```bash
# 配置 Kdiff3
git config --global diff.tool kdiff3

# 使用
git difftool
```

### 使用 difftool

```bash
# 使用配置的图形化工具
git difftool

# 比较两个提交
git difftool <commit1> <commit2>

# 比较两个分支
git difftool main feature

# 不提示确认，直接打开
git difftool --no-prompt

# 为单次使用指定工具
git difftool --tool=meld
```

## 实战场景

### 场景 1：提交前检查

```bash
# 1. 做了一些修改
vim src/app.js
vim src/style.css

# 2. 查看所有修改
git diff

# 3. 添加部分文件
git add src/app.js

# 4. 查看将要提交的内容
git diff --staged

# 5. 查看仍未暂存的内容
git diff

# 6. 确认后提交
git commit -m "Update app.js"
```

### 场景 2：比较分支差异

```bash
# 查看当前分支与 main 的差异
git diff main

# 只看文件列表
git diff --name-status main

# 看详细统计
git diff --stat main

# 查看特定文件在两个分支的差异
git diff main:package.json feature:package.json
```

### 场景 3：代码审查

```bash
# 审查某次提交的修改
git show <commit-hash>

# 审查某个提交修改的特定文件
git show <commit-hash>:path/to/file

# 审查两次提交之间的差异
git diff <commit1>..<commit2>

# 只看修改的文件列表
git diff --name-only <commit1>..<commit2>
```

### 场景 4：寻找引入 bug 的修改

```bash
# 查看某个文件的所有修改历史
git log -p file.txt

# 查找引入特定代码的提交
git log -S "buggy code" -p file.txt

# 比较工作版本和最后一个正常版本
git diff <good-commit> HEAD file.txt
```

## 高级技巧

### 差异过滤

```bash
# 只显示添加的行
git diff | grep "^+"

# 只显示删除的行
git diff | grep "^-"

# 统计修改行数
git diff --stat
```

### 生成补丁文件

```bash
# 生成补丁文件
git diff > changes.patch

# 从补丁文件应用修改
git apply changes.patch

# 检查补丁是否能应用
git apply --check changes.patch
```

### 比较二进制文件

```bash
# 显示二进制文件是否改变
git diff --binary

# 显示二进制文件的详细信息
git diff --stat
```

### 自定义 diff 驱动

对于特殊文件类型（如图片、Word 文档），可以配置自定义 diff 驱动：

```bash
# 为 Word 文档配置 diff
git config diff.word.textconv "strings"

# 在 .gitattributes 中指定
echo "*.docx diff=word" >> .gitattributes
```

## 命令速查

| 命令 | 说明 |
|------|------|
| `git diff` | 工作区 vs 暂存区 |
| `git diff --staged` | 暂存区 vs 仓库 |
| `git diff HEAD` | 工作区 vs 仓库 |
| `git diff <commit>` | 工作区 vs 指定提交 |
| `git diff <c1> <c2>` | 两次提交之间 |
| `git diff <branch>` | 当前分支 vs 指定分支 |
| `git diff --name-only` | 只显示文件名 |
| `git diff --name-status` | 显示文件名和状态 |
| `git diff --stat` | 显示统计信息 |
| `git diff -w` | 忽略空白 |
| `git diff --word-diff` | 单词级差异 |
| `git difftool` | 使用图形化工具 |

## 下一步

掌握了比较差异后，接下来学习如何撤销和恢复修改。

下一节：[撤销更改](../undo/) →

---

## 💡 练习题

{{< expand "练习 1：理解三个区域的差异" >}}
**任务**：执行以下操作并理解每个 diff 命令的输出

```bash
# 创建仓库
mkdir diff-practice
cd diff-practice
git init -b main

# 创建并提交文件
echo "Line 1" > file.txt
git add file.txt
git commit -m "Initial"

# 修改并暂存
echo "Line 2" >> file.txt
git add file.txt

# 再次修改（不暂存）
echo "Line 3" >> file.txt

# 执行以下命令，观察输出
git diff              # 会显示什么？
git diff --staged     # 会显示什么？
git diff HEAD         # 会显示什么？
```

{{< expand "查看答案" >}}
```bash
# git diff（工作区 vs 暂存区）
# 只显示 Line 3（因为 Line 2 已经在暂存区）
+Line 3

# git diff --staged（暂存区 vs 仓库）
# 只显示 Line 2（因为 Line 3 还在工作区）
+Line 2

# git diff HEAD（工作区 vs 仓库）
# 显示 Line 2 和 Line 3（所有修改）
+Line 2
+Line 3
```

**关键理解**：
- `git diff` = 未暂存的修改
- `git diff --staged` = 将要提交的修改
- `git diff HEAD` = 所有修改
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 2：比较分支" >}}
**任务**：创建两个分支并比较它们的差异

1. 在 main 分支创建文件并提交
2. 创建 feature 分支，添加新内容
3. 比较两个分支的差异
4. 只查看修改的文件列表

{{< expand "查看答案" >}}
```bash
# 1. 在 main 分支
git init -b main
echo "Main content" > main.txt
git add main.txt
git commit -m "Add main.txt"

# 2. 创建 feature 分支
git checkout -b feature
echo "Feature content" > feature.txt
echo "More content" >> main.txt
git add .
git commit -m "Add feature"

# 3. 比较分支
git diff main feature
# 或从 feature 分支执行
git diff main

# 4. 只看文件列表
git diff --name-status main feature
# A       feature.txt
# M       main.txt

# 查看统计
git diff --stat main feature
#  feature.txt | 1 +
#  main.txt    | 1 +
#  2 files changed, 2 insertions(+)
```
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 3：实用场景" >}}
**问题**：以下场景应该使用哪个 diff 命令？

A. 想知道自己刚才修改了什么（还没有 git add）
B. 提交前想确认将要提交的内容
C. 想看看自上次提交以来所有的修改
D. 比较当前代码和昨天的提交

{{< expand "查看答案" >}}
**答案**：

A. `git diff`
   - 显示工作区和暂存区的差异
   - 查看未暂存的修改

B. `git diff --staged` 或 `git diff --cached`
   - 显示暂存区和仓库的差异
   - 审查将要提交的内容

C. `git diff HEAD`
   - 显示工作区和最后一次提交的差异
   - 包括已暂存和未暂存的所有修改

D. `git diff <昨天的commit-hash> HEAD`
   - 或者 `git log` 找到昨天的提交哈希
   - 然后 `git diff <hash>`
   - 或使用日期：`git diff 'HEAD@{yesterday}'`

**额外提示**：
```bash
# 查看昨天以来的修改
git diff 'HEAD@{yesterday}'

# 查看一周前的修改
git diff 'HEAD@{1 week ago}'
```
{{< /expand >}}
{{< /expand >}}

---

{{< hint success >}}
**检查清单** - 完成本节后，你应该能够：

- [ ] 理解 diff 输出的格式
- [ ] 比较工作区、暂存区、仓库之间的差异
- [ ] 比较两次提交之间的差异
- [ ] 比较两个分支的差异
- [ ] 使用各种 diff 选项（--stat, --name-only 等）
- [ ] 配置和使用图形化 diff 工具
- [ ] 在实际场景中选择合适的 diff 命令
{{< /hint >}}
