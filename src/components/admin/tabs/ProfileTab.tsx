import React from 'react';
import {
  Image as ImageIcon,
  User,
  Sliders,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  BadgeCheck,
} from 'lucide-react';
import { ProfileConfig } from '../../../types/biolink';
import { ImageUploadField } from '../../ui/ImageUploadField';
import { ColorPickerInput } from '../../ui/ColorPickerInput';

interface ProfileTabProps {
  profile: ProfileConfig;
  onChange: (updated: Partial<ProfileConfig>) => void;
}

const BANNER_PRESETS = [
  { label: 'Boutique Store', url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Modern Aesthetic', url: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Gold Luxury', url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Tech & Gadget', url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80' },
];

const AVATAR_PRESETS = [
  { label: 'Model', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
  { label: 'Logo Minimalis', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80' },
  { label: 'Gold Monogram', url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=400&q=80' },
];

export const ProfileTab: React.FC<ProfileTabProps> = ({ profile, onChange }) => {
  return (
    <div className="space-y-6">
      {/* 1. Banner Header Section */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <ImageIcon className="text-indigo-600" size={18} />
          <h3 className="text-sm font-semibold text-slate-900">Header Banner</h3>
        </div>

        <ImageUploadField
          label="Gambar Banner Toko"
          description="Rekomendasi rasio 16:9 atau panorama (min 800x400px)"
          value={profile.bannerUrl}
          onChange={(url) => onChange({ bannerUrl: url })}
          presetImages={BANNER_PRESETS}
          aspectRatio="banner"
        />

        {profile.bannerUrl && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {/* Height slider */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs text-slate-700">
                <span>Tinggi Banner</span>
                <span className="font-mono text-indigo-600">{profile.bannerHeight || 180}px</span>
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
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-slate-700 font-medium">Ukuran Gambar (Fit)</label>
              <select
                value={profile.bannerFit || 'cover'}
                onChange={(e) => onChange({ bannerFit: e.target.value as 'cover' | 'contain' })}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
              >
                <option value="cover">Cover (Penuh rapi)</option>
                <option value="contain">Contain (Utuh)</option>
              </select>
            </div>

            {/* Object Position */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-slate-700 font-medium">Posisi Banner</label>
              <select
                value={profile.bannerPosition || 'center'}
                onChange={(e) => onChange({ bannerPosition: e.target.value as 'center' | 'top' | 'bottom' })}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
              >
                <option value="center">Tengah (Center)</option>
                <option value="top">Atas (Top)</option>
                <option value="bottom">Bawah (Bottom)</option>
              </select>
            </div>
          </div>
        )}
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
              <span className="font-mono text-indigo-600">{profile.avatarSize || 100}px</span>
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
              <span className="font-mono text-indigo-600">{profile.avatarBorderWidth ?? 4}px</span>
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
              <span className="font-mono text-indigo-600">{profile.nameFontSize || 24}px</span>
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
              <span className="font-mono text-indigo-600">{profile.bioFontSize || 13}px</span>
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
