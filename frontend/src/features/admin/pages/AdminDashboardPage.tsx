import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { useAdminPosts } from '@/features/admin/hooks/useAdminPosts';
import { useProjects } from '@/hooks/useProjects';

export const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { data: posts = [], isLoading: loadingPosts } = useAdminPosts();
  const { data: projects = [], isLoading: loadingProjects } = useProjects();

  const publishedCount = posts.filter((post) => post.isPublished).length;
  const draftCount = posts.length - publishedCount;
  const featuredCount = posts.filter((post) => post.featured).length;

  return (
    <section className="space-y-8 text-neutral-900 dark:text-neutral-100">
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold text-neutral-900">Content workspace</h1>
        <p className="text-sm text-neutral-500">
          Track publishing health, queue new ideas, and keep your portfolio in sync.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-subtle/40 dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Published</p>
          <p className="mt-3 text-3xl font-semibold text-neutral-900">{loadingPosts ? '...' : publishedCount}</p>
          <p className="mt-1 text-xs text-neutral-500">Stories live on alananaya.dev</p>
        </div>
        <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-subtle/40 dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Drafts</p>
          <p className="mt-3 text-3xl font-semibold text-neutral-900">{loadingPosts ? '...' : draftCount}</p>
          <p className="mt-1 text-xs text-neutral-500">Ideas still in progress</p>
        </div>
        <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-subtle/40 dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Featured</p>
          <p className="mt-3 text-3xl font-semibold text-neutral-900">{loadingPosts ? '...' : featuredCount}</p>
          <p className="mt-1 text-xs text-neutral-500">Highlighted on the homepage</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-neutral-200/80 bg-white p-8 shadow-subtle/40 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-neutral-900">Draft something new</h2>
              <p className="mt-1 text-sm text-neutral-500">
                Capture a fresh insight or project lesson while the context is vivid.
              </p>
            </div>
            <Button size="sm" onClick={() => navigate('/admin/posts/new')}>
              Start writing
            </Button>
          </div>
          <ul className="mt-6 space-y-3 text-sm text-neutral-600">
            <li>- Recent themes: testing pipelines, SwiftUI interactions, cross-platform patterns</li>
            <li>- Recommended length: 700-1200 words</li>
            <li>- Remember to add two supporting visuals</li>
          </ul>
        </div>
        <div className="rounded-3xl border border-neutral-200/80 bg-white p-8 shadow-subtle/40 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-neutral-900">Portfolio status</h2>
              <p className="mt-1 text-sm text-neutral-500">
                Make sure flagship projects reflect the latest releases and visuals.
              </p>
            </div>
            <Button size="sm" variant="outline" onClick={() => navigate('/admin/media')}>
              Update media
            </Button>
          </div>
          <p className="mt-6 text-3xl font-semibold text-neutral-900">{loadingProjects ? '...' : projects.length} projects</p>
          <p className="text-xs text-neutral-500">Showcased on the projects page</p>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboardPage;
