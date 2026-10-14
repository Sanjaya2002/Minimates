"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Tags, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Skeleton } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";
import { slugify } from "@/lib/utils/slug";

interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  productCount?: number;
}

interface CategoryForm {
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
}

const emptyForm: CategoryForm = { name: "", slug: "", description: "", imageUrl: "" };

export default function AdminCategoriesPage() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<CategoryRow[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryRow | null>(null);
  const [form, setForm] = useState<CategoryForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<CategoryRow | null>(null);
  const [deletingBusy, setDeletingBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/categories", { cache: "no-store" });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json.error);
      setCategories(json.data);
    } catch (error) {
      toast(error instanceof Error ? error.message : "Failed to load", "error");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setFormOpen(true);
  }

  function openEdit(category: CategoryRow) {
    setEditing(category);
    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description ?? "",
      imageUrl: category.imageUrl ?? "",
    });
    setFormOpen(true);
  }

  function handleName(name: string) {
    setForm((current) => ({ ...current, name }));
    if (!editing) setForm((current) => ({ ...current, slug: slugify(name) }));
  }

  async function save() {
    if (!form.name.trim() || !form.slug.trim()) {
      toast("Name and slug are required", "error");
      return;
    }
    setSaving(true);
    try {
      const url = editing ? `/api/admin/categories/${editing.id}` : "/api/admin/categories";
      const response = await fetch(url, {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          slug: form.slug.trim(),
          description: form.description.trim() || null,
          imageUrl: form.imageUrl.trim() || null,
        }),
      });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json.error);
      toast(editing ? "Category updated" : "Category created", "success");
      setFormOpen(false);
      load();
    } catch (error) {
      toast(error instanceof Error ? error.message : "Could not save category", "error");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    setDeletingBusy(true);
    try {
      const response = await fetch(`/api/admin/categories/${deleting.id}`, {
        method: "DELETE",
      });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json.message ?? json.error);
      toast("Category deleted", "success");
      setDeleting(null);
      load();
    } catch (error) {
      toast(error instanceof Error ? error.message : "Could not delete", "error");
    } finally {
      setDeletingBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-ink">Categories</h1>
          <p className="text-sm text-ink-soft">Organise your catalogue.</p>
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus className="h-4 w-4" /> New category
        </Button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-20" />
          ))}
        </div>
      ) : categories && categories.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-ink/15 bg-white p-12 text-center">
          <Tags className="mx-auto h-10 w-10 text-ink-soft" />
          <p className="mt-3 font-heading font-bold text-ink">No categories yet</p>
          <p className="mt-1 text-sm text-ink-soft">Create your first category to get started.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {categories?.map((category) => (
            <li
              key={category.id}
              className="flex items-center justify-between gap-3 rounded-3xl border border-ink/8 bg-white p-5 shadow-soft"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="truncate font-heading font-bold text-ink">{category.name}</span>
                  <Badge tone="pink">{category.productCount ?? 0} products</Badge>
                </div>
                <p className="mt-0.5 text-xs text-ink-soft">
                  {category.slug}
                  {category.description ? ` · ${category.description}` : ""}
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => openEdit(category)}
                  className="rounded-full p-2 text-ink-soft transition-colors hover:bg-cream hover:text-playful-pink"
                  aria-label={`Edit ${category.name}`}
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleting(category)}
                  className="rounded-full p-2 text-ink-soft transition-colors hover:bg-red-50 hover:text-red-500"
                  aria-label={`Delete ${category.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing ? "Edit category" : "New category"}>
        <div className="space-y-4">
          <Input
            label="Name"
            value={form.name}
            onChange={(event) => handleName(event.target.value)}
            placeholder="Sleep & Swaddle"
            autoFocus
          />
          <Input
            label="Slug"
            value={form.slug}
            onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))}
            placeholder="sleep-swaddle"
          />
          <Textarea
            label="Description"
            rows={2}
            value={form.description}
            onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
            placeholder="Short description shown on the shop page."
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setFormOpen(false)}>
              <X className="h-4 w-4" /> Cancel
            </Button>
            <Button onClick={save} loading={saving}>
              {editing ? "Save changes" : "Create"}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal open={Boolean(deleting)} onClose={() => setDeleting(null)} title="Delete category">
        {deleting && (
          <div className="space-y-4">
            <p className="text-sm text-ink-soft">
              Delete <span className="font-semibold text-ink">{deleting.name}</span>? Categories
              with products can&apos;t be deleted until the products are moved.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleting(null)}>
                Cancel
              </Button>
              <Button variant="danger" loading={deletingBusy} onClick={confirmDelete}>
                Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}