import React from 'react'
import { 
  Lock, TrendingUp, Gift, Zap, Shield, DollarSign, Rocket, Star, 
  Heart, CheckCircle, Award, Crown, Diamond, Bolt, ShieldCheck, 
  Key, Unlock, Users, Target, Trophy, Eye, Gem, Moon, Sun, 
  Flame, Leaf, Trees, Flower, Globe, Twitter, MessageCircle, 
  Mail, Phone, Settings, Database, Server, Cloud, Home, Info, 
  AlertCircle, HelpCircle, Search, Plus, Minus, Edit, Trash
} from 'lucide-react'

// Essential icon library with just 40 carefully selected icons
export const iconLibrary = {
  // Security & Protection (8 icons)
  lock: Lock,
  unlock: Unlock,
  shield: Shield,
  'shield-check': ShieldCheck,
  key: Key,
  eye: Eye,
  'alert-circle': AlertCircle,
  'check-circle': CheckCircle,
  
  // Growth & Success (8 icons)
  'trending-up': TrendingUp,
  rocket: Rocket,
  star: Star,
  trophy: Trophy,
  award: Award,
  crown: Crown,
  target: Target,
  flame: Flame,
  
  // Community & Finance (8 icons)
  users: Users,
  gift: Gift,
  heart: Heart,
  'dollar-sign': DollarSign,
  gem: Gem,
  diamond: Diamond,
  globe: Globe,
  bolt: Bolt,
  
  // Nature & Elements (8 icons)
  sun: Sun,
  moon: Moon,
  leaf: Leaf,
  tree: Trees,
  flower: Flower,
  zap: Zap,
  twitter: Twitter,
  message: MessageCircle,
  
  // Technical & Actions (8 icons)
  settings: Settings,
  database: Database,
  server: Server,
  cloud: Cloud,
  home: Home,
  info: Info,
  help: HelpCircle,
  search: Search
}

// Additional action icons for UI
export const actionIcons = {
  plus: Plus,
  minus: Minus,
  edit: Edit,
  trash: Trash,
  mail: Mail,
  phone: Phone
}

// Combined icon map for easy access
export const iconMap = { ...iconLibrary, ...actionIcons }

// Helper function to get icon component
export const getIconComponent = (iconName: string) => {
  return iconMap[iconName as keyof typeof iconMap] || Lock
}

// Helper function to render icon with props
export const renderIcon = (iconName: string, props: any = {}) => {
  const IconComponent = getIconComponent(iconName)
  return React.createElement(IconComponent, { className: 'w-6 h-6', ...props })
}

// Icon categories for organized UI selection
export const iconCategories = [
  { 
    name: 'Security & Protection', 
    icons: ['lock', 'unlock', 'shield', 'shield-check', 'key', 'eye', 'alert-circle', 'check-circle']
  },
  { 
    name: 'Growth & Success', 
    icons: ['trending-up', 'rocket', 'star', 'trophy', 'award', 'crown', 'target', 'flame']
  },
  { 
    name: 'Community & Finance', 
    icons: ['users', 'gift', 'heart', 'dollar-sign', 'gem', 'diamond', 'globe', 'bolt']
  },
  { 
    name: 'Nature & Elements', 
    icons: ['sun', 'moon', 'leaf', 'tree', 'flower', 'zap', 'twitter', 'message']
  },
  { 
    name: 'Technical & Actions', 
    icons: ['settings', 'database', 'server', 'cloud', 'home', 'info', 'help', 'search']
  }
]

// Popular icons for quick selection (top 16)
export const popularIcons = [
  'lock', 'trending-up', 'gift', 'zap', 'shield', 'dollar-sign', 'rocket', 'star',
  'users', 'heart', 'crown', 'trophy', 'gem', 'diamond', 'flame', 'check-circle'
]
