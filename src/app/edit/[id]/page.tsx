'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import TemplateEditor from '@/components/editor/TemplateEditor';

const EditPage: React.FC = () => {
  const params = useParams();
  const projectId = params.id as string;

  return (
    <div className="h-screen">
      <TemplateEditor projectId={projectId} />
    </div>
  );
};

export default EditPage;
