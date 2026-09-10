import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Users, BookOpen, Clock, CheckCircle2, Play, ShieldCheck, Award, ShoppingCart,ChevronDown,Sparkles,Download,ArrowRight,ArrowLeft,Smartphone, Lock,MessageSquare,Send,AlertTriangle,ThumbsUp,X, Flag} from 'lucide-react';
import { DBService } from '../../services/db';
import { useAuth } from '../../context/AuthContext';
import { Course, ReportReason } from '../../types/platform';
import { Footer } from '../../components/layout/Footer';
import { AIOrb } from '../../components/ai/AIOrb';

interface CourseDetailPageProps {
  onAddToCart: (course: any) => void;
  cartItemIds: string[];
}

export const CourseDetailPage: React.FC<CourseDetailPageProps> = ({ onAddToCart, cartItemIds }) => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();

  const [course, setCourse] = useState<Course | undefined>(() => DBService.getCourseById(courseId || ''));

  useEffect(() => {
    setCourse(DBService.getCourseById(courseId || ''));
    const handleCoursesUpdated = () => {
      setCourse(DBService.getCourseById(courseId || ''));
    };
    window.addEventListener('mastermind_courses_updated', handleCoursesUpdated);
    window.addEventListener('storage', handleCoursesUpdated);
    return () => {
      window.removeEventListener('mastermind_courses_updated', handleCoursesUpdated);
      window.removeEventListener('storage', handleCoursesUpdated);
    };
  }, [courseId]);

  const [activeTab, setActiveTab] = useState<'overview' | 'syllabus' | 'reviews' | 'discussion' | 'instructor'>('overview');
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Review Modal state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState('');
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState('');

  // Comment state
  const [newCommentText, setNewCommentText] = useState('');
  const [replyParentId, setReplyParentId] = useState<string | null>(null);
  const [reportCommentId, setReportCommentId] = useState<string | null>(null);
  const [selectedReportReason, setSelectedReportReason] = useState<ReportReason>('Spam');

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center space-y-4">
        <AIOrb state="idle" size={60} />
        <h2 className="text-2xl font-black text-[#0A192F]">Course Not Found</h2>
        <p className="text-slate-500 text-sm max-w-md">
          The requested course ID could not be found or has been archived.
        </p>
        <Link
          to="/courses"
          className="px-6 py-2.5 bg-brand-500 text-white rounded-xl text-xs font-bold shadow-md hover:bg-brand-600 transition inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Courses Catalog
        </Link>
      </div>
    );
  }

  const isEnrolled = currentUser ? DBService.isUserEnrolled(currentUser.id, course.id) : false;
  const hasPending = currentUser ? DBService.hasPendingEnrollment(currentUser.id, course.id) : false;
  const isInCart = cartItemIds.includes(course.id);

  // Dynamic Rating Calculations from DB
  const ratingStats = DBService.getCourseRatingStats(course.id);
  const publishedReviews = DBService.getReviewsByCourseId(course.id, true);
  const courseComments = DBService.getCommentsByCourseId(course.id);

  const handleEnrollClick = () => {
    if (isEnrolled) {
      navigate(`/courses/${course.id}/learn`);
      return;
    }
    if (hasPending) {
      navigate('/dashboard');
      return;
    }
    if (course.isFree) {
      if (!isAuthenticated || !currentUser) {
        navigate('/login', { state: { from: `/courses/${course.id}` } });
        return;
      }
      DBService.enrollUser(currentUser.id, course.id);
      navigate(`/courses/${course.id}/learn`);
      return;
    }
    navigate(`/checkout/${course.id}`);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !isEnrolled) {
      alert('Only enrolled students can write a course review.');
      return;
    }

    if (!newReviewText.trim()) return;

    DBService.createReview({
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      courseId: course.id,
      courseTitle: course.title,
      rating: newRating,
      comment: newReviewText,
    });

    setReviewSuccessMsg('Your review has been submitted and published successfully!');
    setNewReviewText('');
    setTimeout(() => {
      setShowReviewModal(false);
      setReviewSuccessMsg('');
    }, 1500);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !currentUser) {
      navigate('/login', { state: { from: `/courses/${course.id}` } });
      return;
    }

    if (!newCommentText.trim()) return;

    DBService.createComment({
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      userRole: currentUser.role,
      courseId: course.id,
      text: newCommentText,
      parentId: replyParentId || undefined,
    });

    setNewCommentText('');
    setReplyParentId(null);
  };

  const handleReportSubmit = () => {
    if (!reportCommentId) return;
    DBService.reportComment(reportCommentId, selectedReportReason);
    setReportCommentId(null);
    alert('Thank you. The comment has been reported to Admin for review.');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Top Header Banner */}
      <div className="bg-[#0A192F] text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative">
        <div className="max-w-7xl mx-auto space-y-4">
          <Link
            to="/courses"
            className="inline-flex items-center gap-1.5 text-xs text-brand-400 hover:text-white font-bold transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to All Courses
          </Link>

          <div className="grid lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-brand-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full">
                  {course.category}
                </span>
                <span className="bg-white/10 text-slate-200 text-[10px] font-bold uppercase px-3 py-1 rounded-full border border-white/10">
                  {course.level}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                {course.title}
              </h1>

              {course.bengaliTitle && (
                <p className="text-sm sm:text-base text-slate-300 font-medium">
                  {course.bengaliTitle}
                </p>
              )}

              {/* Calculated Rating Bar */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-2 font-medium">
                <div className="flex items-center gap-1 text-amber-400 font-bold bg-white/10 px-2.5 py-1 rounded-lg">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="text-sm font-black text-white">{ratingStats.avgRating}</span>
                  <span className="text-slate-300">({ratingStats.reviewCount} verified reviews)</span>
                </div>
                <div>• {course.studentsCount} Students Enrolled</div>
                <div>• {course.durationHours} Hours HD Video Content</div>
                <div>• Mentor: <strong className="text-white font-bold">{course.teacherName}</strong></div>
              </div>
            </div>

            {/* Quick Pricing Box */}
            <div className="lg:col-span-4 bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 space-y-4">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-slate-300 font-medium">Course Investment</span>
                {course.isFree ? (
                  <span className="text-3xl font-black text-emerald-400">FREE</span>
                ) : (
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-white">৳{course.price.toLocaleString()}</span>
                    {course.discountPrice && (
                      <span className="text-sm line-through text-slate-400">৳{course.discountPrice.toLocaleString()}</span>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                {isEnrolled ? (
                  <button
                    onClick={handleEnrollClick}
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Continue Learning (Access Classroom)</span>
                  </button>
                ) : hasPending ? (
                  <div className="space-y-2">
                    <div className="bg-amber-500/20 border border-amber-400/40 p-3.5 rounded-2xl text-xs text-amber-200 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-amber-300">
                        <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>Enrollment Request Pending</span>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        আপনার কোর্স রিকোয়েস্টটি অ্যাডমিনের অনুমোদনের অপেক্ষায় রয়েছে। অ্যাডমিন অ্যাপ্রুভ করলেই ক্লাসরুম স্বয়ংক্রিয়ভাবে আনলক হবে।
                      </p>
                    </div>
                    <button
                      onClick={() => navigate('/dashboard')}
                      className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-black text-xs rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Clock className="w-4 h-4" />
                      <span>View Request in Dashboard</span>
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={handleEnrollClick}
                      className="w-full py-3.5 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-brand-500/30 flex items-center justify-center gap-2 transition cursor-pointer"
                    >
                      {course.isFree ? (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Start Free Course Now</span>
                        </>
                      ) : (
                        <>
                          <Smartphone className="w-4 h-4" />
                          <span>Enroll & Pay via bKash / Nagad / Card</span>
                        </>
                      )}
                    </button>

                    {!course.isFree && (
                      <button
                        onClick={() => onAddToCart(course)}
                        className={`w-full py-2.5 rounded-xl font-bold text-xs border transition flex items-center justify-center gap-1.5 cursor-pointer ${
                          isInCart
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                        }`}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>{isInCart ? 'Already in Shopping Cart' : 'Add to Shopping Cart'}</span>
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-8">
        
        <div className="bg-white rounded-2xl border border-slate-200 px-6 flex gap-6 text-xs sm:text-sm font-bold text-slate-600 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 transition whitespace-nowrap ${activeTab === 'overview' ? 'text-brand-600 font-black border-b-2 border-brand-500' : 'hover:text-slate-900'}`}
          >
            Overview & Details
          </button>

          <button
            onClick={() => setActiveTab('syllabus')}
            className={`py-4 transition whitespace-nowrap ${activeTab === 'syllabus' ? 'text-brand-600 font-black border-b-2 border-brand-500' : 'hover:text-slate-900'}`}
          >
            Curriculum ({course.lessons.length} Lessons)
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-4 transition whitespace-nowrap ${activeTab === 'reviews' ? 'text-brand-600 font-black border-b-2 border-brand-500' : 'hover:text-slate-900'}`}
          >
            Student Reviews ({ratingStats.reviewCount})
          </button>

          <button
            onClick={() => setActiveTab('discussion')}
            className={`py-4 transition whitespace-nowrap ${activeTab === 'discussion' ? 'text-brand-600 font-black border-b-2 border-brand-500' : 'hover:text-slate-900'}`}
          >
            Course Q&A & Discussion ({courseComments.length})
          </button>

          <button
            onClick={() => setActiveTab('instructor')}
            className={`py-4 transition whitespace-nowrap ${activeTab === 'instructor' ? 'text-brand-600 font-black border-b-2 border-brand-500' : 'hover:text-slate-900'}`}
          >
            Instructor Profile
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-6">
              
              {/* Preview Player */}
              <div className="relative rounded-3xl overflow-hidden bg-slate-900 aspect-video border border-slate-200 shadow-xl group flex items-center justify-center">
                {isPlayingVideo ? (
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/uCvNsKvIHgg?autoplay=1"
                    title="Course Preview Video"
                    allowFullScreen
                  />
                ) : (
                  <>
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover opacity-75" />
                    <button
                      onClick={() => setIsPlayingVideo(true)}
                      className="absolute w-16 h-16 rounded-full bg-brand-500 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
                    >
                      <Play className="w-8 h-8 fill-current ml-1" />
                    </button>
                  </>
                )}
              </div>

              {/* Description */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200 space-y-3">
                <h3 className="text-xl font-black text-[#0A192F]">About This Masterclass</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{course.description}</p>
              </div>

              {/* What You Will Learn */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200 space-y-4">
                <h3 className="text-xl font-black text-[#0A192F]">What You Will Learn</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {(course.features || []).map((feat: string, i: number) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-3">
                <h4 className="text-base font-black text-[#0A192F]">Prerequisites</h4>
                <ul className="space-y-2 text-xs text-slate-600 font-medium">
                  {(course.requirements || []).map((req: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-brand-500 font-bold">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Syllabus */}
        {activeTab === 'syllabus' && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 space-y-4 max-w-4xl">
            <h3 className="text-xl font-black text-[#0A192F]">Lessons Breakdown ({(course.lessons || []).length} Modules)</h3>
            <div className="space-y-3">
              {(course.lessons || []).map((les: any, idx: number) => (
                <div key={les.id} className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-600 font-bold flex items-center justify-center text-xs">{idx + 1}</div>
                    <div>
                      <h4 className="text-sm font-bold text-[#0A192F]">{les.title}</h4>
                      <p className="text-xs text-slate-500">{les.description}</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 font-bold">{les.duration}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Student Reviews & 5-Star Rating Breakdown (Requirement #9 & #10) */}
        {activeTab === 'reviews' && (
          <div className="space-y-8 max-w-4xl">
            
            {/* Calculated Rating & Distribution Card */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 grid sm:grid-cols-12 gap-8 items-center">
              <div className="sm:col-span-4 text-center sm:border-r border-slate-200 sm:pr-8 space-y-2">
                <div className="text-5xl font-black text-[#0A192F]">{ratingStats.avgRating}</div>
                <div className="flex justify-center gap-1 text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`w-5 h-5 ${s <= Math.round(ratingStats.avgRating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                  ))}
                </div>
                <div className="text-xs text-slate-500 font-bold">Based on {ratingStats.reviewCount} student review(s)</div>

                {isEnrolled && (
                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="mt-3 px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-black shadow-md transition"
                  >
                    Write a Review
                  </button>
                )}
              </div>

              {/* Rating Bars Distribution */}
              <div className="sm:col-span-8 space-y-2 text-xs font-bold text-slate-600">
                {[5, 4, 3, 2, 1].map((starKey) => {
                  const count = (ratingStats.distribution as any)[starKey] || 0;
                  const pct = ratingStats.reviewCount > 0 ? Math.round((count / ratingStats.reviewCount) * 100) : starKey === 5 ? 85 : 5;

                  return (
                    <div key={starKey} className="flex items-center gap-3">
                      <span className="w-8 text-right flex items-center gap-1 font-mono">
                        {starKey} <Star className="w-3 h-3 fill-amber-400 text-amber-400 inline" />
                      </span>
                      <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-amber-400 h-full rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-12 text-slate-400 text-[11px] font-mono">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Published Reviews List */}
            <div className="space-y-4">
              <h3 className="text-lg font-black text-[#0A192F]">Student Experiences</h3>
              {publishedReviews.length === 0 ? (
                <div className="bg-white p-8 rounded-3xl text-center border border-slate-200 text-slate-500 text-xs font-medium">
                  No verified student reviews yet. Be the first enrolled student to leave a review!
                </div>
              ) : (
                publishedReviews.map((rev) => (
                  <div key={rev.id} className="bg-white p-6 rounded-3xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={rev.userAvatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e'}
                          alt={rev.userName}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-brand-100"
                        />
                        <div>
                          <div className="font-extrabold text-sm text-[#0A192F]">{rev.userName}</div>
                          <div className="text-[10px] text-slate-400 font-semibold">{new Date(rev.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>

                      <div className="flex gap-1 text-amber-400">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={`w-4 h-4 ${s <= rev.rating ? 'fill-amber-400' : 'text-slate-200'}`} />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed font-medium bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      "{rev.comment}"
                    </p>
                  </div>
                ))
              )}
            </div>

          </div>
        )}

        {/* Tab 4: Discussion & Q&A Comments (Requirement #12 & #15) */}
        {activeTab === 'discussion' && (
          <div className="space-y-6 max-w-4xl">
            
            {/* Write Comment Box */}
            <form onSubmit={handleCommentSubmit} className="bg-white p-6 rounded-3xl border border-slate-200 space-y-3">
              <h3 className="text-base font-black text-[#0A192F]">Ask a Question or Post a Comment</h3>
              <textarea
                rows={3}
                required
                placeholder={isAuthenticated ? "Write your comment or technical question..." : "Please log in to leave a comment."}
                disabled={!isAuthenticated}
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-slate-400 font-medium">Comments are moderated for quality and safety.</span>
                <button
                  type="submit"
                  disabled={!isAuthenticated}
                  className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs rounded-xl shadow transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" /> Post Comment
                </button>
              </div>
            </form>

            {/* Comments Thread */}
            <div className="space-y-4">
              {courseComments.length === 0 ? (
                <div className="bg-white p-8 rounded-3xl text-center border border-slate-200 text-slate-500 text-xs">
                  No discussion comments yet. Ask a question to start the conversation!
                </div>
              ) : (
                courseComments.map((cmt) => (
                  <div key={cmt.id} className="bg-white p-6 rounded-3xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={cmt.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde'}
                          alt={cmt.userName}
                          className="w-9 h-9 rounded-full object-cover ring-2 ring-brand-100"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-xs text-[#0A192F]">{cmt.userName}</span>
                            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                              {cmt.userRole}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-medium">{new Date(cmt.createdAt).toLocaleString()}</div>
                        </div>
                      </div>

                      <button
                        onClick={() => setReportCommentId(cmt.id)}
                        className="text-slate-400 hover:text-rose-500 text-xs font-bold transition flex items-center gap-1"
                        title="Report inappropriate comment"
                      >
                        <Flag className="w-3.5 h-3.5" /> Report
                      </button>
                    </div>

                    <p className="text-xs text-slate-700 font-medium leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      {cmt.text}
                    </p>
                  </div>
                ))
              )}
            </div>

          </div>
        )}

        {/* Tab 5: Instructor */}
        {activeTab === 'instructor' && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 space-y-4 max-w-4xl">
            <div className="flex items-center gap-5">
              <img
                src={course.teacherAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'}
                alt={course.teacherName}
                className="w-20 h-20 rounded-3xl object-cover ring-4 ring-brand-100 shadow-md"
              />
              <div>
                <h3 className="text-2xl font-black text-[#0A192F]">{course.teacherName}</h3>
                <p className="text-xs font-extrabold text-brand-600 uppercase tracking-wider">Lead Instructor</p>
                <p className="text-xs text-slate-500 mt-1 font-medium">10+ Years experience training web development and digital marketing professionals in Bangladesh.</p>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Review Modal (Requirement #11) */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-[#0A192F]">Write a Course Review</h3>
              <button onClick={() => setShowReviewModal(false)} className="p-1 rounded-full hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Rating (1 to 5 Stars)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="p-1"
                    >
                      <Star className={`w-8 h-8 ${star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Review Experience</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share your learning experience with this course..."
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              {reviewSuccessMsg && (
                <p className="text-xs font-bold text-emerald-600 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                  {reviewSuccessMsg}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3.5 bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-xl shadow-brand-500/25 transition"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Report Comment Modal (Requirement #15) */}
      {reportCommentId && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-3xl max-w-sm w-full border border-slate-200 shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-[#0A192F]">Report Inappropriate Comment</h3>
            <p className="text-xs text-slate-500">Select a reason for reporting this comment to Admin moderation:</p>

            <select
              value={selectedReportReason}
              onChange={(e) => setSelectedReportReason(e.target.value as ReportReason)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
            >
              <option value="Spam">Spam / Unsolicited Promotion</option>
              <option value="Harassment">Harassment or Abuse</option>
              <option value="Offensive Content">Offensive Content</option>
              <option value="Irrelevant">Irrelevant to Course</option>
              <option value="Other">Other Reason</option>
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setReportCommentId(null)}
                className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleReportSubmit}
                className="px-5 py-2 bg-rose-600 text-white rounded-xl text-xs font-extrabold shadow hover:bg-rose-700"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer onSelectCategory={() => navigate('/courses')} />

    </div>
  );
};
