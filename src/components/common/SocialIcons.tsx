import React from 'react';
import {
  Instagram,
  Phone,
  Facebook,
  Youtube,
  Send,
  Mail,
  Twitter,
  Globe,
  Linkedin,
  Music2,
  MessageSquare,
} from 'lucide-react';
import { SocialLink, SocialsConfig } from '../../types/biolink';

interface SocialIconProps {
  social: SocialLink;
  config: SocialsConfig;
  className?: string;
}

export const BRAND_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  instagram: { bg: 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600', text: 'text-white', border: 'border-pink-500' },
  whatsapp: { bg: 'bg-[#25D366]', text: 'text-white', border: 'border-[#25D366]' },
  tiktok: { bg: 'bg-black', text: 'text-white', border: 'border-black' },
  facebook: { bg: 'bg-[#1877F2]', text: 'text-white', border: 'border-[#1877F2]' },
  youtube: { bg: 'bg-[#FF0000]', text: 'text-white', border: 'border-[#FF0000]' },
  telegram: { bg: 'bg-[#229ED9]', text: 'text-white', border: 'border-[#229ED9]' },
  email: { bg: 'bg-slate-700', text: 'text-white', border: 'border-slate-700' },
  x: { bg: 'bg-black', text: 'text-white', border: 'border-black' },
  website: { bg: 'bg-indigo-600', text: 'text-white', border: 'border-indigo-600' },
  linkedin: { bg: 'bg-[#0A66C2]', text: 'text-white', border: 'border-[#0A66C2]' },
  spotify: { bg: 'bg-[#1DB954]', text: 'text-white', border: 'border-[#1DB954]' },
  discord: { bg: 'bg-[#5865F2]', text: 'text-white', border: 'border-[#5865F2]' },
  other: { bg: 'bg-gray-800', text: 'text-white', border: 'border-gray-800' },
};

export const SocialIconGlyph: React.FC<{ platform: string; size?: number; className?: string }> = ({
  platform,
  size = 18,
  className = '',
}) => {
  switch (platform) {
    case 'instagram':
      return <Instagram size={size} className={className} />;
    case 'whatsapp':
      return <Phone size={size} className={className} />;
    case 'tiktok':
      return <Music2 size={size} className={className} />;
    case 'facebook':
      return <Facebook size={size} className={className} />;
    case 'youtube':
      return <Youtube size={size} className={className} />;
    case 'telegram':
      return <Send size={size} className={className} />;
    case 'email':
      return <Mail size={size} className={className} />;
    case 'x':
      return <Twitter size={size} className={className} />;
    case 'linkedin':
      return <Linkedin size={size} className={className} />;
    case 'spotify':
      return <Music2 size={size} className={className} />;
    case 'discord':
      return <MessageSquare size={size} className={className} />;
    case 'website':
    default:
      return <Globe size={size} className={className} />;
  }
};

export const SocialButton: React.FC<SocialIconProps> = ({ social, config, className = '' }) => {
  if (!social.enabled) return null;

  const brand = BRAND_COLORS[social.platform] || BRAND_COLORS.other;

  let sizeClasses = 'w-10 h-10 text-[18px]';
  let iconSize = 18;
  if (config.size === 'sm') {
    sizeClasses = 'w-8 h-8 text-[15px]';
    iconSize = 15;
  } else if (config.size === 'lg') {
    sizeClasses = 'w-12 h-12 text-[22px]';
    iconSize = 22;
  }

  let shapeClasses = 'rounded-full';
  if (config.style === 'rounded') {
    shapeClasses = 'rounded-xl';
  } else if (config.style === 'pill') {
    shapeClasses = 'rounded-2xl';
  } else if (config.style === 'outline') {
    shapeClasses = 'rounded-full border-2';
  }

  let styleCustom: React.CSSProperties = {};
  let colorClasses = '';

  if (config.colorType === 'brand') {
    if (config.style === 'outline') {
      colorClasses = `border ${brand.border} text-slate-800 bg-white/80 hover:bg-white transition-all shadow-sm`;
    } else {
      colorClasses = `${brand.bg} ${brand.text} shadow-sm hover:scale-105 transition-all`;
    }
  } else if (config.colorType === 'monochrome') {
    if (config.style === 'outline') {
      colorClasses = 'border-2 border-slate-700 text-slate-800 bg-white/70 hover:bg-slate-900 hover:text-white transition-all';
    } else {
      colorClasses = 'bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-sm';
    }
  } else {
    // Custom color
    styleCustom = {
      backgroundColor: config.style === 'outline' ? 'transparent' : config.customBg,
      color: config.customColor,
      borderColor: config.customColor,
    };
    colorClasses = 'transition-all hover:opacity-90 shadow-sm';
  }

  return (
    <a
      href={social.url}
      target="_blank"
      rel="noopener noreferrer"
      title={social.title}
      style={styleCustom}
      className={`inline-flex items-center justify-center transition-transform hover:-translate-y-0.5 active:translate-y-0 ${sizeClasses} ${shapeClasses} ${colorClasses} ${className}`}
    >
      {social.customIcon ? (
        <img src={social.customIcon} alt={social.title} className="w-5 h-5 object-contain rounded" />
      ) : (
        <SocialIconGlyph platform={social.platform} size={iconSize} />
      )}
    </a>
  );
};
