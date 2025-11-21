import Link from 'next/link'
import { Metadata } from 'next'
import { getAllTutorials } from '@/lib/mdx'

interface CategoryPageProps {
  params: Promise<{
    category: string
  }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params
  const titles = {
    beginner: '入门课程',
    advanced: '进阶技巧',
    projects: '实战项目',
  }

  return {
    title: titles[category as keyof typeof titles] || '教程',
    description: `Browse ${category} Git tutorials`,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params
  const tutorials = getAllTutorials(category)

  const titles = {
    beginner: '入门课程',
    advanced: '进阶技巧',
    projects: '实战项目',
  }

  const icons = {
    beginner: '🌱',
    advanced: '🚀',
    projects: '💼',
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="text-6xl mb-4">{icons[category as keyof typeof icons]}</div>
        <h1 className="text-4xl font-bold mb-2">
          {titles[category as keyof typeof titles]}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {tutorials.length} 篇教程
        </p>
      </div>

      {tutorials.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            该分类下暂无教程
          </p>
          <Link href="/tutorials" className="btn-primary inline-block">
            查看所有教程
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tutorials.map((tutorial) => (
            <Link
              key={tutorial.slug}
              href={`/tutorials/${category}/${tutorial.slug}`}
              className="card hover:scale-105 transition-transform"
            >
              <h2 className="text-xl font-bold mb-2">{tutorial.frontmatter.title}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {tutorial.frontmatter.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span>⏱️ {tutorial.frontmatter.duration}</span>
                <span>📊 {tutorial.frontmatter.level}</span>
              </div>
              {tutorial.frontmatter.tags && tutorial.frontmatter.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {tutorial.frontmatter.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
