import React, { useState, useEffect } from 'react';
import { BioLinkData } from './types/biolink';
import { DEFAULT_BIOLINK_DATA } from './data/defaultData';
import {
  getPublicBioLink,
  getAdminBioLink,
  saveDraftToServer,
  publishToServer,
  resetDraftFromServer,
  trackPageView,
  trackLinkClick,
} from './lib/api';
import {
  getStoredSupabaseConfig,
  syncToSupabase,
  fetchFromSupabase,
} from './lib/supabase';
import { PublicBioView } from './components/public/PublicBioView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLoginModal } from './components/auth/AdminLoginModal';
import { Shield, Sparkles, ExternalLink, Eye, ArrowLeft } from 'lucide-react';

export default function App() {
  const [viewMode, setViewMode] = useState<'public' | 'admin'>('public');
  const [currentSlug, setCurrentSlug] = useState<string>('ndfstore');
  const [draft, setDraft] = useState<BioLinkData>(DEFAULT_BIOLINK_DATA);
  const [published, setPublished] = useState<BioLinkData>(DEFAULT_BIOLINK_DATA);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSavingDraft, setIsSavingDraft] = useState<boolean>(false);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);

  // Determine slug and initial view from window.location.pathname
  useEffect(() => {
    const handleRoute = () => {
      const path = window.location.pathname.replace(/^\/+|\/+$/g, '');
      const searchParams = new URLSearchParams(window.location.search);

      if (path === 'admin' || searchParams.get('mode') === 'admin') {
        const isAuth = sessionStorage.getItem('biolink_admin_auth') === 'true';
        if (isAuth) {
          setViewMode('admin');
        } else {
          setViewMode('public');
          setIsLoginModalOpen(true);
        }
      } else {
        setViewMode('public');
        const slug = path || 'ndfstore';
        setCurrentSlug(slug);
      }
    };

    handleRoute();
    window.addEventListener('popstate', handleRoute);
    return () => window.removeEventListener('popstate', handleRoute);
  }, []);

  // Fetch initial data
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        // Check if Supabase has data
        const sbConfig = getStoredSupabaseConfig();
        if (sbConfig.enabled && sbConfig.url && sbConfig.anonKey) {
          const sbData = await fetchFromSupabase(currentSlug, sbConfig);
          if (sbData) {
            setDraft(sbData);
            setPublished(sbData);
            setCurrentSlug(sbData.slug);
            if (viewMode === 'public') {
              trackPageView(sbData.slug);
            }
            setIsLoading(false);
            return;
          }
        }

        // Load admin data (draft & published) from server database
        const adminData = await getAdminBioLink(currentSlug);
        setDraft(adminData.draft);
        setPublished(adminData.published);
        setCurrentSlug(adminData.published.slug || currentSlug);

        // Track page view if in public mode
        if (viewMode === 'public') {
          trackPageView(adminData.published.slug || currentSlug);
        }
      } catch (err) {
        console.warn('Load data error:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [currentSlug]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Compare draft vs published to determine if modified
  const isDraftModified = React.useMemo(() => {
    // Check key fields
    return JSON.stringify(draft) !== JSON.stringify(published);
  }, [draft, published]);

  // Handle Save Draft
  const handleSaveDraft = async () => {
    setIsSavingDraft(true);
    try {
      const res = await saveDraftToServer(draft);
      showToast(res.message || 'Draft berhasil disimpan!');
    } catch (err) {
      showToast('Gagal menyimpan draft.');
    } finally {
      setIsSavingDraft(false);
    }
  };

  // Handle Publish
  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const res = await publishToServer(draft);
      if (res.success && res.data) {
        setPublished(res.data);
        setCurrentSlug(res.data.slug);

        // Also sync to Supabase if configured
        const sbConfig = getStoredSupabaseConfig();
        if (sbConfig.url && sbConfig.anonKey) {
          syncToSupabase(res.data, sbConfig).catch((e) => console.warn('Supabase auto-sync failed:', e));
        }

        showToast(res.message || 'Halaman Bio Link berhasil dipublikasikan!');
        // Update URL path without reloading
        window.history.pushState(null, '', `/${res.data.slug}`);
      } else {
        showToast(res.message || 'Gagal mempublikasikan perubahan.');
      }
    } catch (err) {
      showToast('Terjadi kesalahan saat mempublikasikan.');
    } finally {
      setIsPublishing(false);
    }
  };

  // Handle Reset Draft to Published
  const handleResetDraft = async () => {
    if (window.confirm('Batalkan seluruh perubahan draft dan kembalikan ke versi live yang sudah dipublikasikan?')) {
      try {
        const res = await resetDraftFromServer(draft.slug);
        if (res.success && res.data) {
          setDraft(res.data);
          showToast(res.message);
        } else {
          setDraft(JSON.parse(JSON.stringify(published)));
          showToast('Draft dikembalikan ke versi live.');
        }
      } catch (err) {
        setDraft(JSON.parse(JSON.stringify(published)));
        showToast('Draft dikembalikan ke versi live.');
      }
    }
  };

  // Handle link click in public mode
  const handlePublicLinkClick = (linkId: string, url: string) => {
    trackLinkClick(published.slug, linkId);
    // Open in new tab or navigate
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Switch to admin view
  const handleGoToAdmin = () => {
    const isAuth = sessionStorage.getItem('biolink_admin_auth') === 'true';
    if (!isAuth) {
      setIsLoginModalOpen(true);
    } else {
      setViewMode('admin');
      window.history.pushState(null, '', '/admin');
    }
  };

  // Switch to public view
  const handleGoToPublic = () => {
    setViewMode('public');
    window.history.pushState(null, '', `/${published.slug}`);
    trackPageView(published.slug);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('biolink_admin_auth');
    setViewMode('public');
    window.history.pushState(null, '', `/${published.slug}`);
    showToast('Berhasil logout dari Dashboard Admin.');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs text-slate-400 font-medium">Memuat Bio Link...</p>
      </div>
    );
  }

  // --- Render Public View ---
  if (viewMode === 'public') {
    return (
      <div className="min-h-screen w-full relative bg-slate-100 flex flex-col justify-between">
        {/* Public Bio View (Uses published version) */}
        <PublicBioView
          data={published}
          onLinkClick={handlePublicLinkClick}
        />

        {/* Admin Login Modal */}
        <AdminLoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onSuccess={() => {
            setIsLoginModalOpen(false);
            setViewMode('admin');
            window.history.pushState(null, '', '/admin');
          }}
        />
      </div>
    );
  }

  // --- Render Admin Dashboard View ---
  return (
    <div className="min-h-screen bg-slate-900">
      <AdminDashboard
        draft={draft}
        published={published}
        onUpdateDraft={(updated) => setDraft(updated)}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        onResetDraft={handleResetDraft}
        onOpenPublicView={handleGoToPublic}
        onLogout={handleLogout}
        isModified={isDraftModified}
        isSavingDraft={isSavingDraft}
        isPublishing={isPublishing}
        toastMessage={toastMessage}
      />
    </div>
  );
}
