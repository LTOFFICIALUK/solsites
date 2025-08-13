"use client"

import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/layout/SiteFooter'
import { Badge } from '@/components/ui/badge'

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8 text-center">
          <Badge variant="secondary" className="mb-4">Company</Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">About SOL Sites</h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">We help Solana meme coin creators launch professional websites in minutes.</p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-gray-700">
          <p>
            SOL Sites is built for speed and simplicity. Choose a template, customize with a visual editor, and publish to a fast, secure domain for a one-time 1 SOL fee.
          </p>
          <p>
            Our mission is to make web presence effortless for the Solana ecosystem, so builders can focus on their communities and products.
          </p>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}

export default AboutPage


