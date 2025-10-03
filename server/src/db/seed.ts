import bcrypt from 'bcryptjs';
import { customAlphabet } from 'nanoid';
import { db } from './client';

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 12);

interface SeedPost {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  heroImage: string;
  isPublished: boolean;
  featured?: boolean;
  publishedAt?: string;
  readingTime: string;
  views: number;
  tags: { id: string; name: string; color?: string }[];
}

const categories = ['Mobile', 'Apple', 'Projects', 'Reflections'];

const posts: SeedPost[] = [
  {
    title: 'Designing VenueVent: an iOS-first experience for seamless venue discovery',
    slug: 'designing-venuevent-ios-experience',
    excerpt:
      'How Apple-inspired interaction design and pragmatic engineering shaped VenueVent, a venue finder tailored for event planners.',
    content: '# VenueVent\n\nA deep dive into product thinking, architecture decisions, and launch lessons.',
    category: 'Projects',
    heroImage: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92eee?auto=format&fit=crop&w=1200&q=80',
    isPublished: true,
    featured: true,
    publishedAt: '2025-01-15T08:00:00Z',
    readingTime: '6 min read',
    views: 1250,
    tags: [
      { id: 'swiftui', name: 'SwiftUI', color: '#D8B4FE' },
      { id: 'ios-design', name: 'iOS Design', color: '#F9A8D4' },
    ],
  },
  {
    title: 'Refining CI/CD for multi-platform mobile apps',
    slug: 'refining-ci-cd-mobile-apps',
    excerpt: 'Lessons from orchestrating pipelines across iOS, Android, and Flutter using fastlane and GitHub Actions.',
    content: '# CI/CD\n\nA playbook for multi-platform automation.',
    category: 'Reflections',
    heroImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    isPublished: true,
    publishedAt: '2024-12-05T08:00:00Z',
    readingTime: '8 min read',
    views: 980,
    tags: [
      { id: 'ci-cd', name: 'CI/CD', color: '#C7D2FE' },
      { id: 'mobile-devops', name: 'Mobile DevOps', color: '#BBF7D0' },
    ],
  },
  {
    title: 'Aztlan: scaling a React Native booking app',
    slug: 'aztlan-scaling-react-native-booking-app',
    excerpt: 'Architecting an offline-capable booking experience for cultural venues with React Native.',
    content: '# Aztlan\n\nArchitecture patterns, offline sync, and design decisions.',
    category: 'Projects',
    heroImage: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80',
    isPublished: true,
    publishedAt: '2024-11-20T08:00:00Z',
    readingTime: '5 min read',
    views: 860,
    tags: [
      { id: 'react-native', name: 'React Native', color: '#BFDBFE' },
      { id: 'architecture', name: 'Architecture', color: '#FDE68A' },
    ],
  },
  {
    title: 'Inside my iOS testing stack',
    slug: 'inside-ios-testing-stack',
    excerpt: 'Snapshot testing, dependency injection, and guardrails that keep Apple platform releases calm.',
    content: '# Testing\n\nTooling and guardrails for confident releases.',
    category: 'Apple',
    heroImage: 'https://images.unsplash.com/photo-1580894894513-541e068a3e2b?auto=format&fit=crop&w=1200&q=80',
    isPublished: true,
    publishedAt: '2024-09-22T08:00:00Z',
    readingTime: '9 min read',
    views: 1120,
    tags: [
      { id: 'testing', name: 'Testing', color: '#FEF9C3' },
      { id: 'swift', name: 'Swift', color: '#FECACA' },
    ],
  },
];

const projects = [
  {
    id: 'venuevent',
    name: 'VenueVent iOS',
    description: 'A polished venue discovery app with intelligent recommendations and map-first exploration.',
    link: 'https://apps.apple.com/us/app/',
    image: 'https://images.unsplash.com/photo-1580894894513-541e068a3e2b?auto=format&fit=crop&w=900&q=80',
    tags: ['SwiftUI', 'MapKit', 'CloudKit'],
    techStack: ['SwiftUI', 'MapKit', 'CloudKit'],
    status: 'active',
    sortOrder: 0,
  },
  {
    id: 'aztlan',
    name: 'Aztlan Booking',
    description: 'React Native booking platform with offline access and multi-tenant admin tooling.',
    link: 'https://github.com/alananaya',
    image: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=900&q=80',
    tags: ['React Native', 'TypeScript', 'GraphQL'],
    techStack: ['React Native', 'TypeScript', 'GraphQL'],
    status: 'active',
    sortOrder: 1,
  },
  {
    id: 'terraza',
    name: 'Terraza Los Palomos',
    description: 'Responsive marketing site with immersive imagery and refined booking funnels.',
    link: 'https://terraza-los-palomos.com',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80',
    tags: ['Next.js', 'Tailwind', 'SEO'],
    techStack: ['Next.js', 'Tailwind', 'SEO'],
    status: 'active',
    sortOrder: 2,
  },
];

export const runSeed = async (adminEmail: string, adminPassword: string) => {
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  if (userCount.count === 0) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    db.prepare(
      'INSERT INTO users (id, name, email, password_hash) VALUES (@id, @name, @email, @password_hash)',
    ).run({
      id: nanoid(),
      name: 'Alan Anaya',
      email: adminEmail,
      password_hash: passwordHash,
    });
  }

  const categoryCount = db.prepare('SELECT COUNT(*) as count FROM categories').get() as { count: number };
  if (categoryCount.count === 0) {
    const insertCategory = db.prepare('INSERT INTO categories (id, name) VALUES (@id, @name)');
    categories.forEach((name) => insertCategory.run({ id: name.toLowerCase(), name }));
  }

  const postCount = db.prepare('SELECT COUNT(*) as count FROM posts').get() as { count: number };
  if (postCount.count === 0) {
    const insertPost = db.prepare(
      `INSERT INTO posts (
        id, title, slug, excerpt, content, category, hero_image, is_published, featured, published_at, reading_time, views
      ) VALUES (@id, @title, @slug, @excerpt, @content, @category, @hero_image, @is_published, @featured, @published_at, @reading_time, @views)`,
    );
    const insertTag = db.prepare('INSERT OR IGNORE INTO tags (id, name, color) VALUES (@id, @name, @color)');
    const insertPostTag = db.prepare('INSERT INTO post_tags (post_id, tag_id) VALUES (@post_id, @tag_id)');

    const insertProject = db.prepare(
      `INSERT INTO projects (
        id,
        name,
        description,
        link,
        image,
        tags,
        tech_stack,
        status,
        sort_order
      ) VALUES (@id, @name, @description, @link, @image, @tags, @tech_stack, @status, @sort_order)`,
    );

    const transaction = db.transaction(() => {
      posts.forEach((post) => {
        const postId = nanoid();
        insertPost.run({
          id: postId,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          category: post.category,
          hero_image: post.heroImage,
          is_published: post.isPublished ? 1 : 0,
          featured: post.featured ? 1 : 0,
          published_at: post.publishedAt ?? null,
          reading_time: post.readingTime,
          views: post.views,
        });

        post.tags.forEach((tag) => {
          insertTag.run({ id: tag.id, name: tag.name, color: tag.color ?? null });
          insertPostTag.run({ post_id: postId, tag_id: tag.id });
        });
      });

      projects.forEach((project) => {
        insertProject.run({
          id: project.id,
          name: project.name,
          description: project.description,
          link: project.link,
          image: project.image,
          tags: JSON.stringify(project.tags),
          tech_stack: JSON.stringify(project.techStack),
          status: project.status,
          sort_order: project.sortOrder,
        });
      });
    });

    transaction();
  }
};
