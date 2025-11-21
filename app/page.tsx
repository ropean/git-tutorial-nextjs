import Link from 'next/link'
import { CourseCard } from '@/components/ui/CourseCard'
import { FeatureCard } from '@/components/ui/FeatureCard'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center py-16 md:py-24">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-green-600 bg-clip-text text-transparent">
          从零掌握 Git
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
          最友好的版本控制教程 - 从入门到精通，一步一步掌握 Git
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/tutorials" className="btn-primary">
            开始学习
          </Link>
          <Link href="/playground" className="btn-secondary">
            在线练习
          </Link>
        </div>
      </section>

      {/* Course Navigation Cards */}
      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-12">课程导航</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <CourseCard
            title="入门课程"
            description="从零开始学习 Git 基础知识，掌握版本控制的核心概念"
            icon="🌱"
            level="beginner"
            lessons={15}
            href="/tutorials/beginner"
          />
          <CourseCard
            title="进阶技巧"
            description="深入学习 Git 高级功能，提升协作效率和工作流程"
            icon="🚀"
            level="advanced"
            lessons={20}
            href="/tutorials/advanced"
          />
          <CourseCard
            title="实战项目"
            description="通过真实项目案例，应用所学知识解决实际问题"
            icon="💼"
            level="project"
            lessons={15}
            href="/tutorials/projects"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-12">特色功能</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            title="互动练习"
            description="在浏览器中直接练习 Git 命令，无需安装"
            icon="💻"
            href="/playground"
          />
          <FeatureCard
            title="速查手册"
            description="快速查找常用命令和最佳实践"
            icon="📚"
            href="/cheatsheet"
          />
          <FeatureCard
            title="视频教程"
            description="通过视频讲解，轻松理解复杂概念"
            icon="🎥"
            href="/videos"
          />
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="card">
            <div className="text-4xl font-bold text-primary-600 mb-2">50+</div>
            <div className="text-gray-600 dark:text-gray-400">精品课程</div>
          </div>
          <div className="card">
            <div className="text-4xl font-bold text-primary-600 mb-2">100+</div>
            <div className="text-gray-600 dark:text-gray-400">练习题目</div>
          </div>
          <div className="card">
            <div className="text-4xl font-bold text-primary-600 mb-2">10K+</div>
            <div className="text-gray-600 dark:text-gray-400">学习者</div>
          </div>
        </div>
      </section>
    </div>
  )
}
