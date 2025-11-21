import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Git Cheat Sheet',
  description: 'Quick reference guide for common Git commands',
}

export default function CheatSheetPage() {
  const commandGroups = [
    {
      title: '配置',
      commands: [
        { cmd: 'git config --global user.name "[name]"', desc: '设置用户名' },
        { cmd: 'git config --global user.email "[email]"', desc: '设置邮箱' },
        { cmd: 'git config --list', desc: '查看配置' },
      ],
    },
    {
      title: '创建与克隆',
      commands: [
        { cmd: 'git init', desc: '初始化本地仓库' },
        { cmd: 'git clone [url]', desc: '克隆远程仓库' },
      ],
    },
    {
      title: '基本操作',
      commands: [
        { cmd: 'git status', desc: '查看状态' },
        { cmd: 'git add [file]', desc: '添加文件到暂存区' },
        { cmd: 'git add .', desc: '添加所有文件到暂存区' },
        { cmd: 'git commit -m "[message]"', desc: '提交更改' },
        { cmd: 'git log', desc: '查看提交历史' },
        { cmd: 'git diff', desc: '查看未暂存的更改' },
      ],
    },
    {
      title: '分支管理',
      commands: [
        { cmd: 'git branch', desc: '列出所有分支' },
        { cmd: 'git branch [branch-name]', desc: '创建新分支' },
        { cmd: 'git checkout [branch-name]', desc: '切换分支' },
        { cmd: 'git checkout -b [branch-name]', desc: '创建并切换到新分支' },
        { cmd: 'git merge [branch]', desc: '合并指定分支到当前分支' },
        { cmd: 'git branch -d [branch-name]', desc: '删除分支' },
      ],
    },
    {
      title: '远程仓库',
      commands: [
        { cmd: 'git remote add [name] [url]', desc: '添加远程仓库' },
        { cmd: 'git remote -v', desc: '查看远程仓库' },
        { cmd: 'git push [remote] [branch]', desc: '推送到远程仓库' },
        { cmd: 'git pull [remote] [branch]', desc: '从远程仓库拉取' },
        { cmd: 'git fetch [remote]', desc: '从远程仓库获取' },
      ],
    },
    {
      title: '撤销操作',
      commands: [
        { cmd: 'git reset [file]', desc: '取消暂存文件' },
        { cmd: 'git reset --hard [commit]', desc: '重置到指定提交' },
        { cmd: 'git revert [commit]', desc: '回退指定提交' },
        { cmd: 'git checkout -- [file]', desc: '丢弃工作区修改' },
      ],
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Git 速查手册</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          快速查找常用 Git 命令和用法
        </p>
      </div>

      <div className="space-y-8">
        {commandGroups.map((group) => (
          <div key={group.title} className="card">
            <h2 className="text-2xl font-bold mb-4">{group.title}</h2>
            <div className="space-y-3">
              {group.commands.map((command, index) => (
                <div
                  key={index}
                  className="border-l-4 border-primary-500 pl-4 py-2"
                >
                  <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-mono">
                    {command.cmd}
                  </code>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {command.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 card text-center">
        <h3 className="text-xl font-bold mb-2">需要更详细的说明？</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          查看我们的完整教程了解每个命令的详细用法
        </p>
        <a href="/tutorials" className="btn-primary inline-block">
          浏览教程
        </a>
      </div>
    </div>
  )
}
