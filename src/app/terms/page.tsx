"use client"

import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/layout/SiteFooter'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8 text-center">
          <Badge variant="secondary" className="mb-4">Legal</Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">Please read these terms carefully before using SOL Sites.</p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-gray-800 leading-relaxed space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">1. Agreement</h2>
            <p className="mt-2">By accessing SOL Sites, you agree to be bound by these Terms of Service and our Privacy Policy.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900">2. Service</h2>
            <p className="mt-2">SOL Sites provides templates, a visual editor, and static hosting for your project website. You can build for free and publish for a one-time fee of 1 SOL per project.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900">3. Accounts</h2>
            <p className="mt-2">You are responsible for maintaining the confidentiality of your account and for all activities that occur under your account.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900">4. Acceptable use</h2>
            <ul className="mt-2 list-disc pl-6 space-y-2">
              <li>No illegal, infringing, or malicious content.</li>
              <li>No attempts to disrupt the service or other users.</li>
              <li>Respect intellectual property and applicable laws.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900">5. Publishing and domains</h2>
            <p className="mt-2">When you publish, your site is deployed to a {`{name}.solsites.fun`} subdomain. We may reclaim or disable subdomains that violate these terms.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900">6. Payments</h2>
            <p className="mt-2">Publishes are a one-time on-chain payment of 1 SOL per project and are non-refundable.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900">7. Intellectual property</h2>
            <p className="mt-2">You retain ownership of your content. Templates and platform code remain the property of SOL Sites and licensors.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900">8. Termination</h2>
            <p className="mt-2">We may suspend or terminate access for violations of these terms. You may stop using the service at any time.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900">9. Disclaimers</h2>
            <p className="mt-2">The service is provided “as is” without warranties of any kind. We do not guarantee uninterrupted or error-free operation.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900">10. Limitation of liability</h2>
            <p className="mt-2">To the maximum extent permitted by law, SOL Sites shall not be liable for any indirect, incidental, or consequential damages.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900">11. Changes</h2>
            <p className="mt-2">We may modify these terms. Continued use after changes constitutes acceptance of the updated terms.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900">12. Contact</h2>
            <p className="mt-2">Questions about these terms? Email <a href="mailto:support@solsites.fun" className="text-blue-600 underline">support@solsites.fun</a> or visit our <Link href="/contact" className="text-blue-600 underline">contact page</Link>.</p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}

export default TermsPage


