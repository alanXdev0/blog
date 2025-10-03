import { useState, type FormEvent } from 'react';
import Button from '@/components/ui/Button';
import { TagPill } from '@/components/ui/TagPill';
import {
  useAdminTaxonomy,
  useCreateCategory,
  useDeleteCategory,
  useCreateTag,
  useDeleteTag,
} from '@/features/admin/hooks/useAdminTaxonomy';
import { DEFAULT_POST_CATEGORIES } from '@/constants/categories';

const pastelPalette = ['#D8B4FE', '#C4B5FD', '#A5B4FC', '#93C5FD', '#99F6E4', '#FDE68A', '#FECACA'];

export const AdminTaxonomyPage = () => {
  const { data, isLoading } = useAdminTaxonomy();
  const createCategoryMutation = useCreateCategory();
  const deleteCategoryMutation = useDeleteCategory();
  const createTagMutation = useCreateTag();
  const deleteTagMutation = useDeleteTag();

  const [categoryInput, setCategoryInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tagColor, setTagColor] = useState(pastelPalette[0]);

  const categories = data?.categories ?? DEFAULT_POST_CATEGORIES.map((name) => ({ id: name.toLowerCase(), name }));
  const tags = data?.tags ?? [];

  const handleCategorySubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!categoryInput.trim()) return;
    await createCategoryMutation.mutateAsync(categoryInput.trim());
    setCategoryInput('');
  };

  const handleTagSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!tagInput.trim()) return;
    await createTagMutation.mutateAsync({ name: tagInput.trim(), color: tagColor });
    setTagInput('');
  };

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-neutral-900">Categories & tags</h1>
        <p className="text-sm text-neutral-500">
          Keep your content structure tidy by maintaining the categories and tags that surface on the blog.
        </p>
      </div>

      {isLoading ? (
        <div className="rounded-3xl border border-neutral-200/80 bg-white p-10 text-sm text-neutral-500">
          Loading taxonomy...
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-6 rounded-3xl border border-neutral-200/80 bg-white p-8 shadow-subtle/40">
            <div>
              <h2 className="text-lg font-semibold text-neutral-900">Categories</h2>
              <p className="text-sm text-neutral-500">Define the focus areas that readers can filter by.</p>
            </div>
            <form className="flex gap-3" onSubmit={handleCategorySubmit}>
              <input
                name="category"
                type="text"
                value={categoryInput}
                onChange={(event) => setCategoryInput(event.target.value)}
                placeholder="Add new category"
                className="flex-1 rounded-2xl border border-neutral-300 px-4 py-3 text-sm focus:border-neutral-400"
              />
              <Button type="submit" variant="outline" disabled={createCategoryMutation.isPending}>
                {createCategoryMutation.isPending ? 'Adding...' : 'Add'}
              </Button>
            </form>
            <ul className="space-y-3 text-sm">
              {categories.map((category) => (
                <li key={category.id} className="flex items-center justify-between rounded-2xl bg-neutral-50 px-4 py-3">
                  <span className="font-medium text-neutral-800">{category.name}</span>
                  <button
                    type="button"
                    className="text-xs text-neutral-500 hover:text-red-500"
                    onClick={() => deleteCategoryMutation.mutate(category.id)}
                    disabled={deleteCategoryMutation.isPending}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6 rounded-3xl border border-neutral-200/80 bg-white p-8 shadow-subtle/40">
            <div>
              <h2 className="text-lg font-semibold text-neutral-900">Tags</h2>
              <p className="text-sm text-neutral-500">Add nuance to your writing with descriptive tags.</p>
            </div>
            <form className="grid gap-3 md:grid-cols-[1fr_auto]" onSubmit={handleTagSubmit}>
              <div className="space-y-2">
                <input
                  name="tag-name"
                  type="text"
                  value={tagInput}
                  onChange={(event) => setTagInput(event.target.value)}
                  placeholder="Tag label"
                  className="w-full rounded-2xl border border-neutral-300 px-4 py-3 text-sm focus:border-neutral-400"
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  name="tag-color"
                  type="color"
                  value={tagColor}
                  onChange={(event) => setTagColor(event.target.value)}
                  className="h-11 w-16 cursor-pointer rounded-2xl border border-neutral-200"
                  aria-label="Tag color"
                />
                <Button type="submit" variant="outline" disabled={createTagMutation.isPending}>
                  {createTagMutation.isPending ? 'Adding...' : 'Add tag'}
                </Button>
              </div>
            </form>
            <div className="flex flex-wrap gap-3">
              {tags.map((tag) => (
                <div key={tag.id} className="flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5">
                  <TagPill label={tag.name} color={tag.color ?? undefined} />
                  <button
                    type="button"
                    className="text-xs text-neutral-500 hover:text-red-500"
                    onClick={() => deleteTagMutation.mutate(tag.id)}
                    disabled={deleteTagMutation.isPending}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminTaxonomyPage;
