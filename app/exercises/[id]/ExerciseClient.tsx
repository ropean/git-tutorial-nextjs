'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Exercise } from '@/lib/exercises'

interface ExerciseClientProps {
  exercise: Exercise
}

export default function ExerciseClient({ exercise }: ExerciseClientProps) {
  const [showHints, setShowHints] = useState<boolean[]>([])
  const [showSolution, setShowSolution] = useState(false)

  const difficultyColors = {
    easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  }

  const difficultyLabels = {
    easy: '简单',
    medium: '中等',
    hard: '困难',
  }

  const toggleHint = (index: number) => {
    const newShowHints = [...showHints]
    newShowHints[index] = !newShowHints[index]
    setShowHints(newShowHints)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* 返回链接 */}
      <Link
        href="/exercises"
        className="text-primary-600 dark:text-primary-400 hover:underline mb-6 inline-block"
      >
        ← 返回练习列表
      </Link>

      {/* 标题和难度 */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-4xl font-bold flex-1">{exercise.title}</h1>
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${difficultyColors[exercise.difficulty]}`}>
            {difficultyLabels[exercise.difficulty]}
          </span>
        </div>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          {exercise.description}
        </p>
      </div>

      {/* 场景 */}
      <div className="card mb-6">
        <h2 className="text-2xl font-bold mb-4">📖 场景</h2>
        <p className="text-gray-700 dark:text-gray-300">{exercise.scenario}</p>
      </div>

      {/* 任务 */}
      <div className="card mb-6">
        <h2 className="text-2xl font-bold mb-4">✅ 任务</h2>
        <ol className="list-decimal list-inside space-y-2">
          {exercise.tasks.map((task, index) => (
            <li key={index} className="text-gray-700 dark:text-gray-300">
              {task}
            </li>
          ))}
        </ol>
      </div>

      {/* 提示 */}
      <div className="card mb-6">
        <h2 className="text-2xl font-bold mb-4">💡 提示</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          如果遇到困难，可以逐个查看提示：
        </p>
        <div className="space-y-3">
          {exercise.hints.map((hint, index) => (
            <div key={index}>
              <button
                onClick={() => toggleHint(index)}
                className="w-full text-left px-4 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
              >
                <span className="font-medium">提示 {index + 1}</span>
                <span className="float-right">{showHints[index] ? '−' : '+'}</span>
              </button>
              {showHints[index] && (
                <div className="mt-2 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 rounded">
                  <p className="text-gray-700 dark:text-gray-300">{hint}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 参考答案 */}
      <div className="card mb-6">
        <h2 className="text-2xl font-bold mb-4">✨ 参考答案</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          完成练习后，可以查看参考答案进行对比：
        </p>
        <button
          onClick={() => setShowSolution(!showSolution)}
          className="btn-primary mb-4"
        >
          {showSolution ? '隐藏答案' : '显示答案'}
        </button>
        {showSolution && (
          <div className="bg-gray-900 text-green-400 font-mono text-sm p-4 rounded-lg">
            {exercise.solution.map((command, index) => (
              <div key={index} className="mb-1">
                <span className="text-gray-500">$ </span>
                {command}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 相关概念 */}
      <div className="card mb-6">
        <h2 className="text-2xl font-bold mb-4">📚 相关概念</h2>
        <div className="flex flex-wrap gap-3">
          {exercise.concepts.map((concept) => (
            <span
              key={concept}
              className="px-4 py-2 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-lg font-medium"
            >
              {concept}
            </span>
          ))}
        </div>
      </div>

      {/* 练习场链接 */}
      <div className="card text-center">
        <h3 className="text-xl font-bold mb-3">准备好开始了吗？</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          在交互式练习场中实践这些命令
        </p>
        <Link href="/playground" className="btn-primary inline-block">
          前往练习场 →
        </Link>
      </div>

      {/* 导航到下一题 */}
      <div className="mt-8 flex justify-between">
        <Link
          href="/exercises"
          className="btn-secondary"
        >
          ← 返回列表
        </Link>
        <Link
          href="/tutorials"
          className="btn-primary"
        >
          查看教程 →
        </Link>
      </div>
    </div>
  )
}
