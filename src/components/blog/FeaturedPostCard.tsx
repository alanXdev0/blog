import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Clock, Eye } from "lucide-react";
import { format } from "date-fns";
import type { Post } from "@/types/content";

const categoryColors: Record<string, string> = {
  Mobile: "bg-blue-50 text-blue-700 border-blue-200",
  Apple: "bg-gray-50 text-gray-700 border-gray-200",
  Projects: "bg-purple-50 text-purple-700 border-purple-200",
  Reflections: "bg-green-50 text-green-700 border-green-200",
};

interface FeaturedPostCardProps {
  post: Post;
}

export const FeaturedPostCard = ({ post }: FeaturedPostCardProps) => {
  const publishedAt = post.publishedAt ? new Date(post.publishedAt) : new Date();
  const formattedDate = format(publishedAt, "MMM d, yyyy");
  const readingTime = post.meta?.readingTime ?? post.readingTime ?? "5 min read";
  const views = post.meta?.views ?? post.views ?? 0;
  const categoryClass = categoryColors[post.category] ?? "bg-white/10 text-white border-white/20";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative h-[500px] cursor-pointer overflow-hidden rounded-2xl"
    >
      <Link to={`/posts/${post.slug}`} className="block h-full">
        <div className="absolute inset-0">
          <img
            src={
              post.heroImage ||
              "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200"
            }
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>
        <div className="relative flex h-full flex-col justify-end p-8 md:p-12">
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium w-fit ${categoryClass}`}
          >
            {post.category}
          </span>
          <h2 className="mt-4 text-3xl font-bold leading-tight text-white md:text-4xl">
            {post.title}
          </h2>
          <p className="mt-4 line-clamp-2 text-lg text-neutral-200">
            {post.excerpt}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-neutral-300">
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {readingTime}
            </span>
            <span className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              {views.toLocaleString()} views
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
