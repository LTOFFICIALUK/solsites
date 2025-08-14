"use client"

import { useState, useEffect } from 'react'

interface BlockSettingsProps {
  block: any
  template?: any
  onSettingsChange: (settings: any) => void
  onContentChange: (content: any) => void
  onToggleEnabled?: (blockId: string, enabled: boolean) => void
}

export function BlockSettings({ block, template, onSettingsChange, onContentChange, onToggleEnabled }: BlockSettingsProps) {
  const [settings, setSettings] = useState(block?.settings || {})
  const [content, setContent] = useState(block?.content || {})

  useEffect(() => {
    console.log('🔄 BlockSettings received new block:', block)
    setSettings(block?.settings || {})
    setContent(block?.content || {})
  }, [block])

  const handleSettingChange = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    onSettingsChange(newSettings)
  }

  const handleContentChange = (key: string, value: any) => {
    console.log('🔄 BlockSettings content change:', { key, value, blockId: block?.id, template: template?.slug })
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
    const blockTypeRaw = ((block?.type || block?.name || '') as string).toLowerCase()
    const isHeaderBlock = blockTypeRaw.includes('nav') || blockTypeRaw.includes('header')
    switch (isHeaderBlock ? 'navbar' : blockTypeRaw) {
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
                  type="url"
                  value={(content.cta || {}).href || ''}
                  onChange={(e) => handleContentChange('cta', { ...(content.cta || {}), href: e.target.value })}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="External URL (e.g., https://example.com)"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Enter a full URL including https:// for external links</p>
            </div>

            {/* Image / Name */}
            <div>
              <h4 className="text-sm font-medium text-gray-900">Image / Name</h4>
              <p className="text-xs text-gray-500 mb-2">Upload a logo and set the displayed token name</p>
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files && e.target.files[0]
                  if (!file) return
                  const reader = new FileReader()
                  reader.onload = () => {
                    handleContentChange('logoUrl', String(reader.result))
                  }
                  reader.readAsDataURL(file)
                }}
                className="block w-full text-xs text-gray-700"
              />
              {content.logoUrl && (
                <img src={content.logoUrl} alt="Logo preview" className="mt-2 h-10 w-10 rounded object-cover" />
              )}
              <div className="mt-2">
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
                  placeholder="X (Twitter) URL"
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
              </div>
            </div>

            {/* Colour Settings */}
            <div>
              <h4 className="text-sm font-medium text-gray-900">Colour Settings</h4>
              <p className="text-xs text-gray-500 mb-2">Customize header colors</p>
              
              {/* Social Icons */}
              <div className="mb-4">
                <h5 className="text-xs font-medium text-gray-700 mb-2">Social Icons</h5>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={content.socialBgColor || `${template?.colors?.primary || '#1d4ed8'}20`}
                      onChange={(e) => handleContentChange('socialBgColor', e.target.value)}
                      aria-label="Social background color"
                    />
                    <span className="text-xs text-gray-700">Background</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={content.socialIconColor || template?.colors?.secondary || '#9333ea'}
                      onChange={(e) => handleContentChange('socialIconColor', e.target.value)}
                      aria-label="Social icon color"
                    />
                    <span className="text-xs text-gray-700">Icon Color</span>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="mb-4">
                <h5 className="text-xs font-medium text-gray-700 mb-2">CTA Button</h5>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={content.buttonBgColor || template?.colors?.primary || '#1d4ed8'}
                      onChange={(e) => handleContentChange('buttonBgColor', e.target.value)}
                      aria-label="Button background color"
                    />
                    <span className="text-xs text-gray-700">Background</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={content.buttonTextColor || '#ffffff'}
                      onChange={(e) => handleContentChange('buttonTextColor', e.target.value)}
                      aria-label="Button text color"
                    />
                    <span className="text-xs text-gray-700">Text Color</span>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="mb-4">
                <h5 className="text-xs font-medium text-gray-700 mb-2">Navigation</h5>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={content.navTextColor || (template?.slug === 'neon' ? 'rgba(255, 255, 255, 0.8)' : '#374151')}
                      onChange={(e) => handleContentChange('navTextColor', e.target.value)}
                      aria-label="Navigation text color"
                    />
                    <span className="text-xs text-gray-700">Text Color</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={content.navBgColor || (template?.slug === 'neon' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.95)')}
                      onChange={(e) => handleContentChange('navBgColor', e.target.value)}
                      aria-label="Navigation background color"
                    />
                    <span className="text-xs text-gray-700">Background</span>
                  </div>
                </div>
              </div>

              {/* Token Name */}
              <div>
                <h5 className="text-xs font-medium text-gray-700 mb-2">Token Name</h5>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                                          value={content.tokenNameColor || (template?.slug === 'neon' ? 'white' : '#111827')}
                    onChange={(e) => handleContentChange('tokenNameColor', e.target.value)}
                    aria-label="Token name color"
                  />
                  <span className="text-xs text-gray-700">Text Color</span>
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
              <h4 className="text-sm font-medium text-gray-900">Basic Content</h4>
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

            {/* Token Pill */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-900">Token Pill</h4>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-700 mb-2">Token Symbol</label>
                  <input
                    type="text"
                    value={content.tokenSymbol || ''}
                    onChange={(e) => handleContentChange('tokenSymbol', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., MEME"
                  />
                </div>
                <div className="ml-4">
                  <label className="block text-xs font-medium text-gray-700 mb-2">Show Token Pill</label>
                  <button
                    onClick={() => handleContentChange('showTokenPill', !content.showTokenPill)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      content.showTokenPill !== false ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        content.showTokenPill !== false ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-900">Stats Section</h4>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-600">Show Stats</span>
                <button
                  onClick={() => handleContentChange('showStats', !content.showStats)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    content.showStats !== false ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      content.showStats !== false ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              {content.showStats !== false && (
                <div className="space-y-3">
                  {(content.stats || [
                    { value: '10K+', label: 'Holders', color: 'primary' },
                    { value: '$2.5M', label: 'Market Cap', color: 'secondary' },
                    { value: '$500K', label: '24h Volume', color: 'accent' }
                  ]).map((stat: any, index: number) => (
                    <div key={index} className="p-3 border border-gray-200 rounded-md">
                      <div className="grid grid-cols-3 gap-2 mb-2">
                        <input
                          type="text"
                          value={stat.value || ''}
                          onChange={(e) => {
                            const newStats = [...(content.stats || [])]
                            newStats[index] = { ...stat, value: e.target.value }
                            handleContentChange('stats', newStats)
                          }}
                          className="px-2 py-1 text-xs border border-gray-300 rounded bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Value (e.g., 10K+)"
                        />
                        <input
                          type="text"
                          value={stat.label || ''}
                          onChange={(e) => {
                            const newStats = [...(content.stats || [])]
                            newStats[index] = { ...stat, label: e.target.value }
                            handleContentChange('stats', newStats)
                          }}
                          className="px-2 py-1 text-xs border border-gray-300 rounded bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Label (e.g., Holders)"
                        />
                        <select
                          value={stat.color || 'primary'}
                          onChange={(e) => {
                            const newStats = [...(content.stats || [])]
                            newStats[index] = { ...stat, color: e.target.value }
                            handleContentChange('stats', newStats)
                          }}
                          className="px-2 py-1 text-xs border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="primary">Primary</option>
                          <option value="secondary">Secondary</option>
                          <option value="accent">Accent</option>
                        </select>
                      </div>
                      <button
                        onClick={() => {
                          const newStats = [...(content.stats || [])]
                          newStats.splice(index, 1)
                          handleContentChange('stats', newStats)
                        }}
                        className="text-xs text-red-600 hover:text-red-800"
                      >
                        Remove Stat
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newStats = [...(content.stats || []), { value: '', label: '', color: 'primary' }]
                      handleContentChange('stats', newStats)
                    }}
                    className="w-full py-2 text-xs text-blue-600 border border-dashed border-blue-300 rounded-md hover:bg-blue-50 transition-colors"
                  >
                    + Add Stat
                  </button>
                </div>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-900">Call-to-Action Buttons</h4>
              
              {/* Primary Button */}
              <div className="p-3 border border-gray-200 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-700">Primary Button</span>
                  <button
                    onClick={() => handleContentChange('showPrimaryButton', !content.showPrimaryButton)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      content.showPrimaryButton !== false ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        content.showPrimaryButton !== false ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                {content.showPrimaryButton !== false && (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={(content.primaryButton || {}).text || 'Buy Now'}
                      onChange={(e) => handleContentChange('primaryButton', { ...(content.primaryButton || {}), text: e.target.value })}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Button text"
                    />
                    <input
                      type="text"
                      value={(content.primaryButton || {}).href || ''}
                      onChange={(e) => handleContentChange('primaryButton', { ...(content.primaryButton || {}), href: e.target.value })}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Button link URL"
                    />
                  </div>
                )}
              </div>

              {/* Secondary Button */}
              <div className="p-3 border border-gray-200 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-700">Secondary Button</span>
                  <button
                    onClick={() => handleContentChange('showSecondaryButton', !content.showSecondaryButton)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      content.showSecondaryButton !== false ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        content.showSecondaryButton !== false ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                {content.showSecondaryButton !== false && (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={(content.secondaryButton || {}).text || 'Watch Video'}
                      onChange={(e) => handleContentChange('secondaryButton', { ...(content.secondaryButton || {}), text: e.target.value })}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Button text"
                    />
                    <input
                      type="text"
                      value={(content.secondaryButton || {}).href || ''}
                      onChange={(e) => handleContentChange('secondaryButton', { ...(content.secondaryButton || {}), href: e.target.value })}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Button link URL"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Token Visual Section */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-900">Token Visual</h4>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-600">Show Token Visual</span>
                <button
                  onClick={() => handleContentChange('showTokenVisual', !content.showTokenVisual)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    content.showTokenVisual !== false ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      content.showTokenVisual !== false ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              {content.showTokenVisual !== false && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Token Logo</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files && e.target.files[0]
                        if (!file) return
                        const reader = new FileReader()
                        reader.onload = () => {
                          handleContentChange('tokenLogo', String(reader.result))
                        }
                        reader.readAsDataURL(file)
                      }}
                      className="block w-full text-xs text-gray-700"
                    />
                    {content.tokenLogo && (
                      <img src={content.tokenLogo} alt="Token logo preview" className="mt-2 h-12 w-12 rounded object-cover" />
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Token Price</label>
                    <input
                      type="text"
                      value={content.tokenPrice || '$0.0025'}
                      onChange={(e) => handleContentChange('tokenPrice', e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="e.g., $0.0025"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">24h Change</label>
                    <input
                      type="text"
                      value={content.priceChange || '+15.2%'}
                      onChange={(e) => handleContentChange('priceChange', e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="e.g., +15.2%"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Circulating Supply</label>
                      <input
                        type="text"
                        value={content.circulatingSupply || '800M'}
                        onChange={(e) => handleContentChange('circulatingSupply', e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="e.g., 800M"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Total Supply</label>
                      <input
                        type="text"
                        value={content.totalSupply || '1B'}
                        onChange={(e) => handleContentChange('totalSupply', e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="e.g., 1B"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Scroll Indicator */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-900">Scroll Indicator</h4>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Show Scroll Indicator</span>
                <button
                  onClick={() => handleContentChange('showScrollIndicator', !content.showScrollIndicator)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    content.showScrollIndicator !== false ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      content.showScrollIndicator !== false ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              {content.showScrollIndicator !== false && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Scroll Text</label>
                  <input
                    type="text"
                    value={content.scrollText || 'Scroll to explore'}
                    onChange={(e) => handleContentChange('scrollText', e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Scroll indicator text"
                  />
                </div>
              )}
            </div>

            {/* Colors */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-900">Colors</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={content.primaryColor || '#3B82F6'}
                    onChange={(e) => handleContentChange('primaryColor', e.target.value)}
                    aria-label="Primary color"
                  />
                  <span className="text-xs text-gray-700">Primary</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={content.secondaryColor || '#1E40AF'}
                    onChange={(e) => handleContentChange('secondaryColor', e.target.value)}
                    aria-label="Secondary color"
                  />
                  <span className="text-xs text-gray-700">Secondary</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={content.accentColor || '#F59E0B'}
                    onChange={(e) => handleContentChange('accentColor', e.target.value)}
                    aria-label="Accent color"
                  />
                  <span className="text-xs text-gray-700">Accent</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={content.backgroundColor || '#F9FAFB'}
                    onChange={(e) => handleContentChange('backgroundColor', e.target.value)}
                    aria-label="Background color"
                  />
                  <span className="text-xs text-gray-700">Background</span>
                </div>
              </div>
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
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={content.title || ''}
                onChange={(e) => handleContentChange('title', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter team title"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={content.description || ''}
                onChange={(e) => handleContentChange('description', e.target.value)}
                className="w-full h-20 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Enter team description"
              />
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
