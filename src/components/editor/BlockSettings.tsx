'use client';

import React, { useState, useEffect } from 'react';
import { ProjectBlock } from '@/lib/services';
import ColorPicker from './ColorPicker';

interface BlockSettingsProps {
  block: ProjectBlock;
  onContentUpdate: (blockId: string, content: Record<string, any>) => void;
  onSettingsUpdate: (blockId: string, settings: Record<string, any>) => void;
  onToggleEnabled: (blockId: string, isEnabled: boolean) => void;
}

const BlockSettings: React.FC<BlockSettingsProps> = ({
  block,
  onContentUpdate,
  onSettingsUpdate,
  onToggleEnabled
}) => {
  const [localContent, setLocalContent] = useState(block.content);

  // Update local content when block changes
  useEffect(() => {
    setLocalContent(block.content);
  }, [block]);

  const handleContentChange = (key: string, value: any) => {
    const updatedContent = { ...localContent, [key]: value };
    setLocalContent(updatedContent);
    onContentUpdate(block.id!, updatedContent);
  };

  const handleArrayItemChange = (key: string, index: number, value: any) => {
    const array = [...(localContent[key] || [])];
    array[index] = value;
    handleContentChange(key, array);
  };

  const handleArrayItemAdd = (key: string, defaultItem: any) => {
    const array = [...(localContent[key] || []), defaultItem];
    handleContentChange(key, array);
  };

  const handleArrayItemRemove = (key: string, index: number) => {
    const array = [...(localContent[key] || [])];
    array.splice(index, 1);
    handleContentChange(key, array);
  };

  const renderField = (key: string, value: any, label: string, type: string = 'text') => {
    switch (type) {
      case 'text':
        return (
          <div key={key} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {label}
            </label>
            <input
              type="text"
              value={value || ''}
              onChange={(e) => handleContentChange(key, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        );

      case 'textarea':
        return (
          <div key={key} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {label}
            </label>
            <textarea
              value={value || ''}
              onChange={(e) => handleContentChange(key, e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        );

      case 'color':
        return (
          <div key={key} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {label}
            </label>
            <ColorPicker
              color={value || '#000000'}
              onChange={(color) => handleContentChange(key, color)}
            />
          </div>
        );

      case 'url':
        return (
          <div key={key} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {label}
            </label>
            <input
              type="url"
              value={value || ''}
              onChange={(e) => handleContentChange(key, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        );

      case 'boolean':
        return (
          <div key={key} className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={Boolean(value)}
                onChange={(e) => handleContentChange(key, e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">{label}</span>
            </label>
          </div>
        );

      default:
        return null;
    }
  };

  const renderNavItem = (item: any, index: number) => (
    <div key={index} className="border border-gray-200 rounded-md p-3 mb-2">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">Navigation Item {index + 1}</span>
        <button
          onClick={() => handleArrayItemRemove('navItems', index)}
          className="text-red-500 hover:text-red-700"
        >
          Remove
        </button>
      </div>
      <input
        type="text"
        value={item.text || ''}
        onChange={(e) => handleArrayItemChange('navItems', index, { ...item, text: e.target.value })}
        placeholder="Menu text"
        className="w-full px-2 py-1 border border-gray-300 rounded mb-2 text-gray-900 placeholder:text-gray-500"
      />
      <input
        type="text"
        value={item.href || ''}
        onChange={(e) => handleArrayItemChange('navItems', index, { ...item, href: e.target.value })}
        placeholder="Link URL"
        className="w-full px-2 py-1 border border-gray-300 rounded text-gray-900 placeholder:text-gray-500"
      />
    </div>
  );

  const renderFeature = (feature: any, index: number) => (
    <div key={index} className="border border-gray-200 rounded-md p-3 mb-2">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-900">Feature {index + 1}</span>
        <button
          onClick={() => handleArrayItemRemove('features', index)}
          className="text-red-500 hover:text-red-700"
        >
          Remove
        </button>
      </div>
      <input
        type="text"
        value={feature.title || ''}
        onChange={(e) => handleArrayItemChange('features', index, { ...feature, title: e.target.value })}
        placeholder="Feature title"
        className="w-full px-2 py-1 border border-gray-300 rounded mb-2 text-gray-900 placeholder:text-gray-500"
      />
      <textarea
        value={feature.description || ''}
        onChange={(e) => handleArrayItemChange('features', index, { ...feature, description: e.target.value })}
        placeholder="Feature description"
        rows={2}
        className="w-full px-2 py-1 border border-gray-300 rounded mb-2 text-gray-900 placeholder:text-gray-500"
      />
      <input
        type="text"
        value={feature.icon || ''}
        onChange={(e) => handleArrayItemChange('features', index, { ...feature, icon: e.target.value })}
        placeholder="Icon (emoji)"
        className="w-full px-2 py-1 border border-gray-300 rounded mb-2 text-gray-900 placeholder:text-gray-500"
      />
      <ColorPicker
        color={feature.color || '#FF6B35'}
        onChange={(color) => handleArrayItemChange('features', index, { ...feature, color })}
      />
    </div>
  );

  const renderSocialLink = (platform: string, url: string) => (
    <div key={platform} className="mb-2">
      <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
        {platform}
      </label>
      <input
        type="url"
        value={url || ''}
        onChange={(e) => handleContentChange('social', { ...localContent.social, [platform]: e.target.value })}
        placeholder={`${platform} URL`}
        className="w-full px-2 py-1 border border-gray-300 rounded text-gray-900 placeholder:text-gray-500"
      />
    </div>
  );

  const renderBlockSpecificSettings = () => {
    switch (block.type) {
      case 'navbar':
        return (
          <div className="space-y-4">
            {renderField('logo', localContent.logo, 'Logo Text', 'text')}
            {renderField('displayName', localContent.displayName, 'Display Name', 'text')}
            
            {/* Colors */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Colors
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Primary</label>
                  <ColorPicker
                    color={localContent.colors?.primary || '#FF6B35'}
                    onChange={(color) => handleContentChange('colors', { ...localContent.colors, primary: color })}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Secondary</label>
                  <ColorPicker
                    color={localContent.colors?.secondary || '#E55A2B'}
                    onChange={(color) => handleContentChange('colors', { ...localContent.colors, secondary: color })}
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Navigation Items
              </label>
              {(Array.isArray(localContent.navItems) ? localContent.navItems : []).map(renderNavItem)}
              <button
                onClick={() => handleArrayItemAdd('navItems', { text: 'New Item', href: '#' })}
                className="w-full px-3 py-2 border border-gray-300 border-dashed rounded-md text-gray-500 hover:text-gray-700 hover:border-gray-400"
              >
                + Add Navigation Item
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Call to Action
              </label>
              <input
                type="text"
                value={localContent.cta?.text || ''}
                onChange={(e) => handleContentChange('cta', { ...localContent.cta, text: e.target.value })}
                placeholder="Button text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2 text-gray-900 placeholder:text-gray-500"
              />
              <input
                type="text"
                value={localContent.cta?.href || ''}
                onChange={(e) => handleContentChange('cta', { ...localContent.cta, href: e.target.value })}
                placeholder="Button link"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder:text-gray-500"
              />
              <select
                value={localContent.cta?.variant || 'primary'}
                onChange={(e) => handleContentChange('cta', { ...localContent.cta, variant: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
              >
                <option value="primary">Primary Style</option>
                <option value="secondary">Secondary Style</option>
              </select>
            </div>
          </div>
        );

      case 'hero':
        return (
          <div className="space-y-4">
            {renderField('title', localContent.title, 'Title', 'text')}
            {renderField('subtitle', localContent.subtitle, 'Subtitle', 'text')}
            {renderField('description', localContent.description, 'Description', 'textarea')}
            {renderField('tokenSymbol', localContent.tokenSymbol, 'Token Symbol', 'text')}
            {renderField('backgroundImage', localContent.backgroundImage, 'Background Image URL', 'url')}
            
            {/* Primary Button */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Button
              </label>
              <input
                type="text"
                value={localContent.primaryButton?.text || ''}
                onChange={(e) => handleContentChange('primaryButton', { ...localContent.primaryButton, text: e.target.value })}
                placeholder="Button text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2 text-gray-900 placeholder:text-gray-500"
              />
              <input
                type="text"
                value={localContent.primaryButton?.href || ''}
                onChange={(e) => handleContentChange('primaryButton', { ...localContent.primaryButton, href: e.target.value })}
                placeholder="Button link"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder:text-gray-500"
              />
              <select
                value={localContent.primaryButton?.variant || 'primary'}
                onChange={(e) => handleContentChange('primaryButton', { ...localContent.primaryButton, variant: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
              >
                <option value="primary">Primary Style</option>
                <option value="secondary">Secondary Style</option>
              </select>
            </div>

            {/* Secondary Button */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Secondary Button
              </label>
              <input
                type="text"
                value={localContent.secondaryButton?.text || ''}
                onChange={(e) => handleContentChange('secondaryButton', { ...localContent.secondaryButton, text: e.target.value })}
                placeholder="Button text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2 text-gray-900 placeholder:text-gray-500"
              />
              <input
                type="text"
                value={localContent.secondaryButton?.href || ''}
                onChange={(e) => handleContentChange('secondaryButton', { ...localContent.secondaryButton, href: e.target.value })}
                placeholder="Button link"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder:text-gray-500"
              />
              <select
                value={localContent.secondaryButton?.variant || 'secondary'}
                onChange={(e) => handleContentChange('secondaryButton', { ...localContent.secondaryButton, variant: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
              >
                <option value="primary">Primary Style</option>
                <option value="secondary">Secondary Style</option>
              </select>
            </div>

            {/* Stats */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statistics
              </label>
              {(Array.isArray(localContent.stats) ? localContent.stats : []).map((stat: any, index: number) => (
                <div key={index} className="border border-gray-200 rounded-md p-3 mb-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Stat {index + 1}</span>
                    <button
                      onClick={() => handleArrayItemRemove('stats', index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                  <input
                    type="text"
                    value={stat.icon || ''}
                    onChange={(e) => handleArrayItemChange('stats', index, { ...stat, icon: e.target.value })}
                    placeholder="Icon (emoji)"
                    className="w-full px-2 py-1 border border-gray-300 rounded mb-2 text-gray-900 placeholder:text-gray-500"
                  />
                  <input
                    type="text"
                    value={stat.value || ''}
                    onChange={(e) => handleArrayItemChange('stats', index, { ...stat, value: e.target.value })}
                    placeholder="Value"
                    className="w-full px-2 py-1 border border-gray-300 rounded mb-2 text-gray-900 placeholder:text-gray-500"
                  />
                  <input
                    type="text"
                    value={stat.label || ''}
                    onChange={(e) => handleArrayItemChange('stats', index, { ...stat, label: e.target.value })}
                    placeholder="Label"
                    className="w-full px-2 py-1 border border-gray-300 rounded text-gray-900 placeholder:text-gray-500"
                  />
                </div>
              ))}
              <button
                onClick={() => handleArrayItemAdd('stats', { icon: '🔥', value: '1M+', label: 'Holders' })}
                className="w-full px-3 py-2 border border-gray-300 border-dashed rounded-md text-gray-500 hover:text-gray-700 hover:border-gray-400"
              >
                + Add Statistic
              </button>
            </div>

            {/* Visibility Toggles */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Visibility Options</h4>
              {renderField('showTokenPill', localContent.showTokenPill, 'Show Token Pill', 'boolean')}
              {renderField('showStats', localContent.showStats, 'Show Statistics', 'boolean')}
              {renderField('showPrimaryButton', localContent.showPrimaryButton, 'Show Primary Button', 'boolean')}
              {renderField('showSecondaryButton', localContent.showSecondaryButton, 'Show Secondary Button', 'boolean')}
              {renderField('showTokenVisual', localContent.showTokenVisual, 'Show Token Visual', 'boolean')}
  
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="space-y-4">
            {renderField('title', localContent.title, 'Title', 'text')}
            {renderField('description', localContent.description, 'Description', 'textarea')}
            {renderField('content', localContent.content, 'Content', 'textarea')}
            {renderField('contractAddress', localContent.contractAddress, 'Contract Address', 'text')}
            
            {/* CTA Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Call to Action Section
              </label>
              <input
                type="text"
                value={localContent.ctaTitle || ''}
                onChange={(e) => handleContentChange('ctaTitle', e.target.value)}
                placeholder="CTA Title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2 text-gray-900 placeholder:text-gray-500"
              />
              <textarea
                value={localContent.ctaDescription || ''}
                onChange={(e) => handleContentChange('ctaDescription', e.target.value)}
                placeholder="CTA Description"
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2 text-gray-900 placeholder:text-gray-500"
              />
            </div>

            {/* CTA Buttons */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CTA Primary Button
              </label>
              <input
                type="text"
                value={localContent.ctaPrimary?.text || ''}
                onChange={(e) => handleContentChange('ctaPrimary', { ...localContent.ctaPrimary, text: e.target.value })}
                placeholder="Button text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2 text-gray-900 placeholder:text-gray-500"
              />
              <input
                type="text"
                value={localContent.ctaPrimary?.href || ''}
                onChange={(e) => handleContentChange('ctaPrimary', { ...localContent.ctaPrimary, href: e.target.value })}
                placeholder="Button link"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder:text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CTA Secondary Button
              </label>
              <input
                type="text"
                value={localContent.ctaSecondary?.text || ''}
                onChange={(e) => handleContentChange('ctaSecondary', { ...localContent.ctaSecondary, text: e.target.value })}
                placeholder="Button text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2 text-gray-900 placeholder:text-gray-500"
              />
              <input
                type="text"
                value={localContent.ctaSecondary?.href || ''}
                onChange={(e) => handleContentChange('ctaSecondary', { ...localContent.ctaSecondary, href: e.target.value })}
                placeholder="Button link"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder:text-gray-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Features
              </label>
              {(Array.isArray(localContent.features) ? localContent.features : []).map(renderFeature)}
              <button
                onClick={() => handleArrayItemAdd('features', { title: 'New Feature', description: 'Feature description', icon: '⚡', color: '#FF6B35' })}
                className="w-full px-3 py-2 border border-gray-300 border-dashed rounded-md text-gray-500 hover:text-gray-700 hover:border-gray-400"
              >
                + Add Feature
              </button>
            </div>
          </div>
        );

      case 'tokenomics':
        return (
          <div className="space-y-4">
            {renderField('title', localContent.title, 'Title', 'text')}
            {renderField('description', localContent.description, 'Description', 'textarea')}
            {renderField('totalSupply', localContent.totalSupply, 'Total Supply', 'text')}
            
            {/* Distribution */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Token Distribution
              </label>
              {(Array.isArray(localContent.distribution) ? localContent.distribution : []).map((item: any, index: number) => (
                <div key={index} className="border border-gray-200 rounded-md p-3 mb-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Distribution {index + 1}</span>
                    <button
                      onClick={() => handleArrayItemRemove('distribution', index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                  <input
                    type="text"
                    value={item.label || ''}
                    onChange={(e) => handleArrayItemChange('distribution', index, { ...item, label: e.target.value })}
                    placeholder="Label (e.g., Liquidity Pool)"
                    className="w-full px-2 py-1 border border-gray-300 rounded mb-2 text-gray-900 placeholder:text-gray-500"
                  />
                  <input
                    type="number"
                    value={item.percentage || ''}
                    onChange={(e) => handleArrayItemChange('distribution', index, { ...item, percentage: parseFloat(e.target.value) })}
                    placeholder="Percentage"
                    className="w-full px-2 py-1 border border-gray-300 rounded mb-2 text-gray-900 placeholder:text-gray-500"
                  />
                  <ColorPicker
                    color={item.color || '#FF6B35'}
                    onChange={(color) => handleArrayItemChange('distribution', index, { ...item, color })}
                  />
                </div>
              ))}
              <button
                onClick={() => handleArrayItemAdd('distribution', { label: 'New Allocation', percentage: 10, color: '#FF6B35' })}
                className="w-full px-3 py-2 border border-gray-300 border-dashed rounded-md text-gray-500 hover:text-gray-700 hover:border-gray-400"
              >
                + Add Distribution
              </button>
            </div>
          </div>
        );

      case 'roadmap':
        return (
          <div className="space-y-4">
            {renderField('title', localContent.title, 'Title', 'text')}
            {renderField('description', localContent.description, 'Description', 'textarea')}
            
            {/* Roadmap Phases */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Roadmap Phases
              </label>
              {(Array.isArray(localContent.phases) ? localContent.phases : []).map((phase: any, index: number) => (
                <div key={index} className="border border-gray-200 rounded-md p-3 mb-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Phase {index + 1}</span>
                    <button
                      onClick={() => handleArrayItemRemove('phases', index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                  <input
                    type="text"
                    value={phase.title || ''}
                    onChange={(e) => handleArrayItemChange('phases', index, { ...phase, title: e.target.value })}
                    placeholder="Phase title"
                    className="w-full px-2 py-1 border border-gray-300 rounded mb-2 text-gray-900 placeholder:text-gray-500"
                  />
                  <textarea
                    value={phase.description || ''}
                    onChange={(e) => handleArrayItemChange('phases', index, { ...phase, description: e.target.value })}
                    placeholder="Phase description"
                    rows={2}
                    className="w-full px-2 py-1 border border-gray-300 rounded mb-2 text-gray-900 placeholder:text-gray-500"
                  />
                  <input
                    type="text"
                    value={phase.date || ''}
                    onChange={(e) => handleArrayItemChange('phases', index, { ...phase, date: e.target.value })}
                    placeholder="Date (e.g., Q1 2024)"
                    className="w-full px-2 py-1 border border-gray-300 rounded mb-2 text-gray-900 placeholder:text-gray-500"
                  />
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={Boolean(phase.completed)}
                      onChange={(e) => handleArrayItemChange('phases', index, { ...phase, completed: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Completed</span>
                  </label>
                </div>
              ))}
              <button
                onClick={() => handleArrayItemAdd('phases', { title: 'New Phase', description: 'Phase description', date: 'Q1 2024', completed: false })}
                className="w-full px-3 py-2 border border-gray-300 border-dashed rounded-md text-gray-500 hover:text-gray-700 hover:border-gray-400"
              >
                + Add Phase
              </button>
            </div>
          </div>
        );

      case 'team':
        return (
          <div className="space-y-4">
            {renderField('title', localContent.title, 'Title', 'text')}
            {renderField('description', localContent.description, 'Description', 'textarea')}
            
            {/* Team Members */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Team Members
              </label>
              {(Array.isArray(localContent.members) ? localContent.members : []).map((member: any, index: number) => (
                <div key={index} className="border border-gray-200 rounded-md p-3 mb-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Member {index + 1}</span>
                    <button
                      onClick={() => handleArrayItemRemove('members', index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                  <input
                    type="text"
                    value={member.name || ''}
                    onChange={(e) => handleArrayItemChange('members', index, { ...member, name: e.target.value })}
                    placeholder="Name"
                    className="w-full px-2 py-1 border border-gray-300 rounded mb-2 text-gray-900 placeholder:text-gray-500"
                  />
                  <input
                    type="text"
                    value={member.role || ''}
                    onChange={(e) => handleArrayItemChange('members', index, { ...member, role: e.target.value })}
                    placeholder="Role"
                    className="w-full px-2 py-1 border border-gray-300 rounded mb-2 text-gray-900 placeholder:text-gray-500"
                  />
                  <input
                    type="text"
                    value={member.avatar || ''}
                    onChange={(e) => handleArrayItemChange('members', index, { ...member, avatar: e.target.value })}
                    placeholder="Avatar (emoji)"
                    className="w-full px-2 py-1 border border-gray-300 rounded mb-2 text-gray-900 placeholder:text-gray-500"
                  />
                  <input
                    type="url"
                    value={member.social || ''}
                    onChange={(e) => handleArrayItemChange('members', index, { ...member, social: e.target.value })}
                    placeholder="Social URL"
                    className="w-full px-2 py-1 border border-gray-300 rounded mb-2 text-gray-900 placeholder:text-gray-500"
                  />
                  <textarea
                    value={member.bio || ''}
                    onChange={(e) => handleArrayItemChange('members', index, { ...member, bio: e.target.value })}
                    placeholder="Bio"
                    rows={2}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-gray-900 placeholder:text-gray-500"
                  />
                </div>
              ))}
              <button
                onClick={() => handleArrayItemAdd('members', { name: 'New Member', role: 'Role', avatar: '👤', social: '', bio: 'Bio description' })}
                className="w-full px-3 py-2 border border-gray-300 border-dashed rounded-md text-gray-500 hover:text-gray-700 hover:border-gray-400"
              >
                + Add Member
              </button>
            </div>
          </div>
        );

      case 'community':
        return (
          <div className="space-y-4">
            {renderField('title', localContent.title, 'Title', 'text')}
            {renderField('description', localContent.description, 'Description', 'textarea')}
            
            {/* Community Cards */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Community Cards
              </label>
              {(Array.isArray(localContent.cards) ? localContent.cards : []).map((card: any, index: number) => (
                <div key={index} className="border border-gray-200 rounded-md p-3 mb-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Card {index + 1}</span>
                    <button
                      onClick={() => handleArrayItemRemove('cards', index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                  <input
                    type="text"
                    value={card.title || ''}
                    onChange={(e) => handleArrayItemChange('cards', index, { ...card, title: e.target.value })}
                    placeholder="Card title"
                    className="w-full px-2 py-1 border border-gray-300 rounded mb-2 text-gray-900 placeholder:text-gray-500"
                  />
                  <textarea
                    value={card.description || ''}
                    onChange={(e) => handleArrayItemChange('cards', index, { ...card, description: e.target.value })}
                    placeholder="Card description"
                    rows={2}
                    className="w-full px-2 py-1 border border-gray-300 rounded mb-2 text-gray-900 placeholder:text-gray-500"
                  />
                  <input
                    type="text"
                    value={card.icon || ''}
                    onChange={(e) => handleArrayItemChange('cards', index, { ...card, icon: e.target.value })}
                    placeholder="Icon (emoji)"
                    className="w-full px-2 py-1 border border-gray-300 rounded mb-2 text-gray-900 placeholder:text-gray-500"
                  />
                  <input
                    type="url"
                    value={card.link || ''}
                    onChange={(e) => handleArrayItemChange('cards', index, { ...card, link: e.target.value })}
                    placeholder="Link URL"
                    className="w-full px-2 py-1 border border-gray-300 rounded mb-2 text-gray-900 placeholder:text-gray-500"
                  />
                  <ColorPicker
                    color={card.color || '#FF6B35'}
                    onChange={(color) => handleArrayItemChange('cards', index, { ...card, color })}
                  />
                </div>
              ))}
              <button
                onClick={() => handleArrayItemAdd('cards', { title: 'New Card', description: 'Card description', icon: '🔗', link: '', color: '#FF6B35' })}
                className="w-full px-3 py-2 border border-gray-300 border-dashed rounded-md text-gray-500 hover:text-gray-700 hover:border-gray-400"
              >
                + Add Card
              </button>
            </div>
          </div>
        );

      case 'token-details':
        return (
          <div className="space-y-4">
            {renderField('title', localContent.title, 'Title', 'text')}
            {renderField('description', localContent.description, 'Description', 'textarea')}
            {renderField('contractAddress', localContent.contractAddress, 'Contract Address', 'text')}
            
            {/* Token Features */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Token Features
              </label>
              {(Array.isArray(localContent.features) ? localContent.features : []).map((feature: any, index: number) => (
                <div key={index} className="border border-gray-200 rounded-md p-3 mb-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Feature {index + 1}</span>
                    <button
                      onClick={() => handleArrayItemRemove('features', index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                  <input
                    type="text"
                    value={feature.title || ''}
                    onChange={(e) => handleArrayItemChange('features', index, { ...feature, title: e.target.value })}
                    placeholder="Feature title"
                    className="w-full px-2 py-1 border border-gray-300 rounded mb-2 text-gray-900 placeholder:text-gray-500"
                  />
                  <textarea
                    value={feature.description || ''}
                    onChange={(e) => handleArrayItemChange('features', index, { ...feature, description: e.target.value })}
                    placeholder="Feature description"
                    rows={2}
                    className="w-full px-2 py-1 border border-gray-300 rounded mb-2 text-gray-900 placeholder:text-gray-500"
                  />
                  <input
                    type="text"
                    value={feature.icon || ''}
                    onChange={(e) => handleArrayItemChange('features', index, { ...feature, icon: e.target.value })}
                    placeholder="Icon (emoji)"
                    className="w-full px-2 py-1 border border-gray-300 rounded mb-2 text-gray-900 placeholder:text-gray-500"
                  />
                  <ColorPicker
                    color={feature.color || '#FF6B35'}
                    onChange={(color) => handleArrayItemChange('features', index, { ...feature, color })}
                  />
                </div>
              ))}
              <button
                onClick={() => handleArrayItemAdd('features', { title: 'New Feature', description: 'Feature description', icon: '⚡', color: '#FF6B35' })}
                className="w-full px-3 py-2 border border-gray-300 border-dashed rounded-md text-gray-500 hover:text-gray-700 hover:border-gray-400"
              >
                + Add Feature
              </button>
            </div>
          </div>
        );

      case 'footer':
        return (
          <div className="space-y-4">
            {renderField('copyright', localContent.copyright, 'Copyright Text', 'text')}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Social Links
              </label>
              {localContent.social && Object.entries(localContent.social).map(([platform, url]) => 
                renderSocialLink(platform, url as string)
              )}
              <div className="space-y-2">
                {['twitter', 'discord', 'telegram', 'github', 'linkedin'].map(platform => {
                  if (!localContent.social || !localContent.social[platform]) {
                    return (
                      <button
                        key={platform}
                        onClick={() => handleContentChange('social', { ...localContent.social, [platform]: '' })}
                        className="w-full px-3 py-2 border border-gray-300 border-dashed rounded-md text-gray-500 hover:text-gray-700 hover:border-gray-400 capitalize"
                      >
                        + Add {platform}
                      </button>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            {Object.entries(localContent).map(([key, value]) => {
              if (typeof value === 'string') {
                return renderField(key, value, key.charAt(0).toUpperCase() + key.slice(1), 'text');
              }
              return null;
            })}
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 capitalize">
            {block.type} Settings
          </h3>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={Boolean(block.is_enabled)}
              onChange={(e) => onToggleEnabled(block.id!, e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Enabled</span>
          </label>
        </div>
        
        <div className="text-sm text-gray-500 mb-4">
          Block ID: {block.id}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6">
          {renderBlockSpecificSettings()}
        </div>
      </div>
    </div>
  );
};

export default BlockSettings;
