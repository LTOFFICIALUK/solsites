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
    setContent(block?.content || {})
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
    switch (block.type) {
      case 'hero':
        return (
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
