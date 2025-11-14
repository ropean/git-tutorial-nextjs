---
title: "第一个仓库"
weight: 3
bookToc: true
---

# 创建第一个 Git 仓库

在本节中，你将创建你的第一个 Git 仓库，并学习如何进行基本的文件管理。

## 创建新仓库

### 方法一：从零开始创建

创建一个新项目并初始化为 Git 仓库：

```bash
# 创建项目目录
mkdir my-first-project
cd my-first-project

# 初始化 Git 仓库
git init
```

成功后你会看到：

```
Initialized empty Git repository in /path/to/my-first-project/.git/
```

{{< hint info >}}
**发生了什么？**
`git init` 命令在当前目录下创建了一个 `.git` 隐藏文件夹，这个文件夹包含了 Git 所需的所有元数据和历史记录。
{{< /hint >}}

### 方法二：克隆现有仓库

从远程仓库克隆一个副本：

```bash
# 克隆 GitHub 上的项目
git clone https://github.com/username/repository.git

# 克隆到指定目录
git clone https://github.com/username/repository.git my-project

# 使用 SSH 克隆
git clone git@github.com:username/repository.git
```

### 查看仓库状态

```bash
# 查看当前仓库状态
git status
```

初始化后的空仓库会显示：

```
On branch main

No commits yet

nothing to commit (create/copy files and use "git add" to track)
```

## 理解 .git 目录

`.git` 目录是 Git 的核心，包含了所有版本历史：

```bash
# 查看 .git 目录结构（macOS/Linux）
ls -la .git

# Windows
dir .git /a
```

主要内容：

```
.git/
├── HEAD              # 指向当前分支
├── config            # 仓库配置
├── description       # 仓库描述
├── hooks/            # Git 钩子脚本
├── info/             # 全局排除文件
├── objects/          # 所有数据对象
└── refs/             # 分支和标签引用
    ├── heads/        # 本地分支
    └── tags/         # 标签
```

{{< hint warning >}}
**警告**：不要手动修改 `.git` 目录中的文件，除非你完全理解其影响。
{{< /hint >}}

## 创建第一个文件

让我们创建一些文件并进行版本控制：

### 1. 创建 README 文件

```bash
# 创建 README.md 文件
echo "# My First Project" > README.md

# 查看文件内容
cat README.md
```

### 2. 查看状态

```bash
git status
```

你会看到：

```
On branch main

No commits yet

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	README.md

nothing added to commit but untracked files present (use "git add" to track)
```

**Untracked files** 表示 Git 发现了新文件，但还没有开始跟踪它。

### 3. 添加文件到暂存区

```bash
# 添加单个文件
git add README.md

# 或者添加所有文件
git add .

# 查看状态
git status
```

现在显示：

```
On branch main

No commits yet

Changes to be committed:
  (use "git rm --cached <file>..." to unstage)
	new file:   README.md
```

文件现在在**暂存区**（Staging Area），准备提交。

### 4. 创建第一个提交

```bash
git commit -m "Initial commit: Add README"
```

输出：

```
[main (root-commit) a1b2c3d] Initial commit: Add README
 1 file changed, 1 insertion(+)
 create mode 100644 README.md
```

{{< hint success >}}
**恭喜！** 你创建了第一个 Git 提交！`a1b2c3d` 是提交的唯一标识符（实际会更长）。
{{< /hint >}}

## Git 工作流程详解

理解 Git 的三个工作区域非常重要：

```
工作区 (Working Directory)
    ↓  git add
暂存区 (Staging Area / Index)
    ↓  git commit
仓库 (Repository)
```

### 详细流程图

```
┌─────────────────┐
│   工作区         │  ← 你编辑文件的地方
│   README.md     │
└────────┬────────┘
         │ git add
         ↓
┌─────────────────┐
│   暂存区         │  ← 准备提交的文件
│   README.md     │
└────────┬────────┘
         │ git commit
         ↓
┌─────────────────┐
│   仓库          │  ← 永久保存的历史
│   提交历史      │
└─────────────────┘
```

## 实战练习：创建一个网页项目

让我们创建一个简单的网页项目：

### 1. 初始化项目

```bash
# 创建项目目录
mkdir my-website
cd my-website

# 初始化 Git 仓库
git init
```

### 2. 创建项目文件

```bash
# 创建 HTML 文件
cat > index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>My First Website</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Hello, Git!</h1>
    <p>This is my first Git project.</p>
</body>
</html>
EOF

# 创建 CSS 文件
cat > style.css << 'EOF'
body {
    font-family: Arial, sans-serif;
    max-width: 800px;
    margin: 50px auto;
    padding: 20px;
    background-color: #f5f5f5;
}

h1 {
    color: #333;
}
EOF
```

### 3. 查看状态并添加文件

```bash
# 查看状态
git status

# 添加所有文件
git add .

# 再次查看状态
git status
```

### 4. 创建提交

```bash
git commit -m "feat: Add initial HTML and CSS files"
```

### 5. 修改文件

在 `index.html` 中添加更多内容：

```bash
cat >> index.html << 'EOF'
    <script src="script.js"></script>
EOF
```

创建 JavaScript 文件：

```bash
cat > script.js << 'EOF'
console.log('Hello from JavaScript!');
EOF
```

### 6. 查看修改

```bash
# 查看工作区状态
git status

# 查看具体修改内容
git diff
```

### 7. 提交新更改

```bash
# 添加并提交
git add .
git commit -m "feat: Add JavaScript functionality"
```

### 8. 查看提交历史

```bash
# 查看详细历史
git log

# 查看简洁历史
git log --oneline

# 查看图形化历史
git log --oneline --graph --all
```

输出示例：

```
b2c3d4e feat: Add JavaScript functionality
a1b2c3d feat: Add initial HTML and CSS files
```

## 常用命令速查

### 查看信息

```bash
# 查看状态
git status

# 查看简短状态
git status -s

# 查看提交历史
git log

# 查看最近 3 次提交
git log -3

# 查看某个文件的历史
git log -- index.html

# 查看谁修改了哪一行
git blame index.html
```

### 添加文件

```bash
# 添加单个文件
git add filename.txt

# 添加多个文件
git add file1.txt file2.txt

# 添加所有修改的文件
git add .

# 添加所有 .js 文件
git add *.js

# 交互式添加
git add -i
```

### 提交更改

```bash
# 提交暂存的文件
git commit -m "Commit message"

# 添加并提交（跳过 git add）
git commit -am "Commit message"

# 修改最后一次提交
git commit --amend

# 详细提交信息（打开编辑器）
git commit
```

## .gitignore 文件

某些文件不应该被 Git 跟踪（如日志、临时文件、密钥等）：

### 创建 .gitignore

```bash
cat > .gitignore << 'EOF'
# 操作系统文件
.DS_Store
Thumbs.db

# 编辑器文件
.vscode/
.idea/
*.swp

# 日志文件
*.log
logs/

# 依赖目录
node_modules/
vendor/

# 构建输出
dist/
build/
*.min.js
*.min.css

# 环境变量
.env
.env.local

# 数据库
*.sqlite
*.db
EOF
```

### 提交 .gitignore

```bash
git add .gitignore
git commit -m "chore: Add .gitignore file"
```

{{< hint info >}}
**提示**：GitHub 提供了各种语言和框架的 .gitignore 模板：
https://github.com/github/gitignore
{{< /hint >}}

## 检查仓库健康状态

### 验证仓库完整性

```bash
# 检查仓库完整性
git fsck

# 查看仓库大小
du -sh .git
```

### 清理仓库

```bash
# 清理不必要的文件
git gc

# 压缩仓库
git gc --aggressive
```

## 实用技巧

### 1. 查看配置

```bash
# 查看所有配置
git config --list

# 查看仓库级配置
git config --local --list

# 查看全局配置
git config --global --list
```

### 2. 设置仓库级配置

```bash
# 为这个项目设置不同的邮箱
git config user.email "work@company.com"

# 查看当前配置
git config user.email
```

### 3. 创建别名

```bash
# 在当前仓库创建别名
git config alias.st status
git config alias.co checkout
git config alias.br branch
git config alias.ci commit

# 使用别名
git st    # 等同于 git status
git ci -m "message"  # 等同于 git commit -m "message"
```

### 4. 查看差异

```bash
# 查看工作区和暂存区的差异
git diff

# 查看暂存区和仓库的差异
git diff --staged

# 查看两次提交之间的差异
git diff a1b2c3d b2c3d4e
```

## 常见场景

### 场景 1：撤销工作区的修改

```bash
# 撤销对文件的修改（危险操作！）
git checkout -- filename.txt

# 或使用新命令
git restore filename.txt
```

### 场景 2：取消暂存

```bash
# 将文件从暂存区移除，保留工作区修改
git reset HEAD filename.txt

# 或使用新命令
git restore --staged filename.txt
```

### 场景 3：查看某次提交的内容

```bash
# 查看特定提交
git show a1b2c3d

# 查看某次提交的某个文件
git show a1b2c3d:index.html
```

### 场景 4：对比文件版本

```bash
# 查看文件在不同提交间的差异
git diff a1b2c3d:index.html b2c3d4e:index.html

# 查看当前版本和历史版本的差异
git diff a1b2c3d index.html
```

## 下一步

现在你已经掌握了 Git 仓库的基本操作，接下来学习完整的工作流程！

下一节：[基本工作流程](../basic-workflow/) →

---

## 💡 练习题

{{< expand "练习 1：创建项目" >}}
**任务**：创建一个名为 `git-practice` 的新项目，包含以下文件：
- `README.md` - 项目说明
- `hello.py` - Python 脚本（打印 "Hello, Git!"）
- `.gitignore` - 忽略 `*.pyc` 文件

要求：
1. 初始化 Git 仓库
2. 创建所有文件
3. 分别提交每个文件
4. 查看提交历史

{{< expand "查看答案" >}}
```bash
# 1. 创建并初始化项目
mkdir git-practice
cd git-practice
git init

# 2. 创建 README.md
echo "# Git Practice Project" > README.md
git add README.md
git commit -m "docs: Add README"

# 3. 创建 Python 脚本
echo 'print("Hello, Git!")' > hello.py
git add hello.py
git commit -m "feat: Add hello.py script"

# 4. 创建 .gitignore
echo "*.pyc" > .gitignore
git add .gitignore
git commit -m "chore: Add .gitignore"

# 5. 查看历史
git log --oneline
```
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 2：理解工作区" >}}
**问题**：以下哪个命令可以查看工作区和暂存区的差异？

A. `git diff --staged`
B. `git diff`
C. `git diff HEAD`
D. `git status`

{{< expand "查看答案" >}}
**答案**：B

**解析**：
- `git diff` - 查看工作区和暂存区的差异 ✅
- `git diff --staged` - 查看暂存区和仓库的差异
- `git diff HEAD` - 查看工作区和最新提交的差异
- `git status` - 查看文件状态，但不显示具体差异
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 3：实战场景" >}}
**场景**：你创建了一个文件 `secret.txt` 包含敏感信息，不小心执行了 `git add .`。你应该怎么做才能避免将它提交到仓库？

A. `git rm secret.txt`
B. `git reset HEAD secret.txt`
C. `git commit -m "Remove secret"`
D. `rm secret.txt`

{{< expand "查看答案" >}}
**答案**：B

**解析**：
- `git reset HEAD secret.txt` - 将文件从暂存区移除，但保留在工作区 ✅
- 然后应该将 `secret.txt` 添加到 `.gitignore` 中
- `git rm secret.txt` - 会从工作区删除文件
- `rm secret.txt` - 只删除文件，不影响暂存区

**完整操作**：
```bash
# 1. 从暂存区移除
git reset HEAD secret.txt

# 2. 添加到 .gitignore
echo "secret.txt" >> .gitignore

# 3. 提交 .gitignore
git add .gitignore
git commit -m "chore: Ignore secret files"
```
{{< /expand >}}
{{< /expand >}}

---

## ✅ 检查清单

完成本节后，确保你能够：

- [ ] 使用 `git init` 创建新仓库
- [ ] 使用 `git clone` 克隆现有仓库
- [ ] 理解工作区、暂存区、仓库的关系
- [ ] 使用 `git add` 添加文件到暂存区
- [ ] 使用 `git commit` 创建提交
- [ ] 使用 `git status` 查看状态
- [ ] 使用 `git log` 查看历史
- [ ] 创建和使用 `.gitignore` 文件
- [ ] 使用 `git diff` 查看差异

{{< hint success >}}
**做得很好！** 你已经掌握了 Git 仓库的基本操作。继续学习基本工作流程！
{{< /hint >}}
