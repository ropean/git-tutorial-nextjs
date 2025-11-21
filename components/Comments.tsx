'use client'

import Giscus from '@giscus/react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function Comments() {
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const currentTheme = theme === 'system' ? systemTheme : theme

  return (
    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
      <h2 className="text-2xl font-bold mb-6">评论与讨论</h2>
      <Giscus
        id="comments"
        repo="ropean/git-tutorial"
        repoId="R_kgDONgyNFA" // 需要替换为实际的 repo ID
        category="General"
        categoryId="DIC_kwDONgyNFM4Cm3pD" // 需要替换为实际的 category ID
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={currentTheme === 'dark' ? 'dark' : 'light'}
        lang="zh-CN"
        loading="lazy"
      />
      <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          <strong>配置说明：</strong> 评论系统使用 GitHub Discussions。要启用评论功能，请：
        </p>
        <ol className="text-sm text-yellow-800 dark:text-yellow-200 list-decimal list-inside mt-2 space-y-1">
          <li>在 GitHub 仓库设置中启用 Discussions</li>
          <li>访问 <a href="https://giscus.app/zh-CN" target="_blank" rel="noopener noreferrer" className="underline">giscus.app</a> 获取配置参数</li>
          <li>更新 components/Comments.tsx 中的 repo、repoId、categoryId</li>
        </ol>
      </div>
    </div>
  )
}
