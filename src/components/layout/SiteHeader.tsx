"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'

const SiteHeader = () => {
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
    <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" aria-label="SOL Sites Home" className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 rounded-md">
              <img src="/solsites-logo.svg" alt="SOL Sites" className="h-14" />
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</Link>
            <Link href="/templates" className="text-gray-600 hover:text-gray-900 transition-colors">Templates</Link>
            <Link href="/pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</Link>
            <Button variant="outline" onClick={handleLogin}>Log in</Button>
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
  )
}

export default SiteHeader


