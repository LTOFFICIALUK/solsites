"use client"

import Link from 'next/link'
import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/layout/SiteFooter'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Palette, Layers, Rocket } from 'lucide-react'

const ExamplesPage = () => {
  const examples = [
    { title: 'Classic Template', slug: 'classic', accent: 'from-purple-100 to-blue-100' },
    { title: 'Minimal Template', slug: 'minimal', accent: 'from-slate-100 to-gray-100' },
    { title: 'Neon Template', slug: 'neon', accent: 'from-fuchsia-100 to-cyan-100' },
    { title: 'Classic Variant', slug: 'classic', accent: 'from-indigo-100 to-purple-100' },
    { title: 'Minimal Variant', slug: 'minimal', accent: 'from-gray-100 to-slate-100' },
    { title: 'Neon Variant', slug: 'neon', accent: 'from-pink-100 to-purple-100' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8 text-center">
          <Badge variant="secondary" className="mb-4">Showcase</Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">Examples</h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Explore what you can build with SOL Sites. Each example is fully customizable with our drag-and-drop editor.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {examples.map((ex, idx) => (
              <div key={`${ex.slug}-${idx}`} className="group bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
                <div className={`h-40 rounded-xl bg-gradient-to-br ${ex.accent} relative overflow-hidden flex items-center justify-center`}>
                  <div className="absolute inset-0 bg-white/30" />
                  {ex.slug === 'classic' && <Palette className="w-8 h-8 text-purple-600 relative z-10" />}
                  {ex.slug === 'minimal' && <Layers className="w-8 h-8 text-gray-700 relative z-10" />}
                  {ex.slug === 'neon' && <Rocket className="w-8 h-8 text-fuchsia-700 relative z-10" />}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{ex.title}</h3>
                <p className="mt-1 text-gray-600 text-sm">Clean, responsive, and fast. Tailor it to your branding and token details.</p>
                <div className="mt-4 flex gap-2">
                  <Link href={`/templates/${ex.slug}/preview`}>
                    <Button size="sm" variant="outline">Preview</Button>
                  </Link>
                  <Link href={`/templates/${ex.slug}`}>
                    <Button size="sm">Use template</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link href="/templates">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              Browse all templates
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}

export default ExamplesPage


