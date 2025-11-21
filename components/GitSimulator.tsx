'use client'

import { useState, useRef, useEffect } from 'react'
import { GitSimulator as Git } from '@/lib/git-simulator'

export default function GitSimulator() {
  const [git] = useState(() => new Git())
  const [output, setOutput] = useState<string[]>(['$ git init\nInitialized empty Git repository\n'])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [files, setFiles] = useState<Record<string, string>>({})
  const outputRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [output])

  const handleCommand = (cmd: string) => {
    if (!cmd.trim()) return

    // 添加到历史
    setHistory(prev => [...prev, cmd])
    setHistoryIndex(-1)

    // 特殊命令：创建文件
    if (cmd.startsWith('echo ') && cmd.includes('>')) {
      const match = cmd.match(/echo ["'](.+)["'] > (.+)/)
      if (match) {
        const [, content, filename] = match
        git.writeFile(filename, content)
        setFiles(prev => ({ ...prev, [filename]: content }))
        setOutput(prev => [...prev, `$ ${cmd}\n`])
        return
      }
    }

    // 执行 Git 命令
    const result = git.executeCommand(cmd)
    setOutput(prev => [...prev, `$ ${cmd}\n${result}\n`])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      handleCommand(input)
      setInput('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (history.length > 0) {
        const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1)
        setHistoryIndex(newIndex)
        setInput(history[newIndex])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex >= 0) {
        const newIndex = historyIndex + 1
        if (newIndex >= history.length) {
          setHistoryIndex(-1)
          setInput('')
        } else {
          setHistoryIndex(newIndex)
          setInput(history[newIndex])
        }
      }
    }
  }

  const quickCommands = [
    { label: '创建文件', cmd: 'echo "Hello World" > README.md' },
    { label: 'git status', cmd: 'git status' },
    { label: 'git add', cmd: 'git add .' },
    { label: 'git commit', cmd: 'git commit -m "Initial commit"' },
    { label: 'git log', cmd: 'git log' },
    { label: 'git branch', cmd: 'git branch feature' },
  ]

  const resetSimulator = () => {
    git.resetSimulator()
    setOutput(['$ git init\nInitialized empty Git repository\n'])
    setFiles({})
    setHistory([])
    setHistoryIndex(-1)
    setInput('')
  }

  const state = git.getState()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 终端 */}
      <div className="lg:col-span-2">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Git 终端模拟器</h3>
            <button
              onClick={resetSimulator}
              className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded transition-colors"
            >
              重置
            </button>
          </div>

          {/* 输出区域 */}
          <div
            ref={outputRef}
            className="bg-gray-900 text-green-400 font-mono text-sm p-4 rounded-lg h-96 overflow-y-auto mb-4"
          >
            {output.map((line, i) => (
              <pre key={i} className="whitespace-pre-wrap">
                {line}
              </pre>
            ))}
          </div>

          {/* 输入区域 */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <span className="text-green-400 font-mono">$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="输入 Git 命令..."
              autoFocus
            />
            <button
              type="submit"
              className="btn-primary text-sm"
            >
              执行
            </button>
          </form>

          {/* 快捷命令 */}
          <div className="mt-4 flex flex-wrap gap-2">
            {quickCommands.map((cmd, i) => (
              <button
                key={i}
                onClick={() => {
                  setInput(cmd.cmd)
                  inputRef.current?.focus()
                }}
                className="px-3 py-1 text-xs bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
              >
                {cmd.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 状态显示 */}
      <div className="space-y-6">
        {/* 工作区 */}
        <div className="card">
          <h4 className="font-bold mb-3">工作区文件</h4>
          {Object.keys(state.workingDirectory).length === 0 ? (
            <p className="text-gray-500 text-sm">暂无文件</p>
          ) : (
            <ul className="space-y-2">
              {Object.entries(state.workingDirectory).map(([filename, content]) => (
                <li key={filename} className="text-sm">
                  <div className="font-mono text-primary-600 dark:text-primary-400">
                    {filename}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 text-xs mt-1 pl-2">
                    {content.substring(0, 50)}...
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 暂存区 */}
        <div className="card">
          <h4 className="font-bold mb-3">暂存区</h4>
          {Object.keys(state.stagingArea).length === 0 ? (
            <p className="text-gray-500 text-sm">暂无文件</p>
          ) : (
            <ul className="space-y-1">
              {Object.keys(state.stagingArea).map(filename => (
                <li key={filename} className="text-sm font-mono text-green-600 dark:text-green-400">
                  ✓ {filename}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 分支 */}
        <div className="card">
          <h4 className="font-bold mb-3">分支</h4>
          <ul className="space-y-1">
            {state.branches.map(branch => (
              <li
                key={branch.name}
                className={`text-sm font-mono ${
                  branch.name === state.currentBranch
                    ? 'text-primary-600 dark:text-primary-400 font-bold'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {branch.name === state.currentBranch ? '* ' : '  '}
                {branch.name}
              </li>
            ))}
          </ul>
        </div>

        {/* 提交历史 */}
        <div className="card">
          <h4 className="font-bold mb-3">提交历史</h4>
          {state.commits.length === 0 ? (
            <p className="text-gray-500 text-sm">暂无提交</p>
          ) : (
            <ul className="space-y-3">
              {state.commits.slice().reverse().map(commit => (
                <li key={commit.id} className="text-sm">
                  <div className="font-mono text-xs text-gray-500">
                    {commit.id.substring(0, 7)}
                  </div>
                  <div className="text-gray-700 dark:text-gray-300 mt-1">
                    {commit.message}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
