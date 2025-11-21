import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search Git tutorials and documentation',
}

export default function SearchPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">搜索教程</h1>

      <div className="card">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold mb-4">搜索功能即将推出</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            我们正在集成 Algolia DocSearch 提供快速精准的搜索体验
          </p>
          <a href="/tutorials" className="btn-primary inline-block">
            浏览所有教程
          </a>
        </div>
      </div>
    </div>
  )
}
