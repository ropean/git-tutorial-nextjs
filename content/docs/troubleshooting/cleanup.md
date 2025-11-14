---
title: "清理仓库"
weight: 3
bookToc: true
---

# 清理仓库

本章将学习如何清理和优化 Git 仓库，包括移除大文件、删除敏感数据、减小仓库体积等。

{{< hint warning >}}
**警告**：清理操作通常会重写历史。在操作前：
1. 备份仓库
2. 通知团队成员
3. 确保所有人都推送了他们的更改
4. 准备让所有人重新克隆仓库
{{< /hint >}}

## 清理大文件

### 问题场景

```bash
# 不小心提交了大文件
git add large-file.iso
git commit -m "Add ISO file"
git push

# 错误！
# remote: error: File large-file.iso is 500MB; exceeds GitHub's 100MB limit
```

即使删除文件，它仍然在历史中：

```bash
# 删除文件
git rm large-file.iso
git commit -m "Remove large file"
git push

# 但仓库体积没有减小！
# 因为文件仍在历史中
```

### 查找大文件

#### 方法 1：使用 git-sizer

```bash
# 安装 git-sizer
# macOS
brew install git-sizer

# Linux
wget https://github.com/github/git-sizer/releases/download/v1.5.0/git-sizer-1.5.0-linux-amd64.zip
unzip git-sizer-1.5.0-linux-amd64.zip
sudo mv git-sizer /usr/local/bin/

# 分析仓库
git-sizer --verbose

# 输出示例
# Overall repository size:
#   * Commits:     500
#   * Trees:       1000
#   * Blobs:       2000
#   * Total size:  500 MB
#
# Biggest objects:
#   * Blob: 100 MB (large-file.iso)
```

#### 方法 2：使用 Git 命令查找

```bash
# 查找所有对象，按大小排序
git rev-list --objects --all | \
  git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | \
  sed -n 's/^blob //p' | \
  sort -k2 -n -r | \
  head -20

# 更易读的版本
git rev-list --objects --all | \
  git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | \
  awk '/^blob/ {print substr($0,6)}' | \
  sort -k2 -n -r | \
  head -20 | \
  numfmt --field=2 --to=iec-i

# 输出示例
# abc1234 100M path/to/large-file.iso
# def5678 50M  another/big-file.zip
```

#### 方法 3：使用脚本

```bash
# 创建查找大文件的脚本
cat > find-large-files.sh << 'EOF'
#!/bin/bash
# 查找历史中的大文件

echo "Finding large files in Git history..."
echo ""

git rev-list --objects --all | \
  git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | \
  awk '/^blob/ {print substr($0,6)}' | \
  sort -k2 -n -r | \
  head -20 | \
  while read hash size path; do
    size_mb=$(echo "scale=2; $size / 1048576" | bc)
    printf "%6.2f MB  %s\n" "$size_mb" "$path"
  done
EOF

chmod +x find-large-files.sh
./find-large-files.sh
```

### 移除大文件

#### 方法 1：使用 git filter-repo（推荐）

`git filter-repo` 是现代的、快速的仓库清理工具。

```bash
# 安装 git filter-repo
pip3 install git-filter-repo

# 或下载单个文件
wget https://raw.githubusercontent.com/newren/git-filter-repo/main/git-filter-repo
chmod +x git-filter-repo
sudo mv git-filter-repo /usr/local/bin/

# 移除特定文件
git filter-repo --path large-file.iso --invert-paths

# 移除多个文件
git filter-repo --path file1.iso --path file2.zip --invert-paths

# 移除整个目录
git filter-repo --path old-binaries/ --invert-paths

# 移除匹配模式的文件
git filter-repo --path-glob '*.iso' --invert-paths
```

#### 方法 2：使用 BFG Repo-Cleaner（更快但功能较少）

```bash
# 下载 BFG
wget https://repo1.maven.org/maven2/com/madgag/bfg/1.14.0/bfg-1.14.0.jar

# 移除大于 100MB 的文件
java -jar bfg.jar --strip-blobs-bigger-than 100M repo.git

# 移除特定文件
java -jar bfg.jar --delete-files large-file.iso repo.git

# 移除匹配模式的文件
java -jar bfg.jar --delete-files '*.{iso,zip}' repo.git
```

### 完整清理流程

```bash
# === 步骤 1：备份仓库 ===
cp -r my-repo my-repo-backup

# === 步骤 2：克隆镜像（用于清理） ===
git clone --mirror git@github.com:user/repo.git

# === 步骤 3：清理大文件 ===
cd repo.git
git filter-repo --path large-file.iso --invert-paths

# === 步骤 4：清理和压缩 ===
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# === 步骤 5：强制推送 ===
git push origin --force --all
git push origin --force --tags

# === 步骤 6：通知团队 ===
# 所有人需要：
# 1. 备份本地未推送的更改
# 2. 删除本地仓库
# 3. 重新克隆
```

### 实战示例

```bash
# 创建演示仓库
mkdir cleanup-demo
cd cleanup-demo
git init -b main

# 创建正常文件
echo "Small file" > small.txt
git add small.txt
git commit -m "Add small file"

# 创建大文件
dd if=/dev/zero of=large.bin bs=1M count=50
git add large.bin
git commit -m "Add large file (mistake!)"

# 创建更多提交
echo "More content" > another.txt
git add another.txt
git commit -m "Add another file"

# 删除大文件（但它仍在历史中）
git rm large.bin
git commit -m "Remove large file"

# 检查仓库大小
du -sh .git
# ~50MB

# 使用 filter-repo 清理
git filter-repo --path large.bin --invert-paths

# 再次检查大小
du -sh .git
# ~100KB

# 验证历史
git log --oneline --all
# 大文件的提交已被重写
```

## 移除敏感数据

### 常见敏感数据

```bash
# 密码和密钥
config/database.yml (包含密码)
.env (包含 API 密钥)
credentials.json
id_rsa (私钥)

# 敏感配置
config/secrets.yml
application.properties

# 内部信息
customer-data.csv
internal-docs.pdf
```

### 移除敏感文件

```bash
# 使用 git filter-repo
git filter-repo --path config/secrets.yml --invert-paths

# 使用 BFG
java -jar bfg.jar --delete-files secrets.yml

# 移除包含密码的整个目录
git filter-repo --path config/production/ --invert-paths
```

### 替换敏感数据

有时需要保留文件但替换其中的敏感内容：

```bash
# 创建替换文件 passwords.txt
# 格式：每行一个密码（明文）
cat > passwords.txt << 'EOF'
MySecretPassword123
api_key_abc123xyz
database_password_456
EOF

# 使用 BFG 替换
java -jar bfg.jar --replace-text passwords.txt repo.git

# 所有这些密码会被替换为 ***REMOVED***
```

### 使用 git-filter-repo 的回调

```python
# 创建 filter.py
cat > filter.py << 'EOF'
#!/usr/bin/env python3
import re

def replace_secrets(blob):
    """替换文件中的敏感信息"""
    # 替换 API 密钥
    blob.data = re.sub(
        b'api_key = "[^"]+"',
        b'api_key = "REDACTED"',
        blob.data
    )
    # 替换密码
    blob.data = re.sub(
        b'password = "[^"]+"',
        b'password = "REDACTED"',
        blob.data
    )

# 使用
git filter-repo --blob-callback 'replace_secrets(blob)' --source filter.py
EOF
```

### 完整敏感数据清理流程

```bash
# === 步骤 1：识别敏感数据 ===
# 查找可能的敏感文件
git log --all --full-history -- "*.key" "*.pem" "*secret*" "*password*"

# === 步骤 2：备份 ===
cp -r repo repo-backup

# === 步骤 3：移除敏感文件 ===
git filter-repo --path credentials.json --invert-paths
git filter-repo --path .env --invert-paths

# === 步骤 4：清理 ===
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# === 步骤 5：强制推送 ===
git push origin --force --all

# === 步骤 6：撤销密钥 ===
# ⚠️ 重要！更改所有暴露的密码和密钥
# - 生成新的 API 密钥
# - 更改数据库密码
# - 重新生成 SSH 密钥
```

{{< hint danger >}}
**安全警告**：
一旦敏感数据被推送，就应该认为它已泄露！
1. 立即撤销所有暴露的密钥和密码
2. 从历史中删除只是防止进一步传播
3. 检查是否有人已经克隆了仓库
4. 考虑使用 GitHub 的密钥扫描功能
{{< /hint >}}

## 减小仓库体积

### 检查仓库大小

```bash
# 查看 .git 目录大小
du -sh .git

# 详细查看各部分大小
du -sh .git/*

# 使用 git count-objects
git count-objects -vH

# 输出示例
# count: 500
# size: 2.5 MiB
# in-pack: 1000
# packs: 1
# size-pack: 50 MiB
# prune-packable: 0
# garbage: 0
# size-garbage: 0 bytes
```

### 清理未引用的对象

```bash
# 清理未引用的对象
git reflog expire --expire=now --all
git gc --prune=now

# 更激进的清理
git gc --prune=now --aggressive

# 重新打包
git repack -a -d --depth=250 --window=250
```

### 浅克隆减小克隆体积

```bash
# 浅克隆（只获取最近的历史）
git clone --depth 1 https://github.com/user/repo.git

# 浅克隆指定深度
git clone --depth 50 https://github.com/user/repo.git

# 单分支克隆
git clone --single-branch --branch main https://github.com/user/repo.git

# 组合使用
git clone --depth 1 --single-branch --branch main https://github.com/user/repo.git
```

### 将浅克隆转换为完整克隆

```bash
# 获取所有历史
git fetch --unshallow

# 获取所有分支
git config remote.origin.fetch "+refs/heads/*:refs/remotes/origin/*"
git fetch origin
```

## git gc 和 git prune

### git gc（垃圾回收）

```bash
# 自动垃圾回收
git gc --auto

# 手动垃圾回收
git gc

# 激进式垃圾回收（慢但更彻底）
git gc --aggressive

# 立即修剪
git gc --prune=now

# 查看 gc 配置
git config --get gc.auto
git config --get gc.autopacklimit
```

### gc 配置

```bash
# 配置自动 gc
git config --global gc.auto 6700  # 松散对象数量阈值
git config --global gc.autopacklimit 50  # pack 文件数量阈值

# 配置修剪期限
git config --global gc.pruneExpire "2.weeks.ago"

# 禁用自动 gc（不推荐）
git config --global gc.auto 0
```

### git prune（修剪）

```bash
# 修剪未引用的对象
git prune

# 修剪所有未引用的对象
git prune --expire=now

# 查看将被修剪的对象
git prune --dry-run

# 修剪后验证
git fsck --full
```

### 完整优化流程

```bash
# 步骤 1：清理 reflog
git reflog expire --expire=now --all
git reflog expire --expire-unreachable=now --all

# 步骤 2：删除远程跟踪的已删除分支
git remote prune origin

# 步骤 3：修剪未引用的对象
git prune --expire=now

# 步骤 4：垃圾回收
git gc --aggressive --prune=now

# 步骤 5：重新打包
git repack -a -d -f --depth=250 --window=250

# 步骤 6：验证
git fsck --full
```

## BFG Repo-Cleaner 详解

### 安装和基本使用

```bash
# 下载 BFG
wget https://repo1.maven.org/maven2/com/madgag/bfg/1.14.0/bfg-1.14.0.jar
alias bfg='java -jar /path/to/bfg-1.14.0.jar'

# 基本语法
bfg [options] <repo>

# 注意：BFG 需要裸仓库
git clone --mirror git@github.com:user/repo.git
```

### 常用操作

```bash
# 删除大于指定大小的文件
bfg --strip-blobs-bigger-than 50M repo.git

# 删除特定文件
bfg --delete-files filename.txt repo.git

# 删除匹配模式的文件
bfg --delete-files '*.{mp4,avi}' repo.git

# 删除文件夹
bfg --delete-folders folder-name repo.git

# 替换文本
bfg --replace-text passwords.txt repo.git

# 只清理历史，保护 HEAD
bfg --no-blob-protection --delete-files secrets.yml repo.git
```

### BFG vs git filter-repo

| 特性 | BFG | git filter-repo |
|------|-----|----------------|
| 速度 | 非常快 | 快 |
| 易用性 | 简单 | 需要学习 |
| 功能 | 基础操作 | 强大，可定制 |
| 维护 | 较少更新 | 活跃维护 |
| 保护 HEAD | 默认保护 | 需要手动 |
| 推荐场景 | 简单清理 | 复杂重写 |

### 实战：使用 BFG 清理仓库

```bash
# 场景：移除所有 .log 文件和大于 10MB 的文件

# 步骤 1：克隆镜像
git clone --mirror https://github.com/user/repo.git
cd repo.git

# 步骤 2：运行 BFG
bfg --delete-files '*.log'
bfg --strip-blobs-bigger-than 10M

# 步骤 3：清理
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# 步骤 4：检查结果
git log --all --oneline --graph

# 步骤 5：推送
git push
```

## 最佳实践

### 1. 预防措施

```bash
# 使用 .gitignore 预防
cat >> .gitignore << 'EOF'
# 敏感文件
.env
.env.local
config/secrets.yml
*.key
*.pem

# 大文件
*.iso
*.dmg
*.zip
*.tar.gz
node_modules/
vendor/
EOF

# 使用 git-secrets 扫描
# https://github.com/awslabs/git-secrets
git secrets --install
git secrets --register-aws
```

### 2. 使用 Git LFS 管理大文件

```bash
# 安装 Git LFS
git lfs install

# 跟踪大文件类型
git lfs track "*.psd"
git lfs track "*.mp4"
git lfs track "*.zip"

# 添加 .gitattributes
git add .gitattributes

# 正常使用 Git
git add large-file.psd
git commit -m "Add design file"
git push
```

### 3. 定期清理

```bash
# 创建清理脚本
cat > cleanup.sh << 'EOF'
#!/bin/bash
echo "Cleaning up Git repository..."

# 清理远程已删除的分支
git fetch --prune

# 清理 reflog
git reflog expire --expire=30.days --all

# 运行垃圾回收
git gc --auto

# 显示结果
echo "Repository size:"
du -sh .git
EOF

chmod +x cleanup.sh

# 定期运行（如每月）
./cleanup.sh
```

### 4. 监控仓库大小

```bash
# 创建监控脚本
cat > check-size.sh << 'EOF'
#!/bin/bash

SIZE=$(du -sh .git | cut -f1)
echo "Repository size: $SIZE"

# 查找大文件
echo -e "\nLargest files:"
git rev-list --objects --all | \
  git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | \
  awk '/^blob/ {print substr($0,6)}' | \
  sort -k2 -n -r | \
  head -10 | \
  numfmt --field=2 --to=iec-i

# 检查包文件
echo -e "\nPack files:"
ls -lh .git/objects/pack/
EOF

chmod +x check-size.sh
./check-size.sh
```

---

## 💡 练习题

{{< expand "练习 1：清理大文件" >}}
**任务**：创建一个包含大文件的仓库，然后清理它

{{< expand "查看答案" >}}
```bash
# 1. 创建仓库
mkdir cleanup-practice
cd cleanup-practice
git init -b main

# 2. 添加正常文件
echo "Small file" > small.txt
git add small.txt
git commit -m "Add small file"

# 3. 添加大文件（模拟）
dd if=/dev/zero of=large.bin bs=1M count=10
git add large.bin
git commit -m "Add large file"

# 4. 添加更多提交
echo "Another file" > another.txt
git add another.txt
git commit -m "Add another file"

# 5. 删除大文件（但仍在历史中）
git rm large.bin
git commit -m "Remove large file"

# 6. 检查大小
du -sh .git
# ~10MB

# 7. 使用 filter-repo 清理
git filter-repo --path large.bin --invert-paths

# 8. 验证
du -sh .git
# 应该小于 1MB

git log --oneline
# 验证历史被重写
```
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 2：移除敏感数据" >}}
**场景**：不小心提交了包含密码的配置文件

{{< expand "查看答案" >}}
```bash
# 1. 创建仓库
git init -b main

# 2. 创建配置文件（包含密码）
cat > config.yml << 'EOF'
database:
  host: localhost
  user: admin
  password: SuperSecret123
EOF

git add config.yml
git commit -m "Add config"

# 3. 添加更多提交
echo "Other work" > work.txt
git add work.txt
git commit -m "Do some work"

# 4. 发现错误！
# 密码已经在历史中了

# 5. 移除敏感文件
git filter-repo --path config.yml --invert-paths

# 6. 创建正确的配置模板
cat > config.yml.template << 'EOF'
database:
  host: localhost
  user: admin
  password: YOUR_PASSWORD_HERE
EOF

git add config.yml.template
git commit -m "Add config template"

# 7. 添加到 .gitignore
echo "config.yml" >> .gitignore
git add .gitignore
git commit -m "Ignore config.yml"

# 8. 重要：更改密码！
echo "⚠️ Remember to change the password SuperSecret123!"
```
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 3：优化仓库大小" >}}
**任务**：使用各种技术优化仓库大小

{{< expand "查看答案" >}}
```bash
# 1. 创建测试仓库
git init -b main

# 创建多个提交
for i in {1..100}; do
  echo "Content $i" > file$i.txt
  git add file$i.txt
  git commit -m "Add file $i"
done

# 2. 检查初始大小
echo "Initial size:"
git count-objects -vH

# 3. 创建一些分支
git checkout -b feature1
echo "Feature 1" > feature1.txt
git add feature1.txt
git commit -m "Feature 1"

git checkout main
git checkout -b feature2
echo "Feature 2" > feature2.txt
git add feature2.txt
git commit -m "Feature 2"

git checkout main

# 4. 删除分支
git branch -D feature1 feature2

# 5. 清理 reflog
git reflog expire --expire=now --all

# 6. 修剪未引用对象
git prune --expire=now

# 7. 垃圾回收
git gc --aggressive --prune=now

# 8. 检查优化后的大小
echo "After optimization:"
git count-objects -vH

# 9. 比较
echo "Size difference:"
# 应该看到显著减少
```
{{< /expand >}}
{{< /expand >}}

---

{{< hint success >}}
**检查清单** - 完成本节后，你应该能够：

- [ ] 查找仓库中的大文件
- [ ] 使用 git filter-repo 清理大文件
- [ ] 使用 BFG Repo-Cleaner 快速清理
- [ ] 从历史中移除敏感数据
- [ ] 理解 git gc 和 git prune
- [ ] 优化仓库大小
- [ ] 配置 Git LFS 管理大文件
- [ ] 实施预防措施避免提交敏感数据
{{< /hint >}}

{{< hint danger >}}
**重要提醒**：
- 清理操作会重写历史
- 务必在操作前备份
- 通知所有团队成员
- 考虑让所有人重新克隆仓库
- 记得撤销暴露的密钥和密码
{{< /hint >}}
