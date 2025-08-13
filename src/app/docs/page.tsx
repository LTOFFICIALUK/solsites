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
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">Everything you need to build, customize, and publish your SOL Site.</p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar TOC */}
          <aside className="hidden lg:block lg:col-span-3">
            <nav className="sticky top-24 bg-white border border-gray-200 rounded-2xl p-6 text-sm text-gray-700 space-y-2">
              <div className="font-semibold text-gray-900 mb-2">On this page</div>
              <a href="#getting-started" className="block hover:text-gray-900">Getting started</a>
              <a href="#project-setup" className="block hover:text-gray-900">Project setup</a>
              <a href="#editor" className="block hover:text-gray-900">Editor</a>
              <a href="#media" className="block hover:text-gray-900">Media & branding</a>
              <a href="#templates" className="block hover:text-gray-900">Templates</a>
              <a href="#publish" className="block hover:text-gray-900">Publish</a>
              <a href="#domains" className="block hover:text-gray-900">Domains</a>
              <a href="#analytics" className="block hover:text-gray-900">Analytics</a>
              <a href="#faq" className="block hover:text-gray-900">FAQ</a>
              <a href="#troubleshooting" className="block hover:text-gray-900">Troubleshooting</a>
              <a href="#shortcuts" className="block hover:text-gray-900">Keyboard shortcuts</a>
              <a href="#limits" className="block hover:text-gray-900">Limits</a>
              <a href="#privacy-security" className="block hover:text-gray-900">Privacy & Security</a>
              <a href="#support" className="block hover:text-gray-900">Support</a>
            </nav>
          </aside>

          {/* Content */}
          <div className="lg:col-span-9 space-y-12">
            {/* Getting started */}
            <section id="getting-started" className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900">Getting started</h2>
              <ol className="mt-4 list-decimal list-inside space-y-2 text-gray-700">
                <li>Go to Templates and choose a starting point.</li>
                <li>Create your project and name it after your token.</li>
                <li>Open the editor and customize content, colors, and sections.</li>
                <li>Use Preview to share your work‑in‑progress with your team.</li>
                <li>When ready, publish for 1 SOL to {`{name}.solsites.fun`}.</li>
              </ol>
              <div className="mt-6 flex gap-3">
                <Link href="/templates"><Button>Browse templates</Button></Link>
                <Link href="/pricing"><Button variant="outline">View pricing</Button></Link>
              </div>
            </section>

            {/* Project setup */}
            <section id="project-setup" className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900">Project setup</h2>
              <ul className="mt-4 space-y-2 text-gray-700">
                <li><span className="font-medium">Name:</span> Use your token name. This helps generate your default subdomain.</li>
                <li><span className="font-medium">Brand colors:</span> Pick primary/secondary/accent colors from the color picker.</li>
                <li><span className="font-medium">Token info:</span> Fill symbol, contract, description; this powers hero and tokenomics sections.</li>
              </ul>
            </section>

            {/* Editor */}
            <section id="editor" className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900">Editor</h2>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
                <div className="rounded-xl border border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-900">Working with sections</h3>
                  <ul className="mt-2 space-y-2 text-sm">
                    <li>Drag and drop to reorder.</li>
                    <li>Toggle visibility per section.</li>
                    <li>Duplicate to try variations.</li>
                  </ul>
                </div>
                <div className="rounded-xl border border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-900">Editing content</h3>
                  <ul className="mt-2 space-y-2 text-sm">
                    <li>Click any text to edit inline. Changes auto‑save.</li>
                    <li>Use the color picker to match your brand.</li>
                    <li>Preview in desktop and mobile modes.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Media */}
            <section id="media" className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900">Media & branding</h2>
              <ul className="mt-4 space-y-2 text-gray-700 text-sm">
                <li>Recommended logo: SVG or 512×512 PNG with transparent background.</li>
                <li>Hero banner: 2400×720 PNG/JPG for best quality.</li>
                <li>Optimize images to keep pages fast.</li>
              </ul>
            </section>

            {/* Templates */}
            <section id="templates" className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900">Templates</h2>
              <p className="mt-3 text-gray-700">Templates are fully responsive and editable. Switch templates anytime; review changes before publishing.</p>
            </section>

            {/* Publish */}
            <section id="publish" className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900">Publish</h2>
              <ul className="mt-4 space-y-2 text-gray-700">
                <li>One‑time payment of 1 SOL per project.</li>
                <li>Deployed to {`{name}.solsites.fun`} with SSL and global CDN.</li>
                <li>Continue editing and republish at no extra cost.</li>
              </ul>
              <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-900">
                <span className="font-semibold">Tip:</span> Run a final preview pass on mobile and desktop before publishing.
              </div>
            </section>

            {/* Domains */}
            <section id="domains" className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900">Domains</h2>
              <p className="mt-3 text-gray-700">Your site is published to a {`{name}.solsites.fun`} subdomain. Custom domains are not supported yet.</p>
            </section>

            {/* Analytics */}
            <section id="analytics" className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
              <p className="mt-3 text-gray-700">Basic analytics are available in your dashboard (visits, referrers, top pages). Advanced analytics coming soon.</p>
            </section>

            {/* FAQ */}
            <section id="faq" className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900">FAQ</h2>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { q: 'Is building free?', a: 'Yes. Build, save, and preview for free. Publishing costs 1 SOL per project.' },
                  { q: 'Can I change templates later?', a: 'Yes. Switch anytime and review changes before publishing.' },
                  { q: 'What domain do I get?', a: 'Your site is published to {name}.solsites.fun with SSL and CDN.' },
                  { q: 'Can I republish updates?', a: 'Yes. Unlimited edits and re‑publishes at no extra cost.' },
                ].map(({ q, a }) => (
                  <div key={q} className="rounded-xl border border-gray-200 p-4">
                    <div className="font-semibold text-gray-900">{q}</div>
                    <div className="mt-1 text-sm text-gray-700">{a}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Troubleshooting */}
            <section id="troubleshooting" className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900">Troubleshooting</h2>
              <ul className="mt-3 space-y-2 text-sm text-gray-700">
                <li><span className="font-medium">Images not updating:</span> Hard refresh or clear cache, then republish.</li>
                <li><span className="font-medium">Editor slow:</span> Reduce large image sizes; close unused browser tabs.</li>
                <li><span className="font-medium">Can’t publish:</span> Ensure wallet has at least 1 SOL plus fees; retry.</li>
              </ul>
            </section>

            {/* Shortcuts */}
            <section id="shortcuts" className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900">Keyboard shortcuts</h2>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
                <div className="rounded-lg border border-gray-200 p-3"><span className="font-medium">⌘/Ctrl + S</span> Save</div>
                <div className="rounded-lg border border-gray-200 p-3"><span className="font-medium">⌘/Ctrl + Z</span> Undo</div>
                <div className="rounded-lg border border-gray-200 p-3"><span className="font-medium">⌘/Ctrl + ⇧ + Z</span> Redo</div>
                <div className="rounded-lg border border-gray-200 p-3"><span className="font-medium">⌘/Ctrl + P</span> Preview</div>
              </div>
            </section>

            {/* Limits */}
            <section id="limits" className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900">Limits</h2>
              <ul className="mt-3 space-y-2 text-sm text-gray-700">
                <li>Recommended image size &lt; 2 MB each.</li>
                <li>Up to 50 sections per project for optimal performance.</li>
              </ul>
            </section>

            {/* Privacy & Security */}
            <section id="privacy-security" className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900">Privacy & Security</h2>
              <p className="mt-3 text-gray-700 text-sm">We keep data collection minimal. See our <Link href="/privacy" className="text-blue-600 underline">Privacy Policy</Link> for details.</p>
            </section>

            {/* Support */}
            <section id="support" className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900">Support</h2>
              <p className="mt-3 text-gray-700 text-sm">Need help? Visit the <Link href="/help" className="text-blue-600 underline">Help Center</Link> or <Link href="/contact" className="text-blue-600 underline">Contact us</Link>.</p>
            </section>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}

export default DocsPage


