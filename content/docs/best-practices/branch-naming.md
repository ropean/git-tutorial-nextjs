---
title: "分支命名"
weight: 2
prev: /docs/best-practices/commit-messages
next: /docs/best-practices/code-review
---

# 分支命名

规范的分支命名能够让团队成员快速理解分支的用途，提高协作效率。

## 为什么需要分支命名规范

### 提升可读性

```bash
# ❌ 不好的分支名
git checkout -b test
git checkout -b fix
git checkout -b my-branch
git checkout -b branch1

# ✅ 好的分支名
git checkout -b feat/user-authentication
git checkout -b fix/login-error
git checkout -b refactor/payment-service
git checkout -b hotfix/security-patch
```

### 便于自动化

规范的分支名可以配合 CI/CD 实现：
- 自动部署到对应环境
- 根据分支类型运行不同的测试
- 自动创建预览环境
- 分支保护规则

### 团队协作

- 快速识别分支用途
- 了解谁在负责什么功能
- 避免分支命名冲突
- 方便分支管理和清理

## 常见分支类型

### 主要分支

这些分支通常是长期存在的：

#### main/master

```bash
# 主分支：生产环境代码
main
master
```

- 始终保持可部署状态
- 所有功能开发完成后合并到此分支
- 通常受保护，不允许直接推送

#### develop

```bash
# 开发分支：集成分支
develop
dev
```

- 最新的开发代码
- 功能分支的基础分支
- 测试通过后合并到 main

### 临时分支

这些分支在完成任务后应该删除：

#### feature/* - 功能分支

```bash
# 格式：feature/<描述>
feature/user-login
feature/payment-integration
feature/email-notification

# 带 Issue 编号
feature/123-user-profile
feature/456-shopping-cart

# 多级分类
feature/auth/oauth2
feature/payment/alipay
feature/ui/responsive-design
```

**使用场景**：
- 开发新功能
- 从 develop 分支创建
- 完成后合并回 develop

```bash
# 创建功能分支
git checkout develop
git checkout -b feature/user-dashboard

# 开发完成后合并
git checkout develop
git merge feature/user-dashboard
git branch -d feature/user-dashboard
```

#### bugfix/* - Bug 修复分支

```bash
# 格式：bugfix/<描述>
bugfix/login-validation
bugfix/payment-error
bugfix/memory-leak

# 带 Issue 编号
bugfix/789-cart-calculation
```

**使用场景**：
- 修复开发环境中的 bug
- 从 develop 分支创建
- 完成后合并回 develop

#### hotfix/* - 紧急修复分支

```bash
# 格式：hotfix/<描述>
hotfix/security-vulnerability
hotfix/critical-payment-bug
hotfix/1.2.3

# 带版本号
hotfix/v1.2.3
hotfix/2023-11-14-urgent-fix
```

**使用场景**：
- 修复生产环境的紧急问题
- 从 main 分支创建
- 完成后合并到 main 和 develop

```bash
# 创建热修复分支
git checkout main
git checkout -b hotfix/security-patch

# 修复完成后
git checkout main
git merge hotfix/security-patch
git tag -a v1.2.3 -m "Security patch"

git checkout develop
git merge hotfix/security-patch

git branch -d hotfix/security-patch
```

#### release/* - 发布分支

```bash
# 格式：release/<版本号>
release/1.0.0
release/2.1.0
release/v1.5.0-beta
```

**使用场景**：
- 准备新版本发布
- 从 develop 分支创建
- 只允许 bug 修复和发布准备工作
- 完成后合并到 main 和 develop

```bash
# 创建发布分支
git checkout develop
git checkout -b release/2.0.0

# 进行发布准备（版本号更新、文档等）
# 完成后合并
git checkout main
git merge release/2.0.0
git tag -a v2.0.0 -m "Release version 2.0.0"

git checkout develop
git merge release/2.0.0

git branch -d release/2.0.0
```

#### refactor/* - 重构分支

```bash
# 格式：refactor/<描述>
refactor/user-service
refactor/database-layer
refactor/api-structure
```

#### test/* - 测试分支

```bash
# 格式：test/<描述>
test/integration-tests
test/e2e-automation
```

#### docs/* - 文档分支

```bash
# 格式：docs/<描述>
docs/api-documentation
docs/user-guide
docs/readme-update
```

## 分支命名最佳实践

### 1. 使用小写字母和连字符

```bash
# ✅ 推荐
feature/user-authentication
bugfix/login-error

# ❌ 不推荐
Feature/UserAuthentication  # 大写
feature/user_authentication # 下划线
feature/user authentication # 空格（会导致错误）
```

### 2. 使用描述性名称

```bash
# ✅ 推荐：清晰描述分支用途
feature/add-password-reset
bugfix/fix-cart-total-calculation
refactor/improve-database-queries

# ❌ 不推荐：名称不明确
feature/update
bugfix/fix
feature/new-stuff
```

### 3. 包含 Issue 或 Ticket 编号

```bash
# Jira ticket
feature/PROJ-123-user-login
bugfix/PROJ-456-payment-error

# GitHub Issue
feature/123-oauth-integration
bugfix/456-memory-leak

# 编号在前
feature/123-user-dashboard
# 或编号在后
feature/user-dashboard-123
```

### 4. 避免过长的名称

```bash
# ✅ 推荐：简洁明了
feature/oauth-login

# ❌ 不推荐：过长
feature/implement-oauth-login-functionality-with-google-and-facebook-support
```

一般建议：
- 总长度不超过 50 个字符
- 使用缩写时保证团队能理解
- 必要时使用多级分类而不是加长名称

### 5. 包含用户名（多人协作）

```bash
# 格式：<type>/<user>/<description>
feature/alice/user-profile
feature/bob/payment-integration
bugfix/charlie/login-fix

# 或使用短的用户标识
feature/alice-user-profile
bugfix/bob-cart-error
```

### 6. 使用日期（临时实验分支）

```bash
# 格式：<type>/<date>-<description>
experiment/2024-11-14-new-algorithm
spike/2024-11-performance-test
poc/2024-11-microservices
```

### 7. 避免使用特殊字符

```bash
# ✅ 允许的字符
feature/user-login        # 连字符
feature/v1.2.3           # 点号
feature/user/profile     # 斜杠

# ❌ 避免的字符
feature/user@login       # @
feature/user#123         # #（在 URL 中有特殊含义）
feature/user login       # 空格
feature/user\login       # 反斜杠
```

## 分支命名模式

### Git Flow 命名模式

```bash
# 主分支
main
develop

# 功能分支
feature/feature-name
feature/123-feature-name

# 发布分支
release/1.0.0
release/1.1.0-beta

# 热修复分支
hotfix/critical-bug
hotfix/1.0.1

# 支持分支（可选）
support/1.x
support/legacy-version
```

### GitHub Flow 命名模式

```bash
# 主分支
main

# 所有功能和修复分支
feature/user-authentication
fix/login-error
docs/update-readme
refactor/user-service
```

### GitLab Flow 命名模式

```bash
# 主分支
main

# 环境分支
production
staging
development

# 功能分支
feature/new-feature
fix/bug-fix
```

### 自定义团队模式

```bash
# 格式：<type>/<team>/<description>
feature/backend/api-endpoints
feature/frontend/user-interface
bugfix/mobile/ios-crash
bugfix/web/responsive-layout

# 格式：<type>/<project>/<description>
feature/mobile-app/push-notifications
feature/web-app/dark-mode
```

## 团队约定

### 1. 创建分支命名文档

```markdown
# 分支命名规范

## 分支类型

### 主分支
- `main`: 生产环境代码
- `develop`: 开发环境代码

### 功能开发
- `feature/<issue>-<description>`: 新功能
- 示例: `feature/123-user-login`

### Bug 修复
- `bugfix/<issue>-<description>`: Bug 修复
- 示例: `bugfix/456-payment-error`

### 紧急修复
- `hotfix/<version>`: 生产环境紧急修复
- 示例: `hotfix/1.2.3`

## 命名规则

1. 使用小写字母
2. 使用连字符分隔单词
3. 必须包含 Jira Issue 编号
4. 描述要简洁明了
5. 长度不超过 50 个字符

## 示例

✅ 正确:
- `feature/PROJ-123-oauth-login`
- `bugfix/PROJ-456-cart-calculation`
- `hotfix/1.2.3`

❌ 错误:
- `Feature/NewLogin` (大写)
- `fix-bug` (缺少类型前缀)
- `feature/add-new-feature-for-user-authentication-with-oauth` (太长)
```

### 2. 配置分支保护规则

```bash
# GitHub 保护规则设置
# Settings -> Branches -> Branch protection rules

# 保护 main 分支
- Require pull request reviews
- Require status checks to pass
- Require branches to be up to date
- Include administrators
```

### 3. 使用分支命名检查工具

创建 Git hook 检查分支名称：

```bash
# .git/hooks/pre-push
#!/bin/bash

BRANCH=$(git rev-parse --abbrev-ref HEAD)
VALID_BRANCH_REGEX="^(feature|bugfix|hotfix|release|refactor|test|docs)\/[a-z0-9._-]+$"

if ! [[ $BRANCH =~ $VALID_BRANCH_REGEX ]]; then
    echo "❌ 分支名称不符合规范: $BRANCH"
    echo "✅ 正确格式: <type>/<description>"
    echo "   类型: feature, bugfix, hotfix, release, refactor, test, docs"
    echo "   示例: feature/user-login"
    exit 1
fi
```

### 4. 自动化分支管理

```yaml
# .github/workflows/branch-cleanup.yml
name: Clean up merged branches

on:
  pull_request:
    types: [closed]

jobs:
  delete-branch:
    runs-on: ubuntu-latest
    if: github.event.pull_request.merged == true
    steps:
      - name: Delete merged branch
        uses: actions/github-script@v6
        with:
          script: |
            github.rest.git.deleteRef({
              owner: context.repo.owner,
              repo: context.repo.repo,
              ref: `heads/${context.payload.pull_request.head.ref}`
            })
```

## 实战场景

### 场景 1：开始新功能开发

```bash
# 1. 更新 develop 分支
git checkout develop
git pull origin develop

# 2. 创建功能分支
git checkout -b feature/PROJ-123-user-profile

# 3. 开发和提交
git add .
git commit -m "feat: 添加用户个人资料页面"

# 4. 推送到远程
git push -u origin feature/PROJ-123-user-profile

# 5. 创建 Pull Request
# 在 GitHub/GitLab 上创建 PR，目标分支为 develop
```

### 场景 2：紧急修复生产 Bug

```bash
# 1. 从 main 分支创建热修复分支
git checkout main
git pull origin main
git checkout -b hotfix/payment-timeout

# 2. 修复问题
# ... 编辑代码 ...
git add .
git commit -m "fix: 修复支付超时问题"

# 3. 合并到 main
git checkout main
git merge hotfix/payment-timeout
git tag -a v1.2.3 -m "Hotfix: 修复支付超时"
git push origin main --tags

# 4. 合并到 develop
git checkout develop
git merge hotfix/payment-timeout
git push origin develop

# 5. 删除热修复分支
git branch -d hotfix/payment-timeout
git push origin --delete hotfix/payment-timeout
```

### 场景 3：准备版本发布

```bash
# 1. 从 develop 创建发布分支
git checkout develop
git pull origin develop
git checkout -b release/2.0.0

# 2. 更新版本号和文档
# 编辑 package.json、CHANGELOG.md 等
git add .
git commit -m "chore: 准备 2.0.0 版本发布"

# 3. 测试发布分支
# 运行完整的测试套件

# 4. 合并到 main
git checkout main
git merge release/2.0.0
git tag -a v2.0.0 -m "Release version 2.0.0"
git push origin main --tags

# 5. 合并回 develop
git checkout develop
git merge release/2.0.0
git push origin develop

# 6. 删除发布分支
git branch -d release/2.0.0
```

### 场景 4：多人协作同一功能

```bash
# Alice 创建主功能分支
git checkout -b feature/shopping-cart

# Bob 基于功能分支创建子分支
git checkout feature/shopping-cart
git checkout -b feature/shopping-cart-ui

# Charlie 创建另一个子分支
git checkout feature/shopping-cart
git checkout -b feature/shopping-cart-api

# 各自开发完成后，先合并到主功能分支
git checkout feature/shopping-cart
git merge feature/shopping-cart-ui
git merge feature/shopping-cart-api

# 最后合并到 develop
git checkout develop
git merge feature/shopping-cart
```

## 分支命名工具

### 使用 Git 别名简化创建

```bash
# 配置别名
git config --global alias.new-feature '!f() { git checkout develop && git pull && git checkout -b feature/$1; }; f'
git config --global alias.new-bugfix '!f() { git checkout develop && git pull && git checkout -b bugfix/$1; }; f'
git config --global alias.new-hotfix '!f() { git checkout main && git pull && git checkout -b hotfix/$1; }; f'

# 使用别名
git new-feature user-login
git new-bugfix cart-error
git new-hotfix security-patch
```

### 分支命名生成器脚本

```bash
#!/bin/bash
# branch-create.sh

echo "选择分支类型:"
echo "1) feature"
echo "2) bugfix"
echo "3) hotfix"
echo "4) release"
read -p "输入选项 (1-4): " type_choice

case $type_choice in
    1) type="feature"; base="develop" ;;
    2) type="bugfix"; base="develop" ;;
    3) type="hotfix"; base="main" ;;
    4) type="release"; base="develop" ;;
    *) echo "无效选项"; exit 1 ;;
esac

read -p "Issue 编号: " issue
read -p "简短描述: " description

# 生成分支名
branch_name="${type}/${issue}-${description}"
branch_name=$(echo "$branch_name" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')

echo "将创建分支: $branch_name (基于 $base)"
read -p "确认? (y/n): " confirm

if [ "$confirm" = "y" ]; then
    git checkout $base
    git pull origin $base
    git checkout -b $branch_name
    echo "✅ 分支创建成功: $branch_name"
else
    echo "❌ 已取消"
fi
```

使用方法：

```bash
chmod +x branch-create.sh
./branch-create.sh
```

## 常见问题

### Q1: 分支名称可以用中文吗？

**不推荐**。虽然 Git 技术上支持，但可能导致：
- 跨平台兼容性问题
- URL 编码问题
- 团队成员输入不便

```bash
# ❌ 不推荐
git checkout -b feature/用户登录

# ✅ 推荐
git checkout -b feature/user-login
```

### Q2: 已经创建了不规范的分支名怎么办？

可以重命名分支：

```bash
# 本地重命名
git branch -m old-branch-name feature/new-branch-name

# 如果已经推送到远程
git push origin -u feature/new-branch-name
git push origin --delete old-branch-name
```

### Q3: 分支太多怎么管理？

定期清理已合并的分支：

```bash
# 查看已合并的分支
git branch --merged

# 删除已合并的本地分支
git branch --merged | grep -v "\*" | grep -v "main" | grep -v "develop" | xargs -n 1 git branch -d

# 删除远程已删除的本地追踪分支
git fetch --prune

# 查看远程分支
git branch -r

# 删除远程分支
git push origin --delete branch-name
```

### Q4: 如何强制执行分支命名规范？

使用服务器端 Git hook：

```bash
# hooks/update (在 Git 服务器上)
#!/bin/bash

refname="$1"
oldrev="$2"
newrev="$3"

# 只检查分支
if [[ $refname =~ ^refs/heads/ ]]; then
    branch=${refname#refs/heads/}

    # 允许主分支
    if [[ $branch == "main" || $branch == "develop" ]]; then
        exit 0
    fi

    # 检查分支命名规范
    if ! [[ $branch =~ ^(feature|bugfix|hotfix|release)/.+ ]]; then
        echo "❌ 错误: 分支名 '$branch' 不符合规范"
        echo "✅ 格式: <type>/<description>"
        exit 1
    fi
fi

exit 0
```

## 练习题

### 练习 1：识别分支命名

判断以下分支名称是否符合最佳实践：

```bash
1. feature/user-login
2. Feature/UserLogin
3. fix-bug
4. bugfix/PROJ-123-cart-error
5. hotfix/v1.2.3
6. develop-new-feature
7. feature/add_new_payment_method
8. release/2.0.0
```

<details>
<summary>查看答案</summary>

1. ✅ 符合：正确的格式
2. ❌ 不符合：不应使用大写字母和驼峰命名
3. ❌ 不符合：缺少类型前缀（应为 bugfix/fix-bug）
4. ✅ 符合：包含 Issue 编号，格式正确
5. ✅ 符合：热修复分支，版本号格式正确
6. ❌ 不符合：不应直接在 develop 后添加描述
7. ❌ 不符合：应使用连字符而不是下划线
8. ✅ 符合：发布分支格式正确

</details>

### 练习 2：创建分支

为以下场景创建合适的分支：

1. 开发用户个人资料编辑功能（Issue #234）
2. 修复购物车总价计算错误（Issue #567）
3. 生产环境出现严重的安全漏洞
4. 准备发布 3.0.0 版本

<details>
<summary>查看答案</summary>

```bash
# 1. 功能开发
git checkout develop
git checkout -b feature/234-user-profile-edit

# 2. Bug 修复
git checkout develop
git checkout -b bugfix/567-cart-total-calculation

# 3. 紧急修复
git checkout main
git checkout -b hotfix/security-vulnerability

# 4. 版本发布
git checkout develop
git checkout -b release/3.0.0
```

</details>

### 练习 3：配置分支命名检查

创建一个 Git hook，检查分支名称必须：
- 以 `feature/`, `bugfix/`, `hotfix/`, `release/` 开头
- 使用小写字母和连字符
- 长度不超过 50 个字符

<details>
<summary>查看答案</summary>

```bash
# 创建 pre-push hook
cat > .git/hooks/pre-push << 'EOF'
#!/bin/bash

BRANCH=$(git rev-parse --abbrev-ref HEAD)

# 允许的分支
if [[ $BRANCH == "main" || $BRANCH == "develop" ]]; then
    exit 0
fi

# 检查格式
PATTERN="^(feature|bugfix|hotfix|release)\/[a-z0-9.-]+$"
if ! [[ $BRANCH =~ $PATTERN ]]; then
    echo "❌ 分支名称不符合规范: $BRANCH"
    echo ""
    echo "✅ 正确格式: <type>/<description>"
    echo "   类型: feature, bugfix, hotfix, release"
    echo "   描述: 使用小写字母、数字、连字符"
    echo "   示例: feature/user-login"
    exit 1
fi

# 检查长度
if [ ${#BRANCH} -gt 50 ]; then
    echo "❌ 分支名称过长: ${#BRANCH} 字符（最多 50）"
    exit 1
fi

echo "✅ 分支名称检查通过: $BRANCH"
exit 0
EOF

# 添加执行权限
chmod +x .git/hooks/pre-push

# 测试
git checkout -b feature/test-branch  # 应该通过
git checkout -b Feature/Test         # 应该失败
```

</details>

### 练习 4：分支管理脚本

编写一个脚本，列出所有已合并到 develop 的功能分支，并提示是否删除。

<details>
<summary>查看答案</summary>

```bash
#!/bin/bash
# cleanup-branches.sh

echo "正在检查已合并到 develop 的分支..."
echo ""

# 切换到 develop 并更新
git checkout develop
git pull origin develop

# 查找已合并的分支
merged_branches=$(git branch --merged develop | grep -E "feature/|bugfix/" | grep -v "\*")

if [ -z "$merged_branches" ]; then
    echo "✅ 没有需要清理的分支"
    exit 0
fi

echo "已合并的分支:"
echo "$merged_branches"
echo ""

read -p "是否删除这些本地分支? (y/n): " confirm

if [ "$confirm" = "y" ]; then
    echo "$merged_branches" | xargs -n 1 git branch -d
    echo "✅ 本地分支已删除"

    read -p "是否同时删除远程分支? (y/n): " confirm_remote

    if [ "$confirm_remote" = "y" ]; then
        echo "$merged_branches" | sed 's/^[[:space:]]*//' | xargs -n 1 git push origin --delete
        echo "✅ 远程分支已删除"
    fi
else
    echo "❌ 已取消"
fi
```

使用方法：

```bash
chmod +x cleanup-branches.sh
./cleanup-branches.sh
```

</details>

## 延伸阅读

- [Git Flow 工作流](https://nvie.com/posts/a-successful-git-branching-model/)
- [GitHub Flow](https://docs.github.com/en/get-started/quickstart/github-flow)
- [GitLab Flow](https://docs.gitlab.com/ee/topics/gitlab_flow.html)
- [Trunk Based Development](https://trunkbaseddevelopment.com/)

## 总结

- ✅ 使用统一的分支命名规范
- ✅ 分支名称要描述性强
- ✅ 使用小写字母和连字符
- ✅ 包含 Issue 或 Ticket 编号
- ✅ 定期清理已合并的分支
- ✅ 使用工具自动化检查

下一节：[代码审查](../code-review) →
