import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { Card, CardContent, CardMedia } from '@/components/ui/Card';
import { TagPill } from '@/components/ui/TagPill';
import type { Project } from '@/types/content';

interface ProjectCardProps {
  project: Project;
  className?: string;
}

export const ProjectCard = ({ project, className }: ProjectCardProps) => (
  <Card className={clsx('flex flex-col overflow-hidden', className)}>
    <CardMedia imageUrl={project.image} alt={project.name} ratio="16/9" />
    <CardContent className="flex flex-1 flex-col space-y-4">
      <div className="flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <TagPill key={tag} label={tag} />
        ))}
      </div>
      <div className="space-y-2">
        <h3 className="text-2xl font-semibold text-neutral-950">{project.name}</h3>
        <p className="text-sm text-neutral-600">{project.description}</p>
      </div>
      <div className="pt-4">
        <Link
          to={project.link}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-accent-soft"
        >
          View project -&gt;
        </Link>
      </div>
    </CardContent>
  </Card>
);
