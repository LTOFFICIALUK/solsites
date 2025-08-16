"use client"

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { iconLibrary, iconCategories, popularIcons, getIconComponent } from '@/lib/icons'
import { ChevronDown, X, Search } from 'lucide-react'

interface IconPickerProps {
  value: string
  onChange: (iconName: string) => void
  className?: string
}

export const IconPicker: React.FC<IconPickerProps> = ({ value, onChange, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('popular')
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const modalRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Get current icon component
  const CurrentIcon = getIconComponent(value || 'star')

  // Filter icons based on search
  const getFilteredIcons = () => {
    if (activeCategory === 'popular') {
      return popularIcons.filter(iconName => 
        iconName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    const allIcons = Object.keys(iconLibrary)
    return allIcons.filter(iconName => 
      iconName.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  // Get icons for a specific category
  const getCategoryIcons = (categoryName: string) => {
    const category = iconCategories.find(cat => cat.name === categoryName)
    return category ? category.icons : []
  }

  // Get the currently displayed icons
  const getCurrentIcons = () => {
    if (searchTerm) return getFilteredIcons()
    if (activeCategory === 'popular') return popularIcons
    if (activeCategory === 'all') return Object.keys(iconLibrary)
    return getCategoryIcons(activeCategory)
  }

  const handleIconSelect = useCallback((iconName: string) => {
    onChange(iconName)
    setIsOpen(false)
    setSearchTerm('')
    setSelectedIndex(-1)
  }, [onChange])

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return
      
      const currentIcons = getCurrentIcons()
      
      switch (event.key) {
        case 'Escape':
          setIsOpen(false)
          setSelectedIndex(-1)
          break
        case 'ArrowDown':
          event.preventDefault()
          setSelectedIndex(prev => Math.min(prev + 1, currentIcons.length - 1))
          break
        case 'ArrowUp':
          event.preventDefault()
          setSelectedIndex(prev => Math.max(prev - 1, -1))
          break
        case 'Enter':
          event.preventDefault()
          if (selectedIndex >= 0 && currentIcons[selectedIndex]) {
            handleIconSelect(currentIcons[selectedIndex])
          }
          break
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, selectedIndex, handleIconSelect])

  // Reset selected index when category or search changes
  useEffect(() => {
    setSelectedIndex(-1)
  }, [activeCategory, searchTerm])

  return (
    <>
      {/* Trigger Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(true)}
        className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex items-center justify-between ${className}`}
      >
        <div className="flex items-center gap-2">
          <CurrentIcon className="w-4 h-4" />
        </div>
        <ChevronDown className="w-4 h-4" />
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-white/0 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          {/* Modal Content */}
          <div
            ref={modalRef}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Select Icon</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search icons..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-500 text-gray-900"
                  autoFocus
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
            </div>

            {/* Category Tabs */}
            <div className="flex border-b border-gray-200 bg-gray-50 overflow-x-auto">
              <button
                onClick={() => setActiveCategory('popular')}
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                  activeCategory === 'popular'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Popular
              </button>
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                  activeCategory === 'all'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                All
              </button>
              {iconCategories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setActiveCategory(category.name)}
                  className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                    activeCategory === category.name
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {category.name.replace(' & ', ' ')}
                </button>
              ))}
            </div>

            {/* Icon Grid */}
            <div className="p-4 overflow-y-auto max-h-96">
              <div className="grid grid-cols-10 gap-3">
                {getCurrentIcons().map((iconName, index) => {
                  const IconComponent = getIconComponent(iconName)
                  const isSelected = value === iconName
                  const isHighlighted = selectedIndex === index
                  return (
                    <button
                      key={iconName}
                      onClick={() => handleIconSelect(iconName)}
                      className={`p-3 rounded-lg transition-colors flex items-center justify-center ${
                        isSelected ? 'bg-blue-100 ring-2 ring-blue-500' : ''
                      } ${
                        isHighlighted ? 'bg-blue-50' : 'hover:bg-gray-100'
                      }`}
                      title={iconName}
                    >
                      <IconComponent className="w-6 h-6 text-gray-900" />
                    </button>
                  )
                })}
              </div>
              
              {/* No results message */}
              {getCurrentIcons().length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg">
                    {searchTerm ? `No icons found for "${searchTerm}"` : 'No icons available'}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  {getCurrentIcons().length} icons {searchTerm ? 'found' : 'available'}
                </p>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
