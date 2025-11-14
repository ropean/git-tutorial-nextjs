---
title: "迁移仓库"
weight: 4
bookToc: true
---

# 迁移仓库

本章将学习如何迁移 Git 仓库，包括从其他版本控制系统迁移到 Git，以及在不同平台间迁移仓库。

## 从 SVN 迁移到 Git

### 准备工作

```bash
# 安装必要工具
# macOS
brew install git-svn

# Ubuntu/Debian
sudo apt-get install git-svn

# 验证安装
git svn --version
```

### 创建作者映射文件

SVN 使用简单的用户名，而 Git 使用名字和邮箱。需要创建映射文件。

```bash
# 从 SVN 仓库提取作者列表
svn log --quiet svn://svn.example.com/repo | \
  grep "^r" | \
  awk '{print $3}' | \
  sort | \
  uniq > authors.txt

# 编辑 authors.txt，将其转换为 Git 格式
# SVN 格式：
# john
# mary
# bob

# 转换为 Git 格式：
cat > authors.txt << 'EOF'
john = John Doe <john@example.com>
mary = Mary Smith <mary@example.com>
bob = Bob Johnson <bob@example.com>
(no author) = Unknown <unknown@example.com>
EOF
```

### 执行迁移

#### 基本迁移

```bash
# 克隆 SVN 仓库到 Git
git svn clone svn://svn.example.com/repo \
  --authors-file=authors.txt \
  --no-metadata \
  my-git-repo

# 参数说明：
# --authors-file: 作者映射文件
# --no-metadata: 不包含 SVN 元数据
# --stdlayout: 如果使用标准 trunk/branches/tags 布局
```

#### 标准布局迁移

如果 SVN 使用标准布局（trunk、branches、tags）：

```bash
git svn clone svn://svn.example.com/repo \
  --authors-file=authors.txt \
  --stdlayout \
  --no-metadata \
  my-git-repo

# --stdlayout 等同于：
# -T trunk -b branches -t tags
```

#### 自定义布局迁移

```bash
# 如果 SVN 布局不标准
git svn clone svn://svn.example.com/repo \
  --authors-file=authors.txt \
  --trunk=main \
  --branches=feature-branches \
  --tags=release-tags \
  --no-metadata \
  my-git-repo
```

### 转换 SVN 标签

SVN 的标签实际上是分支，需要转换为 Git 标签：

```bash
cd my-git-repo

# 查看远程分支
git branch -r

# 输出示例：
#   trunk
#   tags/v1.0
#   tags/v1.1
#   branches/feature-x

# 转换脚本
cat > convert-tags.sh << 'EOF'
#!/bin/bash
# 将 SVN 标签转换为 Git 标签

for tag in $(git branch -r | grep "tags/" | sed 's/.*tags\///'); do
  git tag $tag refs/remotes/origin/tags/$tag
  git branch -r -d origin/tags/$tag
done
EOF

chmod +x convert-tags.sh
./convert-tags.sh

# 验证标签
git tag
```

### 转换 SVN 分支

```bash
# 将远程分支转换为本地分支
for branch in $(git branch -r | grep "branches/" | sed 's/.*branches\///'); do
  git branch $branch refs/remotes/origin/branches/$branch
done

# 删除 trunk 引用（已经是 main/master）
git branch -r -d origin/trunk
```

### 完整迁移示例

```bash
# === 步骤 1：准备作者文件 ===
cat > authors.txt << 'EOF'
john = John Doe <john@example.com>
mary = Mary Smith <mary@example.com>
EOF

# === 步骤 2：克隆 SVN 仓库 ===
git svn clone svn://svn.example.com/repo \
  --authors-file=authors.txt \
  --stdlayout \
  --no-metadata \
  my-project

cd my-project

# === 步骤 3：转换标签 ===
for tag in $(git branch -r | grep "tags/" | sed 's/.*tags\///'); do
  git tag $tag refs/remotes/origin/tags/$tag
  git branch -r -d origin/tags/$tag
done

# === 步骤 4：转换分支 ===
for branch in $(git branch -r | grep "branches/" | sed 's/.*branches\///'); do
  git branch $branch refs/remotes/origin/branches/$branch
done

# === 步骤 5：清理 ===
git branch -r -d origin/trunk

# === 步骤 6：添加新的 Git 远程仓库 ===
git remote add origin https://github.com/user/my-project.git

# === 步骤 7：推送所有内容 ===
git push -u origin main
git push origin --all
git push origin --tags

# === 步骤 8：验证 ===
git log --oneline
git tag
git branch -a
```

### SVN 迁移的注意事项

{{< hint warning >}}
**注意事项**：
1. **大仓库可能需要很长时间**：使用 `-r` 限制修订范围
2. **保留 SVN 历史**：使用 `--no-metadata` 清理 git-svn ID
3. **忽略文件**：将 `.svn` 添加到 `.gitignore`
4. **外部依赖**：SVN externals 需要转换为 Git submodules
5. **分支和标签**：SVN 的"复制"需要转换为 Git 的分支和标签
{{< /hint >}}

## 在不同平台间迁移

### GitHub 到 GitLab

#### 方法 1：使用 GitLab 导入器（推荐）

```bash
# 在 GitLab 中：
# 1. 点击 "New Project"
# 2. 选择 "Import project"
# 3. 选择 "GitHub"
# 4. 授权 GitLab 访问 GitHub
# 5. 选择要导入的仓库

# 这会自动导入：
# - 所有分支
# - 所有标签
# - 完整历史
# - Issues（可选）
# - Pull Requests（可选）
```

#### 方法 2：手动迁移

```bash
# === 从 GitHub 克隆 ===
git clone --mirror https://github.com/user/repo.git
cd repo.git

# === 添加 GitLab 远程仓库 ===
git remote add gitlab https://gitlab.com/user/repo.git

# === 推送所有内容到 GitLab ===
git push gitlab --all
git push gitlab --tags

# === 验证 ===
# 访问 GitLab 仓库确认所有内容已迁移
```

### GitLab 到 GitHub

```bash
# === 从 GitLab 克隆 ===
git clone --mirror https://gitlab.com/user/repo.git
cd repo.git

# === 在 GitHub 创建新仓库 ===
# 访问 https://github.com/new 创建空仓库

# === 添加 GitHub 远程仓库 ===
git remote add github https://github.com/user/repo.git

# === 推送所有内容到 GitHub ===
git push github --all
git push github --tags
```

### Bitbucket 到 GitHub/GitLab

```bash
# === 从 Bitbucket 克隆 ===
git clone --mirror https://bitbucket.org/user/repo.git
cd repo.git

# === 推送到新平台 ===
git remote add new-origin https://github.com/user/repo.git
git push new-origin --all
git push new-origin --tags
```

### 使用镜像克隆

```bash
# 镜像克隆包含所有引用
git clone --mirror <source-url>

# 进入仓库
cd repo.git

# 推送到新位置
git push --mirror <destination-url>
```

## 保留完整历史

### 迁移所有分支和标签

```bash
# === 方法 1：使用 --mirror ===
git clone --mirror https://source.com/repo.git
cd repo.git
git push --mirror https://destination.com/repo.git

# === 方法 2：手动推送 ===
git clone --bare https://source.com/repo.git
cd repo.git

# 添加新远程仓库
git remote add new-origin https://destination.com/repo.git

# 推送所有分支
git push new-origin --all

# 推送所有标签
git push new-origin --tags

# 推送 notes（如果有）
git push new-origin refs/notes/*
```

### 保留 Git LFS 对象

```bash
# === 迁移包含 LFS 的仓库 ===

# 步骤 1：克隆（包含 LFS）
git clone https://source.com/repo.git
cd repo

# 步骤 2：获取所有 LFS 对象
git lfs fetch --all

# 步骤 3：添加新远程仓库
git remote add new-origin https://destination.com/repo.git

# 步骤 4：推送所有内容
git push new-origin --all
git push new-origin --tags

# 步骤 5：推送 LFS 对象
git lfs push new-origin --all
```

### 验证迁移完整性

```bash
# === 克隆新仓库验证 ===
git clone https://destination.com/repo.git repo-verify
cd repo-verify

# 检查分支数量
git branch -a | wc -l

# 检查标签数量
git tag | wc -l

# 检查提交数量
git rev-list --all --count

# 检查最后一次提交
git log -1

# 与源仓库比对
diff <(cd ../original-repo && git log --all --oneline) \
     <(git log --all --oneline)
```

## 迁移子模块

### 场景：仓库包含子模块

```bash
# 原仓库结构
repo/
├── .gitmodules
├── main-code/
└── submodule1/
```

### 迁移包含子模块的仓库

```bash
# === 步骤 1：克隆主仓库 ===
git clone --recurse-submodules https://source.com/repo.git
cd repo

# === 步骤 2：更新子模块 URL（如果子模块也要迁移）===
# 编辑 .gitmodules
cat .gitmodules
# [submodule "submodule1"]
#   path = submodule1
#   url = https://source.com/submodule1.git

# 更新为新 URL
git config -f .gitmodules submodule.submodule1.url https://destination.com/submodule1.git

# 同步配置
git submodule sync

# === 步骤 3：提交更改 ===
git add .gitmodules
git commit -m "Update submodule URLs"

# === 步骤 4：推送到新仓库 ===
git remote add new-origin https://destination.com/repo.git
git push new-origin --all
git push new-origin --tags

# === 步骤 5：迁移子模块 ===
# 对每个子模块重复迁移过程
cd submodule1
git clone --mirror https://source.com/submodule1.git
cd submodule1.git
git push --mirror https://destination.com/submodule1.git
```

### 转换子模块为单一仓库

有时你可能想将子模块合并到主仓库：

```bash
# === 方法：使用 git filter-repo ===

# 步骤 1：克隆子模块
git clone https://source.com/submodule1.git
cd submodule1

# 步骤 2：使用 filter-repo 添加路径前缀
git filter-repo --to-subdirectory-filter submodule1

# 步骤 3：在主仓库中添加子模块为远程仓库
cd ../main-repo
git remote add submodule1 ../submodule1

# 步骤 4：拉取并合并
git fetch submodule1
git merge --allow-unrelated-histories submodule1/main

# 步骤 5：删除子模块配置
git rm .gitmodules
rm -rf .git/modules/submodule1
git config --remove-section submodule.submodule1

# 步骤 6：提交
git commit -m "Merge submodule1 into main repository"
```

## 批量迁移

### 迁移多个仓库

```bash
# 创建批量迁移脚本
cat > migrate-repos.sh << 'EOF'
#!/bin/bash
# 批量迁移仓库

SOURCE_BASE="https://source.com"
DEST_BASE="https://destination.com"
ORG="myorg"

# 仓库列表
REPOS=(
  "repo1"
  "repo2"
  "repo3"
)

for repo in "${REPOS[@]}"; do
  echo "=== Migrating $repo ==="

  # 克隆
  git clone --mirror "$SOURCE_BASE/$ORG/$repo.git"
  cd "$repo.git"

  # 推送到新位置
  git push --mirror "$DEST_BASE/$ORG/$repo.git"

  # 清理
  cd ..
  rm -rf "$repo.git"

  echo "=== $repo migrated successfully ==="
  echo ""
done

echo "All repositories migrated!"
EOF

chmod +x migrate-repos.sh
./migrate-repos.sh
```

### 使用 API 批量迁移

```bash
# GitHub to GitLab 批量迁移脚本
cat > github-to-gitlab.sh << 'EOF'
#!/bin/bash

GITHUB_USER="username"
GITHUB_TOKEN="ghp_xxxxx"
GITLAB_USER="username"
GITLAB_TOKEN="glpat_xxxxx"

# 获取 GitHub 仓库列表
repos=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
  "https://api.github.com/user/repos?per_page=100" | \
  jq -r '.[].name')

for repo in $repos; do
  echo "=== Migrating $repo ==="

  # 克隆
  git clone --mirror "https://$GITHUB_TOKEN@github.com/$GITHUB_USER/$repo.git"
  cd "$repo.git"

  # 在 GitLab 创建仓库
  curl -s -X POST \
    -H "PRIVATE-TOKEN: $GITLAB_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"$repo\"}" \
    "https://gitlab.com/api/v4/projects"

  # 推送
  git push --mirror "https://oauth2:$GITLAB_TOKEN@gitlab.com/$GITLAB_USER/$repo.git"

  cd ..
  rm -rf "$repo.git"

  echo "=== $repo migrated ==="
done
EOF

chmod +x github-to-gitlab.sh
./github-to-gitlab.sh
```

## 迁移最佳实践

### 1. 迁移前的准备清单

```bash
# === 准备清单 ===

# 1. 通知团队
echo "⚠️ Repository migration scheduled for [date]"

# 2. 备份源仓库
git clone --mirror <source-url> backup-$(date +%Y%m%d)

# 3. 文档当前状态
git branch -a > branches-before.txt
git tag > tags-before.txt
git log --oneline > commits-before.txt

# 4. 检查依赖
# - CI/CD 配置
# - Webhooks
# - 集成服务
# - 子模块链接

# 5. 准备新仓库
# - 创建新仓库
# - 配置访问权限
# - 设置分支保护
```

### 2. 迁移中的操作

```bash
# === 执行迁移 ===

# 1. 使用 --mirror 完整克隆
git clone --mirror <source-url>

# 2. 推送到新位置
cd repo.git
git push --mirror <dest-url>

# 3. 验证
git ls-remote <source-url> > source-refs.txt
git ls-remote <dest-url> > dest-refs.txt
diff source-refs.txt dest-refs.txt

# 4. 记录问题
# 记录任何错误或警告
```

### 3. 迁移后的任务

```bash
# === 迁移后清单 ===

# 1. 验证完整性
git clone <dest-url> verify-repo
cd verify-repo
git branch -a > ../branches-after.txt
git tag > ../tags-after.txt
git log --oneline > ../commits-after.txt

# 比较前后
diff ../branches-before.txt ../branches-after.txt
diff ../tags-before.txt ../tags-after.txt
diff ../commits-before.txt ../commits-after.txt

# 2. 更新文档
# - README 中的链接
# - 徽章 URLs
# - 克隆指令

# 3. 更新 CI/CD
# - .github/workflows (GitHub Actions)
# - .gitlab-ci.yml (GitLab CI)
# - .circleci/config.yml (CircleCI)

# 4. 更新依赖仓库
# 更新其他仓库中的子模块 URL
git config -f .gitmodules submodule.<name>.url <new-url>
git submodule sync

# 5. 通知团队
cat > migration-notice.md << 'EOF'
# Repository Migration Complete

New repository URL: <new-url>

## Action Required:
1. Update your remote URL:
   ```bash
   git remote set-url origin <new-url>
   ```

2. Verify:
   ```bash
   git remote -v
   git fetch
   ```

3. Update any bookmarks or saved links
EOF

# 6. 设置重定向（如果可能）
# GitHub 自动重定向旧 URL
# 其他平台可能需要手动配置
```

### 4. 常见问题处理

```bash
# === 问题 1：推送被拒绝 ===
# 原因：目标仓库不为空
# 解决：
git push --mirror --force <dest-url>

# === 问题 2：LFS 对象缺失 ===
# 解决：
git lfs fetch --all
git lfs push <dest-url> --all

# === 问题 3：大仓库超时 ===
# 解决：分批推送
git push <dest-url> refs/heads/*
git push <dest-url> refs/tags/*

# === 问题 4：子模块 URL 失效 ===
# 解决：更新 .gitmodules
git config -f .gitmodules submodule.<name>.url <new-url>
git submodule sync --recursive
```

## 迁移工具推荐

### 1. git-filter-repo

```bash
# 功能强大的仓库重写工具
pip install git-filter-repo

# 用例：迁移前清理仓库
git filter-repo --path unwanted/ --invert-paths
```

### 2. GitHub CLI (gh)

```bash
# 安装
brew install gh

# 克隆所有仓库
gh repo list myorg --limit 100 | while read -r repo _; do
  gh repo clone "$repo" "$repo"
done
```

### 3. GitLab CLI (glab)

```bash
# 安装
brew install glab

# 迁移项目
glab repo clone <project-id>
```

---

## 💡 练习题

{{< expand "练习 1：从 GitHub 迁移到 GitLab" >}}
**任务**：将一个 GitHub 仓库完整迁移到 GitLab

{{< expand "查看答案" >}}
```bash
# 步骤 1：克隆 GitHub 仓库（镜像）
git clone --mirror https://github.com/user/repo.git
cd repo.git

# 步骤 2：验证克隆
git branch -a
git tag

# 步骤 3：在 GitLab 创建新仓库
# 访问 https://gitlab.com/projects/new
# 创建空仓库（不要初始化）

# 步骤 4：添加 GitLab 远程仓库
git remote add gitlab https://gitlab.com/user/repo.git

# 步骤 5：推送所有内容
git push gitlab --mirror

# 步骤 6：验证迁移
git ls-remote https://github.com/user/repo.git > github-refs.txt
git ls-remote https://gitlab.com/user/repo.git > gitlab-refs.txt
diff github-refs.txt gitlab-refs.txt

# 步骤 7：克隆新仓库验证
cd ..
git clone https://gitlab.com/user/repo.git verify
cd verify
git log --oneline
git branch -a
git tag
```

**关键点**：
- 使用 `--mirror` 确保完整迁移
- 验证所有分支和标签
- 测试克隆新仓库
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 2：迁移包含子模块的仓库" >}}
**场景**：仓库包含子模块，需要一起迁移

{{< expand "查看答案" >}}
```bash
# 步骤 1：克隆主仓库和子模块
git clone --recurse-submodules https://source.com/main-repo.git
cd main-repo

# 步骤 2：查看子模块
cat .gitmodules
# [submodule "lib"]
#   path = lib
#   url = https://source.com/lib.git

# 步骤 3：先迁移子模块
cd lib
git remote get-url origin
# https://source.com/lib.git

# 克隆镜像
cd /tmp
git clone --mirror https://source.com/lib.git
cd lib.git
git push --mirror https://destination.com/lib.git

# 步骤 4：更新主仓库的子模块 URL
cd /path/to/main-repo
git config -f .gitmodules submodule.lib.url https://destination.com/lib.git
git submodule sync
git add .gitmodules
git commit -m "Update submodule URL"

# 步骤 5：迁移主仓库
git remote add new-origin https://destination.com/main-repo.git
git push new-origin --all
git push new-origin --tags

# 步骤 6：验证
cd /tmp
git clone --recurse-submodules https://destination.com/main-repo.git verify
cd verify
cat .gitmodules
cd lib
git remote get-url origin
# 应该是 https://destination.com/lib.git
```
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 3：批量迁移多个仓库" >}}
**任务**：创建脚本批量迁移组织的所有仓库

{{< expand "查看答案" >}}
```bash
# 创建迁移脚本
cat > batch-migrate.sh << 'EOF'
#!/bin/bash

SOURCE="https://github.com/old-org"
DEST="https://gitlab.com/new-org"

# 仓库列表
REPOS=(
  "project1"
  "project2"
  "project3"
)

LOG_FILE="migration-$(date +%Y%m%d-%H%M%S).log"

log() {
  echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

for repo in "${REPOS[@]}"; do
  log "=== Starting migration of $repo ==="

  # 克隆
  if git clone --mirror "$SOURCE/$repo.git" "$repo.git"; then
    log "✓ Cloned $repo"
  else
    log "✗ Failed to clone $repo"
    continue
  fi

  # 推送
  cd "$repo.git"
  if git push --mirror "$DEST/$repo.git"; then
    log "✓ Pushed $repo"
  else
    log "✗ Failed to push $repo"
  fi

  # 验证
  SOURCE_COUNT=$(git ls-remote "$SOURCE/$repo.git" | wc -l)
  DEST_COUNT=$(git ls-remote "$DEST/$repo.git" | wc -l)

  if [ "$SOURCE_COUNT" -eq "$DEST_COUNT" ]; then
    log "✓ Verified $repo ($SOURCE_COUNT refs)"
  else
    log "⚠ Warning: $repo ref count mismatch (source: $SOURCE_COUNT, dest: $DEST_COUNT)"
  fi

  cd ..
  rm -rf "$repo.git"

  log "=== Completed $repo ==="
  log ""
done

log "Migration complete! Check $LOG_FILE for details."
EOF

chmod +x batch-migrate.sh
./batch-migrate.sh
```

**特点**：
- 自动化批量迁移
- 错误处理
- 日志记录
- 验证检查
{{< /expand >}}
{{< /expand >}}

---

{{< hint success >}}
**检查清单** - 完成本节后，你应该能够：

- [ ] 从 SVN 迁移到 Git
- [ ] 在不同 Git 平台间迁移仓库
- [ ] 保留完整的历史、分支和标签
- [ ] 迁移包含子模块的仓库
- [ ] 批量迁移多个仓库
- [ ] 验证迁移的完整性
- [ ] 处理 LFS 对象的迁移
- [ ] 执行迁移前后的任务清单
{{< /hint >}}

{{< hint info >}}
**迁移提示**：
- 始终使用 `--mirror` 进行完整克隆
- 在迁移前后都要验证
- 保留源仓库直到确认迁移成功
- 更新所有文档和依赖
- 通知团队并提供迁移指南
{{< /hint >}}
