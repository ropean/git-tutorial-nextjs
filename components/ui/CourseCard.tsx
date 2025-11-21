import Link from 'next/link'

interface CourseCardProps {
  title: string
  description: string
  icon: string
  level: 'beginner' | 'advanced' | 'project'
  lessons: number
  href: string
}

export function CourseCard({ title, description, icon, level, lessons, href }: CourseCardProps) {
  const levelColors = {
    beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    advanced: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    project: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  }

  const levelLabels = {
    beginner: '入门',
    advanced: '进阶',
    project: '实战',
  }

  return (
    <Link href={href}>
      <div className="card hover:scale-105 transition-transform duration-200 h-full">
        <div className="text-5xl mb-4">{icon}</div>
        <h3 className="text-2xl font-bold mb-3">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{description}</p>
        <div className="flex items-center justify-between mt-auto">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${levelColors[level]}`}>
            {levelLabels[level]}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {lessons} 课时
          </span>
        </div>
      </div>
    </Link>
  )
}
