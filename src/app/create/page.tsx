'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createProjectFromTemplate, getTemplates } from '@/lib/services';

const CreatePage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [projectName, setProjectName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [templates, setTemplates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const data = await getTemplates();
        setTemplates(data);
        
        // Check if template is specified in URL
        const templateSlug = searchParams.get('template');
        console.log('URL template slug:', templateSlug);
        console.log('Available templates:', data.map(t => ({ id: t.id, slug: t.slug, name: t.name })));
        
        if (templateSlug && data.find(t => t.slug === templateSlug)) {
          setSelectedTemplate(templateSlug);
        } else if (data.length > 0) {
          setSelectedTemplate(data[0].slug);
        }
      } catch (error) {
        console.error('Error loading templates:', error);
        setError('Failed to load templates');
      }
    };

    loadTemplates();
  }, [searchParams]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to create a project');
      return;
    }

    if (!projectName.trim()) {
      setError('Project name is required');
      return;
    }

    if (!selectedTemplate) {
      setError('Please select a template');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Generate a unique slug
      const baseSlug = projectName.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const slug = `${baseSlug}-${Date.now()}`;

      // Create project using the new unified function
      const projectId = await createProjectFromTemplate(
        user.id,
        projectName,
        slug,
        selectedTemplate
      );

      console.log('Project created successfully:', projectId);

      // Redirect to editor
      router.push(`/edit/${projectId}`);
    } catch (error) {
      console.error('Error creating project:', error);
      setError('Failed to create project. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Create New Project</h1>
          <p className="text-gray-600 mb-4">You must be logged in to create a project.</p>
          <button
            onClick={() => router.push('/login')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Create New Project</h1>
          <p className="text-lg text-gray-600">
            Choose a template and start building your website
          </p>
        </div>

        <form onSubmit={handleCreateProject} className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Project Name */}
            <div className="mb-6">
              <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-2">
                Project Name
              </label>
              <input
                type="text"
                id="projectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter your project name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Template Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Choose a Template
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedTemplate === template.slug
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedTemplate(template.slug)}
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">
                          {template.name.charAt(0)}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
                      <p className="text-sm text-gray-600">{template.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Creating Project...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePage;
