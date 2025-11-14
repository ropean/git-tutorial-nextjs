---
title: "提交规范"
weight: 1
next: /docs/best-practices/branch-naming
---

# 提交规范

良好的提交信息是团队协作的基石。规范的提交信息能让团队成员快速理解代码变更的目的和影响范围。

## 为什么需要规范的提交信息

### 提升代码审查效率

```bash
# ❌ 不好的提交信息
git commit -m "fix bug"
git commit -m "update"
git commit -m "修改了一些东西"

# ✅ 好的提交信息
git commit -m "fix: 修复用户登录时的空指针异常"
git commit -m "feat: 添加用户头像上传功能"
git commit -m "docs: 更新 API 文档中的认证说明"
```

### 便于追踪历史

规范的提交信息让 `git log` 和 `git blame` 更有价值：

```bash
# 快速查找特定类型的提交
git log --oneline --grep="^feat:"
git log --oneline --grep="^fix:"

# 查看某个功能的完整历史
git log --oneline --grep="用户认证"
```

### 自动化工具支持

- 自动生成 CHANGELOG
- 语义化版本管理
- CI/CD 触发条件
- 问题追踪集成

## Conventional Commits 规范

Conventional Commits 是目前最流行的提交信息规范。

### 基本格式

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Type 类型

| Type | 说明 | 示例 |
|------|------|------|
| `feat` | 新功能 | feat: 添加用户注册功能 |
| `fix` | Bug 修复 | fix: 修复支付金额计算错误 |
| `docs` | 文档变更 | docs: 更新安装指南 |
| `style` | 代码格式（不影响功能） | style: 格式化代码缩进 |
| `refactor` | 重构（既不是新功能也不是修复） | refactor: 重构用户服务层 |
| `perf` | 性能优化 | perf: 优化数据库查询性能 |
| `test` | 测试相关 | test: 添加用户登录单元测试 |
| `build` | 构建系统或外部依赖 | build: 升级 webpack 到 5.0 |
| `ci` | CI 配置文件和脚本 | ci: 添加 GitHub Actions 工作流 |
| `chore` | 其他不修改源代码的更改 | chore: 更新 .gitignore |
| `revert` | 回退之前的提交 | revert: 回退 feat: 添加实验性功能 |

### Scope 范围（可选）

指定提交影响的范围：

```bash
feat(auth): 添加 OAuth2 登录支持
fix(payment): 修复支付回调处理逻辑
docs(api): 更新 REST API 文档
```

常见的 scope 示例：
- 功能模块：`auth`, `payment`, `order`, `user`
- 技术层面：`api`, `ui`, `database`, `config`
- 文件或组件：`navbar`, `footer`, `home-page`

### Description 描述

- 使用**祈使句**，现在时态
- 首字母**小写**
- 句末**不加句号**
- 简洁明了，不超过 50 个字符（中文约 25 个字）

```bash
# ✅ 推荐
git commit -m "feat: 添加邮箱验证功能"
git commit -m "fix: 修复内存泄漏问题"

# ❌ 不推荐
git commit -m "feat: 添加了邮箱验证功能。"  # 过去式 + 句号
git commit -m "feat: 添加邮箱验证功能，用户注册时需要验证邮箱才能激活账户"  # 太长
```

### Body 正文（可选）

详细描述**为什么**做这个变更，而不是**如何**做的：

```bash
git commit -m "feat: 添加用户会话超时机制

由于安全审计发现长时间会话存在风险，现添加 30 分钟
无操作自动登出功能。

- 添加会话超时配置
- 实现自动续期机制
- 添加登出前警告提示"
```

### Footer 脚注（可选）

用于关联问题、标记破坏性变更等：

```bash
# 关联 Issue
git commit -m "fix: 修复支付异常

修复在高并发情况下支付状态不一致的问题。

Closes #123"

# 破坏性变更
git commit -m "feat!: 重构用户 API

BREAKING CHANGE:
API 端点从 /api/users 改为 /api/v2/users，
旧版本 API 将在 2024-12-31 下线。

Closes #456"
```

## Angular 提交规范

Angular 团队的提交规范是 Conventional Commits 的重要参考。

### 完整示例

```
feat(compiler): 添加模板类型检查支持

实现了更严格的模板类型检查，可以在编译时发现更多错误。

新增配置选项：
- strictTemplates: 启用严格模板检查
- strictInputTypes: 严格输入属性类型检查

这将帮助开发者更早发现类型相关的问题。

Closes #12345
```

### 多行提交信息编写

使用编辑器编写复杂的提交信息：

```bash
# 使用默认编辑器
git commit

# 指定编辑器
git config --global core.editor "vim"
git config --global core.editor "code --wait"  # VS Code
```

在编辑器中：

```
feat(auth): 实现双因素认证

添加基于 TOTP 的双因素认证功能，提升账户安全性。

主要变更：
- 添加 TOTP 生成和验证逻辑
- 实现绑定和解绑流程
- 添加备用恢复码机制
- 更新用户设置页面

技术选型：
使用 speakeasy 库生成 TOTP 令牌，兼容 Google Authenticator
和 Authy 等主流验证器应用。

安全考虑：
- 恢复码使用 bcrypt 加密存储
- 绑定时需要验证当前密码
- 添加操作审计日志

测试覆盖：
- 单元测试：TOTP 生成和验证
- 集成测试：完整的绑定流程
- E2E 测试：用户界面交互

Closes #789
Refs #234
```

## 提交信息模板

### 创建模板文件

```bash
# 创建模板文件
cat > ~/.gitmessage << 'EOF'
# <type>[optional scope]: <description>
#
# [optional body]
#
# [optional footer(s)]
#
# Type 类型：
#   feat:     新功能
#   fix:      Bug 修复
#   docs:     文档变更
#   style:    代码格式
#   refactor: 重构
#   perf:     性能优化
#   test:     测试相关
#   chore:    其他变更
#
# 注意事项：
# - 第一行不超过 50 个字符
# - 使用祈使句，现在时态
# - Body 详细说明"为什么"而不是"如何"
# - Footer 用于关联 Issue: Closes #123
EOF

# 配置使用模板
git config --global commit.template ~/.gitmessage
```

### 使用模板

```bash
# 执行 git commit 会自动加载模板
git commit

# 编辑器中会显示模板内容，填写后保存即可
```

### 项目级模板

```bash
# 在项目根目录创建模板
cat > .gitmessage << 'EOF'
# <type>(<scope>): <subject>
#
# <body>
#
# <footer>
#
# 项目特定规范：
# - 所有提交必须关联 JIRA ticket: PROJECT-123
# - 破坏性变更必须在 footer 中说明
# - 使用中文编写提交信息
EOF

# 配置项目使用该模板
git config commit.template .gitmessage
```

## commitlint 工具

自动检查提交信息是否符合规范。

### 安装配置

```bash
# 安装 commitlint
npm install --save-dev @commitlint/cli @commitlint/config-conventional

# 创建配置文件
echo "module.exports = {extends: ['@commitlint/config-conventional']}" > commitlint.config.js
```

### 配置 Git Hook

使用 husky 在提交时自动检查：

```bash
# 安装 husky
npm install --save-dev husky

# 启用 Git hooks
npx husky install

# 添加 commit-msg hook
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit ${1}'
```

### 自定义规则

```javascript
// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'build',
        'ci',
        'chore',
        'revert'
      ]
    ],
    'subject-case': [0],  // 不限制大小写（支持中文）
    'subject-max-length': [2, 'always', 100],  // 最长 100 字符
    'scope-enum': [
      2,
      'always',
      ['auth', 'payment', 'order', 'user', 'api', 'ui', 'db']
    ]
  }
};
```

### 测试配置

```bash
# 测试提交信息
echo "feat: 添加新功能" | npx commitlint

# 测试不符合规范的信息
echo "bad commit" | npx commitlint
```

## 自动生成 CHANGELOG

使用标准化的提交信息自动生成更新日志。

### 使用 standard-version

```bash
# 安装
npm install --save-dev standard-version

# 添加到 package.json
{
  "scripts": {
    "release": "standard-version"
  }
}

# 执行发布
npm run release
```

这会：
1. 基于提交信息更新 CHANGELOG.md
2. 自动升级版本号（遵循语义化版本）
3. 创建一个新的提交和标签

### CHANGELOG 示例

```markdown
# Changelog

## [2.1.0](https://github.com/example/repo/compare/v2.0.0...v2.1.0) (2024-11-14)

### Features

* **auth:** 添加双因素认证支持 ([abc1234](https://github.com/example/repo/commit/abc1234))
* **payment:** 集成支付宝支付 ([def5678](https://github.com/example/repo/commit/def5678))

### Bug Fixes

* **order:** 修复订单状态更新问题 ([ghi9012](https://github.com/example/repo/commit/ghi9012))
* **ui:** 修复移动端样式错误 ([jkl3456](https://github.com/example/repo/commit/jkl3456))

## [2.0.0](https://github.com/example/repo/compare/v1.0.0...v2.0.0) (2024-11-01)

### ⚠ BREAKING CHANGES

* API 端点从 v1 迁移到 v2

### Features

* 重构用户认证系统 ([mno7890](https://github.com/example/repo/commit/mno7890))
```

### conventional-changelog

```bash
# 安装
npm install --save-dev conventional-changelog-cli

# 生成 CHANGELOG
npx conventional-changelog -p angular -i CHANGELOG.md -s

# 生成所有历史的 CHANGELOG
npx conventional-changelog -p angular -i CHANGELOG.md -s -r 0
```

### 配置选项

```json
// package.json
{
  "standard-version": {
    "types": [
      {"type": "feat", "section": "✨ 新功能"},
      {"type": "fix", "section": "🐛 Bug 修复"},
      {"type": "perf", "section": "⚡ 性能优化"},
      {"type": "docs", "section": "📝 文档", "hidden": false},
      {"type": "style", "section": "💄 代码样式", "hidden": true},
      {"type": "refactor", "section": "♻️ 代码重构"},
      {"type": "test", "section": "✅ 测试", "hidden": true},
      {"type": "build", "section": "📦 构建", "hidden": true},
      {"type": "ci", "section": "👷 CI", "hidden": true},
      {"type": "chore", "section": "🔧 其他", "hidden": true}
    ]
  }
}
```

## 实战技巧

### 原子化提交

每个提交应该是一个**逻辑单元**：

```bash
# ❌ 不好：混合多个不相关的更改
git add .
git commit -m "feat: 添加登录功能，修复支付bug，更新文档"

# ✅ 好：分成多个提交
git add src/auth/
git commit -m "feat: 添加用户登录功能"

git add src/payment/
git commit -m "fix: 修复支付金额计算错误"

git add docs/
git commit -m "docs: 更新 API 文档"
```

### 使用 git add -p

交互式选择要提交的代码块：

```bash
# 分块添加更改
git add -p

# Git 会逐个显示更改，你可以选择：
# y - 添加这个块
# n - 不添加这个块
# s - 分割成更小的块
# e - 手动编辑这个块
# q - 退出
```

### 修改最后一次提交

```bash
# 修改提交信息
git commit --amend

# 添加遗漏的文件（不改变提交信息）
git add forgotten-file.js
git commit --amend --no-edit
```

⚠️ **注意**：只在**未推送**的提交上使用 `--amend`。

### 提交前自动格式化

```bash
# .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# 运行代码格式化
npm run format

# 运行 lint 检查
npm run lint

# 运行测试
npm run test
```

## 团队实践建议

### 1. 制定团队规范文档

```markdown
# Git 提交规范

## 提交信息格式

所有提交必须遵循 Conventional Commits 规范。

## Type 使用规范

- `feat`: 用户可见的新功能
- `fix`: 用户可见的 bug 修复
- `refactor`: 代码重构（不改变外部行为）
- `docs`: 仅文档更新
- `test`: 仅测试代码

## Scope 定义

- `web`: Web 前端
- `api`: 后端 API
- `mobile`: 移动端
- `admin`: 管理后台

## 强制要求

- 所有提交必须关联 Jira ticket
- 破坏性变更必须明确标注
- 提交信息使用中文
```

### 2. Code Review 检查清单

- [ ] 提交信息是否符合规范
- [ ] 每个提交是否是一个逻辑单元
- [ ] 是否有不相关的文件被提交
- [ ] 提交信息是否准确描述了变更

### 3. 自动化检查

```yaml
# .github/workflows/commit-lint.yml
name: Commit Lint

on: [pull_request]

jobs:
  commitlint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      - uses: wagoid/commitlint-github-action@v5
```

## 练习题

### 练习 1：识别提交规范

判断以下提交信息是否符合 Conventional Commits 规范：

```bash
1. "fix: 修复登录bug"
2. "添加了用户注册功能"
3. "feat(auth): add OAuth2 support"
4. "Fix Bug"
5. "docs: 更新 README.md 文档"
6. "feat: 添加支付功能，修复订单bug"
```

<details>
<summary>查看答案</summary>

1. ✅ 符合：正确的 type 和描述
2. ❌ 不符合：缺少 type 前缀
3. ✅ 符合：type、scope 和描述都正确（描述使用英文也可以）
4. ❌ 不符合：type 首字母应小写，描述不够具体
5. ✅ 符合：正确的格式
6. ❌ 不符合：一个提交包含两个不相关的更改，应该拆分

</details>

### 练习 2：改进提交信息

改进以下提交信息：

```bash
git commit -m "update"
git commit -m "修复了一些问题"
git commit -m "feat: 我今天添加了一个很棒的新功能，这个功能可以让用户上传头像，并且会自动压缩图片"
```

<details>
<summary>查看答案</summary>

```bash
# 第一个：说明具体更新了什么
git commit -m "docs: 更新安装指南中的环境要求"

# 第二个：具体说明修复了什么问题
git commit -m "fix: 修复用户登录时的会话过期问题"

# 第三个：简化描述，详细信息放在 body
git commit -m "feat: 添加用户头像上传功能

支持用户上传并设置个人头像。

功能特性：
- 支持 JPG、PNG 格式
- 自动压缩大于 2MB 的图片
- 生成多个尺寸的缩略图"
```

</details>

### 练习 3：配置 commitlint

在项目中配置 commitlint，要求：
- 使用 Conventional Commits 规范
- Scope 限制为：`web`, `api`, `mobile`, `docs`
- 支持中文提交信息
- 提交信息最长 100 字符

<details>
<summary>查看答案</summary>

```bash
# 1. 安装依赖
npm install --save-dev @commitlint/cli @commitlint/config-conventional husky

# 2. 创建配置文件
cat > commitlint.config.js << 'EOF'
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', 'fix', 'docs', 'style', 'refactor',
        'perf', 'test', 'build', 'ci', 'chore', 'revert'
      ]
    ],
    'scope-enum': [
      2,
      'always',
      ['web', 'api', 'mobile', 'docs']
    ],
    'subject-case': [0],  // 支持中文
    'subject-max-length': [2, 'always', 100]
  }
};
EOF

# 3. 配置 husky
npx husky install
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit ${1}'

# 4. 测试
echo "feat(web): 添加新功能" | npx commitlint  # 应该通过
echo "feat(xxx): 添加新功能" | npx commitlint  # 应该失败（scope 不在允许列表中）
```

</details>

### 练习 4：编写完整提交

为以下场景编写完整的提交信息：

**场景**：你重构了用户认证模块，将 Session 认证改为 JWT 认证。这是一个破坏性变更，需要客户端更新请求头。这个更改关联了 Issue #456。

<details>
<summary>查看答案</summary>

```bash
git commit -m "refactor(auth)!: 将认证方式从 Session 改为 JWT

为了支持移动端和微服务架构，将认证方式从传统的
Session 改为无状态的 JWT Token。

主要变更：
- 移除 express-session 依赖
- 实现 JWT token 生成和验证
- 更新认证中间件
- 添加 token 刷新机制

BREAKING CHANGE:
客户端需要更新请求方式：
- 不再发送 Cookie
- 需要在请求头中添加：Authorization: Bearer <token>
- Token 有效期为 7 天，需要实现刷新逻辑

迁移指南详见：docs/migration/session-to-jwt.md

Closes #456"
```

</details>

## 延伸阅读

- [Conventional Commits 规范](https://www.conventionalcommits.org/)
- [Angular 提交信息规范](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit)
- [How to Write a Git Commit Message](https://chris.beams.io/posts/git-commit/)
- [Semantic Versioning](https://semver.org/)
- [commitlint 文档](https://commitlint.js.org/)

## 总结

- ✅ 使用 Conventional Commits 规范
- ✅ 每个提交是一个逻辑单元
- ✅ 提交信息要简洁清晰
- ✅ 使用工具自动化检查
- ✅ 团队统一规范标准

下一节：[分支命名](../branch-naming) →
