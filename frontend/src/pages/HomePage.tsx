import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { FeaturedPostCard } from "@/components/blog/FeaturedPostCard";
import { PostCard } from "@/components/blog/PostCard";
import CategoryFilter from "@/components/blog/CategoryFilter";
import Button from "@/components/ui/Button";
import { usePosts } from "@/hooks/usePosts";
import { useTaxonomy } from "@/hooks/useTaxonomy";
import { DEFAULT_POST_CATEGORIES } from "@/constants/categories";
import type { Post } from "@/types/content";

const selectFeaturedPost = (posts: Post[]) =>
  posts.find((post) => post.featured) ?? posts[0];

export const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { data: taxonomy } = useTaxonomy();
  const categories =
    taxonomy?.categories.map((category) => category.name) ??
    Array.from(DEFAULT_POST_CATEGORIES);
  const filters = useMemo(() => ["All", ...categories], [categories]);

  useEffect(() => {
    if (!filters.includes(selectedCategory)) {
      setSelectedCategory("All");
    }
  }, [filters, selectedCategory]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  const { data: posts = [], isLoading, isError } = usePosts();

  const featuredPost = useMemo(() => selectFeaturedPost(posts ?? []), [posts]);

  const filteredPosts = useMemo(() => {
    if (!posts) {
      return [] as Post[];
    }
    if (selectedCategory === "All") {
      return posts;
    }
    return posts.filter((post) => post.category === selectedCategory);
  }, [posts, selectedCategory]);

  const regularPosts = useMemo(() => {
    if (!featuredPost) {
      return filteredPosts;
    }
    return filteredPosts.filter((post) => post.id !== featuredPost.id);
  }, [filteredPosts, featuredPost]);

  const isEmpty = !isLoading && !isError && regularPosts.length === 0;

  const PAGE_SIZE = 9;
  const totalPages = Math.max(1, Math.ceil(regularPosts.length / PAGE_SIZE));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return regularPosts.slice(start, start + PAGE_SIZE);
  }, [regularPosts, currentPage]);

  return (
    <div className="bg-white">
      <Container className="space-y-16 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl font-bold tracking-tight text-neutral-950 md:text-6xl bg-gradient-to-r from-neutral-900 via-accent to-neutral-900 bg-clip-text text-transparent">
            Software Engineer & Mobile Developer
          </h1>
          <p className="text-lg leading-relaxed text-neutral-600">
            Exploring mobile development, the Apple ecosystem, and building
            great software experiences
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto flex max-w-3xl flex-col items-center gap-6 rounded-3xl border border-neutral-200/80 bg-white p-8 text-left shadow-subtle/40 transition-colors dark:border-neutral-800 dark:bg-neutral-900 md:flex-row md:justify-between"
        >
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-neutral-500">
              Currently researching
            </h2>
            <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300">
              Trends and explorations that are shaping upcoming case studies and
              long-form articles.
            </p>
          </div>
          <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-300">
            <li>• Spatial computing patterns for visionOS launch apps</li>
            <li>
              • Making React Native embrace Apple Human Interface Guidelines
            </li>
            <li>
              • Automated screenshot pipelines across iPhone, iPad, and Mac
            </li>
          </ul>
        </motion.div>

        {featuredPost ? (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-4"
          >
            <FeaturedPostCard post={featuredPost} />
          </motion.div>
        ) : null}

        <div className="space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-center space-y-4"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-neutral-500">
              Latest writing
            </p>
            <h2 className="text-3xl font-semibold text-neutral-950">
              Explore by focus area
            </h2>
            <p className="mx-auto max-w-2xl text-sm text-neutral-600 dark:text-neutral-300">
              Filter stories across mobile development, Apple craftsmanship, and
              the tooling behind resilient apps.
            </p>
          </motion.div>

          <CategoryFilter
            categories={filters}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />

          {isLoading ? (
            <div className="grid gap-8 pt-6 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse space-y-4 rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-subtle/40 dark:border-neutral-800 dark:bg-neutral-900"
                >
                  <div className="h-48 rounded-2xl bg-neutral-200/80 dark:bg-neutral-800" />
                  <div className="h-4 w-2/3 rounded-full bg-neutral-200 dark:bg-neutral-700" />
                  <div className="h-4 w-full rounded-full bg-neutral-200/80 dark:bg-neutral-700" />
                  <div className="h-4 w-3/5 rounded-full bg-neutral-200/70 dark:bg-neutral-700" />
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="col-span-full mt-6 rounded-3xl border border-dashed border-neutral-300 bg-white/80 p-10 text-center text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900/70 dark:text-neutral-300">
              Unable to load posts right now. Try again in a moment.
            </div>
          ) : (
            <div className="grid gap-8 pt-6 md:grid-cols-2 xl:grid-cols-3">
              {paginatedPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.05 * index }}
                >
                  <PostCard post={post} />
                </motion.div>
              ))}
            </div>
          )}

          {isEmpty ? (
            <div className="rounded-3xl border border-dashed border-neutral-300 bg-white/80 p-12 text-center text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900/70 dark:text-neutral-300">
              No posts found in this category yet.
            </div>
          ) : null}

          {!isLoading && !isError && regularPosts.length > PAGE_SIZE ? (
            <div className="flex items-center justify-center gap-3 pt-8">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              >
                Previous
              </Button>
              <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                {Array.from({ length: totalPages }).map((_, index) => {
                  const pageNumber = index + 1;
                  const isActive = pageNumber === currentPage;
                  return (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => setCurrentPage(pageNumber)}
                      className={
                        isActive
                          ? 'rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white'
                          : 'rounded-full px-3 py-1 text-xs font-medium text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
                      }
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              >
                Next
              </Button>
            </div>
          ) : null}
        </div>
      </Container>
    </div>
  );
};

export default HomePage;
