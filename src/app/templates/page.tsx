"use client"

import { templates } from '@/data/templates'
import { Button } from '@/components/ui/button'
import { ArrowRight, Eye, Play, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function TemplatesPage() {
  const { user } = useAuth()
  const router = useRouter()

  const handleStartBuilding = () => {
    if (user) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <img src="/solsites-logo.svg" alt="SOL Sites" className="h-14" />
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="outline">Back to Home</Button>
              </Link>
              <Button 
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                onClick={handleStartBuilding}
              >
                {user ? 'Dashboard' : 'Start Building'}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Choose Your
              <span className="block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Perfect Template
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional templates designed specifically for meme coins. Each template is fully customizable 
              and optimized for all devices.
            </p>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {templates.map((template) => (
              <div 
                key={template.id}
                className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                {/* Template Preview */}
                <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div 
                        className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, ${template.colors.primary}, ${template.colors.secondary})`
                        }}
                      >
                        <Sparkles className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">{template.name}</h3>
                    </div>
                  </div>
                  
                  {/* Template Preview Overlay */}
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 hover:opacity-100 transition-opacity duration-300 flex space-x-4">
                      <Link href={`/templates/${template.slug}/preview`}>
                        <button className="p-3 bg-white/90 rounded-full hover:bg-white transition-colors">
                          <Eye className="w-5 h-5 text-gray-900" />
                        </button>
                      </Link>
                      <Link href={`/templates/${template.slug}`}>
                        <button className="p-3 bg-white/90 rounded-full hover:bg-white transition-colors">
                          <Play className="w-5 h-5 text-gray-900" />
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Template Info */}
                <div className="p-8">
                  <div className="mb-4">
                    <span 
                      className="inline-block px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: `${template.colors.primary}20`,
                        color: template.colors.primary
                      }}
                    >
                      {template.category}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{template.name}</h3>
                  <p className="text-gray-600 mb-6">{template.description}</p>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Key Features:</h4>
                    <ul className="space-y-2">
                      {template.features.slice(0, 3).map((feature: string, index: number) => (
                        <li key={index} className="flex items-center text-sm text-gray-600">
                          <div 
                            className="w-2 h-2 rounded-full mr-3"
                            style={{ backgroundColor: template.colors.primary }}
                          ></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Color Palette */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Color Palette:</h4>
                    <div className="flex space-x-2">
                      <div 
                        className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                        style={{ backgroundColor: template.colors.primary }}
                      ></div>
                      <div 
                        className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                        style={{ backgroundColor: template.colors.secondary }}
                      ></div>
                      <div 
                        className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                        style={{ backgroundColor: template.colors.accent }}
                      ></div>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex space-x-3">
                    <Link href={`/templates/${template.slug}/preview`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        Live Preview
                      </Button>
                    </Link>
                    <Link href={`/templates/${template.slug}`} className="flex-1">
                      <Button 
                        className="w-full"
                        style={{
                          background: `linear-gradient(135deg, ${template.colors.primary}, ${template.colors.secondary})`
                        }}
                      >
                        Use Template
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Ready to Build Your Website?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Choose a template and start customizing your meme coin website for free.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-4"
                  onClick={handleStartBuilding}
                >
                  {user ? 'Go to Dashboard' : 'Start Building Free'}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Link href="/">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">SOL Sites</span>
              </div>
              <p className="text-gray-400">
                The ultimate platform for launching professional meme coin websites on Solana.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Templates</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Examples</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SOL Sites. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}