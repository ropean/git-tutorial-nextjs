import Link from 'next/link'

interface FeatureCardProps {
  title: string
  description: string
  icon: string
  href: string
}

export function FeatureCard({ title, description, icon, href }: FeatureCardProps) {
  return (
    <Link href={href}>
      <div className="card hover:scale-105 transition-transform duration-200 h-full text-center">
        <div className="text-5xl mb-4">{icon}</div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
      </div>
    </Link>
  )
}
