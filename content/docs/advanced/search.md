---
title: "高级搜索"
weight: 6
bookToc: true
---

# 高级搜索

Git 提供了强大的搜索功能，可以快速查找代码、提交、历史变更等。掌握这些搜索技巧能大大提高问题定位和代码审查的效率。

## git grep - 搜索代码

`git grep` 用于在工作目录或历史版本中搜索文本内容。

### 基本用法

```bash
# 在工作目录中搜索
git grep "pattern"

# 示例：搜索包含 "TODO" 的代码
git grep "TODO"

# 输出示例：
# src/app.js:15:// TODO: Fix this bug
# src/utils.js:42:// TODO: Optimize performance
```

### 搜索选项

```bash
# 忽略大小写
git grep -i "pattern"

# 显示行号
git grep -n "pattern"

# 只显示文件名
git grep -l "pattern"

# 显示匹配的数量
git grep -c "pattern"

# 显示上下文（前后各 3 行）
git grep -C 3 "pattern"

# 显示函数名
git grep -p "pattern"
```

### 高级搜索

```bash
# 搜索正则表达式
git grep -E "function\s+\w+\("

# 搜索整个单词
git grep -w "word"

# 搜索多个模式（AND）
git grep -e "pattern1" --and -e "pattern2"

# 搜索多个模式（OR）
git grep -e "pattern1" -e "pattern2"

# 搜索但排除某些模式
git grep "pattern" --not -e "exclude"
```

### 在特定文件中搜索

```bash
# 只在 .js 文件中搜索
git grep "pattern" -- "*.js"

# 在特定目录搜索
git grep "pattern" src/

# 排除特定目录
git grep "pattern" -- ":(exclude)node_modules"
```

### 在历史版本中搜索

```bash
# 在特定提交中搜索
git grep "pattern" HEAD

# 在特定分支中搜索
git grep "pattern" main

# 在特定标签中搜索
git grep "pattern" v1.0.0

# 在所有提交中搜索
git grep "pattern" $(git rev-list --all)
```

### 实用示例

```bash
# 查找所有 console.log
git grep -n "console\.log"

# 查找所有 TODO 和 FIXME
git grep -E "TODO|FIXME"

# 查找函数定义
git grep -E "function\s+\w+\("

# 查找包含特定字符串的配置文件
git grep "database" -- "*.json" "*.yaml"

# 查找某个变量的所有使用
git grep -w "variableName"
```

{{< hint info >}}
**git grep vs 普通 grep**：
- `git grep` 只搜索被 Git 跟踪的文件
- 自动忽略 `.gitignore` 中的文件
- 支持在历史版本中搜索
- 通常比普通 grep 更快
{{< /hint >}}

## git log - 搜索提交

### 按内容搜索

```bash
# 搜索提交信息
git log --grep="bug fix"

# 忽略大小写
git log --grep="bug fix" -i

# 搜索代码变更（查找添加或删除了特定文本的提交）
git log -S"function_name"

# 正则搜索代码变更
git log -G"pattern"
```

### 按作者搜索

```bash
# 搜索特定作者的提交
git log --author="John"

# 搜索多个作者
git log --author="John\|Jane"

# 排除特定作者
git log --author="^(?!.*bot).*$" --perl-regexp
```

### 按时间搜索

```bash
# 搜索特定日期之后的提交
git log --since="2024-01-01"
git log --after="2024-01-01"

# 搜索特定日期之前的提交
git log --until="2024-12-31"
git log --before="2024-12-31"

# 时间范围
git log --since="2 weeks ago"
git log --since="3 days ago"
git log --since="2024-01-01" --until="2024-12-31"

# 相对时间
git log --since="yesterday"
git log --since="1 month ago"
```

### 按文件搜索

```bash
# 查看文件的提交历史
git log -- path/to/file

# 查看文件的详细变更
git log -p -- path/to/file

# 查看文件的简要统计
git log --stat -- path/to/file

# 查看已删除文件的历史
git log --all --full-history -- path/to/deleted/file
```

### 组合搜索

```bash
# 特定作者在特定时间的提交
git log --author="John" --since="2024-01-01" --until="2024-12-31"

# 特定文件特定作者的提交
git log --author="John" -- src/app.js

# 搜索包含特定文本的提交（提交信息或代码）
git log --all --grep="feature" -S"implement"

# 排除合并提交
git log --no-merges --grep="bug"
```

### 格式化输出

```bash
# 单行显示
git log --oneline --grep="bug"

# 图形化显示
git log --graph --grep="feature"

# 自定义格式
git log --pretty=format:"%h - %an, %ar : %s" --grep="bug"

# 显示统计信息
git log --stat --grep="refactor"
```

## git bisect - 二分查找 bug

`git bisect` 使用二分查找法快速定位引入 bug 的提交。

### 基本用法

```bash
# 1. 开始二分查找
git bisect start

# 2. 标记当前版本为坏版本
git bisect bad

# 3. 标记已知的好版本
git bisect good v1.0.0

# 4. Git 会自动检出中间的提交，测试后标记
git bisect good  # 如果当前版本正常
git bisect bad   # 如果当前版本有问题

# 5. 重复步骤 4，直到找到问题提交

# 6. 结束二分查找
git bisect reset
```

### 实战示例

```bash
# 场景：某个功能在最新代码中出错了

# 1. 开始二分查找
git bisect start

# 2. 当前版本有问题
git bisect bad

# 3. 一周前的版本是好的
git bisect good HEAD~20

# Git 输出：
# Bisecting: 10 revisions left to test after this (roughly 4 steps)
# [abc1234] Some commit message

# 4. 测试当前版本
npm test  # 或手动测试

# 如果测试通过
git bisect good

# 如果测试失败
git bisect bad

# 5. 继续测试，直到找到问题提交
# Git 输出：
# abc1234 is the first bad commit
# commit abc1234...
# Author: John Doe
# Date:   Mon Jan 15 10:00:00 2024
#     feat: add new feature

# 6. 查看该提交
git show abc1234

# 7. 结束并返回原分支
git bisect reset
```

### 自动化二分查找

```bash
# 使用脚本自动测试
git bisect start
git bisect bad
git bisect good v1.0.0

# 运行自动测试
git bisect run npm test

# 或使用自定义脚本
git bisect run ./test-script.sh

# Git 会自动执行测试直到找到问题提交
```

**测试脚本示例** (`test-script.sh`)：

```bash
#!/bin/sh

# 运行测试
npm test

# 返回退出码
# 0 = 测试通过（good）
# 1-127（除125）= 测试失败（bad）
# 125 = 跳过此次测试
exit $?
```

### 跳过某些提交

```bash
# 跳过无法测试的提交（如编译失败）
git bisect skip

# 跳过一个范围的提交
git bisect skip v1.0..v1.1
```

### 可视化二分查找

```bash
# 查看当前二分查找状态
git bisect log

# 可视化剩余的提交
git bisect visualize
# 或
git bisect view
```

## git reflog - 查找丢失的提交

`git reflog` 记录了 HEAD 和分支引用的变化历史，可以恢复"丢失"的提交。

### 基本用法

```bash
# 查看 reflog
git reflog

# 输出示例：
# abc1234 HEAD@{0}: commit: Add feature
# def5678 HEAD@{1}: reset: moving to HEAD~1
# 9876543 HEAD@{2}: commit: Fix bug
```

### 查找丢失的提交

```bash
# 场景：误执行了 git reset --hard

# 1. 查看 reflog
git reflog

# 2. 找到误操作前的提交
# HEAD@{1}: reset: moving to HEAD~1
# HEAD@{2}: commit: Important work  <- 想要恢复的提交

# 3. 恢复到该提交
git reset --hard HEAD@{2}

# 或使用提交哈希
git reset --hard 9876543
```

### 查找特定操作

```bash
# 查看最近的检出操作
git reflog show --all | grep checkout

# 查看最近的提交
git reflog show --all | grep commit

# 查看最近的合并
git reflog show --all | grep merge

# 查看最近的重置
git reflog show --all | grep reset
```

### 恢复删除的分支

```bash
# 场景：误删了分支

# 1. 查看 reflog
git reflog

# 2. 找到分支删除前的提交
# abc1234 HEAD@{3}: commit (feature-branch): Last commit on feature

# 3. 重新创建分支
git branch feature-branch abc1234

# 或直接检出
git checkout -b feature-branch abc1234
```

### 时间范围查询

```bash
# 查看最近 1 天的记录
git reflog show --since="1 day ago"

# 查看最近 1 周的记录
git reflog show --since="1 week ago"

# 查看特定时间范围
git reflog show --since="2024-01-01" --until="2024-01-31"
```

### 查看特定分支的 reflog

```bash
# 查看特定分支的 reflog
git reflog show main

# 查看远程分支的 reflog
git reflog show origin/main
```

{{< hint warning >}}
**注意**：reflog 是本地的，不会推送到远程。默认保留 90 天。
{{< /hint >}}

## 综合搜索示例

### 示例 1：查找引入 bug 的提交

```bash
# 1. 搜索包含特定函数的提交
git log -S"buggy_function"

# 2. 查看详细变更
git log -p -S"buggy_function"

# 3. 使用 bisect 精确定位
git bisect start
git bisect bad
git bisect good v1.0.0
git bisect run npm test
```

### 示例 2：查找删除的代码

```bash
# 1. 搜索删除了特定代码的提交
git log -S"deleted_code" --diff-filter=D

# 2. 查看详细内容
git show <commit-hash>

# 3. 恢复代码
git checkout <commit-hash>~1 -- path/to/file
```

### 示例 3：代码考古

```bash
# 谁写了这行代码？
git blame path/to/file

# 查看特定行的历史
git log -L 10,20:path/to/file

# 查看文件重命名前的历史
git log --follow path/to/file

# 查看完整的文件历史
git log --all --full-history -- path/to/file
```

### 示例 4：查找性能问题

```bash
# 查找可能的性能问题关键词
git grep -i "performance\|slow\|optimize"

# 查找最近修改性能相关的提交
git log --grep="performance" --since="1 month ago"

# 使用 bisect 定位性能退化
git bisect start
git bisect bad
git bisect good v1.0.0
git bisect run ./performance-test.sh
```

## 搜索技巧和最佳实践

### 1. 组合使用工具

```bash
# grep + log：找到代码后查看历史
git grep "function_name" | cut -d: -f1 | xargs git log --

# 查找并显示上下文
git grep -C 5 "pattern"
```

### 2. 创建搜索别名

```bash
# 搜索提交信息
git config --global alias.find "log --all --grep"

# 搜索代码变更
git config --global alias.search "log -S"

# 查找文件
git config --global alias.file "log --all --full-history --"
```

### 3. 使用 pickaxe

```bash
# 查找添加或删除了特定字符串的提交
git log -S"string"

# 使用正则表达式
git log -G"pattern"

# 显示详细差异
git log -p -S"string"
```

### 4. 搜索优化

```bash
# 限制搜索范围
git log --since="1 month ago" --grep="bug"

# 排除合并提交
git log --no-merges -S"code"

# 只看主分支
git log main -S"code"
```

## 常见问题

### 搜索速度慢

```bash
# 限制搜索范围
git grep "pattern" -- "src/"  # 只在 src 目录搜索

# 使用更精确的模式
git grep -w "exact_word"  # 精确匹配单词

# 避免搜索所有历史
git log --since="1 month ago" -S"code"
```

### 找不到已删除的文件

```bash
# 使用 --all --full-history
git log --all --full-history -- path/to/deleted/file

# 查找文件删除的提交
git log --diff-filter=D -- path/to/file
```

### reflog 找不到记录

```bash
# reflog 默认保留 90 天
git config --global gc.reflogExpire 180  # 延长到 180 天

# 查看 reflog 过期配置
git config --get gc.reflogExpire
```

## 命令速查

| 命令 | 说明 |
|------|------|
| `git grep "pattern"` | 在工作目录搜索 |
| `git grep -n "pattern"` | 显示行号 |
| `git grep -l "pattern"` | 只显示文件名 |
| `git log --grep="msg"` | 搜索提交信息 |
| `git log -S"code"` | 搜索代码变更 |
| `git log --author="name"` | 按作者搜索 |
| `git log --since="date"` | 按时间搜索 |
| `git bisect start` | 开始二分查找 |
| `git bisect good/bad` | 标记版本 |
| `git bisect reset` | 结束二分查找 |
| `git reflog` | 查看引用日志 |
| `git reflog show main` | 查看分支日志 |

## 下一步

掌握了高级搜索技巧后，接下来学习如何重写 Git 历史。

下一节：[重写历史](../rewrite-history/) →

---

## 💡 练习题

完成以下练习，巩固所学知识：

{{< expand "练习 1：使用 git grep 搜索代码" >}}
**任务**：
1. 在项目中搜索所有 TODO 注释
2. 只显示文件名和行号
3. 搜索包含特定函数的文件

{{< expand "查看答案" >}}
```bash
# 1. 搜索 TODO 注释
git grep -n "TODO"

# 2. 只显示文件名
git grep -l "TODO"

# 3. 显示行号
git grep -n "TODO"

# 4. 搜索特定函数
git grep -n "function myFunction"

# 5. 使用正则搜索函数定义
git grep -nE "function\s+\w+\("

# 6. 在特定文件类型中搜索
git grep -n "TODO" -- "*.js"

# 7. 显示上下文
git grep -C 3 "TODO"
```
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 2：使用 git log 查找提交" >}}
**任务**：
1. 查找包含 "bug" 的提交
2. 查找特定作者最近一周的提交
3. 查找添加了特定函数的提交

{{< expand "查看答案" >}}
```bash
# 1. 搜索提交信息
git log --grep="bug" --oneline

# 2. 按作者和时间搜索
git log --author="Your Name" --since="1 week ago" --oneline

# 3. 搜索代码变更
git log -S"function_name" --oneline

# 4. 查看详细差异
git log -p -S"function_name"

# 5. 组合搜索
git log --author="Your Name" --grep="bug" --since="1 month ago"

# 6. 排除合并提交
git log --no-merges --grep="feature"

# 7. 格式化输出
git log --pretty=format:"%h - %an, %ar : %s" --grep="bug"
```
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 3：使用 git bisect 查找问题" >}}
**任务**：模拟使用 bisect 查找引入 bug 的提交

1. 标记当前版本为坏版本
2. 标记 10 个提交之前为好版本
3. 进行二分查找
4. 找到问题提交后重置

{{< expand "查看答案" >}}
```bash
# 1. 开始二分查找
git bisect start

# 2. 标记当前版本为坏版本
git bisect bad

# 3. 标记好版本
git bisect good HEAD~10

# Git 输出类似：
# Bisecting: 5 revisions left to test after this

# 4. 测试当前版本并标记
# 假设测试失败
git bisect bad

# Git 会检出下一个提交
# 假设测试通过
git bisect good

# 5. 继续测试直到找到问题提交
# Git 输出：
# abc1234 is the first bad commit

# 6. 查看问题提交
git show abc1234

# 7. 结束二分查找
git bisect reset

# 自动化版本：
git bisect start
git bisect bad
git bisect good HEAD~10
git bisect run npm test  # 自动运行测试
git bisect reset
```
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 4：使用 reflog 恢复丢失的提交" >}}
**任务**：
1. 创建一个提交
2. 使用 reset --hard 回退
3. 使用 reflog 恢复提交

{{< expand "查看答案" >}}
```bash
# 1. 创建提交
echo "Important work" > important.txt
git add important.txt
git commit -m "Important commit"

# 记录当前提交哈希
git log -1 --oneline
# 输出：abc1234 Important commit

# 2. 误操作：回退到上一个提交
git reset --hard HEAD~1

# 3. 发现丢失了重要提交
git log -1 --oneline
# 输出：def5678 Previous commit

# 4. 使用 reflog 查找
git reflog

# 输出：
# def5678 HEAD@{0}: reset: moving to HEAD~1
# abc1234 HEAD@{1}: commit: Important commit

# 5. 恢复到丢失的提交
git reset --hard HEAD@{1}

# 或使用提交哈希
git reset --hard abc1234

# 6. 验证恢复成功
git log -1 --oneline
# 输出：abc1234 Important commit

ls important.txt
# 文件已恢复
```
{{< /expand >}}
{{< /expand >}}

{{< expand "练习 5：综合搜索场景" >}}
**思考题**：如何找到以下信息？

A. 查找某个文件在何时被删除
B. 查找谁最后修改了某个函数
C. 查找引入某个 bug 的提交
D. 恢复误删除的分支

{{< expand "查看答案" >}}
**答案**：

**A. 查找文件删除时间**：

```bash
# 方法 1：使用 log 查找删除操作
git log --all --full-history -- path/to/deleted/file

# 方法 2：只查找删除操作
git log --diff-filter=D -- path/to/deleted/file

# 方法 3：查看删除的详细信息
git log --diff-filter=D --summary -- path/to/deleted/file

# 恢复文件
git checkout <commit-hash>~1 -- path/to/deleted/file
```

**B. 查找函数修改者**：

```bash
# 方法 1：使用 blame
git blame path/to/file | grep "function_name"

# 方法 2：查看特定行的历史
git log -L :function_name:path/to/file

# 方法 3：查找修改了该函数的提交
git log -S"function_name" -- path/to/file
git log -G"function.*function_name" -- path/to/file
```

**C. 查找引入 bug 的提交**：

```bash
# 方法 1：使用 bisect
git bisect start
git bisect bad
git bisect good v1.0.0
git bisect run ./test.sh

# 方法 2：搜索相关提交
git log --grep="feature" --since="1 month ago"
git log -S"buggy_code"

# 方法 3：查看文件历史
git log -p -- path/to/buggy/file
```

**D. 恢复误删除的分支**：

```bash
# 1. 查看 reflog
git reflog

# 2. 找到分支删除前的提交
# 输出：
# abc1234 HEAD@{5}: commit (feature-branch): Last commit

# 3. 重新创建分支
git branch feature-branch abc1234

# 或直接检出
git checkout -b feature-branch abc1234

# 4. 验证
git log feature-branch --oneline
```

**综合示例**：

```bash
# 场景：某个功能在某次更新后出问题了

# 1. 找到相关代码
git grep -n "problematic_function"

# 2. 查看该代码的修改历史
git log -p -S"problematic_function"

# 3. 找到最近修改该代码的人
git blame file.js | grep "problematic_function"

# 4. 使用 bisect 精确定位
git bisect start
git bisect bad
git bisect good v1.0.0
git bisect run npm test

# 5. 找到问题提交后分析
git show <commit-hash>
```
{{< /expand >}}
{{< /expand >}}

---

{{< hint success >}}
**检查清单** - 完成本节后，你应该能够：

- [ ] 使用 `git grep` 在代码中搜索内容
- [ ] 使用 `git log` 搜索提交历史
- [ ] 按作者、时间、内容搜索提交
- [ ] 使用 `git bisect` 二分查找 bug
- [ ] 使用 `git reflog` 恢复丢失的提交
- [ ] 查找和恢复删除的文件
- [ ] 组合使用多种搜索工具
- [ ] 创建搜索相关的别名
{{< /hint >}}
