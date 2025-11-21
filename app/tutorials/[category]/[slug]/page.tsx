import { MDXRemote } from 'next-mdx-remote/rsc'
import { Metadata } from 'next'
import { getTutorialBySlug, getTutorialSlugs, getAllTutorials } from '@/lib/mdx'
import { notFound } from 'next/navigation'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import remarkGfm from 'remark-gfm'
import Comments from '@/components/Comments'
import 'highlight.js/styles/github-dark.css'

interface TutorialPageProps {
  params: Promise<{
    category: string
    slug: string
  }>
}

export function generateStaticParams() {
  const categories = ['beginner', 'advanced', 'projects']
  const params: { category: string; slug: string }[] = []

  for (const category of categories) {
    const tutorials = getAllTutorials(category)
    for (const tutorial of tutorials) {
      params.push({
        category,
        slug: tutorial.slug,
      })
    }
  }

  return params
}

export async function generateMetadata({ params }: TutorialPageProps): Promise<Metadata> {
  const { category, slug } = await params
  const tutorial = getTutorialBySlug(category, slug)

  if (!tutorial) {
    return {
      title: 'Tutorial Not Found',
    }
  }

  return {
    title: tutorial.frontmatter.title,
    description: tutorial.frontmatter.description,
    keywords: tutorial.frontmatter.tags,
  }
}

export default async function TutorialPage({ params }: TutorialPageProps) {
  const { category, slug } = await params
  const tutorial = getTutorialBySlug(category, slug)

  if (!tutorial) {
    notFound()
  }

  const options = {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        rehypeHighlight,
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: 'wrap' }] as any,
      ],
    },
  } as any

  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {tutorial.frontmatter.title}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
          {tutorial.frontmatter.description}
        </p>
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span>⏱️ {tutorial.frontmatter.duration}</span>
          <span>📊 {tutorial.frontmatter.level}</span>
          {tutorial.frontmatter.date && (
            <span>📅 {new Date(tutorial.frontmatter.date).toLocaleDateString('zh-CN')}</span>
          )}
        </div>
        {tutorial.frontmatter.tags && tutorial.frontmatter.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {tutorial.frontmatter.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Content */}
      <div className="prose prose-lg dark:prose-dark max-w-none">
        <MDXRemote source={tutorial.content} options={options} />
      </div>

      {/* Feedback */}
      <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-4">这篇教程有帮助吗？</h3>
          <div className="flex justify-center gap-4">
            <button className="btn-primary">👍 有帮助</button>
            <button className="btn-secondary">👎 需要改进</button>
          </div>
        </div>
      </footer>

      {/* Comments */}
      <Comments />
    </article>
  )
}
