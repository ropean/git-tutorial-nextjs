---
title: "常见错误"
weight: 1
bookToc: true
---

# 常见错误

本章将介绍 Git 使用过程中最常见的错误及其解决方案。了解这些错误可以帮助你快速定位问题并找到解决方法。

## 合并冲突错误

### 错误信息

```bash
$ git merge feature-branch
Auto-merging src/app.js
CONFLICT (content): Merge conflict in src/app.js
Automatic merge failed; fix conflicts and then commit the result.
```

### 原因分析

当两个分支修改了同一文件的同一位置时，Git 无法自动合并，需要手动解决冲突。

### 解决方案

#### 步骤 1：查看冲突文件

```bash
# 查看冲突状态
git status

# Unmerged paths:
#   (use "git add <file>..." to mark resolution)
#         both modified:   src/app.js
```

#### 步骤 2：编辑冲突文件

打开冲突文件，你会看到类似这样的标记：

```javascript
function calculateTotal(items) {
<<<<<<< HEAD
  // 当前分支的代码
  return items.reduce((sum, item) => sum + item.price, 0);
=======
  // 要合并的分支的代码
  return items.map(item => item.price).reduce((a, b) => a + b, 0);
>>>>>>> feature-branch
}
```

**冲突标记说明**：
- `<<<<<<< HEAD`：当前分支的内容开始
- `=======`：分隔线
- `>>>>>>> feature-branch`：要合并的分支内容结束

#### 步骤 3：解决冲突

手动编辑文件，保留需要的内容，删除冲突标记：

```javascript
function calculateTotal(items) {
  // 保留最优方案或合并两者
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

#### 步骤 4：标记为已解决

```bash
# 添加已解决的文件
git add src/app.js

# 查看状态
git status
# All conflicts fixed but you are still merging.

# 完成合并
git commit
```

### 使用合并工具

```bash
# 使用配置的合并工具
git mergetool

# 使用特定工具
git mergetool --tool=vimdiff
git mergetool --tool=meld
git mergetool --tool=vscode

# 配置默认合并工具
git config --global merge.tool vscode
git config --global mergetool.vscode.cmd 'code --wait $MERGED'
```

### 取消合并

```bash
# 如果想放弃合并
git merge --abort

# 回到合并前的状态
```

### 实战示例

```bash
# 创建测试环境
mkdir merge-conflict-demo
cd merge-conflict-demo
git init -b main

# 创建基础文件
echo "Line 1" > file.txt
git add file.txt
git commit -m "Initial commit"

# 在 main 分支修改
echo "Line 2 from main" >> file.txt
git commit -am "Update on main"

# 创建并切换到新分支（从 Initial commit）
git checkout -b feature HEAD~1
echo "Line 2 from feature" >> file.txt
git commit -am "Update on feature"

# 尝试合并（会产生冲突）
git checkout main
git merge feature
# CONFLICT (content): Merge conflict in file.txt

# 查看冲突
cat file.txt
# Line 1
# <<<<<<< HEAD
# Line 2 from main
# =======
# Line 2 from feature
# >>>>>>> feature

# 解决冲突
echo -e "Line 1\nLine 2 (merged)" > file.txt
git add file.txt
git commit -m "Merge feature branch"
```

## 推送被拒绝

### 错误信息 1：远程有新提交

```bash
$ git push origin main
To https://github.com/user/repo.git
 ! [rejected]        main -> main (fetch first)
error: failed to push some refs to 'https://github.com/user/repo.git'
hint: Updates were rejected because the remote contains work that you do
hint: not have locally. This is usually caused by another repository pushing
hint: to the same ref. You may want to first integrate the remote changes
hint: (e.g., 'git pull ...') before pushing again.
```

### 原因分析

远程分支有其他人推送的新提交，而你的本地分支不包含这些提交。

### 解决方案

#### 方案 1：先拉取再推送（推荐）

```bash
# 拉取并合并远程更改
git pull origin main

# 如果有冲突，解决冲突后
git push origin main
```

#### 方案 2：使用 rebase（保持线性历史）

```bash
# 使用 rebase 方式拉取
git pull --rebase origin main

# 如果有冲突，解决后
git add <resolved-files>
git rebase --continue

# 推送
git push origin main
```

#### 方案 3：强制推送（危险！）

```bash
# ⚠️ 警告：这会覆盖远程提交，仅在确定的情况下使用
git push --force origin main

# 更安全的强制推送
git push --force-with-lease origin main
```

{{< hint danger >}}
**警告**：`--force` 会覆盖远程历史，可能导致其他人的工作丢失！仅在以下情况使用：
- 这是你的个人分支
- 确定没有其他人在使用这个分支
- 你知道自己在做什么

使用 `--force-with-lease` 更安全，它会检查远程分支是否被其他人更新。
{{< /hint >}}

### 错误信息 2：没有跟踪远程分支

```bash
$ git push
fatal: The current branch feature has no upstream branch.
To push the current branch and set the remote as upstream, use

    git push --set-upstream origin feature
```

### 解决方案

```bash
# 方案 1：按提示执行
git push --set-upstream origin feature

# 方案 2：使用简写
git push -u origin feature

# 方案 3：配置默认行为
git config --global push.default current
git push
```

### 错误信息 3：没有推送权限

```bash
$ git push origin main
remote: Permission to user/repo.git denied to username.
fatal: unable to access 'https://github.com/user/repo.git/':
The requested URL returned error: 403
```

### 原因与解决

**原因**：
- 没有仓库的写权限
- 使用了错误的凭证
- SSH 密钥未配置

**解决方案**：

```bash
# 检查远程 URL
git remote -v

# 方案 1：更新凭证（HTTPS）
# macOS
git credential-osxkeychain erase
# 下次推送时会要求重新输入

# 方案 2：切换到 SSH
git remote set-url origin git@github.com:user/repo.git

# 方案 3：检查 SSH 密钥
ssh -T git@github.com
# Hi username! You've successfully authenticated...
```

## 分支问题

### 错误：分支不存在

```bash
$ git checkout feature-branch
error: pathspec 'feature-branch' did not match any file(s) known to git
```

### 原因与解决

```bash
# 原因 1：分支名拼写错误
git branch -a  # 查看所有分支
git checkout correct-branch-name

# 原因 2：远程分支未获取
git fetch origin
git checkout feature-branch

# 原因 3：分支在远程但未在本地
git checkout -b feature-branch origin/feature-branch
```

### 错误：切换分支时有未提交的更改

```bash
$ git checkout main
error: Your local changes to the following files would be overwritten by checkout:
        src/app.js
Please commit your changes or stash them before you switch branches.
Aborting
```

### 解决方案

```bash
# 方案 1：提交更改
git add .
git commit -m "Work in progress"
git checkout main

# 方案 2：暂存更改
git stash
git checkout main
# 稍后恢复
git checkout feature
git stash pop

# 方案 3：强制切换（会丢失更改！）
git checkout -f main
```

### 错误：删除分支失败

```bash
$ git branch -d feature
error: The branch 'feature' is not fully merged.
If you are sure you want to delete it, run 'git branch -D feature'.
```

### 解决方案

```bash
# 检查分支状态
git branch --merged
git branch --no-merged

# 方案 1：先合并再删除
git checkout main
git merge feature
git branch -d feature

# 方案 2：强制删除（确认不需要这些提交）
git branch -D feature

# 方案 3：查看分支差异
git log main..feature  # 查看 feature 有但 main 没有的提交
```

## 权限错误

### SSH 权限错误

```bash
$ git clone git@github.com:user/repo.git
Permission denied (publickey).
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.
```

### 解决方案

```bash
# 步骤 1：检查 SSH 密钥
ls -la ~/.ssh
# 查找 id_rsa.pub 或 id_ed25519.pub

# 步骤 2：如果没有密钥，生成新密钥
ssh-keygen -t ed25519 -C "your_email@example.com"
# 或使用 RSA
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

# 步骤 3：启动 SSH 代理
eval "$(ssh-agent -s)"

# 步骤 4：添加密钥到代理
ssh-add ~/.ssh/id_ed25519

# 步骤 5：复制公钥
cat ~/.ssh/id_ed25519.pub
# 将输出的内容添加到 GitHub/GitLab 的 SSH 设置中

# 步骤 6：测试连接
ssh -T git@github.com
# Hi username! You've successfully authenticated...
```

### 文件权限错误

```bash
$ git status
error: insufficient permission for adding an object to repository database .git/objects
fatal: failed to write object
```

### 解决方案

```bash
# 检查 .git 目录权限
ls -la .git

# 修复权限
sudo chown -R $(whoami) .git
chmod -R u+rwX .git

# 如果是在服务器上
sudo chown -R git:git /path/to/repo.git
chmod -R 775 /path/to/repo.git
```

## 编码问题

### 换行符问题

```bash
$ git diff
warning: LF will be replaced by CRLF in file.txt.
The file will have its original line endings in your working directory
```

### 原因与解决

**原因**：Windows 使用 CRLF（`\r\n`），Unix/Linux/Mac 使用 LF（`\n`）作为换行符。

**解决方案**：

```bash
# Windows 用户
git config --global core.autocrlf true
# 检出时转换为 CRLF，提交时转换为 LF

# Mac/Linux 用户
git config --global core.autocrlf input
# 检出时不转换，提交时转换为 LF

# 跨平台项目（推荐）
git config --global core.autocrlf false
# 不自动转换，使用 .gitattributes 控制

# 创建 .gitattributes 文件
cat > .gitattributes << 'EOF'
# 自动检测文本文件并规范化
* text=auto

# 明确指定文本文件使用 LF
*.sh text eol=lf
*.py text eol=lf

# 明确指定文本文件使用 CRLF
*.bat text eol=crlf

# 二进制文件不处理
*.png binary
*.jpg binary
EOF
```

### 字符编码问题

```bash
# 中文文件名显示为数字
git status
# modified:   "\344\270\255\346\226\207.txt"
```

### 解决方案

```bash
# 配置 Git 正确显示中文
git config --global core.quotepath false

# 配置编辑器编码
git config --global gui.encoding utf-8

# 配置输入输出编码（Windows）
git config --global i18n.commitEncoding utf-8
git config --global i18n.logOutputEncoding utf-8

# Windows 控制台设置
# 在 Git Bash 中
export LESSCHARSET=utf-8
```

## 仓库损坏错误

### 错误信息

```bash
$ git status
error: object file .git/objects/xx/xxxx is empty
fatal: loose object xxxx (stored in .git/objects/xx/xxxx) is corrupt
```

### 解决方案

```bash
# 步骤 1：备份仓库
cp -r .git .git-backup

# 步骤 2：尝试修复
git fsck --full

# 步骤 3：如果有备份，从备份恢复损坏对象
git fetch origin

# 步骤 4：重置到已知良好状态
git reset --hard origin/main

# 步骤 5：如果问题持续，重新克隆
cd ..
mv repo repo-backup
git clone <repository-url> repo
cd repo
# 手动复制未提交的工作
```

## Detached HEAD 警告

### 警告信息

```bash
$ git checkout abc1234
Note: switching to 'abc1234'.

You are in 'detached HEAD' state. You can look around, make experimental
changes and commit them, and you can discard any commits you make in this
state without impacting any branches by switching back to a branch.
```

### 原因与解决

**原因**：直接检出了一个提交（而不是分支），HEAD 不指向任何分支。

**解决方案**：

```bash
# 场景 1：只是查看历史，不做修改
git checkout main  # 回到分支

# 场景 2：做了修改并想保留
git checkout -b new-branch  # 创建新分支保存修改

# 场景 3：做了修改但不想保留
git checkout main  # 切换回分支，放弃修改
```

### 实战示例

```bash
# 创建一些提交
git init -b main
echo "v1" > file.txt && git add . && git commit -m "v1"
echo "v2" >> file.txt && git add . && git commit -m "v2"
echo "v3" >> file.txt && git add . && git commit -m "v3"

# 查看历史
git log --oneline
# c3d4e5f v3
# b2c3d4e v2
# a1b2c3d v1

# 检出旧提交（进入 detached HEAD）
git checkout b2c3d4e

# 做一些实验性修改
echo "experiment" >> file.txt
git commit -am "Experimental change"

# 保存这些修改到新分支
git checkout -b experiment

# 或者放弃修改，回到 main
git checkout main
```

## 大文件错误

### 错误信息

```bash
$ git push
remote: error: File large-file.zip is 123.45 MB; this exceeds GitHub's file size limit of 100 MB
```

### 解决方案

```bash
# 方案 1：从历史中移除大文件（使用 git filter-repo）
# 安装 git-filter-repo
pip install git-filter-repo

# 移除大文件
git filter-repo --path large-file.zip --invert-paths

# 方案 2：使用 BFG Repo-Cleaner（更快）
# 下载 BFG：https://rtyley.github.io/bfg-repo-cleaner/
java -jar bfg.jar --delete-files large-file.zip

# 清理
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# 强制推送
git push --force

# 方案 3：使用 Git LFS 管理大文件
git lfs install
git lfs track "*.zip"
git add .gitattributes
git add large-file.zip
git commit -m "Use LFS for large files"
git push
```

## 常见命令错误

### 错误：没有在 Git 仓库中

```bash
$ git status
fatal: not a git repository (or any of the parent directories): .git
```

**解决**：

```bash
# 检查是否在正确的目录
pwd
ls -la  # 查找 .git 目录

# 初始化仓库
git init

# 或进入正确的目录
cd /path/to/your/repo
```

### 错误：远程仓库不存在

```bash
$ git clone https://github.com/user/repo.git
fatal: repository 'https://github.com/user/repo.git/' not found
```

**解决**：

```bash
# 检查 URL 是否正确
# 检查仓库是否是私有的（需要认证）
# 检查仓库是否被删除或重命名
```

### 错误：拒绝合并无关历史

```bash
$ git pull origin main
fatal: refusing to merge unrelated histories
```

**解决**：

```bash
# 强制合并无关历史（通常在关联远程仓库时）
git pull origin main --allow-unrelated-histories
```

## 错误速查表

| 错误信息关键词 | 常见原因 | 快速解决 |
|---------------|---------|---------|
| `CONFLICT` | 合并冲突 | 手动解决冲突，`git add`，`git commit` |
| `rejected` | 推送被拒绝 | `git pull` 然后 `git push` |
| `Permission denied` | SSH 权限问题 | 检查 SSH 密钥，`ssh -T git@github.com` |
| `pathspec did not match` | 分支/文件不存在 | 检查拼写，`git fetch`，`git branch -a` |
| `detached HEAD` | 检出了提交而非分支 | `git checkout -b new-branch` 或 `git checkout main` |
| `file size limit` | 文件过大 | 使用 Git LFS 或从历史中移除 |
| `not a git repository` | 不在仓库目录 | `cd` 到正确目录或 `git init` |
| `loose object is corrupt` | 仓库损坏 | `git fsck`，重新克隆 |
| `LF will be replaced by CRLF` | 换行符问题 | 配置 `core.autocrlf` |
| `unrelated histories` | 合并无关历史 | `--allow-unrelated-histories` |

## 调试技巧

### 启用详细输出

```bash
# 显示详细信息
git <command> --verbose
git <command> -v

# 显示调试信息
GIT_TRACE=1 git <command>
GIT_CURL_VERBOSE=1 git <command>

# 例如：调试推送问题
GIT_TRACE=1 GIT_CURL_VERBOSE=1 git push origin main
```

### 检查配置

```bash
# 查看所有配置
git config --list

# 查看配置来源
git config --list --show-origin

# 检查特定配置
git config user.name
git config user.email
```

### 验证仓库完整性

```bash
# 检查仓库完整性
git fsck

# 详细检查
git fsck --full

# 查看悬空对象
git fsck --lost-found
```

## 寻求帮助

### 查看命令帮助

```bash
# 查看命令帮助
git <command> --help
git help <command>

# 快速查看选项
git <command> -h

# 例如
git merge --help
git commit -h
```

### 在线资源

- **官方文档**：https://git-scm.com/doc
- **Git Book**：https://git-scm.com/book/zh/v2
- **Stack Overflow**：https://stackoverflow.com/questions/tagged/git
- **GitHub 文档**：https://docs.github.com

---

## 💡 练习题

{{< expand "练习 1：解决合并冲突" >}}
**任务**：创建一个合并冲突并解决它

{{< expand "查看答案" >}}
```bash
# 创建仓库
mkdir conflict-practice
cd conflict-practice
git init -b main

# 创建基础文件
cat > app.js << 'EOF'
function greet(name) {
  return "Hello";
}
EOF

git add app.js
git commit -m "Initial commit"

# 在 main 分支修改
cat > app.js << 'EOF'
function greet(name) {
  return "Hello, " + name + "!";
}
EOF

git commit -am "Add name parameter"

# 创建并切换到 feature 分支（从初始提交）
git checkout -b feature HEAD~1

# 在 feature 分支修改
cat > app.js << 'EOF'
function greet(name) {
  return "Hi there!";
}
EOF

git commit -am "Change greeting"

# 合并（会产生冲突）
git checkout main
git merge feature
# CONFLICT (content): Merge conflict in app.js

# 查看冲突
cat app.js

# 解决冲突
cat > app.js << 'EOF'
function greet(name) {
  return "Hello, " + name + "!";
}
EOF

git add app.js
git commit -m "Merge feature: keep main version"

# 验证
git log --oneline --graph
```
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 2：处理推送被拒绝" >}}
**场景**：模拟远程有新提交，导致推送被拒绝的情况

{{< expand "查看答案" >}}
```bash
# 创建"远程"仓库（裸仓库）
mkdir remote-repo.git
cd remote-repo.git
git init --bare
cd ..

# 创建本地仓库 1
mkdir local1
cd local1
git init -b main
echo "v1" > file.txt
git add file.txt
git commit -m "v1"
git remote add origin ../remote-repo.git
git push -u origin main
cd ..

# 创建本地仓库 2（模拟另一个开发者）
git clone remote-repo.git local2
cd local2
echo "v2 from local2" >> file.txt
git commit -am "v2 from local2"
git push
cd ..

# 回到 local1，做修改
cd local1
echo "v2 from local1" >> file.txt
git commit -am "v2 from local1"

# 尝试推送（会被拒绝）
git push
# ! [rejected]        main -> main (fetch first)

# 解决方案 1：pull 后推送
git pull --rebase origin main
# 会有冲突，解决它
cat file.txt
echo -e "v1\nv2 from local2\nv2 from local1" > file.txt
git add file.txt
git rebase --continue

# 现在可以推送了
git push
```
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 3：修复损坏的仓库" >}}
**任务**：模拟和修复仓库损坏

{{< expand "查看答案" >}}
```bash
# 创建仓库
git init -b main
echo "content" > file.txt
git add file.txt
git commit -m "Initial commit"

# 备份 .git 目录
cp -r .git .git-backup

# 模拟损坏（删除一个对象文件）
# 注意：这只是演示，实际中不要这么做
find .git/objects -type f | head -1 | xargs rm

# 检查损坏
git fsck --full
# error: object file ... is empty

# 方案 1：从备份恢复
cp -r .git-backup/* .git/

# 验证
git fsck --full
# 应该没有错误

# 方案 2：如果有远程仓库
git remote add origin <url>
git fetch origin
git reset --hard origin/main
```

**关键点**：
- 定期备份重要仓库
- 使用远程仓库作为备份
- `git fsck` 可以检测问题
{{< /expand >}}
{{< /expand >}}

---

{{< hint success >}}
**检查清单** - 完成本节后，你应该能够：

- [ ] 识别和解决合并冲突
- [ ] 处理推送被拒绝的各种情况
- [ ] 解决分支相关的错误
- [ ] 修复权限问题
- [ ] 配置正确的编码设置
- [ ] 处理大文件错误
- [ ] 使用调试技巧定位问题
- [ ] 知道在哪里寻求帮助
{{< /hint >}}
