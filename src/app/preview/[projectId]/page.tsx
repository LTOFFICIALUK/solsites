'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { loadProjectData, ProjectData, ProjectBlock } from '@/lib/services';

const ProjectPreview: React.FC = () => {
  const params = useParams();
  const projectId = params.projectId as string;
  
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProject = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const data = await loadProjectData(projectId);
        setProjectData(data);
        
        console.log('Preview loaded project data:', data);
      } catch (error) {
        console.error('Error loading project for preview:', error);
        setError('Failed to load project');
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) {
      loadProject();
    }
  }, [projectId]);

  const renderBlock = (block: ProjectBlock) => {
    if (!block.is_enabled) return null;

    switch (block.type) {
      case 'navbar':
        return (
          <nav key={block.id} className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex-shrink-0">
                  <h1 className="text-xl font-bold text-gray-900">
                    {block.content.logo || 'Logo'}
                  </h1>
                </div>
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    {(block.content.navItems || []).map((item: any, index: number) => (
                      <a
                        key={index}
                        href={item.href}
                        className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        {item.text}
                      </a>
                    ))}
                  </div>
                </div>
                {block.content.cta && (
                  <div className="hidden md:block">
                    <a
                      href={block.content.cta.href}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      {block.content.cta.text}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </nav>
        );

      case 'hero':
        return (
          <section key={block.id} className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white">
            {block.content.image && (
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-20"
                style={{ backgroundImage: `url(${block.content.image})` }}
              />
            )}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
              <div className="text-center">
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  {block.content.title || 'Welcome'}
                </h1>
                <p className="text-xl md:text-2xl mb-6 text-blue-100">
                  {block.content.subtitle || 'Subtitle'}
                </p>
                <p className="text-lg mb-8 text-blue-200 max-w-3xl mx-auto">
                  {block.content.description || 'Description'}
                </p>
                {block.content.cta && (
                  <a
                    href={block.content.cta.href}
                    className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    {block.content.cta.text}
                  </a>
                )}
              </div>
            </div>
          </section>
        );

      case 'about':
        return (
          <section key={block.id} className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {block.content.title || 'About Us'}
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  {block.content.description || 'About description'}
                </p>
              </div>
              
              {(block.content.features || []).length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {(block.content.features || []).map((feature: any, index: number) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                      <div className="border-l-4 border-blue-500 pl-4">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        );

      case 'footer':
        return (
          <footer key={block.id} className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                  <p className="text-gray-400">
                    {block.content.copyright || '© 2024 All rights reserved'}
                  </p>
                </div>
                {block.content.social && (
                  <div className="flex space-x-6">
                    {Object.entries(block.content.social).map(([platform, url]) => (
                      <a
                        key={platform}
                        href={url as string}
                        className="text-gray-400 hover:text-white transition-colors capitalize"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {platform}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </footer>
        );

      default:
        return (
          <div key={block.id} className="bg-gray-100 p-8 text-center">
            <p className="text-gray-600">Unknown block type: {block.type}</p>
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading preview...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
        </div>
    );
  }

  if (!projectData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Project not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Project Header */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              {projectData.name}
            </h1>
            <p className="text-sm text-gray-500">
              Preview Mode - Project ID: {projectData.id}
            </p>
          </div>
          <div className="text-sm text-gray-500">
            {projectData.is_published ? 'Published' : 'Draft'}
          </div>
        </div>
      </div>

      {/* Project Content */}
      <div className="w-full">
        {projectData.blocks
          .filter(block => block.is_enabled)
          .map(block => renderBlock(block))}
      </div>

      {/* Debug Info (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded-lg text-xs max-w-sm">
          <div className="font-semibold mb-2">Debug Info:</div>
          <div>Project: {projectData.name}</div>
          <div>Blocks: {projectData.blocks.length}</div>
          <div>Enabled: {projectData.blocks.filter(b => b.is_enabled).length}</div>
        </div>
      )}
    </div>
  );
};

export default ProjectPreview;
