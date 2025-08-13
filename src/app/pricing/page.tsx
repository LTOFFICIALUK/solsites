"use client"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Check, X } from 'lucide-react'
import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/layout/SiteFooter'

const PricingPage = () => {
  const { user } = useAuth()
  const router = useRouter()

  const handleStartBuilding = () => {
    if (user) {
      router.push('/dashboard')
      return
    }
    router.push('/login')
  }

  const handleLogin = () => {
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8 text-center">
          <Badge variant="secondary" className="mb-4">Transparent pricing</Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">Build free. Publish for 1 SOL.</h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Design and iterate at no cost. Pay once to publish your site forever to a custom subdomain with SSL and blazing-fast hosting.
          </p>
          <div className="mt-8" />
        </div>
      </section>

      {/* Plans */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* Free */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Free</h3>
                <Badge>Best to start</Badge>
              </div>
              <p className="mt-2 text-gray-600">Build your site at no cost. Perfect for exploration and drafts.</p>
              <div className="mt-6 flex items-end gap-1">
                <span className="text-4xl font-bold text-gray-900">$0</span>
                <span className="text-gray-500 mb-1">forever</span>
              </div>
              <Button onClick={handleStartBuilding} className="w-full mt-6">
                Start free
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <ul className="mt-6 space-y-3 text-sm">
                {[
                  'All templates included',
                  'Drag-and-drop editor',
                  'Unlimited drafts and previews',
                  'Shareable preview links',
                  'Save and resume anytime',
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-gray-700">
                    <Check className="w-4 h-4 mt-0.5 text-green-600" />
                    <span>{feature}</span>
                  </li>
                ))}
                <li className="flex items-start gap-3 text-gray-400">
                  <X className="w-4 h-4 mt-0.5" />
                  <span>No custom subdomain</span>
                </li>
                <li className="flex items-start gap-3 text-gray-400">
                  <X className="w-4 h-4 mt-0.5" />
                  <span>Preview watermark/banner visible</span>
                </li>
              </ul>
            </div>

            {/* Launch - Highlighted */}
            <div className="relative bg-white border-2 border-purple-200 rounded-2xl p-6 md:p-8 shadow-lg">
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-purple-600/10 to-blue-600/10 blur-2xl -z-10" />
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Launch</h3>
                <Badge variant="success">Most popular</Badge>
              </div>
              <p className="mt-2 text-gray-600">Everything in Free, plus publish live forever. One-time payment per project. No hidden fees.</p>
              <div className="mt-6 flex items-end gap-2">
                <span className="text-4xl font-bold text-gray-900">1 SOL</span>
                <span className="text-gray-500 mb-1">one-time, per project</span>
              </div>
              <Button onClick={handleStartBuilding} className="w-full mt-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                Publish when ready
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <ul className="mt-6 space-y-3 text-sm">
                {[
                  'Custom subdomain: {name}.solsites.fun',
                  'Free SSL certificate',
                  'Global CDN hosting',
                  'Remove preview watermark/banner',
                  'One-click publish from dashboard',
                  'Unlimited edits and republish at no extra cost',
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-gray-700">
                    <Check className="w-4 h-4 mt-0.5 text-green-600" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-8 md:py-16 border-t border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center">Frequently asked questions</h2>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                q: 'Do I have to pay to start building?',
                a: 'No. Building is completely free. You only pay 1 SOL when you choose to publish your site live.'
              },
              {
                q: 'What do I get with the 1 SOL publish?',
                a: 'A live site on a custom {name}.solsites.fun subdomain, free SSL, global CDN hosting, and removal of the preview watermark/banner.'
              },
              {
                q: 'Can I edit after publishing?',
                a: 'Yes. You can continue editing your site and republish updates at no additional cost.'
              },
              {
                q: 'Can I use my own domain?',
                a: 'Custom domains are not supported yet. You will receive a {project}.solsites.fun subdomain.'
              },
              {
                q: 'How long does my site stay live?',
                a: 'Forever for that project. The 1 SOL payment is a one-time publish fee per project.'
              },
              {
                q: 'Can I publish multiple projects?',
                a: 'Yes. Each project can be published for a one-time payment of 1 SOL.'
              },
              {
                q: 'Is there a refund?',
                a: 'Since publish is a one-time on-chain payment, refunds are not available.'
              },
            ].map(({ q, a }) => (
              <details key={q} className="group rounded-xl border border-gray-200 p-5 open:shadow-sm">
                <summary
                  className="marker:none cursor-pointer list-none select-none font-medium text-gray-900 outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
                  aria-label={q}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.currentTarget.click()
                    }
                  }}
                >
                  {q}
                </summary>
                <p className="mt-3 text-gray-600">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to launch?</h2>
          <p className="text-lg text-purple-100 mb-8">Start free today. Publish for just 1 SOL when you are ready.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-4"
              onClick={handleStartBuilding}
            >
              {user ? 'Go to Dashboard' : 'Start Building Now'}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Link href="/templates">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600 text-lg px-8 py-4">
                Browse Templates
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}

export default PricingPage


