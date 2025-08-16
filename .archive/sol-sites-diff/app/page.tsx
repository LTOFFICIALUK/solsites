"use client"

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/layout/SiteFooter'
import { ArrowRight, Sparkles, Zap, Globe, Palette, Coins, Users, Star, Layers, Smartphone, Code, Rocket } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const { user } = useAuth()
  const router = useRouter()

  const handleStartBuilding = () => {
    if (user) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }

  const handleLogin = () => {
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Build the next
              <span className="block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                viral meme coin
              </span>
              website
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Create stunning, professional websites for your Solana meme coins with our drag-and-drop platform. 
              Build for free, pay only 1 SOL when you're ready to publish.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-4"
                onClick={handleStartBuilding}
              >
                {user ? 'Go to Dashboard' : 'Start Building Free'}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Link href="/templates">
                <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                  Browse Templates
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Enhanced Hero Visual */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-3xl blur-3xl"></div>
            <div className="relative bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-gray-200">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Template Card */}
                <div className="space-y-4">
                  <div className="h-32 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-200/50 to-blue-200/50"></div>
                    <Palette className="w-8 h-8 text-purple-600 relative z-10" />
                    <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-6 bg-gradient-to-r from-purple-200 to-blue-200 rounded-md"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
                    <div className="flex space-x-2">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Layers className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Smartphone className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Code className="w-4 h-4 text-green-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Editor Card */}
                <div className="space-y-4">
                  <div className="h-40 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-200/50 to-purple-200/50"></div>
                    <Coins className="w-10 h-10 text-blue-600 relative z-10" />
                    <div className="absolute top-3 left-3 w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="absolute top-3 left-6 w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div className="absolute top-3 left-9 w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-5 bg-gradient-to-r from-blue-200 to-purple-200 rounded-md"></div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded"></div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <Zap className="w-3 h-3 text-blue-600" />
                      </div>
                      <div className="text-xs text-gray-500">Drag & Drop</div>
                    </div>
                  </div>
                </div>

                {/* Domain Card */}
                <div className="space-y-4">
                  <div className="h-28 bg-gradient-to-br from-green-100 to-blue-100 rounded-xl flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-200/50 to-blue-200/50"></div>
                    <Globe className="w-8 h-8 text-green-600 relative z-10" />
                    <div className="absolute bottom-2 left-2 w-4 h-4 bg-white/20 rounded-full"></div>
                    <div className="absolute bottom-2 right-2 w-4 h-4 bg-white/20 rounded-full"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-6 bg-gradient-to-r from-green-200 to-blue-200 rounded-md"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                          <Rocket className="w-3 h-3 text-green-600" />
                        </div>
                        <div className="text-xs text-gray-500">Live</div>
                      </div>
                      <div className="text-xs text-gray-400 font-mono">solsites.fun</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-2 -left-2 w-4 h-4 bg-purple-400 rounded-full opacity-20"></div>
              <div className="absolute -top-4 -right-4 w-6 h-6 bg-blue-400 rounded-full opacity-20"></div>
              <div className="absolute -bottom-2 -left-4 w-3 h-3 bg-green-400 rounded-full opacity-20"></div>
              <div className="absolute -bottom-4 -right-2 w-5 h-5 bg-purple-400 rounded-full opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need to launch your meme coin
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional templates, drag-and-drop editing, and crypto payments - all in one platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 border border-purple-100">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Professional Templates</h3>
              <p className="text-gray-600 mb-4">
                Choose from our collection of professionally designed templates specifically crafted for meme coins.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Customizable colors and branding</li>
                <li>• Mobile-responsive design</li>
                <li>• SEO optimized structure</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Drag & Drop Editor</h3>
              <p className="text-gray-600 mb-4">
                Edit any text, image, or component with our intuitive drag-and-drop interface. No coding required.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Visual editing experience</li>
                <li>• Real-time preview</li>
                <li>• Component library</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 border border-green-100">
              <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Custom Domains</h3>
              <p className="text-gray-600 mb-4">
                Get your own professional domain with our .solsites.fun subdomain. Stand out from the crowd.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• {`{projectName}.solsites.fun`}</li>
                <li>• SSL certificate included</li>
                <li>• Global CDN</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8 border border-yellow-100">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl flex items-center justify-center mb-6">
                <Coins className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Simple Pricing</h3>
              <p className="text-gray-600 mb-4">
                Build your website completely free. Only pay 1 SOL when you're ready to publish and go live.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Build for free</li>
                <li>• Pay only 1 SOL to publish</li>
                <li>• No hidden fees</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-8 border border-pink-100">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Social Integration</h3>
              <p className="text-gray-600 mb-4">
                Connect all your social media accounts and display them prominently on your website.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Twitter/X integration</li>
                <li>• Telegram links</li>
                <li>• Discord community</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">No Server Required</h3>
              <p className="text-gray-600 mb-4">
                Static hosting means your site is fast, secure, and always available. No maintenance needed.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• 99.9% uptime</li>
                <li>• Global CDN</li>
                <li>• Automatic backups</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Launch your website in 3 simple steps
            </h2>
            <p className="text-xl text-gray-600">
              From idea to live website in under 10 minutes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Choose Your Template</h3>
              <p className="text-gray-600">
                Browse our collection of professional templates designed specifically for meme coins and crypto projects.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Customize Everything</h3>
              <p className="text-gray-600">
                Use our drag-and-drop editor to customize colors, text, images, and add your token information.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Launch & Share</h3>
              <p className="text-gray-600">
                Pay with crypto, get your custom domain, and share your professional website with the world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                      <h2 className="text-4xl font-bold text-white mb-6">
              Ready to launch your meme coin website?
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              Build for free, publish for 1 SOL. No risk, no commitment.
            </p>
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
