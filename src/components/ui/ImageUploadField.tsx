import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, Trash2, Link, Sparkles, Check } from 'lucide-react';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  presetImages?: { label: string; url: string }[];
  description?: string;
  accept?: string;
  aspectRatio?: 'banner' | 'square' | 'any';
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  value,
  onChange,
  presetImages = [],
  description,
  aspectRatio = 'any',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [inputUrl, setInputUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type: JPG, JPEG, PNG, WEBP
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!allowed.includes(file.type)) {
      setErrorMsg('Format file tidak didukung. Harap upload JPG, JPEG, PNG, atau WEBP.');
      return;
    }

    // Limit to 5MB
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Ukuran file terlalu besar. Maksimal 5MB.');
      return;
    }

    setErrorMsg('');
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        onChange(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    if (inputUrl.trim()) {
      onChange(inputUrl.trim());
      setShowUrlInput(false);
      setInputUrl('');
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-slate-700">{label}</label>
        {description && <span className="text-[11px] text-slate-400">{description}</span>}
      </div>

      {/* Preview Card */}
      <div className="flex items-center gap-3 p-2 bg-slate-50 border border-slate-200 rounded-xl">
        <div
          className={`relative overflow-hidden bg-slate-200 border border-slate-300 flex items-center justify-center shrink-0 ${
            aspectRatio === 'square' ? 'w-14 h-14 rounded-full' : 'w-20 h-12 rounded-lg'
          }`}
        >
          {value ? (
            <img src={value} alt={label} className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="text-slate-400" size={20} />
          )}
        </div>

        <div className="flex-1 flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Upload size={13} />
              Upload Gambar
            </button>
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Link size={13} />
              URL
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="px-2 py-1 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
                title="Hapus Gambar"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
          <span className="text-[10px] text-slate-400 truncate">
            {value ? 'Gambar aktif terpasang' : 'Belum ada gambar (JPG, PNG, WEBP maks 5MB)'}
          </span>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/jpg"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {errorMsg && (
        <p className="text-xs text-rose-500 font-medium px-1">{errorMsg}</p>
      )}

      {/* URL Input Dropdown */}
      {showUrlInput && (
        <div className="flex items-center gap-2 p-2 bg-indigo-50/60 border border-indigo-100 rounded-lg animate-in fade-in">
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="flex-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
          />
          <button
            type="button"
            onClick={handleApplyUrl}
            className="px-3 py-1.5 bg-indigo-600 text-white rounded-md text-xs font-medium hover:bg-indigo-700 transition-colors"
          >
            Terapkan
          </button>
        </div>
      )}

      {/* Preset Swatches if available */}
      {presetImages.length > 0 && (
        <div className="flex items-center gap-2 pt-1 flex-wrap">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Sparkles size={11} /> Preset:
          </span>
          {presetImages.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onChange(p.url)}
              className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 transition-colors border border-slate-200"
            >
              {p.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
