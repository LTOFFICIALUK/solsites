"use client"

import { getTemplateBySlug } from '@/data/templates'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Play, Eye, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { notFound, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect, useState } from 'react'
import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/layout/SiteFooter'

interface TemplatePreviewPageProps {
  params: Promise<{
    slug: string
  }>
}

export default function TemplatePreviewPage({ params }: TemplatePreviewPageProps) {
  const [template, setTemplate] = useState(getTemplateBySlug(''))
  const [slug, setSlug] = useState('')
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const loadTemplate = async () => {
      const resolvedParams = await params
      const resolvedSlug = resolvedParams.slug
      setSlug(resolvedSlug)
      
      const foundTemplate = getTemplateBySlug(resolvedSlug)
      if (!foundTemplate) {
        notFound()
      }
      setTemplate(foundTemplate)
    }
    
    loadTemplate()
  }, [params])

  const handleUseTemplate = () => {
    if (user) {
      router.push(`/create?template=${template?.id}`)
    } else {
      router.push('/login')
    }
  }

  if (!template) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <SiteHeader />

      {/* Template Preview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Template Header */}
          <div className="text-center mb-16">
            <div className="mb-6">
              <span 
                className="inline-block px-4 py-2 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: `${template.colors.primary}20`,
                  color: template.colors.primary
                }}
              >
                {template.category}
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              {template.name} Template
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              {template.description}
            </p>
            
            {/* Template Preview Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                className="px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 flex items-center space-x-2 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 cursor-pointer"
                style={{ color: template.colors.primary }}
                onClick={handleUseTemplate}
              >
                <ArrowRight className="w-5 h-5" />
                <span>{user ? 'Use This Template' : 'Sign In to Use'}</span>
              </button>
              <Link href={`/templates/${template.slug}/preview`}>
                <button 
                  className="px-6 py-3 rounded-full font-semibold border-2 transition-all duration-300 hover:scale-105 flex items-center space-x-2 cursor-pointer"
                  style={{
                    borderColor: template.colors.primary,
                    color: template.colors.primary,
                    backgroundColor: 'white'
                  }}
                >
                  <Eye className="w-5 h-5" />
                  <span>Live Preview</span>
                </button>
              </Link>
            </div>
          </div>

          {/* Template Preview */}
          <div className="mb-16">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
              {/* Preview Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: template.colors.primary }}
                    ></div>
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: template.colors.secondary }}
                    ></div>
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: template.colors.accent }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {template.name} Template Preview
                  </div>
                </div>
              </div>

              {/* Template Mockup */}
              <div className="relative">
                {/* Hero Section Mockup */}
                <div 
                  className="h-96 relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${template.colors.primary}10, ${template.colors.secondary}10)`
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div 
                        className="w-24 h-24 mx-auto mb-6 rounded-3xl flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, ${template.colors.primary}, ${template.colors.secondary})`
                        }}
                      >
                        <Sparkles className="w-12 h-12 text-white" />
                      </div>
                      <h2 className="text-4xl font-bold mb-4" style={{ color: template.colors.primary }}>
                        {template.name} Token
                      </h2>
                      <p className="text-xl text-gray-600 mb-8 max-w-2xl">
                        The next big thing in the meme coin space. Join our community and be part of the revolution.
                      </p>
                      <button 
                        className="px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105"
                        style={{
                          background: `linear-gradient(135deg, ${template.colors.primary}, ${template.colors.secondary})`,
                          color: 'white'
                        }}
                      >
                        Buy Now
                        <ArrowRight className="inline-block ml-2 w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Features Section Mockup */}
                <div className="p-12 bg-white">
                  <div className="max-w-4xl mx-auto">
                    <h3 className="text-3xl font-bold text-center mb-12" style={{ color: template.colors.primary }}>
                      Why Choose {template.name}?
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {template.features.slice(0, 3).map((feature: string, index: number) => (
                        <div key={index} className="text-center p-6 rounded-2xl transition-all duration-300 hover:scale-105"
                          style={{
                            backgroundColor: `${template.colors.primary}05`,
                            border: `1px solid ${template.colors.primary}20`
                          }}
                        >
                          <div 
                            className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                            style={{
                              backgroundColor: `${template.colors.primary}20`,
                              color: template.colors.primary
                            }}
                          >
                            <Sparkles className="w-8 h-8" />
                          </div>
                          <h4 className="text-xl font-semibold mb-3">{feature}</h4>
                          <p className="text-gray-600">
                            Professional design optimized for maximum impact and user engagement.
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Template Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Features */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h3>
              <ul className="space-y-4">
                {template.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div 
                      className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                      style={{ backgroundColor: template.colors.primary }}
                    ></div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Color Palette */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Color Palette</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div 
                    className="w-12 h-12 rounded-lg border-2 border-white shadow-md"
                    style={{ backgroundColor: template.colors.primary }}
                  ></div>
                  <div>
                    <div className="font-semibold">Primary</div>
                    <div className="text-sm text-gray-600">{template.colors.primary}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div 
                    className="w-12 h-12 rounded-lg border-2 border-white shadow-md"
                    style={{ backgroundColor: template.colors.secondary }}
                  ></div>
                  <div>
                    <div className="font-semibold">Secondary</div>
                    <div className="text-sm text-gray-600">{template.colors.secondary}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div 
                    className="w-12 h-12 rounded-lg border-2 border-white shadow-md"
                    style={{ backgroundColor: template.colors.accent }}
                  ></div>
                  <div>
                    <div className="font-semibold">Accent</div>
                    <div className="text-sm text-gray-600">{template.colors.accent}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Ready to Use This Template?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Start customizing your meme coin website with the {template.name} template.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href={`/create?template=${template.slug}`}>
                  <Button 
                    size="lg" 
                    className="text-lg px-8 py-4 hover:scale-105 transition-all duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${template.colors.primary}, ${template.colors.secondary})`,
                      color: 'white',
                      boxShadow: `0 10px 30px ${template.colors.primary}30`
                    }}
                  >
                    Use This Template
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/templates">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                    Browse Other Templates
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
