import { useCallback, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import { useDropzone } from 'react-dropzone';
import Button from '@/components/ui/Button';
import { DEFAULT_POST_CATEGORIES } from '@/constants/categories';
import { useAdminPost, useCreatePost, useUpdatePost } from '@/features/admin/hooks/useAdminPosts';
import { useAdminTaxonomy } from '@/features/admin/hooks/useAdminTaxonomy';
import { useAdminMediaAssets } from '@/features/admin/hooks/useAdminMedia';

const heroImageSchema = z
  .string()
  .min(1, 'Provide a valid URL or select an uploaded image')
  .refine(
    (value) =>
      value.startsWith('http://') ||
      value.startsWith('https://') ||
      value.startsWith('/uploads/') ||
      value.startsWith('data:'),
    'Provide a valid URL or select an uploaded image',
  );

const formSchema = z.object({
  title: z.string().min(4, 'Title should be at least 4 characters'),
  slug: z
    .string()
    .min(4)
    .regex(/^[a-z0-9-]+$/, 'Use lowercase letters, numbers, and dashes only'),
  excerpt: z.string().min(20, 'Excerpt should be at least 20 characters'),
  category: z.string().min(2, 'Select a category'),
  tags: z.string().optional(),
  heroImage: heroImageSchema,
  content: z.string().min(50, 'Share a bit more detail in the body'),
  isPublished: z.boolean(),
  featured: z.boolean(),
});

export type PostFormValues = z.infer<typeof formSchema>;

interface AdminPostEditorPageProps {
  mode: 'create' | 'edit';
}

const extractTags = (value: string | undefined) =>
  value
    ?.split(',')
    .map((tag) => tag.trim())
    .filter(Boolean) ?? [];

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

export const AdminPostEditorPage = ({ mode }: AdminPostEditorPageProps) => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const isEditing = mode === 'edit';

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PostFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      category: DEFAULT_POST_CATEGORIES[0],
      tags: '',
      heroImage: '',
      content: '',
      isPublished: false,
      featured: false,
    },
  });

  const { data: existingPost, isLoading } = useAdminPost(isEditing ? postId : undefined);
  const { mutateAsync: createPost, isPending: isCreating } = useCreatePost();
  const { mutateAsync: updatePost, isPending: isUpdating } = useUpdatePost();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { data: taxonomy } = useAdminTaxonomy();
  const availableCategories = taxonomy?.categories.map((category) => category.name) ?? Array.from(DEFAULT_POST_CATEGORIES);
  const availableTags = taxonomy?.tags ?? [];
  const { data: mediaAssets = [], isLoading: isMediaLoading } = useAdminMediaAssets();

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? '';
  const assetOrigin = useMemo(() => {
    if (!apiBaseUrl) {
      return window.location.origin;
    }
    try {
      return new URL(apiBaseUrl).origin;
    } catch (error) {
      console.warn('Failed to parse VITE_API_BASE_URL', error);
      return window.location.origin;
    }
  }, [apiBaseUrl]);

  const resolveAssetUrl = useCallback(
    (url: string) => {
      if (!url) {
        return '';
      }
      if (url.startsWith('http') || url.startsWith('data:')) {
        return url;
      }
      const normalized = url.startsWith('/') ? url : `/${url}`;
      return `${assetOrigin}${normalized}`;
    },
    [assetOrigin],
  );
  const appendTag = (tagName: string) => {
    const current = getValues('tags') ?? '';
    const tags = current
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
    if (!tags.includes(tagName)) {
      tags.push(tagName);
      setValue('tags', tags.join(', '), { shouldDirty: true });
    }
  };

  useEffect(() => {
    if (existingPost) {
      reset({
        title: existingPost.title,
        slug: existingPost.slug,
        excerpt: existingPost.excerpt,
        category: existingPost.category,
        tags: existingPost.tags.map((tag) => tag.name).join(', '),
        heroImage: existingPost.heroImage,
        content: existingPost.content,
        isPublished: existingPost.isPublished,
        featured: Boolean(existingPost.featured),
      });
      setPreviewImage(resolveAssetUrl(existingPost.heroImage));
    }
  }, [existingPost, reset, resolveAssetUrl]);

  useEffect(() => {
    if (availableCategories.length === 0) {
      return;
    }
    const currentCategory = getValues('category');
    if (!currentCategory || !availableCategories.includes(currentCategory)) {
      setValue('category', availableCategories[0], { shouldValidate: true });
    }
  }, [availableCategories, getValues, setValue]);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreviewImage(result);
      setValue('heroImage', result, { shouldValidate: true });
    };
    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ accept: { 'image/*': [] }, onDrop });

  const contentValue = watch('content');
  const heroImageValue = watch('heroImage');

  const submitHandler = handleSubmit(async (values) => {
    const payload = {
      title: values.title,
      slug: values.slug,
      excerpt: values.excerpt,
      content: values.content,
      category: values.category,
      tags: extractTags(values.tags),
      heroImage: values.heroImage,
      publishedAt: values.isPublished ? new Date().toISOString() : null,
      isPublished: values.isPublished,
      featured: values.featured,
    };

    if (isEditing && postId) {
      await updatePost({ postId, payload });
    } else {
      await createPost(payload);
    }

    navigate('/admin/posts');
  });

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'title' && !isEditing) {
        const generated = slugify(value.title ?? '');
        if (generated) {
          setValue('slug', generated, { shouldValidate: true });
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue, isEditing]);

  const isProcessing = isSubmitting || isCreating || isUpdating;

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-neutral-900">
          {isEditing ? 'Edit post' : 'Create new post'}
        </h1>
        <p className="text-sm text-neutral-500">
          {isEditing ? 'Update the content and metadata of your story.' : 'Draft a new article to share with your readers.'}
        </p>
      </div>

      {isLoading && isEditing ? (
        <div className="rounded-3xl border border-neutral-200/80 bg-white p-8 text-sm text-neutral-500">
          Fetching post details...
        </div>
      ) : (
        <form className="space-y-10" onSubmit={submitHandler} noValidate>
          <div className="rounded-3xl border border-neutral-200/80 bg-white p-8 shadow-subtle/40">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700" htmlFor="title">
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="Craft a headline that matches the depth of the story"
                  className="w-full rounded-2xl border border-neutral-300 px-4 py-3 text-sm focus:border-neutral-400"
                  {...register('title')}
                />
                {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700" htmlFor="slug">
                  Slug
                </label>
                <input
                  id="slug"
                  type="text"
                  placeholder="my-post-slug"
                  className="w-full rounded-2xl border border-neutral-300 px-4 py-3 text-sm focus:border-neutral-400"
                  {...register('slug')}
                />
                {errors.slug && <p className="text-xs text-red-500">{errors.slug.message}</p>}
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-neutral-700" htmlFor="excerpt">
                  Excerpt
                </label>
                <textarea
                  id="excerpt"
                  rows={3}
                  placeholder="A short summary to entice readers..."
                  className="w-full rounded-2xl border border-neutral-300 px-4 py-3 text-sm focus:border-neutral-400"
                  {...register('excerpt')}
                />
                {errors.excerpt && <p className="text-xs text-red-500">{errors.excerpt.message}</p>}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-neutral-200/80 bg-white p-8 shadow-subtle/40">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700" htmlFor="category">
                  Category
                </label>
                <select
                  id="category"
                  className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-sm focus:border-neutral-400"
                  {...register('category')}
                >
                  {availableCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700" htmlFor="tags">
                  Tags
                </label>
                <input
                  id="tags"
                  type="text"
                  placeholder="swiftui, ci-cd, apple"
                  className="w-full rounded-2xl border border-neutral-300 px-4 py-3 text-sm focus:border-neutral-400"
                  {...register('tags')}
                />
                <p className="text-xs text-neutral-400">Separate tags with commas.</p>
                {availableTags.length > 0 ? (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {availableTags.slice(0, 6).map((tag) => (
                      <button
                        key={tag.id}
                        type="button"
                        className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-600 hover:border-accent hover:text-accent"
                        onClick={() => appendTag(tag.name)}
                      >
                        #{tag.name}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-neutral-700" htmlFor="heroImage">
                  Hero image URL
                </label>
                <input
                  id="heroImage"
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  className="w-full rounded-2xl border border-neutral-300 px-4 py-3 text-sm focus:border-neutral-400"
                  {...register('heroImage')}
                />
                {errors.heroImage && <p className="text-xs text-red-500">{errors.heroImage.message}</p>}
              </div>
              <div className="md:col-span-2">
                <div
                  {...getRootProps()}
                  className={clsx(
                    'flex h-44 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-neutral-300 bg-neutral-50 text-center text-sm transition-colors',
                    isDragActive && 'border-accent bg-accent-soft/20 text-accent',
                  )}
                >
                  <input {...getInputProps()} />
                  <p className="font-medium text-neutral-700">Drag & drop or click to upload a hero image</p>
                  <p className="mt-2 text-xs text-neutral-500">PNG, JPG or HEIC up to 5MB</p>
                </div>
                {previewImage ? (
                  <div className="mt-6 overflow-hidden rounded-3xl border border-neutral-200/80">
                    <img src={previewImage} alt="Preview" className="h-64 w-full object-cover" />
                  </div>
                ) : null}

                <div className="mt-6 space-y-3">
                  <p className="text-sm font-medium text-neutral-700">Select from media library</p>
                  {isMediaLoading ? (
                    <p className="text-xs text-neutral-500">Loading assets...</p>
                  ) : mediaAssets.length > 0 ? (
                    <div className="grid gap-3 sm:grid-cols-3">
                      {mediaAssets.map((asset) => {
                        const resolvedUrl = resolveAssetUrl(asset.url);
                        const isSelected = heroImageValue === asset.url || heroImageValue === resolvedUrl;
                        return (
                          <button
                            key={asset.id}
                            type="button"
                            onClick={() => {
                              setValue('heroImage', asset.url, { shouldValidate: true });
                              setPreviewImage(resolvedUrl);
                            }}
                            className={clsx(
                              'overflow-hidden rounded-2xl border transition-all',
                              isSelected
                                ? 'border-accent ring-2 ring-accent-soft'
                                : 'border-neutral-200 hover:border-neutral-300',
                            )}
                          >
                            <img
                              src={resolvedUrl}
                              alt={asset.filename}
                              className="h-32 w-full object-cover"
                            />
                            <div className="border-t border-neutral-200 bg-white px-3 py-2 text-left text-xs text-neutral-500">
                              {asset.filename}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-500">Upload media from the library tab to reuse here.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-neutral-200/80 bg-white p-8 shadow-subtle/40">
            <div className="flex flex-col gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">Body</label>
                <MDEditor
                  value={contentValue}
                  onChange={(value) => setValue('content', value ?? '', { shouldValidate: true })}
                  height={400}
                  preview="edit"
                  textareaProps={{ placeholder: 'Start writing your insight...' }}
                />
                {errors.content && <p className="text-xs text-red-500">{errors.content.message}</p>}
              </div>
              <div className="space-y-2 rounded-2xl bg-neutral-50 p-6">
                <h2 className="text-sm font-semibold text-neutral-800">Preview</h2>
                <div className="prose prose-neutral max-w-none">
                  <MDEditor.Markdown source={contentValue} />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-neutral-200/80 bg-white p-8 shadow-subtle/40">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-neutral-900">Publishing</h2>
                <p className="text-sm text-neutral-600">
                  Control when the post goes live and whether it should be highlighted as featured content on the homepage.
                </p>
              </div>
              <div className="flex flex-col gap-4 text-sm">
                <label className="inline-flex items-center gap-3">
                  <input type="checkbox" className="size-4 rounded" {...register('isPublished')} />
                  Publish immediately
                </label>
                <label className="inline-flex items-center gap-3">
                  <input type="checkbox" className="size-4 rounded" {...register('featured')} />
                  Feature on homepage
                </label>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <Button type="submit" disabled={isProcessing}>
                {isProcessing ? 'Saving...' : 'Save changes'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/admin/posts')}>
                Cancel
              </Button>
            </div>
          </div>
        </form>
      )}
    </section>
  );
};

export default AdminPostEditorPage;
