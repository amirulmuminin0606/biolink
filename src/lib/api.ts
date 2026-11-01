import { BioLinkData } from '../types/biolink';
import { DEFAULT_BIOLINK_DATA } from '../data/defaultData';

const LOCAL_STORAGE_KEY = 'biolink_pro_local_cache';

export async function getPublicBioLink(slug: string): Promise<BioLinkData> {
  try {
    const res = await fetch(`/api/bio-links/${encodeURIComponent(slug)}`);
    if (!res.ok) {
      throw new Error('Bio link tidak ditemukan');
    }
    const json = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
  } catch (err) {
    console.warn('API fetch failed, checking local cache:', err);
  }

  // Fallback to local storage if available
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed.slug === slug || slug === 'ndfstore') {
        return parsed;
      }
    }
  } catch (e) {
    // ignore
  }

  return DEFAULT_BIOLINK_DATA;
}

export async function getAdminBioLink(slug?: string): Promise<{
  currentSlug: string;
  draft: BioLinkData;
  published: BioLinkData;
}> {
  try {
    const res = await fetch(`/api/admin/bio-link${slug ? `?slug=${encodeURIComponent(slug)}` : ''}`);
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return json.data;
      }
    }
  } catch (err) {
    console.warn('Admin API fetch failed, falling back:', err);
  }

  // Local storage fallback
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      return {
        currentSlug: parsed.slug,
        draft: parsed,
        published: parsed,
      };
    }
  } catch (e) {
    // ignore
  }

  return {
    currentSlug: DEFAULT_BIOLINK_DATA.slug,
    draft: DEFAULT_BIOLINK_DATA,
    published: DEFAULT_BIOLINK_DATA,
  };
}

export async function checkSlugAvailability(
  slug: string,
  currentSlug?: string
): Promise<{ available: boolean; message: string }> {
  try {
    const res = await fetch('/api/admin/check-slug', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, currentSlug }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Check slug error:', err);
  }

  const clean = slug.toLowerCase().trim();
  const valid = /^[a-z0-9-]+$/.test(clean);
  if (!valid) {
    return { available: false, message: 'Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung (-).' };
  }
  return { available: true, message: `URL /${clean} tersedia!` };
}

export async function saveDraftToServer(draft: BioLinkData): Promise<{ success: boolean; message: string }> {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(draft));
  } catch (e) {
    // ignore
  }

  try {
    const res = await fetch('/api/admin/save-draft', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ draft }),
    });
    const json = await res.json();
    return json;
  } catch (err: any) {
    return { success: true, message: 'Draft disimpan ke cache lokal.' };
  }
}

export async function publishToServer(draft: BioLinkData): Promise<{
  success: boolean;
  message: string;
  data?: BioLinkData;
}> {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(draft));
  } catch (e) {
    // ignore
  }

  try {
    const res = await fetch('/api/admin/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ draft }),
    });
    const json = await res.json();
    return json;
  } catch (err: any) {
    return {
      success: true,
      message: 'Perubahan dipublikasikan ke cache lokal.',
      data: draft,
    };
  }
}

export async function resetDraftFromServer(slug: string): Promise<{
  success: boolean;
  message: string;
  data?: BioLinkData;
}> {
  try {
    const res = await fetch('/api/admin/reset-draft', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    });
    const json = await res.json();
    return json;
  } catch (err: any) {
    return { success: false, message: 'Gagal mereset draft.' };
  }
}

export async function trackPageView(slug: string): Promise<void> {
  try {
    fetch('/api/analytics/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    });
  } catch (e) {
    // ignore
  }
}

export async function trackLinkClick(slug: string, linkId: string): Promise<void> {
  try {
    fetch('/api/analytics/click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, linkId }),
    });
  } catch (e) {
    // ignore
  }
}
