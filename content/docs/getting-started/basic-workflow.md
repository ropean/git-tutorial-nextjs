---
title: "基本工作流程"
weight: 4
bookToc: true
---

# Git 基本工作流程

掌握日常使用 Git 的标准工作流程，这是你每天都会用到的操作。

## 标准工作流程

一个典型的 Git 工作日是这样的：

```
1. 检查状态   →  2. 拉取更新   →  3. 修改代码
        ↑                                  ↓
    8. 推送  ←  7. 提交  ←  6. 暂存  ←  5. 查看差异
```

### 完整流程示例

```bash
# 1. 进入项目目录
cd my-project

# 2. 查看当前状态
git status

# 3. 拉取最新代码（如果是团队项目）
git pull

# 4. 创建或切换到工作分支
git checkout -b feature/new-feature

# 5. 修改代码
vim app.js

# 6. 查看修改
git status
git diff

# 7. 添加到暂存区
git add app.js

# 8. 提交更改
git commit -m "feat: Add user authentication"

# 9. 推送到远程（如果需要）
git push origin feature/new-feature
```

## 详细步骤讲解

### 步骤 1：检查当前状态

开始工作前，先了解仓库的当前状态：

```bash
git status
```

你会看到以下几种状态：

#### 干净的工作区

```
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
```

这表示一切正常，没有未提交的更改。

#### 有未跟踪的文件

```
Untracked files:
  (use "git add <file>..." to include in what will be committed)
	newfile.txt
```

#### 有修改但未暂存

```
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
	modified:   app.js
```

#### 有已暂存的更改

```
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
	modified:   app.js
```

### 步骤 2：修改文件

使用你喜欢的编辑器修改文件：

```bash
# 使用 VS Code
code app.js

# 使用 Vim
vim app.js

# 使用 Nano
nano app.js
```

### 步骤 3：查看修改内容

在提交前，先查看具体改了什么：

```bash
# 查看工作区的修改
git diff

# 查看简短摘要
git diff --stat

# 查看某个文件的修改
git diff app.js
```

**示例输出**：

```diff
diff --git a/app.js b/app.js
index 1234567..abcdefg 100644
--- a/app.js
+++ b/app.js
@@ -1,3 +1,6 @@
 function hello() {
-    console.log("Hello");
+    console.log("Hello, World!");
 }
+
+function goodbye() {
+    console.log("Goodbye!");
+}
```

**解读**：
- `-` 红色：删除的行
- `+` 绿色：添加的行
- `@@` 表示变更位置

### 步骤 4：暂存更改

将满意的修改添加到暂存区：

```bash
# 添加单个文件
git add app.js

# 添加多个文件
git add app.js style.css

# 添加所有修改
git add .

# 添加所有 .js 文件
git add *.js

# 交互式添加（选择性暂存）
git add -p
```

#### 交互式暂存 (git add -p)

逐块查看并选择是否暂存：

```bash
git add -p app.js
```

Git 会显示每个修改块并询问：

```
Stage this hunk [y,n,q,a,d,s,e,?]?
```

选项说明：
- `y` - 暂存这个块
- `n` - 不暂存
- `q` - 退出
- `a` - 暂存这个文件的所有块
- `d` - 不暂存这个文件的所有块
- `s` - 分割成更小的块
- `e` - 手动编辑
- `?` - 帮助

### 步骤 5：查看暂存区

查看哪些文件已暂存：

```bash
# 查看状态
git status

# 查看暂存区的差异
git diff --staged
# 或
git diff --cached
```

### 步骤 6：创建提交

将暂存区的内容提交到仓库：

```bash
# 基本提交
git commit -m "提交信息"

# 详细提交信息（打开编辑器）
git commit

# 添加并提交（跳过 git add）
git commit -am "提交信息"
```

#### 编写优秀的提交信息

**基本格式**：

```
类型: 简短描述（50字以内）

详细说明（可选，72字换行）

- 修改原因
- 影响范围
- 注意事项

关联 Issue: #123
```

**常用类型**：

| 类型 | 说明 | 示例 |
|------|------|------|
| feat | 新功能 | `feat: Add user login` |
| fix | 修复 bug | `fix: Fix null pointer error` |
| docs | 文档 | `docs: Update README` |
| style | 格式 | `style: Format code` |
| refactor | 重构 | `refactor: Simplify auth logic` |
| test | 测试 | `test: Add unit tests` |
| chore | 杂项 | `chore: Update dependencies` |

**好的例子**：

```bash
git commit -m "feat: Add password reset functionality

- Add reset password form
- Send reset email
- Implement token verification

Closes #234"
```

**不好的例子**：

```bash
git commit -m "update"
git commit -m "fix bug"
git commit -m "修改了一些东西"
```

### 步骤 7：查看提交历史

```bash
# 查看详细历史
git log

# 单行显示
git log --oneline

# 图形化显示
git log --oneline --graph --all

# 最近 5 次提交
git log -5

# 查看每次提交的文件变化
git log --stat

# 查看每次提交的详细差异
git log -p

# 美化输出
git log --pretty=format:"%h - %an, %ar : %s"
```

**自定义格式说明**：

| 占位符 | 含义 |
|--------|------|
| %H | 完整的提交哈希 |
| %h | 简短的提交哈希 |
| %an | 作者名字 |
| %ae | 作者邮箱 |
| %ad | 作者日期 |
| %ar | 相对日期 |
| %s | 提交信息 |
| %b | 提交正文 |

## 常见工作流程场景

### 场景 1：修复 Bug

```bash
# 1. 检查状态
git status

# 2. 创建 bug 修复分支
git checkout -b fix/login-error

# 3. 修改代码
vim auth.js

# 4. 测试修复
npm test

# 5. 查看修改
git diff

# 6. 暂存并提交
git add auth.js
git commit -m "fix: Resolve login authentication error

- Fix null check in validateUser function
- Add error handling for invalid tokens
- Update unit tests

Fixes #456"

# 7. 推送到远程
git push origin fix/login-error
```

### 场景 2：开发新功能

```bash
# 1. 确保在最新代码上工作
git checkout main
git pull

# 2. 创建功能分支
git checkout -b feature/user-profile

# 3. 开发功能（可能需要多次提交）
# 第一次提交
vim profile.js
git add profile.js
git commit -m "feat: Add user profile structure"

# 第二次提交
vim profile.css
git add profile.css
git commit -m "style: Add profile page styles"

# 第三次提交
vim profile.test.js
git add profile.test.js
git commit -m "test: Add profile page tests"

# 4. 推送功能分支
git push origin feature/user-profile
```

### 场景 3：多人协作

```bash
# 早上开始工作
git checkout main
git pull                          # 获取团队的最新代码

git checkout -b feature/my-work   # 创建工作分支

# 工作中...
git add .
git commit -m "feat: Add initial implementation"

# 午休前
git push origin feature/my-work   # 备份到远程

# 下午继续...
git pull origin feature/my-work   # 拉取可能的更新

# 完成后
git push origin feature/my-work   # 最终推送
# 在 GitHub/GitLab 上创建 Pull Request
```

### 场景 4：临时切换任务

使用 `git stash` 临时保存工作：

```bash
# 正在开发功能 A
vim featureA.js
# 突然需要修复紧急 bug

# 1. 保存当前工作
git stash save "WIP: Feature A implementation"

# 2. 切换到主分支修复 bug
git checkout main
git checkout -b fix/urgent-bug
# 修复 bug...
git add .
git commit -m "fix: Critical bug"
git push origin fix/urgent-bug

# 3. 回到功能 A
git checkout feature/feature-a
git stash pop                     # 恢复之前的工作

# 4. 继续开发
vim featureA.js
```

## 撤销和修改

### 撤销工作区的更改

```bash
# 撤销单个文件的修改（危险！会丢失修改）
git checkout -- filename.txt

# 新命令（推荐）
git restore filename.txt

# 撤销所有修改
git restore .
```

### 取消暂存

```bash
# 取消暂存单个文件
git reset HEAD filename.txt

# 新命令（推荐）
git restore --staged filename.txt

# 取消所有暂存
git restore --staged .
```

### 修改最后一次提交

```bash
# 修改提交信息
git commit --amend -m "新的提交信息"

# 添加遗漏的文件到上一次提交
git add forgotten_file.txt
git commit --amend --no-edit
```

{{< hint warning >}}
**注意**：只在还没推送到远程时使用 `--amend`，否则会导致历史不一致。
{{< /hint >}}

### 撤销提交

```bash
# 撤销最后一次提交，保留更改
git reset --soft HEAD~1

# 撤销最后一次提交，保留工作区
git reset --mixed HEAD~1  # 默认

# 撤销最后一次提交，丢弃所有更改（危险！）
git reset --hard HEAD~1
```

## 最佳实践

### 1. 提交频率

✅ **建议**：
- 小步提交，频繁提交
- 每个提交只做一件事
- 确保每次提交代码可运行

❌ **避免**：
- 几天才提交一次
- 一次提交包含多个无关功能
- 提交不能运行的代码

### 2. 提交粒度

```bash
# ✅ 好的做法
git commit -m "feat: Add user registration form"
git commit -m "feat: Add form validation"
git commit -m "feat: Add email verification"

# ❌ 不好的做法
git commit -m "Add login, registration, and profile"
```

### 3. 测试后再提交

```bash
# 修改代码
vim app.js

# 运行测试
npm test

# 确认无误后再提交
git add app.js
git commit -m "feat: Add new feature"
```

### 4. 使用 .gitignore

确保不提交不必要的文件：

```bash
# 先配置 .gitignore
cat >> .gitignore << 'EOF'
node_modules/
.env
*.log
.DS_Store
EOF

# 然后再 git add
git add .
```

### 5. 定期同步

```bash
# 每天开始工作前
git pull

# 重要工作后
git push

# 长时间开发时，定期合并主分支
git checkout main
git pull
git checkout feature/my-feature
git merge main
```

## 实用命令组合

### 快速查看状态

```bash
# 简短状态
git status -s

# 查看分支和状态
git status -sb
```

输出：

```
## feature/new-feature...origin/feature/new-feature
 M app.js
?? newfile.txt
```

### 美化日志

创建别名：

```bash
git config --global alias.lg "log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"

# 使用
git lg
```

### 查看文件历史

```bash
# 查看某个文件的修改历史
git log --follow -- app.js

# 查看某个文件每次提交的差异
git log -p app.js

# 查看文件的每一行是谁修改的
git blame app.js
```

## 工作流程图

```
┌─────────────────────────────────────────────────────────┐
│                     开始新的一天                          │
└─────────────────────┬───────────────────────────────────┘
                      ↓
              ┌───────────────┐
              │  git pull     │ 获取最新代码
              └───────┬───────┘
                      ↓
              ┌───────────────┐
              │  修改代码      │ 开发功能/修复bug
              └───────┬───────┘
                      ↓
              ┌───────────────┐
              │  git diff     │ 检查修改
              └───────┬───────┘
                      ↓
              ┌───────────────┐
              │  运行测试      │ 确保代码质量
              └───────┬───────┘
                      ↓
              ┌───────────────┐
              │  git add      │ 暂存修改
              └───────┬───────┘
                      ↓
              ┌───────────────┐
              │  git commit   │ 提交更改
              └───────┬───────┘
                      ↓
              ┌───────────────┐
              │  git push     │ 推送到远程
              └───────────────┘
```

## 下一步

恭喜！你已经掌握了 Git 的基本工作流程。接下来学习更深入的基础操作。

下一章：[基础操作](../../basics/) →

---

## 💡 练习题

{{< expand "练习 1：完整工作流" >}}
**任务**：模拟一个完整的开发流程

1. 创建项目 `todo-app`
2. 初始化 Git 仓库
3. 创建 `todo.js` 文件并提交
4. 修改文件添加新功能
5. 查看并提交修改
6. 查看提交历史

{{< expand "查看答案" >}}
```bash
# 1. 创建项目
mkdir todo-app
cd todo-app
git init

# 2. 创建初始文件
cat > todo.js << 'EOF'
const todos = [];

function addTodo(task) {
    todos.push(task);
}
EOF

git add todo.js
git commit -m "feat: Add initial todo structure"

# 3. 添加新功能
cat >> todo.js << 'EOF'

function removeTodo(index) {
    todos.splice(index, 1);
}
EOF

# 4. 查看修改
git diff

# 5. 提交修改
git add todo.js
git commit -m "feat: Add removeTodo function"

# 6. 查看历史
git log --oneline
```
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 2：处理错误提交" >}}
**场景**：你不小心提交了错误的代码，需要撤销。

```bash
# 你执行了
echo "console.log('wrong code');" >> app.js
git add app.js
git commit -m "Add feature"

# 发现错误，应该怎么办？
```

{{< expand "查看答案" >}}
```bash
# 方法 1：撤销提交，保留修改
git reset --soft HEAD~1
# 修正代码
vim app.js
git add app.js
git commit -m "feat: Add correct feature"

# 方法 2：修改最后一次提交
# 修正代码
vim app.js
git add app.js
git commit --amend -m "feat: Add correct feature"

# 方法 3：创建新提交修复
git revert HEAD
# 然后提交正确的代码
```
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 3：选择题" >}}
**问题**：以下哪个命令可以查看暂存区和仓库的差异？

A. `git diff`
B. `git diff --staged`
C. `git status`
D. `git log`

{{< expand "查看答案" >}}
**答案**：B

**解析**：
- `git diff` - 查看工作区和暂存区的差异
- `git diff --staged` 或 `git diff --cached` - 查看暂存区和仓库的差异 ✅
- `git status` - 查看文件状态
- `git log` - 查看提交历史
{{< /expand >}}
{{< /expand >}}

---

## ✅ 检查清单

完成本章后，你应该能够：

- [ ] 理解并执行完整的 Git 工作流程
- [ ] 使用 `git diff` 查看不同阶段的差异
- [ ] 正确使用 `git add` 暂存文件
- [ ] 编写规范的提交信息
- [ ] 使用 `git log` 查看历史
- [ ] 知道如何撤销各种操作
- [ ] 理解何时使用 `git stash`
- [ ] 掌握常用的 Git 命令组合

{{< hint success >}}
**太棒了！** 你已经掌握了 Git 的基本工作流程，这是日常使用的核心技能！
{{< /hint >}}
