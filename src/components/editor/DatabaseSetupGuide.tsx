"use client"

interface DatabaseSetupGuideProps {
  error?: string
}

export function DatabaseSetupGuide({ error }: DatabaseSetupGuideProps) {
  if (!error) return null

  const isSchemaError = error.includes('does not exist') || error.includes('schema')

  if (!isSchemaError) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl mx-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Database Setup Required</h2>
          <p className="text-gray-600">The database schema needs to be applied before using the template editor.</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Step 1: Set up Supabase Environment Variables</h3>
          <p className="text-sm text-gray-700 mb-3">Create a <code className="bg-gray-200 px-1 rounded">.env.local</code> file in the <code className="bg-gray-200 px-1 rounded">sol-sites</code> directory:</p>
          <pre className="bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto">
{`# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000`}
          </pre>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Step 2: Apply Database Schema</h3>
          <p className="text-sm text-gray-700 mb-3">Go to your Supabase dashboard and run the schema:</p>
          <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
            <li>Go to <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Supabase Dashboard</a></li>
            <li>Select your project</li>
            <li>Go to <strong>SQL Editor</strong></li>
            <li>Copy the contents of <code className="bg-gray-200 px-1 rounded">supabase-schema.sql</code></li>
            <li>Paste and run the SQL</li>
          </ol>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Step 3: Restart Development Server</h3>
          <p className="text-sm text-gray-700 mb-3">After setting up the environment variables:</p>
          <pre className="bg-gray-800 text-green-400 p-3 rounded text-sm">
{`cd sol-sites
npm run dev`}
          </pre>
        </div>

        <div className="text-center">
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reload Page
          </button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Error: {error}
          </p>
        </div>
      </div>
    </div>
  )
}


