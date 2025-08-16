"use client"

import { useState, useEffect } from 'react'

interface BlockSettingsProps {
  block: any
  onSettingsChange: (settings: any) => void
  onContentChange: (content: any) => void
  onToggleEnabled?: (blockId: string, enabled: boolean) => void
}

export function BlockSettings({ block, onSettingsChange, onContentChange, onToggleEnabled }: BlockSettingsProps) {
  const [settings, setSettings] = useState(block?.settings || {})
  const [content, setContent] = useState(block?.content || {})

  useEffect(() => {
    setSettings(block?.settings || {})
    const raw = ((block?.type || block?.name || '') as string).toLowerCase()
    const base = block?.content || {}
    if (raw.includes('hero')) {
      const heroDefaults = {
        title: base.title || '',
        subtitle: base.subtitle || '',
        description: base.description || '',
        showStats: base.showStats !== undefined ? base.showStats : true,
        stats: {
          holders: (base.stats && base.stats.holders) || '10,000+',
          marketCap: (base.stats && base.stats.marketCap) || '$2.5M',
          volume24h: (base.stats && base.stats.volume24h) || '$500K',
        },
        primaryButton: {
          text: (base.primaryButton && base.primaryButton.text) || 'Buy Now',
          href: (base.primaryButton && base.primaryButton.href) || '',
        },
      }
      setContent(heroDefaults)
    } else {
      setContent(base)
    }
  }, [block])

  const handleSettingChange = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    onSettingsChange(newSettings)
  }

  const handleContentChange = (key: string, value: any) => {
    const newContent = { ...content, [key]: value }
    setContent(newContent)
    onContentChange(newContent)
  }

  if (!block) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>No block selected</p>
      </div>
    )
  }

  const renderContentFields = () => {
    const rawType = ((block?.type || block?.name || '') as string).toLowerCase()
    const isHeader = rawType.includes('nav') || rawType.includes('header')
    switch (isHeader ? 'navbar' : rawType) {
      case 'navbar':
        return (
          <div className="space-y-6">
            {/* Links */}
            <div>
              <h4 className="text-sm font-medium text-gray-900">Links</h4>
              <p className="text-xs text-gray-500 mb-2">Edit the navigation links shown in the header</p>
              <div className="space-y-2">
                {(content.navItems || [
                  { label: 'About', href: '#about' },
                  { label: 'Tokenomics', href: '#tokenomics' },
                  { label: 'Roadmap', href: '#roadmap' },
                  { label: 'Team', href: '#team' }
                ]).map((item: any, index: number) => (
                  <div key={index} className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={item.label || ''}
                      onChange={(e) => {
                        const newItems = [...(content.navItems || [])]
                        newItems[index] = { ...item, label: e.target.value }
                        handleContentChange('navItems', newItems)
                      }}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Label"
                    />
                    <input
                      type="text"
                      value={item.href || ''}
                      onChange={(e) => {
                        const newItems = [...(content.navItems || [])]
                        newItems[index] = { ...item, href: e.target.value }
                        handleContentChange('navItems', newItems)
                      }}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Link (href)"
                    />
                  </div>
                ))}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const newItems = [...(content.navItems || []), { label: '', href: '' }]
                      handleContentChange('navItems', newItems)
                    }}
                    className="flex-1 py-2 text-xs text-blue-600 border border-dashed border-blue-300 rounded-md hover:bg-blue-50 transition-colors"
                  >
                    + Add Nav Item
                  </button>
                  <button
                    onClick={() => handleContentChange('navItems', (content.navItems || []).slice(0, -1))}
                    className="px-3 py-2 text-xs text-red-600 border border-dashed border-red-300 rounded-md hover:bg-red-50 transition-colors"
                  >
                    Remove Last
                  </button>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div>
              <h4 className="text-sm font-medium text-gray-900">Buttons</h4>
              <p className="text-xs text-gray-500 mb-2">Edit the primary call-to-action</p>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={(content.cta || {}).text || ''}
                  onChange={(e) => handleContentChange('cta', { ...(content.cta || {}), text: e.target.value })}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Text (e.g., Buy Now)"
                />
                <input
                  type="text"
                  value={(content.cta || {}).href || ''}
                  onChange={(e) => handleContentChange('cta', { ...(content.cta || {}), href: e.target.value })}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Link URL"
                />
              </div>
            </div>

            {/* Image / Name */}
            <div>
              <h4 className="text-sm font-medium text-gray-900">Image / Name</h4>
              <p className="text-xs text-gray-500 mb-2">Upload a logo and set the displayed token name</p>
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  <div className="w-16 h-16 rounded-lg bg-white border-2 border-gray-300 flex items-center justify-center overflow-hidden">
                    {content.logoUrl ? (
                      <img 
                        src={content.logoUrl} 
                        alt="Logo preview" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                          const nextElement = e.currentTarget.nextElementSibling as HTMLElement
                          if (nextElement) nextElement.style.display = 'flex'
                        }}
                      />
                    ) : null}
                    <div className={`w-full h-full flex items-center justify-center ${content.logoUrl ? 'hidden' : ''}`}>
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.createElement('input')
                      input.type = 'file'
                      input.accept = 'image/*'
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0]
                        if (!file) return
                        const reader = new FileReader()
                        reader.onload = () => {
                          handleContentChange('logoUrl', String(reader.result))
                        }
                        reader.readAsDataURL(file)
                      }
                      input.click()
                    }}
                    className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                  >
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-1">
                    {content.logoUrl ? 'Logo uploaded' : 'Click to upload logo'}
                  </div>
                  {content.logoUrl && (
                    <button
                      type="button"
                      onClick={() => handleContentChange('logoUrl', '')}
                      className="text-xs text-red-600 hover:text-red-800"
                    >
                      Remove logo
                    </button>
                  )}
                </div>
              </div>
              <div>
                <input
                  type="text"
                  value={content.displayName || ''}
                  onChange={(e) => handleContentChange('displayName', e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Display name (e.g., MEME)"
                />
              </div>
            </div>

            {/* Socials */}
            <div>
              <h4 className="text-sm font-medium text-gray-900">Socials</h4>
              <p className="text-xs text-gray-500 mb-2">Links to your communities</p>
              <div className="space-y-2">
                <input
                  type="text"
                  value={(content.social || {}).twitter || ''}
                  onChange={(e) => handleContentChange('social', { ...(content.social || {}), twitter: e.target.value })}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Twitter URL"
                />
                <input
                  type="text"
                  value={(content.social || {}).telegram || ''}
                  onChange={(e) => handleContentChange('social', { ...(content.social || {}), telegram: e.target.value })}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Telegram URL"
                />
                <input
                  type="text"
                  value={(content.social || {}).discord || ''}
                  onChange={(e) => handleContentChange('social', { ...(content.social || {}), discord: e.target.value })}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Discord URL"
                />
                <input
                  type="text"
                  value={(content.social || {}).website || ''}
                  onChange={(e) => handleContentChange('social', { ...(content.social || {}), website: e.target.value })}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Website URL"
                />
              </div>
            </div>

            {/* Colour */}
            <div>
              <h4 className="text-sm font-medium text-gray-900">Colour</h4>
              <p className="text-xs text-gray-500 mb-2">Header-specific brand colours</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={content.primaryColor || '#1d4ed8'}
                    onChange={(e) => handleContentChange('primaryColor', e.target.value)}
                    aria-label="Primary colour"
                  />
                  <span className="text-xs text-gray-700">Primary</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={content.secondaryColor || '#9333ea'}
                    onChange={(e) => handleContentChange('secondaryColor', e.target.value)}
                    aria-label="Secondary colour"
                  />
                  <span className="text-xs text-gray-700">Secondary</span>
                </div>
              </div>
            </div>
          </div>
        )
      case 'hero':
        return (
          <div className="space-y-6">
            {/* Basic Content */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={content.title || ''}
                  onChange={(e) => handleContentChange('title', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter hero title"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Subtitle</label>
                <input
                  type="text"
                  value={content.subtitle || ''}
                  onChange={(e) => handleContentChange('subtitle', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter hero subtitle"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={content.description || ''}
                  onChange={(e) => handleContentChange('description', e.target.value)}
                  className="w-full h-20 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Enter hero description"
                />
              </div>
            </div>

            {/* Stats Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-900">Show Stats</label>
                <button
                  onClick={() => handleContentChange('showStats', !content.showStats)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${content.showStats ? 'bg-blue-600' : 'bg-gray-200'}`}
                  aria-label="Toggle stats visibility"
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${content.showStats ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              {content.showStats && (
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Holders</label>
                    <input
                      type="text"
                      value={(content.stats || {}).holders || ''}
                      onChange={(e) => handleContentChange('stats', { ...(content.stats || {}), holders: e.target.value })}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="e.g., 10,000+"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Market Cap</label>
                    <input
                      type="text"
                      value={(content.stats || {}).marketCap || ''}
                      onChange={(e) => handleContentChange('stats', { ...(content.stats || {}), marketCap: e.target.value })}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="e.g., $2.5M"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">24h Volume</label>
                    <input
                      type="text"
                      value={(content.stats || {}).volume24h || ''}
                      onChange={(e) => handleContentChange('stats', { ...(content.stats || {}), volume24h: e.target.value })}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="e.g., $500K"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Call-to-Action Button */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-900">Primary Call-to-Action</h4>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={(content.primaryButton || {}).text || ''}
                  onChange={(e) => handleContentChange('primaryButton', { ...(content.primaryButton || {}), text: e.target.value })}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Button text (e.g., Buy Now)"
                />
                <input
                  type="url"
                  value={(content.primaryButton || {}).href || ''}
                  onChange={(e) => handleContentChange('primaryButton', { ...(content.primaryButton || {}), href: e.target.value })}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Button link (https://...)"
                />
              </div>
              <p className="text-xs text-gray-500">If a link is provided, the button will open it in a new tab.</p>
            </div>
          </div>
        )

      case 'about':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={content.title || ''}
                onChange={(e) => handleContentChange('title', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter about title"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={content.description || ''}
                onChange={(e) => handleContentChange('description', e.target.value)}
                className="w-full h-20 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Enter about description"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Features</label>
              <div className="space-y-2">
                {(content.features || []).map((feature: any, index: number) => (
                  <div key={index} className="p-3 border border-gray-200 rounded-md">
                    <input
                      type="text"
                      value={feature.title || ''}
                      onChange={(e) => {
                        const newFeatures = [...(content.features || [])]
                        newFeatures[index] = { ...feature, title: e.target.value }
                        handleContentChange('features', newFeatures)
                      }}
                      className="w-full mb-2 px-2 py-1 text-xs border border-gray-300 rounded bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Feature title"
                    />
                    <textarea
                      value={feature.description || ''}
                      onChange={(e) => {
                        const newFeatures = [...(content.features || [])]
                        newFeatures[index] = { ...feature, description: e.target.value }
                        handleContentChange('features', newFeatures)
                      }}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                      placeholder="Feature description"
                      rows={2}
                    />
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newFeatures = [...(content.features || []), { title: '', description: '', icon: '💡' }]
                    handleContentChange('features', newFeatures)
                  }}
                  className="w-full py-2 text-xs text-blue-600 border border-dashed border-blue-300 rounded-md hover:bg-blue-50 transition-colors"
                >
                  + Add Feature
                </button>
              </div>
            </div>
          </div>
        )

      case 'tokenomics':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={content.title || ''}
                onChange={(e) => handleContentChange('title', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter tokenomics title"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={content.description || ''}
                onChange={(e) => handleContentChange('description', e.target.value)}
                className="w-full h-20 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Enter tokenomics description"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Total Supply</label>
              <input
                type="text"
                value={content.totalSupply || ''}
                onChange={(e) => handleContentChange('totalSupply', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 1,000,000,000"
              />
            </div>
          </div>
        )

      case 'team':
        return (
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-900">Basic Information</h4>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={content.title || 'Our Team'}
                  onChange={(e) => handleContentChange('title', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter team title"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={content.description || 'Meet the passionate team behind our success'}
                  onChange={(e) => handleContentChange('description', e.target.value)}
                  className="w-full h-20 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Enter team description"
                />
              </div>
            </div>

            {/* Team Members */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-900">Team Members</h4>
              <div className="space-y-3">
                {(content.members || [
                  { name: 'Alex Johnson', role: 'Founder & CEO', avatar: '', social: '' },
                  { name: 'Sarah Chen', role: 'Lead Developer', avatar: '', social: '' },
                  { name: 'Mike Rodriguez', role: 'Marketing Director', avatar: '', social: '' }
                ]).map((member: any, index: number) => (
                  <div key={index} className="p-3 border border-gray-200 rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-700">Member {index + 1}</span>
                      <button
                        onClick={() => {
                          const newMembers = [...(content.members || [])]
                          newMembers.splice(index, 1)
                          handleContentChange('members', newMembers)
                        }}
                        className="text-xs text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                    
                    {/* Avatar Upload */}
                    <div className="mb-3">
                      <label className="block text-xs font-medium text-gray-700 mb-2">Avatar</label>
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-16 h-16 rounded-lg bg-white border-2 border-gray-300 flex items-center justify-center overflow-hidden">
                            {member.avatar && /^data:/.test(member.avatar) ? (
                              <img 
                                src={member.avatar} 
                                alt="Avatar" 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none'
                                  const nextElement = e.currentTarget.nextElementSibling as HTMLElement
                                  if (nextElement) nextElement.style.display = 'flex'
                                }}
                              />
                            ) : null}
                            <div className={`w-full h-full flex items-center justify-center ${member.avatar && /^data:/.test(member.avatar) ? 'hidden' : ''}`}>
                              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const input = document.createElement('input')
                              input.type = 'file'
                              input.accept = 'image/*'
                              input.onchange = (e) => {
                                const file = (e.target as HTMLInputElement).files?.[0]
                                if (!file) return
                                const reader = new FileReader()
                                reader.onload = () => {
                                  const newMembers = [...(content.members || [])]
                                  newMembers[index] = { ...member, avatar: String(reader.result) }
                                  handleContentChange('members', newMembers)
                                }
                                reader.readAsDataURL(file)
                              }
                              input.click()
                            }}
                            className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                          >
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>
                        <div className="flex-1">
                          <div className="text-xs text-gray-500 mb-1">
                            {member.avatar && /^data:/.test(member.avatar) ? 'Image uploaded' : 'Click to upload image'}
                          </div>
                          {member.avatar && /^data:/.test(member.avatar) && (
                            <button
                              type="button"
                              onClick={() => {
                                const newMembers = [...(content.members || [])]
                                newMembers[index] = { ...member, avatar: '👤' }
                                handleContentChange('members', newMembers)
                              }}
                              className="text-xs text-red-600 hover:text-red-800"
                            >
                              Remove image
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Name and Role */}
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <input
                        type="text"
                        value={member.name || ''}
                        onChange={(e) => {
                          const newMembers = [...(content.members || [])]
                          newMembers[index] = { ...member, name: e.target.value }
                          handleContentChange('members', newMembers)
                        }}
                        className="px-2 py-1 text-xs border border-gray-300 rounded bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Name"
                      />
                      <input
                        type="text"
                        value={member.role || ''}
                        onChange={(e) => {
                          const newMembers = [...(content.members || [])]
                          newMembers[index] = { ...member, role: e.target.value }
                          handleContentChange('members', newMembers)
                        }}
                        className="px-2 py-1 text-xs border border-gray-300 rounded bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Role"
                      />
                    </div>

                    {/* Social Link */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">X (Twitter) Link</label>
                      <input
                        type="text"
                        value={member.social || ''}
                        onChange={(e) => {
                          const newMembers = [...(content.members || [])]
                          newMembers[index] = { ...member, social: e.target.value }
                          handleContentChange('members', newMembers)
                        }}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="https://x.com/username"
                      />
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newMembers = [...(content.members || []), { 
                      name: '', 
                      role: '', 
                      avatar: '', 
                      social: '' 
                    }]
                    handleContentChange('members', newMembers)
                  }}
                  className="w-full py-2 text-xs text-blue-600 border border-dashed border-blue-300 rounded-md hover:bg-blue-50 transition-colors"
                >
                  + Add Team Member
                </button>
              </div>
            </div>
          </div>
        )

      default:
        return (
          <div className="p-4 text-center text-gray-500">
            <p>No content fields available for this block type</p>
          </div>
        )
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Block Header */}
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-semibold text-gray-900">{block.name}</h3>
        <p className="text-sm text-gray-500 mt-1">Customize this block's content and appearance</p>
      </div>

      {/* Visibility Toggle */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-900">Block Visibility</label>
            <p className="text-xs text-gray-500">Show or hide this block on the page</p>
          </div>
          <button
            onClick={() => onToggleEnabled && onToggleEnabled(block.id, !(block.is_enabled !== false))}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              (block.is_enabled !== false) ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                (block.is_enabled !== false) ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Content Fields */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-900">Content</h4>
        {renderContentFields()}
      </div>

      {/* Removed non-functional styling and custom CSS controls */}
    </div>
  )
}
