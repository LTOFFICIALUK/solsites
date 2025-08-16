"use client"

import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/layout/SiteFooter'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8 text-center relative">
          <Badge variant="secondary" className="mb-4">Company</Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">About SOL Sites</h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">We help Solana meme coin creators launch professional websites in minutes.</p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900">Our mission</h3>
              <p className="mt-3 text-gray-700">Make web presence effortless for Solana builders with professional templates and a visual editor.</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900">What we build</h3>
              <p className="mt-3 text-gray-700">A fast editor, polished templates, and one-click publishing to {`{name}.solsites.fun`} for a one-time 1 SOL.</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900">Why it matters</h3>
              <p className="mt-3 text-gray-700">Launching quickly helps projects focus on community, growth, and delivering value.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900">What you get with SOL Sites</h2>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[ 
                'Professional templates',
                'Drag-and-drop editor',
                'Responsive by default',
                'SEO-friendly structure',
                'Custom subdomain',
                'Fast global CDN',
                'Free SSL',
                'One-time 1 SOL publish',
              ].map(item => (
                <div key={item} className="rounded-xl border border-gray-200 p-4 text-gray-700">{item}</div>
              ))}
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href="/templates"><Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">Explore templates</Button></Link>
              <Link href="/pricing"><Button variant="outline">View pricing</Button></Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}

export default AboutPage


