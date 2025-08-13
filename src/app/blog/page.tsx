"use client"

import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/layout/SiteFooter'
import { Badge } from '@/components/ui/badge'

const BlogPage = () => {
  const posts = [
    { title: 'Announcing SOL Sites', date: '2024-06-01' },
    { title: 'Publishing for 1 SOL', date: '2024-08-12' },
    { title: 'Template updates', date: '2024-10-20' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8 text-center">
          <Badge variant="secondary" className="mb-4">News</Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">Blog</h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">Updates, product news, and tips for building on SOL Sites.</p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          {posts.map((p) => (
            <article key={p.title} className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900">{p.title}</h3>
              <time className="text-sm text-gray-500">{p.date}</time>
              <p className="text-sm text-gray-600 mt-2">Coming soon.</p>
            </article>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}

export default BlogPage


