import { Metadata } from 'next'
import AlgoliaSearch from '@/components/AlgoliaSearch'

export const metadata: Metadata = {
  title: '搜索教程 - Git Tutorial',
  description: 'Search Git tutorials and documentation',
}

export default function SearchPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">搜索教程</h1>
      <AlgoliaSearch />
    </div>
  )
}
