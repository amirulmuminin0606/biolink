import React from 'react';
import {
  Link2,
  Save,
  Send,
  RotateCcw,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Eye,
  LogOut,
  QrCode,
  Share2,
} from 'lucide-react';

interface NavbarAdminProps {
  storeName: string;
  slug: string;
  isModified: boolean;
  isPublishing: boolean;
  isSavingDraft: boolean;
  onSaveDraft: () => void;
  onPublish: () => void;
  onResetDraft: () => void;
  onOpenPublicView: () => void;
  onOpenQrCode: () => void;
  onLogout: () => void;
}

export const NavbarAdmin: React.FC<NavbarAdminProps> = ({
  storeName,
  slug,
  isModified,
  isPublishing,
  isSavingDraft,
  onSaveDraft,
  onPublish,
  onResetDraft,
  onOpenPublicView,
  onOpenQrCode,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        {/* Brand & Store Name */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-black text-base shadow-sm">
            <Link2 size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-slate-900 text-sm tracking-tight leading-none">
                BioLink <span className="text-indigo-600">PRO</span>
              </h1>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                Dashboard
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">{storeName}</span>
              <span>•</span>
              <span className="font-mono text-indigo-600">/{slug}</span>
            </div>
          </div>
        </div>

        {/* Status Mode Indicator */}
        <div className="flex items-center gap-2">
          {isModified ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Mode Draft (Ada Perubahan)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 size={13} className="text-emerald-600" />
              Sudah Dipublikasikan (Live)
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Batalkan Perubahan if modified */}
          {isModified && (
            <button
              type="button"
              onClick={onResetDraft}
              className="px-3 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors"
              title="Batalkan perubahan draft kembali ke versi live"
            >
              <RotateCcw size={13} />
              Batalkan
            </button>
          )}

          {/* Simpan Draft */}
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={isSavingDraft}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Save size={14} />
            {isSavingDraft ? 'Menyimpan...' : 'Simpan Draft'}
          </button>

          {/* Publikasikan */}
          <button
            type="button"
            onClick={onPublish}
            disabled={isPublishing}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm hover:shadow-md"
          >
            <Send size={14} />
            {isPublishing ? 'Menerbitkan...' : 'Simpan & Publikasikan'}
          </button>

          <div className="w-[1px] h-5 bg-slate-200 mx-1 hidden sm:block" />

          {/* Open Public Page */}
          <button
            type="button"
            onClick={onOpenPublicView}
            className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
            title="Lihat halaman Bio Link publik pengunjung"
          >
            <Eye size={14} />
            <span className="hidden md:inline">Buka Halaman Publik</span>
          </button>

          {/* QR Code */}
          <button
            type="button"
            onClick={onOpenQrCode}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            title="QR Code Toko"
          >
            <QrCode size={16} />
          </button>

          {/* Logout */}
          <button
            type="button"
            onClick={onLogout}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
            title="Keluar dari Admin"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};
