import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BioLinkData, SupabaseConfig } from '../types/biolink';

const SUPABASE_LOCAL_STORAGE_KEY = 'biolink_supabase_config';

export function getStoredSupabaseConfig(): SupabaseConfig {
  try {
    const raw = localStorage.getItem(SUPABASE_LOCAL_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    // ignore
  }

  return {
    enabled: false,
    url: '',
    anonKey: '',
    tableName: 'biolinks',
    status: 'disconnected',
  };
}

export function saveStoredSupabaseConfig(config: SupabaseConfig) {
  try {
    localStorage.setItem(SUPABASE_LOCAL_STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    // ignore
  }
}

export function getSupabaseClient(config?: SupabaseConfig): SupabaseClient | null {
  const cfg = config || getStoredSupabaseConfig();
  if (!cfg.url || !cfg.anonKey) return null;

  try {
    return createClient(cfg.url, cfg.anonKey, {
      auth: {
        persistSession: false,
      },
    });
  } catch (err) {
    console.error('Error creating Supabase client:', err);
    return null;
  }
}

export async function testSupabaseConnection(
  url: string,
  anonKey: string,
  tableName = 'biolinks'
): Promise<{ success: boolean; message: string }> {
  if (!url || !anonKey) {
    return { success: false, message: 'URL Project dan Anon/Service Key tidak boleh kosong.' };
  }

  try {
    const client = createClient(url, anonKey, {
      auth: { persistSession: false },
    });

    // Test query on table
    const { data, error } = await client.from(tableName).select('id, slug').limit(1);

    if (error) {
      // Table doesn't exist yet or permission error
      if (error.code === '42P01') {
        return {
          success: false,
          message: `Koneksi ke Supabase berhasil, namun tabel "${tableName}" belum dibuat. Silakan jalankan script SQL di bawah.`,
        };
      }
      return {
        success: false,
        message: `Koneksi gagal: ${error.message} (Code: ${error.code})`,
      };
    }

    return {
      success: true,
      message: `Koneksi ke Supabase sukses! Tabel "${tableName}" siap digunakan.`,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Gagal terhubung ke Supabase: ${err.message || 'Periksa kembali URL dan API Key.'}`,
    };
  }
}

export async function syncToSupabase(
  data: BioLinkData,
  config: SupabaseConfig
): Promise<{ success: boolean; message: string }> {
  const client = getSupabaseClient(config);
  if (!client) {
    return { success: false, message: 'Supabase belum dikonfigurasi.' };
  }

  const tableName = config.tableName || 'biolinks';

  try {
    const payload = {
      id: data.id || 'ndfstore-primary',
      slug: data.slug,
      profile: data.profile,
      socials: data.socials,
      socials_config: data.socialsConfig,
      links: data.links,
      theme: data.theme,
      footer: data.footer,
      seo: data.seo,
      custom_domain: data.customDomain || null,
      total_views: data.totalViews || 0,
      total_clicks: data.totalClicks || 0,
      analytics_history: data.analyticsHistory || [],
      published_at: data.publishedAt || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { error } = await client.from(tableName).upsert(payload, { onConflict: 'slug' });

    if (error) {
      console.error('Supabase upsert error:', error);
      return { success: false, message: `Gagal sinkron ke Supabase: ${error.message}` };
    }

    return { success: true, message: 'Data Bio Link berhasil disimpan ke database Supabase!' };
  } catch (err: any) {
    return { success: false, message: `Error sinkronisasi Supabase: ${err.message}` };
  }
}

export async function fetchFromSupabase(
  slug: string,
  config: SupabaseConfig
): Promise<BioLinkData | null> {
  const client = getSupabaseClient(config);
  if (!client) return null;

  const tableName = config.tableName || 'biolinks';

  try {
    const { data, error } = await client
      .from(tableName)
      .select('*')
      .eq('slug', slug.toLowerCase().trim())
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      slug: data.slug,
      profile: data.profile,
      socials: data.socials,
      socialsConfig: data.socials_config,
      links: data.links,
      theme: data.theme,
      footer: data.footer,
      seo: data.seo,
      customDomain: data.custom_domain,
      totalViews: data.total_views,
      totalClicks: data.total_clicks,
      analyticsHistory: data.analytics_history,
      publishedAt: data.published_at,
      updatedAt: data.updated_at,
    };
  } catch (err) {
    console.warn('Fetch from Supabase error:', err);
    return null;
  }
}

export const SUPABASE_SQL_SCHEMA = `-- Jalankan query ini di SQL Editor dashboard Supabase Anda:

CREATE TABLE IF NOT EXISTS biolinks (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  profile JSONB NOT NULL,
  socials JSONB NOT NULL,
  socials_config JSONB NOT NULL,
  links JSONB NOT NULL,
  theme JSONB NOT NULL,
  footer JSONB NOT NULL,
  seo JSONB NOT NULL,
  custom_domain JSONB,
  total_views INT DEFAULT 0,
  total_clicks INT DEFAULT 0,
  analytics_history JSONB DEFAULT '[]'::jsonb,
  published_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Izinkan akses publik untuk membaca (select) dan klik/view:
ALTER TABLE biolinks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
  ON biolinks FOR SELECT
  USING (true);

CREATE POLICY "Allow public upsert and update"
  ON biolinks FOR ALL
  USING (true)
  WITH CHECK (true);
`;
