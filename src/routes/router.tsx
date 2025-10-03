import { createBrowserRouter } from "react-router-dom";
import { BaseLayout } from "@/components/layout/BaseLayout";
import { HomePage } from "@/pages/HomePage";
import { ProjectsPage } from "@/pages/ProjectsPage";
import { AboutPage } from "@/pages/AboutPage";
import { PostDetailPage } from "@/pages/PostDetailPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <BaseLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "projects", element: <ProjectsPage /> },
      { path: "about", element: <AboutPage /> },
      { path: "posts/:slug", element: <PostDetailPage /> },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
]);
