"use client"

import { useState } from 'react'

interface DevicePreviewProps {
  children: React.ReactNode
  mode: 'desktop' | 'tablet' | 'mobile'
}

interface DeviceConfig {
  name: string
  width: number
  height: number
  scale: number
  frame: boolean
  userAgent?: string
}

const DEVICE_CONFIGS: Record<string, DeviceConfig> = {
  desktop: {
    name: 'Desktop',
    width: 1200,
    height: 800,
    scale: 1,
    frame: false
  },
  tablet: {
    name: 'iPad',
    width: 768,
    height: 1024,
    scale: 0.8,
    frame: true
  },
  mobile: {
    name: 'iPhone 12',
    width: 375,
    height: 812,
    scale: 0.9,
    frame: true
  }
}

// Chrome DevTools device presets
const CHROME_DEVICES = {
  'iPhone 12 Pro': { width: 390, height: 844, scale: 0.9, frame: true },
  'iPhone 12': { width: 375, height: 812, scale: 0.9, frame: true },
  'iPhone SE': { width: 375, height: 667, scale: 0.9, frame: true },
  'iPad Pro': { width: 1024, height: 1366, scale: 0.7, frame: true },
  'iPad': { width: 768, height: 1024, scale: 0.8, frame: true },
  'Galaxy S20': { width: 360, height: 800, scale: 0.9, frame: true },
  'Pixel 5': { width: 393, height: 851, scale: 0.9, frame: true },
  'Desktop': { width: 1200, height: 800, scale: 1, frame: false }
}

export function DevicePreview({ children, mode }: DevicePreviewProps) {
  const [isRotated, setIsRotated] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState(mode === 'mobile' ? 'iPhone 12' : mode === 'tablet' ? 'iPad' : 'Desktop')
  
  const deviceConfig = CHROME_DEVICES[selectedDevice as keyof typeof CHROME_DEVICES] || DEVICE_CONFIGS[mode]
  
  const containerStyle = {
    width: isRotated ? deviceConfig.height : deviceConfig.width,
    height: isRotated ? deviceConfig.width : deviceConfig.height,
    transform: `scale(${deviceConfig.scale})`,
    transformOrigin: 'top center'
  }

  const deviceStyle = {
    width: isRotated ? deviceConfig.height : deviceConfig.width,
    height: isRotated ? deviceConfig.width : deviceConfig.height,
    maxWidth: '100%',
    maxHeight: '100%'
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
      {/* Device Frame */}
      <div 
        className={`relative ${deviceConfig.frame ? 'device-frame' : ''}`}
        style={containerStyle}
      >
        {/* Device Frame Styling (for tablet/mobile) */}
        {deviceConfig.frame && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 rounded-[2rem] border-[6px] border-gray-800 bg-gray-800 shadow-2xl">
              {/* Home Indicator */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-600 rounded-full"></div>
              
              {/* Camera Notch */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-20 h-6 bg-gray-800 rounded-full border-2 border-gray-700"></div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div 
          className={`relative overflow-hidden bg-white ${
            deviceConfig.frame 
              ? 'rounded-[1.5rem] border-[3px] border-gray-700' 
              : 'rounded-lg shadow-lg'
          }`}
          style={deviceStyle}
        >
          {/* Browser Chrome (for desktop) */}
          {!deviceConfig.frame && (
            <div className="bg-gray-100 border-b border-gray-200 px-4 py-2 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-white rounded-md px-3 py-1 text-xs text-gray-600 border">
                  localhost:3000
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 text-gray-400">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="w-4 h-4 text-gray-400">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="overflow-auto" style={{ height: deviceConfig.frame ? '100%' : 'calc(100% - 40px)' }}>
            {children}
          </div>
        </div>
      </div>

      {/* Device Controls - Chrome DevTools Style */}
      <div className="mt-6 bg-white rounded-lg shadow-md border border-gray-200">
        {/* Device Selector */}
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-900">Device</span>
              <select
                value={selectedDevice}
                onChange={(e) => setSelectedDevice(e.target.value)}
                className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Desktop">Desktop</option>
                <option value="iPhone 12 Pro">iPhone 12 Pro</option>
                <option value="iPhone 12">iPhone 12</option>
                <option value="iPhone SE">iPhone SE</option>
                <option value="iPad Pro">iPad Pro</option>
                <option value="iPad">iPad</option>
                <option value="Galaxy S20">Galaxy S20</option>
                <option value="Pixel 5">Pixel 5</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">
                {isRotated ? `${deviceConfig.height} × ${deviceConfig.width}` : `${deviceConfig.width} × ${deviceConfig.height}`}
              </span>
              
              {deviceConfig.frame && (
                <button
                  onClick={() => setIsRotated(!isRotated)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                  title="Rotate device"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Additional Controls */}
        <div className="px-4 py-2 flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center space-x-4">
            <span>DPR: 1</span>
            <span>Throttling: No throttling</span>
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-2 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors">
              More options
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
