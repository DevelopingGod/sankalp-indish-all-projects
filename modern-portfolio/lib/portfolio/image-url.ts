export function isSupabasePublicObjectUrl(url: string): boolean {
  try {
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!base) return false;
    const host = new URL(base).hostname;
    const u = new URL(url);
    return (
      u.hostname === host &&
      u.pathname.includes("/storage/v1/object/public/")
    );
  } catch {
    return false;
  }
}
