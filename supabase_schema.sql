-- ==============================================================================
-- SCRIPT SQL EDITOR SUPABASE: BIO LINK PRO (NDFSTORE)
-- Cara penggunaan:
-- 1. Buka dashboard Supabase Anda: https://supabase.com/dashboard
-- 2. Pilih project Anda -> Masuk ke menu "SQL Editor" di sidebar kiri
-- 3. Klik "New Query", paste seluruh isi script di bawah ini, lalu klik "RUN"
-- ==============================================================================

-- 1. Buat Tabel Utama 'biolinks'
CREATE TABLE IF NOT EXISTS public.biolinks (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    profile JSONB NOT NULL,
    socials JSONB NOT NULL DEFAULT '[]'::jsonb,
    socials_config JSONB NOT NULL DEFAULT '{}'::jsonb,
    links JSONB NOT NULL DEFAULT '[]'::jsonb,
    theme JSONB NOT NULL DEFAULT '{}'::jsonb,
    footer JSONB NOT NULL DEFAULT '{}'::jsonb,
    seo JSONB NOT NULL DEFAULT '{}'::jsonb,
    custom_domain JSONB,
    total_views INT NOT NULL DEFAULT 0,
    total_clicks INT NOT NULL DEFAULT 0,
    analytics_history JSONB NOT NULL DEFAULT '[]'::jsonb,
    published_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Buat Index agar pencarian berdasarkan slug sangat cepat
CREATE INDEX IF NOT EXISTS idx_biolinks_slug ON public.biolinks (slug);

-- 3. Buat Function & Trigger otomatis untuk memperbarui 'updated_at'
CREATE OR REPLACE FUNCTION public.handle_biolinks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_biolinks_updated_at ON public.biolinks;

CREATE TRIGGER trigger_biolinks_updated_at
BEFORE UPDATE ON public.biolinks
FOR EACH ROW
EXECUTE FUNCTION public.handle_biolinks_updated_at();

-- 4. Konfigurasi Row Level Security (RLS)
-- Mengizinkan pengunjung publik membaca bio link & admin/pengunjung mengupdate klik/view
ALTER TABLE public.biolinks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access" ON public.biolinks;
CREATE POLICY "Allow public read access"
ON public.biolinks
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Allow public insert" ON public.biolinks;
CREATE POLICY "Allow public insert"
ON public.biolinks
FOR INSERT
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update" ON public.biolinks;
CREATE POLICY "Allow public update"
ON public.biolinks
FOR UPDATE
USING (true)
WITH CHECK (true);

-- 5. Masukkan Data Bawaan Toko NDFSTORE (Seed Data Awal)
INSERT INTO public.biolinks (
    id,
    slug,
    profile,
    socials,
    socials_config,
    links,
    theme,
    footer,
    seo,
    custom_domain,
    total_views,
    total_clicks,
    analytics_history,
    published_at,
    updated_at
) VALUES (
    'ndfstore-primary',
    'ndfstore',
    '{
        "bannerUrl": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
        "bannerHeight": 180,
        "bannerFit": "cover",
        "bannerPosition": "center",
        "avatarUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        "avatarSize": 104,
        "avatarBorderWidth": 4,
        "avatarBorderColor": "#ffffff",
        "name": "NDFSTORE",
        "nameColor": "#111827",
        "nameFontSize": 24,
        "nameFontWeight": "bold",
        "bio": "✨ Official Flagship Store NDF\\n🛍️ Koleksi Fashion, Aksesoris & Gadget Pilihan\\n📦 Pengiriman Cepat • 100% Original • COD Tersedia\\n⬇️ Kunjungi toko resmi kami di bawah ini:",
        "bioColor": "#4b5563",
        "bioFontSize": 13,
        "textAlign": "center",
        "isVerified": true
    }'::jsonb,
    '[
        {"id": "soc-ig", "platform": "instagram", "title": "Instagram", "url": "https://instagram.com/ndfstore", "enabled": true},
        {"id": "soc-wa", "platform": "whatsapp", "title": "WhatsApp Admin", "url": "https://wa.me/6281234567890", "enabled": true},
        {"id": "soc-tiktok", "platform": "tiktok", "title": "TikTok Official", "url": "https://tiktok.com/@ndfstore", "enabled": true},
        {"id": "soc-fb", "platform": "facebook", "title": "Facebook", "url": "https://facebook.com/ndfstore", "enabled": true},
        {"id": "soc-yt", "platform": "youtube", "title": "YouTube Channel", "url": "https://youtube.com/@ndfstore", "enabled": true},
        {"id": "soc-tg", "platform": "telegram", "title": "Telegram Channel", "url": "https://t.me/ndfstore_official", "enabled": true},
        {"id": "soc-mail", "platform": "email", "title": "Email", "url": "mailto:support@ndfstore.com", "enabled": true},
        {"id": "soc-x", "platform": "x", "title": "X (Twitter)", "url": "https://x.com/ndfstore", "enabled": true},
        {"id": "soc-web", "platform": "website", "title": "Website Utama", "url": "https://ndfstore.com", "enabled": true}
    ]'::jsonb,
    '{
        "style": "circle",
        "colorType": "brand",
        "customColor": "#ffffff",
        "customBg": "#1f2937",
        "size": "md"
    }'::jsonb,
    '[
        {
            "id": "link-1",
            "title": "Shopee Official Store",
            "subtitle": "Diskon s/d 70% + Voucher Gratis Ongkir Xtra",
            "url": "https://shopee.co.id/ndfstore",
            "logoUrl": "https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/shopee.png",
            "enabled": true,
            "clicks": 1420,
            "openNewTab": true,
            "highlight": true,
            "highlightText": "PROMO FLASH SALE",
            "customBgColor": "",
            "customTextColor": ""
        },
        {
            "id": "link-2",
            "title": "TikTok Shop Catalog",
            "subtitle": "Live Shopping Setiap Hari Jam 19.00 WIB",
            "url": "https://tiktok.com/@ndfstore",
            "logoUrl": "https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/tiktok.png",
            "enabled": true,
            "clicks": 980,
            "openNewTab": true,
            "highlight": false,
            "customBgColor": "",
            "customTextColor": ""
        },
        {
            "id": "link-3",
            "title": "Tokopedia Official",
            "subtitle": "Cashback Spesial & Pengiriman Same Day",
            "url": "https://tokopedia.com/ndfstore",
            "logoUrl": "https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/tokopedia.png",
            "enabled": true,
            "clicks": 865,
            "openNewTab": true,
            "highlight": false,
            "customBgColor": "",
            "customTextColor": ""
        },
        {
            "id": "link-4",
            "title": "Lazada Mall",
            "subtitle": "Official Flagship Store Garansi 100% Ori",
            "url": "https://lazada.co.id/shop/ndfstore",
            "logoUrl": "https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/lazada.png",
            "enabled": true,
            "clicks": 530,
            "openNewTab": true,
            "highlight": false,
            "customBgColor": "",
            "customTextColor": ""
        },
        {
            "id": "link-5",
            "title": "Website Official",
            "subtitle": "Belanja langsung dengan poin member eksklusif",
            "url": "https://ndfstore.com",
            "logoUrl": "",
            "iconName": "Globe",
            "enabled": true,
            "clicks": 412,
            "openNewTab": true,
            "highlight": false,
            "customBgColor": "",
            "customTextColor": ""
        },
        {
            "id": "link-6",
            "title": "Customer Service WhatsApp",
            "subtitle": "Konsultasi Produk & Bantuan Pesanan",
            "url": "https://wa.me/6281234567890",
            "logoUrl": "",
            "iconName": "MessageCircle",
            "enabled": true,
            "clicks": 1240,
            "openNewTab": true,
            "highlight": false,
            "customBgColor": "",
            "customTextColor": ""
        }
    ]'::jsonb,
    '{
        "backgroundType": "solid",
        "solidColor": "#f8fafc",
        "gradientFrom": "#f1f5f9",
        "gradientTo": "#e2e8f0",
        "gradientDirection": "to-b",
        "backgroundImage": "",
        "bgImageSize": "cover",
        "bgImagePosition": "center",
        "bgOverlayOpacity": 20,
        "bgOverlayColor": "#000000",
        "fontFamily": "Plus Jakarta Sans",
        "buttonStyle": "shadow",
        "buttonBgColor": "#ffffff",
        "buttonTextColor": "#111827",
        "buttonBorderColor": "#e5e7eb",
        "buttonBorderRadius": 16,
        "buttonSpacing": 14,
        "buttonPaddingY": 14,
        "buttonWidth": "full",
        "buttonHoverEffect": "lift"
    }'::jsonb,
    '{
        "enabled": true,
        "text": "All Rights Reserved.",
        "brandName": "NDFSTORE",
        "copyrightYear": "2026",
        "textColor": "#9ca3af",
        "bgColor": "transparent",
        "fontSize": 12,
        "fontWeight": "medium",
        "textAlign": "center",
        "paddingY": 28
    }'::jsonb,
    '{
        "siteTitle": "NDFSTORE - Official Bio Link & Catalog",
        "metaDescription": "Kunjungi toko resmi NDFSTORE di Shopee, TikTok Shop, Tokopedia, Lazada, dan WhatsApp. Dapatkan promo diskon dan gratis ongkir!",
        "ogImageUrl": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
        "faviconUrl": ""
    }'::jsonb,
    '{
        "domain": "ndfstore.com",
        "status": "none",
        "dnsRecords": [
            {"type": "CNAME", "host": "link.ndfstore.com", "value": "cname.biolinkpro.com"},
            {"type": "A", "host": "@", "value": "76.76.21.21"}
        ]
    }'::jsonb,
    8450,
    5447,
    '[
        {"date": "2026-10-25", "views": 820, "clicks": 510, "perLinkClicks": {"link-1": 190, "link-2": 110, "link-6": 130}},
        {"date": "2026-10-26", "views": 950, "clicks": 620, "perLinkClicks": {"link-1": 230, "link-2": 140, "link-6": 150}},
        {"date": "2026-10-27", "views": 1100, "clicks": 740, "perLinkClicks": {"link-1": 280, "link-2": 180, "link-6": 170}},
        {"date": "2026-10-28", "views": 1250, "clicks": 830, "perLinkClicks": {"link-1": 310, "link-2": 190, "link-6": 200}},
        {"date": "2026-10-29", "views": 1380, "clicks": 920, "perLinkClicks": {"link-1": 350, "link-2": 210, "link-6": 220}},
        {"date": "2026-10-30", "views": 1420, "clicks": 947, "perLinkClicks": {"link-1": 370, "link-2": 220, "link-6": 230}},
        {"date": "2026-10-31", "views": 1530, "clicks": 880, "perLinkClicks": {"link-1": 340, "link-2": 200, "link-6": 210}}
    ]'::jsonb,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE
SET
    profile = EXCLUDED.profile,
    socials = EXCLUDED.socials,
    socials_config = EXCLUDED.socials_config,
    links = EXCLUDED.links,
    theme = EXCLUDED.theme,
    footer = EXCLUDED.footer,
    seo = EXCLUDED.seo,
    custom_domain = EXCLUDED.custom_domain,
    updated_at = NOW();

-- 6. Konfirmasi tabel berhasil dibuat
SELECT 'Tabel biolinks berhasil dibuat dan siap digunakan!' AS status, count(*) AS total_toko FROM public.biolinks;
