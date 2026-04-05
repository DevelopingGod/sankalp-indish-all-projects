"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { parseCustomLinks } from "@/lib/portfolio/custom-links";
import type { Category, Project } from "@/lib/types/portfolio";
import { slugify } from "@/lib/utils/slug";
import { Link2, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";

const BUCKET = "project-images";

export function ProjectManager() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [categories, setCategories] = useState<Category[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [customLinks, setCustomLinks] = useState<{ label: string; url: string }[]>(
    [],
  );
  const [repoUrl, setRepoUrl] = useState("");
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [existingImagePath, setExistingImagePath] = useState<string | null>(
    null,
  );

  const load = useCallback(async () => {
    setError(null);
    const [catRes, projRes] = await Promise.all([
      supabase.from("categories").select("*").order("sort_order"),
      supabase.from("projects").select("*").order("sort_order"),
    ]);
    if (catRes.error) {
      setError(catRes.error.message);
    } else {
      const cats = (catRes.data ?? []) as Category[];
      setCategories(cats);
      setCategoryId((prev) => prev || cats[0]?.id || "");
    }
    if (projRes.error) {
      setError(projRes.error.message);
    } else {
      setProjects((projRes.data ?? []) as Project[]);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    void load();
  }, [load]);

  const categoryName = useMemo(() => {
    const m = new Map(categories.map((c) => [c.id, c.name]));
    return (id: string) => m.get(id) ?? id;
  }, [categories]);

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setSlug("");
    setCategoryId(categories[0]?.id ?? "");
    setSummary("");
    setDescription("");
    setCustomLinks([]);
    setRepoUrl("");
    setFeatured(false);
    setPublished(true);
    setSortOrder(0);
    setImageFile(null);
    setExistingImageUrl(null);
    setExistingImagePath(null);
  }

  function startEdit(p: Project) {
    setEditingId(p.id);
    setTitle(p.title);
    setSlug(p.slug);
    setCategoryId(p.category_id);
    setSummary(p.summary);
    setDescription(p.description ?? "");
    setCustomLinks(
      parseCustomLinks(p.custom_links).map((l) => ({ ...l })),
    );
    setRepoUrl(p.repo_url ?? "");
    setFeatured(p.featured);
    setPublished(p.published);
    setSortOrder(p.sort_order);
    setImageFile(null);
    setExistingImageUrl(p.image_url);
    setExistingImagePath(p.image_path);
  }

  async function uploadHero(
    userId: string,
    projectId: string,
    file: File,
  ): Promise<{ publicUrl: string; path: string } | { error: string }> {
    const ext = file.name.includes(".")
      ? file.name.slice(file.name.lastIndexOf(".") + 1).toLowerCase()
      : "bin";
    const path = `${userId}/${projectId}/hero.${ext}`;
    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { upsert: true });
    if (upErr) return { error: upErr.message };
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return { publicUrl: data.publicUrl, path };
  }

  async function removeStoredImage(path: string | null) {
    if (!path) return;
    await supabase.storage.from(BUCKET).remove([path]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError("Not signed in.");
      setSaving(false);
      return;
    }

    const slugValue = (slug.trim() || slugify(title)).trim();
    const linksForDb = customLinks
      .map((l) => ({
        label: l.label.trim(),
        url: l.url.trim(),
      }))
      .filter((l) => l.label.length > 0 && l.url.length > 0);

    const basePayload = {
      title: title.trim(),
      slug: slugValue,
      category_id: categoryId,
      summary: summary.trim(),
      description: description.trim() || null,
      primary_link_url: null,
      primary_link_label: null,
      custom_links: linksForDb,
      repo_url: repoUrl.trim() || null,
      featured,
      published,
      sort_order: sortOrder,
    };

    try {
      if (editingId) {
        let image_url = existingImageUrl;
        let image_path = existingImagePath;

        if (imageFile) {
          if (existingImagePath) {
            await removeStoredImage(existingImagePath);
          }
          const up = await uploadHero(user.id, editingId, imageFile);
          if ("error" in up) {
            setError(up.error);
            setSaving(false);
            return;
          }
          image_url = up.publicUrl;
          image_path = up.path;
        }

        const { error: upErr } = await supabase
          .from("projects")
          .update({
            ...basePayload,
            image_url,
            image_path,
          })
          .eq("id", editingId);

        if (upErr) {
          setError(upErr.message);
          setSaving(false);
          return;
        }
      } else {
        const { data: row, error: insErr } = await supabase
          .from("projects")
          .insert({
            ...basePayload,
            image_url: null,
            image_path: null,
          })
          .select("id")
          .single();

        if (insErr || !row) {
          setError(insErr?.message ?? "Insert failed");
          setSaving(false);
          return;
        }

        const newId = row.id as string;

        if (imageFile) {
          const up = await uploadHero(user.id, newId, imageFile);
          if ("error" in up) {
            setError(
              `Project created but image upload failed: ${up.error}. You can edit the project to retry.`,
            );
            setSaving(false);
            await load();
            resetForm();
            return;
          }
          const { error: patchErr } = await supabase
            .from("projects")
            .update({
              image_url: up.publicUrl,
              image_path: up.path,
            })
            .eq("id", newId);
          if (patchErr) {
            setError(patchErr.message);
            setSaving(false);
            await load();
            return;
          }
        }
      }

      await load();
      resetForm();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(p: Project) {
    if (!window.confirm(`Delete “${p.title}”?`)) return;
    setError(null);
    if (p.image_path) {
      await removeStoredImage(p.image_path);
    }
    const { error: delErr } = await supabase
      .from("projects")
      .delete()
      .eq("id", p.id);
    if (delErr) {
      setError(delErr.message);
      return;
    }
    if (editingId === p.id) resetForm();
    await load();
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-[#6c757d]">
        <Loader2 className="size-5 animate-spin" aria-hidden />
        Loading…
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        Add at least one category before creating projects.
      </p>
    );
  }

  return (
    <div className="space-y-10">
      {error ? (
        <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      <form
        onSubmit={(e) => void handleSubmit(e)}
        className="rounded-xl border border-[#dee2e6] bg-white p-6 shadow-sm"
      >
        <h2 className="text-lg font-semibold text-[#212529]">
          {editingId ? "Edit project" : "New project"}
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#6c757d]">
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => {
                if (!editingId && !slug.trim() && title.trim()) {
                  setSlug(slugify(title));
                }
              }}
              required
              className="w-full rounded-md border border-[#ced4da] px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#6c757d]">
              Slug (unique)
            </label>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              className="w-full rounded-md border border-[#ced4da] px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#6c757d]">
              Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className="w-full rounded-md border border-[#ced4da] bg-white px-3 py-2 text-sm"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#6c757d]">
              Summary (card text)
            </label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              required
              rows={2}
              className="w-full rounded-md border border-[#ced4da] px-3 py-2 text-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#6c757d]">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-[#ced4da] px-3 py-2 text-sm"
            />
          </div>
          <div className="sm:col-span-2 rounded-lg border border-[#dee2e6] bg-[#f8f9fa] p-4">
            <div className="mb-3 flex items-center gap-2">
              <Link2 className="size-4 text-[#0d6efd]" aria-hidden />
              <span className="text-sm font-semibold text-[#212529]">
                Custom links
              </span>
            </div>
            <p className="mb-4 text-xs text-[#6c757d]">
              Add any number of buttons (e.g. “View PDF”, “GitHub”, “Demo”).
              Empty rows are ignored when you save.
            </p>
            <ul className="space-y-3">
              {customLinks.map((row, index) => (
                <li
                  key={index}
                  className="flex flex-col gap-2 rounded-md border border-[#e9ecef] bg-white p-3 sm:flex-row sm:items-end"
                >
                  <div className="min-w-0 flex-1">
                    <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-[#6c757d]">
                      Label
                    </label>
                    <input
                      value={row.label}
                      onChange={(e) => {
                        const v = e.target.value;
                        setCustomLinks((prev) =>
                          prev.map((r, i) =>
                            i === index ? { ...r, label: v } : r,
                          ),
                        );
                      }}
                      placeholder="e.g. Watch video"
                      className="w-full rounded-md border border-[#ced4da] px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="min-w-0 flex-[2]">
                    <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-[#6c757d]">
                      URL
                    </label>
                    <input
                      value={row.url}
                      onChange={(e) => {
                        const v = e.target.value;
                        setCustomLinks((prev) =>
                          prev.map((r, i) =>
                            i === index ? { ...r, url: v } : r,
                          ),
                        );
                      }}
                      placeholder="https://…"
                      className="w-full rounded-md border border-[#ced4da] px-3 py-2 text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setCustomLinks((prev) =>
                        prev.filter((_, i) => i !== index),
                      )
                    }
                    className="inline-flex shrink-0 items-center justify-center gap-1 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-800 hover:bg-red-100 sm:mb-0"
                  >
                    <Trash2 className="size-3.5" aria-hidden />
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() =>
                setCustomLinks((prev) => [...prev, { label: "", url: "" }])
              }
              className="mt-4 inline-flex items-center gap-2 rounded-md border border-[#0d6efd] bg-white px-3 py-2 text-sm font-semibold text-[#0d6efd] hover:bg-[#e7f1ff]"
            >
              <Plus className="size-4" aria-hidden />
              Add link
            </button>
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#6c757d]">
              Repository URL (optional)
            </label>
            <input
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="w-full rounded-md border border-[#ced4da] px-3 py-2 text-sm"
            />
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="rounded border-[#ced4da]"
              />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="rounded border-[#ced4da]"
              />
              Published (visible on site)
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase text-[#6c757d]">
                Sort
              </span>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                className="w-24 rounded-md border border-[#ced4da] px-2 py-1 text-sm"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#6c757d]">
              Hero image
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={(e) =>
                setImageFile(e.target.files?.[0] ?? null)
              }
              className="block w-full text-sm text-[#495057] file:mr-3 file:rounded-md file:border-0 file:bg-[#e7f1ff] file:px-3 file:py-2 file:text-sm file:font-semibold file:text-[#0d6efd]"
            />
            {editingId && existingImageUrl && !imageFile ? (
              <div className="relative mt-3 h-32 w-48 overflow-hidden rounded-md border border-[#dee2e6] bg-[#f8f9fa]">
                <Image
                  src={existingImageUrl}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="192px"
                  unoptimized={
                    !existingImageUrl.includes("supabase.co")
                  }
                />
              </div>
            ) : null}
            <p className="mt-1 text-xs text-[#6c757d]">
              Uploaded to Supabase Storage ({BUCKET}). Leave empty to keep the
              current image when editing.
            </p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-md bg-[#0d6efd] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0b5ed7] disabled:opacity-60"
          >
            {editingId ? (
              <>
                <Pencil className="size-4" aria-hidden />
                Save changes
              </>
            ) : (
              <>
                <Plus className="size-4" aria-hidden />
                Create project
              </>
            )}
          </button>
          {editingId ? (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-md border border-[#ced4da] px-4 py-2 text-sm font-semibold hover:bg-[#f8f9fa]"
            >
              Cancel edit
            </button>
          ) : null}
        </div>
      </form>

      <div className="overflow-x-auto rounded-xl border border-[#dee2e6] bg-white shadow-sm">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-[#dee2e6] bg-[#f8f9fa]">
            <tr>
              <th className="px-4 py-3 font-semibold text-[#495057]">
                Title
              </th>
              <th className="px-4 py-3 font-semibold text-[#495057]">
                Category
              </th>
              <th className="px-4 py-3 font-semibold text-[#495057]">
                Published
              </th>
              <th className="px-4 py-3 font-semibold text-[#495057]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-10 text-center text-[#6c757d]"
                >
                  No projects yet. Create one with the form above.
                </td>
              </tr>
            ) : (
              projects.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-[#f1f3f5] hover:bg-[#f8f9fa]/80"
                >
                  <td className="px-4 py-3 font-medium text-[#212529]">
                    {p.title}
                  </td>
                  <td className="px-4 py-3 text-[#6c757d]">
                    {categoryName(p.category_id)}
                  </td>
                  <td className="px-4 py-3 text-[#6c757d]">
                    {p.published ? "Yes" : "No"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(p)}
                        className="inline-flex items-center gap-1 rounded border border-[#ced4da] px-2 py-1 text-xs font-semibold hover:bg-[#f8f9fa]"
                      >
                        <Pencil className="size-3" aria-hidden />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDelete(p)}
                        className="inline-flex items-center gap-1 rounded border border-red-200 bg-red-50 px-2 py-1 text-xs font-semibold text-red-800 hover:bg-red-100"
                      >
                        <Trash2 className="size-3" aria-hidden />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
