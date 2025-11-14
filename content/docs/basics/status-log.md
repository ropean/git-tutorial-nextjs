---
title: "查看状态和历史"
weight: 3
bookToc: true
---

# 查看状态和历史

本章将学习如何查看仓库的当前状态和提交历史。这是日常使用 Git 最频繁的操作之一。

## git status - 查看仓库状态

`git status` 是最常用的 Git 命令之一，用于查看工作区和暂存区的状态。

### 基本用法

```bash
# 查看完整状态
git status

# 查看简短状态
git status -s
git status --short

# 查看分支信息
git status -b
git status --branch
```

### 详细状态输出

```bash
$ git status
On branch main                          # 当前分支
Your branch is up to date with 'origin/main'.  # 与远程分支的关系

Changes to be committed:                # 已暂存，将要提交
  (use "git restore --staged <file>..." to unstage)
        new file:   index.html
        modified:   README.md

Changes not staged for commit:         # 已修改，未暂存
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   style.css

Untracked files:                        # 未跟踪的新文件
  (use "git add <file>..." to include in what will be committed)
        script.js
```

### 简短状态输出

简短格式更紧凑，适合快速查看：

```bash
$ git status -s
A  index.html      # 新文件已暂存
M  README.md       # 已暂存的修改
 M style.css       # 未暂存的修改
MM app.js          # 有暂存的修改，也有未暂存的修改
?? script.js       # 未跟踪的文件
```

**状态标记**：

| 标记 | 含义 |
|------|------|
| `??` | 未跟踪的文件 |
| `A` | 新添加到暂存区的文件 |
| `M` | 修改的文件 |
| `D` | 删除的文件 |
| `R` | 重命名的文件 |
| `C` | 复制的文件 |
| `U` | 未合并的文件（有冲突） |

**两列标记**：
- 左列：暂存区的状态
- 右列：工作区的状态

```bash
 M file.txt   # 工作区修改，未暂存
M  file.txt   # 暂存区修改
MM file.txt   # 暂存区和工作区都有修改
```

### 实战示例

```bash
# 创建测试环境
mkdir git-status-demo
cd git-status-demo
git init -b main

# 创建并提交第一个文件
echo "# Project" > README.md
git add README.md
git commit -m "Initial commit"

# 创建新文件
echo "body {}" > style.css

# 修改已有文件
echo "## About" >> README.md

# 暂存 README.md
git add README.md

# 再次修改 README.md
echo "This is a demo" >> README.md

# 查看详细状态
git status

# 查看简短状态
git status -s
# M  README.md    # 有暂存的修改
#  M README.md    # 还有未暂存的修改
# ?? style.css   # 未跟踪的新文件
```

## git log - 查看提交历史

`git log` 用于查看提交历史，是理解项目演进的重要工具。

### 基本用法

```bash
# 查看完整的提交历史
git log

# 查看简洁的单行历史
git log --oneline

# 查看最近 N 次提交
git log -n 5
git log -5

# 查看某个文件的历史
git log README.md

# 查看某个目录的历史
git log src/
```

### 默认输出格式

```bash
$ git log

commit 3a7d2f9c8b1e4a6d5c9f8e7a6b5c4d3e2f1a0b9c
Author: Your Name <your.email@example.com>
Date:   Mon Nov 14 10:30:00 2023 +0800

    添加用户登录功能

    实现了用户名密码登录
    添加了表单验证

commit 1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c
Author: Your Name <your.email@example.com>
Date:   Sun Nov 13 15:20:00 2023 +0800

    初始化项目
```

### 单行格式（--oneline）

最常用的格式，简洁明了：

```bash
$ git log --oneline

3a7d2f9 添加用户登录功能
1b2c3d4 初始化项目
```

### 图形化显示（--graph）

显示分支和合并的图形：

```bash
$ git log --oneline --graph --all

* 3a7d2f9 (HEAD -> main) 添加用户登录功能
* 1b2c3d4 初始化项目
```

更复杂的分支结构：

```bash
$ git log --oneline --graph --all

* 7a8b9c0 (HEAD -> feature) 完成新功能
* 6d7e8f9 开发中
| * 4e5f6a7 (main) 修复 bug
|/
* 2c3d4e5 合并功能分支
*   1a2b3c4 Merge branch 'feature'
|\
| * 9e8d7c6 功能开发
* | 5f6a7b8 主分支开发
|/
* 3b4c5d6 初始提交
```

### 格式化输出（--pretty）

自定义输出格式：

```bash
# 预定义格式
git log --pretty=oneline
git log --pretty=short
git log --pretty=full
git log --pretty=fuller

# 自定义格式
git log --pretty=format:"%h - %an, %ar : %s"
# 3a7d2f9 - John Doe, 2 hours ago : 添加用户登录功能
# 1b2c3d4 - John Doe, 1 day ago : 初始化项目
```

**常用格式占位符**：

| 占位符 | 说明 |
|--------|------|
| `%H` | 完整的提交哈希值 |
| `%h` | 简短的提交哈希值 |
| `%an` | 作者名字 |
| `%ae` | 作者邮箱 |
| `%ad` | 作者日期 |
| `%ar` | 作者相对日期（如 "2 hours ago"） |
| `%cn` | 提交者名字 |
| `%ce` | 提交者邮箱 |
| `%cd` | 提交日期 |
| `%cr` | 提交相对日期 |
| `%s` | 提交信息标题 |
| `%b` | 提交信息正文 |
| `%d` | 引用名称（分支、标签） |

**实用的自定义格式**：

```bash
# 紧凑的提交日志
git log --pretty=format:"%C(yellow)%h%C(reset) - %s %C(green)(%cr)%C(reset) %C(blue)<%an>%C(reset)"

# 带分支信息
git log --pretty=format:"%C(yellow)%h%C(reset)%C(auto)%d%C(reset) %s %C(green)(%cr)%C(reset)"

# 详细的提交信息
git log --pretty=format:"%C(bold blue)%h%C(reset) - %C(bold green)(%ar)%C(reset) %C(white)%s%C(reset) %C(dim white)- %an%C(reset)"
```

### 筛选提交

#### 按数量

```bash
# 查看最近 5 次提交
git log -5

# 查看最近 1 次提交
git log -1
```

#### 按时间

```bash
# 最近一周的提交
git log --since="1 week ago"
git log --after="1 week ago"

# 2023年11月的提交
git log --since="2023-11-01" --until="2023-11-30"

# 最近 2 天
git log --since="2 days ago"

# 指定时间之后
git log --after="2023-01-01"

# 指定时间之前
git log --before="2023-12-31"
```

#### 按作者

```bash
# 查看某个作者的提交
git log --author="John"

# 支持正则表达式
git log --author="John\|Jane"

# 排除某个作者
git log --author="^((?!John).*)$"
```

#### 按提交信息

```bash
# 搜索提交信息中包含特定关键词的提交
git log --grep="登录"

# 区分大小写
git log --grep="Login" -i

# 正则表达式
git log --grep="^feat:"

# 多个条件（OR）
git log --grep="bug" --grep="fix"

# 多个条件（AND）
git log --grep="bug" --grep="fix" --all-match
```

#### 按文件

```bash
# 查看某个文件的提交历史
git log README.md

# 查看某个目录的历史
git log src/

# 查看已删除文件的历史
git log --all --full-history -- deleted-file.txt
```

#### 按提交内容

```bash
# 查找添加或删除了特定内容的提交
git log -S "function login"

# 使用正则表达式
git log -G "function.*login"
```

### 查看修改内容

#### 显示每次提交的差异（-p）

```bash
# 显示每次提交的详细修改
git log -p

# 只显示最近 2 次提交的修改
git log -p -2

# 查看某个文件的修改历史
git log -p README.md
```

#### 显示统计信息（--stat）

```bash
# 显示每次提交修改的文件统计
git log --stat

# 输出示例：
# commit 3a7d2f9
# Author: John Doe
# Date:   Mon Nov 14 10:30:00 2023
#
#     添加用户登录功能
#
#  src/login.js | 45 +++++++++++++++++++++++++++++++++++++++++++++
#  src/auth.js  | 23 +++++++++++++++++++++++
#  2 files changed, 68 insertions(+)
```

#### 显示简要统计（--shortstat）

```bash
git log --shortstat

# 输出示例：
# commit 3a7d2f9
# Author: John Doe
# Date:   Mon Nov 14 10:30:00 2023
#
#     添加用户登录功能
#
#  2 files changed, 68 insertions(+)
```

### 限制输出范围

#### 查看指定分支

```bash
# 查看指定分支的历史
git log main
git log feature-login

# 查看所有分支
git log --all

# 查看所有本地和远程分支
git log --all --remotes
```

#### 查看分支差异

```bash
# 查看 feature 分支有但 main 分支没有的提交
git log main..feature

# 查看 main 分支有但 feature 分支没有的提交
git log feature..main

# 查看两个分支的差异（任一分支独有的提交）
git log main...feature --oneline --graph
```

### 实用的日志别名

在 `.gitconfig` 中添加别名：

```bash
# 设置别名
git config --global alias.lg "log --oneline --graph --all --decorate"
git config --global alias.ll "log --graph --pretty=format:'%C(yellow)%h%C(reset) - %s %C(green)(%cr)%C(reset) %C(blue)<%an>%C(reset)%C(auto)%d%C(reset)' --all"
git config --global alias.ls "log --pretty=format:'%C(yellow)%h %C(blue)%ad%C(reset) %s%C(green) [%cn]%C(reset)' --date=short"

# 使用别名
git lg
git ll
git ls
```

### 实战示例

#### 示例 1：查看项目演进

```bash
# 创建测试仓库
mkdir git-log-demo
cd git-log-demo
git init -b main

# 创建一些提交
echo "# Project" > README.md
git add README.md
git commit -m "docs: 添加 README"

mkdir src
echo "console.log('app')" > src/app.js
git add src/
git commit -m "feat: 添加应用入口"

echo "body {}" > src/style.css
git add src/style.css
git commit -m "style: 添加样式文件"

# 查看历史
git log --oneline
# c3d4e5f style: 添加样式文件
# b2c3d4e feat: 添加应用入口
# a1b2c3d docs: 添加 README

# 查看详细信息
git log --stat

# 图形化显示
git log --oneline --graph --all
```

#### 示例 2：查找特定提交

```bash
# 查找最近一周关于"登录"功能的提交
git log --since="1 week ago" --grep="登录" --oneline

# 查找 John 在 11 月做的提交
git log --author="John" --since="2023-11-01" --until="2023-11-30"

# 查找修改了 README.md 的提交
git log --oneline README.md

# 查找添加或删除了 "function login" 的提交
git log -S "function login" --oneline
```

#### 示例 3：美化的日志输出

```bash
# 彩色的单行日志
git log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit

# 或者创建别名
git config --global alias.lg "log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"

# 使用别名
git lg
```

## 其他查看历史的命令

### git show - 查看提交详情

```bash
# 查看最新提交的详细信息
git show

# 查看指定提交
git show 3a7d2f9

# 查看指定文件在某次提交的内容
git show 3a7d2f9:src/app.js

# 查看某次提交修改的统计
git show --stat 3a7d2f9
```

### git reflog - 查看引用日志

`reflog` 记录了 HEAD 和分支引用的变化历史，即使提交被删除也能找到：

```bash
# 查看 HEAD 的变化历史
git reflog

# 输出示例：
# 3a7d2f9 HEAD@{0}: commit: 添加登录功能
# 1b2c3d4 HEAD@{1}: commit: 初始化项目
# a1b2c3d HEAD@{2}: reset: moving to HEAD^

# 查看指定分支的 reflog
git reflog show main
```

### git shortlog - 按作者分组

```bash
# 按作者分组显示提交
git shortlog

# 只显示提交数量
git shortlog -s

# 按提交数量排序
git shortlog -sn

# 输出示例：
#   15  John Doe
#   10  Jane Smith
#    5  Bob Johnson
```

### git blame - 查看文件每行的修改者

```bash
# 查看文件每一行是谁修改的
git blame README.md

# 查看指定行范围
git blame -L 10,20 README.md

# 简化输出
git blame -s README.md
```

## 高级筛选技巧

### 组合多个条件

```bash
# 查找 John 在最近一周内关于"修复"的提交
git log --author="John" --since="1 week ago" --grep="修复"

# 查找修改了 src/ 目录且包含"优化"的提交
git log --grep="优化" -- src/

# 查找两个分支的差异，且作者是 John
git log main..feature --author="John"
```

### 排除某些提交

```bash
# 查看所有提交，但排除合并提交
git log --no-merges

# 只查看合并提交
git log --merges
```

### 查看文件重命名历史

```bash
# 跟踪文件重命名
git log --follow oldname.txt

# 查看重命名的详细信息
git log --follow --oneline -- renamed-file.txt
```

## 命令速查

| 命令 | 说明 |
|------|------|
| `git status` | 查看工作区状态 |
| `git status -s` | 简短状态 |
| `git log` | 查看提交历史 |
| `git log --oneline` | 单行历史 |
| `git log --graph` | 图形化显示 |
| `git log --stat` | 显示文件统计 |
| `git log -p` | 显示详细修改 |
| `git log -n 5` | 最近 5 次提交 |
| `git log --since="1 week"` | 时间筛选 |
| `git log --author="John"` | 作者筛选 |
| `git log --grep="关键词"` | 信息筛选 |
| `git log -- file.txt` | 文件历史 |
| `git log main..feature` | 分支差异 |
| `git show <commit>` | 查看提交详情 |
| `git reflog` | 引用日志 |
| `git shortlog -sn` | 按作者统计 |
| `git blame <file>` | 查看修改者 |

## 下一步

掌握了查看状态和历史后，接下来学习如何比较文件的差异。

下一节：[比较差异](../diff/) →

---

## 💡 练习题

{{< expand "练习 1：状态查看" >}}
**任务**：执行以下操作并观察每步的状态变化

1. 创建新仓库
2. 创建文件 `app.js` 并查看状态
3. 添加到暂存区并查看状态
4. 修改 `app.js` 并查看状态（不要重新 add）
5. 使用简短格式查看状态

{{< expand "查看答案" >}}
```bash
# 1. 创建仓库
mkdir status-practice
cd status-practice
git init -b main

# 2. 创建文件并查看状态
echo "console.log('Hello')" > app.js
git status
# Untracked files:
#   app.js

# 3. 添加到暂存区
git add app.js
git status
# Changes to be committed:
#   new file:   app.js

# 4. 修改文件（不 add）
echo "console.log('World')" >> app.js
git status
# Changes to be committed:
#   new file:   app.js
# Changes not staged for commit:
#   modified:   app.js

# 5. 简短格式
git status -s
# AM app.js
# 左边 A = 新文件已暂存
# 右边 M = 工作区有修改
```
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 2：查看提交历史" >}}
**任务**：创建一些提交，然后使用不同的方式查看历史

1. 创建 5 次提交
2. 查看单行格式的历史
3. 查看最近 3 次提交
4. 查看包含统计信息的历史
5. 创建一个美化的日志别名

{{< expand "查看答案" >}}
```bash
# 1. 创建提交
git init -b main
echo "v1" > file.txt && git add . && git commit -m "第一次提交"
echo "v2" >> file.txt && git add . && git commit -m "第二次提交"
echo "v3" >> file.txt && git add . && git commit -m "第三次提交"
echo "v4" >> file.txt && git add . && git commit -m "第四次提交"
echo "v5" >> file.txt && git add . && git commit -m "第五次提交"

# 2. 单行格式
git log --oneline

# 3. 最近 3 次提交
git log -3 --oneline

# 4. 包含统计信息
git log --stat

# 5. 创建别名
git config --global alias.lg "log --graph --pretty=format:'%C(yellow)%h%C(reset) - %s %C(green)(%cr)%C(reset) %C(blue)<%an>%C(reset)' --abbrev-commit"

# 使用别名
git lg
```
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 3：筛选提交" >}}
**问题**：如何查找以下提交？

A. 查找 John 在 2023 年 11 月做的所有提交
B. 查找提交信息包含"修复"的提交
C. 查找修改了 `src/app.js` 文件的提交
D. 查找添加或删除了字符串 "login" 的提交

{{< expand "查看答案" >}}
```bash
# A. 按作者和时间筛选
git log --author="John" --since="2023-11-01" --until="2023-11-30"

# B. 按提交信息筛选
git log --grep="修复"

# C. 查看特定文件的历史
git log src/app.js
# 或查看详细修改
git log -p src/app.js

# D. 按内容筛选（pickaxe）
git log -S "login"
# 或使用正则表达式
git log -G "login"
```

**说明**：
- `--grep` 搜索提交信息
- `-S` 搜索添加或删除特定字符串的提交
- `-G` 使用正则表达式搜索
- `-- <file>` 查看特定文件的历史
{{< /expand >}}
{{< /expand >}}

---

{{< hint success >}}
**检查清单** - 完成本节后，你应该能够：

- [ ] 使用 `git status` 查看仓库状态
- [ ] 理解简短状态的标记含义
- [ ] 使用 `git log` 查看提交历史
- [ ] 使用 `--oneline`、`--graph` 等选项美化输出
- [ ] 按时间、作者、内容筛选提交
- [ ] 使用 `git show` 查看提交详情
- [ ] 使用 `git reflog` 查看引用历史
- [ ] 创建实用的日志别名
{{< /hint >}}
