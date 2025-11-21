import { Metadata } from 'next'
import GitSimulator from '@/components/GitSimulator'

export const metadata: Metadata = {
  title: 'Git Playground',
  description: 'Practice Git commands in an interactive browser-based environment',
}

export default function PlaygroundPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Git 练习场</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          在浏览器中直接练习 Git 命令，无需安装。试试下面的命令！
        </p>
      </div>

      <GitSimulator />

      <div className="mt-12 card">
        <h2 className="text-2xl font-bold mb-4">使用指南</h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <div>
            <h3 className="font-bold mb-2">支持的命令：</h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><code>git init</code> - 初始化仓库</li>
              <li><code>git status</code> - 查看状态</li>
              <li><code>git add &lt;file&gt;</code> - 添加到暂存区</li>
              <li><code>git commit -m "message"</code> - 提交修改</li>
              <li><code>git log</code> - 查看历史</li>
              <li><code>git branch &lt;name&gt;</code> - 创建分支</li>
              <li><code>git checkout &lt;branch&gt;</code> - 切换分支</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-2">创建文件：</h3>
            <p>使用 <code>echo "content" &gt; filename</code> 创建文件</p>
            <p className="text-sm text-gray-500 mt-1">
              例如: <code>echo "Hello World" &gt; README.md</code>
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-2">快捷键：</h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>↑ / ↓ - 浏览命令历史</li>
              <li>点击快捷按钮 - 快速填入常用命令</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-2">建议练习流程：</h3>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li>创建一个文件: <code>echo "test" &gt; test.txt</code></li>
              <li>查看状态: <code>git status</code></li>
              <li>添加文件: <code>git add test.txt</code></li>
              <li>提交: <code>git commit -m "Add test file"</code></li>
              <li>查看历史: <code>git log</code></li>
              <li>创建分支: <code>git branch feature</code></li>
              <li>切换分支: <code>git checkout feature</code></li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
