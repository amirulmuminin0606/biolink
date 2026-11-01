import React from 'react';
import {
  Globe,
  MessageCircle,
  ShoppingBag,
  ExternalLink,
  Store,
  Sparkles,
  Tag,
  Package,
  Layers,
  Heart,
  Star,
  Coffee,
  Bookmark,
} from 'lucide-react';

interface LinkIconProps {
  logoUrl?: string;
  iconName?: string;
  title: string;
  className?: string;
}

export const LinkLogoOrIcon: React.FC<LinkIconProps> = ({
  logoUrl,
  iconName,
  title,
  className = 'w-7 h-7',
}) => {
  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={title}
        onError={(e) => {
          // If external CDN fails, fallback to styled icon
          (e.currentTarget as HTMLImageElement).style.display = 'none';
        }}
        className={`${className} object-contain rounded-md shrink-0`}
      />
    );
  }

  // Pre-mapped icons based on iconName or title keyword
  const lower = (title || '').toLowerCase();

  if (iconName === 'MessageCircle' || lower.includes('whatsapp') || lower.includes('cs') || lower.includes('chat')) {
    return (
      <div className={`${className} rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0`}>
        <MessageCircle size={16} />
      </div>
    );
  }

  if (lower.includes('shopee')) {
    return (
      <div className={`${className} rounded-lg bg-[#EE4D2D] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm`}>
        <ShoppingBag size={15} />
      </div>
    );
  }

  if (lower.includes('tokopedia')) {
    return (
      <div className={`${className} rounded-lg bg-[#03AC0E] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm`}>
        <Store size={15} />
      </div>
    );
  }

  if (lower.includes('lazada')) {
    return (
      <div className={`${className} rounded-lg bg-gradient-to-tr from-[#0F146D] to-[#F37021] text-white flex items-center justify-center text-xs shrink-0 shadow-sm`}>
        <Package size={15} />
      </div>
    );
  }

  if (lower.includes('tiktok')) {
    return (
      <div className={`${className} rounded-lg bg-black text-white flex items-center justify-center text-xs shrink-0 shadow-sm`}>
        <Sparkles size={15} />
      </div>
    );
  }

  switch (iconName) {
    case 'ShoppingBag':
      return <ShoppingBag className={className} size={18} />;
    case 'Tag':
      return <Tag className={className} size={18} />;
    case 'Heart':
      return <Heart className={className} size={18} />;
    case 'Star':
      return <Star className={className} size={18} />;
    case 'Coffee':
      return <Coffee className={className} size={18} />;
    case 'Bookmark':
      return <Bookmark className={className} size={18} />;
    case 'Layers':
      return <Layers className={className} size={18} />;
    case 'Globe':
    default:
      return (
        <div className={`${className} rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0`}>
          <Globe size={16} />
        </div>
      );
  }
};
