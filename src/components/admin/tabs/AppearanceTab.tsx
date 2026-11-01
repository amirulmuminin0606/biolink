import React from 'react';
import {
  Palette,
  Sliders,
  Type,
  Layout,
  Sparkles,
  Image as ImageIcon,
  MousePointer,
  Square,
  Circle,
} from 'lucide-react';
import { ThemeConfig, FooterConfig } from '../../../types/biolink';
import { ColorPickerInput } from '../../ui/ColorPickerInput';
import { ImageUploadField } from '../../ui/ImageUploadField';

interface AppearanceTabProps {
  theme: ThemeConfig;
  footer: FooterConfig;
  onThemeChange: (updated: Partial<ThemeConfig>) => void;
  onFooterChange: (updated: Partial<FooterConfig>) => void;
}

const GRADIENT_PRESETS = [
  { label: 'Slate Clean', from: '#f1f5f9', to: '#e2e8f0' },
  { label: 'Midnight Blue', from: '#0f172a', to: '#1e293b' },
  { label: 'Sunset Glow', from: '#ffedd5', to: '#fed7aa' },
  { label: 'Rose Aura', from: '#fce7f3', to: '#fbcfe8' },
  { label: 'Emerald Mint', from: '#ecfdf5', to: '#d1fae5' },
  { label: 'Cyber Violet', from: '#2e1065', to: '#581c87' },
  { label: 'Warm Amber', from: '#fffbeb', to: '#fef3c7' },
  { label: 'Pure Dark', from: '#18181b', to: '#09090b' },
];

const BG_IMAGE_PRESETS = [
  { label: 'Minimalist Studio', url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Dark Texture', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Warm Pastel', url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80' },
];

export const AppearanceTab: React.FC<AppearanceTabProps> = ({
  theme,
  footer,
  onThemeChange,
  onFooterChange,
}) => {
  return (
    <div className="space-y-6">
      {/* 1. Background Customization */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Palette className="text-indigo-600" size={18} />
          <h3 className="text-sm font-semibold text-slate-900">Customisasi Background</h3>
        </div>

        {/* Background Type Selector */}
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => onThemeChange({ backgroundType: 'solid' })}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              theme.backgroundType === 'solid' ? 'bg-white shadow-2xs text-slate-900' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            A. Warna Solid
          </button>
          <button
            type="button"
            onClick={() => onThemeChange({ backgroundType: 'gradient' })}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              theme.backgroundType === 'gradient' ? 'bg-white shadow-2xs text-slate-900' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            B. Gradient
          </button>
          <button
            type="button"
            onClick={() => onThemeChange({ backgroundType: 'image' })}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              theme.backgroundType === 'image' ? 'bg-white shadow-2xs text-slate-900' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            C. Background Gambar
          </button>
        </div>

        {/* Option A: Solid */}
        {theme.backgroundType === 'solid' && (
          <div className="space-y-3 pt-2">
            <ColorPickerInput
              label="Warna Background Utama"
              value={theme.solidColor || '#f8fafc'}
              onChange={(c) => onThemeChange({ solidColor: c })}
              presets={['#f8fafc', '#ffffff', '#0f172a', '#111827', '#fdf4ff', '#eff6ff', '#ecfdf5', '#fff7ed']}
            />
          </div>
        )}

        {/* Option B: Gradient */}
        {theme.backgroundType === 'gradient' && (
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ColorPickerInput
                label="Warna Mulai (Gradient From)"
                value={theme.gradientFrom}
                onChange={(c) => onThemeChange({ gradientFrom: c })}
              />
              <ColorPickerInput
                label="Warna Selesai (Gradient To)"
                value={theme.gradientTo}
                onChange={(c) => onThemeChange({ gradientTo: c })}
              />
            </div>

            {/* Direction */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-700">Arah Gradient</label>
              <select
                value={theme.gradientDirection}
                onChange={(e) => onThemeChange({ gradientDirection: e.target.value as any })}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
              >
                <option value="to-b">Vertikal ke Bawah (Top to Bottom)</option>
                <option value="to-r">Horizontal ke Kanan (Left to Right)</option>
                <option value="to-br">Diagonal Miring (Top-Left to Bottom-Right)</option>
                <option value="to-tr">Diagonal Naik (Bottom-Left to Top-Right)</option>
                <option value="radial">Radial Melingkar (Center Outward)</option>
              </select>
            </div>

            {/* Quick Presets */}
            <div className="space-y-1.5 pt-2">
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <Sparkles size={12} /> Pilihan Gradient Populer:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {GRADIENT_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onThemeChange({ gradientFrom: p.from, gradientTo: p.to })}
                    style={{ background: `linear-gradient(135deg, ${p.from}, ${p.to})` }}
                    className="p-2.5 rounded-xl border border-slate-200/80 text-[11px] font-semibold text-slate-800 text-left shadow-2xs hover:scale-105 transition-transform"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Option C: Image Background */}
        {theme.backgroundType === 'image' && (
          <div className="space-y-4 pt-2">
            <ImageUploadField
              label="Upload Background Gambar"
              description="Gambar bertekstur, foto toko, atau wallpaper estetik"
              value={theme.backgroundImage || ''}
              onChange={(url) => onThemeChange({ backgroundImage: url })}
              presetImages={BG_IMAGE_PRESETS}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Size */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-700">Ukuran Gambar (Size)</label>
                <select
                  value={theme.bgImageSize}
                  onChange={(e) => onThemeChange({ bgImageSize: e.target.value as any })}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
                >
                  <option value="cover">Cover (Menutupi seluruh layar)</option>
                  <option value="contain">Contain (Proporsional penuh)</option>
                  <option value="repeat">Repeat (Pola berulang)</option>
                </select>
              </div>

              {/* Position */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-700">Posisi Gambar</label>
                <select
                  value={theme.bgImagePosition}
                  onChange={(e) => onThemeChange({ bgImagePosition: e.target.value })}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
                >
                  <option value="center">Tengah (Center)</option>
                  <option value="top">Atas (Top)</option>
                  <option value="bottom">Bawah (Bottom)</option>
                </select>
              </div>
            </div>

            {/* Overlay Opacity */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
              <div className="flex justify-between text-xs text-slate-700">
                <span>Transparansi Lapisan Gelap/Terang (Overlay)</span>
                <span className="font-mono text-indigo-600">{theme.bgOverlayOpacity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                step="5"
                value={theme.bgOverlayOpacity}
                onChange={(e) => onThemeChange({ bgOverlayOpacity: Number(e.target.value) })}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <ColorPickerInput
                label="Warna Overlay"
                value={theme.bgOverlayColor || '#000000'}
                onChange={(c) => onThemeChange({ bgOverlayColor: c })}
                presets={['#000000', '#ffffff', '#0f172a']}
              />
            </div>
          </div>
        )}
      </div>

      {/* 2. Typography & Fonts */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Type className="text-indigo-600" size={18} />
          <h3 className="text-sm font-semibold text-slate-900">Jenis Font (Typography)</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {[
            { id: 'Plus Jakarta Sans', label: 'Plus Jakarta Sans (Modern Clean)' },
            { id: 'Inter', label: 'Inter (Minimalist Tech)' },
            { id: 'Poppins', label: 'Poppins (Playful Friendly)' },
            { id: 'Montserrat', label: 'Montserrat (Bold Fashion)' },
            { id: 'Playfair Display', label: 'Playfair (Luxury Gold)' },
            { id: 'Roboto', label: 'Roboto (Standard Clean)' },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => onThemeChange({ fontFamily: f.id as any })}
              className={`p-3 rounded-xl border text-left transition-all ${
                theme.fontFamily === f.id
                  ? 'border-indigo-600 bg-indigo-50/50 shadow-2xs text-indigo-900 font-bold'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <span className="text-xs block">{f.label}</span>
              <span className="text-[11px] text-slate-400 mt-1 block font-mono">The quick brown fox</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Button Styles & Appearance */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Layout className="text-indigo-600" size={18} />
          <h3 className="text-sm font-semibold text-slate-900">Gaya &amp; Bentuk Tombol Link</h3>
        </div>

        {/* Button Style Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[
            { id: 'shadow', label: 'Elevated Shadow' },
            { id: 'solid', label: 'Solid Minimal' },
            { id: 'outline', label: 'Outline Modern' },
            { id: 'glass', label: 'Frosted Glass' },
          ].map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onThemeChange({ buttonStyle: s.id as any })}
              className={`p-3 rounded-xl border text-center transition-all ${
                theme.buttonStyle === s.id
                  ? 'border-indigo-600 bg-indigo-50/50 shadow-2xs text-indigo-900 font-bold'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <span className="text-xs">{s.label}</span>
            </button>
          ))}
        </div>

        {/* Colors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <ColorPickerInput
            label="Warna Background Tombol"
            value={theme.buttonBgColor}
            onChange={(c) => onThemeChange({ buttonBgColor: c })}
            presets={['#ffffff', '#111827', '#0f172a', '#4f46e5', '#f8fafc', '#EE4D2D']}
          />
          <ColorPickerInput
            label="Warna Teks Tombol"
            value={theme.buttonTextColor}
            onChange={(c) => onThemeChange({ buttonTextColor: c })}
            presets={['#111827', '#ffffff', '#4f46e5', '#374151']}
          />
          <ColorPickerInput
            label="Warna Border Tombol"
            value={theme.buttonBorderColor}
            onChange={(c) => onThemeChange({ buttonBorderColor: c })}
            presets={['#e5e7eb', '#d1d5db', '#ffffff', '#111827', '#6366f1']}
          />
        </div>

        {/* Radius, Spacing, Padding */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
          {/* Radius */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs text-slate-700">
              <span>Radius Sudut (Rounded)</span>
              <span className="font-mono text-indigo-600">
                {theme.buttonBorderRadius >= 9000 ? 'Pill (Kapsul)' : `${theme.buttonBorderRadius}px`}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="32"
              step="4"
              value={theme.buttonBorderRadius > 32 ? 32 : theme.buttonBorderRadius}
              onChange={(e) => onThemeChange({ buttonBorderRadius: Number(e.target.value) })}
              className="accent-indigo-600 cursor-pointer"
            />
            <button
              type="button"
              onClick={() => onThemeChange({ buttonBorderRadius: 9999 })}
              className="text-[11px] text-indigo-600 hover:underline text-left mt-0.5"
            >
              Set ke Pill Penuh (Kapsul)
            </button>
          </div>

          {/* Spacing */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs text-slate-700">
              <span>Jarak Antar Tombol</span>
              <span className="font-mono text-indigo-600">{theme.buttonSpacing}px</span>
            </div>
            <input
              type="range"
              min="8"
              max="28"
              step="2"
              value={theme.buttonSpacing}
              onChange={(e) => onThemeChange({ buttonSpacing: Number(e.target.value) })}
              className="accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Padding Vertical */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs text-slate-700">
              <span>Tinggi Tombol (Padding)</span>
              <span className="font-mono text-indigo-600">{theme.buttonPaddingY}px</span>
            </div>
            <input
              type="range"
              min="10"
              max="22"
              step="2"
              value={theme.buttonPaddingY}
              onChange={(e) => onThemeChange({ buttonPaddingY: Number(e.target.value) })}
              className="accent-indigo-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Width & Hover effect */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-700">Lebar Tombol</label>
            <select
              value={theme.buttonWidth}
              onChange={(e) => onThemeChange({ buttonWidth: e.target.value as any })}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
            >
              <option value="full">Lebar Penuh (Full Width 100%)</option>
              <option value="compact">Kompak (Compact Centered)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-700">Efek Hover Kursor</label>
            <select
              value={theme.buttonHoverEffect}
              onChange={(e) => onThemeChange({ buttonHoverEffect: e.target.value as any })}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
            >
              <option value="lift">Lift (Melayang ke Atas)</option>
              <option value="scale">Scale (Membesar Halus)</option>
              <option value="glow">Glow Ring (Cahaya Berpendar)</option>
              <option value="none">Tanpa Animasi</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Footer Customization */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-900">Customisasi Footer</h3>
          </div>
          <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={footer.enabled}
              onChange={(e) => onFooterChange({ enabled: e.target.checked })}
              className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
            />
            <span>Aktifkan Footer</span>
          </label>
        </div>

        {footer.enabled && (
          <div className="space-y-4 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">Nama Brand / Toko</label>
                <input
                  type="text"
                  value={footer.brandName}
                  onChange={(e) => onFooterChange({ brandName: e.target.value })}
                  placeholder="NDFSTORE"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">Tahun Copyright</label>
                <input
                  type="text"
                  value={footer.copyrightYear}
                  onChange={(e) => onFooterChange({ copyrightYear: e.target.value })}
                  placeholder="2026"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">Teks Tambahan Footer</label>
              <input
                type="text"
                value={footer.text}
                onChange={(e) => onFooterChange({ text: e.target.value })}
                placeholder="All Rights Reserved."
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <ColorPickerInput
                label="Warna Tulisan Footer"
                value={footer.textColor}
                onChange={(c) => onFooterChange({ textColor: c })}
                presets={['#9ca3af', '#6b7280', '#111827', '#ffffff', '#cbd5e1']}
              />
              <ColorPickerInput
                label="Background Footer"
                value={footer.bgColor || 'transparent'}
                onChange={(c) => onFooterChange({ bgColor: c })}
                presets={['transparent', '#ffffff', '#0f172a', '#111827', '#f8fafc']}
              />
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs text-slate-700">
                  <span>Ukuran Font</span>
                  <span className="font-mono text-indigo-600">{footer.fontSize}px</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="16"
                  step="1"
                  value={footer.fontSize}
                  onChange={(e) => onFooterChange({ fontSize: Number(e.target.value) })}
                  className="accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
