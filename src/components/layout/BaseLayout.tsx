import { Outlet } from "react-router-dom";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { Seo } from "@/components/seo/Seo";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export const BaseLayout = () => (
  <div className="flex min-h-screen flex-col bg-white">
    <Seo />
    <GoogleAnalytics />
    <Navbar />
    <main className="flex-1 pt-16">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default BaseLayout;
