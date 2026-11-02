import React, { useState } from 'react';
import {
  Image as ImageIcon,
  User,
  Sliders,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  BadgeCheck,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  ExternalLink,
  Layers,
  Sparkles,
  Link as LinkIcon,
  Clock,
} from 'lucide-react';
import { ProfileConfig, BannerSlide } from '../../../types/biolink';
import { ImageUploadField } from '../../ui/ImageUploadField';
import { ColorPickerInput } from '../../ui/ColorPickerInput';

interface ProfileTabProps {
  profile: ProfileConfig;
  onChange: (updated: Partial<ProfileConfig>) => void;
}

const BANNER_PRESETS = [
  { label: 'Boutique Store', url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Flash Sale Promo', url: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Gold Luxury', url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Tech & Gadget', url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80' },
];

const AVATAR_PRESETS = [
  { label: 'Model', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
  { label: 'Logo Minimalis', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80' },
  { label: 'Gold Monogram', url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=400&q=80' },
];

export const ProfileTab: React.FC<ProfileTabProps> = ({ profile, onChange }) => {
  const [expandedSlideId, setExpandedSlideId] = useState<string | null>(null);

  // Fallback to legacy single bannerUrl if bannerSlides is empty
  const slides: BannerSlide[] =
    profile.bannerSlides && profile.bannerSlides.length > 0
      ? profile.bannerSlides
      : profile.bannerUrl
      ? [{ id: 'slide-1', imageUrl: profile.bannerUrl, title: 'Banner Utama', enabled: true }]
      : [];

  const updateSlides = (newSlides: BannerSlide[]) => {
    onChange({
      bannerSlides: newSlides,
      // Keep legacy bannerUrl synced with the first active slide
      bannerUrl: newSlides.find((s) => s.enabled)?.imageUrl || newSlides[0]?.imageUrl || '',
    });
  };

  const handleAddSlide = () => {
    const newSlide: BannerSlide = {
      id: `slide-${Date.now()}`,
      imageUrl: BANNER_PRESETS[slides.length % BANNER_PRESETS.length].url,
      title: `Slide Promo ${slides.length + 1}`,
      linkUrl: '',
      enabled: true,
    };
    const updated = [...slides, newSlide];
    updateSlides(updated);
    setExpandedSlideId(newSlide.id);
  };

  const handleUpdateSlide = (id: string, partial: Partial<BannerSlide>) => {
    const updated = slides.map((s) => (s.id === id ? { ...s, ...partial } : s));
    updateSlides(updated);
  };

  const handleDeleteSlide = (id: string) => {
    if (slides.length <= 1) {
      if (!window.confirm('Hapus slide banner ini?')) return;
    }
    const updated = slides.filter((s) => s.id !== id);
    updateSlides(updated);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const items = [...slides];
    const temp = items[index - 1];
    items[index - 1] = items[index];
    items[index] = temp;
    updateSlides(items);
  };

  const handleMoveDown = (index: number) => {
    if (index === slides.length - 1) return;
    const items = [...slides];
    const temp = items[index + 1];
    items[index + 1] = items[index];
    items[index] = temp;
    updateSlides(items);
  };

  const handleToggleSlide = (id: string) => {
    const updated = slides.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s));
    updateSlides(updated);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner Slider (Multi-Slide Carousel & Reorder) */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <Layers size={18} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Header Banner Slide (Carousel)</h3>
              <p className="text-xs text-slate-500">
                Tambahkan beberapa slide banner dan atur urutan tampilannya
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddSlide}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Plus size={14} />
            Tambah Slide Banner
          </button>
        </div>

        {/* Global Slider Settings: Height, Fit, Position, Autoplay & Interval */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
          {/* Height slider */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-xs text-slate-700">
              <span>Tinggi Banner</span>
              <span className="font-mono text-indigo-600 font-semibold">{profile.bannerHeight || 180}px</span>
            </div>
            <input
              type="range"
              min="100"
              max="320"
              step="10"
              value={profile.bannerHeight || 180}
              onChange={(e) => onChange({ bannerHeight: Number(e.target.value) })}
              className="accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Object Fit */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-700 font-medium">Ukuran Gambar (Fit)</label>
            <select
              value={profile.bannerFit || 'cover'}
              onChange={(e) => onChange({ bannerFit: e.target.value as 'cover' | 'contain' })}
              className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
            >
              <option value="cover">Cover (Penuh rapi)</option>
              <option value="contain">Contain (Proporsional utuh)</option>
            </select>
          </div>

          {/* Autoplay Toggle */}
          <div className="flex flex-col gap-1 justify-center">
            <label className="flex items-center gap-2 text-xs text-slate-700 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={profile.bannerAutoSlide ?? true}
                onChange={(e) => onChange({ bannerAutoSlide: e.target.checked })}
                className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
              />
              <span>Slide Otomatis (Auto)</span>
            </label>
            <span className="text-[10px] text-slate-400">Bergeser otomatis antar slide</span>
          </div>

          {/* Interval */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-xs text-slate-700">
              <span className="flex items-center gap-1">
                <Clock size={12} className="text-slate-400" /> Durasi Slide
              </span>
              <span className="font-mono text-indigo-600 font-semibold">{profile.bannerSlideInterval || 4}s</span>
            </div>
            <input
              type="range"
              min="2"
              max="8"
              step="1"
              value={profile.bannerSlideInterval || 4}
              onChange={(e) => onChange({ bannerSlideInterval: Number(e.target.value) })}
              className="accent-indigo-600 cursor-pointer"
            />
          </div>
        </div>

        {/* List of Banner Slides with Reordering */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>Daftar Slide ({slides.length} slide terdaftar):</span>
            <span className="text-[11px] text-slate-400 font-normal">
              Gunakan tombol panah &uarr; &darr; untuk mengatur urutan
            </span>
          </div>

          {slides.map((slide, index) => {
            const isExpanded = expandedSlideId === slide.id;

            return (
              <div
                key={slide.id}
                className={`bg-white rounded-2xl border transition-all ${
                  slide.enabled ? 'border-slate-200/80 shadow-2xs' : 'border-slate-200/50 opacity-60 bg-slate-50/50'
                }`}
              >
                {/* Header Summary */}
                <div className="p-3.5 flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Index badge */}
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>

                    {/* Thumbnail */}
                    <div className="w-16 h-10 rounded-lg overflow-hidden bg-slate-200 shrink-0 border border-slate-300">
                      {slide.imageUrl ? (
                        <img src={slide.imageUrl} alt={slide.title || 'Slide'} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <ImageIcon size={16} />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <h4 className="font-semibold text-xs text-slate-900 truncate">
                        {slide.title || `Slide ${index + 1}`}
                      </h4>
                      {slide.linkUrl && (
                        <span className="text-[11px] text-indigo-600 truncate block flex items-center gap-1">
                          <LinkIcon size={10} /> {slide.linkUrl}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions: Reorder Up/Down, Toggle Active, Delete, Edit */}
                  <div className="flex items-center gap-1">
                    {/* Move Up */}
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveUp(index)}
                      className="p-1.5 text-slate-400 hover:text-slate-800 disabled:opacity-20 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Naikkan Urutan Slide"
                    >
                      <ArrowUp size={15} />
                    </button>

                    {/* Move Down */}
                    <button
                      type="button"
                      disabled={index === slides.length - 1}
                      onClick={() => handleMoveDown(index)}
                      className="p-1.5 text-slate-400 hover:text-slate-800 disabled:opacity-20 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Turunkan Urutan Slide"
                    >
                      <ArrowDown size={15} />
                    </button>

                    {/* Toggle Active */}
                    <button
                      type="button"
                      onClick={() => handleToggleSlide(slide.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        slide.enabled ? 'text-indigo-600 hover:bg-indigo-50' : 'text-slate-400 hover:bg-slate-100'
                      }`}
                      title={slide.enabled ? 'Sembunyikan Slide' : 'Aktifkan Slide'}
                    >
                      {slide.enabled ? <Eye size={15} /> : <EyeOff size={15} />}
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => handleDeleteSlide(slide.id)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Hapus Slide"
                    >
                      <Trash2 size={15} />
                    </button>

                    {/* Expand / Collapse */}
                    <button
                      type="button"
                      onClick={() => setExpandedSlideId(isExpanded ? null : slide.id)}
                      className="px-2.5 py-1 text-indigo-600 hover:bg-indigo-50 rounded-lg text-xs font-semibold transition-colors"
                    >
                      {isExpanded ? 'Tutup' : 'Edit Slide'}
                    </button>
                  </div>
                </div>

                {/* Expanded Slide Editor */}
                {isExpanded && (
                  <div className="p-4 border-t border-slate-100 bg-slate-50/70 rounded-b-2xl space-y-3.5 animate-in fade-in">
                    {/* Image Uploader */}
                    <ImageUploadField
                      label={`Gambar Slide ${index + 1}`}
                      description="Rasio 16:9 atau panorama (min 800x400px)"
                      value={slide.imageUrl}
                      onChange={(url) => handleUpdateSlide(slide.id, { imageUrl: url })}
                      presetImages={BANNER_PRESETS}
                      aspectRatio="banner"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {/* Title Overlay */}
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-700">Judul / Label Promo (Opsional)</label>
                        <input
                          type="text"
                          value={slide.title || ''}
                          onChange={(e) => handleUpdateSlide(slide.id, { title: e.target.value })}
                          placeholder="Contoh: Flash Sale s/d 70%!"
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800"
                        />
                      </div>

                      {/* Destination URL */}
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-700">Tautan Tujuan Saat Diklik (Opsional)</label>
                        <input
                          type="text"
                          value={slide.linkUrl || ''}
                          onChange={(e) => handleUpdateSlide(slide.id, { linkUrl: e.target.value })}
                          placeholder="https://shopee.co.id/..."
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-800"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {slides.length === 0 && (
            <div className="p-6 text-center border-2 border-dashed border-slate-300 rounded-2xl text-slate-400 text-xs">
              Belum ada slide banner. Klik tombol &ldquo;Tambah Slide Banner&rdquo; di atas untuk menambahkan.
            </div>
          )}
        </div>
      </div>

      {/* 2. Foto Profil Section */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <User className="text-indigo-600" size={18} />
          <h3 className="text-sm font-semibold text-slate-900">Foto Profil (Avatar)</h3>
        </div>

        <ImageUploadField
          label="Foto Profil Toko"
          description="Bentuk lingkaran menimpa banner (rekomendasi 1:1 square)"
          value={profile.avatarUrl}
          onChange={(url) => onChange({ avatarUrl: url })}
          presetImages={AVATAR_PRESETS}
          aspectRatio="square"
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* Size slider */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs text-slate-700">
              <span>Ukuran Foto</span>
              <span className="font-mono text-indigo-600 font-semibold">{profile.avatarSize || 100}px</span>
            </div>
            <input
              type="range"
              min="64"
              max="140"
              step="4"
              value={profile.avatarSize || 100}
              onChange={(e) => onChange({ avatarSize: Number(e.target.value) })}
              className="accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Border Width */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs text-slate-700">
              <span>Ketebalan Border</span>
              <span className="font-mono text-indigo-600 font-semibold">{profile.avatarBorderWidth ?? 4}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={profile.avatarBorderWidth ?? 4}
              onChange={(e) => onChange({ avatarBorderWidth: Number(e.target.value) })}
              className="accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Border Color */}
          <ColorPickerInput
            label="Warna Border"
            value={profile.avatarBorderColor || '#ffffff'}
            onChange={(c) => onChange({ avatarBorderColor: c })}
            presets={['#ffffff', '#000000', '#f8fafc', '#e2e8f0', '#fbbf24', '#4f46e5']}
          />
        </div>
      </div>

      {/* 3. Nama Toko & Bio Section */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Type className="text-indigo-600" size={18} />
          <h3 className="text-sm font-semibold text-slate-900">Nama Toko &amp; Bio</h3>
        </div>

        {/* Nama Toko & Verified */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-xs font-medium text-slate-700">Nama Toko / Brand</label>
            <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={profile.isVerified}
                onChange={(e) => onChange({ isVerified: e.target.checked })}
                className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
              />
              <span className="flex items-center gap-1 font-medium text-blue-600">
                <BadgeCheck size={16} className="fill-blue-600 text-white" />
                Badge Verified
              </span>
            </label>
          </div>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="Contoh: NDFSTORE"
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        {/* Typography Settings for Name */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          {/* Font size */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs text-slate-700">
              <span>Ukuran Font Nama</span>
              <span className="font-mono text-indigo-600 font-semibold">{profile.nameFontSize || 24}px</span>
            </div>
            <input
              type="range"
              min="16"
              max="36"
              step="1"
              value={profile.nameFontSize || 24}
              onChange={(e) => onChange({ nameFontSize: Number(e.target.value) })}
              className="accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Weight */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-700 font-medium">Ketebalan Font</label>
            <select
              value={profile.nameFontWeight || 'bold'}
              onChange={(e) => onChange({ nameFontWeight: e.target.value as any })}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
            >
              <option value="normal">Normal</option>
              <option value="medium">Medium</option>
              <option value="semibold">Semi Bold</option>
              <option value="bold">Bold</option>
            </select>
          </div>

          {/* Color */}
          <ColorPickerInput
            label="Warna Teks Nama"
            value={profile.nameColor || '#111827'}
            onChange={(c) => onChange({ nameColor: c })}
            presets={['#111827', '#ffffff', '#0f172a', '#1e293b', '#4f46e5', '#d97706']}
          />
        </div>

        {/* Bio Textarea */}
        <div className="space-y-1.5 pt-2">
          <label className="text-xs font-medium text-slate-700">Deskripsi / Bio Toko (Multi-line)</label>
          <textarea
            rows={4}
            value={profile.bio}
            onChange={(e) => onChange({ bio: e.target.value })}
            placeholder="Tuliskan deskripsi toko, promo spesial, jam operasional, atau slogan brand..."
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        {/* Typography Settings for Bio & Alignment */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          {/* Bio Font Size */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs text-slate-700">
              <span>Ukuran Font Bio</span>
              <span className="font-mono text-indigo-600 font-semibold">{profile.bioFontSize || 13}px</span>
            </div>
            <input
              type="range"
              min="11"
              max="18"
              step="1"
              value={profile.bioFontSize || 13}
              onChange={(e) => onChange({ bioFontSize: Number(e.target.value) })}
              className="accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Text Alignment */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-700 font-medium">Posisi Teks (Align)</label>
            <div className="flex items-center bg-slate-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => onChange({ textAlign: 'left' })}
                className={`flex-1 py-1 flex justify-center rounded ${
                  profile.textAlign === 'left' ? 'bg-white shadow-2xs text-indigo-600' : 'text-slate-500'
                }`}
                title="Rata Kiri"
              >
                <AlignLeft size={15} />
              </button>
              <button
                type="button"
                onClick={() => onChange({ textAlign: 'center' })}
                className={`flex-1 py-1 flex justify-center rounded ${
                  profile.textAlign === 'center' ? 'bg-white shadow-2xs text-indigo-600' : 'text-slate-500'
                }`}
                title="Rata Tengah"
              >
                <AlignCenter size={15} />
              </button>
              <button
                type="button"
                onClick={() => onChange({ textAlign: 'right' })}
                className={`flex-1 py-1 flex justify-center rounded ${
                  profile.textAlign === 'right' ? 'bg-white shadow-2xs text-indigo-600' : 'text-slate-500'
                }`}
                title="Rata Kanan"
              >
                <AlignRight size={15} />
              </button>
            </div>
          </div>

          {/* Bio Color */}
          <ColorPickerInput
            label="Warna Teks Bio"
            value={profile.bioColor || '#4b5563'}
            onChange={(c) => onChange({ bioColor: c })}
            presets={['#4b5563', '#6b7280', '#9ca3af', '#ffffff', '#111827', '#0284c7']}
          />
        </div>
      </div>
    </div>
  );
};
