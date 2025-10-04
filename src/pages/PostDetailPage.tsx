import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Calendar, Clock, Tag as TagIcon, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import type { HTMLAttributes } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import { motion } from 'framer-motion';
import { Seo } from '@/components/seo/Seo';
import { usePost } from '@/hooks/usePost';

export const PostDetailPage = () => {
  const { slug } = useParams();
  const {
    data: post,
    isLoading,
    isError,
  } = usePost(slug);

  const canonicalPath = slug ? `/posts/${slug}` : undefined;

  const meta = useMemo(() => {
    if (!post) return null;
    const publishedAt = post.publishedAt ? new Date(post.publishedAt) : null;
    const formattedDate = publishedAt ? format(publishedAt, 'MMMM d, yyyy') : undefined;
    const readingTime = post.meta?.readingTime ?? post.readingTime ?? '5 min read';
    return { formattedDate, readingTime };
  }, [post]);

  const publishedAtIso = post?.publishedAt ? new Date(post.publishedAt).toISOString() : undefined;

  if (isLoading) {
    return (
      <>
        <Seo title="Loading article" canonical={canonicalPath} noIndex />
        <div className="mx-auto max-w-4xl px-6 py-16">
          <div className="animate-pulse space-y-8">
            <div className="h-8 w-3/4 rounded bg-neutral-200" />
            <div className="h-64 rounded bg-neutral-200" />
            <div className="space-y-4">
              <div className="h-4 rounded bg-neutral-200" />
              <div className="h-4 rounded bg-neutral-200" />
              <div className="h-4 w-5/6 rounded bg-neutral-200" />
            </div>
          </div>
        </div>
      </>
    );
  }

  if (isError || !post) {
    return (
      <>
        <Seo title="Post not available" canonical={canonicalPath} noIndex />
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <h1 className="mb-4 text-3xl font-semibold text-neutral-900">Post not available</h1>
          <p className="mb-6 text-sm text-neutral-500">
            The story might have been unpublished or is still in draft mode.
          </p>
          <Link to="/" className="text-sm font-medium text-accent">
            Back to home
          </Link>
        </div>
      </>
    );
  }

  const formattedTags = post.tags?.map((tag) => tag.name).filter(Boolean) ?? [];

  return (
    <>
      <Seo
        title={post.title}
        description={post.excerpt ?? post.title}
        canonical={canonicalPath}
        image={post.heroImage}
        type="article"
        publishedTime={publishedAtIso}
        tags={formattedTags}
      />
      <motion.article
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mx-auto max-w-4xl px-6 py-12 text-neutral-900 transition-colors"
      >
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-neutral-600 transition-colors hover:text-neutral-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all posts
        </Link>

        <header className="mb-12 space-y-6">
          <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500">
            <span className="rounded-full border border-accent-soft/50 bg-accent-soft/20 px-3 py-1 text-xs font-medium text-accent">
              {post.category}
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {meta?.formattedDate ?? format(new Date(), 'MMMM d, yyyy')}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {meta?.readingTime ?? '5 min read'}
            </span>
          </div>

          <h1 className="text-4xl font-bold leading-tight text-neutral-900 md:text-5xl">{post.title}</h1>

          {post.excerpt ? (
            <p className="text-xl leading-relaxed text-neutral-600">{post.excerpt}</p>
          ) : null}
        </header>

        {post.heroImage ? (
          <div className="mb-12 overflow-hidden rounded-2xl shadow-subtle/40">
            <img src={post.heroImage} alt={post.title} className="h-full w-full object-cover" />
          </div>
        ) : null}

        <div className="prose prose-lg max-w-none pb-12 text-neutral-800">
          <ReactMarkdown components={markdownComponents}>{post.content}</ReactMarkdown>
        </div>

        {formattedTags.length > 0 ? (
          <div className="border-t border-neutral-200 pt-8">
            <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-600">
              <TagIcon className="h-4 w-4 text-neutral-400" />
              {formattedTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-sm text-neutral-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </motion.article>
    </>
  );
};


const markdownComponents: Components = {
  h1: (props) => <h1 className="mt-10 text-3xl font-bold" {...props} />,
  h2: (props) => <h2 className="mt-8 text-2xl font-semibold" {...props} />,
  h3: (props) => <h3 className="mt-6 text-xl font-semibold" {...props} />,
  p: (props) => <p className="mb-4 leading-relaxed" {...props} />,
  code: ({ inline, ...props }: { inline?: boolean } & HTMLAttributes<HTMLElement>) =>
    inline ? (
      <code className="rounded bg-neutral-100 px-2 py-1 text-sm text-accent" {...props} />
    ) : (
      <code className="block rounded-lg bg-neutral-950 p-4 text-sm text-neutral-100" {...props} />
    ),
  a: (props) => <a className="text-accent underline" {...props} />,
  ul: (props) => <ul className="mb-4 list-disc space-y-2 pl-5" {...props} />,
  ol: (props) => <ol className="mb-4 list-decimal space-y-2 pl-5" {...props} />,
};

export default PostDetailPage;
