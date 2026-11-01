import React from 'react';

interface ColorPickerInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  presets?: string[];
  description?: string;
}

const DEFAULT_PRESETS = [
  '#ffffff',
  '#f8fafc',
  '#f1f5f9',
  '#e2e8f0',
  '#111827',
  '#0f172a',
  '#4f46e5',
  '#2563eb',
  '#0284c7',
  '#059669',
  '#d97706',
  '#dc2626',
  '#db2777',
  '#7c3aed',
];

export const ColorPickerInput: React.FC<ColorPickerInputProps> = ({
  label,
  value,
  onChange,
  presets = DEFAULT_PRESETS,
  description,
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-slate-700">{label}</label>
        {description && <span className="text-[11px] text-slate-400">{description}</span>}
      </div>

      <div className="flex items-center gap-2">
        {/* Color input swatch */}
        <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-slate-300 shadow-2xs shrink-0 cursor-pointer">
          <input
            type="color"
            value={value.startsWith('#') && value.length === 7 ? value : '#ffffff'}
            onChange={(e) => onChange(e.target.value)}
            className="absolute -top-2 -left-2 w-14 h-14 cursor-pointer border-0 p-0"
          />
        </div>

        {/* Hex Text Input */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#FFFFFF"
          className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
        />
      </div>

      {/* Preset Swatches */}
      {presets && presets.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          {presets.slice(0, 10).map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => onChange(preset)}
              style={{ backgroundColor: preset }}
              className={`w-5 h-5 rounded-md border transition-all ${
                value.toLowerCase() === preset.toLowerCase()
                  ? 'border-indigo-600 scale-110 shadow-xs ring-1 ring-indigo-500'
                  : 'border-slate-300 hover:scale-105'
              }`}
              title={preset}
            />
          ))}
        </div>
      )}
    </div>
  );
};
