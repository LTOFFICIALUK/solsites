const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://sxtmrdchzcxtknokyrjz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4dG1yZGNoemN4dGtub2t5cmp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwMjc5NjgsImV4cCI6MjA3MDYwMzk2OH0.hyJgzWaYSOJj5kLn_K0G8P_6_W1wTxdvOOPq1P6lu9w';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function executeFix() {
  try {
    console.log('🔄 Executing database fix...');
    
    // Read the SQL file
    const fs = require('fs');
    const sql = fs.readFileSync('fix-function-overloading.sql', 'utf8');
    
    // Execute the SQL using RPC
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      console.error('❌ Error executing SQL:', error);
      return;
    }
    
    console.log('✅ Database fix executed successfully!');
    console.log('📝 Now try creating a new project from the Memecoin template');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

executeFix();
