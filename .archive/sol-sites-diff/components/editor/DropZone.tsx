"use client"

import { useState } from 'react'
import { Plus } from 'lucide-react'

interface DropZoneProps {
  onDrop: (componentType: string) => void
  onDragOver: (e: React.DragEvent) => void
  position: 'top' | 'bottom' | 'between'
}

export function DropZone({ onDrop, onDragOver, position }: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
    onDragOver(e)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    const componentType = e.dataTransfer.getData('component-type')
    console.log('DropZone drop:', componentType)
    if (componentType) {
      onDrop(componentType)
    }
  }

  const getPositionStyles = () => {
    switch (position) {
      case 'top':
        return 'top-0 left-0 right-0 h-12 -translate-y-6'
      case 'bottom':
        return 'bottom-0 left-0 right-0 h-12 translate-y-6'
      case 'between':
        return 'top-1/2 left-0 right-0 h-12 -translate-y-1/2'
      default:
        return ''
    }
  }

  return (
    <div
      className={`absolute ${getPositionStyles()} z-30 transition-all duration-200 ${
        isDragOver ? 'opacity-100 scale-100' : 'opacity-50 scale-95'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className={`h-full flex items-center justify-center ${
        isDragOver 
          ? 'bg-purple-500 border-2 border-dashed border-purple-300' 
          : 'bg-gray-100 border-2 border-dashed border-gray-300'
      } rounded-lg transition-all duration-200`}>
        <div className="flex items-center space-x-2 text-sm">
          <Plus className={`w-4 h-4 ${isDragOver ? 'text-white' : 'text-gray-500'}`} />
          <span className={`font-medium ${isDragOver ? 'text-white' : 'text-gray-500'}`}>
            Drop component here
          </span>
        </div>
      </div>
    </div>
  )
}