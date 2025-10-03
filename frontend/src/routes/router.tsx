import { createBrowserRouter, Navigate } from 'react-router-dom';
import { BaseLayout } from '@/components/layout/BaseLayout';
import { HomePage } from '@/pages/HomePage';
import { ProjectsPage } from '@/pages/ProjectsPage';
import { AboutPage } from '@/pages/AboutPage';
import { PostDetailPage } from '@/pages/PostDetailPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { AdminLoginPage } from '@/features/admin/pages/AdminLoginPage';
import { AdminDashboardPage } from '@/features/admin/pages/AdminDashboardPage';
import { AdminPostsPage } from '@/features/admin/pages/AdminPostsPage';
import { AdminPostEditorPage } from '@/features/admin/pages/AdminPostEditorPage';
import { AdminMediaLibraryPage } from '@/features/admin/pages/AdminMediaLibraryPage';
import { AdminTaxonomyPage } from '@/features/admin/pages/AdminTaxonomyPage';
import { AdminProjectsPage } from '@/features/admin/pages/AdminProjectsPage';
import { AdminLayout } from '@/features/admin/components/AdminLayout';
import { ProtectedRoute } from '@/routes/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <BaseLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'projects', element: <ProjectsPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'posts/:slug', element: <PostDetailPage /> },
    ],
  },
  {
    path: '/admin',
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <Navigate to="/admin/login" replace /> },
      { path: 'login', element: <AdminLoginPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { path: 'dashboard', element: <AdminDashboardPage /> },
              { path: 'posts', element: <AdminPostsPage /> },
              { path: 'posts/new', element: <AdminPostEditorPage mode="create" /> },
              { path: 'posts/:postId/edit', element: <AdminPostEditorPage mode="edit" /> },
              { path: 'projects', element: <AdminProjectsPage /> },
              { path: 'media', element: <AdminMediaLibraryPage /> },
              { path: 'taxonomy', element: <AdminTaxonomyPage /> },
            ],
          },
        ],
      },
    ],
  },
]);
