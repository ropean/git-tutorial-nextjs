import { Metadata } from 'next'
import Link from 'next/link'
import { exercises } from '@/lib/exercises'

export const metadata: Metadata = {
  title: 'Git练习题',
  description: '通过实践练习掌握Git命令',
}

export default function ExercisesPage() {
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

  const categoryLabels = {
    basic: '基础操作',
    branching: '分支管理',
    collaboration: '团队协作',
    advanced: '高级技巧',
  }

  const categories = ['basic', 'branching', 'collaboration', 'advanced'] as const

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Git 练习题</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          通过实战练习掌握 Git 命令，从简单到复杂，循序渐进
        </p>
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary-600 mb-2">{exercises.length}</div>
          <div className="text-gray-600 dark:text-gray-400">练习题</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {exercises.filter(ex => ex.difficulty === 'easy').length}
          </div>
          <div className="text-gray-600 dark:text-gray-400">简单</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-yellow-600 mb-2">
            {exercises.filter(ex => ex.difficulty === 'medium').length}
          </div>
          <div className="text-gray-600 dark:text-gray-400">中等</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-red-600 mb-2">
            {exercises.filter(ex => ex.difficulty === 'hard').length}
          </div>
          <div className="text-gray-600 dark:text-gray-400">困难</div>
        </div>
      </div>

      {/* 按类别分组的练习题 */}
      {categories.map(category => {
        const categoryExercises = exercises.filter(ex => ex.category === category)
        if (categoryExercises.length === 0) return null

        return (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-bold mb-6">{categoryLabels[category]}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categoryExercises.map((exercise) => (
                <Link
                  key={exercise.id}
                  href={`/exercises/${exercise.id}`}
                  className="card hover:scale-105 transition-transform duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold flex-1">{exercise.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${difficultyColors[exercise.difficulty]}`}>
                      {difficultyLabels[exercise.difficulty]}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {exercise.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {exercise.concepts.map((concept) => (
                      <span
                        key={concept}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs"
                      >
                        {concept}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )
      })}

      <div className="mt-12 card">
        <h2 className="text-2xl font-bold mb-4">如何使用练习题？</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
          <li>选择一个练习题开始</li>
          <li>阅读场景描述和任务要求</li>
          <li>在 <Link href="/playground" className="text-primary-600 dark:text-primary-400 underline">练习场</Link> 中尝试完成任务</li>
          <li>需要帮助时查看提示</li>
          <li>完成后对比标准答案</li>
          <li>理解相关概念，加深记忆</li>
        </ol>
      </div>
    </div>
  )
}
