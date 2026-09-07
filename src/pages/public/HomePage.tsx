import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, BookOpen, Compass, ShieldCheck, Zap } from 'lucide-react';
import { HeroSection } from '../../components/home/HeroSection';
import { MarqueePartners } from '../../components/home/MarqueePartners';
import { CategoryGrid } from '../../components/courses/CategoryGrid';
import { HowItWorks } from '../../components/home/HowItWorks';
import { CourseComparisonTable } from '../../components/courses/CourseComparisonTable';
import { StudentProjectsGallery } from '../../components/home/StudentProjectsGallery';
import { StatsCounter } from '../../components/home/StatsCounter';
import { TestimonialSection } from '../../components/home/TestimonialSection';
import { SeoContentSection } from '../../components/home/SeoContentSection';
import { Footer } from '../../components/layout/Footer';
import { DBService } from '../../services/db';
import { ScrollReveal } from '../../components/layout/ScrollReveal';

interface HomePageProps {
  onOpenPathFinder: () => void;
  onAddToCart: (course: any) => void;
  cartItemIds: string[];
}

export const HomePage: React.FC<HomePageProps> = ({
  onOpenPathFinder,
}) => {
  const navigate = useNavigate();
  const marketplaceBanner = DBService.getWebsiteContent('marketplace_banner');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Hero Banner */}
      <HeroSection
        onExploreCourses={() => navigate('/courses')}
        onOpenPreview={() => navigate('/courses')}
        onOpenPathFinder={onOpenPathFinder}
      />

      {/* Marquee Partner Logos */}
      <MarqueePartners />

      {/* Category Grid */}
      <CategoryGrid
        selectedCategory={null}
        onSelectCategory={(catId) => {
          navigate(catId ? `/courses?category=${catId}` : '/courses');
        }}
      />

      {/* Course Catalog Banner Gateway */}
      <section className="py-16 bg-gradient-to-r from-[#0A192F] via-[#0D2447] to-[#0A192F] text-white relative overflow-hidden border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <ScrollReveal direction="up" distance={20}>
            <div className="bg-white/10 backdrop-blur-xl p-8 sm:p-12 rounded-3xl border border-white/20 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
              
              <div className="space-y-3 text-center md:text-left max-w-2xl">
                <div className="inline-flex items-center gap-2 bg-brand-500/20 text-brand-300 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border border-brand-400/30">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span>{marketplaceBanner?.sectionName || 'Dedicated Course Marketplace'}</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                  {marketplaceBanner?.title || 'All Courses Have Moved to Our Dedicated Catalog'}
                </h2>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  {marketplaceBanner?.description || 'Browse 127+ free & premium masterclasses in Web Development, WordPress Plugin Creation, Digital Marketing, SEO, and Freelancing with advanced filtering and instant enrollment.'}
                </p>
              </div>

              <div className="shrink-0 w-full md:w-auto text-center">
                <Link
                  to={marketplaceBanner?.buttonUrl || '/courses'}
                  className="group w-full md:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-extrabold text-base px-8 py-4 rounded-2xl shadow-xl shadow-brand-500/30 transition-all duration-300 hover:scale-105"
                >
                  <Compass className="w-5 h-5 text-emerald-300" />
                  <span>{marketplaceBanner?.buttonText || 'Explore All Courses →'}</span>
                </Link>
              </div>

            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* 3-Step Learning Process */}
      <HowItWorks />

      {/* Pricing Membership Tiers
      <CourseComparisonTable
        onSelectPlan={() => navigate('/courses')}
      /> */}

      {/* Student Work Showcase */}
      {/* <StudentProjectsGallery /> */}

      {/* Achievements Counter */}
      <StatsCounter />

      {/* Testimonials */}
      <TestimonialSection />

      {/* SEO Information & FAQ */}
      <SeoContentSection />

      {/* Footer */}
      <Footer onSelectCategory={(catId) => navigate(catId ? `/courses?category=${catId}` : '/courses')} />

    </div>
  );
};
