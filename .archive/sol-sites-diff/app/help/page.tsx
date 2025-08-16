"use client"

import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/layout/SiteFooter'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const HelpPage = () => {
  const articles = [
    { title: 'Getting started with SOL Sites', href: '/docs#getting-started' },
    { title: 'Choosing a template', href: '/templates' },
    { title: 'Using the drag-and-drop editor', href: '/docs#editor' },
    { title: 'Publishing your site', href: '/docs#publish' },
  ]

  // FAQ removed per request to simplify the Help Center page

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8 text-center">
          <Badge variant="secondary" className="mb-4">Support</Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">Help Center</h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">Guides and answers to help you build and launch your site.</p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {articles.map((a) => (
              <Link key={a.title} href={a.href} className="block bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-sm transition">
                <h3 className="text-lg font-semibold text-gray-900">{a.title}</h3>
                <p className="text-sm text-gray-600 mt-1">Step-by-step guidance to move fast.</p>
              </Link>
            ))}
          </div>
          <aside className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h4 className="font-semibold text-gray-900">Need more help?</h4>
              <p className="text-sm text-gray-600 mt-2">Reach out to our team. We usually reply within 24 hours.</p>
              <Link href="/contact">
                <Button className="mt-4 w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-sm">Contact support</Button>
              </Link>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h4 className="font-semibold text-gray-900">Popular topics</h4>
              <ul className="mt-3 space-y-2 text-sm text-gray-700">
                <li><Link className="hover:underline" href="/docs#templates">Templates</Link></li>
                <li><Link className="hover:underline" href="/docs#editor">Editor</Link></li>
                <li><Link className="hover:underline" href="/docs#publish">Publish</Link></li>
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {/* FAQ section intentionally removed */}

      <SiteFooter />
    </div>
  )
}

export default HelpPage


