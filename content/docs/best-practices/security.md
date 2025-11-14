---
title: "安全实践"
weight: 5
prev: /docs/best-practices/team-workflow
next: /docs/best-practices/ci-cd
---

# 安全实践

Git 仓库中的安全问题可能导致严重后果，包括敏感信息泄露、账户被盗等。本节介绍如何保护你的 Git 仓库和代码安全。

## 避免敏感信息泄露

### 常见敏感信息

以下信息**绝不应该**提交到 Git 仓库：

```bash
# ❌ 危险：不要提交这些内容
.env                    # 环境变量（API 密钥、密码等）
config/database.yml     # 数据库凭证
.aws/credentials        # AWS 访问密钥
.ssh/id_rsa            # SSH 私钥
*.pem                  # SSL 证书私钥
secrets.json           # 密钥配置文件
.npmrc                 # npm 认证令牌
```

### 检查已提交的内容

```bash
# 查看所有提交的文件
git log --all --full-history --pretty=format: --name-only -- .env

# 搜索可能的密钥
git grep -i "password\|api_key\|secret\|token" $(git rev-list --all)

# 查找特定文件的历史
git log --all --full-history -- "*secret*"
```

### 使用环境变量

```javascript
// ❌ 不好：硬编码密钥
const API_KEY = 'sk_live_abc123xyz789';
const db = {
  host: 'localhost',
  username: 'admin',
  password: 'super_secret_password'
};

// ✅ 好：使用环境变量
const API_KEY = process.env.API_KEY;
const db = {
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD
};
```

### 使用配置模板

```bash
# 提交配置模板而不是实际配置
# .env.example (提交到 Git)
API_KEY=your_api_key_here
DB_HOST=localhost
DB_USERNAME=your_username
DB_PASSWORD=your_password

# .env (不提交到 Git，在 .gitignore 中)
API_KEY=sk_live_abc123xyz789
DB_HOST=prod.database.com
DB_USERNAME=admin
DB_PASSWORD=actual_password
```

**设置说明文档**：

```markdown
# 配置说明

## 环境变量设置

1. 复制 `.env.example` 为 `.env`
   ```bash
   cp .env.example .env
   ```

2. 编辑 `.env` 文件，填入实际的配置信息：
   - `API_KEY`: 从管理后台获取
   - `DB_HOST`: 数据库主机地址
   - `DB_USERNAME`: 数据库用户名
   - `DB_PASSWORD`: 数据库密码

3. 确保 `.env` 在 `.gitignore` 中
```

### 分离敏感配置

```javascript
// config/default.js (可以提交)
module.exports = {
  app: {
    port: 3000,
    name: 'MyApp'
  },
  features: {
    enableAnalytics: true
  }
};

// config/secrets.js (不提交)
module.exports = {
  apiKeys: {
    stripe: process.env.STRIPE_KEY,
    sendgrid: process.env.SENDGRID_KEY
  },
  database: {
    url: process.env.DATABASE_URL
  }
};

// config/index.js
const defaultConfig = require('./default');
const secrets = require('./secrets');

module.exports = {
  ...defaultConfig,
  ...secrets
};
```

## .gitignore 最佳实践

### 基本规则

```gitignore
# .gitignore

# 环境变量和密钥
.env
.env.local
.env.*.local
*.key
*.pem
secrets.json

# 依赖目录
node_modules/
vendor/
venv/
.virtualenv/

# 构建产物
dist/
build/
*.min.js
*.min.css

# 日志文件
*.log
logs/
npm-debug.log*

# 操作系统文件
.DS_Store
Thumbs.db
desktop.ini

# IDE 配置
.vscode/
.idea/
*.swp
*.swo
*~

# 临时文件
tmp/
temp/
*.tmp
*.cache

# 数据库文件
*.sqlite
*.db

# 测试覆盖率报告
coverage/
.nyc_output/
```

### 项目特定的 .gitignore

```gitignore
# Node.js 项目
node_modules/
npm-debug.log
yarn-error.log
.env
.env.local

# Python 项目
__pycache__/
*.py[cod]
*$py.class
.venv/
venv/
*.egg-info/

# Java 项目
target/
*.class
*.jar
*.war

# Ruby 项目
*.gem
.bundle/
vendor/bundle/

# Go 项目
*.exe
*.test
vendor/
```

### 全局 .gitignore

```bash
# 创建全局 .gitignore
cat > ~/.gitignore_global << 'EOF'
# 操作系统
.DS_Store
Thumbs.db

# 编辑器
.vscode/
.idea/
*.swp

# 临时文件
*.tmp
*~
EOF

# 配置 Git 使用全局 .gitignore
git config --global core.excludesfile ~/.gitignore_global
```

### 检查 .gitignore 是否生效

```bash
# 检查文件是否被忽略
git check-ignore -v .env
# 输出: .gitignore:1:.env    .env

# 查看所有被忽略的文件
git status --ignored

# 调试 .gitignore 规则
git check-ignore -v path/to/file
```

### .gitignore 陷阱

```bash
# ❌ 错误：文件已被跟踪，添加到 .gitignore 无效
# 如果文件已经被 git add，需要先移除跟踪
git rm --cached .env

# ❌ 错误：规则写错
# 错误的规则
node_modules  # 不会匹配子目录中的 node_modules

# 正确的规则
node_modules/  # 匹配所有 node_modules 目录
**/node_modules/  # 显式匹配所有层级

# ✅ 例外规则
# 忽略所有 .log 文件，但保留 important.log
*.log
!important.log
```

## 清理历史中的敏感数据

### 使用 git filter-branch（不推荐）

⚠️ **警告**：这个方法已过时，推荐使用 BFG Repo-Cleaner。

```bash
# 从历史中删除文件
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch path/to/secret.key" \
  --prune-empty --tag-name-filter cat -- --all

# 清理和压缩仓库
rm -rf .git/refs/original/
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# 强制推送
git push origin --force --all
git push origin --force --tags
```

### 使用 BFG Repo-Cleaner（推荐）

BFG 比 `git filter-branch` 更快更简单。

#### 安装 BFG

```bash
# macOS
brew install bfg

# 或下载 jar 文件
wget https://repo1.maven.org/maven2/com/madgag/bfg/1.14.0/bfg-1.14.0.jar
```

#### 删除特定文件

```bash
# 备份仓库
git clone --mirror git@github.com:user/repo.git repo-backup.git

# 删除文件（保留 HEAD 中的版本）
bfg --delete-files secret.key repo.git

# 或删除所有历史中的版本（包括 HEAD）
bfg --delete-files secret.key --no-blob-protection repo.git

# 清理仓库
cd repo.git
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# 推送更改
git push --force
```

#### 替换密钥文本

```bash
# 创建替换文件 passwords.txt
# 列出所有需要替换的密码
sk_live_abc123xyz789
super_secret_password
another_api_key

# 执行替换
bfg --replace-text passwords.txt repo.git

# 清理和推送
cd repo.git
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push --force
```

#### 删除大文件

```bash
# 删除大于 100M 的文件
bfg --strip-blobs-bigger-than 100M repo.git

# 删除最大的 100 个文件
bfg --strip-biggest-blobs 100 repo.git
```

### 使用 git-secrets

预防敏感信息提交。

#### 安装和配置

```bash
# macOS
brew install git-secrets

# Ubuntu
git clone https://github.com/awslabs/git-secrets.git
cd git-secrets
sudo make install

# 在项目中启用
git secrets --install

# 注册 AWS 密钥检测规则
git secrets --register-aws

# 添加自定义规则
git secrets --add 'password\s*=\s*.+'
git secrets --add 'api[_-]?key\s*=\s*.+'
git secrets --add --allowed 'password_hash'  # 允许的例外
```

#### 扫描现有仓库

```bash
# 扫描当前提交
git secrets --scan

# 扫描整个历史
git secrets --scan-history

# 扫描所有分支
git secrets --scan-history --all
```

#### 配置全局规则

```bash
# 全局安装
git secrets --install ~/.git-templates/git-secrets
git config --global init.templateDir ~/.git-templates/git-secrets

# 添加全局规则
git secrets --add --global 'password\s*=\s*.+'
git secrets --add --global 'api[_-]?key\s*=\s*.+'
git secrets --add --global 'secret\s*=\s*.+'
```

### 泄露后的应对

如果不小心泄露了敏感信息：

```markdown
# 敏感信息泄露应对清单

## 立即行动
1. [ ] 撤销/更改泄露的密钥
   - API 密钥：在服务商后台撤销
   - 密码：立即更改
   - SSH 密钥：删除并生成新密钥
   - Token：撤销并重新生成

2. [ ] 清理 Git 历史
   - 使用 BFG 或 git filter-branch
   - 强制推送到所有远程仓库

3. [ ] 通知相关人员
   - 团队成员
   - 安全团队
   - 受影响的服务提供商

## 后续措施
4. [ ] 检查是否有未授权访问
   - 查看 API 使用日志
   - 检查数据库访问记录
   - 审查系统日志

5. [ ] 更新所有副本
   - 通知团队成员重新克隆仓库
   - 更新 CI/CD 系统的仓库

6. [ ] 改进流程
   - 添加 git-secrets
   - 更新 .gitignore
   - 加强代码审查

## 预防措施
7. [ ] 设置自动检测
   - 配置 git-secrets
   - 启用 GitHub Secret Scanning
   - 使用 CI/CD 检查工具
```

## SSH 密钥管理

### 生成 SSH 密钥

```bash
# 生成新的 SSH 密钥（推荐使用 Ed25519）
ssh-keygen -t ed25519 -C "your_email@example.com"

# 如果系统不支持 Ed25519，使用 RSA
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

# 设置密钥文件位置和密码
Enter file in which to save the key (/home/user/.ssh/id_ed25519):
Enter passphrase (empty for no passphrase): [输入密码]
Enter same passphrase again: [再次输入密码]
```

### 使用 SSH Agent

```bash
# 启动 ssh-agent
eval "$(ssh-agent -s)"

# 添加 SSH 密钥
ssh-add ~/.ssh/id_ed25519

# 列出已添加的密钥
ssh-add -l

# 删除所有密钥
ssh-add -D
```

### 配置 SSH

```bash
# ~/.ssh/config
# GitHub
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_github
  IdentitiesOnly yes

# GitLab
Host gitlab.com
  HostName gitlab.com
  User git
  IdentityFile ~/.ssh/id_ed25519_gitlab
  IdentitiesOnly yes

# 公司 Git 服务器
Host git.company.com
  HostName git.company.com
  User git
  IdentityFile ~/.ssh/id_ed25519_work
  Port 2222
```

### 测试 SSH 连接

```bash
# 测试 GitHub 连接
ssh -T git@github.com
# 输出: Hi username! You've successfully authenticated...

# 测试 GitLab 连接
ssh -T git@gitlab.com

# 调试连接问题
ssh -vT git@github.com
```

### 密钥轮换

```bash
# 定期更换 SSH 密钥（建议每年一次）

# 1. 生成新密钥
ssh-keygen -t ed25519 -C "your_email@example.com" -f ~/.ssh/id_ed25519_new

# 2. 添加新密钥到服务
# 在 GitHub/GitLab 上添加新的公钥

# 3. 测试新密钥
ssh -i ~/.ssh/id_ed25519_new -T git@github.com

# 4. 更新配置
mv ~/.ssh/id_ed25519 ~/.ssh/id_ed25519_old
mv ~/.ssh/id_ed25519_new ~/.ssh/id_ed25519

# 5. 删除旧密钥
# 在 GitHub/GitLab 上删除旧的公钥
rm ~/.ssh/id_ed25519_old
```

### SSH 安全最佳实践

```bash
# 1. 始终使用密码保护私钥
# ✅ 有密码
ssh-keygen -t ed25519 -C "email@example.com"
Enter passphrase: [输入强密码]

# ❌ 无密码（不安全）
ssh-keygen -t ed25519 -C "email@example.com" -N ""

# 2. 设置正确的文件权限
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_ed25519
chmod 644 ~/.ssh/id_ed25519.pub

# 3. 不同服务使用不同密钥
~/.ssh/id_ed25519_github
~/.ssh/id_ed25519_gitlab
~/.ssh/id_ed25519_work

# 4. 定期审查授权密钥
# 在 GitHub/GitLab 上检查并删除不使用的密钥
```

## 签名提交（GPG）

使用 GPG 签名提交可以证明提交确实来自你。

### 生成 GPG 密钥

```bash
# 生成 GPG 密钥
gpg --full-generate-key

# 选择密钥类型
# (1) RSA and RSA (推荐)

# 选择密钥长度
# 4096 (推荐)

# 密钥有效期
# 2y (2 年，推荐设置有效期)

# 输入用户信息
Real name: Your Name
Email address: your_email@example.com
Comment: Git signing key

# 设置密码
```

### 配置 Git 使用 GPG

```bash
# 列出 GPG 密钥
gpg --list-secret-keys --keyid-format=long

# 输出示例：
# sec   rsa4096/ABC123DEF456 2024-01-01 [SC] [expires: 2026-01-01]
#       1234567890ABCDEF1234567890ABCDEF12345678
# uid                 [ultimate] Your Name <your_email@example.com>

# 获取密钥 ID（ABC123DEF456）

# 配置 Git 使用该密钥
git config --global user.signingkey ABC123DEF456

# 配置自动签名所有提交
git config --global commit.gpgsign true

# 配置自动签名所有标签
git config --global tag.gpgsign true
```

### 导出公钥

```bash
# 导出公钥
gpg --armor --export ABC123DEF456

# 复制输出的公钥，添加到 GitHub/GitLab
# Settings → SSH and GPG keys → New GPG key
```

### 签名提交和标签

```bash
# 签名提交
git commit -S -m "feat: 添加新功能"

# 签名标签
git tag -s v1.0.0 -m "Release version 1.0.0"

# 验证签名
git log --show-signature
git verify-commit HEAD
git verify-tag v1.0.0
```

### GPG 配置（macOS）

```bash
# 安装 GPG
brew install gnupg pinentry-mac

# 配置 GPG agent
echo "pinentry-program /usr/local/bin/pinentry-mac" >> ~/.gnupg/gpg-agent.conf

# 重启 GPG agent
gpgconf --kill gpg-agent

# 配置 Git 使用 GPG
git config --global gpg.program gpg
```

### GPG 最佳实践

```bash
# 1. 备份 GPG 密钥
gpg --export-secret-keys ABC123DEF456 > private-key-backup.asc
# 安全存储此文件（加密的 USB、密码管理器等）

# 2. 设置密钥有效期
# 生成密钥时设置 2-3 年有效期
# 到期前可以延长有效期

# 3. 生成撤销证书
gpg --output revoke.asc --gen-revoke ABC123DEF456
# 安全存储撤销证书

# 4. 定期备份
# 定期导出和备份密钥

# 5. 多设备同步
# 将密钥导入到所有开发机器
gpg --import private-key-backup.asc
```

## GitHub 安全功能

### Secret Scanning

GitHub 自动扫描提交中的密钥。

```bash
# 启用 Secret Scanning
# Settings → Security & analysis → Secret scanning

# 如果检测到密钥，GitHub 会：
# 1. 发送警报通知仓库管理员
# 2. 通知服务提供商（如 AWS、Stripe）
# 3. 在安全标签中显示警报
```

### Dependabot

自动检测依赖中的安全漏洞。

```yaml
# .github/dependabot.yml
version: 2
updates:
  # npm 依赖
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    # 自动创建 PR 更新有漏洞的依赖
    open-pull-requests-limit: 10

  # GitHub Actions
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
```

### 代码扫描（Code Scanning）

使用 CodeQL 自动分析代码安全问题。

```yaml
# .github/workflows/codeql-analysis.yml
name: "CodeQL"

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 0 * * 1'  # 每周一运行

jobs:
  analyze:
    runs-on: ubuntu-latest
    permissions:
      security-events: write

    steps:
      - uses: actions/checkout@v3

      - uses: github/codeql-action/init@v2
        with:
          languages: javascript, python

      - uses: github/codeql-action/autobuild@v2

      - uses: github/codeql-action/analyze@v2
```

### 分支保护规则

```markdown
# 分支保护配置

Settings → Branches → Branch protection rules

## 必需配置
- [x] Require pull request reviews before merging
  - Required approving reviews: 1
  - Dismiss stale reviews
- [x] Require status checks to pass before merging
  - Require branches to be up to date
  - Status checks: tests, lint, security-scan
- [x] Require signed commits
- [x] Include administrators
- [x] Restrict who can push to matching branches

## 可选配置
- [x] Require linear history
- [x] Require deployments to succeed before merging
```

## 安全检查清单

### 新项目设置

```markdown
# 新项目安全设置清单

## 仓库配置
- [ ] 创建 .gitignore（包含所有敏感文件模式）
- [ ] 配置 .gitattributes
- [ ] 创建 .env.example 模板
- [ ] 添加 README 安全说明
- [ ] 设置分支保护规则

## Git 配置
- [ ] 配置提交签名
- [ ] 安装 git-secrets
- [ ] 配置 commit 模板

## CI/CD
- [ ] 添加安全扫描工作流
- [ ] 配置 Dependabot
- [ ] 设置 Secret Scanning
- [ ] 添加 code quality 检查

## 团队培训
- [ ] 分享安全最佳实践文档
- [ ] 进行安全培训
- [ ] 建立应急响应流程
```

### 日常检查

```bash
#!/bin/bash
# security-check.sh - 每周运行一次

echo "🔍 检查敏感信息..."
git secrets --scan-history

echo "🔍 检查大文件..."
git rev-list --objects --all | \
  git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | \
  awk '/^blob/ {print $3, $4}' | \
  sort -nr | \
  head -20

echo "🔍 检查未加密的密钥..."
find . -type f -name "*.key" -o -name "*.pem" -o -name ".env" | \
  grep -v ".gitignore"

echo "🔍 检查 Git 配置..."
git config --list | grep -i "user\|email\|signing"

echo "✅ 安全检查完成"
```

## 练习题

### 练习 1：识别安全问题

指出以下代码的安全问题：

```javascript
// config.js
module.exports = {
  database: {
    host: 'db.example.com',
    user: 'admin',
    password: 'MySecretPassword123!'
  },
  apiKeys: {
    stripe: 'sk_live_abc123xyz789',
    sendgrid: 'SG.abc123xyz789'
  }
};
```

<details>
<summary>查看答案</summary>

**安全问题**：

1. ❌ 数据库密码硬编码
2. ❌ API 密钥硬编码
3. ❌ 敏感配置直接暴露在代码中

**正确做法**：

```javascript
// config.js - 提交到 Git
module.exports = {
  database: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  },
  apiKeys: {
    stripe: process.env.STRIPE_KEY,
    sendgrid: process.env.SENDGRID_KEY
  }
};

// .env - 不提交到 Git（在 .gitignore 中）
DB_HOST=db.example.com
DB_USER=admin
DB_PASSWORD=MySecretPassword123!
STRIPE_KEY=sk_live_abc123xyz789
SENDGRID_KEY=SG.abc123xyz789

// .env.example - 提交到 Git
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
STRIPE_KEY=your_stripe_key
SENDGRID_KEY=your_sendgrid_key
```

</details>

### 练习 2：配置 .gitignore

为一个 Node.js + Python 混合项目创建 .gitignore。

<details>
<summary>查看答案</summary>

```gitignore
# .gitignore

# ============================================
# 敏感信息和密钥
# ============================================
.env
.env.local
.env.*.local
*.key
*.pem
secrets.json
config/secrets.js

# ============================================
# Node.js
# ============================================
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.npm
.yarn-integrity
package-lock.json  # 如果使用 yarn
yarn.lock          # 如果使用 npm

# ============================================
# Python
# ============================================
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
venv/
.venv/
ENV/
env/
*.egg-info/
dist/
build/
*.egg

# ============================================
# 构建产物
# ============================================
dist/
build/
out/
*.min.js
*.min.css

# ============================================
# 日志和数据库
# ============================================
*.log
logs/
*.sqlite
*.db

# ============================================
# 测试和覆盖率
# ============================================
coverage/
.nyc_output/
.pytest_cache/
htmlcov/
.coverage

# ============================================
# IDE 和编辑器
# ============================================
.vscode/
.idea/
*.swp
*.swo
*~
.DS_Store

# ============================================
# 临时文件
# ============================================
tmp/
temp/
*.tmp
*.cache
```

</details>

### 练习 3：清理敏感信息

你不小心提交了包含 API 密钥的 `.env` 文件，需要从历史中彻底删除。

<details>
<summary>查看答案</summary>

```bash
# 方法 1：使用 BFG Repo-Cleaner（推荐）

# 1. 创建镜像克隆
git clone --mirror https://github.com/user/repo.git

# 2. 使用 BFG 删除文件
bfg --delete-files .env repo.git

# 3. 清理仓库
cd repo.git
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# 4. 强制推送
git push --force

# 方法 2：使用 git filter-repo（现代方法）

# 1. 安装 git filter-repo
pip install git-filter-repo

# 2. 删除文件
git filter-repo --path .env --invert-paths

# 3. 强制推送
git push origin --force --all

# 重要后续步骤：

# 1. 立即撤销泄露的 API 密钥
# 在服务提供商后台撤销旧密钥，生成新密钥

# 2. 更新 .gitignore
echo ".env" >> .gitignore
git add .gitignore
git commit -m "chore: 添加 .env 到 .gitignore"

# 3. 通知团队成员
# 团队成员需要重新克隆仓库或执行：
git fetch origin
git reset --hard origin/main

# 4. 创建 .env.example
cat > .env.example << 'EOF'
API_KEY=your_api_key_here
DB_PASSWORD=your_password_here
EOF

git add .env.example
git commit -m "docs: 添加环境变量模板"
git push
```

</details>

### 练习 4：配置 GPG 签名

在新机器上配置 GPG 提交签名。

<details>
<summary>查看答案</summary>

```bash
# 1. 安装 GPG
# macOS
brew install gnupg

# Ubuntu/Debian
sudo apt-get install gnupg

# 2. 生成 GPG 密钥
gpg --full-generate-key

# 选择：
# - 类型: (1) RSA and RSA
# - 长度: 4096
# - 有效期: 2y
# - 姓名: Your Name
# - 邮箱: your_email@example.com

# 3. 列出密钥并获取 ID
gpg --list-secret-keys --keyid-format=long

# 输出:
# sec   rsa4096/ABC123DEF456 ...
# 密钥 ID 是 ABC123DEF456

# 4. 配置 Git
git config --global user.signingkey ABC123DEF456
git config --global commit.gpgsign true
git config --global tag.gpgsign true

# 5. 导出公钥
gpg --armor --export ABC123DEF456 > public-key.asc

# 6. 添加到 GitHub
# 复制 public-key.asc 的内容
# GitHub → Settings → SSH and GPG keys → New GPG key

# 7. 测试签名
git commit --allow-empty -S -m "test: 测试 GPG 签名"
git log --show-signature

# 8. macOS 额外配置
brew install pinentry-mac
echo "pinentry-program /usr/local/bin/pinentry-mac" >> ~/.gnupg/gpg-agent.conf
gpgconf --kill gpg-agent

# 9. 备份密钥
gpg --export-secret-keys ABC123DEF456 > private-key-backup.asc
# 安全存储此文件！

# 10. 生成撤销证书
gpg --output revoke.asc --gen-revoke ABC123DEF456
# 安全存储撤销证书！
```

</details>

## 延伸阅读

- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Git Secrets Tool](https://github.com/awslabs/git-secrets)
- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)
- [GPG and Git](https://docs.github.com/en/authentication/managing-commit-signature-verification)

## 总结

- ✅ 永远不要提交敏感信息
- ✅ 使用 .gitignore 和环境变量
- ✅ 定期审查安全配置
- ✅ 使用 SSH 密钥和 GPG 签名
- ✅ 启用自动化安全扫描
- ✅ 制定泄露应急预案

下一节：[持续集成](../ci-cd) →
