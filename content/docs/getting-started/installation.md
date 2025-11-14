---
title: "安装配置"
weight: 2
bookToc: true
---

# 安装配置 Git

本章将指导你在不同操作系统上安装和配置 Git。

## 检查是否已安装

在安装之前，先检查系统中是否已经安装了 Git：

```bash
git --version
```

如果看到类似 `git version 2.x.x` 的输出，说明已经安装了 Git。

{{< hint info >}}
**推荐版本**：建议使用 Git 2.23 或更高版本，以获得最新功能和安全更新。
{{< /hint >}}

## 在 Windows 上安装

### 方法一：Git for Windows（推荐）

1. 访问 [Git 官方网站](https://git-scm.com/download/windows)
2. 下载最新版本的安装程序
3. 运行安装程序，建议使用默认设置

**安装选项说明**：

| 选项 | 推荐设置 | 说明 |
|------|---------|------|
| 编辑器 | VS Code / Notepad++ | 用于编辑提交信息 |
| PATH 环境 | Git from the command line and also from 3rd-party software | 让其他软件也能使用 Git |
| HTTPS 传输 | Use the OpenSSL library | 推荐的安全选项 |
| 换行符转换 | Checkout Windows-style, commit Unix-style | 跨平台协作的最佳选择 |
| 终端模拟器 | Use MinTTY | 更好的命令行体验 |

### 方法二：通过包管理器

使用 [Chocolatey](https://chocolatey.org/)：

```powershell
choco install git
```

使用 [Winget](https://learn.microsoft.com/zh-cn/windows/package-manager/winget/)：

```powershell
winget install Git.Git
```

### 验证安装

打开命令提示符或 PowerShell，运行：

```bash
git --version
```

## 在 macOS 上安装

### 方法一：Homebrew（推荐）

1. 安装 [Homebrew](https://brew.sh/)（如果还没有）：

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

2. 使用 Homebrew 安装 Git：

```bash
brew install git
```

### 方法二：Xcode Command Line Tools

macOS 自带了 Git，但可能版本较旧。安装 Xcode Command Line Tools 可以获得较新版本：

```bash
xcode-select --install
```

### 方法三：官方安装包

访问 [Git 官方网站](https://git-scm.com/download/mac) 下载安装包。

### 验证安装

```bash
git --version
```

## 在 Linux 上安装

### Debian/Ubuntu

```bash
sudo apt update
sudo apt install git
```

### Fedora

```bash
sudo dnf install git
```

### CentOS/RHEL

```bash
sudo yum install git
```

或者使用 dnf（较新版本）：

```bash
sudo dnf install git
```

### Arch Linux

```bash
sudo pacman -S git
```

### 从源码编译（高级）

如果需要最新版本或自定义编译选项：

```bash
# 安装依赖
sudo apt install libcurl4-gnutls-dev libexpat1-dev gettext libz-dev libssl-dev

# 下载源码
wget https://github.com/git/git/archive/v2.43.0.tar.gz
tar -zxf v2.43.0.tar.gz
cd git-2.43.0

# 编译安装
make prefix=/usr/local all
sudo make prefix=/usr/local install
```

### 验证安装

```bash
git --version
```

## 初始配置

安装完成后，需要进行基本配置。

### 配置用户信息

设置你的用户名和邮箱，这些信息会出现在每次提交中：

```bash
# 配置用户名
git config --global user.name "你的名字"

# 配置邮箱
git config --global user.email "your.email@example.com"
```

{{< hint warning >}}
**注意**：邮箱地址会显示在提交历史中，如果使用 GitHub，建议使用 GitHub 提供的隐私邮箱：
`username@users.noreply.github.com`
{{< /hint >}}

### 配置默认分支名

现代项目通常使用 `main` 作为默认分支名：

```bash
git config --global init.defaultBranch main
```

### 配置编辑器

设置你喜欢的文本编辑器：

```bash
# VS Code
git config --global core.editor "code --wait"

# Vim
git config --global core.editor "vim"

# Nano
git config --global core.editor "nano"

# Sublime Text
git config --global core.editor "subl -n -w"
```

### 配置换行符处理

**Windows 用户**：

```bash
git config --global core.autocrlf true
```

**macOS/Linux 用户**：

```bash
git config --global core.autocrlf input
```

### 启用颜色输出

让 Git 输出更易读：

```bash
git config --global color.ui auto
```

### 查看所有配置

```bash
# 查看所有配置
git config --list

# 查看特定配置
git config user.name
git config user.email
```

## 配置级别

Git 有三个配置级别：

| 级别 | 范围 | 文件位置 | 命令参数 |
|------|------|---------|---------|
| **系统级** | 所有用户 | `/etc/gitconfig` | `--system` |
| **全局级** | 当前用户 | `~/.gitconfig` | `--global` |
| **仓库级** | 当前仓库 | `.git/config` | `--local` |

优先级：仓库级 > 全局级 > 系统级

```bash
# 全局配置（推荐日常使用）
git config --global user.name "Your Name"

# 仓库级配置（针对特定项目）
git config --local user.email "work@company.com"

# 系统级配置（影响所有用户）
sudo git config --system core.editor vim
```

## 配置别名（提升效率）

创建常用命令的快捷方式：

```bash
# 状态
git config --global alias.st status

# 日志
git config --global alias.lg "log --oneline --graph --all --decorate"

# 提交
git config --global alias.cm commit

# 切换分支
git config --global alias.co checkout

# 分支
git config --global alias.br branch

# 最后一次提交
git config --global alias.last "log -1 HEAD"
```

使用别名：

```bash
git st          # 相当于 git status
git lg          # 相当于 git log --oneline --graph --all --decorate
git cm -m "msg" # 相当于 git commit -m "msg"
```

## SSH 密钥配置（可选但推荐）

使用 SSH 可以避免每次推送时输入密码。

### 1. 生成 SSH 密钥

```bash
ssh-keygen -t ed25519 -C "your.email@example.com"
```

如果系统不支持 ed25519，使用 RSA：

```bash
ssh-keygen -t rsa -b 4096 -C "your.email@example.com"
```

按提示操作：
- 保存位置：直接回车使用默认位置 `~/.ssh/id_ed25519`
- 密码：可以设置或留空

### 2. 启动 SSH 代理

**macOS/Linux**：

```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

**Windows**（Git Bash）：

```bash
eval $(ssh-agent -s)
ssh-add ~/.ssh/id_ed25519
```

### 3. 添加公钥到 GitHub/GitLab

复制公钥内容：

```bash
# macOS
pbcopy < ~/.ssh/id_ed25519.pub

# Linux
cat ~/.ssh/id_ed25519.pub | xclip -selection clipboard

# Windows (Git Bash)
cat ~/.ssh/id_ed25519.pub | clip
```

或者直接查看并手动复制：

```bash
cat ~/.ssh/id_ed25519.pub
```

然后：
1. 登录 GitHub/GitLab
2. 进入 Settings → SSH and GPG keys
3. 点击 "New SSH key"
4. 粘贴公钥内容
5. 保存

### 4. 测试连接

**GitHub**：

```bash
ssh -T git@github.com
```

**GitLab**：

```bash
ssh -T git@gitlab.com
```

**Gitee**：

```bash
ssh -T git@gitee.com
```

看到欢迎信息即表示配置成功！

## 推荐的完整配置

将以下内容保存为 `.gitconfig` 文件，放在用户主目录下：

```ini
[user]
    name = Your Name
    email = your.email@example.com

[init]
    defaultBranch = main

[core]
    editor = code --wait
    autocrlf = input  # Windows 用户改为 true
    quotepath = false
    ignorecase = false

[color]
    ui = auto

[alias]
    st = status
    co = checkout
    br = branch
    cm = commit
    lg = log --oneline --graph --all --decorate
    last = log -1 HEAD
    unstage = reset HEAD --
    undo = checkout --

[pull]
    rebase = false

[push]
    default = simple
    followTags = true

[merge]
    conflictstyle = diff3

[diff]
    tool = vscode

[difftool "vscode"]
    cmd = code --wait --diff $LOCAL $REMOTE
```

## 图形化工具（可选）

除了命令行，你也可以使用图形化工具：

### 跨平台

- **[GitHub Desktop](https://desktop.github.com/)** - 简洁易用
- **[GitKraken](https://www.gitkraken.com/)** - 功能强大，界面漂亮
- **[Sourcetree](https://www.sourcetreeapp.com/)** - 免费，功能全面
- **[VS Code](https://code.visualstudio.com/)** - 编辑器内置 Git 支持

### Windows

- **[TortoiseGit](https://tortoisegit.org/)** - 资源管理器集成

### macOS

- **[Tower](https://www.git-tower.com/)** - 强大但付费
- **[Fork](https://git-fork.com/)** - 快速且免费

### Linux

- **[GitKraken](https://www.gitkraken.com/)**
- **[GitExtensions](https://gitextensions.github.io/)**

## 验证安装

运行以下命令确认一切正常：

```bash
# 查看版本
git --version

# 查看配置
git config --list

# 查看帮助
git --help
```

## 常见问题

{{< expand "命令未找到（command not found）" >}}
**原因**：Git 未正确安装或未添加到 PATH 环境变量。

**解决方案**：
1. 重新安装 Git
2. Windows 用户：确保安装时选择了 "Add Git to PATH"
3. 手动添加 Git 到 PATH 环境变量
4. 重启终端或电脑
{{< /expand >}}

{{< expand "中文显示乱码" >}}
**解决方案**：

```bash
git config --global core.quotepath false
git config --global gui.encoding utf-8
git config --global i18n.commit.encoding utf-8
git config --global i18n.logoutputencoding utf-8
```

Windows 用户还需要设置：
```bash
set LESSCHARSET=utf-8
```
{{< /expand >}}

{{< expand "SSL 证书错误" >}}
**临时解决方案**（不推荐，仅用于测试）：

```bash
git config --global http.sslVerify false
```

**推荐方案**：更新 Git 或更新系统的 CA 证书。
{{< /expand >}}

## 下一步

配置完成后，让我们创建第一个 Git 仓库！

下一节：[第一个仓库](../first-repository/) →

---

## 💡 检查清单

在继续之前，确保你已经完成：

- [ ] 成功安装 Git
- [ ] 配置了用户名和邮箱
- [ ] 设置了默认分支名为 main
- [ ] 配置了编辑器
- [ ] （可选）配置了 SSH 密钥
- [ ] 运行 `git --version` 能正常显示版本号
- [ ] 运行 `git config --list` 能看到你的配置

{{< hint success >}}
**恭喜！** 你已经成功安装和配置了 Git，可以开始使用了！
{{< /hint >}}
