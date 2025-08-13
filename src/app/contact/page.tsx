"use client"

import { useState } from 'react'
import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/layout/SiteFooter'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const ContactPage = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const subject = encodeURIComponent('SOL Sites contact')
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)
    window.location.href = `mailto:support@solsites.fun?subject=${subject}&body=${body}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8 text-center">
          <Badge variant="secondary" className="mb-4">Contact</Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">Contact us</h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">Questions, feedback, or partnership ideas? We would love to hear from you.</p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-800">Name</label>
                <input id="name" name="name" required value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-md border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-blue-600" aria-label="Your name" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-800">Email</label>
                <input id="email" type="email" name="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-md border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-blue-600" aria-label="Your email address" />
              </div>
            </div>
            <div className="mt-6">
              <label htmlFor="message" className="block text-sm font-medium text-gray-800">Message</label>
              <textarea id="message" name="message" required rows={6} value={message} onChange={(e) => setMessage(e.target.value)} className="mt-1 w-full rounded-md border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-blue-600" aria-label="Your message" />
            </div>
            <div className="mt-6">
              <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">Send message</Button>
            </div>
          </form>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}

export default ContactPage


