#!/bin/bash

echo "🔧 Setting up database tables..."

# Check if we have the Supabase CLI installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Please install it first:"
    echo "   npm install -g supabase"
    echo ""
    echo "Or manually run the quick-setup.sql script in your Supabase SQL Editor"
    exit 1
fi

# Run the setup script
echo "📝 Running database setup..."
supabase db reset --linked

echo "✅ Database setup complete!"
echo "🔄 Restarting development server..."
echo ""
echo "Please refresh your browser and try again."
