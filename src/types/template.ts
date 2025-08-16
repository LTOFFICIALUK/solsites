// =====================================================
// TEMPLATE SYSTEM TYPES - NEW ARCHITECTURE
// =====================================================

export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  category: 'memecoin' | 'defi' | 'nft' | 'utility' | 'classic';
  preview: string;
  slug: string;
  features: string[];
  colors: TemplateColors;
  customizable: TemplateCustomizable;
  defaultData: TemplateDefaultData;
}

export interface TemplateColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  gradient?: {
    from: string;
    to: string;
  };
}

export interface TemplateCustomizable {
  colors: boolean;
  fonts: boolean;
  layout: boolean;
  content: boolean;
  images: boolean;
}

export interface TemplateDefaultData {
  tokenInfo: TokenInfo;
  branding: BrandingInfo;
  social: SocialLinks;
  header: HeaderConfig;
  content: ContentConfig;
}

export interface TokenInfo {
  name: string;
  symbol: string;
  contractAddress: string;
  description: string;
  totalSupply?: string;
  circulatingSupply?: string;
  price?: string;
  marketCap?: string;
}

export interface BrandingInfo {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logo: string;
  banner: string;
  favicon?: string;
}

export interface SocialLinks {
  twitter?: string;
  telegram?: string;
  discord?: string;
  website?: string;
  github?: string;
  medium?: string;
  reddit?: string;
}

export interface HeaderConfig {
  displayName: string;
  colors: {
    primary: string;
    secondary: string;
  };
  navItems: NavItem[];
  cta: CTAButton;
  logo?: string;
}

export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface CTAButton {
  text: string;
  href: string;
  external?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
}

export interface ContentConfig {
  hero: HeroSection;
  about: AboutSection;
  features: Feature[];
  tokenDetails?: TokenDetailsConfig;
  roadmap: RoadmapPhase[];
  team: TeamMember[];
  tokenomics?: TokenomicsConfig;
  community?: CommunityConfig;
  faq?: FAQItem[];
}

export interface HeroSection {
  title: string;
  subtitle: string;
  description: string;
  showTokenPill?: boolean;
  showStats?: boolean;
  showPrimaryButton?: boolean;
  showSecondaryButton?: boolean;
  showTokenVisual?: boolean;

  tokenSymbol?: string;
  stats?: StatItem[];
  primaryButton?: CTAButton;
  secondaryButton?: CTAButton;
  backgroundImage?: string;
}

export interface StatItem {
  value: string;
  label: string;
  color: 'primary' | 'secondary' | 'accent';
  icon?: string;
}

export interface AboutSection {
  title: string;
  description: string;
  content?: string;
  contractAddress?: string;
  ctaTitle?: string;
  ctaDescription?: string;
  ctaPrimary?: CTAButton;
  ctaSecondary?: CTAButton;
  features?: Feature[];
}

export interface Feature {
  title: string;
  description: string;
  icon: string;
  color?: string;
}

export interface RoadmapPhase {
  title: string;
  description: string;
  date: string;
  completed: boolean;
  items?: string[];
}

export interface TeamMember {
  name: string;
  role: string;
  avatar: string;
  social: string;
  bio?: string;
}

export interface TokenDetailsConfig {
  title: string;
  description: string;
  contractAddress?: string;
  features: Feature[];
}

export interface TokenomicsConfig {
  title: string;
  description: string;
  totalSupply: string;
  distribution: TokenDistribution[];
}

export interface TokenDistribution {
  name: string;
  percentage: number;
  color: string;
  description?: string;
}

export interface CommunityConfig {
  title: string;
  description: string;
  cards: CommunityCard[];
}

export interface CommunityCard {
  title: string;
  description: string;
  icon: string;
  link?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

// =====================================================
// COMPONENT PROPS INTERFACES
// =====================================================

export interface BaseComponentProps {
  data: any;
  colors: TemplateColors;
  preview?: boolean;
  className?: string;
}

export interface HeroProps extends BaseComponentProps {
  data: HeroSection;
}

export interface NavbarProps extends BaseComponentProps {
  data: HeaderConfig;
}

export interface AboutProps extends BaseComponentProps {
  data: AboutSection;
}

export interface FeaturesProps extends BaseComponentProps {
  data: Feature[];
}

export interface RoadmapProps extends BaseComponentProps {
  data: RoadmapPhase[];
}

export interface TeamProps extends BaseComponentProps {
  data: TeamMember[];
}

export interface FooterProps extends BaseComponentProps {
  data: SocialLinks;
  branding: BrandingInfo;
}

export interface TokenomicsProps extends BaseComponentProps {
  data: TokenomicsConfig;
}

export interface CommunityProps extends BaseComponentProps {
  data: CommunityConfig;
}

// =====================================================
// TEMPLATE RENDERING INTERFACES
// =====================================================

export interface TemplateRendererProps {
  template: TemplateConfig;
  data: TemplateDefaultData;
  preview?: boolean;
}

export interface TemplateComponentProps {
  template: TemplateConfig;
  data: TemplateDefaultData;
  preview?: boolean;
  className?: string;
}

