import React, { useState } from 'react';
import {
  Smartphone,
  Tablet,
  Monitor,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ExternalLink,
  Wifi,
  Battery,
  Signal,
  Eye,
} from 'lucide-react';
import { BioLinkData } from '../../types/biolink';
import { PublicBioView } from '../public/PublicBioView';

interface PhoneSimulatorProps {
  data: BioLinkData;
  publicUrl: string;
  onOpenNewTab: () => void;
  isDraftModified?: boolean;
}

export type DeviceMode = 'mobile' | 'tablet' | 'desktop';

export const PhoneSimulator: React.FC<PhoneSimulatorProps> = ({
  data,
  publicUrl,
  onOpenNewTab,
  isDraftModified = false,
}) => {
  const [device, setDevice] = useState<DeviceMode>('mobile');
  const [zoom, setZoom] = useState<number>(100);
  const [key, setKey] = useState<number>(0);

  const handleZoomIn = () => {
    if (zoom < 125) setZoom((prev) => prev + 10);
  };

  const handleZoomOut = () => {
    if (zoom > 70) setZoom((prev) => prev - 10);
  };

  const handleRefresh = () => {
    setKey((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800/80 p-3 sm:p-4 select-none">
      {/* Top Simulator Toolbar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 flex-wrap gap-2">
        {/* Device Switcher */}
        <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setDevice('mobile')}
            title="Tampilan Smartphone"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              device === 'mobile'
                ? 'bg-indigo-600 text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone size={14} />
            <span className="hidden sm:inline">Mobile</span>
          </button>
          <button
            onClick={() => setDevice('tablet')}
            title="Tampilan Tablet"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              device === 'tablet'
                ? 'bg-indigo-600 text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Tablet size={14} />
            <span className="hidden sm:inline">Tablet</span>
          </button>
          <button
            onClick={() => setDevice('desktop')}
            title="Tampilan Desktop"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              device === 'desktop'
                ? 'bg-indigo-600 text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor size={14} />
            <span className="hidden sm:inline">Desktop</span>
          </button>
        </div>

        {/* Live Badge */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live Real-Time
          </span>

          {isDraftModified && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Draft Preview
            </span>
          )}
        </div>

        {/* Controls: Zoom, Reload, Open */}
        <div className="flex items-center gap-1 text-slate-400">
          <button
            onClick={handleZoomOut}
            title="Perkecil (-10%)"
            disabled={zoom <= 70}
            className="p-1.5 hover:bg-slate-800 rounded-lg disabled:opacity-30 text-slate-300 hover:text-white transition-colors"
          >
            <ZoomOut size={15} />
          </button>
          <span className="text-[11px] font-mono text-slate-400 w-9 text-center">
            {zoom}%
          </span>
          <button
            onClick={handleZoomIn}
            title="Perbesar (+10%)"
            disabled={zoom >= 125}
            className="p-1.5 hover:bg-slate-800 rounded-lg disabled:opacity-30 text-slate-300 hover:text-white transition-colors"
          >
            <ZoomIn size={15} />
          </button>
          <div className="w-[1px] h-4 bg-slate-800 mx-1" />
          <button
            onClick={handleRefresh}
            title="Segarkan Preview"
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors"
          >
            <RotateCcw size={15} />
          </button>
          <button
            onClick={onOpenNewTab}
            title="Buka Preview di Tab Baru"
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors"
          >
            <ExternalLink size={15} />
          </button>
        </div>
      </div>

      {/* Simulator Container */}
      <div className="flex-1 w-full flex items-center justify-center p-2 sm:p-4 overflow-auto min-h-[560px]">
        <div
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out, width 0.3s ease, height 0.3s ease',
          }}
          className="flex justify-center"
        >
          {device === 'mobile' && (
            /* Smartphone Frame */
            <div className="relative w-[360px] sm:w-[385px] h-[740px] bg-slate-950 rounded-[48px] p-[10px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] border-4 border-slate-700/80 ring-1 ring-white/10 shrink-0">
              {/* Dynamic Island / Notch */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-40 flex items-center justify-between px-3">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
                <div className="w-2 h-2 rounded-full bg-blue-950/80" />
              </div>

              {/* Status Bar */}
              <div className="absolute top-2.5 left-8 right-8 z-30 flex items-center justify-between text-[11px] text-slate-900/90 font-medium px-2 pointer-events-none drop-shadow-xs">
                <span>9:41</span>
                <div className="flex items-center gap-1.5">
                  <Signal size={11} />
                  <Wifi size={11} />
                  <Battery size={13} />
                </div>
              </div>

              {/* Screen Content */}
              <div className="w-full h-full rounded-[38px] overflow-hidden overflow-y-auto bg-white flex flex-col pt-7 pb-6 relative scrollbar-none shadow-inner">
                <PublicBioView key={key} data={data} isInteractivePreview={true} />
              </div>

              {/* Home Indicator */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-300 rounded-full z-40 pointer-events-none opacity-80" />
            </div>
          )}

          {device === 'tablet' && (
            /* Tablet Frame */
            <div className="relative w-[540px] h-[720px] bg-slate-950 rounded-[36px] p-[12px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] border-4 border-slate-700 ring-1 ring-white/10 shrink-0">
              <div className="w-full h-full rounded-[26px] overflow-hidden overflow-y-auto bg-white flex flex-col pt-4 pb-4 relative scrollbar-none">
                <PublicBioView key={key} data={data} isInteractivePreview={true} />
              </div>
            </div>
          )}

          {device === 'desktop' && (
            /* Desktop Monitor Frame */
            <div className="relative w-[760px] h-[640px] bg-slate-950 rounded-2xl p-2 shadow-2xl border-4 border-slate-800 shrink-0 flex flex-col">
              <div className="w-full h-6 bg-slate-900 rounded-t-lg flex items-center px-3 gap-1.5 border-b border-slate-800">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <div className="mx-auto text-[10px] text-slate-400 font-mono">
                  {publicUrl}
                </div>
              </div>
              <div className="w-full flex-1 overflow-y-auto bg-white rounded-b-lg">
                <PublicBioView key={key} data={data} isInteractivePreview={true} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
