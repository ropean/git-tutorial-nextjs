---
title: "分支概念"
weight: 1
bookToc: true
---

# 分支概念

分支是 Git 最重要的特性之一。理解分支的工作原理将帮助你更高效地使用 Git。

## 什么是分支

在 Git 中，**分支（Branch）**是指向提交对象的可移动指针。每次提交时，当前分支指针会自动向前移动。

### 传统版本控制 vs Git

**传统方式**（如 SVN）：
```
创建分支 = 复制整个项目目录
结果：耗时、占用大量磁盘空间
```

**Git 方式**：
```
创建分支 = 创建一个 41 字节的文件
结果：瞬间完成、几乎不占空间
```

{{< hint info >}}
**Git 的分支有多轻量？**

在 Git 中，创建分支只是在 `.git/refs/heads/` 目录下创建一个包含 40 字符 SHA-1 校验和和一个换行符的文件。这就是为什么 Git 鼓励频繁使用分支的原因。
{{< /hint >}}

## 分支的工作原理

### 提交对象

每次提交时，Git 会保存一个提交对象（commit object），它包含：

```
┌─────────────────────┐
│   Commit Object     │
├─────────────────────┤
│ - 作者信息          │
│ - 提交信息          │
│ - 父提交指针        │
│ - 快照指针          │
└─────────────────────┘
```

### 分支就是指针

让我们通过一个例子理解：

```bash
# 初始化仓库
git init -b main
```

**初始状态**：
```
main → (尚未有提交)
```

**第一次提交后**：
```bash
echo "Hello" > README.md
git add README.md
git commit -m "Initial commit"
```

```
┌────────┐
│  main  │ → C1 (Initial commit)
└────────┘
```

**第二次提交后**：
```bash
echo "World" >> README.md
git add README.md
git commit -m "Add world"
```

```
                ┌────────┐
C1 ← C2         │  main  │
     ↑          └────────┘
     └─── main 指向最新提交
```

### 多分支示例

```bash
# 创建新分支
git branch feature
```

现在有两个分支指向同一个提交：

```
                ┌─────────┐
                │  main   │
                └─────────┘
                     ↓
C1 ← C2
     ↑
     └── ┌─────────┐
         │ feature │
         └─────────┘
```

{{< hint info >}}
**注意**：创建新分支并不会自动切换到该分支，main 仍然是当前分支。
{{< /hint >}}

## 分支指针和 HEAD

### HEAD 是什么？

**HEAD** 是一个特殊的指针，指向当前所在的分支。

```
                HEAD
                 ↓
            ┌─────────┐
            │  main   │
            └─────────┘
                 ↓
C1 ← C2 ← C3
          ↑
          └── feature
```

### HEAD 的移动

当你切换分支时，HEAD 会移动：

```bash
# 切换到 feature 分支
git checkout feature
```

```
                HEAD
                 ↓
            ┌─────────┐
            │ feature │
            └─────────┘
                 ↓
C1 ← C2 ← C3
          ↑
          └── main
```

### 在不同分支上提交

**在 feature 分支上提交**：

```bash
echo "Feature code" > feature.txt
git add feature.txt
git commit -m "Add feature"
```

```
                     HEAD
                      ↓
                 ┌─────────┐
                 │ feature │
                 └─────────┘
                      ↓
C1 ← C2 ← C3 ← C4
          ↑
          └── main
```

**切换回 main 并提交**：

```bash
git checkout main
echo "Main update" >> README.md
git add README.md
git commit -m "Update README"
```

```
       C4 ← feature
      ↗
C1 ← C2 ← C3
              ↘
               C5 ← main ← HEAD
```

现在分支历史出现了**分叉**。

## 为什么要使用分支

### 1. 并行开发

不同的功能可以在不同分支上同时开发，互不干扰。

```
main      : A ← B ← C ← D ← E
                ↘       ↗
feature-1 :      F ← G
```

### 2. 实验性开发

可以在分支上尝试新想法，不影响主分支。

```bash
# 创建实验分支
git branch experiment

# 如果实验成功，合并到主分支
git merge experiment

# 如果实验失败，直接删除分支
git branch -d experiment
```

### 3. Bug 修复

可以为每个 bug 创建独立的修复分支。

```
main      : A ← B ← C ← D
                ↘       ↗
hotfix    :      F ← G
```

### 4. 团队协作

每个团队成员可以在自己的分支上工作，完成后合并到主分支。

```
main       : A ← B ← C ← D ← E ← F
                 ↘       ↗       ↗
developer1 :      C1 ← C2       /
                                /
developer2 :      D1 ← D2 ← D3
```

### 5. 版本管理

不同版本的代码可以维护在不同分支上。

```
main        : 最新开发版本
release-1.0 : 1.0 稳定版本
release-2.0 : 2.0 稳定版本
hotfix-1.0  : 1.0 的 bug 修复
```

## 可视化图解

### 完整的分支生命周期

```
1. 创建项目，在 main 分支上开发
   main: C1 ← C2

2. 创建 feature 分支开发新功能
   main:    C1 ← C2
                  ↘
   feature:        C3 ← C4

3. main 分支继续更新
   main:    C1 ← C2 ← C5
                  ↘
   feature:        C3 ← C4

4. feature 开发完成，合并回 main
   main:    C1 ← C2 ← C5 ← M6
                  ↘         ↗
   feature:        C3 ← C4

5. 删除 feature 分支（指针删除，提交保留）
   main:    C1 ← C2 ← C5 ← M6
                  ↘         ↗
                   C3 ← C4
```

### 多个分支并行开发

```
时间线 →

main:       C1 ← C2 ← C3 ────────────────── C7 ← C8
                  ↘                          ↗    ↗
feature-A:         A1 ← A2 ← A3 ──────────── /    /
                       ↘                         /
feature-B:              B1 ← B2 ← B3 ← B4 ──────
```

## 分支的命名规范

### 常见命名约定

**按功能分类**：
```bash
feature/user-authentication    # 新功能
bugfix/login-error            # bug 修复
hotfix/security-patch         # 紧急修复
release/v1.2.0                # 发布版本
```

**按任务编号**：
```bash
feature/JIRA-123-add-payment
bugfix/ISSUE-456-fix-crash
```

**简短描述**：
```bash
add-search-feature
fix-navbar-styling
update-documentation
```

### 命名最佳实践

✅ **好的分支名**：
```bash
feature/user-profile
bugfix/email-validation
hotfix/security-cve-2024
release/2.1.0
```

❌ **不好的分支名**：
```bash
test            # 太模糊
my-branch       # 没有描述
temp            # 临时命名容易遗忘
feature         # 没有说明具体功能
```

{{< hint warning >}}
**分支命名建议**：
- 使用小写字母和连字符
- 包含清晰的描述
- 如果有，包含任务编号
- 避免使用空格和特殊字符
- 保持简短但有意义
{{< /hint >}}

## 分支的类型

### 长期分支

**main/master**：主分支，包含稳定的生产代码
```bash
# 只接受经过测试的合并
# 始终保持可部署状态
```

**develop**：开发分支，集成所有功能
```bash
# 最新的开发进度
# 可能不稳定
```

### 短期分支

**feature branches**：功能分支
```bash
# 开发新功能
# 完成后合并并删除
```

**bugfix branches**：bug 修复分支
```bash
# 修复非紧急 bug
# 修复后合并并删除
```

**hotfix branches**：热修复分支
```bash
# 紧急修复生产问题
# 直接从 main 创建
# 修复后合并到 main 和 develop
```

## 分支策略预览

Git 支持多种分支管理策略（详见后续章节）：

### Git Flow

```
main      ──── stable releases ────
            ↗                    ↗
release  ─── prepare releases ───
         ↗                      ↗
develop ──── integration ────────
         ↘                    ↗
feature   ─── new features ───
```

### GitHub Flow

```
main ── all deployable code ──
    ↘                      ↗
      feature branches ───
```

### GitLab Flow

```
main ──── latest ────
     ↘              ↘
pre-production      production
```

我们将在「分支策略」章节详细介绍这些策略。

## 快速开始

让我们通过一个完整示例理解分支：

```bash
# 1. 初始化仓库
mkdir my-project
cd my-project
git init -b main

# 2. 创建初始提交
echo "# My Project" > README.md
git add README.md
git commit -m "Initial commit"

# 3. 创建并切换到 feature 分支
git checkout -b feature/add-login

# 4. 在 feature 分支上开发
echo "Login functionality" > login.js
git add login.js
git commit -m "Add login feature"

# 5. 切换回 main 分支
git checkout main

# 6. 在 main 分支上也有更新
echo "Update README" >> README.md
git add README.md
git commit -m "Update README"

# 7. 查看分支图
git log --all --graph --oneline

# 输出类似：
# * d3e4f5a (feature/add-login) Add login feature
# | * c2d3e4f (HEAD -> main) Update README
# |/
# * a1b2c3d Initial commit

# 8. 合并 feature 分支（将在后续章节学习）
git merge feature/add-login
```

## 理解检查点

在继续下一章之前，确保你理解：

1. **分支是什么**？
   - 分支是指向提交对象的可移动指针

2. **HEAD 是什么**？
   - HEAD 是指向当前分支的特殊指针

3. **为什么 Git 的分支这么快**？
   - 因为只是创建一个 41 字节的文件（40 字符哈希 + 换行符）

4. **分支的主要用途**？
   - 并行开发、实验、bug 修复、团队协作

## 下一步

理解了分支的概念后，接下来学习如何创建和切换分支。

下一节：[创建和切换分支](../create-switch/) →

---

## 💡 练习题

{{< expand "练习 1：理解分支指针" >}}
**问题**：假设有以下操作，画出最终的分支图：

```bash
git init -b main
echo "1" > file.txt && git add . && git commit -m "C1"
echo "2" >> file.txt && git add . && git commit -m "C2"
git branch feature
git checkout feature
echo "3" >> file.txt && git add . && git commit -m "C3"
```

最终 main 和 feature 分别指向哪个提交？HEAD 指向哪里？

{{< expand "查看答案" >}}
**答案**：

```
                     HEAD
                      ↓
                 ┌─────────┐
                 │ feature │
                 └─────────┘
                      ↓
C1 ← C2 ← C3
      ↑
      └── main
```

**解析**：
1. 创建 C1 和 C2 提交，main 指向 C2
2. `git branch feature` 创建 feature 分支，也指向 C2
3. `git checkout feature` 切换到 feature 分支，HEAD 指向 feature
4. 创建 C3 提交，feature 向前移动到 C3
5. main 仍然指向 C2（创建分支后 main 没有新提交）
6. HEAD 指向 feature（当前分支）

**关键点**：
- 创建分支不会自动切换
- 切换分支会移动 HEAD
- 提交时，当前分支指针向前移动
- 其他分支指针不变
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 2：HEAD 的理解" >}}
**问题**：以下场景中，HEAD 指向什么？

A. 刚执行 `git checkout main`
B. 刚执行 `git checkout <commit-hash>`（分离 HEAD）
C. 刚创建了新分支但未切换

{{< expand "查看答案" >}}
**答案**：

**A. HEAD 指向 main 分支**
```
HEAD → main → C3
```
这是正常状态，HEAD 指向一个分支引用。

**B. HEAD 直接指向提交对象（分离 HEAD）**
```
HEAD → C2
main → C3
```
这种状态称为 "detached HEAD"，HEAD 不指向任何分支，而是直接指向提交。

{{< hint warning >}}
**警告**：在分离 HEAD 状态下的提交可能会丢失！应该创建新分支来保存这些提交。
{{< /hint >}}

**C. HEAD 仍指向之前的分支**
```bash
git checkout main    # HEAD → main
git branch feature   # 只创建分支，HEAD 仍 → main
```

创建分支不会改变 HEAD，只有切换分支（checkout/switch）才会移动 HEAD。
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 3：分支应用场景" >}}
**问题**：为以下场景选择合适的分支操作：

A. 你正在开发新功能，突然需要紧急修复生产环境的 bug
B. 你想尝试一个新的技术方案，但不确定是否可行
C. 你正在开发一个大功能，想先提交部分代码

{{< expand "查看答案" >}}
**答案**：

**A. 紧急 bug 修复**
```bash
# 1. 暂存当前工作（stash，后续章节学习）
git stash

# 2. 切换到 main 分支
git checkout main

# 3. 创建 hotfix 分支
git checkout -b hotfix/critical-bug

# 4. 修复 bug
# ... 修复代码 ...
git add .
git commit -m "Fix critical bug"

# 5. 合并到 main
git checkout main
git merge hotfix/critical-bug

# 6. 删除 hotfix 分支
git branch -d hotfix/critical-bug

# 7. 回到之前的工作
git checkout feature-branch
git stash pop
```

**B. 实验性开发**
```bash
# 1. 创建实验分支
git checkout -b experiment/new-approach

# 2. 进行实验
# ... 编写代码 ...
git commit -am "Try new approach"

# 3. 如果成功，合并到主分支
git checkout main
git merge experiment/new-approach

# 4. 如果失败，直接删除（强制删除）
git checkout main
git branch -D experiment/new-approach
```

**C. 部分提交大功能**
```bash
# 在 feature 分支上工作
git checkout -b feature/big-feature

# 完成一个子功能
# ... 编写代码 ...
git add src/module1/
git commit -m "Implement module 1 of big feature"

# 继续下一个子功能
# ... 编写代码 ...
git add src/module2/
git commit -m "Implement module 2 of big feature"

# 整个功能完成后再合并到 main
git checkout main
git merge feature/big-feature
```

**关键原则**：
- 使用分支隔离不同的工作
- 频繁提交，保持提交粒度小
- 紧急问题优先，使用 stash 保存当前工作
- 实验失败可以安全丢弃分支
{{< /expand >}}
{{< /expand >}}

---

{{< hint success >}}
**检查清单** - 完成本节后，你应该能够：

- [ ] 解释分支是什么（指向提交的可移动指针）
- [ ] 理解 HEAD 的作用（指向当前分支）
- [ ] 理解分支和提交的关系
- [ ] 说明为什么 Git 的分支创建如此快速
- [ ] 列举使用分支的主要场景
- [ ] 理解分支的命名规范
- [ ] 区分长期分支和短期分支
- [ ] 能够画出简单的分支图
{{< /hint >}}
