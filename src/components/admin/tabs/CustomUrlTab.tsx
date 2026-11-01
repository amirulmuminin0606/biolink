import React, { useState, useEffect } from 'react';
import {
  Link as LinkIcon,
  Copy,
  Check,
  ExternalLink,
  QrCode,
  Globe,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Server,
} from 'lucide-react';
import { BioLinkData, CustomDomainConfig } from '../../../types/biolink';
import { checkSlugAvailability } from '../../../lib/api';

interface CustomUrlTabProps {
  data: BioLinkData;
  onSlugChange: (newSlug: string) => void;
  onCustomDomainChange: (config: CustomDomainConfig) => void;
  onOpenQrCode: () => void;
  onOpenPublicView: () => void;
  currentPublishedSlug: string;
}

export const CustomUrlTab: React.FC<CustomUrlTabProps> = ({
  data,
  onSlugChange,
  onCustomDomainChange,
  onOpenQrCode,
  onOpenPublicView,
  currentPublishedSlug,
}) => {
  const [slugInput, setSlugInput] = useState(data.slug);
  const [copied, setCopied] = useState(false);
  const [checking, setChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<{ available: boolean; message: string } | null>(null);

  // Custom domain local state
  const [domainInput, setDomainInput] = useState(data.customDomain?.domain || '');
  const [domainStatus, setDomainStatus] = useState<'none' | 'pending' | 'verified'>(
    data.customDomain?.status || 'none'
  );

  const baseUrl = window.location.origin;
  const currentFullUrl = `${baseUrl}/${data.slug}`;

  // Debounced check slug availability
  useEffect(() => {
    const clean = slugInput.toLowerCase().trim().replace(/\s+/g, '-');
    if (!clean) {
      setCheckResult({ available: false, message: 'Slug URL tidak boleh kosong.' });
      return;
    }

    const timer = setTimeout(async () => {
      setChecking(true);
      const res = await checkSlugAvailability(clean, currentPublishedSlug);
      setCheckResult(res);
      setChecking(false);
      if (res.available) {
        onSlugChange(clean);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [slugInput, currentPublishedSlug]);

  const handleSlugInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Force lowercase, remove invalid chars immediately
    const sanitized = e.target.value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '');
    setSlugInput(sanitized);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerifyDomain = () => {
    if (!domainInput.trim()) return;
    setDomainStatus('pending');
    setTimeout(() => {
      setDomainStatus('verified');
      onCustomDomainChange({
        domain: domainInput.trim(),
        status: 'verified',
        dnsRecords: [
          { type: 'CNAME', host: domainInput.trim(), value: 'cname.biolinkpro.com' },
          { type: 'A', host: '@', value: '76.76.21.21' },
        ],
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* 1. Custom Slug / Alamat URL */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <LinkIcon className="text-indigo-600" size={18} />
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Custom URL / Slug Bio Link</h3>
            <p className="text-xs text-slate-500">
              Buat alamat website sendiri berdasarkan nama toko atau brand Anda
            </p>
          </div>
        </div>

        {/* Current Active URL Banner */}
        <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-semibold text-indigo-700 uppercase tracking-wider block">
              URL Bio Link Aktif Anda:
            </span>
            <span className="text-sm font-bold font-mono text-indigo-950 mt-0.5 block break-all">
              {currentFullUrl}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1.5 bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              {copied ? 'Tersalin!' : 'Copy URL'}
            </button>
            <button
              type="button"
              onClick={onOpenPublicView}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <ExternalLink size={14} />
              Buka Bio Link
            </button>
            <button
              type="button"
              onClick={onOpenQrCode}
              className="p-2 bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 rounded-xl transition-colors shadow-2xs"
              title="QR Code Otomatis"
            >
              <QrCode size={16} />
            </button>
          </div>
        </div>

        {/* Slug Editor Input */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-medium text-slate-700">Ubah Custom Slug:</label>
          <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 bg-white">
            <span className="px-3 py-2 bg-slate-50 border-r border-slate-200 text-xs font-mono text-slate-500 shrink-0">
              {baseUrl}/
            </span>
            <input
              type="text"
              value={slugInput}
              onChange={handleSlugInputChange}
              placeholder="ndfstore"
              className="flex-1 px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-hidden"
            />
          </div>

          {/* Validation Feedback */}
          <div className="min-h-5 pt-0.5">
            {checking ? (
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <RefreshCw size={12} className="animate-spin text-indigo-500" /> Memeriksa ketersediaan slug...
              </span>
            ) : checkResult ? (
              <span
                className={`text-xs flex items-center gap-1.5 font-medium ${
                  checkResult.available ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {checkResult.available ? (
                  <CheckCircle2 size={14} className="shrink-0" />
                ) : (
                  <AlertCircle size={14} className="shrink-0" />
                )}
                {checkResult.message}
              </span>
            ) : null}
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-500 space-y-1">
            <p className="font-semibold text-slate-700">Ketentuan Slug:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Hanya menerima huruf kecil (a-z), angka (0-9), dan tanda hubung (-).</li>
              <li>Tidak boleh menggunakan spasi atau simbol lain.</li>
              <li>Sistem otomatis mengecek keunikan slug agar tidak bentrok dengan pengguna lain.</li>
              <li>
                Setelah mengubah slug, pastikan menekan tombol <strong>Publikasikan</strong> agar tersimpan ke sistem publik.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 2. QR Code Otomatis */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-slate-100 text-slate-900 rounded-2xl shrink-0">
            <QrCode size={24} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900">QR Code Otomatis</h4>
            <p className="text-xs text-slate-500">
              QR Code selalu sinkron dengan URL Bio Link aktif Anda. Siap diunduh format PNG &amp; SVG untuk banner cetak, stiker kemasan, atau kartu nama toko.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenQrCode}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shrink-0 transition-colors shadow-2xs"
        >
          <QrCode size={14} />
          Buka &amp; Unduh QR Code
        </button>
      </div>

      {/* 3. Pengaturan Custom Domain */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Globe className="text-indigo-600" size={18} />
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Custom Domain Sendiri (Opsional)</h3>
              <p className="text-xs text-slate-500">Gunakan domain toko Anda sendiri (misal: link.ndfstore.com)</p>
            </div>
          </div>

          {domainStatus === 'verified' && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-700 flex items-center gap-1">
              <ShieldCheck size={13} /> Terverifikasi
            </span>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              placeholder="link.ndfstore.com"
              className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
            />
            <button
              type="button"
              onClick={handleVerifyDomain}
              disabled={domainStatus === 'pending'}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition-colors shrink-0"
            >
              {domainStatus === 'pending' ? 'Memverifikasi DNS...' : 'Simpan & Verifikasi'}
            </button>
          </div>

          {/* DNS Instructions */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
            <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
              <Server size={14} className="text-indigo-600" /> Pengaturan DNS Domain Anda:
            </span>
            <p className="text-[11px] text-slate-500">
              Tambahkan DNS Record berikut pada dashboard penyedia domain Anda (Cloudflare, Niagahoster, Rumahweb, dll):
            </p>

            <div className="overflow-x-auto pt-1">
              <table className="w-full text-[11px] text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-mono">
                    <th className="py-1">Type</th>
                    <th className="py-1">Host / Name</th>
                    <th className="py-1">Target / Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60 font-mono text-slate-700">
                  <tr>
                    <td className="py-1.5 font-bold text-indigo-600">CNAME</td>
                    <td className="py-1.5">link (subdomain)</td>
                    <td className="py-1.5">cname.biolinkpro.com</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 font-bold text-indigo-600">A</td>
                    <td className="py-1.5">@ (apex)</td>
                    <td className="py-1.5">76.76.21.21</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
