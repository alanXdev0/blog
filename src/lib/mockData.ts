import type { Post, Project } from '@/types/content';

export const mockPosts: Post[] = [
  {
    id: '1',
    title: 'Designing VenueVent: an iOS-first experience for seamless venue discovery',
    slug: 'designing-venuevent-ios-experience',
    excerpt:
      'How I blended Apple design philosophy with pragmatic engineering to ship VenueVent, a curated venue finder for event planners.',
    content: '',
    category: 'Projects',
    tags: [
      { id: 'swiftui', name: 'SwiftUI', color: '#D8B4FE' },
      { id: 'ios-design', name: 'iOS Design', color: '#F9A8D4' },
    ],
    heroImage: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92eee?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    publishedAt: '2025-01-15T08:00:00Z',
    isPublished: true,
    meta: {
      readingTime: '6 min read',
    },
  },
  {
    id: '2',
    title: 'Refining CI/CD for multi-platform mobile apps',
    slug: 'refining-ci-cd-mobile-apps',
    excerpt:
      'Lessons from setting up parallel pipelines for iOS, Android, and Flutter with fastlane, GitHub Actions, and a sprinkle of focus.',
    content: '',
    category: 'Reflections',
    tags: [
      { id: 'ci-cd', name: 'CI/CD', color: '#C7D2FE' },
      { id: 'devops', name: 'Mobile DevOps', color: '#BBF7D0' },
    ],
    heroImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    publishedAt: '2024-12-05T08:00:00Z',
    isPublished: true,
    meta: {
      readingTime: '8 min read',
    },
  },
  {
    id: '3',
    title: 'Aztlan: scaling a React Native booking app',
    slug: 'aztlan-scaling-react-native-booking-app',
    excerpt:
      'Architecting a resilient booking experience for cultural venues with offline-first patterns and device-native polish.',
    content: '',
    category: 'Projects',
    tags: [
      { id: 'react-native', name: 'React Native', color: '#BFDBFE' },
      { id: 'architecture', name: 'Architecture', color: '#FDE68A' },
    ],
    heroImage: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    publishedAt: '2024-11-20T08:00:00Z',
    isPublished: true,
    meta: {
      readingTime: '5 min read',
    },
  },
  {
    id: '4',
    title: 'Terraza Los Palomos: building a bespoke digital presence',
    slug: 'terraza-los-palomos-digital-presence',
    excerpt:
      'Creating an elegant, conversion-focused website for a beloved local venue with responsive design and crisp performance.',
    content: '',
    category: 'Projects',
    tags: [
      { id: 'webflow', name: 'Webflow', color: '#F3E8FF' },
      { id: 'seo', name: 'SEO', color: '#FECACA' },
    ],
    heroImage: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    publishedAt: '2024-11-01T08:00:00Z',
    isPublished: true,
    meta: {
      readingTime: '4 min read',
    },
  },
  {
    id: '5',
    title: 'Choosing the right cross-platform stack in 2025',
    slug: 'choosing-cross-platform-stack-2025',
    excerpt:
      'A pragmatic take on when to reach for Flutter, React Native, or go fully native-grounded in recent project experiences.',
    content: '',
    category: 'Mobile',
    tags: [
      { id: 'flutter', name: 'Flutter', color: '#BBF7D0' },
      { id: 'react-native', name: 'React Native', color: '#BFDBFE' },
      { id: 'swift', name: 'Swift', color: '#FECACA' },
    ],
    heroImage: 'https://images.unsplash.com/photo-1474631245212-32dc3c8310c6?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    publishedAt: '2024-10-12T08:00:00Z',
    isPublished: true,
    meta: {
      readingTime: '7 min read',
    },
  },
  {
    id: '6',
    title: 'Inside my iOS testing stack',
    slug: 'inside-ios-testing-stack',
    excerpt:
      'Snapshot testing, dependency injection, and the guardrails I rely on to ship confidently across Apple platforms.',
    content: '',
    category: 'Apple',
    tags: [
      { id: 'testing', name: 'Testing', color: '#FEF9C3' },
      { id: 'swift', name: 'Swift', color: '#FECACA' },
    ],
    heroImage: 'https://images.unsplash.com/photo-1580894894513-541e068a3e2b?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    publishedAt: '2024-09-22T08:00:00Z',
    isPublished: true,
    meta: {
      readingTime: '9 min read',
    },
  },
];

export const mockProjects: Project[] = [
  {
    id: 'venuevent',
    name: 'VenueVent iOS',
    description:
      'A polished venue discovery app with map intelligence, curated recommendations, and real-time availability for event teams.',
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
    description:
      'React Native app for cultural venue reservations with offline-first support and multi-tenant admin tools.',
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
    description:
      'Responsive marketing site with bespoke visuals, interactive galleries, and conversion-optimized inquiry forms.',
    link: 'https://terraza-los-palomos.com',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80',
    tags: ['Next.js', 'Tailwind', 'SEO'],
    techStack: ['Next.js', 'Tailwind', 'SEO'],
    status: 'active',
    sortOrder: 2,
  },
];
