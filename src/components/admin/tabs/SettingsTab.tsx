import React, { useRef, useState, useEffect } from 'react';
import {
  Settings,
  Search,
  Download,
  Upload,
  RotateCcw,
  Check,
  AlertTriangle,
  Globe,
  Share2,
  Database,
  RefreshCw,
  Copy,
  ExternalLink,
  ShieldCheck,
  Code2,
} from 'lucide-react';
import { SeoConfig, BioLinkData, SupabaseConfig } from '../../../types/biolink';
import {
  getStoredSupabaseConfig,
  saveStoredSupabaseConfig,
  testSupabaseConnection,
  syncToSupabase,
  SUPABASE_SQL_SCHEMA,
} from '../../../lib/supabase';

interface SettingsTabProps {
  seo: SeoConfig;
  allData: BioLinkData;
  onSeoChange: (updated: Partial<SeoConfig>) => void;
  onImportData: (data: BioLinkData) => void;
  onResetToDefault: () => void;
  onSyncSupabase?: (msg: string) => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  seo,
  allData,
  onSeoChange,
  onImportData,
  onResetToDefault,
  onSyncSupabase,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string>('');

  // Supabase states
  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseConfig>(getStoredSupabaseConfig());
  const [isTesting, setIsTesting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [showSqlSchema, setShowSqlSchema] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  useEffect(() => {
    saveStoredSupabaseConfig(supabaseConfig);
  }, [supabaseConfig]);

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    const res = await testSupabaseConnection(
      supabaseConfig.url,
      supabaseConfig.anonKey,
      supabaseConfig.tableName || 'biolinks'
    );
    setIsTesting(false);
    setTestResult(res);

    if (res.success) {
      setSupabaseConfig((prev) => ({
        ...prev,
        enabled: true,
        status: 'connected',
      }));
    } else {
      setSupabaseConfig((prev) => ({
        ...prev,
        status: 'error',
        errorMessage: res.message,
      }));
    }
  };

  const handleSyncToSupabase = async () => {
    setIsSyncing(true);
    const res = await syncToSupabase(allData, supabaseConfig);
    setIsSyncing(false);
    if (res.success) {
      setSupabaseConfig((prev) => ({
        ...prev,
        lastSyncedAt: new Date().toLocaleTimeString('id-ID'),
      }));
      if (onSyncSupabase) onSyncSupabase(res.message);
    } else {
      alert(res.message);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleExportJson = () => {
    const jsonStr = JSON.stringify(allData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `biolink-${allData.slug}-backup.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.profile && parsed.links && parsed.theme) {
          onImportData(parsed);
          setImportStatus('Data berhasil diimpor!');
          setTimeout(() => setImportStatus(''), 3000);
        } else {
          setImportStatus('Format JSON tidak sesuai template BioLink.');
        }
      } catch (err) {
        setImportStatus('Gagal membaca file JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* 1. Integrasi Database Supabase */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Database size={18} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Database Supabase (PostgreSQL)</h3>
              <p className="text-xs text-slate-500">
                Simpan seluruh profil toko, konfigurasi tautan, dan analitik pengunjung di Supabase
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {supabaseConfig.status === 'connected' ? (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-700 flex items-center gap-1">
                <Check size={13} /> Supabase Terhubung
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600">
                Belum Terhubung
              </span>
            )}
          </div>
        </div>

        <div className="space-y-3.5">
          {/* Supabase URL */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-700">Project URL Supabase</label>
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-emerald-600 hover:underline flex items-center gap-1"
              >
                Buka Dashboard Supabase <ExternalLink size={11} />
              </a>
            </div>
            <input
              type="text"
              value={supabaseConfig.url}
              onChange={(e) => setSupabaseConfig({ ...supabaseConfig, url: e.target.value.trim() })}
              placeholder="https://xyzprojectid.supabase.co"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Anon Key */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">Supabase API Key (Anon / Service Key)</label>
            <input
              type="password"
              value={supabaseConfig.anonKey}
              onChange={(e) => setSupabaseConfig({ ...supabaseConfig, anonKey: e.target.value.trim() })}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
            <span className="text-[10px] text-slate-400">
              Dapat ditemukan di Supabase: Project Settings &rarr; API &rarr; Project API keys
            </span>
          </div>

          {/* Table name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">Nama Tabel Supabase</label>
              <input
                type="text"
                value={supabaseConfig.tableName || 'biolinks'}
                onChange={(e) => setSupabaseConfig({ ...supabaseConfig, tableName: e.target.value.trim() })}
                placeholder="biolinks"
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-800"
              />
            </div>

            <div className="flex items-end gap-2">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting}
                className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-2xs"
              >
                {isTesting ? (
                  <>
                    <RefreshCw size={13} className="animate-spin" /> Menghubungkan...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={14} /> Tes Koneksi
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleSyncToSupabase}
                disabled={isSyncing || !supabaseConfig.url || !supabaseConfig.anonKey}
                className="flex-1 py-2 px-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-2xs"
              >
                {isSyncing ? (
                  <>
                    <RefreshCw size={13} className="animate-spin" /> Sinkron...
                  </>
                ) : (
                  <>
                    <Upload size={14} /> Sinkron Sekarang
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Test feedback message */}
          {testResult && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                testResult.success
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {testResult.success ? <Check size={15} /> : <AlertTriangle size={15} />}
              <span>{testResult.message}</span>
            </div>
          )}

          {supabaseConfig.lastSyncedAt && (
            <p className="text-[11px] text-slate-400">
              Terakhir disinkronkan ke Supabase pada pukul: {supabaseConfig.lastSyncedAt}
            </p>
          )}

          {/* SQL Schema generator button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowSqlSchema(!showSqlSchema)}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1.5"
            >
              <Code2 size={14} />
              {showSqlSchema ? 'Sembunyikan Script SQL Schema' : 'Tampilkan Script SQL Schema Supabase'}
            </button>

            {showSqlSchema && (
              <div className="mt-2.5 p-3.5 bg-slate-900 rounded-xl border border-slate-800 text-slate-200 text-xs font-mono space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800">
                  <span>Script Pembuatan Tabel &amp; RLS Policy:</span>
                  <button
                    type="button"
                    onClick={handleCopySql}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-[11px] font-sans flex items-center gap-1 transition-colors"
                  >
                    {copiedSql ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    {copiedSql ? 'Tersalin!' : 'Salin SQL'}
                  </button>
                </div>
                <pre className="text-[11px] leading-relaxed overflow-x-auto text-emerald-400">
                  {SUPABASE_SQL_SCHEMA}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. SEO & Social Meta Tags */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Search className="text-indigo-600" size={18} />
          <div>
            <h3 className="text-sm font-semibold text-slate-900">SEO &amp; Tampilan Berbagi Link</h3>
            <p className="text-xs text-slate-500">
              Pengaturan judul, deskripsi Google, dan preview ketika dibagikan ke WhatsApp atau media sosial
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">SEO Meta Title</label>
            <input
              type="text"
              value={seo.siteTitle}
              onChange={(e) => onSeoChange({ siteTitle: e.target.value })}
              placeholder="Contoh: NDFSTORE - Official Catalog & Bio Link"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800"
            />
            <span className="text-[11px] text-slate-400">
              {seo.siteTitle.length}/60 karakter ideal
            </span>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">Meta Description</label>
            <textarea
              rows={3}
              value={seo.metaDescription}
              onChange={(e) => onSeoChange({ metaDescription: e.target.value })}
              placeholder="Deskripsi singkat yang muncul di hasil pencarian Google..."
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 leading-relaxed"
            />
            <span className="text-[11px] text-slate-400">
              {seo.metaDescription.length}/160 karakter ideal
            </span>
          </div>

          {/* Social Share Card Preview */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
            <span className="text-[11px] font-semibold text-slate-600 flex items-center gap-1.5">
              <Share2 size={13} /> Preview Tampilan Saat Dibagikan ke WhatsApp / Twitter:
            </span>
            <div className="bg-white rounded-lg border border-slate-200 p-3 max-w-sm shadow-2xs">
              <div className="w-full h-24 bg-slate-200 rounded-md overflow-hidden mb-2">
                <img
                  src={allData.profile.bannerUrl || allData.profile.avatarUrl}
                  alt="OG Banner"
                  className="w-full h-full object-cover"
                />
              </div>
              <h5 className="font-bold text-xs text-slate-900 truncate">{seo.siteTitle || allData.profile.name}</h5>
              <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{seo.metaDescription || allData.profile.bio}</p>
              <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                {window.location.host}/{allData.slug}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Backup & Restore Data */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Download className="text-indigo-600" size={18} />
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Backup &amp; Restore Data Website</h3>
            <p className="text-xs text-slate-500">
              Ekspor seluruh konfigurasi toko ke file JSON untuk cadangan atau transfer ke perangkat lain
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={handleExportJson}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors shadow-2xs"
          >
            <Download size={14} />
            Ekspor Data (JSON Backup)
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors shadow-2xs"
          >
            <Upload size={14} />
            Impor File JSON
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileImport}
            className="hidden"
          />
        </div>

        {importStatus && (
          <p className="text-xs font-medium text-emerald-600 flex items-center gap-1.5">
            <Check size={14} /> {importStatus}
          </p>
        )}
      </div>

      {/* 4. Reset Template */}
      <div className="p-5 bg-white rounded-2xl border border-rose-200/70 shadow-2xs space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="text-rose-600" size={18} />
          <h4 className="text-sm font-semibold text-slate-900">Kembalikan ke Template Awal</h4>
        </div>
        <p className="text-xs text-slate-500">
          Mereset seluruh data profil, tautan, dan tema kembali ke konfigurasi awal bawaan (NDFSTORE).
        </p>
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Yakin ingin mereset seluruh data kembali ke template bawaan?')) {
              onResetToDefault();
            }
          }}
          className="px-4 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw size={14} />
          Reset ke Template Bawaan
        </button>
      </div>
    </div>
  );
};
