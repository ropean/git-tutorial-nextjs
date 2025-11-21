'use client'

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'

// 模拟搜索结果接口
interface SearchResult {
  title: string
  description: string
  category: string
  url: string
}

export default function AlgoliaSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // 模拟搜索功能 - 在实际使用中会替换为真实的 Algolia API
  const mockSearchData: SearchResult[] = [
    {
      title: 'Git 初始化',
      description: '学习如何初始化 Git 仓库并开始版本控制',
      category: 'beginner',
      url: '/tutorials/beginner/git-init'
    },
    {
      title: 'Git 基本工作流程',
      description: '了解 Git 的基本工作流程：add、commit、push',
      category: 'beginner',
      url: '/tutorials/beginner/basic-workflow'
    },
    {
      title: 'Git 分支管理',
      description: '掌握 Git 分支的创建、切换和合并',
      category: 'advanced',
      url: '/tutorials/advanced/branching'
    },
    {
      title: 'Git 冲突解决',
      description: '学习如何解决 Git 合并冲突',
      category: 'advanced',
      url: '/tutorials/advanced/conflict-resolution'
    },
    {
      title: '团队协作最佳实践',
      description: '使用 Git 进行团队协作的最佳实践和技巧',
      category: 'projects',
      url: '/tutorials/projects/team-workflow'
    }
  ]

  useEffect(() => {
    if (query.trim() === '') {
      setResults([])
      return
    }

    setIsSearching(true)

    // 模拟异步搜索
    const timer = setTimeout(() => {
      const filtered = mockSearchData.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      )
      setResults(filtered)
      setIsSearching(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  return (
    <div className="w-full">
      {/* 搜索框 */}
      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索教程、命令或概念..."
          className="w-full pl-12 pr-4 py-4 text-lg bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
        />
      </div>

      {/* 搜索状态 */}
      {isSearching && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">搜索中...</p>
        </div>
      )}

      {/* 搜索结果 */}
      {!isSearching && query && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            找到 {results.length} 个结果
          </p>

          {results.length === 0 ? (
            <div className="card text-center py-12">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-bold mb-2">未找到相关结果</h3>
              <p className="text-gray-600 dark:text-gray-400">
                尝试使用不同的关键词或浏览
                <a href="/tutorials" className="text-primary-600 hover:underline ml-1">
                  所有教程
                </a>
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((result, index) => (
                <a
                  key={index}
                  href={result.url}
                  className="block card hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 hover:text-primary-600 dark:hover:text-primary-400">
                        {result.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {result.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                          result.category === 'beginner'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : result.category === 'advanced'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                        }`}>
                          {result.category === 'beginner' ? '入门' : result.category === 'advanced' ? '进阶' : '实战'}
                        </span>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 初始状态 - 显示搜索建议 */}
      {!query && (
        <div className="card">
          <h3 className="text-xl font-bold mb-4">搜索建议</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2 text-primary-600 dark:text-primary-400">
                热门搜索
              </h4>
              <ul className="space-y-2">
                {['Git 基础', '分支管理', '冲突解决', '远程仓库', '回滚提交'].map(term => (
                  <li key={term}>
                    <button
                      onClick={() => setQuery(term)}
                      className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 text-sm"
                    >
                      {term}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-primary-600 dark:text-primary-400">
                快速链接
              </h4>
              <ul className="space-y-2">
                <li>
                  <a href="/tutorials/beginner" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 text-sm">
                    入门教程
                  </a>
                </li>
                <li>
                  <a href="/tutorials/advanced" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 text-sm">
                    进阶教程
                  </a>
                </li>
                <li>
                  <a href="/cheatsheet" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 text-sm">
                    速查手册
                  </a>
                </li>
                <li>
                  <a href="/playground" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 text-sm">
                    练习场
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>提示：</strong> 当前使用模拟搜索。要启用 Algolia 全文搜索，请在环境变量中配置 NEXT_PUBLIC_ALGOLIA_APP_ID 和 NEXT_PUBLIC_ALGOLIA_SEARCH_KEY。
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
