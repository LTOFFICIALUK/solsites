"use client"

import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/layout/SiteFooter'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8 text-center">
          <Badge variant="secondary" className="mb-4">Legal</Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">Your privacy matters. This page explains what we collect and how we use it.</p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-10 text-gray-800 leading-relaxed">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Effective date</h2>
              <p className="mt-2">This policy is effective as of 01 Feb 2025 and may be updated from time to time.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">Information we collect</h2>
              <ul className="mt-2 list-disc pl-6 space-y-2">
                <li><span className="font-medium">Account information:</span> email address and authentication metadata.</li>
                <li><span className="font-medium">Project content:</span> text, images, branding, and configuration you create within SOL Sites.</li>
                <li><span className="font-medium">Usage data:</span> device, browser, and interactions to improve reliability and performance.</li>
                <li><span className="font-medium">Payments:</span> on-chain transaction IDs when you publish for 1 SOL.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">How we use information</h2>
              <ul className="mt-2 list-disc pl-6 space-y-2">
                <li>Provide core features like authentication, saving drafts, previews, and publishing.</li>
                <li>Operate, maintain, and improve the editor, templates, hosting, and security.</li>
                <li>Communicate essential service updates and respond to support requests.</li>
                <li>Prevent abuse and enforce our terms.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">Cookies and analytics</h2>
              <p className="mt-2">We may use cookies and privacy-friendly analytics to understand feature usage and product performance. Cookies are limited to essential functionality and session continuity.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">Data retention</h2>
              <p className="mt-2">We retain account and project data until you delete it or request deletion. Published sites remain live until you unpublish or remove the project.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">Third‑party services</h2>
              <p className="mt-2">We use trusted providers for infrastructure and authentication. These processors only access data needed to provide their services and are bound by confidentiality and security obligations.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">Security</h2>
              <p className="mt-2">We apply reasonable technical and organizational measures to protect your data, including transport encryption, access controls, and regular reviews. No method of transmission or storage is 100% secure.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">Children’s privacy</h2>
              <p className="mt-2">SOL Sites is not directed to children under 13. If you believe a child provided personal information, please contact us to remove it.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">International transfers</h2>
              <p className="mt-2">Your information may be processed in countries other than your own. We take steps to ensure appropriate safeguards are in place.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">Your rights</h2>
              <ul className="mt-2 list-disc pl-6 space-y-2">
                <li>Access, update, or delete your account data.</li>
                <li>Export your project content.</li>
                <li>Withdraw consent where applicable.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">Changes to this policy</h2>
              <p className="mt-2">We may update this policy. We will post the new version here and update the effective date above.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">Contact</h2>
              <p className="mt-2">Questions about privacy? Email <a href="mailto:support@solsites.fun" className="text-blue-600 underline">support@solsites.fun</a> or use our <Link href="/contact" className="text-blue-600 underline">contact form</Link>.</p>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}

export default PrivacyPage


