---
title: "分支策略"
weight: 6
bookToc: true
---

# 分支策略

分支策略是团队协作中管理代码分支的规范和流程。选择合适的分支策略可以提高开发效率、降低冲突、保证代码质量。

## 为什么需要分支策略

### 没有策略的问题

```
❌ 混乱的分支管理：
- 不知道该从哪个分支创建新分支
- 不知道该合并到哪个分支
- 不知道哪些分支可以删除
- 发布版本时不知道该用哪个分支
- 修复 bug 时不知道该在哪个分支
```

### 有策略的优势

```
✅ 清晰的工作流：
- 明确的分支命名规范
- 清晰的合并规则
- 规范的发布流程
- 标准化的 bug 修复流程
- 便于团队协作
```

## 常见分支策略

我们将介绍四种主流的分支策略：

1. **Git Flow** - 完整但复杂的策略
2. **GitHub Flow** - 简单实用的策略
3. **GitLab Flow** - 介于两者之间
4. **Trunk Based Development** - 极简策略

## Git Flow

Git Flow 是最早也是最完整的分支策略，由 Vincent Driessen 在 2010 年提出。

### 分支类型

Git Flow 定义了五种分支类型：

#### 1. 主分支（长期分支）

**main（或 master）**
```
用途：生产环境代码
特点：
- 永远保持稳定可部署
- 只接受来自 release 和 hotfix 的合并
- 每次合并都对应一个版本发布
- 打上版本标签（v1.0.0, v1.1.0, etc.）
```

**develop**
```
用途：开发分支，集成所有功能
特点：
- 包含最新的开发进度
- 功能分支从这里创建
- 功能开发完成后合并回这里
- 可能不稳定
```

#### 2. 支持分支（临时分支）

**feature/***
```
用途：功能开发
创建：从 develop 创建
合并：合并回 develop
命名：feature/user-auth, feature/payment
生命周期：功能完成后删除
```

**release/***
```
用途：发布准备
创建：从 develop 创建
合并：合并到 main 和 develop
命名：release/1.2.0
生命周期：发布后删除
```

**hotfix/***
```
用途：紧急修复生产问题
创建：从 main 创建
合并：合并到 main 和 develop
命名：hotfix/critical-bug
生命周期：修复后删除
```

### Git Flow 工作流程

#### 完整流程图

```
main      ──●────────────●────────────●──
            │ v1.0       │ v1.1       │ v1.2
            │            │            │
release   ──┼────────────●────────────┼──
            │           ↗│↘           │
develop   ──●──●──●──●──────●──●──●──●──
            ↑  ↓  ↓  ↓      ↑  ↓  ↓  ↑
feature   ──┴──●──●──┘      └──●──●──┘

hotfix    ─────────────────●───────────
                          ↗ ↘
```

#### 1. 功能开发流程

```bash
# 1. 从 develop 创建功能分支
git switch develop
git pull origin develop
git switch -c feature/user-login

# 2. 开发功能
echo "login code" > login.js
git add login.js
git commit -m "feat: implement user login"

# 3. 推送功能分支
git push -u origin feature/user-login

# 4. 创建 Pull Request（代码审查）
# ... 在 GitHub/GitLab 上创建 PR ...

# 5. 审查通过后，合并到 develop
git switch develop
git pull origin develop
git merge --no-ff feature/user-login
git push origin develop

# 6. 删除功能分支
git branch -d feature/user-login
git push origin --delete feature/user-login
```

#### 2. 发布流程

```bash
# 1. 从 develop 创建发布分支
git switch develop
git pull origin develop
git switch -c release/1.2.0

# 2. 准备发布（更新版本号、文档等）
echo "1.2.0" > VERSION
git add VERSION
git commit -m "chore: bump version to 1.2.0"

# 3. 测试发布分支
# ... 运行测试、修复小 bug ...

# 4. 如果有 bug 修复
git commit -m "fix: resolve issue in release"

# 5. 合并到 main
git switch main
git pull origin main
git merge --no-ff release/1.2.0
git tag -a v1.2.0 -m "Release version 1.2.0"
git push origin main --tags

# 6. 合并回 develop
git switch develop
git pull origin develop
git merge --no-ff release/1.2.0
git push origin develop

# 7. 删除发布分支
git branch -d release/1.2.0
git push origin --delete release/1.2.0
```

#### 3. 热修复流程

```bash
# 1. 从 main 创建热修复分支
git switch main
git pull origin main
git switch -c hotfix/security-patch

# 2. 修复问题
git commit -m "fix: patch security vulnerability"

# 3. 更新版本号
echo "1.2.1" > VERSION
git add VERSION
git commit -m "chore: bump version to 1.2.1"

# 4. 合并到 main
git switch main
git merge --no-ff hotfix/security-patch
git tag -a v1.2.1 -m "Hotfix version 1.2.1"
git push origin main --tags

# 5. 合并到 develop
git switch develop
git merge --no-ff hotfix/security-patch
git push origin develop

# 6. 删除热修复分支
git branch -d hotfix/security-patch
```

### Git Flow 优缺点

**优点**：
- ✅ 结构清晰，职责明确
- ✅ 适合版本化发布的项目
- ✅ 支持多版本并行维护
- ✅ 有明确的发布流程

**缺点**：
- ❌ 流程复杂，学习成本高
- ❌ 分支过多，容易混淆
- ❌ 不适合持续部署
- ❌ 合并频繁，容易产生冲突

**适用场景**：
- 传统软件发布（按版本发布）
- 需要维护多个版本
- 团队规模较大
- 发布周期较长

### Git Flow 工具

```bash
# 安装 git-flow 扩展（简化操作）
# macOS
brew install git-flow

# Ubuntu
apt-get install git-flow

# 初始化 Git Flow
git flow init

# 使用示例
git flow feature start user-login
git flow feature finish user-login

git flow release start 1.2.0
git flow release finish 1.2.0

git flow hotfix start security-patch
git flow hotfix finish security-patch
```

## GitHub Flow

GitHub Flow 是 GitHub 推荐的简化工作流，专为持续部署设计。

### 分支模型

```
main ───●───●───●───●───●───●───
        │   │ ↗ │ ↗ │ ↗ │ ↗
        ↓   ↓   ↓   ↓   ↓   ↓
feature ──●───●   ●   ●   ●
          ├───┘   │   │   │
          │       │   │   │
          └───────┴───┴───┘
```

**核心原则**：
1. main 分支永远可部署
2. 创建描述性的分支名
3. 提交到远程仓库
4. 创建 Pull Request
5. 讨论和审查代码
6. 部署测试
7. 合并到 main

### GitHub Flow 工作流程

```bash
# 1. 更新 main 分支
git switch main
git pull origin main

# 2. 创建功能分支（描述性命名）
git switch -c add-user-authentication

# 3. 开发和提交
git add .
git commit -m "Add user login form"

git add .
git commit -m "Add authentication logic"

# 4. 推送到远程
git push -u origin add-user-authentication

# 5. 在 GitHub 创建 Pull Request
# - 描述改动
# - 请求审查
# - 关联 Issue

# 6. 代码审查和讨论
# - 团队成员审查代码
# - 提出修改建议
# - 进行讨论

# 7. 根据反馈修改
git add .
git commit -m "Address review comments"
git push

# 8. 部署测试（可选）
# - 从 PR 分支部署到测试环境
# - 验证功能

# 9. 审查通过后合并
# - 在 GitHub 上点击 Merge
# - 或使用命令行：
git switch main
git merge --no-ff add-user-authentication
git push origin main

# 10. 自动部署到生产环境
# - CI/CD 自动触发部署

# 11. 删除分支
git branch -d add-user-authentication
git push origin --delete add-user-authentication
```

### Pull Request 最佳实践

#### 好的 PR 描述

```markdown
## 概述
添加用户认证功能，允许用户登录和注册。

## 改动
- 添加登录表单 UI
- 实现 JWT 认证
- 添加用户注册流程
- 添加单元测试

## 测试
- [ ] 登录功能正常
- [ ] 注册功能正常
- [ ] 所有测试通过
- [ ] 代码覆盖率 > 80%

## 截图
![登录页面](screenshot.png)

## 相关 Issue
Closes #123
Related to #456
```

### GitHub Flow 优缺点

**优点**：
- ✅ 简单易懂，容易上手
- ✅ 适合持续部署
- ✅ 代码审查流程清晰
- ✅ 分支少，不容易混淆
- ✅ 快速迭代

**缺点**：
- ❌ 不适合多版本维护
- ❌ 缺少发布分支
- ❌ 需要完善的 CI/CD
- ❌ main 分支压力大

**适用场景**：
- Web 应用、SaaS 产品
- 持续部署的项目
- 小型团队
- 快速迭代项目

## GitLab Flow

GitLab Flow 结合了 Git Flow 和 GitHub Flow 的优点，提供了更灵活的选择。

### 环境分支模式

```
main        ────●───●───●───●───●───●──  开发
                │   │   │   │   │   │
                ↓   ↓   ↓   ↓   ↓   ↓
pre-prod    ────●───●───●───●───●───●──  预发布
                │   │   │   │   │   │
                ↓   ↓   ↓   ↓   ↓   ↓
production  ────●───●───●───●───●───●──  生产
```

**分支说明**：
- `main`：主开发分支
- `pre-production`：预发布环境
- `production`：生产环境

### 发布分支模式

```
main          ────●───●───●───●───●───
                  │   │ ↗ │ ↗ │ ↗
                  ↓   ↓   ↓   ↓   ↓
feature       ────●───●   ●   ●

2.3-stable    ────●───────────●───

2.4-stable    ────────────●───────●───
```

**分支说明**：
- `main`：主开发分支
- `2.3-stable`：2.3 版本维护分支
- `2.4-stable`：2.4 版本维护分支

### GitLab Flow 工作流程

#### 环境分支模式

```bash
# 1. 在 main 分支开发
git switch main
git switch -c feature-payment
# ... 开发 ...
git push -u origin feature-payment
# 创建 Merge Request 到 main

# 2. 合并到 main
git switch main
git merge feature-payment
git push origin main
# 自动部署到开发环境

# 3. 测试通过后，合并到 pre-production
git switch pre-production
git merge main
git push origin pre-production
# 自动部署到预发布环境

# 4. 预发布测试通过，合并到 production
git switch production
git merge pre-production
git push origin production
# 自动部署到生产环境
```

#### 发布分支模式

```bash
# 1. 开发新功能
git switch main
git switch -c new-feature
# ... 开发 ...
git push -u origin new-feature

# 2. 合并到 main
git switch main
git merge new-feature
git push origin main

# 3. 创建发布分支
git switch -c 2.5-stable
git push -u origin 2.5-stable

# 4. 修复发布分支的 bug
git switch 2.5-stable
git switch -c bugfix-2.5
# ... 修复 ...
git switch 2.5-stable
git merge bugfix-2.5
git push origin 2.5-stable

# 5. Cherry-pick 到 main
git switch main
git cherry-pick <commit-hash>
git push origin main
```

### GitLab Flow 优缺点

**优点**：
- ✅ 灵活，可根据需求选择模式
- ✅ 支持多环境部署
- ✅ 支持版本维护
- ✅ 比 Git Flow 简单

**缺点**：
- ❌ 需要良好的 CI/CD 支持
- ❌ 多分支管理复杂度
- ❌ 需要团队纪律

**适用场景**：
- 多环境部署的项目
- 需要版本维护的产品
- 中大型团队

## Trunk Based Development（主干开发）

Trunk Based Development 是最简单的分支策略，所有开发都在主干（main）上进行。

### 分支模型

```
main ───●───●───●───●───●───●───●───
        ↑   ↑   ↑   ↑   ↑   ↑   ↑
        │   │   │   │   │   │   │
开发者A ─┘   │   │   │   │   │   │
开发者B ─────┘   │   │   │   │   │
开发者C ─────────┘   │   │   │   │
```

**核心原则**：
1. 所有人都在 main 分支工作
2. 短期功能分支（< 1天）
3. 频繁提交和集成
4. 使用功能开关（Feature Flags）
5. 强大的自动化测试

### 两种实践方式

#### 方式 1：直接在 main 提交

```bash
# 1. 更新 main
git pull origin main

# 2. 开发功能（小步快跑）
echo "feature code" > feature.js
git add feature.js
git commit -m "feat: add feature part 1"

# 3. 立即推送
git push origin main

# 4. 继续开发
echo "more code" >> feature.js
git add feature.js
git commit -m "feat: add feature part 2"

# 5. 立即推送
git push origin main
```

#### 方式 2：短期功能分支

```bash
# 1. 创建短期分支
git switch -c quick-feature

# 2. 快速开发（几小时内完成）
git commit -m "feat: implement feature"

# 3. 立即合并回 main
git switch main
git merge quick-feature
git push origin main

# 4. 删除分支
git branch -d quick-feature
```

### 功能开关示例

```javascript
// 使用功能开关隐藏未完成的功能
function renderUI() {
    if (featureFlags.newPaymentSystem) {
        // 新的支付系统（开发中）
        return <NewPaymentUI />;
    } else {
        // 旧的支付系统（稳定）
        return <OldPaymentUI />;
    }
}

// 配置文件
const featureFlags = {
    newPaymentSystem: process.env.ENABLE_NEW_PAYMENT === 'true'
};
```

### Trunk Based Development 优缺点

**优点**：
- ✅ 最简单，无分支管理负担
- ✅ 避免合并冲突
- ✅ 快速集成
- ✅ 鼓励小步提交
- ✅ 适合持续集成/部署

**缺点**：
- ❌ 需要严格的测试覆盖
- ❌ 需要功能开关机制
- ❌ 要求高度自律
- ❌ 不适合大型功能
- ❌ main 分支可能不稳定

**适用场景**：
- 小团队（< 10 人）
- 成熟的 CI/CD
- 高测试覆盖率
- 快速迭代的产品

## 如何选择分支策略

### 决策树

```
项目类型？
├─ 传统软件（按版本发布）
│   └─ Git Flow
├─ Web 应用（持续部署）
│   ├─ 需要多环境？
│   │   ├─ 是 → GitLab Flow
│   │   └─ 否 → GitHub Flow
│   └─ 小团队且成熟 CI/CD？
│       └─ Trunk Based Development
└─ 移动应用
    └─ Git Flow 或 GitLab Flow
```

### 对比表格

| 策略 | 复杂度 | 适合团队规模 | 发布方式 | 学习成本 |
|------|-------|------------|---------|---------|
| Git Flow | 高 | 中大型 | 版本发布 | 高 |
| GitHub Flow | 低 | 小中型 | 持续部署 | 低 |
| GitLab Flow | 中 | 中大型 | 灵活 | 中 |
| Trunk Based | 低 | 小型 | 持续部署 | 低 |

### 选择建议

**小团队（1-5人）**：
- 推荐：GitHub Flow 或 Trunk Based Development
- 原因：简单高效，减少流程负担

**中型团队（5-20人）**：
- 推荐：GitHub Flow 或 GitLab Flow
- 原因：平衡复杂度和灵活性

**大型团队（20+人）**：
- 推荐：Git Flow 或 GitLab Flow
- 原因：清晰的流程和职责划分

**项目特点**：
- 持续部署 → GitHub Flow, Trunk Based
- 版本发布 → Git Flow, GitLab Flow
- 多环境 → GitLab Flow
- 移动应用 → Git Flow

## 分支命名规范

### 通用规范

```bash
# 功能分支
feature/user-authentication
feature/JIRA-123-payment
feat/add-search

# Bug 修复
bugfix/login-error
fix/navbar-styling
bug/ISSUE-456

# 热修复
hotfix/security-patch
hotfix/critical-bug

# 发布分支
release/1.2.0
release/2024-Q1

# 文档
docs/api-documentation
docs/readme-update

# 重构
refactor/user-service
refactor/database-schema

# 测试
test/unit-tests
test/e2e-payment

# 性能优化
perf/optimize-queries
performance/reduce-bundle-size
```

### 命名最佳实践

**✅ 好的命名**：
```bash
feature/user-profile-page
bugfix/email-validation-error
hotfix/security-vulnerability-cve-2024
release/v2.1.0
```

**❌ 不好的命名**：
```bash
feature        # 太泛
fix            # 不知道修复什么
my-branch      # 不专业
temp           # 容易遗忘
test-123       # 无意义
```

## 配置和自动化

### 分支保护规则

```yaml
# GitHub 分支保护配置示例
main:
  protected: true
  require_pull_request: true
  required_approvals: 2
  require_status_checks: true
  required_checks:
    - "ci/tests"
    - "ci/lint"
  enforce_admins: true
  allow_force_push: false
  allow_deletions: false
```

### Git 钩子示例

```bash
# .git/hooks/pre-push
#!/bin/bash

# 禁止直接推送到 main
branch=$(git symbolic-ref HEAD | sed -e 's,.*/\(.*\),\1,')

if [ "$branch" = "main" ]; then
    echo "🚫 Direct push to main is not allowed!"
    echo "Please create a Pull Request instead."
    exit 1
fi
```

### CI/CD 集成

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run tests
        run: npm test
      - name: Run linter
        run: npm run lint
```

## 实战建议

### 1. 从简单开始

```bash
# 新团队建议：
# 1. 先用 GitHub Flow
# 2. 遇到问题再调整
# 3. 不要一开始就用复杂策略
```

### 2. 文档化流程

```markdown
# 团队分支策略文档

## 我们使用 GitHub Flow

### 功能开发流程
1. 从 main 创建功能分支
2. 开发并提交
3. 推送并创建 PR
4. 代码审查
5. 合并到 main
6. 自动部署

### 分支命名
- feature/* - 新功能
- bugfix/* - Bug 修复
- hotfix/* - 紧急修复
```

### 3. 定期回顾

```
每季度回顾：
- 当前策略是否有效？
- 遇到了什么问题？
- 需要调整吗？
```

## 命令速查

| 操作 | Git Flow | GitHub Flow | GitLab Flow |
|------|----------|-------------|-------------|
| 开始功能 | `git flow feature start X` | `git switch -c feature-X` | `git switch -c feature-X` |
| 完成功能 | `git flow feature finish X` | 创建 PR 并合并 | 创建 MR 并合并 |
| 开始发布 | `git flow release start X` | - | `git switch -c X-stable` |
| 热修复 | `git flow hotfix start X` | 与功能分支相同 | `git switch -c hotfix-X` |

## 下一步

掌握了分支策略后，你可以：
- 学习远程协作 → [远程仓库](../../remote/)
- 学习高级技巧 → [高级操作](../../advanced/)
- 学习最佳实践 → [最佳实践](../../best-practices/)

---

## 💡 练习题

{{< expand "练习 1：实践 GitHub Flow" >}}
**任务**：
按照 GitHub Flow 完成一个功能开发的完整流程。

{{< expand "查看答案" >}}
```bash
# 1. 克隆仓库（或创建新仓库）
git clone <repo-url>
cd <repo>

# 2. 确保 main 是最新的
git switch main
git pull origin main

# 3. 创建功能分支（描述性命名）
git switch -c add-user-registration

# 4. 开发功能（小步提交）
# 创建注册表单
echo "<form>...</form>" > registration.html
git add registration.html
git commit -m "feat: add registration form UI"

# 添加验证逻辑
echo "validation code" > validate.js
git add validate.js
git commit -m "feat: add form validation"

# 添加测试
echo "test code" > registration.test.js
git add registration.test.js
git commit -m "test: add registration tests"

# 5. 推送到远程
git push -u origin add-user-registration

# 6. 在 GitHub 创建 Pull Request
# 标题：Add user registration feature
# 描述：
# - 添加注册表单
# - 实现表单验证
# - 添加单元测试
#
# 测试：
# - [x] 所有测试通过
# - [x] 代码审查完成

# 7. 代码审查
# ... 团队成员审查并提出建议 ...

# 8. 根据反馈修改
echo "improved code" >> validate.js
git add validate.js
git commit -m "refactor: improve validation logic"
git push

# 9. 审查通过后合并（在 GitHub 上）
# 或使用命令行：
git switch main
git pull origin main
git merge --no-ff add-user-registration
git push origin main

# 10. 删除功能分支
git branch -d add-user-registration
git push origin --delete add-user-registration

# 11. 验证部署
# CI/CD 自动部署到生产环境
```

**关键点**：
- 描述性的分支名
- 小步频繁提交
- 详细的 PR 描述
- 代码审查
- 合并后自动部署
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 2：选择合适的策略" >}}
**问题**：为以下场景选择最合适的分支策略，并说明理由。

A. 一个 SaaS 产品，5 人团队，每天部署多次

B. 一个企业软件，30 人团队，每季度发布一个版本，需要维护旧版本

C. 一个移动应用，10 人团队，每两周发布到应用商店

D. 一个开源项目，不确定的贡献者数量

{{< expand "查看答案" >}}
**答案**：

**A. 推荐：GitHub Flow 或 Trunk Based Development**

```
理由：
- 小团队（5人）
- 持续部署（每天多次）
- 需要快速迭代

实践：
- 使用 GitHub Flow
- main 分支自动部署
- 功能分支 < 1天
- 强制代码审查
- 完善的自动化测试
```

**B. 推荐：Git Flow**

```
理由：
- 大团队（30人）
- 版本化发布
- 需要维护多个版本
- 发布周期长

实践：
- main: 生产版本
- develop: 开发分支
- release/*: 发布准备
- hotfix/*: 紧急修复
- 维护 stable 分支（1.x, 2.x）
```

**C. 推荐：GitLab Flow（发布分支模式）**

```
理由：
- 中型团队（10人）
- 定期发布
- 需要版本维护
- 应用商店审核流程

实践：
- main: 开发分支
- production: 生产分支
- 版本分支：ios-1.2, android-1.2
- 发布前合并到 production
```

**D. 推荐：GitHub Flow**

```
理由：
- 开源项目
- 贡献者不确定
- 需要代码审查
- 简单易懂

实践：
- 必须通过 Pull Request
- 强制代码审查（maintainers）
- CI 自动测试
- 详细的贡献指南
- 分支保护规则
```
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 3：设计团队工作流" >}}
**场景**：
你是一个 Web 应用项目的技术负责人，团队有 8 个开发人员。项目需求：
- 有开发、测试、生产三个环境
- 每周五部署到生产
- 需要代码审查
- 偶尔需要紧急修复

设计一个合适的分支策略和工作流程。

{{< expand "查看答案" >}}
**推荐方案：GitLab Flow（环境分支模式）+ GitHub Flow 的 PR 流程**

```
分支结构：

main          ────●───●───●───●───●───  开发环境
                  │   │ ↗ │ ↗ │ ↗
                  ↓   ↓   ↓   ↓   ↓
feature       ────●───●   ●   ●

staging       ────────●───────●───────  测试环境
                    │       │
                    ↓       ↓
production    ──────────●───────────●─  生产环境
```

**工作流程**：

1. **功能开发**（周一到周四）
```bash
# 开发者 A
git switch main
git pull origin main
git switch -c feature/add-payment

# 开发
git commit -m "feat: implement payment"
git push -u origin feature/add-payment

# 创建 Pull Request 到 main
# 需要至少 1 人审查

# 审查通过后合并
git switch main
git merge --no-ff feature/add-payment
git push origin main
# 自动部署到开发环境
```

2. **测试阶段**（周四晚上）
```bash
# 技术负责人
git switch staging
git merge main
git push origin staging
# 自动部署到测试环境

# QA 团队测试
```

3. **生产发布**（周五）
```bash
# 测试通过后
git switch production
git merge staging
git tag -a v1.2.0 -m "Release 1.2.0"
git push origin production --tags
# 自动部署到生产环境
```

4. **紧急修复**
```bash
# 从 production 创建
git switch production
git switch -c hotfix/critical-bug

# 修复
git commit -m "fix: resolve critical bug"

# 合并到 production
git switch production
git merge hotfix/critical-bug
git tag -a v1.2.1 -m "Hotfix 1.2.1"
git push origin production --tags

# 合并到 staging 和 main
git switch staging
git merge production
git push origin staging

git switch main
git merge production
git push origin main
```

**分支保护规则**：

```yaml
main:
  - 需要 PR
  - 至少 1 人审查
  - CI 必须通过
  - 禁止强制推送

staging:
  - 只允许 main 和 production 合并
  - 禁止直接提交
  - 禁止强制推送

production:
  - 只允许 staging 和 hotfix 合并
  - 需要技术负责人审批
  - 所有测试必须通过
  - 禁止强制推送
```

**CI/CD 配置**：

```yaml
# .gitlab-ci.yml
stages:
  - test
  - deploy

test:
  stage: test
  script:
    - npm test
    - npm run lint
  only:
    - merge_requests
    - main

deploy_dev:
  stage: deploy
  script:
    - deploy_to_dev.sh
  only:
    - main
  environment:
    name: development

deploy_staging:
  stage: deploy
  script:
    - deploy_to_staging.sh
  only:
    - staging
  environment:
    name: staging

deploy_prod:
  stage: deploy
  script:
    - deploy_to_production.sh
  only:
    - production
  environment:
    name: production
  when: manual  # 需要手动触发
```

**优势**：
- ✅ 清晰的环境隔离
- ✅ 代码审查流程
- ✅ 自动化部署
- ✅ 支持紧急修复
- ✅ 适合中型团队
{{< /expand >}}
{{< /expand >}}

---

{{< hint success >}}
**检查清单** - 完成本节后，你应该能够：

- [ ] 理解为什么需要分支策略
- [ ] 了解 Git Flow 的完整流程
- [ ] 掌握 GitHub Flow 的简单实用方法
- [ ] 理解 GitLab Flow 的灵活性
- [ ] 了解 Trunk Based Development 的原则
- [ ] 根据项目特点选择合适的策略
- [ ] 制定团队的分支命名规范
- [ ] 配置分支保护规则
- [ ] 集成 CI/CD 流程
- [ ] 设计适合团队的工作流程
{{< /hint >}}
