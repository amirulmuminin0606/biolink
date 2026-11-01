import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import { QrCode, Download, Copy, Check, X, Share2, ExternalLink } from 'lucide-react';

interface QrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  storeName: string;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({
  isOpen,
  onClose,
  url,
  storeName,
}) => {
  const [dataUrl, setDataUrl] = useState<string>('');
  const [svgString, setSvgString] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isOpen || !url) return;

    // Generate PNG Data URL
    QRCode.toDataURL(url, {
      width: 400,
      margin: 2,
      color: {
        dark: '#111827',
        light: '#FFFFFF',
      },
    })
      .then((res) => setDataUrl(res))
      .catch((err) => console.error('QR PNG error:', err));

    // Generate SVG string
    QRCode.toString(url, {
      type: 'svg',
      margin: 2,
      color: {
        dark: '#111827',
        light: '#FFFFFF',
      },
    })
      .then((res) => setSvgString(res))
      .catch((err) => console.error('QR SVG error:', err));
  }, [isOpen, url]);

  if (!isOpen) return null;

  const handleDownloadPng = () => {
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `qrcode-${storeName.toLowerCase().replace(/\s+/g, '-')}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadSvg = () => {
    if (!svgString) return;
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = `qrcode-${storeName.toLowerCase().replace(/\s+/g, '-')}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <QrCode size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">QR Code Bio Link</h3>
              <p className="text-xs text-slate-500">{storeName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col items-center">
          <div className="p-4 bg-white rounded-2xl border-2 border-slate-100 shadow-sm mb-4">
            {dataUrl ? (
              <img src={dataUrl} alt="Bio Link QR Code" className="w-56 h-56 object-contain" />
            ) : (
              <div className="w-56 h-56 flex items-center justify-center text-slate-400">
                Membuat QR Code...
              </div>
            )}
          </div>

          <p className="text-xs text-slate-500 text-center mb-4 max-w-xs">
            Scan untuk langsung membuka halaman Bio Link <span className="font-semibold text-slate-800">{storeName}</span>
          </p>

          {/* URL Box */}
          <div className="w-full flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl mb-5">
            <span className="text-xs text-slate-600 font-mono truncate px-2 select-all flex-1">
              {url}
            </span>
            <button
              onClick={handleCopyUrl}
              className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-medium flex items-center gap-1 shrink-0 transition-colors shadow-2xs"
            >
              {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              {copied ? 'Tersalin' : 'Salin'}
            </button>
          </div>

          {/* Download Buttons */}
          <div className="grid grid-cols-2 gap-3 w-full">
            <button
              onClick={handleDownloadPng}
              disabled={!dataUrl}
              className="w-full py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <Download size={15} />
              Unduh PNG
            </button>
            <button
              onClick={handleDownloadSvg}
              disabled={!svgString}
              className="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <Download size={15} />
              Unduh SVG (Vektor)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
