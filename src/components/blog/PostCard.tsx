import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Calendar, Clock, Eye } from 'lucide-react';
import type { Post } from '@/types/content';

interface PostCardProps {
  post: Post;
}

const categoryTone: Record<string, string> = {
  Mobile: 'bg-blue-50 text-blue-700 border-blue-200',
  Apple: 'bg-neutral-50 text-neutral-700 border-neutral-200',
  Projects: 'bg-purple-50 text-purple-700 border-purple-200',
  Reflections: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

export const PostCard = ({ post }: PostCardProps) => {
  const publishedAt = post.publishedAt ? new Date(post.publishedAt) : new Date();
  const formattedDate = format(publishedAt, 'MMM d, yyyy');
  const readingTime = post.meta?.readingTime ?? post.readingTime ?? '5 min';
  const views = post.meta?.views ?? post.views ?? 0;
  const categoryClass = categoryTone[post.category] ?? 'bg-neutral-100 text-neutral-700 border-neutral-200';

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4 }}
      className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-subtle/20 transition-all hover:-translate-y-1 hover:shadow-subtle/40"
    >
      <Link to={`/posts/${post.slug}`} className="group block h-full">
        <div className="aspect-video overflow-hidden bg-neutral-100">
          <img
            src={post.heroImage}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="space-y-4 p-6">
          <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${categoryClass}`}>
            {post.category}
          </span>
          <h3 className="text-xl font-semibold leading-snug text-neutral-900 transition-colors group-hover:text-accent">
            {post.title}
          </h3>
          <p className="line-clamp-2 text-sm text-neutral-600">{post.excerpt}</p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {readingTime}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {views.toLocaleString()}
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};
