"use client"

import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/layout/SiteFooter'
import { Badge } from '@/components/ui/badge'

const CareersPage = () => {
  const roles = [
    { title: 'Frontend Engineer (React/Next.js)', location: 'Remote', status: 'Open' },
    { title: 'Designer (UI/UX)', location: 'Remote', status: 'Open' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8 text-center">
          <Badge variant="secondary" className="mb-4">Hiring</Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">Careers</h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">Join us in building the fastest way to launch Solana meme coin sites.</p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          {roles.map((r) => (
            <div key={r.title} className="bg-white border border-gray-200 rounded-2xl p-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{r.title}</h3>
                <p className="text-sm text-gray-600">{r.location}</p>
              </div>
              <span className="text-sm text-green-700 bg-green-100 px-3 py-1 rounded-full">{r.status}</span>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}

export default CareersPage


