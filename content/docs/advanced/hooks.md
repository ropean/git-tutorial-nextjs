---
title: "Git 钩子"
weight: 4
bookToc: true
---

# Git 钩子

Git 钩子（Hooks）是在 Git 执行特定操作时自动运行的脚本。它们可以用来自动化工作流程、强制代码规范、运行测试等。

## 什么是 Git 钩子

Git 钩子是存储在 `.git/hooks` 目录下的脚本文件。当 Git 执行某些重要操作时，会触发相应的钩子脚本。

### 钩子的特点

- **自动执行**：特定 Git 操作时自动触发
- **可定制**：使用任何脚本语言（Shell、Python、Ruby 等）
- **本地化**：存储在 `.git/hooks`，不会被提交到仓库
- **可绕过**：使用 `--no-verify` 可以跳过钩子

### 钩子的位置

```bash
# 查看钩子目录
ls -la .git/hooks/

# 输出示例：
# -rwxr-xr-x  applypatch-msg.sample
# -rwxr-xr-x  commit-msg.sample
# -rwxr-xr-x  pre-commit.sample
# -rwxr-xr-x  pre-push.sample
# ...
```

{{< hint info >}}
**注意**：以 `.sample` 结尾的文件是示例，不会被执行。去掉 `.sample` 后缀并添加执行权限才能启用。
{{< /hint >}}

## 钩子类型

Git 钩子分为两大类：**客户端钩子**和**服务端钩子**。

### 客户端钩子

在本地仓库执行操作时触发。

| 钩子名称 | 触发时机 | 用途 |
|---------|---------|------|
| `pre-commit` | 提交前 | 代码检查、格式化 |
| `prepare-commit-msg` | 编辑提交信息前 | 自动生成提交模板 |
| `commit-msg` | 提交信息编辑后 | 验证提交信息格式 |
| `post-commit` | 提交后 | 发送通知 |
| `pre-rebase` | 变基前 | 防止变基特定分支 |
| `post-checkout` | 检出后 | 配置工作目录 |
| `post-merge` | 合并后 | 恢复权限、安装依赖 |
| `pre-push` | 推送前 | 运行测试、检查 |

### 服务端钩子

在服务器端接收推送时触发。

| 钩子名称 | 触发时机 | 用途 |
|---------|---------|------|
| `pre-receive` | 接收推送前 | 拒绝不符合规范的推送 |
| `update` | 更新每个分支前 | 分支级别的访问控制 |
| `post-receive` | 接收推送后 | 部署、发送通知 |

## 客户端钩子详解

### pre-commit

在 `git commit` 执行前运行，用于检查即将提交的代码。

**创建 pre-commit 钩子**：

```bash
# 创建钩子文件
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/sh

# 检查是否有 console.log
if git diff --cached --name-only | xargs grep -n "console.log" 2>/dev/null; then
    echo "错误：代码中包含 console.log"
    echo "请移除 console.log 后再提交"
    exit 1
fi

# 运行 ESLint
npm run lint
if [ $? -ne 0 ]; then
    echo "错误：ESLint 检查失败"
    exit 1
fi

echo "✅ pre-commit 检查通过"
exit 0
EOF

# 添加执行权限
chmod +x .git/hooks/pre-commit
```

**测试**：

```bash
# 添加包含 console.log 的文件
echo "console.log('test')" > test.js
git add test.js
git commit -m "test"

# 输出：
# 错误：代码中包含 console.log
# 请移除 console.log 后再提交
```

**绕过钩子**：

```bash
# 紧急情况下跳过钩子
git commit --no-verify -m "Emergency fix"
```

### commit-msg

验证提交信息格式。

**创建 commit-msg 钩子**：

```bash
cat > .git/hooks/commit-msg << 'EOF'
#!/bin/sh

# 读取提交信息
commit_msg=$(cat "$1")

# 验证提交信息格式（Conventional Commits）
if ! echo "$commit_msg" | grep -qE "^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: .+"; then
    echo "错误：提交信息格式不正确"
    echo ""
    echo "提交信息应遵循格式："
    echo "  <type>(<scope>): <subject>"
    echo ""
    echo "示例："
    echo "  feat(user): add login functionality"
    echo "  fix(api): resolve data parsing issue"
    echo ""
    echo "类型："
    echo "  feat     新功能"
    echo "  fix      bug 修复"
    echo "  docs     文档"
    echo "  style    代码格式"
    echo "  refactor 重构"
    echo "  test     测试"
    echo "  chore    构建/工具"
    exit 1
fi

# 检查提交信息长度
subject_length=$(echo "$commit_msg" | head -n1 | wc -c)
if [ "$subject_length" -gt 72 ]; then
    echo "错误：提交信息首行不应超过 72 个字符"
    exit 1
fi

echo "✅ 提交信息格式正确"
exit 0
EOF

chmod +x .git/hooks/commit-msg
```

**测试**：

```bash
# 错误的提交信息
git commit -m "update code"
# 输出：错误：提交信息格式不正确

# 正确的提交信息
git commit -m "feat(user): add registration form"
# 输出：✅ 提交信息格式正确
```

### pre-push

在推送前运行测试。

**创建 pre-push 钩子**：

```bash
cat > .git/hooks/pre-push << 'EOF'
#!/bin/sh

echo "运行测试..."

# 运行单元测试
npm test
if [ $? -ne 0 ]; then
    echo "❌ 测试失败，推送已取消"
    exit 1
fi

# 运行构建检查
npm run build
if [ $? -ne 0 ]; then
    echo "❌ 构建失败，推送已取消"
    exit 1
fi

echo "✅ 所有检查通过，开始推送"
exit 0
EOF

chmod +x .git/hooks/pre-push
```

### post-merge

合并后自动安装依赖。

**创建 post-merge 钩子**：

```bash
cat > .git/hooks/post-merge << 'EOF'
#!/bin/sh

# 检查 package.json 是否有变化
changed_files="$(git diff-tree -r --name-only --no-commit-id ORIG_HEAD HEAD)"

check_run() {
    echo "$changed_files" | grep -q "$1" && eval "$2"
}

# 如果 package.json 改变，安装依赖
check_run package.json "npm install"

# 如果 requirements.txt 改变，安装 Python 依赖
check_run requirements.txt "pip install -r requirements.txt"

echo "✅ 依赖更新完成"
EOF

chmod +x .git/hooks/post-merge
```

## 实战示例

### 示例 1：强制代码格式化

```bash
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/sh

# 获取暂存的文件
FILES=$(git diff --cached --name-only --diff-filter=ACMR | grep -E '\.(js|jsx|ts|tsx)$')

if [ -z "$FILES" ]; then
    exit 0
fi

# 运行 Prettier 格式化
echo "Running Prettier..."
echo "$FILES" | xargs npx prettier --write

# 运行 ESLint 修复
echo "Running ESLint..."
echo "$FILES" | xargs npx eslint --fix

# 重新添加格式化后的文件
echo "$FILES" | xargs git add

echo "✅ 代码格式化完成"
exit 0
EOF

chmod +x .git/hooks/pre-commit
```

### 示例 2：防止推送到 main 分支

```bash
cat > .git/hooks/pre-push << 'EOF'
#!/bin/sh

# 获取当前分支
current_branch=$(git symbolic-ref HEAD | sed -e 's,.*/\(.*\),\1,')

# 禁止直接推送到 main 或 master
if [ "$current_branch" = "main" ] || [ "$current_branch" = "master" ]; then
    echo "❌ 错误：不允许直接推送到 $current_branch 分支"
    echo "请创建功能分支并通过 Pull Request 合并"
    exit 1
fi

exit 0
EOF

chmod +x .git/hooks/pre-push
```

### 示例 3：自动添加 Issue 编号

```bash
cat > .git/hooks/prepare-commit-msg << 'EOF'
#!/bin/sh

# 获取分支名
BRANCH_NAME=$(git symbolic-ref --short HEAD)

# 从分支名提取 Issue 编号（如 feature/ABC-123-login）
ISSUE_NUMBER=$(echo "$BRANCH_NAME" | grep -oE '[A-Z]+-[0-9]+')

if [ -n "$ISSUE_NUMBER" ]; then
    # 检查提交信息是否已包含 Issue 编号
    if ! grep -q "$ISSUE_NUMBER" "$1"; then
        # 在提交信息前添加 Issue 编号
        echo "$ISSUE_NUMBER: $(cat "$1")" > "$1"
    fi
fi
EOF

chmod +x .git/hooks/prepare-commit-msg
```

### 示例 4：检查敏感信息

```bash
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/sh

# 敏感信息模式
PATTERNS=(
    'password\s*=\s*["\x27][^\x27"]*["\x27]'
    'api[_-]?key\s*=\s*["\x27][^\x27"]*["\x27]'
    'secret\s*=\s*["\x27][^\x27"]*["\x27]'
    'token\s*=\s*["\x27][^\x27"]*["\x27]'
    'AWS_ACCESS_KEY_ID'
    'AWS_SECRET_ACCESS_KEY'
)

# 检查暂存的文件
FILES=$(git diff --cached --name-only)

for pattern in "${PATTERNS[@]}"; do
    for file in $FILES; do
        if git diff --cached "$file" | grep -iE "$pattern" > /dev/null; then
            echo "❌ 错误：检测到可能的敏感信息"
            echo "文件：$file"
            echo "模式：$pattern"
            echo ""
            echo "请检查并移除敏感信息，或将其移到环境变量/配置文件"
            exit 1
        fi
    done
done

echo "✅ 未检测到敏感信息"
exit 0
EOF

chmod +x .git/hooks/pre-commit
```

## Husky - 钩子管理工具

Husky 是一个流行的 Git 钩子管理工具，可以轻松共享钩子配置。

### 安装 Husky

```bash
# 安装 Husky
npm install --save-dev husky

# 初始化 Husky
npx husky init

# 或使用新版本
npm pkg set scripts.prepare="husky install"
npm run prepare
```

### 创建钩子

```bash
# 创建 pre-commit 钩子
npx husky add .husky/pre-commit "npm test"

# 创建 commit-msg 钩子
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'

# 创建 pre-push 钩子
npx husky add .husky/pre-push "npm run build"
```

### 配置示例

**.husky/pre-commit**：

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run lint
npm test
```

**package.json**：

```json
{
  "scripts": {
    "prepare": "husky install",
    "lint": "eslint .",
    "test": "jest"
  },
  "devDependencies": {
    "husky": "^8.0.0",
    "@commitlint/cli": "^17.0.0",
    "@commitlint/config-conventional": "^17.0.0"
  }
}
```

### 配合 lint-staged

只对暂存的文件运行检查：

```bash
# 安装
npm install --save-dev lint-staged

# 配置 package.json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}

# 修改 .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

### 配合 commitlint

验证提交信息格式：

```bash
# 安装
npm install --save-dev @commitlint/cli @commitlint/config-conventional

# 创建配置文件
echo "module.exports = {extends: ['@commitlint/config-conventional']}" > commitlint.config.js

# 创建 commit-msg 钩子
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'
```

**commitlint.config.js**：

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // 新功能
        'fix',      // bug 修复
        'docs',     // 文档
        'style',    // 格式
        'refactor', // 重构
        'test',     // 测试
        'chore',    // 构建/工具
        'perf',     // 性能
        'ci',       // CI 配置
        'revert'    // 回退
      ]
    ],
    'subject-case': [0] // 关闭主题大小写检查
  }
}
```

## 共享钩子

由于 `.git/hooks` 不会被提交，需要通过其他方式共享钩子。

### 方法 1：使用 Husky（推荐）

Husky 会将钩子存储在 `.husky` 目录，可以提交到仓库。

```bash
# 初始化
npx husky install

# 创建钩子
npx husky add .husky/pre-commit "npm test"

# 提交到仓库
git add .husky
git commit -m "chore: add git hooks"
```

团队成员克隆后：

```bash
npm install  # 自动运行 prepare 脚本安装钩子
```

### 方法 2：使用脚本安装

**hooks/pre-commit**：

```bash
#!/bin/sh
npm test
```

**scripts/install-hooks.sh**：

```bash
#!/bin/sh

# 复制钩子到 .git/hooks
cp hooks/* .git/hooks/
chmod +x .git/hooks/*

echo "Git hooks installed successfully!"
```

**README.md**：

```markdown
## 开发设置

克隆仓库后，运行以下命令安装 Git 钩子：

```bash
./scripts/install-hooks.sh
```
```

### 方法 3：使用 core.hooksPath

Git 2.9+ 支持自定义钩子路径：

```bash
# 设置钩子路径
git config core.hooksPath .githooks

# 创建钩子目录
mkdir .githooks

# 创建钩子
cat > .githooks/pre-commit << 'EOF'
#!/bin/sh
npm test
EOF

chmod +x .githooks/pre-commit

# 提交到仓库
git add .githooks
git commit -m "Add git hooks"
```

团队成员克隆后：

```bash
git config core.hooksPath .githooks
```

可以在 README 中说明，或在 package.json 的 postinstall 脚本中自动设置：

```json
{
  "scripts": {
    "postinstall": "git config core.hooksPath .githooks"
  }
}
```

## 常见问题

### 钩子不执行

**原因**：
1. 文件没有执行权限
2. 文件名错误（包含 `.sample` 后缀）
3. 脚本有语法错误

**解决**：

```bash
# 添加执行权限
chmod +x .git/hooks/pre-commit

# 检查文件名
ls -la .git/hooks/

# 测试脚本
sh -x .git/hooks/pre-commit
```

### 钩子在 Windows 上不工作

**解决**：使用 Husky 或确保脚本兼容性

```bash
#!/usr/bin/env sh
# 使用 env 而非直接指定 /bin/sh
```

### 如何禁用钩子

```bash
# 临时禁用
git commit --no-verify

# 永久禁用（删除或重命名）
mv .git/hooks/pre-commit .git/hooks/pre-commit.disabled
```

## 最佳实践

1. **使用 Husky 管理钩子**
   - 便于团队共享
   - 版本控制
   - 跨平台兼容

2. **保持钩子快速**
   ```bash
   # ❌ 不推荐：运行全部测试
   npm test

   # ✅ 推荐：只运行相关测试
   npm run test:changed
   ```

3. **提供绕过选项**
   - 紧急情况使用 `--no-verify`
   - 在文档中说明何时可以绕过

4. **给出清晰的错误信息**
   ```bash
   echo "❌ 错误：ESLint 检查失败"
   echo "运行 'npm run lint' 查看详情"
   echo "运行 'npm run lint:fix' 自动修复"
   ```

5. **使用 lint-staged**
   - 只检查暂存的文件
   - 提高执行速度

6. **文档化钩子**
   ```markdown
   ## Git Hooks

   本项目使用 Husky 管理 Git 钩子：

   - **pre-commit**: 运行 ESLint 和 Prettier
   - **commit-msg**: 验证提交信息格式
   - **pre-push**: 运行测试

   ### 绕过钩子

   紧急情况下可以使用 `--no-verify`，但应避免频繁使用。
   ```

## 命令速查

| 操作 | 命令 |
|------|------|
| 查看钩子目录 | `ls .git/hooks/` |
| 启用钩子 | `mv .git/hooks/pre-commit{.sample,}` |
| 添加执行权限 | `chmod +x .git/hooks/pre-commit` |
| 绕过钩子 | `git commit --no-verify` |
| 测试钩子 | `sh -x .git/hooks/pre-commit` |
| 安装 Husky | `npx husky install` |
| 创建钩子 | `npx husky add .husky/pre-commit "cmd"` |

## 下一步

掌握了 Git 钩子后，接下来学习如何配置别名来提高效率。

下一节：[别名配置](../aliases/) →

---

## 💡 练习题

完成以下练习，巩固所学知识：

{{< expand "练习 1：创建简单的 pre-commit 钩子" >}}
**任务**：
1. 创建一个 pre-commit 钩子
2. 检查暂存的文件是否包含 `TODO` 注释
3. 如果包含，显示警告但允许提交

{{< expand "查看答案" >}}
```bash
# 1. 创建钩子
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/sh

# 检查 TODO
if git diff --cached | grep -i "TODO"; then
    echo "⚠️  警告：代码中包含 TODO 注释"
    echo "建议在发布前解决所有 TODO"
    echo ""
fi

# 允许提交
exit 0
EOF

# 2. 添加执行权限
chmod +x .git/hooks/pre-commit

# 3. 测试
echo "// TODO: fix this" > test.js
git add test.js
git commit -m "test"
# 输出：⚠️  警告：代码中包含 TODO 注释
```
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 2：验证提交信息格式" >}}
**任务**：
1. 创建 commit-msg 钩子
2. 要求提交信息至少 10 个字符
3. 禁止以 "WIP" 开头的提交信息

{{< expand "查看答案" >}}
```bash
# 创建钩子
cat > .git/hooks/commit-msg << 'EOF'
#!/bin/sh

commit_msg=$(cat "$1")

# 检查长度
if [ ${#commit_msg} -lt 10 ]; then
    echo "❌ 错误：提交信息至少需要 10 个字符"
    echo "当前长度：${#commit_msg}"
    exit 1
fi

# 禁止 WIP
if echo "$commit_msg" | grep -qiE "^WIP"; then
    echo "❌ 错误：不允许提交 WIP 信息"
    echo "请完成工作后再提交，或使用 git stash"
    exit 1
fi

exit 0
EOF

chmod +x .git/hooks/commit-msg

# 测试
git commit -m "test"
# 输出：❌ 错误：提交信息至少需要 10 个字符

git commit -m "WIP: testing"
# 输出：❌ 错误：不允许提交 WIP 信息

git commit -m "feat: add new feature"
# 输出：提交成功
```
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 3：设置 Husky 和 lint-staged" >}}
**任务**：在一个 Node.js 项目中设置 Husky 和 lint-staged

1. 安装必要的包
2. 配置 lint-staged
3. 创建 pre-commit 钩子
4. 测试自动格式化

{{< expand "查看答案" >}}
```bash
# 1. 安装依赖
npm install --save-dev husky lint-staged prettier

# 2. 初始化 Husky
npm pkg set scripts.prepare="husky install"
npm run prepare

# 3. 配置 package.json
cat > package.json << 'EOF'
{
  "scripts": {
    "prepare": "husky install"
  },
  "lint-staged": {
    "*.js": [
      "prettier --write",
      "git add"
    ],
    "*.{json,md}": [
      "prettier --write",
      "git add"
    ]
  },
  "devDependencies": {
    "husky": "^8.0.0",
    "lint-staged": "^13.0.0",
    "prettier": "^2.8.0"
  }
}
EOF

# 4. 创建 pre-commit 钩子
npx husky add .husky/pre-commit "npx lint-staged"

# 5. 测试
echo "const x=1;const y=2;" > test.js
git add test.js
git commit -m "test formatting"
# lint-staged 会自动格式化 test.js

# 6. 验证格式化结果
cat test.js
# 输出：
# const x = 1;
# const y = 2;
```
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 4：共享钩子配置" >}}
**思考题**：

A. 为什么 `.git/hooks` 不能直接提交到仓库？
B. Husky 如何解决钩子共享问题？
C. 如果团队成员不想使用钩子，应该怎么办？

{{< expand "查看答案" >}}
**答案**：

**A. 为什么 `.git/hooks` 不能直接提交？**

`.git` 目录是 Git 的内部目录，不会被版本控制。原因：
1. `.git` 包含本地配置和状态
2. 每个人的 `.git` 目录可能不同
3. Git 设计上就不追踪 `.git` 目录

**B. Husky 如何解决共享问题？**

Husky 将钩子存储在 `.husky` 目录（而不是 `.git/hooks`）：
1. `.husky` 目录可以提交到仓库
2. `husky install` 会在 `.git/hooks` 中创建指向 `.husky` 的链接
3. `prepare` 脚本确保 npm install 时自动安装钩子

```json
{
  "scripts": {
    "prepare": "husky install"
  }
}
```

**C. 如果成员不想使用钩子？**

提供几个选项：

1. **临时绕过**：
```bash
git commit --no-verify
```

2. **禁用 Husky**：
```bash
# 设置环境变量
export HUSKY=0

# 或在 .huskyrc 中配置
echo 'export HUSKY=0' > ~/.huskyrc
```

3. **团队约定**：
- 在文档中说明钩子的重要性
- 允许合理的绕过（如紧急修复）
- 但在 CI 中强制执行检查

4. **可选安装**：
```json
{
  "scripts": {
    "prepare": "is-ci || husky install"
  }
}
```

**最佳实践**：
- 钩子应该提高效率，不应该成为障碍
- 提供清晰的文档和错误信息
- 在 CI 中强制执行同样的检查
- 允许合理的绕过选项
{{< /expand >}}
{{< /expand >}}

---

{{< hint success >}}
**检查清单** - 完成本节后，你应该能够：

- [ ] 理解 Git 钩子的概念和类型
- [ ] 创建和配置客户端钩子
- [ ] 使用 pre-commit 进行代码检查
- [ ] 使用 commit-msg 验证提交信息
- [ ] 安装和配置 Husky
- [ ] 配合 lint-staged 使用钩子
- [ ] 在团队中共享钩子配置
- [ ] 处理钩子相关的常见问题
{{< /hint >}}
