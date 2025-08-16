const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://sxtmrdchzcxtknokyrjz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4dG1yZGNoemN4dGtub2t5cmp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwMjc5NjgsImV4cCI6MjA3MDYwMzk2OH0.hyJgzWaYSOJj5kLn_K0G8P_6_W1wTxdvOOPq1P6lu9w';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTemplates() {
  console.log('🔍 Checking templates in database...\n');
  
  const { data, error } = await supabase.from('templates').select('*');
  
  if (error) {
    console.error('❌ Error fetching templates:', error);
    return;
  }
  
  if (!data || data.length === 0) {
    console.log('⚠️ No templates found in database');
    return;
  }
  
  console.log(`✅ Found ${data.length} template(s):\n`);
  
  data.forEach((template, index) => {
    console.log(`${index + 1}. Template:`);
    console.log(`   ID: ${template.id}`);
    console.log(`   Name: ${template.name}`);
    console.log(`   Slug: ${template.slug}`);
    console.log(`   Description: ${template.description}`);
    console.log(`   Has default_data: ${template.default_data ? 'Yes' : 'No'}`);
    console.log('');
  });
}

checkTemplates().catch(console.error);
