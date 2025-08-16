"use client"

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  loadProjectData, 
  updateBlockContent, 
  updateBlockSettings, 
  toggleBlockEnabled,
  reorderBlocks,
  ProjectData,
  ProjectBlock 
} from '@/lib/services';
import { supabase } from '@/lib/services';
import { useAuth } from '@/contexts/AuthContext';
import BlockSettings from './BlockSettings';
import ComponentLibrary from './ComponentLibrary';
import DevicePreview from './DevicePreview';
import EditorToolbar from './EditorToolbar';
import EditorStatus from './EditorStatus';
import UserStatus from './UserStatus';
import { debounce } from 'lodash';
import { MemecoinTemplate } from '@/components/templates/memecoin/MemecoinTemplate';
import { getTemplateBySlug } from '@/data/templates';

interface TemplateEditorProps {
  projectId: string;
  onContentChange?: (projectData: ProjectData) => void;
}

const TemplateEditor: React.FC<TemplateEditorProps> = ({ 
  projectId, 
  onContentChange 
}) => {
  const { user } = useAuth();
  const router = useRouter();
  
  // =====================================================
  // STATE MANAGEMENT - UNIFIED BLOCK SYSTEM
  // =====================================================
  
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [blocks, setBlocks] = useState<ProjectBlock[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<ProjectBlock | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [previewKey, setPreviewKey] = useState(0); // Force preview re-render

  // =====================================================
  // DEBOUNCED SAVE FUNCTIONS
  // =====================================================

  const debouncedBlockUpdate = useMemo(
    () => debounce(async (blockId: string, content: Record<string, any>) => {
      try {
        setIsSaving(true);
        await updateBlockContent(blockId, content);
        console.log('Block saved successfully:', blockId);
      } catch (error) {
        console.error('Error saving block:', error);
        setError('Failed to save changes');
      } finally {
        setIsSaving(false);
      }
    }, 1000),
    []
  );

  const debouncedSettingsUpdate = useMemo(
    () => debounce(async (blockId: string, settings: Record<string, any>) => {
      try {
        setIsSaving(true);
        await updateBlockSettings(blockId, settings);
        console.log('Block settings saved successfully:', blockId);
      } catch (error) {
        console.error('Error saving block settings:', error);
        setError('Failed to save settings');
      } finally {
        setIsSaving(false);
      }
    }, 1000),
    []
  );

  // =====================================================
  // PROJECT LOADING - UNIFIED PIPELINE
  // =====================================================

  const loadProject = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await loadProjectData(projectId);
      setProjectData(data);
      setBlocks(data.blocks || []);
      
      // Select first block by default
      if (data.blocks && data.blocks.length > 0) {
        setSelectedBlock(data.blocks[0]);
      }
      
      console.log('Project loaded successfully:', data);
      console.log('Blocks found:', data.blocks?.length || 0);
      if (data.blocks) {
        data.blocks.forEach((block, index) => {
          console.log(`Block ${index}:`, {
            id: block.id,
            name: block.name,
            type: block.type,
            content: block.content
          });
        });
      }
    } catch (error) {
      console.error('Error loading project:', error);
      setError('Failed to load project');
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (projectId) {
      loadProject();
    }
  }, [projectId, loadProject]);

  // =====================================================
  // BLOCK OPERATIONS - UNIFIED PIPELINE
  // =====================================================

  const handleBlockContentUpdate = useCallback((blockId: string, content: Record<string, any>) => {
    // Find the actual block to get its UUID
    const block = blocks.find(b => b.id === blockId || b.name === blockId);
    if (!block || !block.id) {
      console.error('Block not found or missing UUID:', blockId);
      return;
    }

    // Update local state immediately
    setBlocks(prevBlocks => 
      prevBlocks.map(b => 
        b.id === block.id 
          ? { ...b, content: { ...b.content, ...content } }
          : b
      )
    );

    // Update selected block if it's the one being edited
    if (selectedBlock?.id === block.id) {
      setSelectedBlock(prev => prev ? { ...prev, content: { ...prev.content, ...content } } : null);
    }

    // Save to database (debounced) using the actual UUID
    debouncedBlockUpdate(block.id, content);

    // Notify parent component
    if (onContentChange && projectData) {
      const updatedProjectData = {
        ...projectData,
        blocks: blocks.map(b => 
          b.id === block.id 
            ? { ...b, content: { ...b.content, ...content } }
            : b
        )
      };
      onContentChange(updatedProjectData);
    }
  }, [blocks, selectedBlock, debouncedBlockUpdate, onContentChange, projectData]);

  const handleBlockSettingsUpdate = useCallback((blockId: string, settings: Record<string, any>) => {
    // Find the actual block to get its UUID
    const block = blocks.find(b => b.id === blockId || b.name === blockId);
    if (!block || !block.id) {
      console.error('Block not found or missing UUID:', blockId);
      return;
    }

    // Update local state immediately
    setBlocks(prevBlocks => 
      prevBlocks.map(b => 
        b.id === block.id 
          ? { ...b, content: { ...b.content, ...settings } }
          : b
      )
    );

    // Update selected block if it's the one being edited
    if (selectedBlock?.id === block.id) {
      setSelectedBlock(prev => prev ? { ...prev, content: { ...prev.content, ...settings } } : null);
    }

    // Save to database (debounced) using the actual UUID
    debouncedSettingsUpdate(block.id, settings);

    // Notify parent component
    if (onContentChange && projectData) {
      const updatedProjectData = {
        ...projectData,
        blocks: blocks.map(b => 
          b.id === block.id 
            ? { ...b, content: { ...b.content, ...settings } }
            : b
        )
      };
      onContentChange(updatedProjectData);
    }
  }, [blocks, selectedBlock, debouncedSettingsUpdate, onContentChange, projectData]);

  const handleBlockToggle = useCallback(async (blockId: string, isEnabled: boolean) => {
    try {
      // Find the actual block to get its UUID
      const block = blocks.find(b => b.id === blockId || b.name === blockId);
      if (!block || !block.id) {
        console.error('Block not found or missing UUID:', blockId);
        return;
      }

      // Update local state immediately
      setBlocks(prevBlocks => 
        prevBlocks.map(b => 
          b.id === block.id 
            ? { ...b, is_enabled: isEnabled }
            : b
        )
      );

      // Update selected block if it's the one being toggled
      if (selectedBlock?.id === block.id) {
        setSelectedBlock(prev => prev ? { ...prev, is_enabled: isEnabled } : null);
      }

      // Save to database using the actual UUID
      await toggleBlockEnabled(block.id, isEnabled);

      // Notify parent component
      if (onContentChange && projectData) {
        const updatedProjectData = {
          ...projectData,
          blocks: blocks.map(b => 
            b.id === block.id 
              ? { ...b, is_enabled: isEnabled }
              : b
          )
        };
        onContentChange(updatedProjectData);
      }
    } catch (error) {
      console.error('Error toggling block:', error);
      setError('Failed to toggle block');
    }
  }, [blocks, selectedBlock, onContentChange, projectData]);

  const handleBlockReorder = useCallback(async (newOrder: ProjectBlock[]) => {
    try {
      // Update local state immediately
      setBlocks(newOrder);

      // Prepare order data for database
      const blockOrders = newOrder.map((block, index) => ({
        id: block.id!,
        order_index: index
      }));

      // Save to database
      await reorderBlocks(projectId, blockOrders);

      // Notify parent component
      if (onContentChange && projectData) {
        const updatedProjectData = {
          ...projectData,
          blocks: newOrder
        };
        onContentChange(updatedProjectData);
      }
    } catch (error) {
      console.error('Error reordering blocks:', error);
      setError('Failed to reorder blocks');
    }
  }, [projectId, onContentChange, projectData]);

  // =====================================================
  // BLOCK SELECTION
  // =====================================================

  const handleBlockSelect = useCallback((block: ProjectBlock) => {
    setSelectedBlock(block);
  }, []);

  // Force preview refresh
  const handleRefreshPreview = useCallback(() => {
    setPreviewKey(prev => prev + 1);
  }, []);

  // Open preview in new tab
  const handleOpenPreview = useCallback(async () => {
    try {
      // Generate a unique version ID for this preview
      const versionId = crypto.randomUUID().split('-')[0]; // Use first part of UUID for shorter version
      
      // Open production preview in new tab
      const previewUrl = `/preview/${projectId}/${versionId}`;
      window.open(previewUrl, '_blank');
      
      console.log('Opening preview:', previewUrl);
    } catch (error) {
      console.error('Error opening preview:', error);
      setError('Failed to open preview');
    }
  }, [projectId]);

  // =====================================================
  // RENDER FUNCTIONS
  // =====================================================

  // Transform project data to template format
  const transformToTemplateData = useCallback((projectData: ProjectData) => {
    if (!projectData || !blocks) return null;

    // Get template info
    const template = getTemplateBySlug('memecoin');
    if (!template) return null;

    // Transform blocks to template data structure
    const templateData: any = {
      tokenInfo: {
        name: "HappyMeal",
        symbol: "HAPPY",
        contractAddress: "0x1234567890abcdef1234567890abcdef12345678",
        description: "The viral crypto sensation taking Japanese Twitter by storm! 27M+ views in a single day!",
        totalSupply: "1,000,000,000",
        circulatingSupply: "800,000,000",
        price: "$0.0025",
        marketCap: "$2,000,000"
      },
      branding: {
        primaryColor: "#FF6B35",
        secondaryColor: "#E55A2B",
        accentColor: "#FFD700",
        logo: "🍔",
        banner: "/api/placeholder/1200/400",
        favicon: "🍔"
      },
      social: {
        twitter: "https://twitter.com/happymealtoken",
        telegram: "https://t.me/happymealtoken",
        discord: "https://discord.gg/happymealtoken",
        website: "https://happymealtoken.com"
      },
      header: {},
      content: {
        features: [
          {
            title: "Fair Launch",
            description: "Community-driven launch with equal opportunity for all investors.",
            icon: "⚖️",
            color: "#FF6B35"
          },
          {
            title: "Viral Momentum",
            description: "Riding the wave of the biggest Japanese social media trend.",
            icon: "🚀",
            color: "#E55A2B"
          },
          {
            title: "Solana Network",
            description: "Fast, low-cost transactions on the most efficient blockchain.",
            icon: "⚡",
            color: "#FFD700"
          },
          {
            title: "Meme Power",
            description: "Capturing the zeitgeist of Japanese internet culture with authentic viral content.",
            icon: "🎭",
            color: "#FF6B35"
          }
        ],
        roadmap: [
          {
            title: "Viral Launch",
            description: "Token launch coinciding with peak social media virality",
            date: "Q1 2024",
            completed: true,
            items: ["27M+ Twitter views", "Trending #1 in Japan", "Community building"]
          },
          {
            title: "Exchange Listings",
            description: "Major DEX and CEX listings to increase accessibility",
            date: "Q2 2024",
            completed: false,
            items: ["Raydium listing", "Jupiter integration", "CEX partnerships"]
          },
          {
            title: "NFT Collection",
            description: "Exclusive Happy Meal themed NFT collection for holders",
            date: "Q3 2024",
            completed: false,
            items: ["10,000 unique NFTs", "Holder benefits", "Rare toy variants"]
          },
          {
            title: "Global Expansion",
            description: "Taking the viral sensation worldwide",
            date: "Q4 2024",
            completed: false,
            items: ["International marketing", "Partnerships", "Ecosystem growth"]
          }
        ],
        team: [
          {
            name: "Anonymous",
            role: "Founder & Meme Lord",
            avatar: "🎭",
            social: "https://twitter.com/happymealfounder",
            bio: "The mysterious creator behind the viral sensation"
          },
          {
            name: "Community",
            role: "The Real Heroes",
            avatar: "👥",
            social: "https://twitter.com/happymealcommunity",
            bio: "27M+ strong community driving the viral movement"
          }
        ]
      }
    };

    // Map blocks to template data
    blocks.forEach(block => {
      switch (block.type) {
        case 'header':
          templateData.header = {
            displayName: block.content.displayName || "HappyMeal",
            colors: block.content.colors || { primary: "#FF6B35", secondary: "#E55A2B" },
            navItems: block.content.navigation || [],
            cta: block.content.cta || { text: 'Buy $HAPPY Now', href: '#', variant: 'primary' },
            logo: block.content.logo || "🍔"
          };
          break;
        case 'hero':
          templateData.content.hero = {
            title: block.content.title || "HappyMeal",
            subtitle: block.content.subtitle || "ハッピーセット",
            description: block.content.description || "The viral crypto sensation taking Japanese Twitter by storm! 27M+ views in a single day!",
            stats: block.content.stats || [],
            primaryButton: block.content.primaryButton || { text: "Buy $HAPPY Now", href: "#", variant: "primary" },
            secondaryButton: block.content.secondaryButton || { text: "Join Community", href: "#", variant: "secondary" },
            tokenSymbol: block.content.tokenSymbol || "HAPPY",
            showTokenPill: block.content.showTokenPill || true,
            showStats: block.content.showStats || true,
            showPrimaryButton: block.content.showPrimaryButton || true,
            showSecondaryButton: block.content.showSecondaryButton || true,
            showTokenVisual: block.content.showTokenVisual || true,

            backgroundImage: block.content.backgroundImage || "/api/placeholder/1920/1080"
          };
          break;
        case 'about':
          templateData.content.about = {
            title: block.content.title || "The Viral Story",
            description: block.content.description || "What started as a simple Happy Meal toy craze became Japan's biggest social media controversy.",
            content: block.content.content || "The viral story of how a simple McDonald's Happy Meal toy created a nationwide frenzy in Japan, leading to massive social media engagement and the birth of the most talked-about meme coin of 2024.",
            contractAddress: block.content.contractAddress || "0x1234567890abcdef1234567890abcdef12345678",
            ctaTitle: block.content.ctaTitle || "Are the toys really worth it?",
            ctaDescription: block.content.ctaDescription || "Original Price: ¥500 | Resale Price: ??? | 600% Markup! 🔥",
            ctaPrimary: block.content.ctaPrimary || { text: "View Chart", href: "#", variant: "primary" },
            ctaSecondary: block.content.ctaSecondary || { text: "See the Trend", href: "#", variant: "secondary" },
            features: block.content.features || []
          };
          break;
        case 'tokenomics':
          templateData.content.tokenomics = {
            title: block.content.title || "Tokenomics",
            description: block.content.description || "Fair and transparent token distribution designed for long-term success",
            totalSupply: block.content.totalSupply || "1,000,000,000 HAPPY",
            distribution: block.content.distribution || []
          };
          break;
        case 'roadmap':
          templateData.content.roadmap = Array.isArray(block.content.phases) ? block.content.phases : [
            {
              title: "Viral Launch",
              description: "Token launch coinciding with peak social media virality",
              date: "Q1 2024",
              completed: true,
              items: ["27M+ Twitter views", "Trending #1 in Japan", "Community building"]
            },
            {
              title: "Exchange Listings",
              description: "Major DEX and CEX listings to increase accessibility",
              date: "Q2 2024",
              completed: false,
              items: ["Raydium listing", "Jupiter integration", "CEX partnerships"]
            },
            {
              title: "NFT Collection",
              description: "Exclusive Happy Meal themed NFT collection for holders",
              date: "Q3 2024",
              completed: false,
              items: ["10,000 unique NFTs", "Holder benefits", "Rare toy variants"]
            },
            {
              title: "Global Expansion",
              description: "Taking the viral sensation worldwide",
              date: "Q4 2024",
              completed: false,
              items: ["International marketing", "Partnerships", "Ecosystem growth"]
            }
          ];
          break;
        case 'team':
          templateData.content.team = Array.isArray(block.content.members) ? block.content.members : [
            {
              name: "Anonymous",
              role: "Founder & Meme Lord",
              avatar: "🎭",
              social: "https://twitter.com/happymealfounder",
              bio: "The mysterious creator behind the viral sensation"
            },
            {
              name: "Community",
              role: "The Real Heroes",
              avatar: "👥",
              social: "https://twitter.com/happymealcommunity",
              bio: "27M+ strong community driving the viral movement"
            }
          ];
          break;
        case 'community':
          templateData.content.community = {
            title: block.content.title || "Join the Community",
            description: block.content.description || "Be part of the viral phenomenon that's taking Japan and the world by storm",
            cards: block.content.cards || []
          };
          break;
        case 'token-details':
          templateData.content.tokenDetails = {
            title: block.content.title || "Token Details",
            description: block.content.description || "Join the viral sensation that's taking crypto by storm.",
            contractAddress: block.content.contractAddress || "0x1234567890abcdef1234567890abcdef12345678",
            features: block.content.features || []
          };
          break;
      }
    });

    return { template, data: templateData };
  }, [blocks]);

  const renderBlock = useCallback((block: ProjectBlock) => {
    if (!block.is_enabled) return null;

    const isSelected = selectedBlock?.id === block.id;
    // Removed click handler - selection only through left menu

    switch (block.type) {
      case 'navbar':
        return (
          <div 
            key={block.id}
            className={`block-wrapper ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
          >
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div className="text-lg font-bold">{block.content.logo || 'Logo'}</div>
                <div className="flex space-x-4">
                  {(block.content.navItems || []).map((item: any, index: number) => (
                    <a key={index} href={item.href} className="text-gray-600 hover:text-gray-900">
                      {item.text}
                    </a>
                  ))}
                </div>
                {block.content.cta && (
                  <button className="bg-blue-500 text-white px-4 py-2 rounded">
                    {block.content.cta.text}
                  </button>
                )}
              </div>
            </div>
          </div>
        );

      case 'header':
        return (
          <div 
            key={block.id}
            className={`block-wrapper ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
          >
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div className="text-lg font-bold">{block.content.logo || 'Logo'}</div>
                <div className="flex space-x-4">
                  {(block.content.navigation || []).map((item: any, index: number) => (
                    <a key={index} href={item.href} className="text-gray-600 hover:text-gray-900">
                      {item.text}
                    </a>
                  ))}
                </div>
                {block.content.cta && (
                  <button className="bg-blue-500 text-white px-4 py-2 rounded">
                    {block.content.cta.text}
                  </button>
                )}
              </div>
            </div>
          </div>
        );

      case 'hero':
        return (
          <div 
            key={block.id}
            className={`block-wrapper ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
          >
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-lg">
              <h1 className="text-4xl font-bold mb-4">{block.content.title || 'Welcome'}</h1>
              <p className="text-xl mb-4">{block.content.subtitle || 'Subtitle'}</p>
              <p className="mb-6">{block.content.description || 'Description'}</p>
              {block.content.cta && (
                <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold">
                  {block.content.cta.text}
                </button>
              )}
            </div>
          </div>
        );

      case 'about':
        return (
          <div 
            key={block.id}
            className={`block-wrapper ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
          >
            <div className="bg-white p-8 rounded-lg shadow">
              <h2 className="text-3xl font-bold mb-4">{block.content.title || 'About Us'}</h2>
              <p className="text-gray-600 mb-6">{block.content.description || 'About description'}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.isArray(block.content.features) ? block.content.features.map((feature: any, index: number) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                )) : (
                  <div className="text-gray-500 text-center py-4">
                    <p>No about features found</p>
                    <p className="text-sm">Debug: {JSON.stringify(block.content.features)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'tokenomics':
        return (
          <div 
            key={block.id}
            className={`block-wrapper ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
          >
            <div className="bg-white p-8 rounded-lg shadow">
              <h2 className="text-3xl font-bold mb-4">{block.content.title || 'Tokenomics'}</h2>
              <p className="text-gray-600 mb-6">{block.content.description || 'Token distribution'}</p>
              <div className="text-2xl font-bold text-blue-600 mb-6">
                {block.content.totalSupply || '1,000,000,000'}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {Array.isArray(block.content.distribution) ? block.content.distribution.map((item: any, index: number) => (
                  <div key={index} className="text-center p-4 border rounded-lg">
                    <div 
                      className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: item.color || '#3B82F6' }}
                    >
                      {item.percentage}%
                    </div>
                    <h3 className="font-semibold">{item.name}</h3>
                    {item.description && (
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    )}
                  </div>
                )) : (
                  <div className="text-gray-500 text-center py-4">
                    <p>No tokenomics distribution found</p>
                    <p className="text-sm">Debug: {JSON.stringify(block.content.distribution)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'roadmap':
        return (
          <div 
            key={block.id}
            className={`block-wrapper ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
          >
            <div className="bg-white p-8 rounded-lg shadow">
              <h2 className="text-3xl font-bold mb-4">{block.content.title || 'Roadmap'}</h2>
              <p className="text-gray-600 mb-6">{block.content.description || 'Our journey'}</p>
              <div className="space-y-6">
                {Array.isArray(block.content.phases) ? block.content.phases.map((phase: any, index: number) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className={`w-4 h-4 rounded-full mt-2 ${phase.completed ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{phase.title}</h3>
                      <p className="text-gray-600 text-sm">{phase.description}</p>
                      <p className="text-blue-600 text-sm font-medium">{phase.date}</p>
                    </div>
                  </div>
                )) : (
                  <div className="text-gray-500 text-center py-4">
                    <p>No roadmap phases found</p>
                    <p className="text-sm">Debug: {JSON.stringify(block.content.phases)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'team':
        return (
          <div 
            key={block.id}
            className={`block-wrapper ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
          >
            <div className="bg-white p-8 rounded-lg shadow">
              <h2 className="text-3xl font-bold mb-4">{block.content.title || 'Our Team'}</h2>
              <p className="text-gray-600 mb-6">{block.content.description || 'Meet our team'}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.isArray(block.content.members) ? block.content.members.map((member: any, index: number) => (
                  <div key={index} className="text-center p-4 border rounded-lg">
                    <div className="text-4xl mb-2">{member.avatar || '👤'}</div>
                    <h3 className="font-semibold">{member.name}</h3>
                    <p className="text-gray-600 text-sm">{member.role}</p>
                    {member.bio && (
                      <p className="text-gray-500 text-xs mt-2">{member.bio}</p>
                    )}
                  </div>
                )) : (
                  <div className="text-gray-500 text-center py-4">
                    <p>No team members found</p>
                    <p className="text-sm">Debug: {JSON.stringify(block.content.members)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'community':
        return (
          <div 
            key={block.id}
            className={`block-wrapper ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
          >
            <div className="bg-white p-8 rounded-lg shadow">
              <h2 className="text-3xl font-bold mb-4">{block.content.title || 'Community'}</h2>
              <p className="text-gray-600 mb-6">{block.content.description || 'Join our community'}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Array.isArray(block.content.cards) ? block.content.cards.map((card: any, index: number) => (
                  <div key={index} className="text-center p-6 border rounded-lg">
                    <div className="text-3xl mb-3">{card.icon || '🌟'}</div>
                    <h3 className="font-semibold mb-2">{card.title}</h3>
                    <p className="text-gray-600 text-sm">{card.description}</p>
                    {card.link && (
                      <a href={card.link} className="text-blue-600 text-sm font-medium mt-2 inline-block">
                        Learn More →
                      </a>
                    )}
                  </div>
                )) : (
                  <div className="text-gray-500 text-center py-4">
                    <p>No community cards found</p>
                    <p className="text-sm">Debug: {JSON.stringify(block.content.cards)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'footer':
        return (
          <div 
            key={block.id}
            className={`block-wrapper ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
          >
            <div className="bg-gray-800 text-white p-6 rounded-lg">
              <div className="flex justify-between items-center">
                <div>{block.content.copyright || '© 2024 All rights reserved'}</div>
                <div className="flex space-x-4">
                  {block.content.social && Object.entries(block.content.social).map(([platform, url]) => (
                    <a key={platform} href={url as string} className="hover:text-blue-400">
                      {platform}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div 
            key={block.id}
            className={`block-wrapper ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
          >
            <div className="bg-gray-100 p-4 rounded-lg">
              <p>Unknown block type: {block.type}</p>
            </div>
          </div>
        );
    }
  }, [selectedBlock, handleBlockSelect]);

  // =====================================================
  // MAIN RENDER
  // =====================================================

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading project...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  if (!projectData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Project not found</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar - Component Library */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Components</h2>
        </div>
        <ComponentLibrary 
          blocks={blocks}
          onBlockSelect={handleBlockSelect}
          selectedBlock={selectedBlock}
        />
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold">{projectData.name}</h1>
              <EditorStatus isSaving={isSaving} />
            </div>
            <div className="flex items-center space-x-4">
              <EditorToolbar 
                previewMode={previewMode}
                onPreviewModeChange={setPreviewMode}
                onRefreshPreview={handleRefreshPreview}
                onOpenPreview={handleOpenPreview}
                isSaving={isSaving}
              />
              <UserStatus user={user} />
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex min-h-0">
          {/* Center - Preview Area */}
          <div className="flex-1 bg-gray-100 p-4 min-h-0">
            <div className="bg-white rounded-lg shadow-lg h-full flex flex-col">
              {projectData && (() => {
                const templateData = transformToTemplateData(projectData);
                if (templateData) {
                  return (
                    <div className="relative flex-1 overflow-auto">
                      {/* Template Preview */}
                      <MemecoinTemplate
                        key={previewKey} // Force re-render when previewKey changes
                        template={templateData.template}
                        data={templateData.data}
                        preview={true}
                        className="pointer-events-none"
                      />
                    </div>
                  );
                }
                return (
                  <div className="flex-1 overflow-auto">
                    <DevicePreview mode={previewMode}>
                      <div className="space-y-6">
                        {blocks
                          .filter(block => block.is_enabled)
                          .map(block => renderBlock(block))}
                      </div>
                    </DevicePreview>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Right Sidebar - Block Settings */}
          <div className="w-80 bg-white border-l border-gray-200 flex flex-col min-h-0">
            {selectedBlock ? (
              <BlockSettings
                block={selectedBlock}
                onContentUpdate={handleBlockContentUpdate}
                onSettingsUpdate={handleBlockSettingsUpdate}
                onToggleEnabled={handleBlockToggle}
              />
            ) : (
              <div className="p-4 text-gray-500 flex-1 flex items-center justify-center">
                Select a block to edit its settings
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateEditor;
