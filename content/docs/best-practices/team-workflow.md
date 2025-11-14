---
title: "团队协作"
weight: 4
prev: /docs/best-practices/code-review
next: /docs/best-practices/security
---

# 团队协作

有效的团队协作工作流是软件项目成功的关键。本节介绍常见的 Git 工作流程、代码合并策略以及团队协作最佳实践。

## 团队工作流程

### Git Flow

Git Flow 是最经典的分支管理模型，适合有明确发布周期的项目。

#### 分支结构

```
main (生产环境)
  ↑
release/x.x.x (发布准备)
  ↑
develop (开发环境)
  ↑
feature/* (功能开发)

hotfix/* → main + develop
```

#### 完整流程示例

```bash
# 1. 初始化仓库
git checkout -b develop

# 2. 开发新功能
git checkout develop
git checkout -b feature/user-authentication

# 开发...
git add .
git commit -m "feat: 添加用户认证功能"

# 3. 功能完成，合并到 develop
git checkout develop
git merge feature/user-authentication --no-ff
git branch -d feature/user-authentication
git push origin develop

# 4. 准备发布
git checkout develop
git checkout -b release/1.0.0

# 更新版本号等
git commit -m "chore: 准备 1.0.0 版本发布"

# 5. 发布到生产环境
git checkout main
git merge release/1.0.0 --no-ff
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin main --tags

# 合并回 develop
git checkout develop
git merge release/1.0.0 --no-ff
git push origin develop

# 删除发布分支
git branch -d release/1.0.0

# 6. 紧急修复
git checkout main
git checkout -b hotfix/critical-bug

# 修复...
git commit -m "fix: 修复关键安全漏洞"

# 合并到 main
git checkout main
git merge hotfix/critical-bug --no-ff
git tag -a v1.0.1 -m "Hotfix 1.0.1"
git push origin main --tags

# 合并到 develop
git checkout develop
git merge hotfix/critical-bug --no-ff
git push origin develop

# 删除热修复分支
git branch -d hotfix/critical-bug
```

#### Git Flow 配置

使用 `git-flow` 工具简化流程：

```bash
# 安装 git-flow
# macOS
brew install git-flow

# Ubuntu/Debian
apt-get install git-flow

# 初始化
git flow init

# 默认配置：
# Production branch: main
# Development branch: develop
# Feature prefix: feature/
# Release prefix: release/
# Hotfix prefix: hotfix/
# Version tag prefix: v

# 使用 git-flow 开发功能
git flow feature start user-login
# 等同于：git checkout -b feature/user-login develop

# 完成功能
git flow feature finish user-login
# 等同于：
# git checkout develop
# git merge feature/user-login
# git branch -d feature/user-login

# 开始发布
git flow release start 1.0.0

# 完成发布
git flow release finish 1.0.0
# 等同于：
# git checkout main
# git merge release/1.0.0
# git tag v1.0.0
# git checkout develop
# git merge release/1.0.0
# git branch -d release/1.0.0

# 紧急修复
git flow hotfix start critical-bug
git flow hotfix finish critical-bug
```

#### 适用场景

✅ **适合**：
- 有明确的发布周期
- 需要同时维护多个版本
- 需要严格的发布流程
- 团队规模较大

❌ **不适合**：
- 持续部署的项目
- 小团队快速迭代
- 需要频繁发布

### GitHub Flow

GitHub Flow 是一个简化的工作流，适合持续部署的项目。

#### 核心原则

```
main (永远可部署)
  ↑
feature-branch (功能开发)
```

#### 工作流程

```bash
# 1. 创建分支
git checkout main
git pull origin main
git checkout -b feature/add-payment

# 2. 开发和提交
git add .
git commit -m "feat: 添加支付功能"
git push origin feature/add-payment

# 3. 创建 Pull Request
gh pr create --title "feat: 添加支付功能" --base main

# 4. 代码审查和讨论
# 在 GitHub 上进行 code review

# 5. 部署到预览环境测试
# 通过 CI/CD 自动部署

# 6. 合并到 main
gh pr merge --squash

# 7. 自动部署到生产环境
# CI/CD 自动部署 main 分支
```

#### 分支保护规则

```yaml
# GitHub 设置示例
Protected Branches:
  main:
    - Require pull request reviews (至少 1 个审批)
    - Require status checks to pass
    - Require branches to be up to date
    - Require linear history
    - Include administrators
```

#### 适用场景

✅ **适合**：
- 持续部署
- 快速迭代
- Web 应用
- 小到中型团队

❌ **不适合**：
- 需要维护多个版本
- 有严格的发布周期

### GitLab Flow

GitLab Flow 结合了 Git Flow 和 GitHub Flow 的优点。

#### 环境分支模式

```
main (开发环境)
  ↓
pre-production (预发布环境)
  ↓
production (生产环境)
```

#### 工作流程

```bash
# 1. 在 main 分支开发
git checkout main
git checkout -b feature/new-feature

# 2. 开发完成后创建 MR
git push origin feature/new-feature
# 在 GitLab 上创建 Merge Request 到 main

# 3. 合并到 main，自动部署到开发环境
git checkout main
git merge feature/new-feature

# 4. 测试通过后，合并到 pre-production
git checkout pre-production
git merge main
# 自动部署到预发布环境

# 5. 预发布测试通过，合并到 production
git checkout production
git merge pre-production
# 自动部署到生产环境
```

#### 发布分支模式

```
main
  ↓
2-3-stable (2.3.x 版本维护)
  ↓
2-4-stable (2.4.x 版本维护)
```

适合需要维护多个版本的项目。

#### 适用场景

✅ **适合**：
- 有多个部署环境
- 需要版本维护
- 中大型团队
- 需要渐进式部署

### Trunk Based Development

主干开发是一种高频合并的开发模式。

#### 核心原则

- 所有开发在 `main` 分支或短期分支
- 功能分支生命周期 < 1 天
- 频繁集成到主干
- 使用特性开关（Feature Flags）

#### 工作流程

```bash
# 1. 从 main 创建短期分支
git checkout main
git pull origin main
git checkout -b short-lived-branch

# 2. 小步快跑，频繁提交
# 开发一小部分功能
git add .
git commit -m "feat: 实现支付功能的第一步"
git push origin short-lived-branch

# 3. 快速合并（当天完成）
git checkout main
git merge short-lived-branch
git push origin main

# 或直接在 main 分支开发（经验丰富的团队）
git checkout main
git add .
git commit -m "feat: 添加新功能"
git push origin main
```

#### 使用特性开关

```javascript
// featureFlags.js
const features = {
  newPayment: process.env.ENABLE_NEW_PAYMENT === 'true',
  betaUI: process.env.ENABLE_BETA_UI === 'true'
};

// 使用特性开关
if (features.newPayment) {
  // 新支付功能
  processPaymentV2(data);
} else {
  // 旧支付功能
  processPaymentV1(data);
}
```

#### 适用场景

✅ **适合**：
- 高度自动化测试
- 持续集成文化成熟
- 团队经验丰富
- 快速迭代

❌ **不适合**：
- 缺乏自动化测试
- 团队经验不足
- 代码审查流程复杂

## 代码合并策略

### Merge Commit

保留完整的分支历史。

```bash
# 创建合并提交
git checkout main
git merge feature/new-feature

# 结果
*   Merge branch 'feature/new-feature'
|\
| * feat: add new feature
| * fix: fix bug in feature
|/
* Previous commit
```

**优点**：
- ✅ 保留完整历史
- ✅ 清晰的分支结构
- ✅ 方便回滚整个功能

**缺点**：
- ❌ 历史可能很混乱
- ❌ 大量合并提交

**适用场景**：
- Git Flow 工作流
- 需要清晰的功能边界
- 大型团队协作

**配置**：

```bash
# 总是创建合并提交
git merge feature/new-feature --no-ff

# GitHub/GitLab 设置
# Settings → Merge strategy → Merge commit
```

### Squash and Merge

将多个提交压缩为一个。

```bash
# Squash 合并
git checkout main
git merge --squash feature/new-feature
git commit -m "feat: 添加新功能"

# 结果
* feat: 添加新功能 (包含所有变更)
* Previous commit
```

**优点**：
- ✅ 保持主分支整洁
- ✅ 每个功能一个提交
- ✅ 便于 code review

**缺点**：
- ❌ 丢失详细历史
- ❌ 难以追踪中间更改

**适用场景**：
- GitHub Flow
- 小功能开发
- 希望保持简洁的历史

**GitHub PR 设置**：

```bash
# 使用 GitHub CLI
gh pr merge --squash

# 或在 GitHub 网页上选择 "Squash and merge"
```

### Rebase and Merge

将分支提交线性化。

```bash
# Rebase 到 main
git checkout feature/new-feature
git rebase main

# 解决冲突（如果有）
git add .
git rebase --continue

# Fast-forward 合并
git checkout main
git merge feature/new-feature

# 结果（线性历史）
* feat: add another part
* feat: add new feature
* Previous commit
```

**优点**：
- ✅ 线性历史
- ✅ 没有合并提交
- ✅ 清晰的提交顺序

**缺点**：
- ❌ 改写历史
- ❌ 冲突解决复杂
- ❌ 不适合公共分支

**适用场景**：
- 个人功能分支
- 希望线性历史
- 团队有 rebase 经验

**注意事项**：

```bash
# ⚠️ 永远不要 rebase 已推送的公共分支
# ❌ 不要这样做
git checkout main
git rebase feature/something

# ✅ 只 rebase 私有分支
git checkout feature/my-feature
git rebase main
```

### 合并策略对比

| 策略 | 历史记录 | 提交数量 | 回滚难度 | 适用场景 |
|------|---------|---------|---------|---------|
| Merge | 完整分支历史 | 多 | 容易（回滚合并提交） | Git Flow |
| Squash | 单一提交 | 少 | 中等（回滚单个提交） | GitHub Flow |
| Rebase | 线性历史 | 保留原提交 | 困难 | 个人分支 |

### 团队策略建议

```markdown
# 合并策略规范

## 主分支保护
- `main` 和 `develop` 只允许通过 PR 合并
- 禁止直接推送
- 禁止强制推送

## 合并策略
- **功能分支 → develop**: Squash and Merge
- **develop → main**: Merge Commit (--no-ff)
- **hotfix → main**: Merge Commit (--no-ff)
- **release → main**: Merge Commit (--no-ff)

## 个人习惯
- 定期 rebase develop 到功能分支（保持最新）
- 推送前整理本地提交（squash、reword）
```

## 冲突预防

### 频繁同步

```bash
# 定期从主分支更新
git checkout feature/my-feature
git fetch origin
git merge origin/develop

# 或使用 rebase
git rebase origin/develop

# 推送更新
git push origin feature/my-feature --force-with-lease
```

### 小步提交

```bash
# ✅ 好：频繁提交小的更改
git add file1.js
git commit -m "feat: add user validation"

git add file2.js
git commit -m "feat: add user service"

# ❌ 不好：一次提交大量更改
git add .
git commit -m "feat: add user module"
```

### 模块化设计

```javascript
// ✅ 好：模块独立，减少冲突
// userService.js
export class UserService {
  // ...
}

// paymentService.js
export class PaymentService {
  // ...
}

// ❌ 不好：所有功能在一个文件
// services.js
export class AllServices {
  // 用户、支付、订单都在这里
}
```

### 通信协作

```markdown
# 团队沟通最佳实践

## 开始工作前
"我准备开始开发用户认证模块，会修改 auth.js 和 user.js"

## 大重构前
"我计划重构 payment 模块，预计需要 2 天，请避免修改该模块"

## 发现冲突风险时
"我注意到你也在修改 order.js，我们协调一下分工"
```

### 合理的分支策略

```bash
# ✅ 好：按功能模块划分分支
feature/user-authentication  # 只修改 auth 相关文件
feature/payment-integration  # 只修改 payment 相关文件

# ❌ 不好：大而全的分支
feature/complete-rewrite  # 修改了整个项目
```

## 冲突解决

### 识别冲突

```bash
# 合并时发现冲突
git merge feature/other-branch

# 输出
Auto-merging src/app.js
CONFLICT (content): Merge conflict in src/app.js
Automatic merge failed; fix conflicts and then commit the result.

# 查看冲突文件
git status

# 输出
Unmerged paths:
  both modified:   src/app.js
```

### 解决冲突

```javascript
// src/app.js
<<<<<<< HEAD
// 当前分支的代码
function processPayment(amount) {
  return amount * 1.1;
}
=======
// 要合并的分支的代码
function processPayment(total) {
  return total * 1.05;
}
>>>>>>> feature/other-branch
```

**解决步骤**：

1. **分析冲突**：理解两个版本的意图
2. **决策**：保留哪个版本，或合并两者
3. **编辑文件**：删除冲突标记，保留正确的代码
4. **测试**：确保解决后的代码正常工作
5. **提交**：标记冲突已解决

```javascript
// 解决后的代码
function processPayment(amount) {
  // 综合两个版本：使用更准确的变量名和更新的费率
  return amount * 1.05;
}
```

```bash
# 标记冲突已解决
git add src/app.js

# 完成合并
git commit -m "merge: 合并 feature/other-branch，解决支付计算冲突"
```

### 使用合并工具

```bash
# 配置合并工具
git config --global merge.tool vimdiff
# 或
git config --global merge.tool vscode

# 对于 VS Code
git config --global merge.tool vscode
git config --global mergetool.vscode.cmd 'code --wait $MERGED'

# 启动合并工具
git mergetool

# 解决所有冲突后
git commit
```

### 复杂冲突处理

```bash
# 查看冲突的详细信息
git diff

# 查看三方比较
git diff HEAD...feature/other-branch

# 选择特定版本
git checkout --ours src/app.js    # 保留当前分支的版本
git checkout --theirs src/app.js  # 保留要合并分支的版本

# 手动编辑后
git add src/app.js
git commit
```

### 中止合并

```bash
# 如果冲突太复杂，可以中止合并
git merge --abort

# 重新思考合并策略
```

## 协作规范

### 提交规范

```bash
# 提交前检查
git status          # 确认要提交的文件
git diff           # 检查更改内容
git diff --staged  # 检查暂存区

# 原子化提交
git add src/user.js
git commit -m "feat(user): 添加用户验证功能"

git add tests/user.test.js
git commit -m "test(user): 添加用户验证测试"
```

### 推送规范

```bash
# ✅ 推送前更新
git pull --rebase origin main
git push origin main

# ❌ 强制推送到共享分支
git push origin main --force  # 危险！

# ✅ 使用 --force-with-lease（更安全）
git push origin feature/my-branch --force-with-lease
```

### 分支管理规范

```bash
# 定期清理本地分支
git branch --merged | grep -v "\*\|main\|develop" | xargs -n 1 git branch -d

# 清理远程分支的本地引用
git fetch --prune

# 查看分支状态
git branch -vv
```

### 代码审查规范

```markdown
# 代码审查清单

## 提交者
- [ ] 代码已在本地测试
- [ ] 通过所有 lint 检查
- [ ] 添加了必要的测试
- [ ] 更新了相关文档
- [ ] 提交信息符合规范
- [ ] PR 描述清晰完整

## 审查者
- [ ] 代码逻辑正确
- [ ] 无明显性能问题
- [ ] 无安全漏洞
- [ ] 代码风格一致
- [ ] 测试覆盖充分
- [ ] 文档准确完整
```

## 沟通最佳实践

### 文档化决策

```markdown
# docs/architecture-decisions/001-database-choice.md

# ADR 001: 选择 PostgreSQL 作为主数据库

## 状态
已接受

## 背景
我们需要选择一个可靠的关系型数据库...

## 决策
选择 PostgreSQL 作为主数据库

## 后果
**正面**:
- 强大的 JSON 支持
- 优秀的性能
- 活跃的社区

**负面**:
- 学习曲线较陡
- 运维复杂度较高
```

### 有效的代码注释

```javascript
// ✅ 好：解释"为什么"
// 使用 setTimeout 而不是 setInterval，避免回调堆积
// 当处理时间超过间隔时间时，setInterval 会导致问题
setTimeout(function tick() {
  processData();
  setTimeout(tick, 1000);
}, 1000);

// ❌ 不好：只说明"是什么"
// 每秒调用一次 processData
setInterval(processData, 1000);
```

### 规范的 PR 讨论

```markdown
# PR 讨论示例

## 提出问题
"这里为什么使用 setTimeout 而不是 setInterval？
我注意到其他地方都用的 setInterval。"

## 回答问题
"好问题！使用 setTimeout 是为了避免回调堆积的问题。
当 processData 执行时间超过 1 秒时，setInterval
会导致多个回调同时执行。

我在代码中添加了注释说明，也更新了文档中的最佳实践部分。"

## 达成共识
"明白了，这个方案确实更可靠。建议在团队分享会上
讲解一下这个实践，避免其他同事踩坑。"
```

### 使用 GitHub Discussions

```markdown
# 适合 Discussions 的内容

## ✅ 适合
- 架构设计讨论
- 功能需求讨论
- 技术选型讨论
- 最佳实践分享
- 问答交流

## ❌ 不适合
- Bug 报告（应该用 Issue）
- 功能请求（应该用 Issue）
- 具体代码审查（应该用 PR）
```

### 同步会议指南

```markdown
# 团队同步会议

## 日常站会（Daily Standup）
**时间**: 每天早上 10:00，15 分钟
**内容**:
- 昨天完成了什么
- 今天计划做什么
- 有什么阻碍

## 代码审查会议（Code Review Session）
**时间**: 每周三下午，1 小时
**内容**:
- 集中审查重要的 PR
- 讨论技术债务
- 分享最佳实践

## 技术分享会（Tech Sharing）
**时间**: 每两周一次，1 小时
**内容**:
- 新技术分享
- 项目经验总结
- 踩坑记录分享
```

## 实战场景

### 场景 1：多人协作开发大功能

```bash
# 团队负责人创建主功能分支
git checkout develop
git checkout -b feature/e-commerce-platform

# 成员 A 开发用户模块
git checkout feature/e-commerce-platform
git checkout -b feature/e-commerce-user
# 开发...
git push origin feature/e-commerce-user
# 创建 PR 合并到 feature/e-commerce-platform

# 成员 B 开发商品模块
git checkout feature/e-commerce-platform
git checkout -b feature/e-commerce-product
# 开发...
git push origin feature/e-commerce-product
# 创建 PR 合并到 feature/e-commerce-platform

# 成员 C 开发订单模块
git checkout feature/e-commerce-platform
git checkout -b feature/e-commerce-order
# 开发...
git push origin feature/e-commerce-order
# 创建 PR 合并到 feature/e-commerce-platform

# 功能完成后，将主功能分支合并到 develop
git checkout develop
git merge feature/e-commerce-platform --no-ff
git push origin develop
```

### 场景 2：紧急修复线上问题

```bash
# 1. 快速创建热修复分支
git checkout main
git pull origin main
git checkout -b hotfix/payment-critical-bug

# 2. 最小化修改（只修复问题，不重构）
# 编辑 src/payment.js
git add src/payment.js
git commit -m "fix: 修复支付金额计算错误"

# 3. 添加测试验证修复
git add tests/payment.test.js
git commit -m "test: 添加支付计算测试用例"

# 4. 合并到 main 并发布
git checkout main
git merge hotfix/payment-critical-bug --no-ff
git tag -a v1.2.3 -m "Hotfix: 修复支付计算"
git push origin main --tags

# 5. 部署到生产环境
# 触发 CI/CD 自动部署

# 6. 同步到 develop
git checkout develop
git merge hotfix/payment-critical-bug --no-ff
git push origin develop

# 7. 通知团队
# 在 Slack/企业微信发布修复通知
```

### 场景 3：处理大规模重构

```bash
# 1. 创建重构分支
git checkout develop
git checkout -b refactor/database-layer

# 2. 使用特性开关逐步迁移
# 第一步：添加新实现（与旧实现共存）
git add src/db/newImplementation.js
git commit -m "refactor: 添加新的数据库层实现"
git push origin refactor/database-layer

# 第二步：添加特性开关
git add src/config/features.js
git commit -m "feat: 添加数据库层切换开关"
git push origin refactor/database-layer

# 第三步：渐进式启用（先在测试环境）
# 在测试环境设置 ENABLE_NEW_DB_LAYER=true

# 第四步：生产环境灰度发布
# 逐步增加使用新实现的用户比例

# 第五步：完全切换后删除旧代码
git add .
git commit -m "refactor: 移除旧的数据库层实现"

# 第六步：合并到 develop
git checkout develop
git merge refactor/database-layer --no-ff
git push origin develop
```

## 练习题

### 练习 1：选择合适的工作流

为以下项目选择合适的 Git 工作流：

1. 一个需要同时维护 3 个大版本的企业软件
2. 一个快速迭代的 SaaS Web 应用，每天部署多次
3. 一个有明确季度发布周期的移动应用
4. 一个开源库，需要维护稳定版和开发版

<details>
<summary>查看答案</summary>

1. **Git Flow**
   - 需要维护多个版本，使用 Git Flow 的发布分支和支持分支
   - 主分支：main, develop, support/1.x, support/2.x

2. **GitHub Flow** 或 **Trunk Based Development**
   - 持续部署，需要简单快速的流程
   - 所有功能直接合并到 main，自动部署

3. **Git Flow**
   - 有明确发布周期，需要发布准备阶段
   - 使用 release 分支准备发布

4. **Git Flow** 或 **GitLab Flow**
   - 需要同时维护稳定版和开发版
   - main (开发版), stable (稳定版)

</details>

### 练习 2：选择合并策略

为以下场景选择合适的合并策略：

1. 功能分支有 20 个提交，包含很多 "fix typo"、"wip" 等临时提交
2. 需要清晰看到某个大功能是何时合并的
3. 希望保持 main 分支的线性历史
4. 个人功能分支，希望保留每个提交的详细信息

<details>
<summary>查看答案</summary>

1. **Squash and Merge**
   - 将 20 个提交压缩为一个有意义的提交
   - 隐藏无意义的临时提交

2. **Merge Commit (--no-ff)**
   - 创建明确的合并提交
   - 方便回滚整个功能

3. **Rebase and Merge**
   - 保持线性历史
   - 但要确保团队熟悉 rebase

4. **Merge Commit** 或 **Rebase and Merge**
   - 如果是个人分支且未推送，可以先整理提交再 merge
   - 如果要保留所有历史，使用 merge commit

</details>

### 练习 3：解决工作流问题

团队遇到以下问题，提出解决方案：

1. 功能分支经常与 develop 产生大量冲突
2. main 分支历史很混乱，难以找到特定功能的提交
3. 开发人员经常忘记删除已合并的分支
4. 代码审查响应时间过长，阻塞开发进度

<details>
<summary>查看答案</summary>

1. **功能分支冲突问题**
   ```bash
   # 解决方案：
   # a. 要求功能分支定期（每天）从 develop 更新
   git checkout feature/my-feature
   git rebase develop  # 或 git merge develop

   # b. 鼓励小步提交，缩短分支生命周期
   # c. 改进模块化设计，减少文件修改冲突
   # d. 加强团队沟通，避免同时修改相同文件
   ```

2. **历史混乱问题**
   ```bash
   # 解决方案：
   # a. 对功能分支使用 Squash and Merge
   gh pr merge --squash

   # b. 对重要合并使用 --no-ff，创建明确的合并提交
   git merge feature/important --no-ff

   # c. 强制要求规范的提交信息
   # d. 使用 commitlint 工具自动检查
   ```

3. **分支清理问题**
   ```bash
   # 解决方案：
   # a. 在 GitHub 设置中启用"合并后自动删除分支"
   # b. 配置自动化清理脚本
   #!/bin/bash
   # cleanup.sh
   git fetch --prune
   git branch --merged | grep -v main | grep -v develop | xargs git branch -d

   # c. 定期运行清理（每周）
   # d. 在 CI/CD 中自动删除已合并的远程分支
   ```

4. **代码审查响应慢问题**
   ```markdown
   # 解决方案：
   # a. 制定审查时效规范
   - P0（紧急）：2 小时
   - P1（高）：当天
   - P2（中）：2 个工作日

   # b. 使用轮换制分配审查者
   # c. 限制 PR 大小（< 400 行）
   # d. 引入结对编程，减少审查需求
   # e. 使用自动化工具（linter、测试）减少人工审查负担
   ```

</details>

### 练习 4：设计团队工作流

为一个 10 人的全栈开发团队设计 Git 工作流，项目特点：
- Web 应用，前后端分离
- 每两周一个迭代
- 需要在预发布环境测试
- 偶尔需要紧急修复

<details>
<summary>查看答案</summary>

```markdown
# 团队 Git 工作流设计

## 分支策略：Git Flow 变体

### 主分支
- `main`: 生产环境代码
- `develop`: 开发环境代码
- `staging`: 预发布环境代码（可选）

### 临时分支
- `feature/*`: 功能开发
- `bugfix/*`: Bug 修复
- `hotfix/*`: 紧急修复
- `release/*`: 发布准备

## 开发流程

### 日常开发
1. 从 develop 创建功能分支
2. 开发完成后创建 PR 到 develop
3. 代码审查（至少 1 人）
4. 合并策略：Squash and Merge
5. 自动部署到开发环境

### 发布流程（每两周）
1. 从 develop 创建 release/x.x.x
2. 在 staging 环境测试
3. 修复测试发现的问题（只提交到 release 分支）
4. 测试通过后：
   - 合并到 main（使用 merge commit）
   - 打 tag
   - 部署到生产环境
   - 合并回 develop
5. 删除 release 分支

### 紧急修复流程
1. 从 main 创建 hotfix/*
2. 修复并测试
3. 合并到 main 和 develop
4. 打 tag
5. 立即部署到生产环境

## 规范

### 分支命名
- feature/<JIRA-ID>-<description>
- bugfix/<JIRA-ID>-<description>
- hotfix/<version>

### 提交信息
- 遵循 Conventional Commits
- 必须包含 JIRA ticket 编号

### 代码审查
- 所有 PR 需要至少 1 个审批
- 审查时效：2 个工作日内
- PR 大小：不超过 400 行

### 分支保护
- main 和 develop 保护
- 禁止直接推送
- 禁止强制推送
- PR 合并前必须：
  - 通过 CI 检查
  - 获得审批
  - 分支已更新

## 自动化

### CI/CD
- PR 自动运行测试和 lint
- develop 分支自动部署到开发环境
- staging 分支自动部署到预发布环境
- main 分支自动部署到生产环境

### 自动化检查
- commitlint
- ESLint / Prettier
- 单元测试（覆盖率 > 80%）
- E2E 测试

### 自动化管理
- 合并后自动删除分支
- 每周自动清理本地分支
- 自动生成 CHANGELOG
```

</details>

## 延伸阅读

- [Git Flow 原文](https://nvie.com/posts/a-successful-git-branching-model/)
- [GitHub Flow](https://docs.github.com/en/get-started/quickstart/github-flow)
- [GitLab Flow](https://docs.gitlab.com/ee/topics/gitlab_flow.html)
- [Trunk Based Development](https://trunkbaseddevelopment.com/)
- [Comparing Git Workflows](https://www.atlassian.com/git/tutorials/comparing-workflows)

## 总结

- ✅ 选择适合团队的工作流程
- ✅ 制定清晰的分支和合并策略
- ✅ 频繁同步避免冲突
- ✅ 规范化提交和 PR 流程
- ✅ 加强团队沟通和文档
- ✅ 使用自动化工具辅助协作

下一节：[安全实践](../security) →
