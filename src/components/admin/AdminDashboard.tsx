import React, { useState } from 'react';
import {
  BarChart2,
  User,
  Share2,
  Link2,
  Palette,
  Globe,
  Settings,
  Sparkles,
  Check,
  AlertCircle,
} from 'lucide-react';
import { BioLinkData, ProfileConfig, SocialsConfig, SocialLink, BioButtonLink, ThemeConfig, FooterConfig, SeoConfig, CustomDomainConfig } from '../../types/biolink';
import { AnalyticsTab } from './tabs/AnalyticsTab';
import { ProfileTab } from './tabs/ProfileTab';
import { SocialMediaTab } from './tabs/SocialMediaTab';
import { LinksTab } from './tabs/LinksTab';
import { AppearanceTab } from './tabs/AppearanceTab';
import { CustomUrlTab } from './tabs/CustomUrlTab';
import { SettingsTab } from './tabs/SettingsTab';
import { PhoneSimulator } from '../preview/PhoneSimulator';
import { NavbarAdmin } from './NavbarAdmin';
import { QrCodeModal } from '../common/QrCodeModal';

interface AdminDashboardProps {
  draft: BioLinkData;
  published: BioLinkData;
  onUpdateDraft: (updated: BioLinkData) => void;
  onSaveDraft: () => Promise<void>;
  onPublish: () => Promise<void>;
  onResetDraft: () => Promise<void>;
  onOpenPublicView: () => void;
  onLogout: () => void;
  isModified: boolean;
  isSavingDraft: boolean;
  isPublishing: boolean;
  toastMessage: string | null;
}

export type AdminTab =
  | 'analytics'
  | 'profile'
  | 'socials'
  | 'links'
  | 'appearance'
  | 'custom-url'
  | 'settings';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  draft,
  published,
  onUpdateDraft,
  onSaveDraft,
  onPublish,
  onResetDraft,
  onOpenPublicView,
  onLogout,
  isModified,
  isSavingDraft,
  isPublishing,
  toastMessage,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('profile');
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  // Partial update helpers
  const handleProfileChange = (updated: Partial<ProfileConfig>) => {
    onUpdateDraft({
      ...draft,
      profile: { ...draft.profile, ...updated },
    });
  };

  const handleSocialsChange = (socials: SocialLink[]) => {
    onUpdateDraft({
      ...draft,
      socials,
    });
  };

  const handleSocialsConfigChange = (socialsConfig: SocialsConfig) => {
    onUpdateDraft({
      ...draft,
      socialsConfig,
    });
  };

  const handleLinksChange = (links: BioButtonLink[]) => {
    onUpdateDraft({
      ...draft,
      links,
    });
  };

  const handleThemeChange = (updated: Partial<ThemeConfig>) => {
    onUpdateDraft({
      ...draft,
      theme: { ...draft.theme, ...updated },
    });
  };

  const handleFooterChange = (updated: Partial<FooterConfig>) => {
    onUpdateDraft({
      ...draft,
      footer: { ...draft.footer, ...updated },
    });
  };

  const handleSlugChange = (newSlug: string) => {
    onUpdateDraft({
      ...draft,
      slug: newSlug,
    });
  };

  const handleCustomDomainChange = (config: CustomDomainConfig) => {
    onUpdateDraft({
      ...draft,
      customDomain: config,
    });
  };

  const handleSeoChange = (updated: Partial<SeoConfig>) => {
    onUpdateDraft({
      ...draft,
      seo: { ...draft.seo, ...updated },
    });
  };

  const handleImportData = (imported: BioLinkData) => {
    onUpdateDraft(imported);
  };

  const handleResetToDefault = () => {
    onResetDraft();
  };

  const publicUrl = `${window.location.origin}/${draft.slug}`;

  const tabs: { id: AdminTab; label: string; icon: React.FC<{ size?: number; className?: string }> }[] = [
    { id: 'analytics', label: 'Statistik', icon: BarChart2 },
    { id: 'profile', label: 'Profil & Banner', icon: User },
    { id: 'socials', label: 'Social Media', icon: Share2 },
    { id: 'links', label: 'Daftar Link', icon: Link2 },
    { id: 'appearance', label: 'Desain & Tema', icon: Palette },
    { id: 'custom-url', label: 'Custom URL', icon: Globe },
    { id: 'settings', label: 'Pengaturan', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Admin Top Navbar */}
      <NavbarAdmin
        storeName={draft.profile.name}
        slug={draft.slug}
        isModified={isModified}
        isPublishing={isPublishing}
        isSavingDraft={isSavingDraft}
        onSaveDraft={onSaveDraft}
        onPublish={onPublish}
        onResetDraft={onResetDraft}
        onOpenPublicView={onOpenPublicView}
        onOpenQrCode={() => setIsQrModalOpen(true)}
        onLogout={onLogout}
      />

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-slate-950 text-white border border-slate-700 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Check size={14} />
            </div>
            <span className="text-xs font-medium">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Main Two-Column Layout (Left: Settings Editor, Right: Real-time Live Preview) */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT PANEL: Editor Pengaturan (Col 1 to 7) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Navigation Tab Bar */}
          <div className="bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 flex items-center gap-1 overflow-x-auto scrollbar-none">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon size={15} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Panel */}
          <div className="text-slate-900">
            {activeTab === 'analytics' && <AnalyticsTab data={published} />}
            {activeTab === 'profile' && (
              <ProfileTab profile={draft.profile} onChange={handleProfileChange} />
            )}
            {activeTab === 'socials' && (
              <SocialMediaTab
                socials={draft.socials}
                config={draft.socialsConfig}
                onSocialsChange={handleSocialsChange}
                onConfigChange={handleSocialsConfigChange}
              />
            )}
            {activeTab === 'links' && (
              <LinksTab links={draft.links} onLinksChange={handleLinksChange} />
            )}
            {activeTab === 'appearance' && (
              <AppearanceTab
                theme={draft.theme}
                footer={draft.footer}
                onThemeChange={handleThemeChange}
                onFooterChange={handleFooterChange}
              />
            )}
            {activeTab === 'custom-url' && (
              <CustomUrlTab
                data={draft}
                onSlugChange={handleSlugChange}
                onCustomDomainChange={handleCustomDomainChange}
                onOpenQrCode={() => setIsQrModalOpen(true)}
                onOpenPublicView={onOpenPublicView}
                currentPublishedSlug={published.slug}
              />
            )}
            {activeTab === 'settings' && (
              <SettingsTab
                seo={draft.seo}
                allData={draft}
                onSeoChange={handleSeoChange}
                onImportData={handleImportData}
                onResetToDefault={handleResetToDefault}
                onSyncSupabase={() => onPublish()}
              />
            )}
          </div>
        </div>

        {/* RIGHT PANEL: Live Preview Real-time (Col 8 to 12) - Sticky on desktop */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 h-auto lg:h-[calc(100vh-6rem)] flex flex-col">
          <PhoneSimulator
            data={draft}
            publicUrl={publicUrl}
            onOpenNewTab={onOpenPublicView}
            isDraftModified={isModified}
          />
        </div>
      </div>

      {/* QR Code Modal */}
      <QrCodeModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        url={publicUrl}
        storeName={draft.profile.name}
      />
    </div>
  );
};
