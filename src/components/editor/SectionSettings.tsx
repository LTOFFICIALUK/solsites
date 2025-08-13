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

      {/* Removed background color/image controls that were not connected to live rendering */}

      {/* Removed spacing controls that didn't map into template components */}

      {/* Removed layout controls that weren’t wired across templates */}

      {/* Removed custom CSS input */}
    </div>
  )
}
