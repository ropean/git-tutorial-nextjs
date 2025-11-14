---
title: "别名配置"
weight: 5
bookToc: true
---

# 别名配置

Git 别名（Aliases）允许你为常用的 Git 命令创建简短的快捷方式，大大提高工作效率。

## 什么是 Git 别名

别名是为 Git 命令创建的自定义快捷方式。通过别名，你可以将长命令简化为短命令，或创建自定义的工作流。

### 别名的优势

- **提高效率**：减少输入，节省时间
- **简化复杂命令**：将复杂的参数组合简化为一个命令
- **个性化**：根据自己的习惯定制命令
- **减少错误**：避免重复输入复杂命令时出错

### 别名示例

```bash
# 不使用别名
git log --graph --oneline --decorate --all

# 使用别名
git lg
```

## 创建 Git 别名

### 使用 git config 命令

```bash
# 基本语法
git config --global alias.<alias-name> '<git-command>'

# 示例：创建 st 作为 status 的别名
git config --global alias.st 'status'

# 使用
git st
# 等同于 git status
```

### 配置级别

```bash
# 全局别名（所有仓库）
git config --global alias.co 'checkout'

# 仓库级别别名（仅当前仓库）
git config alias.co 'checkout'

# 系统级别别名（所有用户）
sudo git config --system alias.co 'checkout'
```

{{< hint info >}}
**推荐**：使用 `--global` 使别名在所有仓库中生效。
{{< /hint >}}

### 直接编辑配置文件

```bash
# 编辑全局配置
vim ~/.gitconfig

# 或使用 Git 命令打开
git config --global --edit
```

添加别名配置：

```ini
[alias]
    st = status
    co = checkout
    br = branch
    ci = commit
    unstage = reset HEAD --
    last = log -1 HEAD
```

## 实用别名大全

### 基础别名

```bash
# 状态查看
git config --global alias.st 'status'
git config --global alias.s 'status -s'

# 分支操作
git config --global alias.co 'checkout'
git config --global alias.br 'branch'
git config --global alias.ci 'commit'

# 添加和提交
git config --global alias.aa 'add --all'
git config --global alias.cm 'commit -m'
git config --global alias.ca 'commit --amend'

# 推送和拉取
git config --global alias.ps 'push'
git config --global alias.pl 'pull'
```

### 日志查看别名

```bash
# 简洁的图形日志
git config --global alias.lg "log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"

# 单行日志
git config --global alias.l "log --oneline"

# 详细日志
git config --global alias.ll "log --stat --abbrev-commit"

# 查看最近的提交
git config --global alias.last 'log -1 HEAD'

# 查看今天的提交
git config --global alias.today "log --since='00:00:00' --all --no-merges --oneline --author=$(git config user.email)"

# 查看文件历史
git config --global alias.filelog "log -u"

# 查看谁修改了什么
git config --global alias.who "shortlog -s --"
```

### 差异查看别名

```bash
# 查看暂存区差异
git config --global alias.staged 'diff --staged'

# 查看工作目录差异
git config --global alias.d 'diff'

# 查看差异统计
git config --global alias.ds 'diff --stat'

# 查看单词级别的差异
git config --global alias.dw 'diff --word-diff'
```

### 撤销操作别名

```bash
# 取消暂存
git config --global alias.unstage 'reset HEAD --'

# 撤销最后一次提交（保留修改）
git config --global alias.undo 'reset --soft HEAD~1'

# 撤销最后一次提交（丢弃修改）
git config --global alias.reset-hard 'reset --hard HEAD~1'

# 丢弃工作目录修改
git config --global alias.discard 'checkout --'
```

### 分支管理别名

```bash
# 列出所有分支
git config --global alias.bra 'branch -a'

# 列出远程分支
git config --global alias.brr 'branch -r'

# 删除已合并的分支
git config --global alias.cleanup "!git branch --merged | grep -v '\\*\\|main\\|master\\|develop' | xargs -n 1 git branch -d"

# 切换到上一个分支
git config --global alias.back 'checkout -'

# 新建分支并切换
git config --global alias.cob 'checkout -b'
```

### 远程操作别名

```bash
# 查看远程仓库
git config --global alias.rv 'remote -v'

# 推送当前分支
git config --global alias.psu 'push -u origin HEAD'

# 强制推送（谨慎使用）
git config --global alias.pushf 'push --force-with-lease'

# 拉取并变基
git config --global alias.up 'pull --rebase --autostash'
```

### 高级别名

```bash
# 查看贡献者统计
git config --global alias.contributors "shortlog -s -n"

# 查看仓库大小
git config --global alias.size "count-objects -vH"

# 查找提交
git config --global alias.find "log --all --full-history --source -- "

# 显示当前分支的追踪分支
git config --global alias.tracking '!git for-each-ref --format="%(upstream:short)" $(git symbolic-ref -q HEAD)'

# 列出所有别名
git config --global alias.aliases "config --get-regexp ^alias\."

# 搜索提交信息
git config --global alias.search "log --all --grep"
```

### 实用工作流别名

```bash
# 快速提交（添加所有并提交）
git config --global alias.ac '!git add -A && git commit -m'

# 提交并推送
git config --global alias.acp '!git add -A && git commit -m "$1" && git push'

# 同步主分支
git config --global alias.sync '!git checkout main && git pull && git checkout -'

# 新功能分支
git config --global alias.feature '!git checkout main && git pull && git checkout -b'

# 保存进度
git config --global alias.save '!git add -A && git commit -m "WIP: $(date)"'

# 初始化并推送
git config --global alias.init-push '!git init && git add . && git commit -m "Initial commit" && git branch -M main'
```

## Shell 别名

除了 Git 别名，还可以在 Shell 中创建别名。

### Bash/Zsh 别名

编辑 `~/.bashrc` 或 `~/.zshrc`：

```bash
# Git 基础别名
alias g='git'
alias gs='git status'
alias ga='git add'
alias gc='git commit'
alias gp='git push'
alias gl='git pull'
alias gco='git checkout'
alias gb='git branch'

# Git 日志
alias glog='git log --oneline --decorate --graph --all'
alias glg='git log --graph --pretty=format:"%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset" --abbrev-commit'

# Git 差异
alias gd='git diff'
alias gds='git diff --staged'

# 快速操作
alias gaa='git add --all'
alias gcm='git commit -m'
alias gca='git commit --amend'
alias gpu='git push -u origin HEAD'

# 分支管理
alias gco='git checkout'
alias gcob='git checkout -b'
alias gbr='git branch'
alias gbra='git branch -a'

# 状态和日志
alias gst='git status -sb'
alias glast='git log -1 HEAD'
```

### Zsh 插件

如果使用 Oh My Zsh，可以启用 Git 插件：

```bash
# 编辑 ~/.zshrc
plugins=(git)

# Git 插件提供了大量别名
# gst   = git status
# gco   = git checkout
# gcb   = git checkout -b
# ga    = git add
# gcmsg = git commit -m
# gp    = git push
# gl    = git pull
# 等等...

# 查看所有别名
alias | grep git
```

## 函数式别名

对于复杂的操作，可以使用 Shell 函数。

### 在 .bashrc/.zshrc 中定义

```bash
# 克隆并进入目录
gcl() {
    git clone "$1" && cd "$(basename "$1" .git)"
}

# 创建分支并推送
gnb() {
    git checkout -b "$1" && git push -u origin "$1"
}

# 交互式添加、提交、推送
gacp() {
    git add .
    git status
    echo -n "Commit message: "
    read msg
    git commit -m "$msg"
    git push
}

# 查看特定作者的提交
gauthor() {
    git log --author="$1" --oneline
}

# 删除本地和远程分支
gdelete() {
    git branch -d "$1"
    git push origin --delete "$1"
}

# 回退到 N 次提交前
gundo() {
    git reset --soft HEAD~"${1:-1}"
}
```

### Git 内部函数别名

```bash
# 在 Git 别名中使用 Shell 函数
git config --global alias.delete-branch '!f() { git branch -d "$1" && git push origin --delete "$1"; }; f'

# 使用
git delete-branch feature-branch
```

## 实战配置

### 完整的 .gitconfig 示例

```ini
[user]
    name = Your Name
    email = your.email@example.com

[core]
    editor = vim
    autocrlf = input

[alias]
    # 基础别名
    st = status
    s = status -s
    co = checkout
    br = branch
    ci = commit

    # 添加和提交
    a = add
    aa = add --all
    cm = commit -m
    ca = commit --amend
    can = commit --amend --no-edit

    # 日志
    l = log --oneline
    lg = log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit
    ll = log --stat --abbrev-commit
    last = log -1 HEAD

    # 差异
    d = diff
    ds = diff --staged
    dw = diff --word-diff

    # 撤销
    unstage = reset HEAD --
    undo = reset --soft HEAD~1
    discard = checkout --

    # 分支
    bra = branch -a
    cob = checkout -b
    back = checkout -

    # 远程
    rv = remote -v
    psu = push -u origin HEAD
    up = pull --rebase --autostash

    # 实用工具
    aliases = config --get-regexp ^alias\\.
    contributors = shortlog -s -n
    cleanup = "!git branch --merged | grep -v '\\*\\|main\\|master' | xargs -n 1 git branch -d"

    # 工作流
    save = !git add -A && git commit -m 'SAVEPOINT'
    wip = !git add -u && git commit -m 'WIP'
    sync = !git checkout main && git pull && git checkout -

[color]
    ui = auto

[push]
    default = current
    followTags = true

[pull]
    rebase = true

[rebase]
    autoStash = true
```

### 团队共享配置

创建 `.gitconfig-shared` 文件：

```ini
[alias]
    # 团队统一的别名
    lg = log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit
    st = status -s
    co = checkout
    feature = !git checkout main && git pull && git checkout -b
    sync = !git fetch origin && git rebase origin/main
```

在 `~/.gitconfig` 中引用：

```ini
[include]
    path = ~/path/to/.gitconfig-shared
```

## 查看和管理别名

### 查看所有别名

```bash
# 查看所有 Git 别名
git config --get-regexp ^alias\.

# 查看特定别名
git config alias.lg

# 使用别名查看别名
git aliases
```

### 删除别名

```bash
# 删除全局别名
git config --global --unset alias.lg

# 删除仓库级别别名
git config --unset alias.lg
```

### 编辑别名

```bash
# 直接编辑配置文件
git config --global --edit

# 或重新设置
git config --global alias.lg "new command"
```

## 常见问题

### 别名不生效

```bash
# 检查别名是否存在
git config --get-regexp ^alias\.

# 检查拼写
git lg  # 而不是 git Lg

# 确认配置级别
git config --global alias.lg "..."
```

### 别名冲突

```bash
# 查看是否与 Git 内置命令冲突
git help -a

# 避免使用内置命令名
# ❌ git config --global alias.log "log --oneline"
# ✅ git config --global alias.l "log --oneline"
```

### 别名中使用参数

```bash
# ❌ 错误：不能直接传递参数
git config --global alias.find "log --all --grep"
git find "bug"  # 不工作

# ✅ 正确：使用 Shell 函数
git config --global alias.find '!f() { git log --all --grep="$1"; }; f'
git find "bug"  # 工作
```

## 最佳实践

1. **保持简洁**
   ```bash
   # ✅ 简洁明了
   git config --global alias.st 'status'

   # ❌ 过于简短
   git config --global alias.s 's'
   ```

2. **命名一致性**
   ```bash
   # 使用一致的命名模式
   alias.co = checkout
   alias.cob = checkout -b
   alias.com = checkout main
   ```

3. **文档化**
   ```bash
   # 在 README 或文档中记录团队使用的别名
   ```

4. **不要过度使用**
   - 过多别名反而难以记忆
   - 保留最常用的命令

5. **避免覆盖内置命令**
   ```bash
   # ❌ 不推荐
   git config --global alias.push 'push --force'

   # ✅ 推荐
   git config --global alias.pushf 'push --force-with-lease'
   ```

6. **使用别名查看别名**
   ```bash
   git config --global alias.aliases "config --get-regexp ^alias\."
   git aliases
   ```

## 命令速查

| 操作 | 命令 |
|------|------|
| 创建全局别名 | `git config --global alias.<name> '<command>'` |
| 创建仓库别名 | `git config alias.<name> '<command>'` |
| 查看所有别名 | `git config --get-regexp ^alias\.` |
| 查看特定别名 | `git config alias.<name>` |
| 删除别名 | `git config --global --unset alias.<name>` |
| 编辑配置 | `git config --global --edit` |

## 下一步

掌握了别名配置后，接下来学习 Git 的高级搜索技巧。

下一节：[高级搜索](../search/) →

---

## 💡 练习题

完成以下练习，巩固所学知识：

{{< expand "练习 1：创建基础别名" >}}
**任务**：
1. 为 `status`、`checkout`、`commit` 创建别名
2. 测试这些别名
3. 查看所有别名

{{< expand "查看答案" >}}
```bash
# 1. 创建别名
git config --global alias.st 'status'
git config --global alias.co 'checkout'
git config --global alias.ci 'commit'

# 2. 测试
git st
# 等同于 git status

# 3. 查看所有别名
git config --get-regexp ^alias\.
# 输出：
# alias.st status
# alias.co checkout
# alias.ci commit
```
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 2：创建复杂的日志别名" >}}
**任务**：
1. 创建一个美化的图形日志别名
2. 包含颜色、作者、时间信息
3. 测试查看效果

{{< expand "查看答案" >}}
```bash
# 1. 创建别名
git config --global alias.lg "log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit --date=relative"

# 2. 测试
git lg

# 3. 添加更多变体
# 简单版本
git config --global alias.l "log --oneline"

# 详细版本
git config --global alias.ll "log --stat --abbrev-commit"

# 最近 N 次提交
git config --global alias.last "log -1 HEAD"
```
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 3：创建工作流别名" >}}
**任务**：
1. 创建一个别名来添加所有文件并提交
2. 创建一个别名来撤销最后一次提交
3. 测试这些别名

{{< expand "查看答案" >}}
```bash
# 1. 添加并提交
git config --global alias.ac '!git add -A && git commit -m'

# 使用
git ac "feat: add new feature"
# 等同于 git add -A && git commit -m "feat: add new feature"

# 2. 撤销最后一次提交
git config --global alias.undo 'reset --soft HEAD~1'

# 测试
echo "test" > file.txt
git add file.txt
git commit -m "test commit"
git undo  # 撤销提交，但保留修改

# 验证
git status
# 输出：修改：     file.txt

# 3. 其他实用别名
# 取消暂存
git config --global alias.unstage 'reset HEAD --'

# 丢弃修改
git config --global alias.discard 'checkout --'
```
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 4：Shell 别名 vs Git 别名" >}}
**思考题**：

A. 什么时候使用 Shell 别名（如 `alias gs='git status'`）？
B. 什么时候使用 Git 别名（如 `git config alias.st 'status'`）？
C. 两者的区别是什么？

{{< expand "查看答案" >}}
**答案**：

**A. Shell 别名的使用场景**：
```bash
# 适合简化完整的 git 命令
alias gs='git status'
alias ga='git add'
alias gc='git commit'
alias gp='git push'

# 优势：
# - 更短（直接输入 gs 而非 git st）
# - 可以组合多个命令
alias gac='git add . && git commit -m'
```

**B. Git 别名的使用场景**：
```bash
# 适合简化 git 子命令
git config --global alias.st 'status'
git config --global alias.co 'checkout'

# 优势：
# - Git 原生支持
# - 可移植（在任何 Shell 中都工作）
# - 可以访问 Git 内部命令
git config --global alias.unstage 'reset HEAD --'
```

**C. 两者的区别**：

| 特性 | Shell 别名 | Git 别名 |
|------|----------|---------|
| 使用方式 | `gs` | `git st` |
| 配置位置 | `~/.bashrc`/`~/.zshrc` | `~/.gitconfig` |
| 可移植性 | 依赖 Shell | 任何 Shell 都可用 |
| 复杂度 | 可以很复杂 | 相对简单 |
| 组合命令 | 容易 | 需要用 `!` |

**推荐策略**：

1. **两者结合使用**：
```bash
# Shell 别名：简化 git 命令
alias g='git'

# Git 别名：简化 git 子命令
git config --global alias.st 'status'

# 结合使用
g st  # git status
```

2. **根据习惯选择**：
- 喜欢极简 → Shell 别名
- 喜欢标准 Git 工作流 → Git 别名
- 团队协作 → Git 别名（更标准）

3. **实用配置示例**：
```bash
# ~/.bashrc
alias g='git'

# ~/.gitconfig
[alias]
    st = status -s
    co = checkout
    br = branch
    ci = commit
    lg = log --graph --oneline

# 使用
g st    # git status -s
g lg    # git log --graph --oneline
```
{{< /expand >}}
{{< /expand >}}

---

{{< hint success >}}
**检查清单** - 完成本节后，你应该能够：

- [ ] 理解 Git 别名的概念和优势
- [ ] 使用 `git config` 创建别名
- [ ] 创建简单和复杂的别名
- [ ] 在 Shell 中创建 Git 快捷方式
- [ ] 查看和管理现有别名
- [ ] 区分 Git 别名和 Shell 别名的使用场景
- [ ] 配置个性化的工作流别名
- [ ] 在团队中共享别名配置
{{< /hint >}}
