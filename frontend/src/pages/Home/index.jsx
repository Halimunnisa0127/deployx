import RocketBackground from '../../components/ui/RocketBackground';
import Footer from '../../components/layout/Footer';
import PublicNavbar from '../../components/layout/PublicNavbar';
import SEO from '../../components/common/SEO';

// Landing Page Modular Sections
import HeroSection from '../../features/home/HeroSection';
import ProductPreviewSection from '../../features/home/ProductPreviewSection';
import FeaturesSection from '../../features/home/FeaturesSection';
import HowItWorksSection from '../../features/home/HowItWorksSection';
import WhyDeployXSection from '../../features/home/WhyDeployXSection';
import FaqSection from '../../features/home/FaqSection';
import CtaSection from '../../features/home/CtaSection';

const homeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://deployx-dun.vercel.app/#website",
      "url": "https://deployx-dun.vercel.app/",
      "name": "DeployX",
      "description": "GitHub Deployment Platform & AI Build Diagnostics",
      "publisher": {
        "@id": "https://deployx-dun.vercel.app/#organization"
      }
    },
    {
      "@type": "Organization",
      "@id": "https://deployx-dun.vercel.app/#organization",
      "name": "DeployX",
      "url": "https://deployx-dun.vercel.app/",
      "logo": "https://deployx-dun.vercel.app/deployx-logo.jpg"
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://deployx-dun.vercel.app/#application",
      "name": "DeployX",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "All",
      "url": "https://deployx-dun.vercel.app/",
      "description": "Deploy GitHub projects with automated builds, deployment monitoring, live logs, rollback workflows, and AI-powered build diagnostics."
    }
  ]
};

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-gray-100 font-sans selection:bg-blue-500/30 relative">
      <SEO
        title="DeployX – GitHub Deployment Platform & AI Build Diagnostics"
        description="Deploy GitHub projects with automated builds, deployment monitoring, live logs, rollback workflows, and AI-powered build diagnostics. Simplify your deployment workflow with DeployX."
        robots="index,follow"
        canonical="https://deployx-dun.vercel.app/"
        ogTitle="DeployX – GitHub Deployment Platform & AI Build Diagnostics"
        ogDescription="Deploy GitHub projects with automated builds, deployment monitoring, live logs, rollback workflows, and AI-powered build diagnostics."
        ogUrl="https://deployx-dun.vercel.app/"
        twitterTitle="DeployX – GitHub Deployment Platform & AI Build Diagnostics"
        twitterDescription="Deploy GitHub projects with automated builds, live logs, rollback workflows, and AI diagnostics."
        jsonLd={homeJsonLd}
      />
      {/* Ambient Rocket Background */}
      <RocketBackground />

      {/* Shared Public Navigation Header */}
      <PublicNavbar />

      {/* Main Page Sections */}
      <main className="relative z-10">
        <HeroSection />
        <ProductPreviewSection />
        <FeaturesSection />
        <HowItWorksSection />
        <WhyDeployXSection />
        <FaqSection />
        <CtaSection />
      </main>

      {/* Minimal Footer */}
      <Footer />
    </div>
  );
}
