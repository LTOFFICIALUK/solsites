"use client"

import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/layout/SiteFooter'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Twitter, MessageCircle, Discord } from 'lucide-react'

const CommunityPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8 text-center">
          <Badge variant="secondary" className="mb-4">Community</Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">Join the community</h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">Connect with builders, share feedback, and show off your meme coin sites.</p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <a href="#" className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-sm transition flex flex-col items-center" aria-label="Join us on X/Twitter">
            <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center">
              <Twitter className="w-6 h-6 text-white" />
            </div>
            <h3 className="mt-3 font-semibold text-gray-900">X / Twitter</h3>
            <p className="text-sm text-gray-600 mt-1 text-center">Follow updates and share your builds.</p>
            <Button className="mt-4">Follow</Button>
          </a>
          <a href="#" className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-sm transition flex flex-col items-center" aria-label="Join our Telegram">
            <div className="w-12 h-12 rounded-full bg-sky-500 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="mt-3 font-semibold text-gray-900">Telegram</h3>
            <p className="text-sm text-gray-600 mt-1 text-center">Ask questions and get quick help.</p>
            <Button className="mt-4">Join</Button>
          </a>
          <a href="#" className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-sm transition flex flex-col items-center" aria-label="Join our Discord">
            <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center">
              <Discord className="w-6 h-6 text-white" />
            </div>
            <h3 className="mt-3 font-semibold text-gray-900">Discord</h3>
            <p className="text-sm text-gray-600 mt-1 text-center">Hang out with the community.</p>
            <Button className="mt-4">Join</Button>
          </a>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}

export default CommunityPage


