"use client"

import { 
  Eye, 
  Edit3, 
  Smartphone, 
  Monitor, 
  Tablet,
  Undo,
  Redo,
  Layers,
  Settings,
  Save
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EditorToolbarProps {
  selectedComponent: string | null
  onComponentSelect: (component: string | null) => void
}

const viewModes = [
  { id: 'desktop', name: 'Desktop', icon: Monitor },
  { id: 'tablet', name: 'Tablet', icon: Tablet },
  { id: 'mobile', name: 'Mobile', icon: Smartphone }
]

const componentSections = [
  { id: 'hero', name: 'Hero' },
  { id: 'about', name: 'About' },
  { id: 'tokenomics', name: 'Tokenomics' },
  { id: 'team', name: 'Team' },
  { id: 'roadmap', name: 'Roadmap' }
]

export function EditorToolbar({ 
  selectedComponent, 
  onComponentSelect 
}: EditorToolbarProps) {
  return null
}
