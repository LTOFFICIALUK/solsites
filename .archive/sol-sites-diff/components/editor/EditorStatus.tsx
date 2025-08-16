"use client"

interface EditorStatusProps {
  isLoading: boolean
  isSaving: boolean
  sectionsCount: number
  selectedSection: string | null
  selectedBlock: string | null
  error?: string
}

export function EditorStatus({
  isLoading,
  isSaving,
  sectionsCount,
  selectedSection,
  selectedBlock,
  error
}: EditorStatusProps) {
  if (error) {
    return (
      <div className="fixed top-4 right-4 bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-lg shadow-lg z-50">
        <div className="flex items-center space-x-2">
          <span className="text-red-500">⚠️</span>
          <span className="text-sm font-medium">Error: {error}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed top-4 right-4 bg-blue-100 border border-blue-300 text-blue-700 px-4 py-2 rounded-lg shadow-lg z-50">
      <div className="flex items-center space-x-4 text-sm">
        {isLoading && (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span>Loading...</span>
          </div>
        )}
        
        {isSaving && (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
            <span>Saving...</span>
          </div>
        )}
        
        <div className="flex items-center space-x-2">
          <span>Sections: {sectionsCount}</span>
        </div>
        
        {selectedSection && (
          <div className="flex items-center space-x-2">
            <span>Section: {selectedSection.slice(0, 8)}...</span>
          </div>
        )}
        
        {selectedBlock && (
          <div className="flex items-center space-x-2">
            <span>Block: {selectedBlock.slice(0, 8)}...</span>
          </div>
        )}
      </div>
    </div>
  )
}



