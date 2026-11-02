import React from 'react';
import { ChevronRight, BadgeCheck, Sparkles, ExternalLink } from 'lucide-react';
import { BioLinkData, BioButtonLink } from '../../types/biolink';
import { SocialButton } from '../common/SocialIcons';
import { LinkLogoOrIcon } from '../common/ButtonIcons';
import { BannerCarousel } from '../common/BannerCarousel';

interface PublicBioViewProps {
  data: BioLinkData;
  onLinkClick?: (linkId: string, url: string) => void;
  isInteractivePreview?: boolean;
}

export const PublicBioView: React.FC<PublicBioViewProps> = ({
  data,
  onLinkClick,
  isInteractivePreview = false,
}) => {
  const { profile, socials, socialsConfig, links, theme, footer } = data;

  // Background styling computation
  const getBackgroundStyles = (): React.CSSProperties => {
    if (theme.backgroundType === 'solid') {
      return { backgroundColor: theme.solidColor || '#f8fafc' };
    }
    if (theme.backgroundType === 'gradient') {
      let dir = '180deg';
      if (theme.gradientDirection === 'to-r') dir = '90deg';
      if (theme.gradientDirection === 'to-br') dir = '135deg';
      if (theme.gradientDirection === 'to-tr') dir = '45deg';
      if (theme.gradientDirection === 'to-bl') dir = '225deg';

      if (theme.gradientDirection === 'radial') {
        return {
          background: `radial-gradient(circle at center, ${theme.gradientFrom}, ${theme.gradientTo})`,
        };
      }
      return {
        background: `linear-gradient(${dir}, ${theme.gradientFrom}, ${theme.gradientTo})`,
      };
    }
    if (theme.backgroundType === 'image' && theme.backgroundImage) {
      return {
        backgroundImage: `url(${theme.backgroundImage})`,
        backgroundSize: theme.bgImageSize || 'cover',
        backgroundPosition: theme.bgImagePosition || 'center',
        backgroundRepeat: theme.bgImageSize === 'repeat' ? 'repeat' : 'no-repeat',
      };
    }
    return { backgroundColor: '#f8fafc' };
  };

  // Button hover effect class
  const getButtonHoverClasses = () => {
    switch (theme.buttonHoverEffect) {
      case 'lift':
        return 'hover:-translate-y-1 hover:shadow-lg';
      case 'scale':
        return 'hover:scale-[1.02] hover:shadow-md';
      case 'glow':
        return 'hover:ring-4 hover:ring-indigo-300/40 hover:shadow-lg';
      default:
        return 'hover:opacity-95';
    }
  };

  // Button style class
  const getButtonStyleClasses = () => {
    switch (theme.buttonStyle) {
      case 'shadow':
        return 'shadow-md border';
      case 'outline':
        return 'border-2 bg-transparent';
      case 'glass':
        return 'backdrop-blur-md bg-white/70 border border-white/50 shadow-sm';
      case 'solid':
      default:
        return 'border shadow-xs';
    }
  };

  const handleButtonClick = (link: BioButtonLink, e: React.MouseEvent) => {
    if (onLinkClick) {
      onLinkClick(link.id, link.url);
    }
  };

  const activeLinks = (links || []).filter((l) => l.enabled);
  const activeSocials = (socials || []).filter((s) => s.enabled);

  // Font family helper
  const fontFamilyStyle = {
    fontFamily: `${theme.fontFamily || 'Plus Jakarta Sans'}, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`,
  };

  return (
    <div
      style={{ ...getBackgroundStyles(), ...fontFamilyStyle }}
      className="relative min-h-full w-full flex flex-col justify-between overflow-x-hidden transition-colors duration-300"
    >
      {/* Background Overlay for Image Background */}
      {theme.backgroundType === 'image' && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            backgroundColor: theme.bgOverlayColor || '#000000',
            opacity: (theme.bgOverlayOpacity ?? 20) / 100,
          }}
        />
      )}

      {/* Main Content Area */}
      <div className="relative z-10 w-full flex-1 flex flex-col">
        {/* Banner Carousel Section */}
        <BannerCarousel
          slides={profile.bannerSlides}
          fallbackUrl={profile.bannerUrl}
          height={profile.bannerHeight || 180}
          fit={profile.bannerFit || 'cover'}
          position={profile.bannerPosition || 'center'}
          autoSlide={profile.bannerAutoSlide ?? true}
          interval={profile.bannerSlideInterval || 4}
          isInteractive={!isInteractivePreview}
        />

        {/* Profile Avatar & Info Card Container */}
        <div className="max-w-md mx-auto w-full px-5 flex flex-col items-center">
          {/* Avatar (circular, overlapping banner) */}
          <div
            className="relative z-20 rounded-full overflow-hidden shadow-xl shrink-0 transition-transform hover:scale-105 duration-200"
            style={{
              marginTop:
                (profile.bannerSlides && profile.bannerSlides.some((s) => s.enabled && s.imageUrl)) ||
                profile.bannerUrl
                  ? `-${Math.round((profile.avatarSize || 100) / 2)}px`
                  : '16px',
              width: `${profile.avatarSize || 100}px`,
              height: `${profile.avatarSize || 100}px`,
              borderWidth: `${profile.avatarBorderWidth ?? 4}px`,
              borderColor: profile.avatarBorderColor || '#ffffff',
            }}
          >
            <img
              src={profile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'}
              alt={profile.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Store Name & Verification Badge */}
          <div className="mt-3.5 flex items-center justify-center gap-1.5 flex-wrap">
            <h1
              style={{
                color: profile.nameColor || '#111827',
                fontSize: `${profile.nameFontSize || 24}px`,
                fontWeight:
                  profile.nameFontWeight === 'bold'
                    ? 700
                    : profile.nameFontWeight === 'semibold'
                    ? 600
                    : profile.nameFontWeight === 'medium'
                    ? 500
                    : 400,
                textAlign: profile.textAlign || 'center',
              }}
              className="tracking-tight leading-tight"
            >
              {profile.name || 'Nama Toko Anda'}
            </h1>
            {profile.isVerified && (
              <span title="Verified Official Store" className="text-blue-500 inline-flex items-center">
                <BadgeCheck size={20} className="fill-blue-500 text-white" />
              </span>
            )}
          </div>

          {/* Bio / Description */}
          {profile.bio && (
            <p
              style={{
                color: profile.bioColor || '#4b5563',
                fontSize: `${profile.bioFontSize || 13}px`,
                textAlign: profile.textAlign || 'center',
              }}
              className="mt-2.5 whitespace-pre-line leading-relaxed max-w-sm px-2"
            >
              {profile.bio}
            </p>
          )}

          {/* Social Media Horizontal Icons */}
          {activeSocials.length > 0 && (
            <div className="mt-5 flex items-center justify-center gap-2.5 flex-wrap max-w-sm px-2">
              {activeSocials.map((social) => (
                <SocialButton
                  key={social.id}
                  social={social}
                  config={socialsConfig}
                />
              ))}
            </div>
          )}

          {/* Link Buttons Section */}
          <div
            className="w-full mt-6 flex flex-col"
            style={{
              gap: `${theme.buttonSpacing || 14}px`,
            }}
          >
            {activeLinks.map((link) => {
              const buttonBg = link.customBgColor || theme.buttonBgColor || '#ffffff';
              const buttonText = link.customTextColor || theme.buttonTextColor || '#111827';
              const borderColor = theme.buttonBorderColor || '#e5e7eb';

              return (
                <a
                  key={link.id}
                  href={link.url}
                  target={link.openNewTab ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  onClick={(e) => handleButtonClick(link, e)}
                  style={{
                    backgroundColor: theme.buttonStyle === 'outline' ? 'transparent' : buttonBg,
                    color: buttonText,
                    borderColor: borderColor,
                    borderRadius: `${theme.buttonBorderRadius ?? 16}px`,
                    paddingTop: `${theme.buttonPaddingY || 14}px`,
                    paddingBottom: `${theme.buttonPaddingY || 14}px`,
                  }}
                  className={`group relative flex items-center justify-between px-4 sm:px-5 transition-all duration-200 cursor-pointer ${getButtonStyleClasses()} ${getButtonHoverClasses()} ${
                    theme.buttonWidth === 'compact' ? 'max-w-xs mx-auto' : 'w-full'
                  }`}
                >
                  {/* Highlight Ribbon / Badge */}
                  {link.highlight && (
                    <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-sm flex items-center gap-1 uppercase">
                      <Sparkles size={10} />
                      {link.highlightText || 'PROMO'}
                    </span>
                  )}

                  {/* Left Logo / Icon */}
                  <div className="shrink-0 flex items-center justify-center">
                    <LinkLogoOrIcon
                      logoUrl={link.logoUrl}
                      iconName={link.iconName}
                      title={link.title}
                      className="w-7 h-7 sm:w-8 sm:h-8"
                    />
                  </div>

                  {/* Center Title and Subtitle */}
                  <div className="flex-1 px-3.5 text-center min-w-0">
                    <div className="font-semibold text-sm sm:text-base leading-tight truncate group-hover:scale-[1.01] transition-transform">
                      {link.title}
                    </div>
                    {link.subtitle && (
                      <div
                        style={{ opacity: 0.75 }}
                        className="text-[11px] sm:text-xs leading-snug mt-0.5 truncate"
                      >
                        {link.subtitle}
                      </div>
                    )}
                  </div>

                  {/* Right Arrow / Action Icon */}
                  <div className="shrink-0 flex items-center justify-center opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
                    {link.openNewTab ? (
                      <ChevronRight size={18} />
                    ) : (
                      <ChevronRight size={18} />
                    )}
                  </div>
                </a>
              );
            })}

            {activeLinks.length === 0 && (
              <div className="text-center py-8 px-4 rounded-2xl border-2 border-dashed border-slate-300 text-slate-400 text-xs">
                Belum ada link yang aktif. Tambahkan tautan melalui dashboard admin.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Section */}
      {footer.enabled && (
        <footer
          style={{
            backgroundColor: footer.bgColor || 'transparent',
            color: footer.textColor || '#9ca3af',
            fontSize: `${footer.fontSize || 12}px`,
            textAlign: footer.textAlign || 'center',
            paddingTop: `${footer.paddingY || 24}px`,
            paddingBottom: `${footer.paddingY || 24}px`,
          }}
          className="relative z-10 w-full mt-auto"
        >
          <div className="max-w-md mx-auto px-4">
            <p className="leading-normal">
              © {footer.copyrightYear || '2026'}{' '}
              <span className="font-semibold">{footer.brandName || profile.name}</span>. {footer.text}
            </p>
          </div>
        </footer>
      )}
    </div>
  );
};
