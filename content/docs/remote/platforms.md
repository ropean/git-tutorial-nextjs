---
title: "常见平台"
weight: 6
bookToc: true
---

# 常见平台

深入了解 GitHub、GitLab、Gitee 等主流代码托管平台的使用方法和特色功能。

## GitHub 使用指南

**GitHub** 是全球最大的代码托管和协作平台。

### GitHub 基础

**创建仓库**：
```
1. 登录 GitHub
2. 点击右上角 "+" → "New repository"
3. 填写信息：
   - Repository name：仓库名称
   - Description：描述（可选）
   - Public/Private：公开/私有
   - Initialize with README：初始化README
   - .gitignore：选择模板
   - License：选择许可证
4. 点击 "Create repository"
```

**初始化推送**：
```bash
# 方案 1：从本地现有项目推送
cd existing-project
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/repo.git
git branch -M main
git push -u origin main

# 方案 2：克隆空仓库
git clone https://github.com/username/repo.git
cd repo
# ... 添加文件 ...
git add .
git commit -m "Initial commit"
git push origin main
```

### GitHub 核心功能

#### 1. Issues（问题跟踪）

**创建 Issue**：
```markdown
# Issue 标题
简短描述问题

## 描述
详细说明问题、期望行为和实际行为

## 重现步骤
1. 执行 xxx
2. 点击 xxx
3. 看到错误

## 环境
- OS: macOS 14.0
- Browser: Chrome 120
- Node: v20.0.0

## 截图
[如果适用，添加截图]

## 额外信息
其他相关信息
```

**Issue 模板**：
```markdown
# .github/ISSUE_TEMPLATE/bug_report.md
---
name: Bug Report
about: Create a report to help us improve
title: '[BUG] '
labels: bug
assignees: ''
---

## Describe the bug
A clear description of what the bug is.

## To Reproduce
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. See error

## Expected behavior
What you expected to happen.

## Screenshots
If applicable, add screenshots.

## Environment:
 - OS: [e.g. iOS]
 - Browser [e.g. chrome, safari]
 - Version [e.g. 22]
```

**使用标签**：
```
bug          - Bug 报告
enhancement  - 功能请求
documentation - 文档相关
good first issue - 新手友好
help wanted  - 需要帮助
duplicate    - 重复问题
wontfix      - 不会修复
```

#### 2. Pull Requests

**创建 PR**：
```
1. Fork 仓库或创建分支
2. 进行更改并推送
3. 访问仓库页面
4. 点击 "Compare & pull request"
5. 填写 PR 信息
6. 点击 "Create pull request"
```

**PR 模板**：
```markdown
# .github/PULL_REQUEST_TEMPLATE.md
## Description
Please include a summary of the changes.

## Type of change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## How Has This Been Tested?
Describe the tests you ran.

## Checklist:
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code
- [ ] I have made corresponding changes to docs
- [ ] My changes generate no new warnings
- [ ] I have added tests
- [ ] New and existing tests pass
```

**审查 PR**：
```
1. 查看 "Files changed"
2. 在代码行旁添加评论
3. 点击 "Review changes"
4. 选择：
   - Comment：仅评论
   - Approve：批准
   - Request changes：请求更改
5. 提交审查
```

#### 3. Actions（CI/CD）

**基本工作流**：
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
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'

    - name: Install dependencies
      run: npm ci

    - name: Run linter
      run: npm run lint

    - name: Run tests
      run: npm test

    - name: Build
      run: npm run build

    - name: Upload coverage
      uses: codecov/codecov-action@v3
```

**常用 Actions**：
```yaml
# 自动发布
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build
        run: npm run build

      - name: Create Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ github.ref }}
          release_name: Release ${{ github.ref }}
          draft: false
          prerelease: false
```

#### 4. Projects（项目管理）

**看板视图**：
```
创建项目：
1. 仓库 → Projects → New project
2. 选择模板：
   - Board：看板视图
   - Table：表格视图
   - Roadmap：路线图
3. 添加列：
   - To do
   - In progress
   - Done
4. 将 Issues/PRs 添加到看板
```

**自动化**：
```
设置自动化规则：
- 新 Issue → To do
- PR 创建 → In progress
- PR 合并 → Done
```

#### 5. Discussions（讨论）

**启用 Discussions**：
```
Settings → Features → Discussions → Enable
```

**讨论分类**：
```
Announcements  - 公告
General        - 一般讨论
Ideas          - 想法
Q&A            - 问答
Show and tell  - 展示和分享
```

#### 6. GitHub Pages

**部署静态网站**：
```bash
# 方法 1：直接从分支部署
# Settings → Pages → Source → Deploy from a branch
# 选择 main 分支的 /docs 文件夹

# 方法 2：使用 GitHub Actions
# .github/workflows/pages.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Build
        run: |
          npm ci
          npm run build

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

**访问网站**：
```
https://username.github.io/repo-name/
```

#### 7. Security（安全）

**Dependabot**：
```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
```

**Code Scanning**：
```yaml
# .github/workflows/codeql.yml
name: "CodeQL"

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Initialize CodeQL
        uses: github/codeql-action/init@v2

      - name: Autobuild
        uses: github/codeql-action/autobuild@v2

      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v2
```

**Secret Scanning**：
```
自动检测提交中的敏感信息：
- API 密钥
- 访问令牌
- 私钥
```

### GitHub 高级功能

#### 分支保护规则

```
Settings → Branches → Add rule

保护 main 分支：
☑ Require a pull request before merging
  ☑ Require approvals (1-6 个审查者)
  ☑ Dismiss stale pull request approvals
  ☑ Require review from Code Owners
☑ Require status checks to pass
  ☑ Require branches to be up to date
  ☑ 选择必须通过的检查
☑ Require conversation resolution
☑ Require signed commits
☑ Include administrators
☑ Restrict who can push
☑ Do not allow bypassing the above settings
```

#### CODEOWNERS

```
# .github/CODEOWNERS
# 默认所有者
*       @org/team-name

# 特定目录
/docs/  @org/docs-team
/src/   @org/dev-team

# 特定文件类型
*.js    @org/js-experts
*.css   @org/design-team

# 特定文件
package.json @org/leads
```

#### GitHub CLI

```bash
# 安装
brew install gh  # macOS
# 或从 https://cli.github.com/ 下载

# 登录
gh auth login

# 克隆仓库
gh repo clone owner/repo

# 创建仓库
gh repo create my-project --public

# 查看 Issue
gh issue list
gh issue view 123
gh issue create

# 管理 PR
gh pr list
gh pr view 456
gh pr create
gh pr checkout 456
gh pr review 456 --approve

# 查看工作流运行
gh run list
gh run view 789
```

## GitLab 使用指南

**GitLab** 是功能全面的 DevOps 平台。

### GitLab 特色

**完整的 DevOps 工具链**：
```
代码托管 → CI/CD → 测试 → 安全扫描 → 部署 → 监控
   ↓         ↓       ↓         ↓         ↓       ↓
  Git    Pipeline  Testing  Security   K8s   Metrics
```

### GitLab CI/CD

**.gitlab-ci.yml 示例**：
```yaml
# .gitlab-ci.yml
stages:
  - build
  - test
  - deploy

variables:
  NODE_VERSION: "20"

# 构建阶段
build:
  stage: build
  image: node:${NODE_VERSION}
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 hour

# 测试阶段
test:unit:
  stage: test
  image: node:${NODE_VERSION}
  script:
    - npm ci
    - npm run test:unit
  coverage: '/Lines\s*:\s*(\d+\.\d+)%/'

test:integration:
  stage: test
  image: node:${NODE_VERSION}
  script:
    - npm ci
    - npm run test:integration

# 部署阶段
deploy:staging:
  stage: deploy
  image: node:${NODE_VERSION}
  script:
    - npm run deploy:staging
  environment:
    name: staging
    url: https://staging.example.com
  only:
    - develop

deploy:production:
  stage: deploy
  image: node:${NODE_VERSION}
  script:
    - npm run deploy:production
  environment:
    name: production
    url: https://example.com
  only:
    - main
  when: manual  # 手动触发
```

### Merge Requests

**创建 MR**：
```
1. 推送分支
2. GitLab 提示创建 MR
3. 或：Repository → Merge Requests → New merge request
4. 选择源分支和目标分支
5. 填写 MR 信息
6. 设置：
   - Assignee：指定审查者
   - Labels：标签
   - Milestone：里程碑
   - Delete source branch：合并后删除源分支
7. 创建 MR
```

**MR 模板**：
```markdown
# .gitlab/merge_request_templates/default.md
## What does this MR do?

<!-- Briefly describe what this MR is about -->

## Related issues

<!-- Link related issues below. -->
Closes #

## Author's checklist

- [ ] Follow the style guide
- [ ] Add tests
- [ ] Update documentation
- [ ] Review own code changes

## Review checklist

- [ ] Code is readable and maintainable
- [ ] Tests are comprehensive
- [ ] Security has been considered
- [ ] Performance impact is acceptable
```

### GitLab Runner

**注册 Runner**：
```bash
# 安装 GitLab Runner
# Linux
sudo gitlab-runner register

# 填写信息
GitLab URL: https://gitlab.com
Registration token: [从项目设置获取]
Description: My Runner
Tags: docker,node
Executor: docker
Docker image: node:20
```

**自定义 Runner**：
```yaml
# .gitlab-ci.yml
build:
  tags:
    - docker
    - linux
  script:
    - npm run build
```

### Container Registry

**推送镜像**：
```bash
# 登录
docker login registry.gitlab.com

# 构建镜像
docker build -t registry.gitlab.com/username/project:latest .

# 推送镜像
docker push registry.gitlab.com/username/project:latest
```

**在 CI 中使用**：
```yaml
# .gitlab-ci.yml
build-docker:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
```

### 自托管 GitLab

**Docker 安装**：
```bash
# 使用 Docker Compose
# docker-compose.yml
version: '3'
services:
  gitlab:
    image: 'gitlab/gitlab-ce:latest'
    container_name: gitlab
    restart: always
    hostname: 'gitlab.example.com'
    environment:
      GITLAB_OMNIBUS_CONFIG: |
        external_url 'http://gitlab.example.com'
    ports:
      - '80:80'
      - '443:443'
      - '22:22'
    volumes:
      - './config:/etc/gitlab'
      - './logs:/var/log/gitlab'
      - './data:/var/opt/gitlab'

# 启动
docker-compose up -d

# 获取初始密码
docker exec -it gitlab grep 'Password:' /etc/gitlab/initial_root_password
```

## Gitee 使用指南

**Gitee（码云）**是国内领先的代码托管平台。

### Gitee 特点

**国内优势**：
```
✅ 访问速度快（国内服务器）
✅ 中文界面友好
✅ 免费私有仓库
✅ 集成国内工具
✅ 合规性好
```

### Gitee 基础操作

**创建仓库**：
```
1. 登录 Gitee
2. 点击右上角 "+" → 新建仓库
3. 填写信息：
   - 仓库名称
   - 介绍（可选）
   - 开源/私有
   - 初始化仓库
   - 选择 .gitignore
   - 选择开源许可证
4. 创建
```

**Pull Request**：
```
Gitee 称为 "Pull Request" 或 "PR"

1. Fork 仓库
2. 修改并推送
3. 点击 "Pull Request"
4. 填写信息
5. 创建 PR
6. 等待审查和合并
```

### Gitee Pages

**部署静态网站**：
```
1. 仓库 → 服务 → Gitee Pages
2. 选择分支和目录
3. 点击 "启动"
4. 访问：https://username.gitee.io/repo

注意：
- 免费版需要实名认证
- 更新需要手动触发部署
- 企业版支持自动部署
```

### Gitee Go（CI/CD）

**配置流水线**：
```yaml
# .gitee/workflows/ci.yml
name: CI

on:
  push:
    branches: [ master ]
  pull_request:
    branches: [ master ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2

    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '20'

    - name: Install
      run: npm install

    - name: Test
      run: npm test

    - name: Build
      run: npm run build
```

### Gitee vs GitHub

**功能对比**：

| 功能 | Gitee | GitHub |
|------|-------|--------|
| **免费私有仓库** | ✅ 无限 | ✅ 无限 |
| **访问速度（国内）** | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| **国际化** | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| **开源社区** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **CI/CD** | 企业版 | ✅ 免费 |
| **Pages** | ✅ | ✅ |
| **中文支持** | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| **企业功能** | ✅ 完善 | ✅ 完善 |

## 平台对比和选择

### 功能对比表

| 特性 | GitHub | GitLab | Gitee | Bitbucket |
|------|--------|--------|-------|-----------|
| **免费私有仓库** | ✅ | ✅ | ✅ | ✅ |
| **国内访问速度** | ⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| **CI/CD** | Actions | 内置 | 企业版 | Pipelines |
| **自托管** | ❌ | ✅ | 企业版 | ❌ |
| **开源社区** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **企业功能** | 完善 | 最完善 | 完善 | 完善 |
| **容器镜像仓库** | Packages | 内置 | 企业版 | ❌ |
| **Wiki** | ✅ | ✅ | ✅ | ✅ |
| **Issues** | ✅ | ✅ | ✅ | ✅ |
| **项目看板** | Projects | 内置 | 企业版 | ❌ |
| **代码审查** | ✅ | ✅ | ✅ | ✅ |
| **价格（企业版）** | $$ | $$$ | $ | $$ |

### 选择建议

**个人开发者**：
```markdown
## 首选：GitHub
- 全球最大的开源社区
- 最好的项目展示平台
- 免费 CI/CD
- 免费私有仓库

## 备选：Gitee
- 国内访问快
- 中文友好
- 适合国内协作
```

**开源项目**：
```markdown
## 首选：GitHub
- 最大的用户群体
- 最好的曝光度
- 完善的生态系统

## 考虑：同时镜像到 Gitee
- 方便国内用户访问
- 扩大影响力
```

**国内企业**：
```markdown
## 选择 1：Gitee 企业版
- 国内服务器，速度快
- 合规性好
- 价格相对便宜
- 本地化支持好

## 选择 2：自建 GitLab
- 完全掌控数据
- 定制化程度高
- 符合安全要求
- 完整的 DevOps 工具链

## 选择 3：GitHub Enterprise
- 全球标准
- 生态系统最好
- 人才熟悉度高
```

**跨国企业**：
```markdown
## 首选：GitHub Enterprise
- 全球统一平台
- 国际团队协作
- 完善的安全功能

## 备选：GitLab (自托管)
- 多地部署
- 完整的 DevOps
- 灵活的部署方式
```

### 多平台策略

**镜像仓库**：
```bash
# 配置多个远程仓库
git remote add github https://github.com/user/repo.git
git remote add gitee https://gitee.com/user/repo.git
git remote add gitlab https://gitlab.com/user/repo.git

# 推送到所有远程
git push github main
git push gitee main
git push gitlab main

# 或使用脚本
#!/bin/bash
# push-all.sh
git push github main
git push gitee main
git push gitlab main
```

**自动同步**：
```yaml
# GitHub Actions: 同步到 Gitee
name: Sync to Gitee

on:
  push:
    branches: [ main ]

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        with:
          fetch-depth: 0

      - name: Sync to Gitee
        uses: wearerequired/git-mirror-action@v1
        env:
          SSH_PRIVATE_KEY: ${{ secrets.GITEE_PRIVATE_KEY }}
        with:
          source-repo: "git@github.com:user/repo.git"
          destination-repo: "git@gitee.com:user/repo.git"
```

## 最佳实践

### 仓库设置

**README.md**：
```markdown
# Project Name

Brief description of your project.

## Features

- Feature 1
- Feature 2
- Feature 3

## Installation

```bash
npm install
```

## Usage

```bash
npm start
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## License

[MIT](LICENSE)
```

**LICENSE**：
```
选择合适的开源许可证：

MIT - 最宽松
Apache 2.0 - 专利保护
GPL v3 - Copyleft
BSD - 类似 MIT
```

**.gitignore**：
```bash
# 依赖
node_modules/
vendor/

# 构建产物
dist/
build/
*.exe

# 环境文件
.env
.env.local

# IDE
.vscode/
.idea/
*.swp

# 日志
*.log
logs/

# OS
.DS_Store
Thumbs.db
```

**CONTRIBUTING.md**：
```markdown
# 贡献指南

感谢你考虑为本项目做贡献！

## 如何贡献

1. Fork 仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 代码规范

- 使用 ESLint
- 编写测试
- 更新文档

## 提交信息规范

feat: 新功能
fix: 修复
docs: 文档
style: 格式
refactor: 重构
test: 测试
chore: 构建
```

### 安全实践

**保护敏感信息**：
```bash
# 使用环境变量
DATABASE_URL=postgresql://...
API_KEY=secret_key_here

# 使用 Secrets 管理
# GitHub: Settings → Secrets
# GitLab: Settings → CI/CD → Variables
# Gitee: 管理 → 仓库设置 → Secrets

# 在 CI 中使用
echo ${{ secrets.API_KEY }}
```

**依赖安全**：
```yaml
# Dependabot (GitHub)
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"

# 定期审计
npm audit
npm audit fix
```

### 团队协作

**分支策略**：
```
main/master    - 生产环境
develop        - 开发环境
feature/*      - 功能分支
hotfix/*       - 热修复分支
release/*      - 发布分支
```

**代码审查**：
```
要求：
- 至少 1 人审查
- CI 通过
- 无未解决的讨论
- 代码覆盖率不降低
```

## 下一步

学习了常见的代码托管平台后，你已经完成了「远程协作」章节的所有内容！

建议：
- 实践使用不同平台
- 参与开源项目
- 建立自己的项目作品集

继续学习：[高级主题](../../advanced/) →

---

## 💡 练习题

{{< expand "练习 1：GitHub Actions 实践" >}}
**问题**：为一个 Node.js 项目配置 GitHub Actions，要求：

1. 在 PR 时运行测试
2. 在 main 分支推送时部署到 GitHub Pages
3. 每周自动检查依赖更新

写出完整的 workflow 配置。

{{< expand "查看答案" >}}
**答案**：

**完整的 GitHub Actions 配置**：

```yaml
# .github/workflows/ci.yml
# CI 工作流：在 PR 时运行测试
name: CI

on:
  pull_request:
    branches: [ main, develop ]
  push:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
    - name: Checkout code
      uses: actions/checkout@v3

    - name: Setup Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run linter
      run: npm run lint

    - name: Run tests
      run: npm test

    - name: Run tests with coverage
      run: npm run test:coverage

    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/coverage-final.json
        flags: unittests
        name: codecov-umbrella

    - name: Build
      run: npm run build

# .github/workflows/deploy.yml
# 部署工作流：推送到 main 时部署到 GitHub Pages
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

# 设置 GITHUB_TOKEN 权限
permissions:
  contents: read
  pages: write
  id-token: write

# 只允许一个部署同时进行
concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  # 构建任务
  build:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout
      uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Build
      run: npm run build
      env:
        NODE_ENV: production

    - name: Setup Pages
      uses: actions/configure-pages@v3

    - name: Upload artifact
      uses: actions/upload-pages-artifact@v2
      with:
        path: './dist'

  # 部署任务
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build

    steps:
    - name: Deploy to GitHub Pages
      id: deployment
      uses: actions/deploy-pages@v2

# .github/workflows/dependency-review.yml
# 依赖审查：在 PR 时检查依赖安全
name: Dependency Review

on:
  pull_request:
    branches: [ main, develop ]

permissions:
  contents: read
  pull-requests: write

jobs:
  dependency-review:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v3

    - name: Dependency Review
      uses: actions/dependency-review-action@v3
      with:
        fail-on-severity: moderate
        comment-summary-in-pr: true

# .github/workflows/codeql.yml
# 代码安全扫描
name: CodeQL

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 0 * * 1'  # 每周一运行

jobs:
  analyze:
    runs-on: ubuntu-latest
    permissions:
      actions: read
      contents: read
      security-events: write

    strategy:
      fail-fast: false
      matrix:
        language: [ 'javascript' ]

    steps:
    - name: Checkout repository
      uses: actions/checkout@v3

    - name: Initialize CodeQL
      uses: github/codeql-action/init@v2
      with:
        languages: ${{ matrix.language }}

    - name: Autobuild
      uses: github/codeql-action/autobuild@v2

    - name: Perform CodeQL Analysis
      uses: github/codeql-action/analyze@v2

# .github/dependabot.yml
# Dependabot 配置：每周自动检查依赖更新
version: 2
updates:
  # npm 依赖
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "09:00"
      timezone: "Asia/Shanghai"
    open-pull-requests-limit: 10
    reviewers:
      - "your-username"
    assignees:
      - "your-username"
    labels:
      - "dependencies"
      - "automated"
    commit-message:
      prefix: "chore"
      include: "scope"
    # 版本更新策略
    versioning-strategy: increase

  # GitHub Actions 更新
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
    labels:
      - "dependencies"
      - "github-actions"
```

**package.json 脚本**：
```json
{
  "scripts": {
    "test": "jest",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "build": "webpack --mode production",
    "deploy": "gh-pages -d dist"
  },
  "jest": {
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
```

**项目结构**：
```
my-project/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml
│   │   ├── deploy.yml
│   │   ├── dependency-review.yml
│   │   └── codeql.yml
│   └── dependabot.yml
├── src/
├── tests/
├── dist/
├── package.json
└── README.md
```

**测试效果**：

```markdown
## 工作流触发场景

### 1. 创建 Pull Request
触发：
- ci.yml (运行测试)
- dependency-review.yml (检查依赖安全)
- codeql.yml (代码安全扫描)

结果：
✅ 所有测试通过
✅ 无安全问题
✅ 代码覆盖率 > 80%
→ PR 可以合并

### 2. 推送到 main 分支
触发：
- ci.yml (运行测试)
- deploy.yml (部署到 GitHub Pages)

结果：
✅ 测试通过
✅ 构建成功
✅ 部署到 https://username.github.io/repo
→ 网站更新

### 3. 每周一自动运行
触发：
- dependabot.yml (检查依赖更新)
- codeql.yml (安全扫描)

结果：
📦 创建依赖更新 PR
🔒 生成安全报告
→ 自动维护
```

**监控和通知**：
```yaml
# 添加通知（可选）
# .github/workflows/notify.yml
name: Notify on Failure

on:
  workflow_run:
    workflows: ["CI", "Deploy"]
    types: [completed]

jobs:
  notify:
    runs-on: ubuntu-latest
    if: ${{ github.event.workflow_run.conclusion == 'failure' }}
    steps:
      - name: Send notification
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: Workflow failed!
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

**检查清单**：
```markdown
## 设置检查清单

- [ ] 创建所有 workflow 文件
- [ ] 配置 Dependabot
- [ ] 在仓库设置中启用 GitHub Pages
- [ ] 设置分支保护规则
- [ ] 添加必需的 Secrets (如果需要)
- [ ] 测试每个 workflow
- [ ] 配置通知（可选）
```
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 2：GitLab CI/CD 流水线" >}}
**问题**：为一个 Web 应用配置 GitLab CI/CD，实现：

1. 多阶段构建（build、test、deploy）
2. 环境区分（staging、production）
3. Docker 镜像构建和推送
4. 手动审批生产部署

{{< expand "查看答案" >}}
**答案**：

**完整的 GitLab CI/CD 配置**：

```yaml
# .gitlab-ci.yml

# 定义阶段
stages:
  - build
  - test
  - package
  - deploy-staging
  - deploy-production

# 全局变量
variables:
  NODE_VERSION: "20"
  DOCKER_IMAGE: $CI_REGISTRY_IMAGE
  STAGING_URL: "https://staging.example.com"
  PRODUCTION_URL: "https://example.com"

# 缓存配置
cache:
  key: ${CI_COMMIT_REF_SLUG}
  paths:
    - node_modules/

# =====================================
# 构建阶段
# =====================================
build:
  stage: build
  image: node:${NODE_VERSION}
  script:
    - echo "Installing dependencies..."
    - npm ci
    - echo "Building application..."
    - npm run build
  artifacts:
    paths:
      - dist/
      - node_modules/
    expire_in: 1 hour
  only:
    - branches
  tags:
    - docker

# =====================================
# 测试阶段
# =====================================
test:unit:
  stage: test
  image: node:${NODE_VERSION}
  script:
    - echo "Running unit tests..."
    - npm run test:unit
  coverage: '/Lines\s*:\s*(\d+\.\d+)%/'
  artifacts:
    reports:
      junit: junit.xml
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml
  only:
    - branches
  tags:
    - docker

test:integration:
  stage: test
  image: node:${NODE_VERSION}
  services:
    - postgres:14
  variables:
    POSTGRES_DB: test_db
    POSTGRES_USER: test_user
    POSTGRES_PASSWORD: test_password
  script:
    - echo "Running integration tests..."
    - npm run test:integration
  only:
    - branches
  tags:
    - docker

test:lint:
  stage: test
  image: node:${NODE_VERSION}
  script:
    - echo "Running linter..."
    - npm run lint
  allow_failure: false
  only:
    - branches
  tags:
    - docker

test:security:
  stage: test
  image: node:${NODE_VERSION}
  script:
    - echo "Running security audit..."
    - npm audit --audit-level=moderate
  allow_failure: true
  only:
    - branches
  tags:
    - docker

# =====================================
# 打包阶段
# =====================================
package:docker:
  stage: package
  image: docker:latest
  services:
    - docker:dind
  before_script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
  script:
    - echo "Building Docker image..."
    - docker build -t $DOCKER_IMAGE:$CI_COMMIT_SHA .
    - docker build -t $DOCKER_IMAGE:latest .
    - echo "Pushing Docker image..."
    - docker push $DOCKER_IMAGE:$CI_COMMIT_SHA
    - docker push $DOCKER_IMAGE:latest
  only:
    - main
    - develop
  tags:
    - docker

# =====================================
# 部署到 Staging
# =====================================
deploy:staging:
  stage: deploy-staging
  image: alpine:latest
  before_script:
    - apk add --no-cache curl
  script:
    - echo "Deploying to staging environment..."
    - |
      curl -X POST \
        -H "Authorization: Bearer $DEPLOY_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{\"image\":\"$DOCKER_IMAGE:$CI_COMMIT_SHA\"}" \
        https://staging-deploy.example.com/deploy
    - echo "Deployment to staging completed"
  environment:
    name: staging
    url: $STAGING_URL
    on_stop: stop:staging
  only:
    - develop
  tags:
    - docker

stop:staging:
  stage: deploy-staging
  image: alpine:latest
  script:
    - echo "Stopping staging environment..."
  environment:
    name: staging
    action: stop
  when: manual
  only:
    - develop
  tags:
    - docker

# =====================================
# 部署到 Production
# =====================================
deploy:production:
  stage: deploy-production
  image: alpine:latest
  before_script:
    - apk add --no-cache curl
  script:
    - echo "Deploying to production environment..."
    - |
      curl -X POST \
        -H "Authorization: Bearer $DEPLOY_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{\"image\":\"$DOCKER_IMAGE:$CI_COMMIT_SHA\"}" \
        https://deploy.example.com/deploy
    - echo "Deployment to production completed"
  environment:
    name: production
    url: $PRODUCTION_URL
  only:
    - main
  when: manual  # 需要手动触发
  tags:
    - docker

# =====================================
# 回滚 Production
# =====================================
rollback:production:
  stage: deploy-production
  image: alpine:latest
  script:
    - echo "Rolling back production..."
    - |
      curl -X POST \
        -H "Authorization: Bearer $DEPLOY_TOKEN" \
        https://deploy.example.com/rollback
  environment:
    name: production
    url: $PRODUCTION_URL
  when: manual
  only:
    - main
  tags:
    - docker
```

**Dockerfile**：
```dockerfile
# Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# 复制依赖文件
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 生产镜像
FROM node:20-alpine

WORKDIR /app

# 复制构建产物
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

# 暴露端口
EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node healthcheck.js

# 启动应用
CMD ["node", "dist/server.js"]
```

**GitLab CI/CD 变量设置**：
```
Settings → CI/CD → Variables

添加以下变量：
- DEPLOY_TOKEN (Protected, Masked)
- CI_REGISTRY_USER (自动提供)
- CI_REGISTRY_PASSWORD (自动提供)
- DATABASE_URL_STAGING (Protected)
- DATABASE_URL_PRODUCTION (Protected, Masked)
```

**流水线可视化**：
```
Pipeline 执行流程：

develop 分支推送:
  build → test (unit, integration, lint, security)
    → package → deploy:staging

main 分支推送:
  build → test (unit, integration, lint, security)
    → package → deploy:production (手动)

特点：
- 自动化测试
- Docker 镜像构建
- 环境隔离
- 手动审批生产部署
- 支持回滚
```

**环境配置**：
```yaml
# config/staging.yml
database:
  url: ${DATABASE_URL_STAGING}

redis:
  url: ${REDIS_URL_STAGING}

# config/production.yml
database:
  url: ${DATABASE_URL_PRODUCTION}

redis:
  url: ${REDIS_URL_PRODUCTION}
```

**监控和告警**：
```yaml
# 添加部署后的健康检查
deploy:production:
  after_script:
    - |
      echo "Checking application health..."
      for i in {1..5}; do
        if curl -f https://example.com/health; then
          echo "Application is healthy"
          exit 0
        fi
        echo "Health check failed, retrying..."
        sleep 10
      done
      echo "Application health check failed"
      exit 1
```
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 3：多平台镜像仓库" >}}
**问题**：如何配置一个项目同时推送到 GitHub、GitLab 和 Gitee，并实现自动同步？

提供配置方案和自动化脚本。

{{< expand "查看答案" >}}
**答案**：

**方案 1：手动配置多个远程仓库**

```bash
# 1. 克隆主仓库（假设 GitHub 是主仓库）
git clone https://github.com/username/project.git
cd project

# 2. 添加其他远程仓库
git remote add gitee https://gitee.com/username/project.git
git remote add gitlab https://gitlab.com/username/project.git

# 3. 查看所有远程仓库
git remote -v
# origin    https://github.com/username/project.git (fetch)
# origin    https://github.com/username/project.git (push)
# gitee     https://gitee.com/username/project.git (fetch)
# gitee     https://gitee.com/username/project.git (push)
# gitlab    https://gitlab.com/username/project.git (fetch)
# gitlab    https://gitlab.com/username/project.git (push)

# 4. 推送到所有远程
git push origin main
git push gitee main
git push gitlab main

# 5. 推送标签
git push origin --tags
git push gitee --tags
git push gitlab --tags
```

**方案 2：配置多个推送 URL**

```bash
# 配置 origin 推送到多个仓库
git remote set-url --add --push origin https://github.com/username/project.git
git remote set-url --add --push origin https://gitee.com/username/project.git
git remote set-url --add --push origin https://gitlab.com/username/project.git

# 查看配置
git remote -v
# origin    https://github.com/username/project.git (fetch)
# origin    https://github.com/username/project.git (push)
# origin    https://gitee.com/username/project.git (push)
# origin    https://gitlab.com/username/project.git (push)

# 一次推送到所有仓库
git push origin main

# 注意：fetch 只从第一个 URL
```

**方案 3：使用脚本自动推送**

```bash
#!/bin/bash
# push-all.sh - 推送到所有远程仓库

set -e  # 遇到错误立即退出

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 远程仓库列表
REMOTES=("github" "gitee" "gitlab")

# 获取当前分支
BRANCH=$(git branch --show-current)

echo -e "${YELLOW}Current branch: $BRANCH${NC}"
echo -e "${YELLOW}Pushing to all remotes...${NC}\n"

# 推送到每个远程仓库
for remote in "${REMOTES[@]}"; do
  echo -e "${YELLOW}Pushing to $remote...${NC}"

  if git push "$remote" "$BRANCH"; then
    echo -e "${GREEN}✓ Successfully pushed to $remote${NC}\n"
  else
    echo -e "${RED}✗ Failed to push to $remote${NC}\n"
  fi
done

# 询问是否推送标签
read -p "Do you want to push tags? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  for remote in "${REMOTES[@]}"; do
    echo -e "${YELLOW}Pushing tags to $remote...${NC}"

    if git push "$remote" --tags; then
      echo -e "${GREEN}✓ Successfully pushed tags to $remote${NC}\n"
    else
      echo -e "${RED}✗ Failed to push tags to $remote${NC}\n"
    fi
  done
fi

echo -e "${GREEN}All done!${NC}"
```

**方案 4：GitHub Actions 自动同步**

```yaml
# .github/workflows/sync.yml
name: Sync to Gitee and GitLab

on:
  push:
    branches:
      - main
      - develop
  release:
    types: [published]

jobs:
  sync-gitee:
    runs-on: ubuntu-latest
    steps:
      - name: Sync to Gitee
        uses: wearerequired/git-mirror-action@v1
        env:
          SSH_PRIVATE_KEY: ${{ secrets.GITEE_PRIVATE_KEY }}
        with:
          source-repo: "git@github.com:username/project.git"
          destination-repo: "git@gitee.com:username/project.git"

  sync-gitlab:
    runs-on: ubuntu-latest
    steps:
      - name: Sync to GitLab
        uses: wearerequired/git-mirror-action@v1
        env:
          SSH_PRIVATE_KEY: ${{ secrets.GITLAB_PRIVATE_KEY }}
        with:
          source-repo: "git@github.com:username/project.git"
          destination-repo: "git@gitlab.com:username/project.git"
```

**配置 SSH 密钥**：

```bash
# 1. 生成 SSH 密钥对
ssh-keygen -t ed25519 -C "sync@example.com" -f ~/.ssh/sync_key

# 2. 添加公钥到 Gitee
# 访问 Gitee → 设置 → SSH 公钥
# 粘贴 ~/.ssh/sync_key.pub 内容

# 3. 添加公钥到 GitLab
# 访问 GitLab → Settings → SSH Keys
# 粘贴 ~/.ssh/sync_key.pub 内容

# 4. 在 GitHub 仓库添加 Secret
# Settings → Secrets → New repository secret
# Name: GITEE_PRIVATE_KEY
# Value: ~/.ssh/sync_key 的内容 (私钥)

# 重复步骤 4 创建 GITLAB_PRIVATE_KEY
```

**Git 配置别名**：

```bash
# 配置别名简化操作
git config alias.push-all '!git push github main && git push gitee main && git push gitlab main'
git config alias.push-all-tags '!git push github --tags && git push gitee --tags && git push gitlab --tags'

# 使用
git push-all
git push-all-tags
```

**完整的自动化脚本**：

```bash
#!/bin/bash
# multi-repo-manager.sh - 多仓库管理工具

# 配置
GITHUB_REPO="git@github.com:username/project.git"
GITEE_REPO="git@gitee.com:username/project.git"
GITLAB_REPO="git@gitlab.com:username/project.git"

# 函数：克隆并配置
setup() {
  echo "Setting up multi-repository..."

  # 克隆主仓库
  git clone "$GITHUB_REPO"
  cd project

  # 添加其他远程仓库
  git remote add gitee "$GITEE_REPO"
  git remote add gitlab "$GITLAB_REPO"

  # 重命名默认远程为 github
  git remote rename origin github

  echo "Setup complete!"
  git remote -v
}

# 函数：同步所有仓库
sync() {
  echo "Syncing all repositories..."

  BRANCH=$(git branch --show-current)

  # 推送到所有远程
  for remote in github gitee gitlab; do
    echo "Pushing to $remote..."
    git push "$remote" "$BRANCH"
  done

  # 推送标签
  for remote in github gitee gitlab; do
    echo "Pushing tags to $remote..."
    git push "$remote" --tags
  done

  echo "Sync complete!"
}

# 函数：拉取并合并
pull() {
  echo "Pulling from GitHub (main repository)..."
  git pull github "$(git branch --show-current)"
}

# 函数：状态检查
status() {
  echo "Checking status of all repositories..."

  for remote in github gitee gitlab; do
    echo -e "\n=== $remote ==="
    git fetch "$remote" --quiet

    # 检查是否有差异
    BRANCH=$(git branch --show-current)
    LOCAL=$(git rev-parse "$BRANCH")
    REMOTE=$(git rev-parse "$remote/$BRANCH" 2>/dev/null || echo "N/A")

    if [ "$LOCAL" = "$REMOTE" ]; then
      echo "✓ Up to date"
    else
      echo "✗ Out of sync"
      echo "  Local:  $LOCAL"
      echo "  Remote: $REMOTE"
    fi
  done
}

# 主菜单
case "$1" in
  setup)
    setup
    ;;
  sync)
    sync
    ;;
  pull)
    pull
    ;;
  status)
    status
    ;;
  *)
    echo "Usage: $0 {setup|sync|pull|status}"
    echo ""
    echo "Commands:"
    echo "  setup   - Clone and configure multi-repository"
    echo "  sync    - Push to all repositories"
    echo "  pull    - Pull from main repository"
    echo "  status  - Check sync status"
    exit 1
    ;;
esac
```

**使用示例**：

```bash
# 初始设置
./multi-repo-manager.sh setup

# 日常开发
git add .
git commit -m "Update feature"
./multi-repo-manager.sh sync

# 检查状态
./multi-repo-manager.sh status

# 拉取更新
./multi-repo-manager.sh pull
```

**README 徽章**：

```markdown
# Project Name

[![GitHub](https://img.shields.io/badge/GitHub-username%2Fproject-blue?logo=github)](https://github.com/username/project)
[![Gitee](https://img.shields.io/badge/Gitee-username%2Fproject-red?logo=gitee)](https://gitee.com/username/project)
[![GitLab](https://img.shields.io/badge/GitLab-username%2Fproject-orange?logo=gitlab)](https://gitlab.com/username/project)

## 镜像仓库

本项目在多个平台同步：

- **GitHub（主仓库）**: https://github.com/username/project
- **Gitee（国内镜像）**: https://gitee.com/username/project
- **GitLab（备份）**: https://gitlab.com/username/project

### 克隆

```bash
# GitHub（推荐国际用户）
git clone https://github.com/username/project.git

# Gitee（推荐国内用户）
git clone https://gitee.com/username/project.git

# GitLab
git clone https://gitlab.com/username/project.git
```
```

**注意事项**：

```markdown
## 多仓库管理注意事项

### ✅ 最佳实践
- 选择一个主仓库（通常是 GitHub）
- 其他仓库作为镜像
- 使用自动化同步（GitHub Actions）
- 在 README 中说明镜像关系
- 定期检查同步状态

### ⚠️ 注意事项
- Issue/PR 只在主仓库处理
- 避免在镜像仓库接受 PR（会导致不一致）
- 镜像仓库设置为只读（如果可能）
- 定期验证镜像完整性
- 处理好大文件和 LFS

### 🔧 故障排查
- 同步失败：检查 SSH 密钥配置
- 冲突：从主仓库重新同步
- 标签不一致：手动推送标签
```
{{< /expand >}}
{{< /expand >}}

---

{{< hint success >}}
**检查清单** - 完成本节后，你应该能够：

- [ ] 在 GitHub 上创建和管理仓库
- [ ] 使用 GitHub Issues 跟踪问题
- [ ] 配置 GitHub Actions 进行 CI/CD
- [ ] 使用 GitHub Pages 部署静态网站
- [ ] 配置 GitLab CI/CD 流水线
- [ ] 理解 GitLab 的 DevOps 工具链
- [ ] 在 Gitee 上托管项目
- [ ] 对比不同平台的特点
- [ ] 根据需求选择合适的平台
- [ ] 配置多平台镜像仓库
- [ ] 设置仓库最佳实践
- [ ] 保护仓库安全
{{< /hint >}}

**恭喜！** 🎉

你已经完成了「远程协作」章节的所有内容。现在你应该能够：
- 理解远程仓库的概念
- 熟练使用 clone、push、pull、fetch 等命令
- 管理远程分支
- 参与开源项目（Fork 和 PR）
- 选择和使用合适的代码托管平台

继续学习高级主题，提升你的 Git 技能！
