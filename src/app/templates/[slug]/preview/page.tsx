import { getTemplateBySlug } from '@/data/templates'
import { MemecoinTemplate } from '@/components/templates/memecoin/MemecoinTemplate'
import { ArrowLeft, X } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface TemplatePreviewProps {
  params: Promise<{
    slug: string
  }>
}

export default async function TemplatePreviewPage({ params }: TemplatePreviewProps) {
  const { slug } = await params
  const template = getTemplateBySlug(slug)

  if (!template) {
    notFound()
  }

  const renderTemplate = () => {
    switch (template.id) {
      case 'memecoin': {
        return (
          <MemecoinTemplate 
            template={template}
            data={template.defaultData}
            preview={true}
          />
        )
      }
      default:
        return (
          <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">Template Not Found</h1>
              <p className="text-white/70">This template is not available yet.</p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Preview Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link 
              href={`/templates/${slug}`}
              className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Template</span>
            </Link>
            <div className="w-px h-6 bg-white/20"></div>
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: template.colors.primary }}
              ></div>
              <span className="font-medium text-white">{template.name} Template Preview</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-sm text-white/60">
              Live Preview Mode
            </div>
            <Link 
              href={`/templates/${slug}`}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </Link>
          </div>
        </div>
      </div>

      {/* Template Content */}
      <div className="pt-16 h-full overflow-auto">
        {renderTemplate()}
      </div>
    </div>
  )
}
