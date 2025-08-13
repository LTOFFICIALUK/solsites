# SOL Sites

A professional platform for creating stunning websites for Solana meme coins. Built with Next.js, TypeScript, and Tailwind CSS.

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Set up Supabase
1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL schema from `supabase-schema.sql` in your Supabase SQL editor
3. Get your project URL and anon key from the API settings

### 3. Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the Development Server
```bash
npm run dev
```

## 🚀 Features

- **Professional Templates**: Pre-designed templates specifically crafted for meme coins
- **Drag & Drop Editor**: Visual editing experience with real-time preview
- **Custom Domains**: Get your own `{projectName}.solsites.fun` domain
- **Crypto Payments**: Pay with SOL, USDC, and other cryptocurrencies
- **Social Integration**: Connect Twitter/X, Telegram, Discord, and more
- **No Server Required**: Static hosting with 99.9% uptime and global CDN

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI + Custom components
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Utilities**: class-variance-authority, clsx, tailwind-merge

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd sol-sites

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the landing page.

## 🏗️ Project Structure

```
sol-sites/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Landing page
│   │   └── layout.tsx        # Root layout
│   ├── components/
│   │   └── ui/               # Reusable UI components
│   │       ├── button.tsx
│   │       └── badge.tsx
│   └── lib/
│       └── utils.ts          # Utility functions
├── public/                   # Static assets
└── package.json
```

## 🎨 Design System

The project uses a consistent design system with:

- **Colors**: Purple and blue gradient theme
- **Typography**: Modern, clean fonts
- **Components**: Reusable UI components with variants
- **Responsive**: Mobile-first design approach

## 🚧 Next Steps

### Phase 1: Core Platform (Current)
- ✅ Professional landing page
- ✅ Design system and components
- ✅ Responsive layout

### Phase 2: Template System
- [ ] Create template library
- [ ] Template preview system
- [ ] Template customization interface

### Phase 3: Drag & Drop Editor
- [ ] Visual editor component
- [ ] Component library
- [ ] Real-time preview
- [ ] Text and image editing

### Phase 4: Payment Integration
- [ ] Solana wallet integration
- [ ] Payment processing
- [ ] Domain registration system

### Phase 5: Deployment & Hosting
- [ ] Static site generation
- [ ] Domain management
- [ ] CDN integration
- [ ] SSL certificates

## 🎯 Key Features to Implement

1. **Template Selection**: Browse and preview different templates
2. **Customization Panel**: Edit colors, text, images, and content
3. **Token Information**: Add token name, symbol, contract address
4. **Social Links**: Connect social media accounts
5. **Payment Flow**: Crypto payment processing
6. **Domain Management**: Custom subdomain creation
7. **Site Preview**: Real-time preview of changes
8. **Export & Deploy**: Generate and deploy static sites

## 🔧 Development

```bash
# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

**SOL Sites** - The ultimate platform for launching professional meme coin websites on Solana.
