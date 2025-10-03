import { useMemo, useState } from 'react';
import { Plus, Edit3, Trash2, Upload, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useAdminProjects, useCreateProject, useUpdateProject, useDeleteProject, type ProjectPayload } from '@/features/admin/hooks/useAdminProjects';
import { useUploadMediaAsset } from '@/features/admin/hooks/useAdminMedia';
import { resolveAssetUrl } from '@/lib/apiClient';
import type { Project } from '@/types/content';

interface ProjectFormState {
  name: string;
  description: string;
  link: string;
  image: string;
  status: string;
  sortOrder: number;
  techStack: string[];
}

const emptyForm: ProjectFormState = {
  name: '',
  description: '',
  link: '',
  image: '',
  status: 'active',
  sortOrder: 0,
  techStack: [],
};

export const AdminProjectsPage = () => {
  const { data: projects = [], isLoading } = useAdminProjects();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const uploadMedia = useUploadMediaAsset();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formState, setFormState] = useState<ProjectFormState>(emptyForm);
  const [techInput, setTechInput] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const resolvedImage = useMemo(() => resolveAssetUrl(formState.image), [formState.image]);

  const openCreate = () => {
    setFormState(emptyForm);
    setTechInput('');
    setEditingId(null);
    setIsDialogOpen(true);
  };

  const openEdit = (project: Project) => {
    setFormState({
      name: project.name,
      description: project.description,
      link: project.link,
      image: project.image,
      status: project.status ?? 'active',
      sortOrder: project.sortOrder ?? 0,
      techStack: project.techStack ?? [],
    });
    setTechInput('');
    setEditingId(project.id);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingId(null);
    setFormState(emptyForm);
    setTechInput('');
  };

  const handleUpload = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    const asset = await uploadMedia.mutateAsync(file);
    setFormState((prev) => ({ ...prev, image: asset.url }));
  };

  const addTech = () => {
    const value = techInput.trim();
    if (!value) {
      return;
    }
    setFormState((prev) =>
      prev.techStack.includes(value) ? prev : { ...prev, techStack: [...prev.techStack, value] },
    );
    setTechInput('');
  };

  const removeTech = (value: string) => {
    setFormState((prev) => ({
      ...prev,
      techStack: prev.techStack.filter((item) => item !== value),
    }));
  };

  const handleSave = async () => {
    const payload: ProjectPayload = {
      name: formState.name,
      description: formState.description,
      link: formState.link,
      image: formState.image,
      status: formState.status,
      sortOrder: Number(formState.sortOrder) || 0,
      techStack: formState.techStack,
    };

    if (editingId) {
      await updateProject.mutateAsync({ id: editingId, payload });
    } else {
      await createProject.mutateAsync(payload);
    }

    closeDialog();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this project?')) {
      return;
    }
    await deleteProject.mutateAsync(id);
  };

  const isProcessing =
    createProject.isPending || updateProject.isPending || deleteProject.isPending || uploadMedia.isPending;

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-neutral-900">Projects</h1>
          <p className="text-sm text-neutral-500">Manage portfolio entries surfaced on the projects page.</p>
        </div>
        <Button onClick={openCreate} className="bg-accent text-white hover:bg-accent-soft hover:text-neutral-900">
          <Plus className="mr-2 h-4 w-4" /> New project
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={`project-skeleton-${index}`}
              className="animate-pulse space-y-4 rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-subtle/40 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="aspect-video rounded-2xl bg-neutral-200/80 dark:bg-neutral-800" />
              <div className="h-4 w-2/3 rounded-full bg-neutral-200 dark:bg-neutral-700" />
              <div className="h-4 w-full rounded-full bg-neutral-200/80 dark:bg-neutral-700" />
            </div>
          ))}
        </div>
      ) : projects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <div key={project.id} className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-subtle/40 dark:border-neutral-800 dark:bg-neutral-900">
              {project.image ? (
                <img
                  src={resolveAssetUrl(project.image)}
                  alt={project.name}
                  className="mb-4 h-40 w-full rounded-2xl object-cover"
                />
              ) : null}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{project.name}</h2>
                  <span
                    className={
                      project.status === 'active'
                        ? 'rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600'
                        : 'rounded-full border border-neutral-200 bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-600'
                    }
                  >
                    {project.status}
                  </span>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-300">{project.description}</p>
                {project.techStack.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                ) : null}
                <div className="flex items-center gap-2 pt-3">
                  <Button size="sm" variant="outline" onClick={() => openEdit(project)}>
                    <Edit3 className="mr-2 h-4 w-4" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-500"
                    onClick={() => handleDelete(project.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Remove
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-neutral-300 bg-white/80 p-12 text-center text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900/70 dark:text-neutral-300">
          No projects yet. Create your first entry to populate the projects page.
        </div>
      )}

      {isDialogOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/30 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl rounded-3xl border border-neutral-200 bg-white p-8 shadow-subtle/60 dark:border-neutral-800 dark:bg-neutral-900">
            <button
              type="button"
              className="absolute right-4 top-4 text-neutral-400 hover:text-neutral-700"
              onClick={closeDialog}
            >
              <X className="h-5 w-5" />
            </button>
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-neutral-900">
                  {editingId ? 'Edit project' : 'New project'}
                </h2>
                <p className="text-sm text-neutral-500">
                  Provide a short narrative and supporting details. Projects marked active appear on the public page.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-neutral-700" htmlFor="project-name">
                  Project name
                  <input
                    id="project-name"
                    type="text"
                    value={formState.name}
                    onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
                    className="w-full rounded-2xl border border-neutral-300 px-4 py-3 text-sm focus:border-neutral-400"
                  />
                </label>
                <label className="space-y-2 text-sm font-medium text-neutral-700" htmlFor="project-link">
                  Project link
                  <input
                    id="project-link"
                    type="url"
                    placeholder="https://..."
                    value={formState.link}
                    onChange={(event) => setFormState((prev) => ({ ...prev, link: event.target.value }))}
                    className="w-full rounded-2xl border border-neutral-300 px-4 py-3 text-sm focus:border-neutral-400"
                  />
                </label>
                <label className="space-y-2 text-sm font-medium text-neutral-700" htmlFor="project-status">
                  Status
                  <select
                    id="project-status"
                    value={formState.status}
                    onChange={(event) => setFormState((prev) => ({ ...prev, status: event.target.value }))}
                    className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-sm focus:border-neutral-400"
                  >
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                  </select>
                </label>
                <label className="space-y-2 text-sm font-medium text-neutral-700" htmlFor="project-sort">
                  Sort order
                  <input
                    id="project-sort"
                    type="number"
                    value={formState.sortOrder}
                    onChange={(event) =>
                      setFormState((prev) => ({ ...prev, sortOrder: Number(event.target.value) }))
                    }
                    className="w-full rounded-2xl border border-neutral-300 px-4 py-3 text-sm focus:border-neutral-400"
                  />
                </label>
              </div>

              <label className="space-y-2 text-sm font-medium text-neutral-700" htmlFor="project-description">
                Description
                <textarea
                  id="project-description"
                  rows={4}
                  value={formState.description}
                  onChange={(event) => setFormState((prev) => ({ ...prev, description: event.target.value }))}
                  className="w-full rounded-2xl border border-neutral-300 px-4 py-3 text-sm focus:border-neutral-400"
                />
              </label>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-neutral-700">Project image</p>
                  <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-medium text-accent">
                    <Upload className="h-4 w-4" /> Upload
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(event) => handleUpload(event.target.files)}
                    />
                  </label>
                </div>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formState.image}
                  onChange={(event) => setFormState((prev) => ({ ...prev, image: event.target.value }))}
                  className="w-full rounded-2xl border border-neutral-300 px-4 py-3 text-sm focus:border-neutral-400"
                />
                {resolvedImage ? (
                  <img src={resolvedImage} alt="Preview" className="h-40 w-full rounded-2xl object-cover" />
                ) : null}
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-neutral-700">Tech stack</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(event) => setTechInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        addTech();
                      }
                    }}
                    className="flex-1 rounded-2xl border border-neutral-300 px-4 py-3 text-sm focus:border-neutral-400"
                    placeholder="Add technology"
                  />
                  <Button type="button" variant="outline" onClick={addTech}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formState.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs text-neutral-600"
                    >
                      {tech}
                      <button type="button" onClick={() => removeTech(tech)}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" type="button" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button type="button" disabled={isProcessing} onClick={handleSave}>
                  Save project
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default AdminProjectsPage;
