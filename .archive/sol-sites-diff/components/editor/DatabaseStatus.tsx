"use client"

import { useState, useEffect } from 'react'

interface DatabaseStatusProps {
  error?: string
}

export function DatabaseStatus({ error }: DatabaseStatusProps) {
  const [envStatus, setEnvStatus] = useState<'checking' | 'ok' | 'missing'>('checking')

  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (supabaseUrl && supabaseKey) {
      setEnvStatus('ok')
    } else {
      setEnvStatus('missing')
    }
  }, [])

  if (!error) return null

  const isSchemaError = error.includes('does not exist') || error.includes('schema')
  const isAuthError = error.includes('Authentication failed') || error.includes('credentials')

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isAuthError ? 'Database Connection Issue' : 'Database Setup Required'}
          </h2>
          <p className="text-gray-600">
            {isAuthError 
              ? 'Your Supabase credentials are not configured correctly.'
              : 'The database schema needs to be applied before using the template editor.'
            }
          </p>
        </div>

        {/* Environment Variables Status */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <span className={`w-3 h-3 rounded-full mr-2 ${
              envStatus === 'ok' ? 'bg-green-500' : 
              envStatus === 'missing' ? 'bg-red-500' : 'bg-yellow-500'
            }`}></span>
            Environment Variables Status
          </h3>
          
          {envStatus === 'missing' && (
            <div className="text-red-600 text-sm mb-3">
              ❌ Environment variables are missing. Please create a .env.local file.
            </div>
          )}
          
          {envStatus === 'ok' && (
            <div className="text-green-600 text-sm mb-3">
              ✅ Environment variables are configured.
            </div>
          )}

          <div className="text-sm text-gray-700">
            <p className="mb-2">Create a <code className="bg-gray-200 px-1 rounded">.env.local</code> file in the <code className="bg-gray-200 px-1 rounded">sol-sites</code> directory:</p>
            <pre className="bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto">
{`# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000`}
            </pre>
          </div>
        </div>

        {/* Database Schema Setup */}
        {isSchemaError && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Database Schema Setup</h3>
            <div className="text-sm text-gray-700 space-y-3">
              <p>1. Go to your <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">Supabase Dashboard</a></p>
              <p>2. Select your project</p>
              <p>3. Go to <strong>SQL Editor</strong> in the left sidebar</p>
              <p>4. Copy the contents of <code className="bg-gray-200 px-1 rounded">sol-sites/quick-setup.sql</code></p>
              <p>5. Paste and run the SQL</p>
            </div>
            
            <div className="mt-4">
              <button
                onClick={() => {
                  // Copy the quick-setup.sql content to clipboard
                  navigator.clipboard.writeText(`-- Quick Setup SQL for Template Editor
-- Run this in your Supabase SQL Editor to create the essential tables

-- Create templates table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  colors JSONB NOT NULL DEFAULT '{"primary": "#3B82F6", "secondary": "#1E40AF", "accent": "#F59E0B"}',
  thumbnail TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create template_sections table
CREATE TABLE IF NOT EXISTS public.template_sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID REFERENCES public.templates(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_enabled BOOLEAN DEFAULT TRUE,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create section_blocks table
CREATE TABLE IF NOT EXISTS public.section_blocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_id UUID REFERENCES public.template_sections(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_enabled BOOLEAN DEFAULT TRUE,
  settings JSONB DEFAULT '{}',
  content JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.section_blocks ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY IF NOT EXISTS "Anyone can view templates" ON public.templates FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Anyone can view template sections" ON public.template_sections FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Anyone can view section blocks" ON public.section_blocks FOR SELECT USING (true);

-- Insert default templates
INSERT INTO public.templates (name, slug, description, colors) VALUES
('Neon', 'neon', 'A vibrant, neon-themed template', '{"primary": "#00ff88", "secondary": "#ff0080", "accent": "#ffff00"}'),
('Classic', 'classic', 'A clean, professional template', '{"primary": "#3B82F6", "secondary": "#1E40AF", "accent": "#F59E0B"}'),
('Minimal', 'minimal', 'A minimalist template', '{"primary": "#000000", "secondary": "#666666", "accent": "#ff6b6b"}')
ON CONFLICT (slug) DO NOTHING;`)
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
              >
                📋 Copy SQL to Clipboard
              </button>
            </div>
          </div>
        )}

        {/* Restart Instructions */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">After Setup</h3>
          <div className="text-sm text-gray-700">
            <p className="mb-2">Restart your development server:</p>
            <pre className="bg-gray-800 text-green-400 p-3 rounded text-sm">
{`cd sol-sites
npm run dev`}
            </pre>
          </div>
        </div>

        <div className="text-center space-x-4">
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            🔄 Reload Page
          </button>
          
          <button
            onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            🚀 Open Supabase Dashboard
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



