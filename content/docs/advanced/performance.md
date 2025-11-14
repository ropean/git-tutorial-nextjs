---
title: "性能优化"
weight: 8
bookToc: true
---

# 性能优化

随着项目的增长，Git 仓库可能变得越来越大，操作越来越慢。本章将介绍如何优化 Git 仓库的性能和体积。

## 仓库体积分析

### 查看仓库大小

```bash
# 查看仓库总大小
du -sh .git

# 详细的大小统计
git count-objects -vH

# 输出示例：
# count: 234
# size: 15.2 MiB
# in-pack: 1234
# packs: 3
# size-pack: 45.6 MiB
# prune-packable: 0
# garbage: 0
# size-garbage: 0 bytes
```

### 查找大文件

```bash
# 查找仓库中最大的 10 个文件
git rev-list --objects --all | \
  git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | \
  sed -n 's/^blob //p' | \
  sort --numeric-sort --key=2 | \
  tail -n 10 | \
  numfmt --field=2 --to=iec-i --suffix=B --padding=7

# 输出示例：
# abc1234  50.0MiB path/to/large-file.zip
# def5678  35.0MiB videos/demo.mp4
# 9876543  20.0MiB data/large-dataset.csv
```

### 查找占用空间的文件类型

```bash
# 按文件类型统计
git rev-list --objects --all | \
  git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | \
  awk '/^blob/ {print substr($0,6)}' | \
  awk '{ext=substr($3,index($3,".")+1); size[$1]+=$2; count[ext]++} END {for (e in size) print e, size[e], count[e]}' | \
  sort -k2 -rn | \
  head -20
```

## git gc - 垃圾回收

Git 垃圾回收（Garbage Collection）可以清理不必要的文件并优化仓库。

### 基本用法

```bash
# 运行垃圾回收
git gc

# 更激进的清理
git gc --aggressive

# 删除所有不可达的对象
git gc --prune=now

# 组合使用
git gc --aggressive --prune=now
```

### 自动垃圾回收

```bash
# Git 会在某些操作后自动运行 gc
# 如：git pull, git merge, git rebase

# 配置自动 gc 阈值
git config gc.auto 256  # 当松散对象超过 256 个时自动 gc

# 禁用自动 gc
git config gc.auto 0
```

### 手动清理

```bash
# 清理引用日志
git reflog expire --expire=now --all

# 删除悬空对象
git prune

# 完整清理流程
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

### gc 配置优化

```bash
# 设置更激进的压缩
git config gc.aggressiveWindow 250
git config gc.aggressiveDepth 250

# 配置引用日志过期时间
git config gc.reflogExpire 30  # 30 天后过期
git config gc.reflogExpireUnreachable 7  # 不可达对象 7 天后过期
```

{{< hint info >}}
**注意**：`git gc --aggressive` 会花费较长时间，但能显著减小仓库大小。通常在迁移或优化仓库时使用。
{{< /hint >}}

## Git LFS - 大文件存储

Git LFS (Large File Storage) 用于管理大文件，避免它们直接存储在 Git 仓库中。

### 安装 Git LFS

```bash
# macOS
brew install git-lfs

# Ubuntu/Debian
apt install git-lfs

# Windows
# 下载安装程序：https://git-lfs.github.com/

# 初始化
git lfs install
```

### 基本用法

```bash
# 追踪特定文件类型
git lfs track "*.psd"
git lfs track "*.zip"
git lfs track "*.mp4"

# 追踪特定文件
git lfs track "large-file.bin"

# 追踪特定目录
git lfs track "assets/**"

# 查看追踪的文件
git lfs ls-files

# 查看追踪规则
cat .gitattributes
```

### 迁移现有文件到 LFS

```bash
# 迁移特定类型的文件
git lfs migrate import --include="*.zip"

# 迁移特定文件
git lfs migrate import --include="large-file.bin"

# 迁移并重写历史（危险！）
git lfs migrate import --include="*.zip" --everything

# 查看迁移信息
git lfs migrate info
```

### 工作流

```bash
# 1. 设置追踪规则
git lfs track "*.psd"

# 2. 提交 .gitattributes
git add .gitattributes
git commit -m "Track PSD files with LFS"

# 3. 添加大文件
cp design.psd ./
git add design.psd
git commit -m "Add design file"

# 4. 推送（会上传到 LFS 存储）
git push origin main

# 5. 克隆时自动下载 LFS 文件
git clone <repo-url>
```

### LFS 配置

```bash
# 查看 LFS 配置
git lfs env

# 配置并发上传数
git config lfs.concurrenttransfers 8

# 配置上传/下载超时
git config lfs.activitytimeout 30

# 跳过 LFS 文件下载（只下载指针）
git lfs fetch --exclude="*"
```

### LFS 优势和劣势

**优势**：
- ✅ 减小仓库体积
- ✅ 加快克隆速度
- ✅ 适合二进制文件

**劣势**：
- ❌ 需要额外的 LFS 存储空间
- ❌ GitHub/GitLab 有 LFS 配额限制
- ❌ 增加了一些复杂性

## 浅克隆优化

浅克隆（Shallow Clone）只获取部分提交历史，大大减少克隆时间和空间。

### 基本浅克隆

```bash
# 只克隆最近 1 次提交
git clone --depth 1 <repo-url>

# 只克隆最近 10 次提交
git clone --depth 10 <repo-url>

# 克隆特定分支的浅克隆
git clone --depth 1 --branch main <repo-url>
```

### 加深浅克隆

```bash
# 将浅克隆加深到最近 100 次提交
git fetch --depth 100

# 获取完整历史
git fetch --unshallow

# 或
git pull --unshallow
```

### 部分克隆（Partial Clone）

Git 2.19+ 支持部分克隆，只下载需要的对象。

```bash
# 不下载 blob 对象
git clone --filter=blob:none <repo-url>

# 不下载大于 1MB 的 blob
git clone --filter=blob:limit=1m <repo-url>

# 不下载树对象
git clone --filter=tree:0 <repo-url>

# 组合使用
git clone --filter=blob:none --depth 1 <repo-url>
```

### CI/CD 优化

```yaml
# GitHub Actions 示例
jobs:
  build:
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 1  # 浅克隆
          lfs: false      # 不下载 LFS 文件
```

```yaml
# GitLab CI 示例
variables:
  GIT_DEPTH: 1  # 浅克隆
  GIT_LFS_SKIP_SMUDGE: 1  # 跳过 LFS
```

## 仓库维护

### 定期维护脚本

```bash
#!/bin/bash
# git-maintenance.sh

echo "开始 Git 仓库维护..."

# 1. 清理引用日志
echo "清理引用日志..."
git reflog expire --expire=30.days --all

# 2. 删除不可达对象
echo "删除不可达对象..."
git prune --expire=7.days

# 3. 垃圾回收
echo "运行垃圾回收..."
git gc --auto

# 4. 验证仓库完整性
echo "验证仓库..."
git fsck --full

# 5. 显示优化后的大小
echo "当前仓库大小："
du -sh .git
git count-objects -vH

echo "维护完成！"
```

### 设置定期维护

```bash
# Git 2.30+ 支持内置维护
git maintenance start

# 配置维护任务
git config maintenance.auto true
git config maintenance.gc.enabled true
git config maintenance.commit-graph.enabled true
git config maintenance.prefetch.enabled true
```

## 加速克隆和推拉

### 使用镜像克隆

```bash
# 镜像克隆（包含所有引用）
git clone --mirror <repo-url> repo.git

# 从镜像克隆更快
git clone repo.git my-repo
```

### 并行下载

```bash
# Git 2.8+ 支持并行下载
git config --global submodule.fetchJobs 8

# 并行克隆子模块
git clone --recursive --jobs 8 <repo-url>
```

### 使用 Git 协议

```bash
# Git 协议通常比 HTTPS 更快
git clone git://github.com/user/repo.git

# 但安全性较低，生产环境建议使用 SSH
git clone git@github.com:user/repo.git
```

### 配置 HTTP 缓冲

```bash
# 增加 HTTP 缓冲区大小
git config --global http.postBuffer 524288000  # 500MB

# 配置超时
git config --global http.lowSpeedLimit 1000
git config --global http.lowSpeedTime 60
```

### 使用代理

```bash
# 配置代理加速下载
git config --global http.proxy http://proxy.example.com:8080
git config --global https.proxy https://proxy.example.com:8080

# 取消代理
git config --global --unset http.proxy
git config --global --unset https.proxy
```

## 优化大仓库

### 单仓多项目（Monorepo）优化

```bash
# 使用 sparse-checkout 只检出需要的目录
git clone --filter=blob:none --no-checkout <repo-url>
cd repo
git sparse-checkout init --cone
git sparse-checkout set project1 project2
git checkout main
```

### 稀疏检出（Sparse Checkout）

```bash
# 1. 启用稀疏检出
git sparse-checkout init

# 2. 设置要检出的目录
git sparse-checkout set src/ docs/

# 3. 添加更多目录
git sparse-checkout add tests/

# 4. 查看当前配置
git sparse-checkout list

# 5. 禁用稀疏检出
git sparse-checkout disable
```

### 文件系统监控

```bash
# Git 2.32+ 支持文件系统监控（FSMonitor）
# 加快大仓库的状态检查

# 使用 Watchman（需先安装）
git config core.fsmonitor true
git config core.untrackedCache true

# 查看效果
time git status
```

## 网络优化

### 配置 Git 网络参数

```bash
# 增加并发连接数
git config --global http.maxRequests 5

# 启用 KeepAlive
git config --global http.keepAlive true

# 配置压缩
git config --global core.compression 9  # 0-9，9 最高

# 启用传输压缩
git config --global core.looseCompression 9
```

### Delta 压缩优化

```bash
# 配置 delta 压缩
git config pack.window 10  # 默认 10
git config pack.depth 50   # 默认 50

# 更激进的压缩（更慢但更小）
git config pack.window 250
git config pack.depth 250
```

## 实战场景

### 场景 1：清理大文件

```bash
# 1. 查找大文件
git rev-list --objects --all | \
  git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | \
  sed -n 's/^blob //p' | \
  sort --numeric-sort --key=2 | \
  tail -n 10

# 2. 使用 BFG 移除
java -jar bfg.jar --strip-blobs-bigger-than 50M

# 3. 清理
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# 4. 强制推送
git push --force-with-lease --all
```

### 场景 2：迁移到 LFS

```bash
# 1. 安装 LFS
git lfs install

# 2. 查找大文件
git lfs migrate info --above=10MB

# 3. 迁移
git lfs migrate import --include="*.zip,*.psd" --everything

# 4. 推送
git push --force-with-lease origin main
git lfs push origin main --all
```

### 场景 3：优化 CI/CD

```yaml
# .github/workflows/ci.yml
jobs:
  build:
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 1
          lfs: false

      - name: Cache dependencies
        uses: actions/cache@v3
        with:
          path: ~/.cache
          key: ${{ runner.os }}-build-${{ hashFiles('**/package-lock.json') }}
```

## 监控和诊断

### 性能分析

```bash
# 分析 Git 命令性能
GIT_TRACE=1 git status
GIT_TRACE_PERFORMANCE=1 git log

# 分析网络性能
GIT_TRACE_PACKET=1 git fetch
GIT_CURL_VERBOSE=1 git clone <url>
```

### 仓库健康检查

```bash
# 验证仓库完整性
git fsck --full

# 查看松散对象
git count-objects -v

# 查看包文件
ls -lh .git/objects/pack/

# 验证包文件
git verify-pack -v .git/objects/pack/*.idx
```

## 最佳实践

1. **定期维护**
   ```bash
   # 设置定时任务
   git maintenance start
   ```

2. **使用 LFS 管理大文件**
   ```bash
   git lfs track "*.psd"
   git lfs track "*.zip"
   ```

3. **浅克隆用于 CI/CD**
   ```bash
   git clone --depth 1 <url>
   ```

4. **配置 .gitignore**
   ```bash
   # 避免提交不必要的文件
   node_modules/
   dist/
   *.log
   ```

5. **清理历史中的大文件**
   ```bash
   # 使用 BFG 或 filter-repo
   git filter-repo --strip-blobs-bigger-than 10M
   ```

6. **监控仓库大小**
   ```bash
   # 定期检查
   git count-objects -vH
   ```

## 常见问题

### 克隆很慢

```bash
# 使用浅克隆
git clone --depth 1 <url>

# 使用部分克隆
git clone --filter=blob:none <url>

# 配置代理
git config --global http.proxy <proxy-url>
```

### 推送很慢

```bash
# 增加缓冲区
git config --global http.postBuffer 524288000

# 启用压缩
git config --global core.compression 9

# 使用 SSH 而非 HTTPS
git remote set-url origin git@github.com:user/repo.git
```

### 仓库太大

```bash
# 1. 查找大文件
git rev-list --objects --all | \
  git cat-file --batch-check | \
  sort -k3 -n | tail -n 10

# 2. 移除大文件
git filter-repo --strip-blobs-bigger-than 10M

# 3. 垃圾回收
git gc --aggressive --prune=now
```

## 命令速查

| 命令 | 说明 |
|------|------|
| `git count-objects -vH` | 查看仓库大小统计 |
| `git gc` | 运行垃圾回收 |
| `git gc --aggressive` | 激进的垃圾回收 |
| `git prune` | 删除不可达对象 |
| `git lfs track "*.psd"` | 追踪大文件 |
| `git clone --depth 1` | 浅克隆 |
| `git clone --filter=blob:none` | 部分克隆 |
| `git maintenance start` | 启动自动维护 |
| `git fsck --full` | 验证仓库完整性 |

## 总结

性能优化是一个持续的过程：

1. **预防**：使用 .gitignore，避免提交大文件
2. **监控**：定期检查仓库大小
3. **清理**：使用 gc 和 prune 清理垃圾
4. **优化**：使用 LFS 管理大文件
5. **加速**：使用浅克隆和部分克隆

---

## 💡 练习题

完成以下练习，巩固所学知识：

{{< expand "练习 1：分析仓库大小" >}}
**任务**：
1. 查看当前仓库的总大小
2. 查看详细的对象统计
3. 运行垃圾回收并比较前后大小

{{< expand "查看答案" >}}
```bash
# 1. 查看仓库总大小
echo "清理前："
du -sh .git

# 2. 查看详细统计
git count-objects -vH

# 3. 运行垃圾回收
git gc --aggressive --prune=now

# 4. 再次查看大小
echo "清理后："
du -sh .git
git count-objects -vH

# 5. 比较差异
# 记录两次结果的差异
```
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 2：使用浅克隆" >}}
**任务**：
1. 浅克隆一个大型开源项目
2. 比较浅克隆和完整克隆的时间和大小差异
3. 将浅克隆转换为完整克隆

{{< expand "查看答案" >}}
```bash
# 1. 浅克隆（以 Linux 内核为例）
time git clone --depth 1 https://github.com/torvalds/linux.git linux-shallow
cd linux-shallow
du -sh .git

# 2. 完整克隆（在另一个目录）
cd ..
time git clone https://github.com/torvalds/linux.git linux-full
cd linux-full
du -sh .git

# 3. 比较
# 浅克隆：约 200MB，几分钟
# 完整克隆：约 3GB，可能需要一小时

# 4. 将浅克隆转换为完整克隆
cd ../linux-shallow
git fetch --unshallow

# 验证
git log --oneline | wc -l
# 应该显示完整的提交数量
```
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 3：配置 Git LFS" >}}
**任务**：
1. 安装并初始化 Git LFS
2. 配置追踪 .zip 和 .pdf 文件
3. 添加一个大文件并验证 LFS 是否工作

{{< expand "查看答案" >}}
```bash
# 1. 安装 LFS（如果未安装）
# macOS: brew install git-lfs
# Ubuntu: apt install git-lfs

# 初始化
git lfs install

# 2. 配置追踪规则
git lfs track "*.zip"
git lfs track "*.pdf"

# 3. 提交 .gitattributes
git add .gitattributes
git commit -m "Configure LFS tracking"

# 4. 添加大文件
# 创建一个测试文件
dd if=/dev/zero of=large-file.zip bs=1M count=50
git add large-file.zip
git commit -m "Add large file"

# 5. 验证 LFS
git lfs ls-files
# 输出应该显示 large-file.zip

# 6. 查看文件内容（应该是 LFS 指针）
cat .git/lfs/objects/*/$(git hash-object large-file.zip | cut -c1-2)/$(git hash-object large-file.zip | cut -c3-4)/$(git hash-object large-file.zip)

# 7. 推送到远程
git push origin main
git lfs push origin main --all
```
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 4：优化 CI/CD 克隆" >}}
**思考题**：

A. 在 CI/CD 中应该使用什么样的克隆策略？
B. 如何减少 CI/CD 中的克隆时间？
C. 什么情况下需要完整的历史记录？

{{< expand "查看答案" >}}
**答案**：

**A. CI/CD 克隆策略**：

```yaml
# GitHub Actions - 推荐配置
jobs:
  build:
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 1        # 浅克隆
          lfs: false            # 不下载 LFS（除非需要）
          submodules: false     # 不克隆子模块（除非需要）

# GitLab CI - 推荐配置
variables:
  GIT_DEPTH: 1                  # 浅克隆
  GIT_LFS_SKIP_SMUDGE: 1       # 跳过 LFS
  GIT_SUBMODULE_STRATEGY: none  # 不克隆子模块
```

**B. 减少克隆时间的方法**：

1. **使用浅克隆**：
```yaml
fetch-depth: 1  # 只克隆最近一次提交
```

2. **缓存 Git 仓库**：
```yaml
- name: Cache Git repository
  uses: actions/cache@v3
  with:
    path: .git
    key: ${{ runner.os }}-git-${{ github.sha }}
```

3. **跳过 LFS 和子模块**：
```yaml
lfs: false
submodules: false
```

4. **使用部分克隆**：
```yaml
- name: Partial clone
  run: git clone --filter=blob:none <url>
```

5. **并行下载**：
```bash
git config --global submodule.fetchJobs 8
```

**C. 需要完整历史的场景**：

1. **需要运行 git log 分析**：
```yaml
# 例如：生成 changelog
fetch-depth: 0  # 完整历史
```

2. **需要 git blame**：
```yaml
# 查找代码作者
fetch-depth: 0
```

3. **需要比较分支**：
```yaml
# 例如：比较 PR 分支和主分支
fetch-depth: 0
```

4. **需要访问标签**：
```yaml
# 基于标签的版本发布
fetch-depth: 0
```

**最佳实践对比**：

| 场景 | 克隆策略 | 原因 |
|------|---------|------|
| 单元测试 | `fetch-depth: 1` | 只需要最新代码 |
| 构建部署 | `fetch-depth: 1` | 只需要最新代码 |
| 代码扫描 | `fetch-depth: 1` | 只扫描当前代码 |
| Changelog 生成 | `fetch-depth: 0` | 需要完整历史 |
| 版本发布 | `fetch-depth: 0` | 需要标签信息 |
| 代码审查 | `fetch-depth: 0` | 需要比较历史 |

**完整示例**：

```yaml
# .github/workflows/optimized-ci.yml
name: Optimized CI

on: [push, pull_request]

jobs:
  # 快速测试（使用浅克隆）
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 1
          lfs: false

      - name: Run tests
        run: npm test

  # 发布（需要完整历史）
  release:
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0  # 完整历史用于生成 changelog

      - name: Generate changelog
        run: npm run changelog

      - name: Create release
        run: npm run release
```

**性能对比**：

```bash
# 浅克隆（fetch-depth: 1）
# - 时间：5-10 秒
# - 大小：50-100 MB

# 完整克隆（fetch-depth: 0）
# - 时间：30-60 秒
# - 大小：500-1000 MB

# 节省：80-90% 的时间和空间
```
{{< /expand >}}
{{< /expand >}}

---

{{< hint success >}}
**检查清单** - 完成本节后，你应该能够：

- [ ] 分析仓库大小和查找大文件
- [ ] 使用 `git gc` 优化仓库
- [ ] 配置和使用 Git LFS
- [ ] 使用浅克隆加速下载
- [ ] 优化 CI/CD 中的 Git 操作
- [ ] 清理历史中的大文件
- [ ] 监控和诊断仓库性能
- [ ] 实施仓库维护最佳实践
{{< /hint >}}
