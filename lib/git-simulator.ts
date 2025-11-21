// Git 模拟器核心逻辑

export interface Commit {
  id: string
  message: string
  author: string
  date: Date
  parent: string | null
  files: Record<string, string>
}

export interface Branch {
  name: string
  commitId: string
}

export interface GitState {
  workingDirectory: Record<string, string>
  stagingArea: Record<string, string>
  commits: Commit[]
  branches: Branch[]
  currentBranch: string
  HEAD: string
}

export class GitSimulator {
  private state: GitState

  constructor() {
    this.state = {
      workingDirectory: {},
      stagingArea: {},
      commits: [],
      branches: [{ name: 'main', commitId: '' }],
      currentBranch: 'main',
      HEAD: '',
    }
  }

  // 初始化仓库
  init(): string {
    if (this.state.commits.length > 0) {
      return 'Already a Git repository'
    }
    return 'Initialized empty Git repository'
  }

  // 添加文件到工作区
  writeFile(filename: string, content: string): void {
    this.state.workingDirectory[filename] = content
  }

  // 查看状态
  status(): string {
    const untracked: string[] = []
    const modified: string[] = []
    const staged: string[] = []

    // 检查工作区文件
    for (const file in this.state.workingDirectory) {
      if (!(file in this.state.stagingArea)) {
        const lastCommit = this.getLastCommit()
        if (!lastCommit || !(file in lastCommit.files)) {
          untracked.push(file)
        } else if (lastCommit.files[file] !== this.state.workingDirectory[file]) {
          modified.push(file)
        }
      }
    }

    // 检查暂存区
    for (const file in this.state.stagingArea) {
      staged.push(file)
    }

    let output = `On branch ${this.state.currentBranch}\n\n`

    if (staged.length > 0) {
      output += 'Changes to be committed:\n'
      staged.forEach(file => {
        output += `  new file:   ${file}\n`
      })
      output += '\n'
    }

    if (modified.length > 0) {
      output += 'Changes not staged for commit:\n'
      modified.forEach(file => {
        output += `  modified:   ${file}\n`
      })
      output += '\n'
    }

    if (untracked.length > 0) {
      output += 'Untracked files:\n'
      untracked.forEach(file => {
        output += `  ${file}\n`
      })
      output += '\n'
    }

    if (staged.length === 0 && modified.length === 0 && untracked.length === 0) {
      output += 'nothing to commit, working tree clean\n'
    }

    return output
  }

  // 添加到暂存区
  add(filename: string): string {
    if (filename === '.') {
      // 添加所有文件
      this.state.stagingArea = { ...this.state.workingDirectory }
      return ''
    }

    if (!(filename in this.state.workingDirectory)) {
      return `fatal: pathspec '${filename}' did not match any files`
    }

    this.state.stagingArea[filename] = this.state.workingDirectory[filename]
    return ''
  }

  // 提交
  commit(message: string): string {
    if (Object.keys(this.state.stagingArea).length === 0) {
      return 'nothing to commit'
    }

    const id = this.generateId()
    const commit: Commit = {
      id,
      message,
      author: 'User',
      date: new Date(),
      parent: this.state.HEAD || null,
      files: { ...this.state.stagingArea },
    }

    this.state.commits.push(commit)
    this.state.HEAD = id

    // 更新当前分支
    const branch = this.state.branches.find(b => b.name === this.state.currentBranch)
    if (branch) {
      branch.commitId = id
    }

    // 清空暂存区
    this.state.stagingArea = {}

    return `[${this.state.currentBranch} ${id.substring(0, 7)}] ${message}\n 1 file changed`
  }

  // 查看日志
  log(): string {
    if (this.state.commits.length === 0) {
      return 'fatal: your current branch does not have any commits yet'
    }

    let output = ''
    let currentId = this.state.HEAD

    while (currentId) {
      const commit = this.state.commits.find(c => c.id === currentId)
      if (!commit) break

      output += `commit ${commit.id}\n`
      output += `Author: ${commit.author}\n`
      output += `Date:   ${commit.date.toLocaleString()}\n\n`
      output += `    ${commit.message}\n\n`

      currentId = commit.parent || ''
    }

    return output
  }

  // 创建分支
  branch(name: string): string {
    if (this.state.branches.find(b => b.name === name)) {
      return `fatal: A branch named '${name}' already exists`
    }

    this.state.branches.push({
      name,
      commitId: this.state.HEAD,
    })

    return ''
  }

  // 切换分支
  checkout(name: string): string {
    const branch = this.state.branches.find(b => b.name === name)
    if (!branch) {
      return `error: pathspec '${name}' did not match any file(s) known to git`
    }

    this.state.currentBranch = name
    this.state.HEAD = branch.commitId

    // 更新工作区
    const commit = this.state.commits.find(c => c.id === branch.commitId)
    if (commit) {
      this.state.workingDirectory = { ...commit.files }
    }

    return `Switched to branch '${name}'`
  }

  // 列出分支
  listBranches(): string {
    return this.state.branches
      .map(b => {
        const prefix = b.name === this.state.currentBranch ? '* ' : '  '
        return `${prefix}${b.name}`
      })
      .join('\n')
  }

  // 获取当前状态
  getState(): GitState {
    return JSON.parse(JSON.stringify(this.state))
  }

  // 重置状态
  reset(): void {
    this.state = {
      workingDirectory: {},
      stagingArea: {},
      commits: [],
      branches: [{ name: 'main', commitId: '' }],
      currentBranch: 'main',
      HEAD: '',
    }
  }

  private getLastCommit(): Commit | null {
    if (!this.state.HEAD) return null
    return this.state.commits.find(c => c.id === this.state.HEAD) || null
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) +
           Math.random().toString(36).substring(2, 15)
  }

  // 执行命令
  executeCommand(command: string): string {
    const parts = command.trim().split(' ')
    const cmd = parts[0]
    const args = parts.slice(1)

    try {
      switch (cmd) {
        case 'git':
          return this.executeCommand(args.join(' '))

        case 'init':
          return this.init()

        case 'status':
          return this.status()

        case 'add':
          return args.length > 0 ? this.add(args[0]) : 'Nothing specified, nothing added.'

        case 'commit':
          if (args[0] === '-m' && args.length > 1) {
            return this.commit(args.slice(1).join(' ').replace(/['"]/g, ''))
          }
          return 'error: switch `m\' requires a value'

        case 'log':
          return this.log()

        case 'branch':
          if (args.length === 0) {
            return this.listBranches()
          }
          return this.branch(args[0])

        case 'checkout':
          return args.length > 0 ? this.checkout(args[0]) : 'error: missing branch name'

        default:
          return `git: '${cmd}' is not a git command. See 'git --help'.`
      }
    } catch (error) {
      return `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}
