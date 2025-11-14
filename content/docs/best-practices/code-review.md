---
title: "代码审查"
weight: 3
prev: /docs/best-practices/branch-naming
next: /docs/best-practices/team-workflow
---

# 代码审查

代码审查（Code Review）是软件开发中确保代码质量的重要环节，通过同行评审可以发现潜在问题、分享知识、提升团队整体水平。

## 代码审查的重要性

### 提升代码质量

```bash
# 在合并前发现问题
# 审查者可能发现的问题：
- 逻辑错误
- 边界条件未处理
- 性能问题
- 安全漏洞
- 代码重复
```

### 知识分享

- 让团队成员了解代码库的不同部分
- 学习不同的编程技巧和最佳实践
- 统一团队的代码风格
- 新人快速融入团队

### 降低风险

- 多人检查，减少 bug
- 确保代码符合规范
- 防止引入技术债务
- 避免安全漏洞

### 提升团队协作

- 促进技术交流
- 建立团队标准
- 提升相互信任
- 培养责任感

## Pull Request 最佳实践

### 创建优质的 PR

#### 1. 保持 PR 小而专注

```bash
# ❌ 不好：一个 PR 包含多个不相关的更改
feat: add user login + fix payment bug + update docs

# ✅ 好：每个 PR 专注于一个任务
feat: add user login functionality
fix: correct payment calculation
docs: update API documentation
```

**原则**：
- 一个 PR 应该只做一件事
- 代码变更不超过 400 行（理想情况）
- 可以在 30 分钟内完成审查

#### 2. 编写清晰的 PR 描述

```markdown
## 标题
feat(auth): 添加双因素认证功能

## 描述
实现基于 TOTP 的双因素认证，提升账户安全性。

## 变更内容
- 添加 TOTP 生成和验证逻辑
- 实现绑定/解绑流程
- 添加用户设置页面
- 更新认证中间件

## 测试
- [x] 单元测试：TOTP 生成和验证
- [x] 集成测试：完整的认证流程
- [x] 手动测试：在移动端验证器中测试

## 截图
[功能演示截图]

## 相关 Issue
Closes #789

## 检查清单
- [x] 代码已通过 lint 检查
- [x] 添加了相应的测试
- [x] 更新了文档
- [x] 本地测试通过
```

#### 3. PR 模板

在仓库中创建 PR 模板：

```markdown
<!-- .github/pull_request_template.md -->

## 变更类型
<!-- 请勾选相关选项 -->
- [ ] 🚀 新功能 (feature)
- [ ] 🐛 Bug 修复 (fix)
- [ ] 📝 文档更新 (docs)
- [ ] 💄 代码格式 (style)
- [ ] ♻️ 代码重构 (refactor)
- [ ] ⚡️ 性能优化 (perf)
- [ ] ✅ 测试相关 (test)

## 描述
<!-- 清晰描述这个 PR 做了什么 -->

## 动机和背景
<!-- 为什么需要这个更改？解决了什么问题？ -->

Closes # (issue 编号)

## 变更详情
<!-- 列出主要的代码变更 -->

-
-
-

## 测试方式
<!-- 描述如何测试这些更改 -->

- [ ] 单元测试
- [ ] 集成测试
- [ ] 手动测试

## 截图（如果适用）
<!-- 添加截图帮助说明 -->

## 检查清单
- [ ] 代码遵循项目的代码规范
- [ ] 进行了自我审查
- [ ] 代码已添加注释，特别是难以理解的部分
- [ ] 文档已相应更新
- [ ] 没有产生新的警告
- [ ] 添加了测试证明修复有效或功能可用
- [ ] 新旧测试都通过
- [ ] 依赖的更改已合并并发布
```

#### 4. 自我审查

提交 PR 前先自己审查：

```bash
# 查看所有更改
git diff develop...HEAD

# 使用 GitHub CLI 查看 diff
gh pr diff

# 逐个文件审查
git diff develop...HEAD -- path/to/file
```

**自我审查清单**：
- [ ] 所有更改都是必要的吗？
- [ ] 是否有调试代码或注释的代码？
- [ ] 是否有遗漏的文件？
- [ ] 测试是否充分？
- [ ] 文档是否更新？
- [ ] 是否符合团队规范？

#### 5. 保持 PR 更新

```bash
# 定期从目标分支更新
git checkout feature/my-feature
git fetch origin
git merge origin/develop

# 或者使用 rebase（保持提交历史整洁）
git rebase origin/develop

# 解决冲突后推送
git push origin feature/my-feature --force-with-lease
```

### PR 工作流程

#### 1. 创建 PR

```bash
# 推送分支
git push origin feature/user-login

# 使用 GitHub CLI 创建 PR
gh pr create \
  --title "feat: 添加用户登录功能" \
  --body "实现用户名/密码登录功能" \
  --base develop \
  --head feature/user-login

# 添加审查者
gh pr create --reviewer alice,bob

# 添加标签
gh pr create --label "feature,backend"
```

#### 2. 代码审查阶段

```bash
# 查看 PR
gh pr view 123

# 查看 PR diff
gh pr diff 123

# 检出 PR 到本地测试
gh pr checkout 123

# 添加评论
gh pr comment 123 --body "LGTM! 👍"

# 请求更改
gh pr review 123 --request-changes --body "请修复 XYZ 问题"

# 批准 PR
gh pr review 123 --approve --body "代码看起来很好"
```

#### 3. 处理反馈

```bash
# 根据反馈修改代码
git add .
git commit -m "fix: 根据审查意见修复问题"
git push origin feature/user-login

# 回复评论
gh pr comment 123 --body "已修复，请再次审查"
```

#### 4. 合并 PR

```bash
# 合并 PR（merge commit）
gh pr merge 123 --merge

# 或使用 squash merge（将所有提交压缩为一个）
gh pr merge 123 --squash

# 或使用 rebase merge（保持线性历史）
gh pr merge 123 --rebase

# 合并后自动删除分支
gh pr merge 123 --merge --delete-branch
```

## 审查者指南

### 审查流程

#### 1. 理解背景

```bash
# 阅读 PR 描述和相关 Issue
gh pr view 123

# 查看相关的讨论
gh pr view 123 --comments

# 了解变更范围
gh pr diff 123
```

#### 2. 检出代码本地测试

```bash
# 检出 PR
gh pr checkout 123

# 运行测试
npm test

# 本地启动项目
npm start

# 手动测试功能
```

#### 3. 审查代码

**审查重点**：

##### 功能性
- [ ] 代码是否实现了预期功能？
- [ ] 是否正确处理了边界情况？
- [ ] 是否有潜在的 bug？

##### 设计
- [ ] 设计是否合理？
- [ ] 是否符合项目架构？
- [ ] 是否可以简化？

##### 可读性
- [ ] 代码是否易于理解？
- [ ] 变量和函数命名是否清晰？
- [ ] 是否需要更多注释？

##### 测试
- [ ] 是否有足够的测试覆盖？
- [ ] 测试是否有意义？
- [ ] 边界情况是否被测试？

##### 性能
- [ ] 是否有性能问题？
- [ ] 是否有不必要的计算？
- [ ] 数据库查询是否优化？

##### 安全
- [ ] 是否有安全漏洞？
- [ ] 用户输入是否验证？
- [ ] 敏感信息是否保护？

#### 4. 提供反馈

**好的评论示例**：

```markdown
# ✅ 具体且建设性
❌ 这里有问题
✅ 这里的错误处理不够完善，建议添加对网络异常的处理

# ✅ 提供解决方案
❌ 这个函数太长了
✅ 这个函数职责较多，建议拆分为 validateUser() 和 createSession() 两个函数

# ✅ 解释原因
❌ 不应该这样写
✅ 直接修改 props 会导致 React 无法检测到变化，建议使用 setState()

# ✅ 使用疑问句而非命令句
❌ 改用 const
✅ 这里是否可以用 const 替代 let？这个变量似乎没有被重新赋值

# ✅ 认可好的代码
👍 这个抽象很优雅！
💡 这个边界情况处理得很好
📚 这个注释很有帮助
```

**评论类型标记**：

```markdown
[NIT] 小建议：可以使用更简洁的语法
[QUESTION] 疑问：为什么这里使用 any 类型？
[BLOCKING] 阻塞：这个安全问题必须修复
[SUGGESTION] 建议：考虑使用设计模式 X
[PRAISE] 赞赏：这个解决方案很巧妙！
```

#### 5. 使用 GitHub 代码审查功能

```bash
# 在线添加单行评论
# 点击代码行号 → 添加评论

# 添加多行评论
# 点击并拖动行号 → 添加评论

# 添加建议更改
```suggest
// 建议的代码
const result = data.map(item => item.value);
```
```

#### 6. 完成审查

```bash
# 批准 PR
gh pr review 123 --approve --body "LGTM! 代码质量很好"

# 请求更改
gh pr review 123 --request-changes --body "请解决以下问题：\n- 添加错误处理\n- 更新测试"

# 仅评论（不批准也不请求更改）
gh pr review 123 --comment --body "一些小建议，不阻塞合并"
```

### 审查时间建议

- 小 PR（< 100 行）：15-30 分钟
- 中等 PR（100-400 行）：30-60 分钟
- 大 PR（> 400 行）：建议拆分

### 审查优先级

```markdown
P0 - 紧急：生产环境修复
P1 - 高：阻塞其他开发的功能
P2 - 中：常规功能开发
P3 - 低：文档、重构等
```

## 贡献者指南

### 响应审查意见

#### 1. 积极回应

```bash
# 及时回复评论
# 即使还没有修复，也要确认收到

# 好的回复示例：
"感谢反馈！我会添加错误处理"
"好建议，我会重构这个函数"
"这里我考虑过，选择方案 A 是因为..."
```

#### 2. 修复问题

```bash
# 根据反馈修改代码
git add .
git commit -m "fix: 根据审查意见添加错误处理"

# 推送更新
git push origin feature/my-feature

# 标记评论为已解决
# 在 GitHub 上点击 "Resolve conversation"
```

#### 3. 讨论分歧

```markdown
# 如果不同意审查意见，礼貌地讨论

感谢建议！不过我有不同看法：

当前实现的优势：
- 性能更好（避免了额外的循环）
- 代码更简洁

建议方案的问题：
- 会增加 O(n) 的时间复杂度
- 在大数据量时可能有性能问题

是否可以考虑折中方案：在数据量小时使用建议方案，
数据量大时使用当前实现？
```

#### 4. 请求再次审查

```bash
# 修复完成后请求再次审查
gh pr ready 123

# 或添加评论通知审查者
gh pr comment 123 --body "@reviewer 已根据反馈修复，请再次审查"
```

### 避免常见错误

#### ❌ 不要防御性

```markdown
# ❌ 不好
"这只是临时代码，后面会改的"
"我知道不完美，但先这样吧"

# ✅ 好
"感谢指出，我会改进"
"这个建议很好，我立即修复"
```

#### ❌ 不要提交过大的 PR

```bash
# ❌ 不好：一次性提交太多更改
Changes: 1,500 lines added, 800 lines deleted across 45 files

# ✅ 好：拆分成多个 PR
PR #1: 重构数据层 (200 lines)
PR #2: 添加新 API (150 lines)
PR #3: 更新 UI (180 lines)
```

#### ❌ 不要忽略 CI 失败

```bash
# ❌ 不好：CI 失败但仍请求审查
❌ Tests failed
❌ Lint check failed
📝 Ready for review

# ✅ 好：修复 CI 后再请求审查
✅ All checks passed
📝 Ready for review
```

## 自动化审查工具

### 静态代码分析

#### ESLint (JavaScript/TypeScript)

```bash
# 安装
npm install --save-dev eslint

# 初始化配置
npx eslint --init

# 配置文件 .eslintrc.js
module.exports = {
  extends: ['eslint:recommended'],
  rules: {
    'no-console': 'warn',
    'no-unused-vars': 'error',
    'prefer-const': 'error'
  }
};

# 运行检查
npx eslint src/

# 自动修复
npx eslint src/ --fix
```

#### Prettier (代码格式化)

```bash
# 安装
npm install --save-dev prettier

# 配置文件 .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}

# 格式化代码
npx prettier --write "src/**/*.{js,jsx,ts,tsx}"
```

#### SonarQube (代码质量)

```yaml
# .github/workflows/sonarqube.yml
name: SonarQube Analysis

on:
  pull_request:
    branches: [main, develop]

jobs:
  sonarqube:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      - name: SonarQube Scan
        uses: SonarSource/sonarqube-scan-action@master
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
          SONAR_HOST_URL: ${{ secrets.SONAR_HOST_URL }}
```

### GitHub Actions 审查工作流

```yaml
# .github/workflows/code-review.yml
name: Code Review Checks

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  size-limit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: andresz1/size-limit-action@v1
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}

  pr-labels:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/labeler@v4
        with:
          repo-token: ${{ secrets.GITHUB_TOKEN }}
```

### 危险代码检测

```yaml
# .github/workflows/security.yml
name: Security Checks

on: [pull_request]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      # 依赖安全检查
      - name: Run Snyk
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

      # 密钥扫描
      - name: GitGuardian scan
        uses: GitGuardian/ggshield-action@master
        env:
          GITHUB_PUSH_BEFORE_SHA: ${{ github.event.before }}
          GITHUB_PUSH_BASE_SHA: ${{ github.event.base }}
          GITHUB_PULL_BASE_SHA: ${{ github.event.pull_request.base.sha }}
          GITHUB_DEFAULT_BRANCH: ${{ github.event.repository.default_branch }}
          GITGUARDIAN_API_KEY: ${{ secrets.GITGUARDIAN_API_KEY }}
```

### 自动化评论

```yaml
# .github/workflows/pr-comment.yml
name: PR Auto Comment

on:
  pull_request:
    types: [opened]

jobs:
  comment:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/github-script@v6
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '👋 感谢你的贡献！\n\n请确保：\n- ✅ 所有测试通过\n- ✅ 代码已通过 lint 检查\n- ✅ 更新了相关文档\n\n审查者会尽快查看你的 PR。'
            })
```

## 团队审查文化

### 建立审查规范

```markdown
# 代码审查规范

## 审查时效

- P0（紧急）：2 小时内
- P1（高优先级）：当天
- P2（常规）：2 个工作日内
- P3（低优先级）：1 周内

## 审查者数量

- 关键功能：至少 2 名审查者
- 常规功能：至少 1 名审查者
- 文档更新：至少 1 名审查者

## 审查原则

1. **尊重**：礼貌、建设性的反馈
2. **及时**：在规定时间内完成审查
3. **专注**：审查时不分心
4. **学习**：审查也是学习的机会
5. **质量**：不降低标准

## 合并要求

- [ ] 至少 1 个批准
- [ ] 所有检查通过
- [ ] 没有未解决的讨论
- [ ] 分支已更新到最新
```

### 培养审查技能

#### 新人审查培训

```markdown
# 代码审查培训计划

## 第 1 周：观察
- 阅读团队的 PR
- 观察审查者如何提供反馈
- 学习审查清单

## 第 2 周：参与
- 在有经验的审查者指导下参与审查
- 添加评论（标记为学习性质）

## 第 3 周：实践
- 独立审查小型 PR
- 获得反馈和指导

## 第 4 周：独立
- 独立审查各类 PR
- 定期回顾和改进
```

#### 审查指导文档

```markdown
# 审查清单

## 功能性
- [ ] 代码实现了预期功能
- [ ] 边界情况得到处理
- [ ] 错误处理完善

## 代码质量
- [ ] 代码易于理解
- [ ] 命名清晰有意义
- [ ] 无重复代码
- [ ] 符合 SOLID 原则

## 测试
- [ ] 有足够的单元测试
- [ ] 测试覆盖率达标
- [ ] 测试有意义且易维护

## 安全
- [ ] 输入验证完善
- [ ] 无 SQL 注入风险
- [ ] 无 XSS 漏洞
- [ ] 敏感信息已保护

## 性能
- [ ] 无明显性能问题
- [ ] 数据库查询优化
- [ ] 缓存策略合理

## 文档
- [ ] 代码注释充分
- [ ] API 文档已更新
- [ ] README 已更新
```

## 练习题

### 练习 1：评估 PR 质量

评估以下 PR 描述的质量：

```markdown
## PR #1
Title: fix bug

Description: 修复了一个 bug
```

```markdown
## PR #2
Title: feat(payment): 集成支付宝支付

Description:
添加支付宝支付功能，支持扫码支付和 H5 支付。

变更内容：
- 集成支付宝 SDK
- 实现支付回调处理
- 添加支付记录存储
- 更新支付选择页面

测试：
- 单元测试：支付逻辑
- 集成测试：完整支付流程
- 手动测试：在沙箱环境测试支付

Closes #456
```

<details>
<summary>查看答案</summary>

**PR #1 的问题**：
- ❌ 标题不够具体
- ❌ 缺少 type 前缀
- ❌ 描述过于简单
- ❌ 没有说明修复了什么 bug
- ❌ 没有关联 Issue
- ❌ 没有测试信息

**PR #2 的优点**：
- ✅ 标题清晰，包含 type 和 scope
- ✅ 描述详细，说明了功能
- ✅ 列出了主要变更
- ✅ 包含测试信息
- ✅ 关联了 Issue

</details>

### 练习 2：改进审查评论

改进以下审查评论：

```markdown
# 评论 1
"这里有问题"

# 评论 2
"代码太乱了，重写吧"

# 评论 3
"不应该用 var"
```

<details>
<summary>查看答案</summary>

```markdown
# 评论 1 改进
这里的错误处理不够完善，当 API 返回 500 错误时会导致应用崩溃。
建议添加 try-catch 处理网络异常：

\```javascript
try {
  const response = await api.fetchData();
  return response.data;
} catch (error) {
  console.error('Failed to fetch data:', error);
  return null;
}
\```

# 评论 2 改进
这个函数承担了多个职责（验证、处理、存储），不太符合单一职责原则。
建议拆分为三个独立的函数：

1. `validateInput(data)` - 验证输入
2. `processData(data)` - 处理数据
3. `saveData(data)` - 存储数据

这样可以提高代码的可测试性和可维护性。

# 评论 3 改进
[NIT] 这里使用了 `var` 声明变量，建议改用 `const` 或 `let`：
- 这个变量在后续没有被重新赋值，使用 `const` 更合适
- `const` 可以防止意外的变量重新赋值
- 符合现代 JavaScript 最佳实践

\```javascript
const userId = getUserId();  // 推荐
\```
```

</details>

### 练习 3：配置自动化审查

为项目配置自动化代码审查，要求：
- PR 时自动运行 ESLint
- PR 时自动运行测试
- 测试覆盖率必须达到 80%
- 自动添加欢迎评论

<details>
<summary>查看答案</summary>

```yaml
# .github/workflows/pr-checks.yml
name: PR Checks

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  welcome:
    runs-on: ubuntu-latest
    if: github.event.action == 'opened'
    steps:
      - uses: actions/github-script@v6
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '👋 感谢贡献！请确保所有检查通过。'
            })

  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test -- --coverage
      - name: Check coverage
        run: |
          coverage=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
          if (( $(echo "$coverage < 80" | bc -l) )); then
            echo "Coverage $coverage% is below 80%"
            exit 1
          fi
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

</details>

## 延伸阅读

- [Google Engineering Practices - Code Review](https://google.github.io/eng-practices/review/)
- [How to Make Your Code Reviewer Fall in Love with You](https://mtlynch.io/code-review-love/)
- [The Art of Code Review](https://www.alexandra-hill.com/2018/06/25/the-art-of-giving-and-receiving-code-reviews/)
- [Pull Request Best Practices](https://www.atlassian.com/blog/git/written-unwritten-guide-pull-requests)

## 总结

- ✅ 创建小而专注的 PR
- ✅ 编写清晰的 PR 描述
- ✅ 及时响应审查意见
- ✅ 提供建设性的反馈
- ✅ 使用自动化工具辅助审查
- ✅ 培养良好的审查文化

下一节：[团队协作](../team-workflow) →
