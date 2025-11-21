import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'All Tutorials',
  description: 'Browse all Git tutorials from beginner to advanced',
}

export default function TutorialsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">所有教程</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Link href="/tutorials/beginner" className="card hover:scale-105 transition-transform">
          <div className="text-5xl mb-4">🌱</div>
          <h2 className="text-2xl font-bold mb-2">入门课程</h2>
          <p className="text-gray-600 dark:text-gray-400">
            从零开始学习 Git 基础知识
          </p>
        </Link>

        <Link href="/tutorials/advanced" className="card hover:scale-105 transition-transform">
          <div className="text-5xl mb-4">🚀</div>
          <h2 className="text-2xl font-bold mb-2">进阶技巧</h2>
          <p className="text-gray-600 dark:text-gray-400">
            深入学习 Git 高级功能
          </p>
        </Link>

        <Link href="/tutorials/projects" className="card hover:scale-105 transition-transform">
          <div className="text-5xl mb-4">💼</div>
          <h2 className="text-2xl font-bold mb-2">实战项目</h2>
          <p className="text-gray-600 dark:text-gray-400">
            通过真实项目应用所学知识
          </p>
        </Link>
      </div>
    </div>
  )
}
