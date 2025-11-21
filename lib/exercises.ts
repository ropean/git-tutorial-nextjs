// 练习题数据结构和内容

export interface Exercise {
  id: string
  title: string
  difficulty: 'easy' | 'medium' | 'hard'
  category: 'basic' | 'branching' | 'collaboration' | 'advanced'
  description: string
  scenario: string
  tasks: string[]
  hints: string[]
  solution: string[]
  concepts: string[]
}

export const exercises: Exercise[] = [
  {
    id: 'ex-001',
    title: '创建你的第一个提交',
    difficulty: 'easy',
    category: 'basic',
    description: '学习 Git 的基本工作流：创建文件、添加到暂存区、提交',
    scenario: '你刚初始化了一个新的 Git 仓库，现在需要创建第一个提交。',
    tasks: [
      '创建一个名为 README.md 的文件',
      '将文件添加到暂存区',
      '提交文件，提交信息为 "Initial commit"',
      '查看提交历史',
    ],
    hints: [
      '使用 echo 命令创建文件',
      'git add 命令用于添加文件到暂存区',
      'git commit -m 用于创建提交',
    ],
    solution: [
      'echo "# My Project" > README.md',
      'git add README.md',
      'git commit -m "Initial commit"',
      'git log',
    ],
    concepts: ['工作区', '暂存区', '提交', 'git add', 'git commit'],
  },
  {
    id: 'ex-002',
    title: '查看和理解状态',
    difficulty: 'easy',
    category: 'basic',
    description: '学习使用 git status 查看仓库状态',
    scenario: '你修改了一些文件，现在需要了解当前的仓库状态。',
    tasks: [
      '创建两个文件：file1.txt 和 file2.txt',
      '查看当前状态',
      '只添加 file1.txt 到暂存区',
      '再次查看状态，理解不同区域的文件',
    ],
    hints: [
      'git status 显示工作区和暂存区的状态',
      '未跟踪的文件会显示在 Untracked files 下',
      '暂存的文件会显示在 Changes to be committed 下',
    ],
    solution: [
      'echo "content1" > file1.txt',
      'echo "content2" > file2.txt',
      'git status',
      'git add file1.txt',
      'git status',
    ],
    concepts: ['git status', '未跟踪文件', '暂存区', '工作区'],
  },
  {
    id: 'ex-003',
    title: '创建和切换分支',
    difficulty: 'easy',
    category: 'branching',
    description: '学习分支的创建和切换',
    scenario: '你需要开发一个新功能，最佳实践是在新分支上进行开发。',
    tasks: [
      '创建一个名为 feature 的新分支',
      '切换到 feature 分支',
      '在 feature 分支上创建并提交一个文件',
      '切换回 main 分支',
      '查看分支列表',
    ],
    hints: [
      'git branch 创建新分支',
      'git checkout 切换分支',
      '或使用 git checkout -b 一步完成创建和切换',
    ],
    solution: [
      'git branch feature',
      'git checkout feature',
      'echo "new feature" > feature.txt',
      'git add feature.txt',
      'git commit -m "Add new feature"',
      'git checkout main',
      'git branch',
    ],
    concepts: ['分支', 'git branch', 'git checkout', '分支切换'],
  },
  {
    id: 'ex-004',
    title: '修改最后一次提交',
    difficulty: 'medium',
    category: 'basic',
    description: '学习使用 --amend 修改最近的提交',
    scenario: '你刚刚提交了代码，但发现忘记添加一个文件，或者提交信息写错了。',
    tasks: [
      '创建并提交一个文件',
      '创建另一个应该在同一次提交中的文件',
      '使用 --amend 将新文件添加到最后一次提交',
    ],
    hints: [
      '先正常 git add 新文件',
      '然后使用 git commit --amend',
      '--amend 会修改最后一次提交而不是创建新提交',
    ],
    solution: [
      'echo "file1" > file1.txt',
      'git add file1.txt',
      'git commit -m "Add files"',
      'echo "file2" > file2.txt',
      'git add file2.txt',
      'git commit --amend --no-edit',
    ],
    concepts: ['git commit --amend', '修改提交', '提交历史'],
  },
  {
    id: 'ex-005',
    title: '合并分支',
    difficulty: 'medium',
    category: 'branching',
    description: '学习将feature分支的更改合并到main分支',
    scenario: '你在 feature 分支上完成了开发，现在需要将更改合并回 main 分支。',
    tasks: [
      '在 main 分支上创建一个初始提交',
      '创建并切换到 feature 分支',
      '在 feature 分支上做一些修改并提交',
      '切换回 main 分支',
      '合并 feature 分支',
    ],
    hints: [
      '确保你在要合并到的分支上（main）',
      '使用 git merge 命令',
      'Fast-forward 合并是最简单的合并类型',
    ],
    solution: [
      'echo "initial" > README.md',
      'git add README.md',
      'git commit -m "Initial commit"',
      'git checkout -b feature',
      'echo "feature work" > feature.txt',
      'git add feature.txt',
      'git commit -m "Add feature"',
      'git checkout main',
      'git merge feature',
    ],
    concepts: ['分支合并', 'git merge', 'Fast-forward', '合并策略'],
  },
  {
    id: 'ex-006',
    title: '撤销暂存',
    difficulty: 'medium',
    category: 'basic',
    description: '学习如何取消已添加到暂存区的文件',
    scenario: '你不小心将一个不该提交的文件添加到了暂存区。',
    tasks: [
      '创建两个文件',
      '将两个文件都添加到暂存区',
      '取消其中一个文件的暂存',
      '只提交另一个文件',
    ],
    hints: [
      'git status 会提示如何取消暂存',
      '新版 Git 使用 git restore --staged',
      '旧版使用 git reset HEAD',
    ],
    solution: [
      'echo "good" > good-file.txt',
      'echo "bad" > bad-file.txt',
      'git add .',
      'git status',
      'git restore --staged bad-file.txt',
      'git commit -m "Add good file"',
    ],
    concepts: ['取消暂存', 'git restore', 'git reset', '暂存区管理'],
  },
  {
    id: 'ex-007',
    title: '查看提交历史',
    difficulty: 'easy',
    category: 'basic',
    description: '学习使用不同方式查看 Git 历史',
    scenario: '项目有多个提交，你需要查看项目的演变历史。',
    tasks: [
      '创建3个不同的提交',
      '查看完整的提交历史',
      '查看简洁的单行历史',
      '查看最近2次提交',
    ],
    hints: [
      'git log 显示完整历史',
      'git log --oneline 显示简洁版本',
      'git log -n 限制显示数量',
    ],
    solution: [
      'echo "v1" > file.txt',
      'git add file.txt',
      'git commit -m "Version 1"',
      'echo "v2" > file.txt',
      'git add file.txt',
      'git commit -m "Version 2"',
      'echo "v3" > file.txt',
      'git add file.txt',
      'git commit -m "Version 3"',
      'git log',
      'git log --oneline',
      'git log -2',
    ],
    concepts: ['git log', '提交历史', '版本追踪'],
  },
  {
    id: 'ex-008',
    title: '分支列表和管理',
    difficulty: 'easy',
    category: 'branching',
    description: '学习查看和管理分支',
    scenario: '项目中有多个分支，你需要了解有哪些分支以及当前在哪个分支。',
    tasks: [
      '创建3个不同名称的分支',
      '查看所有分支',
      '识别当前所在的分支',
      '切换到不同的分支',
    ],
    hints: [
      'git branch 显示所有分支',
      '当前分支会用 * 标记',
      'git checkout 切换分支',
    ],
    solution: [
      'git branch feature-1',
      'git branch feature-2',
      'git branch bugfix',
      'git branch',
      'git checkout feature-1',
      'git branch',
    ],
    concepts: ['分支管理', 'git branch', '当前分支', '分支切换'],
  },
  {
    id: 'ex-009',
    title: '理解 .gitignore',
    difficulty: 'medium',
    category: 'basic',
    description: '学习使用 .gitignore 忽略不需要跟踪的文件',
    scenario: '项目中有一些日志文件和临时文件不应该被 Git 跟踪。',
    tasks: [
      '创建 .gitignore 文件',
      '添加规则忽略所有 .log 文件',
      '创建一个 .log 文件',
      '验证该文件被忽略',
      '提交 .gitignore 文件',
    ],
    hints: [
      '.gitignore 文件本身需要被提交',
      '使用 * 通配符匹配文件',
      'git status 不会显示被忽略的文件',
    ],
    solution: [
      'echo "*.log" > .gitignore',
      'echo "test" > test.log',
      'git status',
      'git add .gitignore',
      'git commit -m "Add gitignore"',
    ],
    concepts: ['.gitignore', '忽略文件', '通配符', '版本控制最佳实践'],
  },
  {
    id: 'ex-010',
    title: '多个文件的提交',
    difficulty: 'easy',
    category: 'basic',
    description: '学习一次性添加和提交多个文件',
    scenario: '你修改了多个文件，想要一次性提交所有更改。',
    tasks: [
      '创建3个不同的文件',
      '使用 git add . 一次性添加所有文件',
      '提交所有文件',
      '验证所有文件都被提交',
    ],
    hints: [
      'git add . 添加当前目录所有文件',
      '可以在一次commit中包含多个文件',
      'git log 可以查看提交的文件',
    ],
    solution: [
      'echo "file1" > file1.txt',
      'echo "file2" > file2.txt',
      'echo "file3" > file3.txt',
      'git add .',
      'git status',
      'git commit -m "Add multiple files"',
      'git log',
    ],
    concepts: ['批量添加', 'git add .', '多文件提交'],
  },
]

export function getExercisesByCategory(category: string): Exercise[] {
  return exercises.filter(ex => ex.category === category)
}

export function getExercisesByDifficulty(difficulty: string): Exercise[] {
  return exercises.filter(ex => ex.difficulty === difficulty)
}

export function getExerciseById(id: string): Exercise | undefined {
  return exercises.find(ex => ex.id === id)
}
