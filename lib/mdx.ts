import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const contentDirectory = path.join(process.cwd(), 'content')

export interface TutorialFrontmatter {
  title: string
  description: string
  category: 'beginner' | 'advanced' | 'projects'
  level: string
  duration: string
  tags: string[]
  date?: string
}

export interface Tutorial {
  slug: string
  frontmatter: TutorialFrontmatter
  content: string
}

export function getTutorialBySlug(category: string, slug: string): Tutorial | null {
  try {
    const fullPath = path.join(contentDirectory, category, `${slug}.mdx`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug,
      frontmatter: data as TutorialFrontmatter,
      content,
    }
  } catch (error) {
    return null
  }
}

export function getAllTutorials(category?: string): Tutorial[] {
  const categories = category ? [category] : ['beginner', 'advanced', 'projects']
  const tutorials: Tutorial[] = []

  for (const cat of categories) {
    const categoryPath = path.join(contentDirectory, cat)

    if (!fs.existsSync(categoryPath)) {
      continue
    }

    const files = fs.readdirSync(categoryPath)

    for (const file of files) {
      if (file.endsWith('.mdx')) {
        const slug = file.replace('.mdx', '')
        const tutorial = getTutorialBySlug(cat, slug)
        if (tutorial) {
          tutorials.push(tutorial)
        }
      }
    }
  }

  return tutorials.sort((a, b) => {
    const dateA = a.frontmatter.date ? new Date(a.frontmatter.date).getTime() : 0
    const dateB = b.frontmatter.date ? new Date(b.frontmatter.date).getTime() : 0
    return dateB - dateA
  })
}

export function getTutorialSlugs(category: string): string[] {
  const categoryPath = path.join(contentDirectory, category)

  if (!fs.existsSync(categoryPath)) {
    return []
  }

  return fs
    .readdirSync(categoryPath)
    .filter(file => file.endsWith('.mdx'))
    .map(file => file.replace('.mdx', ''))
}
