"use client"

import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/layout/SiteFooter'
import { Badge } from '@/components/ui/badge'

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8 text-center">
          <Badge variant="secondary" className="mb-4">Legal</Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">Your privacy matters. This page explains what we collect and how we use it.</p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-slate">
          <h2>Information we collect</h2>
          <p>Basic account data (email) and project content you create. We do not sell your data.</p>
          <h2>How we use information</h2>
          <p>To provide and improve SOL Sites, secure accounts, and communicate essential updates.</p>
          <h2>Data retention</h2>
          <p>Projects and account data are retained until you delete them. Published sites remain live unless removed.</p>
          <h2>Contact</h2>
          <p>Questions? Email support@solsites.fun</p>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}

export default PrivacyPage


