import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ - Frequently Asked Questions',
  description: 'Common questions about Git and version control',
}

export default function FAQPage() {
  const faqs = [
    {
      q: 'Git 和 GitHub 有什么区别？',
      a: 'Git 是一个版本控制系统，是一个软件工具。GitHub 是一个基于 Git 的代码托管平台，提供了协作、代码审查等功能。',
    },
    {
      q: '我应该多久提交一次代码？',
      a: '建议频繁提交，每完成一个小功能或修复一个问题就提交一次。这样可以更好地追踪变更历史。',
    },
    {
      q: 'merge 和 rebase 有什么区别？',
      a: 'merge 会创建一个新的合并提交，保留完整的历史记录。rebase 会将提交移动到目标分支的顶部，创建线性历史。',
    },
    {
      q: '如何撤销已经推送的提交？',
      a: '可以使用 git revert 创建一个新的提交来撤销之前的更改，或者使用 git reset 后强制推送（不推荐在共享分支上使用）。',
    },
    {
      q: '什么是 .gitignore 文件？',
      a: '.gitignore 文件用于指定哪些文件或目录不应该被 Git 追踪，比如编译产物、临时文件、密钥文件等。',
    },
    {
      q: '如何解决合并冲突？',
      a: '1) 打开有冲突的文件 2) 手动编辑冲突部分 3) 删除冲突标记 4) 使用 git add 标记为已解决 5) 提交更改。',
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">常见问题</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          关于 Git 的常见问题解答
        </p>
      </div>

      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="card">
            <h2 className="text-xl font-bold mb-3 flex items-start gap-3">
              <span className="text-primary-600 dark:text-primary-400">Q:</span>
              {faq.q}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 pl-8">
              <span className="text-green-600 dark:text-green-400 font-bold">A:</span> {faq.a}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 card text-center">
        <h3 className="text-xl font-bold mb-2">没找到你的问题？</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          查看完整教程或联系我们获取帮助
        </p>
        <div className="flex justify-center gap-4">
          <a href="/tutorials" className="btn-primary">
            浏览教程
          </a>
          <a href="/about" className="btn-secondary">
            联系我们
          </a>
        </div>
      </div>
    </div>
  )
}
