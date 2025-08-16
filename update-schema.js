const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://sxtmrdchzcxtknokyrjz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4dG1yZGNoemN4dGtub2t5cmp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwMjc5NjgsImV4cCI6MjA3MDYwMzk2OH0.hyJgzWaYSOJj5kLn_K0G8P_6_W1wTxdvOOPq1P6lu9w';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateSchema() {
  console.log('🔄 Starting schema update...');

  try {
    // First, let's check the current table structure
    console.log('📋 Checking current templates...');
    const { data: currentTemplates, error: fetchError } = await supabase
      .from('templates')
      .select('*');

    if (fetchError) {
      console.error('❌ Error fetching templates:', fetchError);
      return;
    }

    console.log('📊 Current templates:', currentTemplates?.length || 0);

    // Delete all existing templates
    console.log('🗑️ Deleting existing templates...');
    const { error: deleteError } = await supabase
      .from('templates')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deleteError) {
      console.error('❌ Error deleting templates:', deleteError);
      return;
    }

    console.log('✅ Templates deleted successfully');

    // Add the new Memecoin template with proper UUID
    console.log('➕ Adding new Memecoin template...');
    
    const memecoinTemplate = {
      id: '550e8400-e29b-41d4-a716-446655440000', // Proper UUID format
      name: 'Memecoin',
      slug: 'memecoin',
      description: 'High-energy, viral design perfect for explosive meme coins. Features bold gradients, dynamic animations, and social media optimized content.',
      colors: {
        primary: '#FF6B35',
        secondary: '#E55A2B',
        accent: '#FFD700',
        background: '#0A0A0A',
        text: '#FFFFFF',
        gradient: {
          from: '#FF6B35',
          to: '#E55A2B'
        }
      }
    };

    const { data: insertData, error: insertError } = await supabase
      .from('templates')
      .insert([memecoinTemplate]);

    if (insertError) {
      console.error('❌ Error inserting template:', insertError);
      return;
    }

    console.log('✅ Memecoin template added successfully');

    // Verify the template was added
    console.log('🔍 Verifying template...');
    const { data: verifyData, error: verifyError } = await supabase
      .from('templates')
      .select('*')
      .eq('slug', 'memecoin');

    if (verifyError) {
      console.error('❌ Error verifying template:', verifyError);
      return;
    }

    console.log('✅ Template verification successful');
    console.log('📋 Template data:', JSON.stringify(verifyData[0], null, 2));

    console.log('🎉 Schema update completed successfully!');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

updateSchema();
