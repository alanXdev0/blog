import { Link, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import Button from '@/components/ui/Button';
import { TagPill } from '@/components/ui/TagPill';
import { useAdminPosts, useTogglePublish, useDeletePost } from '@/features/admin/hooks/useAdminPosts';

const statusStyles: Record<string, string> = {
  Draft: 'bg-neutral-200/60 text-neutral-700',
  Published: 'bg-emerald-100 text-emerald-700',
};

export const AdminPostsPage = () => {
  const navigate = useNavigate();
  const { data: posts = [], isLoading, isError } = useAdminPosts();
  const { mutateAsync: togglePublish, isPending: isPublishing } = useTogglePublish();
  const { mutateAsync: deletePost, isPending: isDeleting } = useDeletePost();

  const handleTogglePublish = async (postId: string, isPublished: boolean) => {
    await togglePublish({ postId, isPublished: !isPublished });
  };

  const handleDelete = async (postId: string) => {
    const confirmation = window.confirm('Delete this post? This action cannot be undone.');
    if (!confirmation) {
      return;
    }
    await deletePost(postId);
  };

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Posts</h1>
          <p className="text-sm text-neutral-500">Manage your writing, toggle visibility, and refine metadata.</p>
        </div>
        <Button onClick={() => navigate('/admin/posts/new')}>New post</Button>
      </div>

      <div className="overflow-hidden rounded-3xl border border-neutral-200/80 bg-white shadow-subtle/40">
        <table className="min-w-full divide-y divide-neutral-200/80 text-left text-sm">
          <thead className="bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
            <tr>
              <th className="px-6 py-4 font-semibold">Title</th>
              <th className="px-6 py-4 font-semibold">Category</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Published</th>
              <th className="px-6 py-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-neutral-500">
                  Loading posts...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-neutral-500">
                  Could not load posts. Refresh to try again.
                </td>
              </tr>
            ) : posts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-neutral-500">
                  No posts yet. Start by creating your first story.
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="transition-colors hover:bg-neutral-50/80">
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-neutral-900">{post.title}</span>
                      <span className="text-xs text-neutral-500">/{post.slug}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <TagPill label={post.category} />
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={clsx(
                        'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
                        statusStyles[post.isPublished ? 'Published' : 'Draft'],
                      )}
                    >
                      {post.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-xs text-neutral-500">
                    {post.isPublished ? new Date(post.publishedAt ?? '').toLocaleDateString() : 'Not published'}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-wrap gap-3 text-xs font-medium">
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(post.id, post.isPublished)}
                        className="text-accent hover:text-accent-soft"
                        disabled={isPublishing}
                      >
                        {post.isPublished ? 'Unpublish' : 'Publish'}
                      </button>
                      <Link to={`/admin/posts/${post.id}/edit`} className="text-neutral-600 hover:text-neutral-900">
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(post.id)}
                        className="text-red-500 hover:text-red-600"
                        disabled={isDeleting}
                      >
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
    </section>
  );
};

export default AdminPostsPage;
