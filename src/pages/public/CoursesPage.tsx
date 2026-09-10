import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, Star, Users, BookOpen, Clock, ShoppingCart, Check, RotateCcw,SlidersHorizontal,X} from 'lucide-react';
import { DBService } from '../../services/db';
import { Course } from '../../types/platform';
import { Footer } from '../../components/layout/Footer';
import { ScrollReveal } from '../../components/layout/ScrollReveal';
import { AIOrb } from '../../components/ai/AIOrb';
import { CourseFilterCard, CourseFilterState } from '../../components/courses/CourseFilterCard';

interface CoursesPageProps {
  onAddToCart: (course: Course) => void;
  cartItemIds: string[];
}

export const CoursesPage: React.FC<CoursesPageProps> = ({ onAddToCart, cartItemIds }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const categoryQuery = searchParams.get('category');
  const searchQuery = searchParams.get('search') || '';

  // Initial category mapping from URL query
  const getInitialCategories = (): string[] => {
    if (!categoryQuery || categoryQuery === 'all') return [];
    const q = categoryQuery.toLowerCase();
    if (q.includes('develop') || q.includes('wordpress') || q.includes('security')) {
      return ['Development'];
    }
    if (q.includes('design') || q.includes('ui') || q.includes('ux')) {
      return ['Design & UI/UX'];
    }
    if (q.includes('freelanc') || q.includes('business')) {
      return ['Business'];
    }
    if (q.includes('market') || q.includes('seo') || q.includes('affiliate') || q.includes('email')) {
      return ['Marketing'];
    }
    return [];
  };

  const [search, setSearch] = useState<string>(searchQuery);
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'price-asc' | 'price-desc'>('popular');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  // Filter state for CourseFilterCard
  const [filters, setFilters] = useState<CourseFilterState>({
    categories: getInitialCategories(),
    difficulties: [],
    minRating: 0,
    maxPrice: 5000,
    currency: 'BDT'
  });

  const [allCourses, setAllCourses] = useState<Course[]>(() => DBService.getPublishedCourses());

  useEffect(() => {
    const handleCoursesUpdated = () => {
      setAllCourses(DBService.getPublishedCourses());
    };
    window.addEventListener('mastermind_courses_updated', handleCoursesUpdated);
    window.addEventListener('storage', handleCoursesUpdated);
    return () => {
      window.removeEventListener('mastermind_courses_updated', handleCoursesUpdated);
      window.removeEventListener('storage', handleCoursesUpdated);
    };
  }, []);

  // Sync with URL query parameter changes
  useEffect(() => {
    if (categoryQuery && categoryQuery !== 'all') {
      const mapped = getInitialCategories();
      setFilters(prev => ({
        ...prev,
        categories: mapped.length > 0 ? mapped : prev.categories
      }));
    }
  }, [categoryQuery]);

  // Handlers for individual filter controls
  const handleToggleCategory = (category: string) => {
    setFilters(prev => {
      const exists = prev.categories.includes(category);
      const updated = exists 
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category];
      return { ...prev, categories: updated };
    });
  };

  const handleToggleDifficulty = (difficulty: string) => {
    setFilters(prev => {
      const exists = prev.difficulties.includes(difficulty);
      const updated = exists 
        ? prev.difficulties.filter(d => d !== difficulty)
        : [...prev.difficulties, difficulty];
      return { ...prev, difficulties: updated };
    });
  };

  const handleSelectRating = (rating: number) => {
    setFilters(prev => ({
      ...prev,
      minRating: rating
    }));
  };

  const handleChangeMaxPrice = (price: number) => {
    setFilters(prev => ({
      ...prev,
      maxPrice: price
    }));
  };

  const handleToggleCurrency = () => {
    setFilters(prev => {
      const newCurr = prev.currency === 'BDT' ? 'USD' : 'BDT';
      return {
        ...prev,
        currency: newCurr,
        maxPrice: newCurr === 'USD' ? 250 : 5000
      };
    });
  };

  const handleResetFilters = () => {
    setFilters({
      categories: [],
      difficulties: [],
      minRating: 0,
      maxPrice: filters.currency === 'USD' ? 250 : 5000,
      currency: filters.currency
    });
    setSearch('');
    setSortBy('popular');
    setSearchParams({});
  };

  // Helper matcher functions
  const matchesCategory = (course: Course, selected: string[]) => {
    if (selected.length === 0) return true;
    const courseCat = (course.category || '').toLowerCase();
    const courseCatId = (course.categoryId || '').toLowerCase();

    return selected.some((filterCat) => {
      if (filterCat === 'Development') {
        return (
          courseCat.includes('development') ||
          courseCat.includes('wordpress') ||
          courseCat.includes('security') ||
          courseCatId.includes('development') ||
          courseCatId.includes('wordpress') ||
          courseCatId.includes('security')
        );
      }
      if (filterCat === 'Design & UI/UX') {
        return (
          courseCat.includes('design') ||
          courseCat.includes('ui') ||
          courseCat.includes('ux') ||
          courseCatId.includes('design') ||
          courseCatId.includes('web-design')
        );
      }
      if (filterCat === 'Business') {
        return (
          courseCat.includes('business') ||
          courseCat.includes('freelancing') ||
          courseCatId.includes('business') ||
          courseCatId.includes('freelancing')
        );
      }
      if (filterCat === 'Marketing') {
        return (
          courseCat.includes('marketing') ||
          courseCat.includes('seo') ||
          courseCat.includes('affiliate') ||
          courseCat.includes('email') ||
          courseCatId.includes('marketing') ||
          courseCatId.includes('seo') ||
          courseCatId.includes('affiliate') ||
          courseCatId.includes('email')
        );
      }
      return courseCat.includes(filterCat.toLowerCase()) || courseCatId.includes(filterCat.toLowerCase());
    });
  };

  const matchesDifficulty = (course: Course, selectedDiffs: string[]) => {
    if (selectedDiffs.length === 0) return true;
    if (course.level === 'All Levels') return true;
    return selectedDiffs.includes(course.level);
  };

  const matchesPrice = (course: Course, maxLimit: number, currency: 'BDT' | 'USD') => {
    const coursePrice = course.isFree ? 0 : (course.price || 0);
    if (currency === 'USD') {
      const effectiveUsd = coursePrice / 20;
      return effectiveUsd <= maxLimit;
    }
    return coursePrice <= maxLimit;
  };

  // Filter & Sort Logic
  const filteredCourses = useMemo(() => {
    return allCourses.filter((course) => {
      // Category Filter
      if (!matchesCategory(course, filters.categories)) {
        return false;
      }

      // Difficulty Filter
      if (!matchesDifficulty(course, filters.difficulties)) {
        return false;
      }

      // Min Rating Filter
      if (filters.minRating > 0 && (course.rating || 0) < filters.minRating) {
        return false;
      }

      // Price Range Filter
      if (!matchesPrice(course, filters.maxPrice, filters.currency)) {
        return false;
      }

      // Search Query
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchTitle = (course.title || '').toLowerCase().includes(q);
        const matchCategory = (course.category || '').toLowerCase().includes(q);
        const matchInst = (course.teacherName || '').toLowerCase().includes(q);
        const matchDesc = (course.description || '').toLowerCase().includes(q);
        return matchTitle || matchCategory || matchInst || matchDesc;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'price-asc') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'price-desc') return (b.price || 0) - (a.price || 0);
      return (b.studentsCount || 0) - (a.studentsCount || 0); // popular
    });
  }, [allCourses, filters, search, sortBy]);

  // Count active filters
  const maxPriceLimit = filters.currency === 'USD' ? 250 : 5000;
  const activeFilterCount = 
    filters.categories.length + 
    filters.difficulties.length + 
    (filters.minRating > 0 ? 1 : 0) + 
    (filters.maxPrice < maxPriceLimit ? 1 : 0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Header Banner */}
      <div className="bg-[#0A192F] text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 space-y-3 text-center sm:text-left">
          <span className="text-xs font-black uppercase tracking-widest text-brand-400 bg-brand-500/20 px-3.5 py-1 rounded-full inline-block border border-brand-400/30">
            Full Course Catalog
          </span>
          <h1 className="text-3xl sm:text-5xl font-black">All Online Courses & Masterclasses</h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
            Explore 100% practical courses in Web Development, WordPress, Digital Marketing, SEO, and Freelancing.
          </p>
        </div>
      </div>

      {/* Main Content Area: Responsive 2-column layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* DESKTOP STICKY FILTER SIDEBAR */}
          <aside className="hidden lg:block w-72 xl:w-80 shrink-0 sticky top-24">
            <CourseFilterCard
              filters={filters}
              onToggleCategory={handleToggleCategory}
              onToggleDifficulty={handleToggleDifficulty}
              onSelectRating={handleSelectRating}
              onChangeMaxPrice={handleChangeMaxPrice}
              onToggleCurrency={handleToggleCurrency}
              onClearAll={handleResetFilters}
            />
          </aside>

          {/* RIGHT COLUMN: Search Bar, Active Chips & Course Grid */}
          <div className="flex-1 min-w-0 w-full space-y-6">
            
            {/* Control Bar */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              
              {/* Search Box */}
              <div className="relative w-full sm:flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search title, category, instructor..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                />
              </div>

              {/* Right actions: Mobile Filter trigger & Sort By dropdown */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                
                {/* Mobile Filter Toggle Button */}
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-2 transition cursor-pointer"
                >
                  <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                  <span>Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-extrabold flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                {/* Sort By Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 hidden md:inline">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="rating">Highest Rated</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                </div>

              </div>

            </div>

            {/* Active Filter Chips / Pills */}
            {(activeFilterCount > 0 || search.trim()) && (
              <div className="flex flex-wrap items-center gap-2 bg-white px-4 py-3 rounded-2xl border border-slate-200/80 shadow-xs">
                <span className="text-xs font-bold text-slate-400 mr-1">Active Filters:</span>

                {/* Search Term Chip */}
                {search.trim() && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    Search: "{search}"
                    <button onClick={() => setSearch('')} className="hover:text-rose-500 cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {/* Category Chips */}
                {filters.categories.map((cat) => (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200"
                  >
                    {cat}
                    <button
                      onClick={() => handleToggleCategory(cat)}
                      className="hover:text-blue-900 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                {/* Difficulty Chips */}
                {filters.difficulties.map((diff) => (
                  <span
                    key={diff}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200"
                  >
                    {diff}
                    <button
                      onClick={() => handleToggleDifficulty(diff)}
                      className="hover:text-indigo-900 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                {/* Min Rating Chip */}
                {filters.minRating > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    ★ {filters.minRating.toFixed(1)}+
                    <button
                      onClick={() => handleSelectRating(0)}
                      className="hover:text-amber-950 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {/* Price Range Chip */}
                {filters.maxPrice < maxPriceLimit && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    ≤ {filters.currency === 'USD' ? `$${filters.maxPrice}` : `৳${filters.maxPrice.toLocaleString()}`}
                    <button
                      onClick={() => handleChangeMaxPrice(maxPriceLimit)}
                      className="hover:text-emerald-950 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {/* Clear All Link */}
                <button
                  onClick={handleResetFilters}
                  className="text-xs font-bold text-rose-500 hover:text-rose-600 hover:underline ml-auto flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" /> Clear All
                </button>
              </div>
            )}

            {/* Results Counter */}
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-2">
              <span>Showing <strong className="text-slate-800 font-black">{filteredCourses.length}</strong> course(s)</span>
              {activeFilterCount > 0 && (
                <span className="text-slate-400 font-semibold">{activeFilterCount} filter(s) applied</span>
              )}
            </div>

            {/* Course Cards Grid */}
            {filteredCourses.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
                <div className="flex justify-center">
                  <AIOrb state="idle" size={56} />
                </div>
                <h3 className="text-xl font-bold text-[#0F2B5A]">No courses found.</h3>
                <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto">
                  No courses match your active filter selections or search query. Try resetting or adjusting the filters.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 bg-brand-500 text-white rounded-xl text-xs font-bold shadow-md hover:bg-brand-600 transition inline-flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Show All Courses
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCourses.map((course, idx) => {
                  const inCart = cartItemIds.includes(course.id);

                  return (
                    <ScrollReveal key={course.id} delay={idx * 50} direction="up" distance={20}>
                      <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-md hover:shadow-2xl hover:border-brand-300 transition-all duration-300 flex flex-col justify-between group h-full relative">
                        <div>
                          {/* Image Thumbnail */}
                          <div className="relative h-52 bg-slate-100 overflow-hidden">
                            <img
                              src={course.thumbnail}
                              alt={course.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-4 left-4 flex gap-2">
                              {course.isFree ? (
                                <span className="bg-emerald-500 text-white text-xs font-black uppercase px-3 py-1 rounded-full shadow">
                                  FREE
                                </span>
                              ) : (
                                <span className="bg-brand-500 text-white text-xs font-black uppercase px-3 py-1 rounded-full shadow">
                                  ৳{course.price.toLocaleString()} BDT
                                </span>
                              )}
                              {course.badge && (
                                <span className="bg-[#0F2B5A] text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-full shadow">
                                  {course.badge}
                                </span>
                              )}
                            </div>

                            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-slate-800 flex items-center gap-1 shadow">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span>{course.rating} ({course.reviewCount})</span>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-6 space-y-3">
                            <div className="flex items-center justify-between text-xs font-extrabold uppercase text-brand-600 tracking-wider">
                              <span>{course.category}</span>
                              <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px]">
                                {course.level}
                              </span>
                            </div>

                            <h3
                              onClick={() => navigate(`/courses/${course.id}`)}
                              className="text-lg font-extrabold text-[#0F2B5A] hover:text-brand-600 cursor-pointer transition line-clamp-2 leading-snug"
                            >
                              {course.title}
                            </h3>

                            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                              {course.description}
                            </p>
                          </div>
                        </div>

                        {/* Metadata & Footer Actions */}
                        <div className="p-6 pt-0 space-y-4">
                          <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-[11px] font-semibold text-slate-500">
                            <div className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 text-brand-500" />
                              <span>{course.studentsCount}</span>
                            </div>
                            <div className="flex items-center gap-1 justify-center">
                              <BookOpen className="w-3.5 h-3.5 text-brand-500" />
                              <span>{course.lessonsCount} Lsn</span>
                            </div>
                            <div className="flex items-center gap-1 justify-end">
                              <Clock className="w-3.5 h-3.5 text-brand-500" />
                              <span>{course.durationHours}h</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <img
                                src={course.teacherAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'}
                                alt={course.teacherName}
                                className="w-7 h-7 rounded-full object-cover ring-2 ring-brand-100"
                              />
                              <span className="text-xs font-bold text-slate-700">{course.teacherName}</span>
                            </div>

                            <div className="flex gap-2">
                              <button
                                onClick={() => onAddToCart(course)}
                                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                                  inCart
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-brand-50 text-brand-600 hover:bg-brand-500 hover:text-white border border-brand-200'
                                }`}
                              >
                                {inCart ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <ShoppingCart className="w-3.5 h-3.5" />}
                                <span>{inCart ? 'Cart' : 'Add'}</span>
                              </button>

                              <button
                                onClick={() => navigate(`/courses/${course.id}`)}
                                className="px-3.5 py-2 bg-[#0F2B5A] hover:bg-brand-600 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                              >
                                Enroll
                              </button>
                            </div>
                          </div>
                        </div>

                      </div>
                    </ScrollReveal>
                  );
                })}
              </div>
            )}

          </div>

        </div>
      </div>

      {/* MOBILE FILTER MODAL / DRAWER */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-sm bg-white h-full overflow-y-auto p-4 z-10 shadow-2xl flex flex-col justify-between"
            >
              <CourseFilterCard
                filters={filters}
                onToggleCategory={handleToggleCategory}
                onToggleDifficulty={handleToggleDifficulty}
                onSelectRating={handleSelectRating}
                onChangeMaxPrice={handleChangeMaxPrice}
                onToggleCurrency={handleToggleCurrency}
                onClearAll={handleResetFilters}
                onCloseMobile={() => setIsMobileFilterOpen(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer onSelectCategory={(catId) => {
        if (!catId || catId === 'all') {
          handleResetFilters();
          return;
        }
        const q = catId.toLowerCase();
        let matchedCat = '';
        if (q.includes('develop') || q.includes('wordpress') || q.includes('security')) {
          matchedCat = 'Development';
        } else if (q.includes('design') || q.includes('ui') || q.includes('ux')) {
          matchedCat = 'Design & UI/UX';
        } else if (q.includes('freelanc') || q.includes('business')) {
          matchedCat = 'Business';
        } else if (q.includes('market') || q.includes('seo') || q.includes('affiliate') || q.includes('email')) {
          matchedCat = 'Marketing';
        }
        if (matchedCat) {
          setFilters(prev => ({
            ...prev,
            categories: [matchedCat]
          }));
        }
      }} />

    </div>
  );
};
