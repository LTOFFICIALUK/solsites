"use client"

import { useState } from 'react'
import { Palette, Pipette } from 'lucide-react'

interface ColorPickerProps {
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
  }
  onColorChange: (colorType: 'primary' | 'secondary' | 'accent' | 'background', color: string) => void
}

const presetColors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2',
  '#F9E79F', '#ABEBC6', '#FAD7A0', '#AED6F1', '#D5A6BD'
]

export function ColorPicker({ colors, onColorChange }: ColorPickerProps) {
  const [activeColor, setActiveColor] = useState<'primary' | 'secondary' | 'accent' | 'background'>('primary')

  const handleColorInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    onColorChange(activeColor, e.target.value)
  }

  const handlePresetClick = (color: string) => {
    onColorChange(activeColor, color)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Palette className="w-5 h-5 mr-2" />
          Color Scheme
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Customize your website's color palette to match your brand.
        </p>
      </div>

      {/* Color Type Selector */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">Active Color</label>
        <div className="grid grid-cols-4 gap-2">
          {(['primary', 'secondary', 'accent', 'background'] as const).map((colorType) => (
            <button
              key={colorType}
              onClick={() => setActiveColor(colorType)}
              className={`p-3 rounded-lg border-2 transition-all ${
                activeColor === colorType
                  ? 'border-purple-500 shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <div
                  className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: colors[colorType] }}
                />
                <span className="text-xs font-medium capitalize text-gray-700">
                  {colorType}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Color Input */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">
          {activeColor.charAt(0).toUpperCase() + activeColor.slice(1)} Color
        </label>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
          <div className="relative">
            <input
              type="color"
              value={colors[activeColor]}
              onChange={handleColorInput}
              className="w-16 h-16 sm:w-12 sm:h-12 rounded-lg border-2 border-gray-200 cursor-pointer"
            />
            <Pipette className="absolute inset-0 m-auto w-6 h-6 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" />
          </div>
          <input
            type="text"
            value={colors[activeColor]}
            onChange={handleColorInput}
            className="flex-1 px-3 py-3 sm:py-2 border border-gray-300 rounded-lg text-sm font-mono"
            placeholder="#000000"
          />
        </div>
      </div>

      {/* Preset Colors */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">Preset Colors</label>
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 sm:gap-2">
          {presetColors.map((color, index) => (
            <button
              key={index}
              onClick={() => handlePresetClick(color)}
              className="w-10 h-10 sm:w-8 sm:h-8 rounded-lg border-2 border-white shadow-sm hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Color Preview */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">Color Preview</label>
        <div className="space-y-2">
          {(['primary', 'secondary', 'accent', 'background'] as const).map((colorType) => (
            <div key={colorType} className="flex items-center space-x-3">
              <div
                className="w-6 h-6 rounded border border-gray-200"
                style={{ backgroundColor: colors[colorType] }}
              />
              <span className="text-sm text-gray-600 capitalize">{colorType}</span>
              <span className="text-sm font-mono text-gray-500">{colors[colorType]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">Quick Actions</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              onColorChange('primary', '#FF6B6B')
              onColorChange('secondary', '#4ECDC4')
              onColorChange('accent', '#45B7D1')
              onColorChange('background', '#FFFFFF')
            }}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Reset to Default
          </button>
          <button
            onClick={() => {
              const temp = colors.primary
              onColorChange('primary', colors.secondary)
              onColorChange('secondary', colors.accent)
              onColorChange('accent', temp)
            }}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Rotate Colors
          </button>
        </div>
      </div>
    </div>
  )
}
