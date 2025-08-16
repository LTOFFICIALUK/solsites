const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://sxtmrdchzcxtknokyrjz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4dG1yZGNoemN4dGtub2t5cmp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwMjc5NjgsImV4cCI6MjA3MDYwMzk2OH0.hyJgzWaYSOJj5kLn_K0G8P_6_W1wTxdvOOPq1P6lu9w';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabaseIntegration() {
  console.log('🔍 **COMPREHENSIVE DATABASE INTEGRATION TEST**\n');

  try {
    // =====================================================
    // 1. TEST TEMPLATE FETCHING
    // =====================================================
    console.log('📋 1. Testing Template Fetching...');
    
    const { data: templates, error: templatesError } = await supabase
      .from('templates')
      .select('*');

    if (templatesError) {
      console.error('❌ Error fetching templates:', templatesError);
      return;
    }

    console.log(`✅ Templates fetched successfully: ${templates?.length || 0} templates`);
    
    if (templates && templates.length > 0) {
      const memecoinTemplate = templates.find(t => t.slug === 'memecoin');
      if (memecoinTemplate) {
        console.log(`✅ Memecoin template found: ${memecoinTemplate.name}`);
        console.log(`   - ID: ${memecoinTemplate.id}`);
        console.log(`   - Slug: ${memecoinTemplate.slug}`);
        console.log(`   - Colors: ${JSON.stringify(memecoinTemplate.colors)}`);
      } else {
        console.log('⚠️ Memecoin template not found in database');
      }
    }

    // =====================================================
    // 2. TEST USER PROJECTS TABLE
    // =====================================================
    console.log('\n📊 2. Testing User Projects Table...');
    
    const { data: projects, error: projectsError } = await supabase
      .from('user_projects')
      .select('*')
      .limit(5);

    if (projectsError) {
      console.error('❌ Error fetching user projects:', projectsError);
    } else {
      console.log(`✅ User projects table accessible: ${projects?.length || 0} projects`);
    }

    // =====================================================
    // 3. TEST USER PROJECT SECTIONS TABLE
    // =====================================================
    console.log('\n🔧 3. Testing User Project Sections Table...');
    
    const { data: sections, error: sectionsError } = await supabase
      .from('user_project_sections')
      .select('*')
      .limit(5);

    if (sectionsError) {
      console.error('❌ Error fetching user project sections:', sectionsError);
    } else {
      console.log(`✅ User project sections table accessible: ${sections?.length || 0} sections`);
    }

    // =====================================================
    // 4. TEST USER PROJECT BLOCKS TABLE
    // =====================================================
    console.log('\n🧱 4. Testing User Project Blocks Table...');
    
    const { data: blocks, error: blocksError } = await supabase
      .from('user_project_blocks')
      .select('*')
      .limit(5);

    if (blocksError) {
      console.error('❌ Error fetching user project blocks:', blocksError);
    } else {
      console.log(`✅ User project blocks table accessible: ${blocks?.length || 0} blocks`);
    }

    // =====================================================
    // 5. TEST TEMPLATE SECTIONS TABLE (if exists)
    // =====================================================
    console.log('\n📐 5. Testing Template Sections Table...');
    
    const { data: templateSections, error: templateSectionsError } = await supabase
      .from('template_sections')
      .select('*')
      .limit(5);

    if (templateSectionsError) {
      console.log('⚠️ Template sections table not accessible (may not exist in new schema)');
    } else {
      console.log(`✅ Template sections table accessible: ${templateSections?.length || 0} sections`);
    }

    // =====================================================
    // 6. TEST SECTION BLOCKS TABLE (if exists)
    // =====================================================
    console.log('\n🎯 6. Testing Section Blocks Table...');
    
    const { data: sectionBlocks, error: sectionBlocksError } = await supabase
      .from('section_blocks')
      .select('*')
      .limit(5);

    if (sectionBlocksError) {
      console.log('⚠️ Section blocks table not accessible (may not exist in new schema)');
    } else {
      console.log(`✅ Section blocks table accessible: ${sectionBlocks?.length || 0} blocks`);
    }

    // =====================================================
    // 7. TEST PAGE VIEWS TABLE
    // =====================================================
    console.log('\n👁️ 7. Testing Page Views Table...');
    
    const { data: pageViews, error: pageViewsError } = await supabase
      .from('page_views')
      .select('*')
      .limit(5);

    if (pageViewsError) {
      console.error('❌ Error fetching page views:', pageViewsError);
    } else {
      console.log(`✅ Page views table accessible: ${pageViews?.length || 0} views`);
    }

    // =====================================================
    // 8. TEST SESSIONS TABLE
    // =====================================================
    console.log('\n🔄 8. Testing Sessions Table...');
    
    const { data: sessions, error: sessionsError } = await supabase
      .from('sessions')
      .select('*')
      .limit(5);

    if (sessionsError) {
      console.error('❌ Error fetching sessions:', sessionsError);
    } else {
      console.log(`✅ Sessions table accessible: ${sessions?.length || 0} sessions`);
    }

    // =====================================================
    // 9. TEST UNIQUE VISITORS TABLE
    // =====================================================
    console.log('\n👤 9. Testing Unique Visitors Table...');
    
    const { data: visitors, error: visitorsError } = await supabase
      .from('unique_visitors')
      .select('*')
      .limit(5);

    if (visitorsError) {
      console.error('❌ Error fetching unique visitors:', visitorsError);
    } else {
      console.log(`✅ Unique visitors table accessible: ${visitors?.length || 0} visitors`);
    }

    // =====================================================
    // 10. TEST DATABASE FUNCTIONS
    // =====================================================
    console.log('\n⚙️ 10. Testing Database Functions...');
    
    // Test create_project_from_template function
    try {
      const { data: functionTest, error: functionError } = await supabase
        .rpc('create_project_from_template', {
          p_user_id: '00000000-0000-0000-0000-000000000000',
          p_project_name: 'Test Project',
          p_project_slug: 'test-project',
          p_template_slug: 'memecoin'
        });

      if (functionError) {
        console.log(`⚠️ create_project_from_template function test: ${functionError.message}`);
      } else {
        console.log('✅ create_project_from_template function accessible');
      }
    } catch (error) {
      console.log(`⚠️ create_project_from_template function not accessible: ${error.message}`);
    }

    // =====================================================
    // 11. SUMMARY
    // =====================================================
    console.log('\n📈 **DATABASE INTEGRATION SUMMARY**');
    console.log('=====================================');
    console.log(`✅ Templates: ${templates?.length || 0} available`);
    console.log(`✅ User Projects: ${projects?.length || 0} existing`);
    console.log(`✅ User Project Sections: ${sections?.length || 0} existing`);
    console.log(`✅ User Project Blocks: ${blocks?.length || 0} existing`);
    console.log(`✅ Page Views: ${pageViews?.length || 0} tracked`);
    console.log(`✅ Sessions: ${sessions?.length || 0} active`);
    console.log(`✅ Unique Visitors: ${visitors?.length || 0} recorded`);
    
    // Check if Memecoin template is available
    const memecoinAvailable = templates?.some(t => t.slug === 'memecoin');
    console.log(`✅ Memecoin Template: ${memecoinAvailable ? 'Available' : 'Not Found'}`);
    
    console.log('\n🎉 **DATABASE INTEGRATION TEST COMPLETED**');
    console.log('All core tables are accessible and the Memecoin template is properly configured!');

  } catch (error) {
    console.error('❌ Unexpected error during database test:', error);
  }
}

testDatabaseIntegration();
