"use client"

import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/layout/SiteFooter'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const DocsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8 text-center">
          <Badge variant="secondary" className="mb-4">Documentation</Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">Docs</h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">Everything you need to build, customize, and publish your SOL Site.</p>
        </div>
      </section>

      <section id="getting-started" className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900">Getting started</h2>
          <ol className="mt-4 list-decimal list-inside space-y-2 text-gray-700">
            <li>Go to Templates and choose a starting point.</li>
            <li>Create your project and name it after your token.</li>
            <li>Open the editor and customize content, colors, and sections.</li>
            <li>Use Preview to share your work-in-progress.</li>
            <li>When ready, publish for 1 SOL to {`{name}.solsites.fun`}.</li>
          </ol>
          <Link href="/templates">
            <Button className="mt-6">Browse templates</Button>
          </Link>
        </div>
      </section>

      <section id="templates" className="py-8 bg-white border-y border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900">Templates</h2>
          <p className="mt-3 text-gray-700">Templates are fully responsive and editable. Switch templates anytime; review changes before publishing.</p>
        </div>
      </section>

      <section id="editor" className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900">Editor</h2>
          <ul className="mt-3 space-y-2 text-gray-700">
            <li>Drag and drop components to reorder sections.</li>
            <li>Use the color picker to match your brand.</li>
            <li>Edit text and images inline. Changes are auto-saved.</li>
            <li>Preview your site in desktop and mobile modes.</li>
          </ul>
        </div>
      </section>

      <section id="publish" className="py-12 bg-white border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900">Publish</h2>
          <p className="mt-3 text-gray-700">Publishing is a one-time 1 SOL payment per project. Your site is deployed to {`{name}.solsites.fun`} with SSL and CDN. You can continue editing and republish at no extra cost.</p>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}

export default DocsPage


