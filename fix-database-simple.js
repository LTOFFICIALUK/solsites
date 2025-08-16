const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://sxtmrdchzcxtknokyrjz.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4dG1yZGNoemN4dGtub2t5cmp6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDY5NzI5MCwiZXhwIjoyMDUwMjc0ODkwfQ.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixDatabase() {
  try {
    console.log('Fixing get_project_data function...');
    
    // Try to execute the SQL using the REST API
    const { data, error } = await supabase
      .from('user_project_blocks')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error testing connection:', error);
      return;
    }
    
    console.log('Connection successful. Now trying to fix the function...');
    
    // Since we can't execute DDL through the REST API, let's try a different approach
    // Let's check what columns actually exist in the user_project_blocks table
    console.log('Checking table structure...');
    
    // Try to select all columns to see what's available
    const { data: columns, error: columnError } = await supabase
      .from('user_project_blocks')
      .select('*')
      .limit(1);
    
    if (columnError) {
      console.error('Error checking columns:', columnError);
    } else {
      console.log('Available columns:', Object.keys(columns[0] || {}));
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

fixDatabase();
