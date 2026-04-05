"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Category } from "@/lib/types/portfolio";
import { slugify } from "@/lib/utils/slug";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

export function CategoryManager() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [rows, setRows] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [icon, setIcon] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editIcon, setEditIcon] = useState("");
  const [editSort, setEditSort] = useState(0);

  const load = useCallback(async () => {
    setError(null);
    const { data, error: qErr } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });
    if (qErr) {
      setError(qErr.message);
      setRows([]);
    } else {
      setRows((data ?? []) as Category[]);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const s = slug.trim() || slugify(name);
    const { error: insErr } = await supabase.from("categories").insert({
      name: name.trim(),
      slug: s,
      icon: icon.trim() || null,
      sort_order: sortOrder,
    });
    setSaving(false);
    if (insErr) {
      setError(insErr.message);
      return;
    }
    setName("");
    setSlug("");
    setIcon("");
    setSortOrder(0);
    await load();
  }

  function startEdit(c: Category) {
    setEditingId(c.id);
    setEditName(c.name);
    setEditSlug(c.slug);
    setEditIcon(c.icon ?? "");
    setEditSort(c.sort_order);
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function saveEdit() {
    if (!editingId) return;
    setSaving(true);
    setError(null);
    const { error: upErr } = await supabase
      .from("categories")
      .update({
        name: editName.trim(),
        slug: editSlug.trim(),
        icon: editIcon.trim() || null,
        sort_order: editSort,
      })
      .eq("id", editingId);
    setSaving(false);
    if (upErr) {
      setError(upErr.message);
      return;
    }
    setEditingId(null);
    await load();
  }

  async function removeRow(id: string) {
    if (!window.confirm("Delete this category? Projects must be moved first.")) {
      return;
    }
    setError(null);
    const { error: delErr } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);
    if (delErr) {
      setError(delErr.message);
      return;
    }
    await load();
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-[#6c757d]">
        <Loader2 className="size-5 animate-spin" aria-hidden />
        Loading categories…
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {error ? (
        <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      <form
        onSubmit={(e) => void handleCreate(e)}
        className="rounded-xl border border-[#dee2e6] bg-white p-6 shadow-sm"
      >
        <h2 className="text-lg font-semibold text-[#212529]">Add category</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#6c757d]">
              Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-md border border-[#ced4da] px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#6c757d]">
              Slug
            </label>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder={name ? slugify(name) : "unique-slug"}
              className="w-full rounded-md border border-[#ced4da] px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#6c757d]">
              Sort order
            </label>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
              className="w-full rounded-md border border-[#ced4da] px-3 py-2 text-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#6c757d]">
              Icon hint (optional, e.g. brain, cloud, globe)
            </label>
            <input
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-full rounded-md border border-[#ced4da] px-3 py-2 text-sm"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="mt-4 inline-flex items-center gap-2 rounded-md bg-[#0d6efd] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0b5ed7] disabled:opacity-60"
        >
          <Plus className="size-4" aria-hidden />
          Add category
        </button>
      </form>

      <div className="overflow-x-auto rounded-xl border border-[#dee2e6] bg-white shadow-sm">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-[#dee2e6] bg-[#f8f9fa]">
            <tr>
              <th className="px-4 py-3 font-semibold text-[#495057]">Name</th>
              <th className="px-4 py-3 font-semibold text-[#495057]">Slug</th>
              <th className="px-4 py-3 font-semibold text-[#495057]">Icon</th>
              <th className="px-4 py-3 font-semibold text-[#495057]">Order</th>
              <th className="px-4 py-3 font-semibold text-[#495057]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-[#6c757d]"
                >
                  No categories yet. Add one above.
                </td>
              </tr>
            ) : (
              rows.map((c) =>
                editingId === c.id ? (
                  <tr key={c.id} className="border-b border-[#f1f3f5] bg-[#e7f1ff]/40">
                    <td className="px-4 py-3">
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full rounded border border-[#ced4da] px-2 py-1 text-sm"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        value={editSlug}
                        onChange={(e) => setEditSlug(e.target.value)}
                        className="w-full rounded border border-[#ced4da] px-2 py-1 text-sm"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        value={editIcon}
                        onChange={(e) => setEditIcon(e.target.value)}
                        className="w-full rounded border border-[#ced4da] px-2 py-1 text-sm"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={editSort}
                        onChange={(e) => setEditSort(Number(e.target.value))}
                        className="w-20 rounded border border-[#ced4da] px-2 py-1 text-sm"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => void saveEdit()}
                          disabled={saving}
                          className="rounded bg-[#198754] px-2 py-1 text-xs font-semibold text-white hover:bg-[#157347]"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="rounded border border-[#ced4da] px-2 py-1 text-xs font-semibold"
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr
                    key={c.id}
                    className="border-b border-[#f1f3f5] hover:bg-[#f8f9fa]/80"
                  >
                    <td className="px-4 py-3 font-medium text-[#212529]">
                      {c.name}
                    </td>
                    <td className="px-4 py-3 text-[#6c757d]">{c.slug}</td>
                    <td className="px-4 py-3 text-[#6c757d]">
                      {c.icon ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-[#6c757d]">{c.sort_order}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(c)}
                          className="inline-flex items-center gap-1 rounded border border-[#ced4da] px-2 py-1 text-xs font-semibold hover:bg-[#f8f9fa]"
                        >
                          <Pencil className="size-3" aria-hidden />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => void removeRow(c.id)}
                          className="inline-flex items-center gap-1 rounded border border-red-200 bg-red-50 px-2 py-1 text-xs font-semibold text-red-800 hover:bg-red-100"
                        >
                          <Trash2 className="size-3" aria-hidden />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ),
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
