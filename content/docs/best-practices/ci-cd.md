---
title: "持续集成"
weight: 6
prev: /docs/best-practices/security
---

# 持续集成与持续部署

持续集成（CI）和持续部署（CD）是现代软件开发的核心实践。Git 与 CI/CD 的结合可以自动化测试、构建和部署流程。

## Git 与 CI/CD

### CI/CD 基本概念

```
                Git Push
                    ↓
    ┌───────────────────────────────┐
    │   Continuous Integration      │
    │   - 代码检查 (Lint)           │
    │   - 单元测试                  │
    │   - 集成测试                  │
    │   - 构建应用                  │
    │   - 安全扫描                  │
    └───────────────┬───────────────┘
                    ↓
    ┌───────────────────────────────┐
    │   Continuous Deployment       │
    │   - 部署到测试环境            │
    │   - 自动化测试                │
    │   - 部署到生产环境            │
    │   - 监控和回滚                │
    └───────────────────────────────┘
```

### CI/CD 的优势

**持续集成（CI）**：
- ✅ 及早发现集成问题
- ✅ 自动化测试确保代码质量
- ✅ 快速反馈开发错误
- ✅ 减少手动操作

**持续部署（CD）**：
- ✅ 快速交付新功能
- ✅ 减少部署风险
- ✅ 自动化发布流程
- ✅ 提高部署频率

### Git 触发器

CI/CD 流程通常由 Git 事件触发：

```yaml
# 常见触发事件
on:
  push:              # 代码推送
    branches:
      - main
      - develop
  pull_request:      # Pull Request
    branches:
      - main
  release:           # 发布
    types: [published]
  schedule:          # 定时任务
    - cron: '0 0 * * *'
  workflow_dispatch: # 手动触发
```

## GitHub Actions 示例

GitHub Actions 是 GitHub 内置的 CI/CD 平台。

### 基础工作流

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      # 1. 检出代码
      - uses: actions/checkout@v3

      # 2. 设置 Node.js
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      # 3. 安装依赖
      - name: Install dependencies
        run: npm ci

      # 4. 运行 lint
      - name: Run lint
        run: npm run lint

      # 5. 运行测试
      - name: Run tests
        run: npm test

      # 6. 生成测试覆盖率报告
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

### 多环境测试

```yaml
# .github/workflows/matrix-test.yml
name: Matrix Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ${{ matrix.os }}

    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node-version: [16, 18, 20]

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test
```

### 构建和发布

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

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

      - name: Upload Release Asset
        uses: actions/upload-release-asset@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          upload_url: ${{ steps.create_release.outputs.upload_url }}
          asset_path: ./dist/app.zip
          asset_name: app.zip
          asset_content_type: application/zip
```

### Docker 构建和推送

```yaml
# .github/workflows/docker.yml
name: Docker Build and Push

on:
  push:
    branches: [main]
  release:
    types: [published]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - uses: actions/checkout@v3

      - name: Log in to Container Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v4
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}

      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
```

### 自动部署

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to Production
        uses: easingthemes/ssh-deploy@v4
        with:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
          REMOTE_HOST: ${{ secrets.REMOTE_HOST }}
          REMOTE_USER: ${{ secrets.REMOTE_USER }}
          SOURCE: "dist/"
          TARGET: "/var/www/app"

      - name: Restart Application
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.REMOTE_HOST }}
          username: ${{ secrets.REMOTE_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /var/www/app
            pm2 restart app
```

### 缓存优化

```yaml
# .github/workflows/optimized-ci.yml
name: Optimized CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      # 缓存 Node.js 依赖
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      # 缓存自定义目录
      - name: Cache dependencies
        uses: actions/cache@v3
        with:
          path: |
            ~/.npm
            node_modules
            ~/.cache
          key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-node-

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test
```

## GitLab CI 示例

GitLab CI 使用 `.gitlab-ci.yml` 配置文件。

### 基础配置

```yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

variables:
  NODE_VERSION: "18"

# 测试阶段
test:
  stage: test
  image: node:${NODE_VERSION}
  script:
    - npm ci
    - npm run lint
    - npm test
  coverage: '/Lines\s*:\s*(\d+\.\d+)%/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml

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
    expire_in: 1 week
  only:
    - main
    - tags

# 部署到开发环境
deploy:dev:
  stage: deploy
  script:
    - echo "Deploying to development..."
    - scp -r dist/* user@dev.example.com:/var/www/app
  environment:
    name: development
    url: https://dev.example.com
  only:
    - develop

# 部署到生产环境
deploy:prod:
  stage: deploy
  script:
    - echo "Deploying to production..."
    - scp -r dist/* user@prod.example.com:/var/www/app
  environment:
    name: production
    url: https://example.com
  only:
    - main
  when: manual  # 手动触发
```

### 多环境配置

```yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

# 测试模板
.test_template: &test_template
  stage: test
  image: node:18
  script:
    - npm ci
    - npm test

# 在不同环境测试
test:node-16:
  <<: *test_template
  image: node:16

test:node-18:
  <<: *test_template
  image: node:18

test:node-20:
  <<: *test_template
  image: node:20

# 构建
build:
  stage: build
  image: node:18
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/

# 部署模板
.deploy_template: &deploy_template
  stage: deploy
  image: alpine:latest
  before_script:
    - apk add --no-cache openssh-client
    - eval $(ssh-agent -s)
    - echo "$SSH_PRIVATE_KEY" | tr -d '\r' | ssh-add -
    - mkdir -p ~/.ssh
    - chmod 700 ~/.ssh

# 开发环境部署
deploy:dev:
  <<: *deploy_template
  script:
    - scp -r dist/* $DEV_USER@$DEV_HOST:/var/www/app
  environment:
    name: development
    url: https://dev.example.com
  only:
    - develop

# 预发布环境部署
deploy:staging:
  <<: *deploy_template
  script:
    - scp -r dist/* $STAGING_USER@$STAGING_HOST:/var/www/app
  environment:
    name: staging
    url: https://staging.example.com
  only:
    - main

# 生产环境部署
deploy:prod:
  <<: *deploy_template
  script:
    - scp -r dist/* $PROD_USER@$PROD_HOST:/var/www/app
  environment:
    name: production
    url: https://example.com
  only:
    - tags
  when: manual
```

### Docker 镜像构建

```yaml
# .gitlab-ci.yml
variables:
  DOCKER_REGISTRY: registry.gitlab.com
  DOCKER_IMAGE: $DOCKER_REGISTRY/$CI_PROJECT_PATH

stages:
  - test
  - build
  - deploy

test:
  stage: test
  image: node:18
  script:
    - npm ci
    - npm test

build:docker:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  before_script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
  script:
    - docker build -t $DOCKER_IMAGE:$CI_COMMIT_SHA .
    - docker tag $DOCKER_IMAGE:$CI_COMMIT_SHA $DOCKER_IMAGE:latest
    - docker push $DOCKER_IMAGE:$CI_COMMIT_SHA
    - docker push $DOCKER_IMAGE:latest
  only:
    - main
    - tags

deploy:k8s:
  stage: deploy
  image: bitnami/kubectl:latest
  script:
    - kubectl set image deployment/myapp myapp=$DOCKER_IMAGE:$CI_COMMIT_SHA
    - kubectl rollout status deployment/myapp
  environment:
    name: production
    url: https://example.com
  only:
    - main
  when: manual
```

### GitLab Pages 部署

```yaml
# .gitlab-ci.yml
# 部署静态网站到 GitLab Pages

stages:
  - build
  - deploy

build:
  stage: build
  image: node:18
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/

pages:
  stage: deploy
  script:
    - mv dist public
  artifacts:
    paths:
      - public
  only:
    - main
```

## 自动化测试

### 单元测试

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  unit-test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:unit

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
          flags: unittests
          name: codecov-unit
```

### 集成测试

```yaml
# .github/workflows/integration-test.yml
name: Integration Test

on: [push, pull_request]

jobs:
  integration-test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run migrations
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test
        run: npm run db:migrate

      - name: Run integration tests
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test
          REDIS_URL: redis://localhost:6379
        run: npm run test:integration
```

### E2E 测试

```yaml
# .github/workflows/e2e-test.yml
name: E2E Test

on: [push, pull_request]

jobs:
  e2e-test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Build application
        run: npm run build

      - name: Start server
        run: |
          npm start &
          npx wait-on http://localhost:3000

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

### 性能测试

```yaml
# .github/workflows/performance.yml
name: Performance Test

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lighthouse:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli
          lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}

  load-test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Run k6 load test
        uses: grafana/k6-action@v0.3.0
        with:
          filename: tests/load-test.js
          flags: --out json=results.json

      - name: Upload results
        uses: actions/upload-artifact@v3
        with:
          name: k6-results
          path: results.json
```

## 自动化部署

### 部署到云平台

#### Vercel

```yaml
# .github/workflows/vercel.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

#### Netlify

```yaml
# .github/workflows/netlify.yml
name: Deploy to Netlify

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to Netlify
        uses: netlify/actions/cli@master
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
        with:
          args: deploy --prod --dir=dist
```

#### AWS S3

```yaml
# .github/workflows/aws-s3.yml
name: Deploy to AWS S3

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Deploy to S3
        run: |
          aws s3 sync dist/ s3://${{ secrets.S3_BUCKET }} --delete

      - name: Invalidate CloudFront
        run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} \
            --paths "/*"
```

### Kubernetes 部署

```yaml
# .github/workflows/k8s-deploy.yml
name: Deploy to Kubernetes

on:
  push:
    tags:
      - 'v*'

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Login to Container Registry
        uses: docker/login-action@v2
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: ghcr.io/${{ github.repository }}:${{ github.ref_name }}

      - name: Set up kubectl
        uses: azure/setup-kubectl@v3

      - name: Configure kubectl
        run: |
          echo "${{ secrets.KUBE_CONFIG }}" | base64 -d > kubeconfig
          export KUBECONFIG=kubeconfig

      - name: Deploy to Kubernetes
        run: |
          kubectl set image deployment/myapp \
            myapp=ghcr.io/${{ github.repository }}:${{ github.ref_name }}
          kubectl rollout status deployment/myapp
```

### 蓝绿部署

```yaml
# .github/workflows/blue-green-deploy.yml
name: Blue-Green Deployment

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Build new version (Green)
        run: |
          docker build -t myapp:green .

      - name: Deploy to Green environment
        run: |
          docker-compose -f docker-compose.green.yml up -d

      - name: Health check
        run: |
          sleep 10
          curl -f http://green.example.com/health || exit 1

      - name: Switch traffic to Green
        run: |
          # 更新负载均衡器配置
          ./scripts/switch-to-green.sh

      - name: Monitor new version
        run: |
          sleep 60
          ./scripts/check-metrics.sh

      - name: Remove Blue environment
        run: |
          docker-compose -f docker-compose.blue.yml down
```

## 高级 CI/CD 实践

### 分支保护和状态检查

```yaml
# .github/workflows/required-checks.yml
name: Required Checks

on:
  pull_request:
    branches: [main]

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

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run security audit
        run: npm audit --audit-level=high

  # 在 GitHub Settings 中配置：
  # Settings → Branches → Branch protection rules
  # 要求 lint, test, security 通过才能合并
```

### 自动化版本管理

```yaml
# .github/workflows/auto-version.yml
name: Auto Version

on:
  push:
    branches: [main]

jobs:
  version:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Configure Git
        run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"

      - name: Bump version and create tag
        run: npx standard-version

      - name: Push changes
        run: |
          git push --follow-tags origin main

      - name: Create GitHub Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ steps.version.outputs.new_tag }}
          release_name: Release ${{ steps.version.outputs.new_tag }}
          body_path: CHANGELOG.md
```

### Monorepo CI/CD

```yaml
# .github/workflows/monorepo.yml
name: Monorepo CI/CD

on: [push, pull_request]

jobs:
  changes:
    runs-on: ubuntu-latest
    outputs:
      frontend: ${{ steps.filter.outputs.frontend }}
      backend: ${{ steps.filter.outputs.backend }}
    steps:
      - uses: actions/checkout@v3
      - uses: dorny/paths-filter@v2
        id: filter
        with:
          filters: |
            frontend:
              - 'packages/frontend/**'
            backend:
              - 'packages/backend/**'

  test-frontend:
    needs: changes
    if: needs.changes.outputs.frontend == 'true'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Test frontend
        run: npm run test --workspace=packages/frontend

  test-backend:
    needs: changes
    if: needs.changes.outputs.backend == 'true'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Test backend
        run: npm run test --workspace=packages/backend
```

## 练习题

### 练习 1：创建基础 CI 工作流

为一个 Node.js 项目创建 GitHub Actions 工作流，要求：
- 在 push 和 PR 时触发
- 运行 lint 检查
- 运行测试
- 上传测试覆盖率到 Codecov

<details>
<summary>查看答案</summary>

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  ci:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run lint
        run: npm run lint

      - name: Run tests
        run: npm test -- --coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
          flags: unittests
          name: codecov-coverage
          fail_ci_if_error: true
```

</details>

### 练习 2：配置多环境部署

创建 GitLab CI 配置，实现：
- 开发分支自动部署到开发环境
- main 分支自动部署到预发布环境
- 标签手动部署到生产环境

<details>
<summary>查看答案</summary>

```yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

variables:
  NODE_VERSION: "18"

# 测试（所有分支）
test:
  stage: test
  image: node:${NODE_VERSION}
  script:
    - npm ci
    - npm test
  coverage: '/Lines\s*:\s*(\d+\.\d+)%/'

# 构建
build:
  stage: build
  image: node:${NODE_VERSION}
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 week

# 部署到开发环境
deploy:dev:
  stage: deploy
  script:
    - echo "Deploying to development..."
    - rsync -avz dist/ $DEV_USER@$DEV_HOST:/var/www/app
  environment:
    name: development
    url: https://dev.example.com
  only:
    - develop

# 部署到预发布环境
deploy:staging:
  stage: deploy
  script:
    - echo "Deploying to staging..."
    - rsync -avz dist/ $STAGING_USER@$STAGING_HOST:/var/www/app
  environment:
    name: staging
    url: https://staging.example.com
  only:
    - main

# 部署到生产环境（手动触发）
deploy:prod:
  stage: deploy
  script:
    - echo "Deploying to production..."
    - rsync -avz dist/ $PROD_USER@$PROD_HOST:/var/www/app
  environment:
    name: production
    url: https://example.com
  only:
    - tags
  when: manual
```

</details>

### 练习 3：实现自动化版本发布

配置工作流，实现：
- 基于提交信息自动升级版本号
- 自动生成 CHANGELOG
- 创建 Git 标签
- 发布 GitHub Release

<details>
<summary>查看答案</summary>

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    branches:
      - main

jobs:
  release:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        with:
          fetch-depth: 0
          token: ${{ secrets.GITHUB_TOKEN }}

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Configure Git
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"

      - name: Bump version and update changelog
        run: |
          npx standard-version

      - name: Get new version
        id: version
        run: |
          echo "new_tag=$(git describe --tags --abbrev=0)" >> $GITHUB_OUTPUT

      - name: Push changes and tags
        run: |
          git push --follow-tags origin main

      - name: Build
        run: npm run build

      - name: Create GitHub Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ steps.version.outputs.new_tag }}
          release_name: Release ${{ steps.version.outputs.new_tag }}
          body: |
            Changes in this Release
            See CHANGELOG.md for details
          draft: false
          prerelease: false

# 需要安装 standard-version
# npm install --save-dev standard-version

# package.json
{
  "scripts": {
    "release": "standard-version"
  }
}
```

</details>

### 练习 4：配置 Docker 构建和推送

创建工作流，在标签发布时：
- 构建 Docker 镜像
- 推送到 GitHub Container Registry
- 自动部署到 Kubernetes

<details>
<summary>查看答案</summary>

```yaml
# .github/workflows/docker-deploy.yml
name: Docker Build and Deploy

on:
  push:
    tags:
      - 'v*'

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Log in to Container Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v4
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=tag
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
            type=raw,value=latest

      - name: Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Set up kubectl
        uses: azure/setup-kubectl@v3
        with:
          version: 'latest'

      - name: Configure kubectl
        run: |
          echo "${{ secrets.KUBE_CONFIG }}" | base64 -d > kubeconfig
          echo "KUBECONFIG=$(pwd)/kubeconfig" >> $GITHUB_ENV

      - name: Deploy to Kubernetes
        run: |
          kubectl set image deployment/myapp \
            myapp=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.ref_name }} \
            --record

      - name: Verify deployment
        run: |
          kubectl rollout status deployment/myapp
          kubectl get pods -l app=myapp

# Dockerfile 示例
# FROM node:18-alpine
# WORKDIR /app
# COPY package*.json ./
# RUN npm ci --only=production
# COPY . .
# EXPOSE 3000
# CMD ["node", "server.js"]

# kubernetes/deployment.yml 示例
# apiVersion: apps/v1
# kind: Deployment
# metadata:
#   name: myapp
# spec:
#   replicas: 3
#   selector:
#     matchLabels:
#       app: myapp
#   template:
#     metadata:
#       labels:
#         app: myapp
#     spec:
#       containers:
#       - name: myapp
#         image: ghcr.io/username/repo:latest
#         ports:
#         - containerPort: 3000
```

</details>

## 延伸阅读

- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [GitLab CI/CD 文档](https://docs.gitlab.com/ee/ci/)
- [CI/CD 最佳实践](https://www.atlassian.com/continuous-delivery/principles/continuous-integration-vs-delivery-vs-deployment)
- [Docker 官方文档](https://docs.docker.com/)
- [Kubernetes 文档](https://kubernetes.io/docs/)

## 总结

- ✅ 自动化测试确保代码质量
- ✅ CI/CD 加速开发和部署流程
- ✅ 使用分支保护和状态检查
- ✅ 多环境部署策略
- ✅ 容器化和编排简化部署
- ✅ 持续监控和改进流程

恭喜！你已经完成了 Git 最佳实践章节的学习。

继续探索：[故障排除](../../troubleshooting) →
