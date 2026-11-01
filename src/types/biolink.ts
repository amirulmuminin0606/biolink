export interface ProfileConfig {
  bannerUrl: string;
  bannerHeight: number; // e.g., 180
  bannerFit: 'cover' | 'contain';
  bannerPosition: 'center' | 'top' | 'bottom';
  avatarUrl: string;
  avatarSize: number; // e.g., 100
  avatarBorderWidth: number; // e.g., 4
  avatarBorderColor: string; // e.g., '#ffffff'
  name: string;
  nameColor: string;
  nameFontSize: number; // e.g., 22
  nameFontWeight: 'normal' | 'medium' | 'semibold' | 'bold';
  bio: string;
  bioColor: string;
  bioFontSize: number; // e.g., 14
  textAlign: 'left' | 'center' | 'right';
  isVerified: boolean;
}

export type SocialPlatform =
  | 'instagram'
  | 'whatsapp'
  | 'facebook'
  | 'tiktok'
  | 'youtube'
  | 'telegram'
  | 'email'
  | 'x'
  | 'website'
  | 'linkedin'
  | 'spotify'
  | 'discord';

export interface SocialLink {
  id: string;
  platform: SocialPlatform;
  title: string;
  url: string;
  enabled: boolean;
  customIcon?: string;
}

export interface SocialsConfig {
  style: 'circle' | 'rounded' | 'outline' | 'pill';
  colorType: 'brand' | 'monochrome' | 'custom';
  customColor: string;
  customBg: string;
  size: 'sm' | 'md' | 'lg';
}

export interface BioButtonLink {
  id: string;
  title: string;
  subtitle?: string;
  url: string;
  logoUrl?: string;
  iconName?: string;
  enabled: boolean;
  clicks: number;
  openNewTab: boolean;
  highlight?: boolean;
  highlightText?: string;
  customBgColor?: string;
  customTextColor?: string;
}

export interface ThemeConfig {
  backgroundType: 'solid' | 'gradient' | 'image';
  solidColor: string;
  gradientFrom: string;
  gradientVia?: string;
  gradientTo: string;
  gradientDirection: 'to-b' | 'to-r' | 'to-br' | 'to-tr' | 'to-bl' | 'radial';
  backgroundImage?: string;
  bgImageSize: 'cover' | 'contain' | 'repeat';
  bgImagePosition: string;
  bgOverlayOpacity: number; // 0 to 100
  bgOverlayColor: string; // e.g. '#000000' or '#ffffff'
  fontFamily: 'Inter' | 'Plus Jakarta Sans' | 'Poppins' | 'Montserrat' | 'Playfair Display' | 'Roboto';
  buttonStyle: 'solid' | 'outline' | 'glass' | 'shadow';
  buttonBgColor: string;
  buttonTextColor: string;
  buttonBorderColor: string;
  buttonBorderRadius: number; // 0, 8, 16, 9999
  buttonSpacing: number; // e.g. 12, 16
  buttonPaddingY: number; // e.g. 14
  buttonWidth: 'full' | 'compact';
  buttonHoverEffect: 'lift' | 'glow' | 'scale' | 'none';
}

export interface FooterConfig {
  enabled: boolean;
  text: string;
  brandName: string;
  copyrightYear: string;
  textColor: string;
  bgColor: string;
  fontSize: number;
  fontWeight: 'normal' | 'medium' | 'semibold';
  textAlign: 'left' | 'center' | 'right';
  paddingY: number;
}

export interface SeoConfig {
  siteTitle: string;
  metaDescription: string;
  ogImageUrl?: string;
  faviconUrl?: string;
}

export interface SupabaseConfig {
  enabled: boolean;
  url: string;
  anonKey: string;
  tableName: string;
  lastSyncedAt?: string;
  status: 'disconnected' | 'connecting' | 'connected' | 'error';
  errorMessage?: string;
}

export interface CustomDomainConfig {
  domain: string;
  status: 'none' | 'pending' | 'verified';
  dnsRecords: {
    type: 'CNAME' | 'A';
    host: string;
    value: string;
  }[];
}

export interface AnalyticsRecord {
  date: string;
  views: number;
  clicks: number;
  perLinkClicks: Record<string, number>;
}

export interface BioLinkData {
  id: string;
  slug: string;
  profile: ProfileConfig;
  socials: SocialLink[];
  socialsConfig: SocialsConfig;
  links: BioButtonLink[];
  theme: ThemeConfig;
  footer: FooterConfig;
  seo: SeoConfig;
  customDomain?: CustomDomainConfig;
  supabase?: SupabaseConfig;
  publishedAt?: string;
  updatedAt: string;
  totalViews: number;
  totalClicks: number;
  analyticsHistory: AnalyticsRecord[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
