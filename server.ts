import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Embedded Supabase Project
export const SUPABASE_URL = process.env.SUPABASE_URL || 'https://siisgwlwbcrdxzpzxztr.supabase.co';
export const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_MqwWcd48FtspxU_iCpPKPQ_UkuAIrJ0';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.resolve(DATA_DIR, 'biolink-db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial default seed
const defaultBioLink = {
  id: 'ndfstore-primary',
  slug: 'ndfstore',
  profile: {
    bannerUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
    bannerHeight: 180,
    bannerFit: 'cover',
    bannerPosition: 'center',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    avatarSize: 104,
    avatarBorderWidth: 4,
    avatarBorderColor: '#ffffff',
    name: 'NDFSTORE',
    nameColor: '#111827',
    nameFontSize: 24,
    nameFontWeight: 'bold',
    bio: '✨ Official Flagship Store NDF\n🛍️ Koleksi Fashion, Aksesoris & Gadget Pilihan\n📦 Pengiriman Cepat • 100% Original • COD Tersedia\n⬇️ Kunjungi toko resmi kami di bawah ini:',
    bioColor: '#4b5563',
    bioFontSize: 13,
    textAlign: 'center',
    isVerified: true,
  },
  socials: [
    { id: 'soc-ig', platform: 'instagram', title: 'Instagram', url: 'https://instagram.com/ndfstore', enabled: true },
    { id: 'soc-wa', platform: 'whatsapp', title: 'WhatsApp Admin', url: 'https://wa.me/6281234567890', enabled: true },
    { id: 'soc-tiktok', platform: 'tiktok', title: 'TikTok Official', url: 'https://tiktok.com/@ndfstore', enabled: true },
    { id: 'soc-fb', platform: 'facebook', title: 'Facebook', url: 'https://facebook.com/ndfstore', enabled: true },
    { id: 'soc-yt', platform: 'youtube', title: 'YouTube Channel', url: 'https://youtube.com/@ndfstore', enabled: true },
    { id: 'soc-tg', platform: 'telegram', title: 'Telegram Channel', url: 'https://t.me/ndfstore_official', enabled: true },
    { id: 'soc-mail', platform: 'email', title: 'Email', url: 'mailto:support@ndfstore.com', enabled: true },
    { id: 'soc-x', platform: 'x', title: 'X (Twitter)', url: 'https://x.com/ndfstore', enabled: true },
    { id: 'soc-web', platform: 'website', title: 'Website Utama', url: 'https://ndfstore.com', enabled: true },
  ],
  socialsConfig: {
    style: 'circle',
    colorType: 'brand',
    customColor: '#ffffff',
    customBg: '#1f2937',
    size: 'md',
  },
  links: [
    {
      id: 'link-1',
      title: 'Shopee Official Store',
      subtitle: 'Diskon s/d 70% + Voucher Gratis Ongkir Xtra',
      url: 'https://shopee.co.id/ndfstore',
      logoUrl: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/shopee.png',
      enabled: true,
      clicks: 1420,
      openNewTab: true,
      highlight: true,
      highlightText: 'PROMO FLASH SALE',
      customBgColor: '',
      customTextColor: '',
    },
    {
      id: 'link-2',
      title: 'TikTok Shop Catalog',
      subtitle: 'Live Shopping Setiap Hari Jam 19.00 WIB',
      url: 'https://tiktok.com/@ndfstore',
      logoUrl: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/tiktok.png',
      enabled: true,
      clicks: 980,
      openNewTab: true,
      highlight: false,
      customBgColor: '',
      customTextColor: '',
    },
    {
      id: 'link-3',
      title: 'Tokopedia Official',
      subtitle: 'Cashback Spesial & Pengiriman Same Day',
      url: 'https://tokopedia.com/ndfstore',
      logoUrl: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/tokopedia.png',
      enabled: true,
      clicks: 865,
      openNewTab: true,
      highlight: false,
      customBgColor: '',
      customTextColor: '',
    },
    {
      id: 'link-4',
      title: 'Lazada Mall',
      subtitle: 'Official Flagship Store Garansi 100% Ori',
      url: 'https://lazada.co.id/shop/ndfstore',
      logoUrl: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/lazada.png',
      enabled: true,
      clicks: 530,
      openNewTab: true,
      highlight: false,
      customBgColor: '',
      customTextColor: '',
    },
    {
      id: 'link-5',
      title: 'Website Official',
      subtitle: 'Belanja langsung dengan poin member eksklusif',
      url: 'https://ndfstore.com',
      logoUrl: '',
      iconName: 'Globe',
      enabled: true,
      clicks: 412,
      openNewTab: true,
      highlight: false,
      customBgColor: '',
      customTextColor: '',
    },
    {
      id: 'link-6',
      title: 'Customer Service WhatsApp',
      subtitle: 'Konsultasi Produk & Bantuan Pesanan',
      url: 'https://wa.me/6281234567890',
      logoUrl: '',
      iconName: 'MessageCircle',
      enabled: true,
      clicks: 1240,
      openNewTab: true,
      highlight: false,
      customBgColor: '',
      customTextColor: '',
    },
  ],
  theme: {
    backgroundType: 'solid',
    solidColor: '#f8fafc',
    gradientFrom: '#f1f5f9',
    gradientTo: '#e2e8f0',
    gradientDirection: 'to-b',
    backgroundImage: '',
    bgImageSize: 'cover',
    bgImagePosition: 'center',
    bgOverlayOpacity: 20,
    bgOverlayColor: '#000000',
    fontFamily: 'Plus Jakarta Sans',
    buttonStyle: 'shadow',
    buttonBgColor: '#ffffff',
    buttonTextColor: '#111827',
    buttonBorderColor: '#e5e7eb',
    buttonBorderRadius: 16,
    buttonSpacing: 14,
    buttonPaddingY: 14,
    buttonWidth: 'full',
    buttonHoverEffect: 'lift',
  },
  footer: {
    enabled: true,
    text: 'All Rights Reserved.',
    brandName: 'NDFSTORE',
    copyrightYear: '2026',
    textColor: '#9ca3af',
    bgColor: 'transparent',
    fontSize: 12,
    fontWeight: 'medium',
    textAlign: 'center',
    paddingY: 28,
  },
  seo: {
    siteTitle: 'NDFSTORE - Official Bio Link & Catalog',
    metaDescription: 'Kunjungi toko resmi NDFSTORE di Shopee, TikTok Shop, Tokopedia, Lazada, dan WhatsApp. Dapatkan promo diskon dan gratis ongkir!',
    ogImageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
    faviconUrl: '',
  },
  customDomain: {
    domain: 'ndfstore.com',
    status: 'none',
    dnsRecords: [
      { type: 'CNAME', host: 'link.ndfstore.com', value: 'cname.biolinkpro.com' },
      { type: 'A', host: '@', value: '76.76.21.21' },
    ],
  },
  publishedAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  totalViews: 8450,
  totalClicks: 5447,
  analyticsHistory: [
    { date: '2026-10-25', views: 820, clicks: 510, perLinkClicks: { 'link-1': 190, 'link-2': 110, 'link-6': 130 } },
    { date: '2026-10-26', views: 950, clicks: 620, perLinkClicks: { 'link-1': 230, 'link-2': 140, 'link-6': 150 } },
    { date: '2026-10-27', views: 1100, clicks: 740, perLinkClicks: { 'link-1': 280, 'link-2': 180, 'link-6': 170 } },
    { date: '2026-10-28', views: 1250, clicks: 830, perLinkClicks: { 'link-1': 310, 'link-2': 190, 'link-6': 200 } },
    { date: '2026-10-29', views: 1380, clicks: 920, perLinkClicks: { 'link-1': 350, 'link-2': 210, 'link-6': 220 } },
    { date: '2026-10-30', views: 1420, clicks: 947, perLinkClicks: { 'link-1': 370, 'link-2': 220, 'link-6': 230 } },
    { date: '2026-10-31', views: 1530, clicks: 880, perLinkClicks: { 'link-1': 340, 'link-2': 200, 'link-6': 210 } },
  ],
};

interface AnalyticsItem {
  date: string;
  views: number;
  clicks: number;
  perLinkClicks: Record<string, number>;
}

interface SiteData {
  draft: any;
  published: any;
}

interface DatabaseSchema {
  primarySlug: string;
  sites: Record<string, SiteData>;
}

function loadDatabase(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Failed to read DB, creating fresh:', err);
  }

  const initialDb: DatabaseSchema = {
    primarySlug: 'ndfstore',
    sites: {
      ndfstore: {
        draft: JSON.parse(JSON.stringify(defaultBioLink)),
        published: JSON.parse(JSON.stringify(defaultBioLink)),
      },
    },
  };
  fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
  return initialDb;
}

function saveDatabase(db: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save DB:', err);
  }
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // --- API Endpoints ---

  // 1. Get Public Bio Link by slug (Queries Supabase first)
  app.get('/api/bio-links/:slug', async (req: Request, res: Response) => {
    const slug = req.params.slug.toLowerCase().trim();

    try {
      const { data: sbData, error } = await supabase
        .from('biolinks')
        .select('*')
        .eq('slug', slug)
        .single();

      if (!error && sbData) {
        const formatted = {
          id: sbData.id,
          slug: sbData.slug,
          profile: sbData.profile,
          socials: sbData.socials,
          socialsConfig: sbData.socials_config,
          links: sbData.links,
          theme: sbData.theme,
          footer: sbData.footer,
          seo: sbData.seo,
          customDomain: sbData.custom_domain,
          totalViews: sbData.total_views,
          totalClicks: sbData.total_clicks,
          analyticsHistory: sbData.analytics_history,
          publishedAt: sbData.published_at,
          updatedAt: sbData.updated_at,
        };
        return res.json({ success: true, data: formatted });
      }
    } catch (err) {
      console.warn('Supabase query error, falling back to local storage:', err);
    }

    const db = loadDatabase();
    const site = db.sites[slug];
    if (!site || !site.published) {
      return res.status(404).json({ success: false, error: 'Halaman Bio Link tidak ditemukan.' });
    }

    return res.json({ success: true, data: site.published });
  });

  // 2. Track Page View
  app.post('/api/analytics/view', (req: Request, res: Response) => {
    const { slug } = req.body;
    if (!slug) return res.status(400).json({ success: false });

    const db = loadDatabase();
    const site = db.sites[slug.toLowerCase().trim()];
    if (site && site.published) {
      site.published.totalViews = (site.published.totalViews || 0) + 1;
      site.draft.totalViews = (site.draft.totalViews || 0) + 1;

      // Update today's analytics
      const today = new Date().toISOString().split('T')[0];
      let todayRecord = (site.published.analyticsHistory || []).find((r: any) => r.date === today);
      if (!todayRecord) {
        todayRecord = { date: today, views: 0, clicks: 0, perLinkClicks: {} };
        site.published.analyticsHistory.push(todayRecord);
        site.draft.analyticsHistory.push(JSON.parse(JSON.stringify(todayRecord)));
      }
      if (todayRecord) {
        todayRecord.views = (todayRecord.views || 0) + 1;
      }

      saveDatabase(db);
    }
    return res.json({ success: true });
  });

  // 3. Track Link Click
  app.post('/api/analytics/click', (req: Request, res: Response) => {
    const { slug, linkId } = req.body;
    if (!slug || !linkId) return res.status(400).json({ success: false });

    const db = loadDatabase();
    const site = db.sites[slug.toLowerCase().trim()];
    if (site && site.published) {
      site.published.totalClicks = (site.published.totalClicks || 0) + 1;
      site.draft.totalClicks = (site.draft.totalClicks || 0) + 1;

      // Update link counter
      const pubLink = (site.published.links || []).find((l: any) => l.id === linkId);
      if (pubLink) pubLink.clicks = (pubLink.clicks || 0) + 1;

      const draftLink = (site.draft.links || []).find((l: any) => l.id === linkId);
      if (draftLink) draftLink.clicks = (draftLink.clicks || 0) + 1;

      // Update history
      const today = new Date().toISOString().split('T')[0];
      let todayRecord = (site.published.analyticsHistory || []).find((r: any) => r.date === today);
      if (!todayRecord) {
        todayRecord = { date: today, views: 1, clicks: 0, perLinkClicks: {} };
        site.published.analyticsHistory.push(todayRecord);
        site.draft.analyticsHistory.push(JSON.parse(JSON.stringify(todayRecord)));
      }
      if (todayRecord) {
        todayRecord.clicks = (todayRecord.clicks || 0) + 1;
        todayRecord.perLinkClicks = todayRecord.perLinkClicks || {};
        todayRecord.perLinkClicks[linkId] = (todayRecord.perLinkClicks[linkId] || 0) + 1;
      }

      saveDatabase(db);
    }
    return res.json({ success: true });
  });

  // 4. Admin: Get Current Bio Link (Draft + Published)
  app.get('/api/admin/bio-link', (req: Request, res: Response) => {
    const slugQuery = (req.query.slug as string) || '';
    const db = loadDatabase();
    const targetSlug = slugQuery.toLowerCase().trim() || db.primarySlug;

    let site = db.sites[targetSlug];
    if (!site) {
      // Fallback to first available or create
      const firstSlug = Object.keys(db.sites)[0] || 'ndfstore';
      site = db.sites[firstSlug];
    }

    return res.json({
      success: true,
      data: {
        currentSlug: site.draft.slug,
        draft: site.draft,
        published: site.published,
      },
    });
  });

  // 5. Admin: Check Slug Availability
  app.post('/api/admin/check-slug', (req: Request, res: Response) => {
    const { slug, currentSlug } = req.body;
    if (!slug) {
      return res.json({ available: false, message: 'Slug tidak boleh kosong.' });
    }

    const cleanSlug = slug.toLowerCase().trim();
    const regex = /^[a-z0-9-]+$/;
    if (!regex.test(cleanSlug)) {
      return res.json({
        available: false,
        message: 'Slug hanya boleh berisi huruf kecil (a-z), angka (0-9), dan tanda hubung (-). Tanpa spasi atau simbol.',
      });
    }

    if (cleanSlug === currentSlug) {
      return res.json({ available: true, message: 'Ini adalah slug Anda saat ini.' });
    }

    // Reserved keywords
    const reserved = ['admin', 'api', 'login', 'logout', 'dashboard', 'settings', 'static', 'assets'];
    if (reserved.includes(cleanSlug)) {
      return res.json({ available: false, message: `Slug "${cleanSlug}" adalah kata kunci sistem yang tidak dapat digunakan.` });
    }

    const db = loadDatabase();
    if (db.sites[cleanSlug]) {
      return res.json({ available: false, message: `URL /${cleanSlug} sudah digunakan oleh pengguna lain.` });
    }

    return res.json({ available: true, message: `URL /${cleanSlug} tersedia!` });
  });

  // 6. Admin: Save Draft
  app.post('/api/admin/save-draft', (req: Request, res: Response) => {
    const { draft } = req.body;
    if (!draft || !draft.slug) {
      return res.status(400).json({ success: false, message: 'Data draft tidak valid.' });
    }

    const db = loadDatabase();
    const currentSlug = draft.slug.toLowerCase().trim();

    // Find the site by id or slug
    const siteKeys = Object.keys(db.sites);
    const existingKey = siteKeys.find(
      (k) => db.sites[k]?.draft?.id === draft.id || k === currentSlug
    );

    if (!existingKey) {
      db.sites[currentSlug] = {
        draft,
        published: JSON.parse(JSON.stringify(draft)),
      };
    } else {
      db.sites[existingKey].draft = {
        ...draft,
        updatedAt: new Date().toISOString(),
      };
    }

    saveDatabase(db);
    return res.json({ success: true, message: 'Draft berhasil disimpan.' });
  });

  // 7. Admin: Publish Draft to Live
  app.post('/api/admin/publish', async (req: Request, res: Response) => {
    const { draft } = req.body;
    if (!draft || !draft.slug) {
      return res.status(400).json({ success: false, message: 'Data draft tidak valid.' });
    }

    const cleanSlug = draft.slug.toLowerCase().trim();
    const regex = /^[a-z0-9-]+$/;
    if (!regex.test(cleanSlug)) {
      return res.status(400).json({
        success: false,
        message: 'Format slug tidak valid. Gunakan huruf kecil, angka, dan tanda hubung.',
      });
    }

    const db = loadDatabase();

    // Find existing site key
    const existingKeys = Object.keys(db.sites);
    const oldKey = existingKeys.find((k) => db.sites[k]?.draft?.id === draft.id);

    // If slug changed, ensure new slug is available
    if (oldKey && oldKey !== cleanSlug) {
      if (db.sites[cleanSlug]) {
        return res.status(400).json({ success: false, message: `Slug /${cleanSlug} sudah digunakan.` });
      }
      delete db.sites[oldKey];
    }

    const publishedVersion = {
      ...draft,
      slug: cleanSlug,
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.sites[cleanSlug] = {
      draft: JSON.parse(JSON.stringify(publishedVersion)),
      published: publishedVersion,
    };
    db.primarySlug = cleanSlug;

    saveDatabase(db);

    // Persist directly to Supabase
    try {
      await supabase.from('biolinks').upsert({
        id: publishedVersion.id || 'ndfstore-primary',
        slug: cleanSlug,
        profile: publishedVersion.profile,
        socials: publishedVersion.socials,
        socials_config: publishedVersion.socialsConfig,
        links: publishedVersion.links,
        theme: publishedVersion.theme,
        footer: publishedVersion.footer,
        seo: publishedVersion.seo,
        custom_domain: publishedVersion.customDomain || null,
        total_views: publishedVersion.totalViews || 0,
        total_clicks: publishedVersion.totalClicks || 0,
        analytics_history: publishedVersion.analyticsHistory || [],
        published_at: publishedVersion.publishedAt,
        updated_at: publishedVersion.updatedAt,
      }, { onConflict: 'slug' });
    } catch (sbErr) {
      console.warn('Supabase publish error:', sbErr);
    }

    return res.json({
      success: true,
      message: `Halaman Bio Link berhasil dipublikasikan ke /${cleanSlug} & tersimpan di Supabase!`,
      data: publishedVersion,
    });
  });

  // 8. Admin: Reset Draft to Published
  app.post('/api/admin/reset-draft', (req: Request, res: Response) => {
    const { slug } = req.body;
    const db = loadDatabase();
    const targetSlug = slug?.toLowerCase().trim() || db.primarySlug;

    const site = db.sites[targetSlug];
    if (!site) {
      return res.status(404).json({ success: false, message: 'Situs tidak ditemukan.' });
    }

    site.draft = JSON.parse(JSON.stringify(site.published));
    saveDatabase(db);

    return res.json({ success: true, message: 'Perubahan draft berhasil dibatalkan.', data: site.draft });
  });

  // 9. Admin: Export / Import
  app.post('/api/admin/import-data', (req: Request, res: Response) => {
    const { bioLinkData } = req.body;
    if (!bioLinkData || !bioLinkData.slug) {
      return res.status(400).json({ success: false, message: 'Format data tidak sesuai.' });
    }

    const slug = bioLinkData.slug.toLowerCase().trim();
    const db = loadDatabase();
    db.sites[slug] = {
      draft: bioLinkData,
      published: bioLinkData,
    };
    db.primarySlug = slug;
    saveDatabase(db);

    return res.json({ success: true, message: 'Data Bio Link berhasil diimpor.' });
  });

  // --- Vite dev server integration ---
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server startup error:', err);
});
