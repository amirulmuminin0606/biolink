import React, { useState } from 'react';
import {
  Link2,
  Plus,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Sparkles,
  ExternalLink,
  Upload,
  ShoppingBag,
  Store,
  MessageCircle,
  Package,
  Globe,
  Sliders,
} from 'lucide-react';
import { BioButtonLink } from '../../../types/biolink';
import { LinkLogoOrIcon } from '../../common/ButtonIcons';
import { ImageUploadField } from '../../ui/ImageUploadField';
import { ColorPickerInput } from '../../ui/ColorPickerInput';

interface LinksTabProps {
  links: BioButtonLink[];
  onLinksChange: (links: BioButtonLink[]) => void;
}

const TEMPLATE_PRESETS = [
  {
    title: 'Shopee Official Store',
    subtitle: 'Diskon s/d 70% + Gratis Ongkir Xtra',
    url: 'https://shopee.co.id/ndfstore',
    logoUrl: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/shopee.png',
  },
  {
    title: 'TikTok Shop Catalog',
    subtitle: 'Live Shopping Setiap Hari Jam 19.00 WIB',
    url: 'https://tiktok.com/@ndfstore',
    logoUrl: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/tiktok.png',
  },
  {
    title: 'Tokopedia Official',
    subtitle: 'Cashback Spesial & Pengiriman Cepat',
    url: 'https://tokopedia.com/ndfstore',
    logoUrl: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/tokopedia.png',
  },
  {
    title: 'Lazada Mall',
    subtitle: 'Official Flagship Store Garansi 100% Ori',
    url: 'https://lazada.co.id/shop/ndfstore',
    logoUrl: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/lazada.png',
  },
  {
    title: 'Website Official',
    subtitle: 'Koleksi lengkap & Poin Member',
    url: 'https://ndfstore.com',
    iconName: 'Globe',
  },
  {
    title: 'Customer Service WhatsApp',
    subtitle: 'Tanya Produk & Konfirmasi Pesanan',
    url: 'https://wa.me/6281234567890',
    iconName: 'MessageCircle',
  },
];

export const LinksTab: React.FC<LinksTabProps> = ({ links, onLinksChange }) => {
  const [editingLogoId, setEditingLogoId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    onLinksChange(links.map((l) => (l.id === id ? { ...l, enabled: !l.enabled } : l)));
  };

  const handleUpdate = (id: string, updated: Partial<BioButtonLink>) => {
    onLinksChange(links.map((l) => (l.id === id ? { ...l, ...updated } : l)));
  };

  const handleDelete = (id: string) => {
    onLinksChange(links.filter((l) => l.id !== id));
  };

  const handleDuplicate = (link: BioButtonLink) => {
    const copy: BioButtonLink = {
      ...link,
      id: `link-${Date.now()}`,
      title: `${link.title} (Salinan)`,
      clicks: 0,
    };
    onLinksChange([...links, copy]);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const items = [...links];
    const temp = items[index - 1];
    items[index - 1] = items[index];
    items[index] = temp;
    onLinksChange(items);
  };

  const handleMoveDown = (index: number) => {
    if (index === links.length - 1) return;
    const items = [...links];
    const temp = items[index + 1];
    items[index + 1] = items[index];
    items[index] = temp;
    onLinksChange(items);
  };

  const handleAddLink = () => {
    const newLink: BioButtonLink = {
      id: `link-${Date.now()}`,
      title: 'Tautan Baru',
      subtitle: 'Keterangan singkat / promo',
      url: 'https://',
      enabled: true,
      clicks: 0,
      openNewTab: true,
    };
    onLinksChange([...links, newLink]);
    setExpandedId(newLink.id);
  };

  const handleAddPreset = (preset: typeof TEMPLATE_PRESETS[0]) => {
    const newLink: BioButtonLink = {
      id: `link-${Date.now()}`,
      title: preset.title,
      subtitle: preset.subtitle,
      url: preset.url,
      logoUrl: preset.logoUrl || '',
      iconName: preset.iconName || '',
      enabled: true,
      clicks: 0,
      openNewTab: true,
    };
    onLinksChange([...links, newLink]);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Daftar Tombol Link</h3>
          <p className="text-xs text-slate-500">
            {links.length} tautan terdaftar ({links.filter((l) => l.enabled).length} aktif)
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddLink}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
        >
          <Plus size={15} />
          Tambah Link Baru
        </button>
      </div>

      {/* Preset Fast Add Section */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
        <span className="text-xs font-semibold text-slate-700 block mb-2">
          Tambah Cepat Dari Template Populer:
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          {TEMPLATE_PRESETS.map((t, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleAddPreset(t)}
              className="px-2.5 py-1.5 bg-white border border-slate-200 hover:border-indigo-400 hover:text-indigo-600 rounded-lg text-xs font-medium text-slate-700 transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Plus size={12} className="text-indigo-600" />
              {t.title}
            </button>
          ))}
        </div>
      </div>

      {/* List of Links */}
      <div className="space-y-3.5">
        {links.map((link, index) => {
          const isExpanded = expandedId === link.id;

          return (
            <div
              key={link.id}
              className={`bg-white rounded-2xl border transition-all ${
                link.enabled ? 'border-slate-200/80 shadow-2xs' : 'border-slate-200/50 opacity-60 bg-slate-50/50'
              }`}
            >
              {/* Header / Summary Bar */}
              <div className="p-4 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                    <LinkLogoOrIcon
                      logoUrl={link.logoUrl}
                      iconName={link.iconName}
                      title={link.title}
                      className="w-7 h-7"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-xs text-slate-900 truncate">{link.title}</h4>
                      {link.highlight && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700">
                          {link.highlightText || 'PROMO'}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 truncate max-w-xs">{link.url}</p>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-1">
                  {/* Reorder */}
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => handleMoveUp(index)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-20 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Pindah ke Atas"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    disabled={index === links.length - 1}
                    onClick={() => handleMoveDown(index)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-20 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Pindah ke Bawah"
                  >
                    <ArrowDown size={14} />
                  </button>

                  {/* Toggle Active */}
                  <button
                    type="button"
                    onClick={() => handleToggle(link.id)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      link.enabled ? 'text-indigo-600 hover:bg-indigo-50' : 'text-slate-400 hover:bg-slate-100'
                    }`}
                    title={link.enabled ? 'Sembunyikan' : 'Tampilkan'}
                  >
                    {link.enabled ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>

                  {/* Duplicate */}
                  <button
                    type="button"
                    onClick={() => handleDuplicate(link)}
                    className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Duplikat Link"
                  >
                    <Copy size={14} />
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => handleDelete(link.id)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Hapus Link"
                  >
                    <Trash2 size={14} />
                  </button>

                  {/* Expand / Details */}
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : link.id)}
                    className="px-2.5 py-1 text-indigo-600 hover:bg-indigo-50 rounded-lg text-xs font-semibold transition-colors"
                  >
                    {isExpanded ? 'Tutup' : 'Edit'}
                  </button>
                </div>
              </div>

              {/* Expanded Detail Editor */}
              {isExpanded && (
                <div className="p-4 border-t border-slate-100 bg-slate-50/70 rounded-b-2xl space-y-4 animate-in fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Title */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-700">Judul Tautan (Label)</label>
                      <input
                        type="text"
                        value={link.title}
                        onChange={(e) => handleUpdate(link.id, { title: e.target.value })}
                        placeholder="Contoh: Shopee Official Store"
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800"
                      />
                    </div>

                    {/* Subtitle */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-700">Sub-judul / Deskripsi Pendek</label>
                      <input
                        type="text"
                        value={link.subtitle || ''}
                        onChange={(e) => handleUpdate(link.id, { subtitle: e.target.value })}
                        placeholder="Contoh: Diskon s/d 70% + Gratis Ongkir"
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800"
                      />
                    </div>
                  </div>

                  {/* URL */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">URL Tujuan</label>
                    <input
                      type="text"
                      value={link.url}
                      onChange={(e) => handleUpdate(link.id, { url: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-800"
                    />
                  </div>

                  {/* Logo / Thumbnail Upload */}
                  <div className="space-y-2">
                    <ImageUploadField
                      label="Logo / Gambar Ikon Tautan"
                      description="Upload logo brand, logo toko, atau icon khusus"
                      value={link.logoUrl || ''}
                      onChange={(url) => handleUpdate(link.id, { logoUrl: url })}
                      aspectRatio="square"
                    />
                  </div>

                  {/* Extra Options: Highlight Ribbon & Target Blank */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200/60">
                    {/* Highlight Promo Badge */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-xs text-slate-700 font-medium cursor-pointer">
                        <input
                          type="checkbox"
                          checked={link.highlight || false}
                          onChange={(e) => handleUpdate(link.id, { highlight: e.target.checked })}
                          className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                        />
                        <span>Aktifkan Pita Promo / Badge Menarik</span>
                      </label>
                      {link.highlight && (
                        <input
                          type="text"
                          value={link.highlightText || ''}
                          onChange={(e) => handleUpdate(link.id, { highlightText: e.target.value })}
                          placeholder="FLASH SALE / BEST SELLER / PROMO"
                          className="w-full px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
                        />
                      )}
                    </div>

                    {/* Open in new tab */}
                    <div className="flex flex-col justify-center">
                      <label className="flex items-center gap-2 text-xs text-slate-700 font-medium cursor-pointer">
                        <input
                          type="checkbox"
                          checked={link.openNewTab}
                          onChange={(e) => handleUpdate(link.id, { openNewTab: e.target.checked })}
                          className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                        />
                        <span>Buka Tautan di Tab Baru (_blank)</span>
                      </label>
                      <span className="text-[11px] text-slate-400 mt-1">
                        Pengunjung tidak meninggalkan halaman bio link Anda
                      </span>
                    </div>
                  </div>

                  {/* Custom color override */}
                  <div className="pt-2 border-t border-slate-200/60 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ColorPickerInput
                      label="Kustom Background Tombol (Opsional)"
                      value={link.customBgColor || ''}
                      onChange={(c) => handleUpdate(link.id, { customBgColor: c })}
                      description="Kosongkan jika mengikuti tema"
                      presets={['', '#ffffff', '#EE4D2D', '#03AC0E', '#000000', '#25D366']}
                    />
                    <ColorPickerInput
                      label="Kustom Warna Teks (Opsional)"
                      value={link.customTextColor || ''}
                      onChange={(c) => handleUpdate(link.id, { customTextColor: c })}
                      description="Kosongkan jika mengikuti tema"
                      presets={['', '#111827', '#ffffff', '#f8fafc']}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
