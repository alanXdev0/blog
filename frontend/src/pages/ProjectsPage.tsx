import { motion } from 'framer-motion';
import { Container } from '@/components/layout/Container';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { useProjects } from '@/hooks/useProjects';

export const ProjectsPage = () => {
  const { data: projects = [], isLoading, isError } = useProjects();

  return (
    <div className="min-h-screen bg-white transition-colors dark:bg-neutral-950">
      <Container className="space-y-16 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center space-y-6"
        >
          <h1 className="text-4xl font-bold tracking-tight text-neutral-950 md:text-6xl">Projects</h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-300">
            Apps and side projects I have built to solve real problems, explore new technologies, and push craft forwards.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={`project-skeleton-${index}`}
                className="animate-pulse space-y-4 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-subtle/40"
              >
                <div className="aspect-video rounded-2xl bg-neutral-200/80" />
                <div className="h-6 w-3/4 rounded-full bg-neutral-200" />
                <div className="h-4 w-full rounded-full bg-neutral-200/80" />
                <div className="h-4 w-2/3 rounded-full bg-neutral-200/70" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-3xl border border-dashed border-neutral-300 bg-white/80 p-12 text-center text-neutral-500">
            Unable to load projects. Please try again soon.
          </div>
        ) : projects.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid gap-8 md:grid-cols-2 xl:grid-cols-3"
          >
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </motion.div>
        ) : (
          <div className="rounded-3xl border border-dashed border-neutral-300 bg-white/80 p-12 text-center text-neutral-500">
            No projects yet. Check back soon!
          </div>
        )}
      </Container>
    </div>
  );
};

export default ProjectsPage;
