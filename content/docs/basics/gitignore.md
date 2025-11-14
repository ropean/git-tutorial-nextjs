---
title: "忽略文件"
weight: 6
bookToc: true
---

# 忽略文件

本章将学习如何使用 `.gitignore` 文件来忽略不需要版本控制的文件。这是保持仓库整洁的重要手段。

## 为什么需要忽略文件？

在项目中，有些文件不应该被 Git 跟踪：

- 🗑️ **编译产物** - `*.class`、`*.o`、`dist/`、`build/`
- 📦 **依赖包** - `node_modules/`、`vendor/`、`__pycache__/`
- 🔑 **敏感信息** - `.env`、`credentials.json`、`secrets.yaml`
- 💻 **编辑器配置** - `.vscode/`、`.idea/`、`*.swp`
- 📊 **日志文件** - `*.log`、`logs/`
- 🍎 **系统文件** - `.DS_Store`、`Thumbs.db`、`desktop.ini`

如果不忽略这些文件：
- ❌ 仓库会变得臃肿
- ❌ 可能泄露敏感信息
- ❌ 团队协作时产生不必要的冲突
- ❌ 污染提交历史

## .gitignore 基础

### 创建 .gitignore 文件

`.gitignore` 是一个文本文件，通常放在仓库根目录：

```bash
# 创建 .gitignore 文件
touch .gitignore

# 编辑文件
vim .gitignore

# 或使用 echo 快速添加
echo "node_modules/" >> .gitignore
echo "*.log" >> .gitignore
```

### 基本语法

```gitignore
# 这是注释

# 忽略所有 .log 文件
*.log

# 忽略所有 .tmp 文件
*.tmp

# 忽略 node_modules 目录
node_modules/

# 忽略 build 目录及其所有内容
build/

# 忽略 config 目录下的所有 .json 文件
config/*.json

# 忽略所有 .env 文件
.env
.env.local
.env.*.local
```

### 匹配规则

#### 通配符

```gitignore
# * 匹配任意字符（不包括 /）
*.txt           # 忽略所有 .txt 文件
temp*           # 忽略 temp 开头的文件

# ** 匹配任意路径
**/logs         # 忽略所有目录下的 logs 目录
**/build/**     # 忽略所有 build 目录及其内容

# ? 匹配单个字符
file?.txt       # 匹配 file1.txt, file2.txt 等

# [] 匹配范围内的字符
file[0-9].txt   # 匹配 file0.txt 到 file9.txt
file[abc].txt   # 匹配 filea.txt, fileb.txt, filec.txt
```

#### 目录匹配

```gitignore
# 忽略目录（以 / 结尾）
logs/           # 忽略 logs 目录及其所有内容

# 忽略所有名为 temp 的目录
**/temp/        # 任何路径下的 temp 目录
```

#### 路径匹配

```gitignore
# / 开头表示仓库根目录
/TODO.txt       # 只忽略根目录的 TODO.txt
/build/         # 只忽略根目录的 build 目录

# 不以 / 开头，匹配所有路径
TODO.txt        # 忽略所有目录下的 TODO.txt
build/          # 忽略所有 build 目录

# 指定路径
src/temp/       # 只忽略 src 下的 temp 目录
docs/*.pdf      # 只忽略 docs 下的 PDF 文件
```

#### 取反规则（!）

```gitignore
# 忽略所有 .log 文件
*.log

# 但不忽略 important.log
!important.log

# 忽略 build 目录
build/

# 但不忽略 build/README.md
!build/README.md
```

{{< hint warning >}}
**注意**：如果父目录被忽略，无法通过 `!` 重新包含其子文件。
```gitignore
# ❌ 这样不起作用
logs/           # 忽略整个 logs 目录
!logs/keep.log  # 无法重新包含，因为父目录已被忽略

# ✅ 应该这样写
logs/*          # 忽略 logs 目录下的所有文件
!logs/keep.log  # 但保留 keep.log
```
{{< /hint >}}

## 实战示例

### 示例 1：Node.js 项目

```gitignore
# 依赖
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# 环境变量
.env
.env.local
.env.*.local

# 构建输出
dist/
build/
.cache/

# 编辑器
.vscode/
.idea/
*.sublime-project
*.sublime-workspace

# 操作系统
.DS_Store
Thumbs.db

# 测试覆盖率
coverage/
.nyc_output/

# 日志
logs/
*.log
```

### 示例 2：Python 项目

```gitignore
# Byte-compiled / optimized / DLL files
__pycache__/
*.py[cod]
*$py.class

# 虚拟环境
venv/
env/
ENV/
.venv

# 分发 / 打包
build/
dist/
*.egg-info/
.eggs/

# PyCharm
.idea/

# Jupyter Notebook
.ipynb_checkpoints/

# 环境变量
.env
.env.local

# 数据库
*.db
*.sqlite
*.sqlite3

# 测试
.pytest_cache/
.coverage
htmlcov/
```

### 示例 3：Java 项目

```gitignore
# 编译文件
*.class
*.jar
*.war
*.ear

# 构建目录
target/
build/
out/

# IDE
.idea/
*.iml
.eclipse/
.classpath
.project
.settings/

# 日志
*.log

# 操作系统
.DS_Store
Thumbs.db

# Maven
.mvn/
mvnw
mvnw.cmd
```

### 示例 4：Web 前端项目

```gitignore
# 依赖
node_modules/

# 构建输出
dist/
build/
.next/
out/

# 环境变量
.env
.env.local
.env.production.local

# 缓存
.cache/
.parcel-cache/
.nuxt/

# 测试
coverage/

# 编辑器
.vscode/
.idea/

# 操作系统
.DS_Store
Thumbs.db

# 日志
npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

## .gitignore 放置位置

### 仓库根目录（推荐）

```bash
my-project/
├── .gitignore      # 主 .gitignore 文件
├── src/
├── docs/
└── tests/
```

这是最常见的做法，适用于大多数项目。

### 子目录中的 .gitignore

每个子目录都可以有自己的 `.gitignore`：

```bash
my-project/
├── .gitignore          # 全局规则
├── src/
│   └── .gitignore      # src 专用规则
└── docs/
    └── .gitignore      # docs 专用规则
```

**示例**：

```bash
# 根目录 .gitignore
*.log
node_modules/

# docs/.gitignore（只影响 docs 目录）
*.pdf
!important.pdf
```

## 全局 .gitignore

全局 `.gitignore` 对所有 Git 仓库生效，适合放置个人偏好的忽略规则。

### 配置全局 .gitignore

```bash
# 1. 创建全局 .gitignore 文件
touch ~/.gitignore_global

# 2. 添加常用规则
cat >> ~/.gitignore_global << 'EOF'
# 操作系统
.DS_Store
Thumbs.db
desktop.ini

# 编辑器
.vscode/
.idea/
*.swp
*.swo
*~

# 临时文件
*.tmp
*.bak
.~*
EOF

# 3. 配置 Git 使用全局 .gitignore
git config --global core.excludesfile ~/.gitignore_global
```

### 全局 vs 本地

| 类型 | 位置 | 作用范围 | 适用场景 |
|------|------|----------|----------|
| **本地** | `.gitignore` | 单个仓库 | 项目特定的忽略规则 |
| **全局** | `~/.gitignore_global` | 所有仓库 | 个人偏好（编辑器、系统文件） |

## 忽略已跟踪的文件

如果文件已经被 Git 跟踪，添加到 `.gitignore` 不会自动停止跟踪。

### 停止跟踪但保留文件

```bash
# 从 Git 中移除，但保留在本地文件系统
git rm --cached <file>

# 移除目录
git rm --cached -r <directory>

# 示例：停止跟踪 .env 文件
git rm --cached .env
echo ".env" >> .gitignore
git commit -m "停止跟踪 .env 文件"
```

### 实战场景

```bash
# 场景：不小心提交了 node_modules
# 1. 添加到 .gitignore
echo "node_modules/" >> .gitignore

# 2. 从 Git 中移除（但保留在本地）
git rm -r --cached node_modules/

# 3. 提交
git add .gitignore
git commit -m "停止跟踪 node_modules"

# 4. 推送
git push

# 现在 node_modules 不再被跟踪，但本地仍然存在
```

{{< hint info >}}
**注意**：其他克隆仓库的人执行 `git pull` 后，他们本地的 `node_modules` 目录会被删除。所以要确保在 README 中说明需要运行 `npm install`。
{{< /hint >}}

### 只忽略本地修改

有时你想修改配置文件，但不想提交这些修改：

```bash
# 忽略对特定文件的修改
git update-index --assume-unchanged <file>

# 恢复跟踪
git update-index --no-assume-unchanged <file>

# 示例
git update-index --assume-unchanged config/database.yml
```

{{< hint warning >}}
**注意**：这只是本地设置，不会影响其他人。不要用来隐藏应该提交的更改。
{{< /hint >}}

## 常用模板

### 通用模板（适合所有项目）

```gitignore
# 操作系统
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db
desktop.ini

# 编辑器
.vscode/
.idea/
*.sublime-project
*.sublime-workspace
*.swp
*.swo
*~

# 临时文件
*.tmp
*.bak
*.log
.~*

# 压缩文件（可选）
# *.zip
# *.tar
# *.tar.gz
```

### 获取模板的方法

#### 1. GitHub 官方模板

访问 [github/gitignore](https://github.com/github/gitignore)，找到你需要的模板：

```bash
# 使用 curl 下载
curl -o .gitignore https://raw.githubusercontent.com/github/gitignore/main/Node.gitignore

# 使用 wget 下载
wget -O .gitignore https://raw.githubusercontent.com/github/gitignore/main/Python.gitignore
```

#### 2. gitignore.io

访问 [gitignore.io](https://www.toptal.com/developers/gitignore) 生成自定义模板：

```bash
# 使用命令行生成
curl -L https://www.toptal.com/developers/gitignore/api/node,visualstudiocode,macos > .gitignore

# 组合多个模板
curl -L https://www.toptal.com/developers/gitignore/api/python,django,pycharm,linux > .gitignore
```

#### 3. 使用 Git 命令

```bash
# 创建函数（添加到 .bashrc 或 .zshrc）
function gi() {
  curl -sL https://www.toptal.com/developers/gitignore/api/$@ >> .gitignore
}

# 使用
gi node,react,vscode
```

## 检查 .gitignore 规则

### 查看文件是否被忽略

```bash
# 检查单个文件
git check-ignore -v <file>

# 示例
git check-ignore -v node_modules/package.json
# .gitignore:3:node_modules/    node_modules/package.json

# 检查多个文件
git check-ignore -v file1.txt file2.txt file3.txt

# 检查所有未跟踪的文件
git status --ignored
```

### 调试 .gitignore

```bash
# 显示哪条规则导致文件被忽略
git check-ignore -v <file>

# 示例输出：
# .gitignore:12:*.log    debug.log
# 表示 .gitignore 第 12 行的 *.log 规则匹配了 debug.log
```

### 查看所有被忽略的文件

```bash
# 查看被忽略的文件
git status --ignored

# 只列出文件名
git status --ignored --short

# 列出所有文件（包括未跟踪和忽略的）
git ls-files --others --ignored --exclude-standard
```

## 常见问题

### 问题 1：.gitignore 不生效

**原因**：文件已经被跟踪了。

**解决方案**：

```bash
# 1. 从 Git 中移除
git rm -r --cached .

# 2. 重新添加（.gitignore 现在会生效）
git add .

# 3. 提交
git commit -m "应用 .gitignore 规则"
```

### 问题 2：如何忽略空目录

Git 不跟踪空目录，但可以用这个技巧：

```bash
# 在目录中创建 .gitkeep 文件
mkdir logs
touch logs/.gitkeep

# .gitignore 中忽略目录内容但保留 .gitkeep
logs/*
!logs/.gitkeep
```

### 问题 3：如何临时查看被忽略的文件

```bash
# 添加被忽略的文件（使用 -f 强制）
git add -f ignored-file.txt

# 查看被忽略的文件
git ls-files --others --ignored --exclude-standard
```

### 问题 4：团队成员的 .gitignore 不同步

**解决方案**：

```bash
# 确保 .gitignore 本身被跟踪
git add .gitignore
git commit -m "更新 .gitignore"
git push

# 团队成员拉取
git pull

# 清理旧的跟踪文件
git rm -r --cached .
git add .
git commit -m "应用新的 .gitignore 规则"
```

## 最佳实践

### 1. 尽早创建 .gitignore

```bash
# 初始化项目时立即创建
git init
curl -L https://www.toptal.com/developers/gitignore/api/node > .gitignore
git add .gitignore
git commit -m "Initial commit with .gitignore"
```

### 2. 按类别组织规则

```gitignore
# ====================
# 依赖
# ====================
node_modules/
vendor/

# ====================
# 构建输出
# ====================
dist/
build/
out/

# ====================
# 环境变量
# ====================
.env
.env.local
.env.*.local

# ====================
# 编辑器
# ====================
.vscode/
.idea/

# ====================
# 操作系统
# ====================
.DS_Store
Thumbs.db

# ====================
# 日志
# ====================
*.log
logs/
```

### 3. 使用注释

```gitignore
# Node.js
node_modules/       # 依赖包，通过 npm install 安装
npm-debug.log*      # npm 调试日志

# 构建输出
dist/               # 生产构建输出
build/              # 开发构建输出

# 环境变量（包含敏感信息）
.env                # 本地环境变量
.env.local          # 本地覆盖
```

### 4. 不要忽略 .gitignore

```bash
# ❌ 不要这样做
echo ".gitignore" >> .gitignore

# .gitignore 应该被提交到仓库
git add .gitignore
git commit -m "Add .gitignore"
```

### 5. 敏感信息处理

```gitignore
# 始终忽略敏感文件
.env
.env.local
config/secrets.yml
credentials.json
*.key
*.pem

# 提供示例文件
# .env.example
# config/secrets.yml.example
```

提供示例文件：

```bash
# .env.example
DATABASE_URL=postgres://localhost:5432/myapp
API_KEY=your_api_key_here
SECRET_KEY=your_secret_key_here
```

## 命令速查

| 命令 | 说明 |
|------|------|
| `echo "file" >> .gitignore` | 添加规则 |
| `git rm --cached <file>` | 停止跟踪文件 |
| `git check-ignore -v <file>` | 检查文件是否被忽略 |
| `git status --ignored` | 查看被忽略的文件 |
| `git add -f <file>` | 强制添加被忽略的文件 |
| `git config core.excludesfile` | 配置全局 .gitignore |

## .gitignore 语法速查

| 模式 | 示例 | 说明 |
|------|------|------|
| `*` | `*.log` | 匹配任意字符 |
| `**` | `**/logs` | 匹配任意路径 |
| `?` | `file?.txt` | 匹配单个字符 |
| `[]` | `[0-9]` | 匹配范围 |
| `/` | `/TODO` | 仓库根目录 |
| `/` | `logs/` | 目录 |
| `!` | `!keep.log` | 取反 |
| `#` | `# comment` | 注释 |

## 总结

`.gitignore` 是保持仓库整洁的重要工具：

- ✅ 尽早创建 `.gitignore`
- ✅ 使用官方模板作为起点
- ✅ 按类别组织规则
- ✅ 添加注释说明
- ✅ 忽略敏感信息
- ✅ 提供示例配置文件
- ✅ 定期审查和更新规则

---

## 💡 练习题

{{< expand "练习 1：创建基本的 .gitignore" >}}
**任务**：
1. 创建一个新的 Git 仓库
2. 创建 `.gitignore` 文件
3. 添加规则忽略所有 `.log` 文件和 `temp/` 目录
4. 创建测试文件验证规则

{{< expand "查看答案" >}}
```bash
# 1. 创建仓库
mkdir gitignore-practice
cd gitignore-practice
git init -b main

# 2. 创建 .gitignore
cat > .gitignore << 'EOF'
# 忽略日志文件
*.log

# 忽略临时目录
temp/
EOF

# 3. 创建测试文件
echo "test" > test.log
mkdir temp
echo "temp" > temp/file.txt
echo "keep" > keep.txt

# 4. 查看状态
git status
# Untracked files:
#   .gitignore
#   keep.txt
# 注意：test.log 和 temp/ 被忽略了

# 5. 验证
git check-ignore -v test.log
# .gitignore:2:*.log    test.log

git check-ignore -v temp/file.txt
# .gitignore:5:temp/    temp/file.txt
```
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 2：停止跟踪已提交的文件" >}}
**场景**：你不小心提交了 `config.local.json`，现在要停止跟踪它。

{{< expand "查看答案" >}}
```bash
# 模拟场景
git init -b main
echo '{"secret": "password"}' > config.local.json
git add config.local.json
git commit -m "误提交配置文件"

# 解决方案
# 1. 添加到 .gitignore
echo "config.local.json" >> .gitignore

# 2. 从 Git 中移除（但保留本地文件）
git rm --cached config.local.json

# 3. 提交更改
git add .gitignore
git commit -m "停止跟踪 config.local.json"

# 4. 验证
git status
# nothing to commit
ls config.local.json
# config.local.json（文件还在）

# 5. 提供示例文件
echo '{"secret": "your_secret_here"}' > config.local.json.example
git add config.local.json.example
git commit -m "添加配置示例文件"
```
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 3：高级匹配规则" >}}
**任务**：创建 .gitignore 实现以下需求：
1. 忽略所有 `.log` 文件，但保留 `important.log`
2. 忽略 `build` 目录，但保留 `build/README.md`
3. 只忽略根目录的 `temp.txt`，不忽略子目录的

{{< expand "查看答案" >}}
```bash
# 创建 .gitignore
cat > .gitignore << 'EOF'
# 1. 忽略所有 .log，但保留 important.log
*.log
!important.log

# 2. 忽略 build 目录，但保留 README.md
build/*
!build/README.md

# 3. 只忽略根目录的 temp.txt
/temp.txt
EOF

# 验证
# 创建测试文件
echo "log" > debug.log
echo "keep" > important.log
mkdir build
echo "build" > build/output.js
echo "readme" > build/README.md
echo "root" > temp.txt
mkdir sub
echo "sub" > sub/temp.txt

# 查看状态
git add -A --dry-run
# 应该添加：
# - .gitignore
# - important.log
# - build/README.md
# - sub/temp.txt

# 不应该添加：
# - debug.log (被 *.log 忽略)
# - build/output.js (被 build/* 忽略)
# - temp.txt (被 /temp.txt 忽略)
```

**关键点**：
- `!` 用于取反，重新包含文件
- `/*` 匹配目录下所有文件，但允许 `!` 重新包含
- `/file` 只匹配根目录的文件
{{< /expand >}}
{{< /expand >}}

---

{{< hint success >}}
**检查清单** - 完成本节后，你应该能够：

- [ ] 理解为什么需要 .gitignore
- [ ] 掌握 .gitignore 的基本语法
- [ ] 使用通配符和路径匹配
- [ ] 使用取反规则 (!)
- [ ] 停止跟踪已提交的文件
- [ ] 配置全局 .gitignore
- [ ] 使用模板快速创建 .gitignore
- [ ] 调试和检查 .gitignore 规则
- [ ] 处理常见的 .gitignore 问题
{{< /hint >}}

{{< hint info >}}
**恭喜！** 你已经完成了「基础操作」章节的所有内容。现在你已经掌握了 Git 的核心功能：
- ✅ 创建和克隆仓库
- ✅ 添加和提交文件
- ✅ 查看状态和历史
- ✅ 比较差异
- ✅ 撤销更改
- ✅ 忽略文件

继续学习下一章节，深入了解 Git 的分支和协作功能！
{{< /hint >}}
