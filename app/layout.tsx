import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: {
    default: 'Git Tutorial - Learn Git from Beginner to Advanced',
    template: '%s | Git Tutorial',
  },
  description: 'Master Git version control with our comprehensive, beginner-friendly tutorials and interactive exercises.',
  keywords: ['git', 'tutorial', 'version control', 'github', 'learning', 'programming'],
  authors: [{ name: 'Git Tutorial Team' }],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://git-tutorial.dev',
    siteName: 'Git Tutorial',
    title: 'Git Tutorial - Learn Git from Beginner to Advanced',
    description: 'Master Git version control with our comprehensive tutorials',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Git Tutorial - Learn Git from Beginner to Advanced',
    description: 'Master Git version control with our comprehensive tutorials',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
