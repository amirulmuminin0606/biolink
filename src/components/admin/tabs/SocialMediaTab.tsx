import React, { useState } from 'react';
import {
  Share2,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Sliders,
  Palette,
  Eye,
  EyeOff,
  GripVertical,
} from 'lucide-react';
import { SocialLink, SocialsConfig, SocialPlatform } from '../../../types/biolink';
import { SocialIconGlyph, BRAND_COLORS } from '../../common/SocialIcons';
import { ColorPickerInput } from '../../ui/ColorPickerInput';
import { ImageUploadField } from '../../ui/ImageUploadField';

interface SocialMediaTabProps {
  socials: SocialLink[];
  config: SocialsConfig;
  onSocialsChange: (socials: SocialLink[]) => void;
  onConfigChange: (config: SocialsConfig) => void;
}

const AVAILABLE_PLATFORMS: { platform: SocialPlatform; label: string; defaultUrl: string }[] = [
  { platform: 'instagram', label: 'Instagram', defaultUrl: 'https://instagram.com/' },
  { platform: 'whatsapp', label: 'WhatsApp', defaultUrl: 'https://wa.me/' },
  { platform: 'tiktok', label: 'TikTok', defaultUrl: 'https://tiktok.com/@' },
  { platform: 'facebook', label: 'Facebook', defaultUrl: 'https://facebook.com/' },
  { platform: 'youtube', label: 'YouTube', defaultUrl: 'https://youtube.com/@' },
  { platform: 'telegram', label: 'Telegram', defaultUrl: 'https://t.me/' },
  { platform: 'email', label: 'Email', defaultUrl: 'mailto:' },
  { platform: 'x', label: 'X (Twitter)', defaultUrl: 'https://x.com/' },
  { platform: 'website', label: 'Website', defaultUrl: 'https://' },
  { platform: 'linkedin', label: 'LinkedIn', defaultUrl: 'https://linkedin.com/in/' },
  { platform: 'spotify', label: 'Spotify', defaultUrl: 'https://open.spotify.com/' },
  { platform: 'discord', label: 'Discord', defaultUrl: 'https://discord.gg/' },
];

export const SocialMediaTab: React.FC<SocialMediaTabProps> = ({
  socials,
  config,
  onSocialsChange,
  onConfigChange,
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform>('instagram');
  const [editingCustomIconId, setEditingCustomIconId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    const updated = socials.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s));
    onSocialsChange(updated);
  };

  const handleUrlChange = (id: string, url: string) => {
    const updated = socials.map((s) => (s.id === id ? { ...s, url } : s));
    onSocialsChange(updated);
  };

  const handleTitleChange = (id: string, title: string) => {
    const updated = socials.map((s) => (s.id === id ? { ...s, title } : s));
    onSocialsChange(updated);
  };

  const handleDelete = (id: string) => {
    const updated = socials.filter((s) => s.id !== id);
    onSocialsChange(updated);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const items = [...socials];
    const temp = items[index - 1];
    items[index - 1] = items[index];
    items[index] = temp;
    onSocialsChange(items);
  };

  const handleMoveDown = (index: number) => {
    if (index === socials.length - 1) return;
    const items = [...socials];
    const temp = items[index + 1];
    items[index + 1] = items[index];
    items[index] = temp;
    onSocialsChange(items);
  };

  const handleAddPlatform = () => {
    const preset = AVAILABLE_PLATFORMS.find((p) => p.platform === selectedPlatform);
    const newSocial: SocialLink = {
      id: `soc-${Date.now()}`,
      platform: selectedPlatform,
      title: preset?.label || 'Social Link',
      url: preset?.defaultUrl || 'https://',
      enabled: true,
    };
    onSocialsChange([...socials, newSocial]);
  };

  const handleCustomIconUpload = (id: string, url: string) => {
    const updated = socials.map((s) => (s.id === id ? { ...s, customIcon: url } : s));
    onSocialsChange(updated);
    setEditingCustomIconId(null);
  };

  return (
    <div className="space-y-6">
      {/* 1. Styling Controls */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Palette className="text-indigo-600" size={18} />
          <h3 className="text-sm font-semibold text-slate-900">Gaya &amp; Tampilan Ikon Media Sosial</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Shape */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-700">Bentuk Ikon</label>
            <select
              value={config.style}
              onChange={(e) => onConfigChange({ ...config, style: e.target.value as any })}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
            >
              <option value="circle">Bulat Penuh (Circle)</option>
              <option value="rounded">Kotak Melengkung (Rounded)</option>
              <option value="pill">Pill (Kapsul)</option>
              <option value="outline">Garis Tepi (Outline)</option>
            </select>
          </div>

          {/* Color Type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-700">Skema Warna</label>
            <select
              value={config.colorType}
              onChange={(e) => onConfigChange({ ...config, colorType: e.target.value as any })}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
            >
              <option value="brand">Warna Resmi Brand (Asli)</option>
              <option value="monochrome">Monokrom Gelap (Black/Slate)</option>
              <option value="custom">Warna Kustom</option>
            </select>
          </div>

          {/* Size */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-700">Ukuran Ikon</label>
            <select
              value={config.size}
              onChange={(e) => onConfigChange({ ...config, size: e.target.value as any })}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
            >
              <option value="sm">Kecil (Small - 32px)</option>
              <option value="md">Sedang (Medium - 40px)</option>
              <option value="lg">Besar (Large - 48px)</option>
            </select>
          </div>
        </div>

        {/* Custom Color Pickers if colorType === 'custom' */}
        {config.colorType === 'custom' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <ColorPickerInput
              label="Warna Ikon"
              value={config.customColor}
              onChange={(c) => onConfigChange({ ...config, customColor: c })}
              presets={['#ffffff', '#111827', '#4f46e5', '#2563eb', '#10b981']}
            />
            <ColorPickerInput
              label="Warna Background Ikon"
              value={config.customBg}
              onChange={(c) => onConfigChange({ ...config, customBg: c })}
              presets={['#1f2937', '#0f172a', '#3b82f6', '#ec4899', '#f59e0b']}
            />
          </div>
        )}
      </div>

      {/* 2. Add New Platform */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value as SocialPlatform)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
          >
            {AVAILABLE_PLATFORMS.map((p) => (
              <option key={p.platform} value={p.platform}>
                + {p.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleAddPlatform}
            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Plus size={14} />
            Tambah Ikon
          </button>
        </div>
        <span className="text-xs text-slate-400">
          Urutkan posisi ikon dengan tombol panah naik/turun
        </span>
      </div>

      {/* 3. List of Social Media Links */}
      <div className="space-y-3">
        {socials.map((social, index) => (
          <div
            key={social.id}
            className={`p-4 bg-white rounded-2xl border transition-all ${
              social.enabled ? 'border-slate-200/80 shadow-2xs' : 'border-slate-200/50 opacity-60 bg-slate-50/50'
            }`}
          >
            <div className="flex items-center justify-between gap-3 flex-wrap">
              {/* Left Platform Info */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 shrink-0">
                  {social.customIcon ? (
                    <img src={social.customIcon} alt={social.title} className="w-5 h-5 object-contain" />
                  ) : (
                    <SocialIconGlyph platform={social.platform} size={18} />
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    value={social.title}
                    onChange={(e) => handleTitleChange(social.id, e.target.value)}
                    className="font-semibold text-xs text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-hidden"
                  />
                  <span className="text-[11px] text-slate-400 block capitalize">{social.platform}</span>
                </div>
              </div>

              {/* Actions: Enable, Reorder, Custom Icon, Delete */}
              <div className="flex items-center gap-1">
                {/* Custom Icon Trigger */}
                <button
                  type="button"
                  onClick={() => setEditingCustomIconId(editingCustomIconId === social.id ? null : social.id)}
                  className="px-2 py-1 text-slate-600 hover:bg-slate-100 rounded-lg text-[11px] font-medium transition-colors"
                  title="Upload Ikon Sendiri"
                >
                  {social.customIcon ? 'Ganti Ikon' : 'Upload Ikon'}
                </button>

                {/* Move Up */}
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => handleMoveUp(index)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-20 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Pindah ke Atas"
                >
                  <ArrowUp size={14} />
                </button>

                {/* Move Down */}
                <button
                  type="button"
                  disabled={index === socials.length - 1}
                  onClick={() => handleMoveDown(index)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-20 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Pindah ke Bawah"
                >
                  <ArrowDown size={14} />
                </button>

                {/* Toggle Active */}
                <button
                  type="button"
                  onClick={() => handleToggle(social.id)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    social.enabled ? 'text-indigo-600 hover:bg-indigo-50' : 'text-slate-400 hover:bg-slate-100'
                  }`}
                  title={social.enabled ? 'Sembunyikan' : 'Tampilkan'}
                >
                  {social.enabled ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => handleDelete(social.id)}
                  className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Hapus"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            {/* Custom Icon Upload Box if open */}
            {editingCustomIconId === social.id && (
              <div className="mt-3 pt-3 border-t border-slate-100">
                <ImageUploadField
                  label={`Upload Ikon Kustom untuk ${social.title}`}
                  description="Format PNG transparan atau SVG diutamakan"
                  value={social.customIcon || ''}
                  onChange={(url) => handleCustomIconUpload(social.id, url)}
                  aspectRatio="square"
                />
              </div>
            )}

            {/* URL Input */}
            <div className="mt-2.5">
              <input
                type="text"
                value={social.url}
                onChange={(e) => handleUrlChange(social.id, e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-1.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
