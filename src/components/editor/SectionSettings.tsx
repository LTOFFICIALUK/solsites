"use client"

import { useState, useEffect } from 'react'

interface SectionSettingsProps {
  section: any
  onSettingsChange: (settings: any) => void
  onToggleEnabled?: (sectionId: string, enabled: boolean) => void
}

export function SectionSettings({ section, onSettingsChange, onToggleEnabled }: SectionSettingsProps) {
  const [settings, setSettings] = useState(section?.settings || {})

  useEffect(() => {
    setSettings(section?.settings || {})
  }, [section])

  const handleSettingChange = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    onSettingsChange(newSettings)
  }

  if (!section) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>No section selected</p>
      </div>
    )
  }

  const isHeader = (() => {
    const key = (section?.type || section?.name || '').toString().toLowerCase()
    return key.includes('nav') || key.includes('header')
  })()

  return (
    <div className="p-6 space-y-6">
      {/* Section Header */}
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-semibold text-gray-900">{section.name}</h3>
        <p className="text-sm text-gray-500 mt-1">Customize this section's appearance and behavior</p>
      </div>

      {/* Visibility Toggle */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-900">Section Visibility</label>
            <p className="text-xs text-gray-500">Show or hide this section on the page</p>
          </div>
          <button
            onClick={() => onToggleEnabled && onToggleEnabled(section.id, !section.is_enabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              section.is_enabled ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                section.is_enabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Header settings when no explicit navbar block */}
      {isHeader && (
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Navigation Items</h4>
            <div className="mt-2 space-y-2">
              {(settings.navItems || [
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
                      const navItems = [...(settings.navItems || [])]
                      navItems[index] = { ...item, label: e.target.value }
                      handleSettingChange('navItems', navItems)
                    }}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Label"
                  />
                  <input
                    type="text"
                    value={item.href || ''}
                    onChange={(e) => {
                      const navItems = [...(settings.navItems || [])]
                      navItems[index] = { ...item, href: e.target.value }
                      handleSettingChange('navItems', navItems)
                    }}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Link (href)"
                  />
                </div>
              ))}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const navItems = [...(settings.navItems || []), { label: '', href: '' }]
                    handleSettingChange('navItems', navItems)
                  }}
                  className="flex-1 py-2 text-xs text-blue-600 border border-dashed border-blue-300 rounded-md hover:bg-blue-50 transition-colors"
                >
                  + Add Nav Item
                </button>
                <button
                  onClick={() => handleSettingChange('navItems', (settings.navItems || []).slice(0, -1))}
                  className="px-3 py-2 text-xs text-red-600 border border-dashed border-red-300 rounded-md hover:bg-red-50 transition-colors"
                >
                  Remove Last
                </button>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900">CTA Button</h4>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <input
                type="text"
                value={(settings.cta || {}).text || ''}
                onChange={(e) => handleSettingChange('cta', { ...(settings.cta || {}), text: e.target.value })}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Text (e.g., Buy Now)"
              />
              <input
                type="text"
                value={(settings.cta || {}).href || ''}
                onChange={(e) => handleSettingChange('cta', { ...(settings.cta || {}), href: e.target.value })}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Link URL"
              />
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900">Logo Image</h4>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files && e.target.files[0]
                if (!file) return
                const reader = new FileReader()
                reader.onload = () => {
                  handleSettingChange('logoUrl', String(reader.result))
                }
                reader.readAsDataURL(file)
              }}
              className="block w-full text-xs text-gray-700"
            />
            {settings.logoUrl && (
              <img src={settings.logoUrl} alt="Logo preview" className="mt-2 h-10 w-10 rounded object-cover" />
            )}
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900">Social Links</h4>
            <div className="mt-2 space-y-2">
              <input
                type="text"
                value={(settings.social || {}).twitter || ''}
                onChange={(e) => onSettingsChange({ ...settings, social: { ...(settings.social || {}), twitter: e.target.value } })}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Twitter URL"
              />
              <input
                type="text"
                value={(settings.social || {}).telegram || ''}
                onChange={(e) => onSettingsChange({ ...settings, social: { ...(settings.social || {}), telegram: e.target.value } })}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Telegram URL"
              />
              <input
                type="text"
                value={(settings.social || {}).discord || ''}
                onChange={(e) => onSettingsChange({ ...settings, social: { ...(settings.social || {}), discord: e.target.value } })}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Discord URL"
              />
              <input
                type="text"
                value={(settings.social || {}).website || ''}
                onChange={(e) => onSettingsChange({ ...settings, social: { ...(settings.social || {}), website: e.target.value } })}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Website URL"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
