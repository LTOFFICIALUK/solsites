import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// =====================================================
// UNIFIED BLOCK-BASED PROJECT SERVICES
// =====================================================

export interface ProjectBlock {
  id?: string;
  name: string;
  type: string;
  content: Record<string, any>;
  order_index: number;
  is_enabled: boolean;
}

export interface ProjectData {
  id?: string;
  name: string;
  slug: string;
  template_id: string;
  is_published: boolean;
  blocks: ProjectBlock[];
}

// =====================================================
// PROJECT CREATION - UNIFIED PIPELINE
// =====================================================

export const createProjectFromTemplate = async (
  userId: string,
  name: string,
  slug: string,
  templateSlug: string
): Promise<string> => {
  try {
    // Use the unified database function to create project and blocks
    const { data, error } = await supabase.rpc('create_project_from_template', {
      p_user_id: userId,
      p_project_name: name,
      p_project_slug: slug,
      p_template_slug: templateSlug
    });

    if (error) {
      console.error('Error creating project:', error);
      throw new Error(`Failed to create project: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error in createProjectFromTemplate:', error);
    throw error;
  }
};

// =====================================================
// PROJECT LOADING - UNIFIED PIPELINE
// =====================================================

export const loadProjectData = async (projectId: string): Promise<ProjectData> => {
  try {
    // Use the unified database function to get all project data
    const { data, error } = await supabase.rpc('get_project_data', {
      p_project_id: projectId
    });

    if (error) {
      console.error('Error loading project:', error);
      throw new Error(`Failed to load project: ${error.message}`);
    }

    if (!data) {
      throw new Error('Project not found');
    }

    // Transform the database response to our interface
    const projectData: ProjectData = {
      id: data.project.id,
      name: data.project.name,
      slug: data.project.slug,
      template_id: data.project.template_id,
      is_published: data.project.is_published,
      blocks: data.blocks || []
    };

    return projectData;
  } catch (error) {
    console.error('Error in loadProjectData:', error);
    throw error;
  }
};

// =====================================================
// BLOCK OPERATIONS - UNIFIED PIPELINE
// =====================================================

export const updateBlockContent = async (
  blockId: string,
  content: Record<string, any>
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('user_project_blocks')
      .update({ content })
      .eq('id', blockId);

    if (error) {
      console.error('Error updating block:', error);
      throw new Error(`Failed to update block: ${error.message}`);
    }
  } catch (error) {
    console.error('Error in updateBlockContent:', error);
    throw error;
  }
};

export const updateBlockSettings = async (
  blockId: string,
  settings: Record<string, any>
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('user_project_blocks')
      .update({ content: settings })
      .eq('id', blockId);

    if (error) {
      console.error('Error updating block settings:', error);
      throw new Error(`Failed to update block settings: ${error.message}`);
    }
  } catch (error) {
    console.error('Error in updateBlockSettings:', error);
    throw error;
  }
};

export const toggleBlockEnabled = async (
  blockId: string,
  isEnabled: boolean
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('user_project_blocks')
      .update({ is_enabled: isEnabled })
      .eq('id', blockId);

    if (error) {
      console.error('Error toggling block:', error);
      throw new Error(`Failed to toggle block: ${error.message}`);
    }
  } catch (error) {
    console.error('Error in toggleBlockEnabled:', error);
    throw error;
  }
};

export const reorderBlocks = async (
  projectId: string,
  blockOrders: { id: string; order_index: number }[]
): Promise<void> => {
  try {
    // Update each block's order index
    for (const blockOrder of blockOrders) {
      const { error } = await supabase
        .from('user_project_blocks')
        .update({ order_index: blockOrder.order_index })
        .eq('id', blockOrder.id)
        .eq('project_id', projectId);

      if (error) {
        console.error('Error reordering block:', error);
        throw new Error(`Failed to reorder block: ${error.message}`);
      }
    }
  } catch (error) {
    console.error('Error in reorderBlocks:', error);
    throw error;
  }
};

// =====================================================
// PROJECT MANAGEMENT - UNIFIED PIPELINE
// =====================================================

export const updateProjectMetadata = async (
  projectId: string,
  updates: Partial<Pick<ProjectData, 'name' | 'slug' | 'is_published'>>
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('user_projects')
      .update(updates)
      .eq('id', projectId);

    if (error) {
      console.error('Error updating project:', error);
      throw new Error(`Failed to update project: ${error.message}`);
    }
  } catch (error) {
    console.error('Error in updateProjectMetadata:', error);
    throw error;
  }
};

export const deleteProject = async (projectId: string): Promise<void> => {
  try {
    // This will cascade delete all blocks due to foreign key constraints
    const { error } = await supabase
      .from('user_projects')
      .delete()
      .eq('id', projectId);

    if (error) {
      console.error('Error deleting project:', error);
      throw new Error(`Failed to delete project: ${error.message}`);
    }
  } catch (error) {
    console.error('Error in deleteProject:', error);
    throw error;
  }
};

// =====================================================
// TEMPLATE OPERATIONS
// =====================================================

export const getTemplates = async () => {
  try {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching templates:', error);
      throw new Error(`Failed to fetch templates: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error in getTemplates:', error);
    throw error;
  }
};

export const getTemplateBySlug = async (slug: string) => {
  try {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Error fetching template:', error);
      throw new Error(`Failed to fetch template: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error in getTemplateBySlug:', error);
    throw error;
  }
};

// =====================================================
// USER PROJECTS LISTING
// =====================================================

export const getUserProjects = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_projects')
      .select(`
        id,
        name,
        slug,
        template_id,
        is_published,
        created_at,
        updated_at,
        templates (
          name,
          slug,
          colors
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user projects:', error);
      throw new Error(`Failed to fetch user projects: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error in getUserProjects:', error);
    throw error;
  }
};

// =====================================================
// PUBLISHED PROJECT ACCESS (for previews)
// =====================================================

export const getPublishedProject = async (slug: string): Promise<ProjectData | null> => {
  try {
    // First get the project ID
    const { data: project, error: projectError } = await supabase
      .from('user_projects')
      .select('id')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    if (projectError || !project) {
      return null;
    }

    // Then load the full project data
    return await loadProjectData(project.id);
  } catch (error) {
    console.error('Error in getPublishedProject:', error);
    return null;
  }
};

// =====================================================
// ANALYTICS (keeping existing structure)
// =====================================================

export const trackPageView = async (projectId: string, visitorData: any) => {
  try {
    const { error } = await supabase
      .from('page_views')
      .insert({
        project_id: projectId,
        visitor_id: visitorData.visitorId,
        page_url: visitorData.pageUrl,
        referrer: visitorData.referrer,
        user_agent: visitorData.userAgent,
        ip_address: visitorData.ipAddress
      });

    if (error) {
      console.error('Error tracking page view:', error);
    }
  } catch (error) {
    console.error('Error in trackPageView:', error);
  }
};

export const getProjectAnalytics = async (projectId: string) => {
  try {
    const { data, error } = await supabase
      .from('page_views')
      .select('*')
      .eq('project_id', projectId)
      .order('viewed_at', { ascending: false });

    if (error) {
      console.error('Error fetching analytics:', error);
      throw new Error(`Failed to fetch analytics: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error in getProjectAnalytics:', error);
    throw error;
  }
};
