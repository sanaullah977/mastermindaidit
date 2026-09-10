import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DBService } from '../../services/db';
import { Course, Lesson, PdfResource, WebsiteContentItem } from '../../types/platform';
import { GraduationCap, BookOpen, Users, FileText, Plus, LogOut, CheckCircle2, Clock, Sparkles,Play,Edit3,Trash2,FileCode,FileDown, Eye,EyeOff,Video,X,Upload,Globe} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const TeacherDashboard: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'courses' | 'students' | 'resources' | 'website-content'>('courses');
  
  // Selected course for editing
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showCourseEditorModal, setShowCourseEditorModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);

  // Course Form States
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [price, setPrice] = useState('2500');
  const [category, setCategory] = useState('Web Development');
  const [durationHours, setDurationHours] = useState('15');

  // Video Form States
  const [videoTitle, setVideoTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoDuration, setVideoDuration] = useState('12 mins');
  const [videoDescription, setVideoDescription] = useState('');

  // PDF Form States
  const [pdfTitle, setPdfTitle] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');

  const categories = DBService.getCategories();
  const myCourses = DBService.getCourses().filter(
    (c) => c.teacherId === currentUser?.id || c.teacherName.toLowerCase().includes(currentUser?.name.toLowerCase() || '')
  );

  const enrollments = DBService.getEnrollments();
  const myStudents = enrollments.filter((e) => myCourses.some((c) => c.id === e.courseId));
  const totalStudents = myCourses.reduce((sum, c) => sum + (c.studentsCount || 0), 0);

  const handleOpenNewCourse = () => {
    setSelectedCourse(null);
    setTitle('');
    setDescription('');
    setThumbnail('https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80');
    setPrice('2500');
    setCategory('Web Development');
    setDurationHours('15');
    setShowCourseEditorModal(true);
  };

  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course);
    setTitle(course.title);
    setDescription(course.description);
    setThumbnail(course.thumbnail);
    setPrice(course.price.toString());
    setCategory(course.category);
    setDurationHours(course.durationHours.toString());
    setShowCourseEditorModal(true);
  };

  const handleSaveCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (selectedCourse) {
      DBService.updateCourse(selectedCourse.id, {
        title,
        description,
        thumbnail,
        price: parseFloat(price) || 0,
        isFree: parseFloat(price) === 0,
        category,
        durationHours: parseInt(durationHours) || 12,
      }, currentUser?.name);
      alert('Course details updated successfully!');
    } else {
      DBService.createCourse({
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description,
        thumbnail,
        price: parseFloat(price) || 0,
        isFree: parseFloat(price) === 0,
        category,
        categoryId: category.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        level: 'All Levels',
        durationHours: parseInt(durationHours) || 12,
        status: 'PUBLISHED',
        teacherId: currentUser?.id || 'usr-teacher-1',
        teacherName: currentUser?.name || 'Instructor',
        teacherAvatar: currentUser?.avatar,
        rating: 5,
        reviewCount: 1,
        studentsCount: 0,
        lessonsCount: 0,
        requirements: ['Basic computer & internet knowledge'],
        features: ['Lifetime Access', 'Certificate of Completion'],
        lessons: [],
      }, currentUser?.name);
      alert('New Course created and published!');
    }

    setShowCourseEditorModal(false);
    window.location.reload();
  };

  const handleTogglePublishCourse = (course: Course) => {
    const nextStatus = course.status === 'PUBLISHED' ? 'UNPUBLISHED' : 'PUBLISHED';
    DBService.updateCourse(course.id, { status: nextStatus }, currentUser?.name);
    window.location.reload();
  };

  const handleDeleteCourse = (courseId: string) => {
    if (confirm('Are you sure you want to delete this course from the platform?')) {
      DBService.deleteCourse(courseId, currentUser?.name);
      window.location.reload();
    }
  };

  // Video Management
  const handleAddVideoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !videoTitle.trim() || !videoUrl.trim()) return;

    DBService.addLessonToCourse(selectedCourse.id, {
      title: videoTitle,
      description: videoDescription || `Video lecture on ${videoTitle}`,
      videoUrl: videoUrl,
      duration: videoDuration || '15 mins',
      order: (selectedCourse.lessons.length || 0) + 1,
      isPreview: false,
    }, currentUser?.name);

    setVideoTitle('');
    setVideoUrl('');
    setVideoDescription('');
    setShowVideoModal(false);
    alert('New video lecture added to course!');
    window.location.reload();
  };

  const handleDeleteVideo = (courseId: string, lessonId: string) => {
    if (confirm('Delete this video lecture?')) {
      DBService.deleteLessonFromCourse(courseId, lessonId, currentUser?.name);
      window.location.reload();
    }
  };

  // PDF Management
  const handleAddPdfSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !pdfTitle.trim() || !pdfUrl.trim()) return;

    DBService.addPdfResourceToCourse(selectedCourse.id, {
      title: pdfTitle,
      url: pdfUrl,
      fileSize: '2.4 MB',
    }, currentUser?.name);

    setPdfTitle('');
    setPdfUrl('');
    setShowPdfModal(false);
    alert('New PDF resource attached to course!');
    window.location.reload();
  };

  const handleDeletePdf = (courseId: string, pdfId: string) => {
    if (confirm('Remove this PDF document resource?')) {
      DBService.deletePdfResourceFromCourse(courseId, pdfId, currentUser?.name);
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col md:flex-row font-sans">
      
      {/* Teacher Sidebar */}
      <aside className="w-full md:w-64 bg-[#0A192F] border-b md:border-b-0 md:border-r border-slate-800 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-brand-500 flex items-center justify-center text-white font-black shadow-lg">
              T
            </div>
            <div>
              <h2 className="text-sm font-black tracking-tight">MASTERMIND AIDIT Instructor CMS</h2>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Teacher Portal</span>
            </div>
          </Link>

          <nav className="space-y-1 text-xs font-bold">
            {[
              { id: 'courses', label: 'My Courses & Lessons', icon: <BookOpen className="w-4 h-4" /> },
              { id: 'website-content', label: 'Website Media & CMS', icon: <Globe className="w-4 h-4 text-emerald-400" /> },
              { id: 'students', label: 'Enrolled Students', icon: <Users className="w-4 h-4" /> },
              { id: 'resources', label: 'PDFs & Materials', icon: <FileText className="w-4 h-4" /> },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                  activeTab === item.id
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800 space-y-3">
          <div className="flex items-center gap-2.5 text-xs text-slate-300">
            <img src={currentUser?.avatar} alt={currentUser?.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-400" />
            <div className="truncate">
              <div className="font-bold truncate">{currentUser?.name}</div>
              <div className="text-[10px] text-emerald-400 font-semibold">{currentUser?.email}</div>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-xl text-xs font-bold transition"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="flex-1 bg-[#071325] p-6 sm:p-10 space-y-8 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black">Instructor Portal — {activeTab.toUpperCase()}</h1>
            <p className="text-xs text-slate-400 mt-1">Manage your course lectures, video embeds, PDF resources, and students.</p>
          </div>

          {activeTab === 'courses' && (
            <button
              onClick={handleOpenNewCourse}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-lg transition flex items-center gap-2 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" /> Create Masterclass
            </button>
          )}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="bg-[#0A192F] p-5 rounded-2xl border border-slate-800 space-y-1">
            <div className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">My Masterclasses</div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">{myCourses.length}</div>
            <div className="text-[11px] text-slate-500">Active educational courses</div>
          </div>

          <div className="bg-[#0A192F] p-5 rounded-2xl border border-slate-800 space-y-1">
            <div className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Total Enrolled Students</div>
            <div className="text-2xl sm:text-3xl font-black text-brand-400">{totalStudents}</div>
            <div className="text-[11px] text-slate-500">Learners in your classes</div>
          </div>

          <div className="bg-[#0A192F] p-5 rounded-2xl border border-slate-800 space-y-1">
            <div className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Video Lectures</div>
            <div className="text-2xl sm:text-3xl font-black text-amber-400">
              {myCourses.reduce((sum, c) => sum + (c.lessons?.length || 0), 0)}
            </div>
            <div className="text-[11px] text-slate-500">Video tutorials uploaded</div>
          </div>
        </div>

        {/* Tab 1: My Courses & Lessons */}
        {activeTab === 'courses' && (
          <div className="bg-[#0A192F] p-6 rounded-3xl border border-slate-800 space-y-6">
            <h3 className="text-lg font-black flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              <span>Your Educational Masterclasses</span>
            </h3>

            {myCourses.length === 0 ? (
              <div className="p-8 text-center bg-[#071325] rounded-2xl border border-slate-800 text-slate-400 text-xs">
                You have not created any courses yet. Click "Create Masterclass" above to get started!
              </div>
            ) : (
              <div className="space-y-6">
                {myCourses.map((c) => (
                  <div key={c.id} className="bg-[#071325] p-6 rounded-2xl border border-slate-800 space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
                      <div className="flex gap-4 items-center">
                        <img src={c.thumbnail} alt={c.title} className="w-16 h-16 rounded-2xl object-cover shrink-0" />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-black text-white">{c.title}</h4>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${c.status === 'PUBLISHED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-300'}`}>
                              {c.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">{c.category} • {c.isFree ? 'FREE' : `৳${c.price.toLocaleString()}`} • {c.studentsCount} Students</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
                        <button
                          onClick={() => { setSelectedCourse(c); setShowVideoModal(true); }}
                          className="px-3 py-1.5 bg-brand-500/20 hover:bg-brand-500/30 text-brand-300 rounded-xl text-xs font-bold flex items-center gap-1"
                        >
                          <Video className="w-3.5 h-3.5" /> + Add Video
                        </button>

                        <button
                          onClick={() => { setSelectedCourse(c); setShowPdfModal(true); }}
                          className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-xl text-xs font-bold flex items-center gap-1"
                        >
                          <FileText className="w-3.5 h-3.5" /> + Add PDF
                        </button>

                        <button
                          onClick={() => handleEditCourse(c)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl"
                          title="Edit Course Details"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleTogglePublishCourse(c)}
                          className={`p-1.5 rounded-xl ${c.status === 'PUBLISHED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-300'}`}
                          title="Toggle Publish Status"
                        >
                          {c.status === 'PUBLISHED' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>

                        <button
                          onClick={() => handleDeleteCourse(c.id)}
                          className="p-1.5 bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 rounded-xl"
                          title="Delete Course"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Videos / Lessons Breakdown */}
                    <div className="space-y-2">
                      <div className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">Video Lectures ({c.lessons.length})</div>
                      {c.lessons.length === 0 ? (
                        <div className="text-xs text-slate-500 italic">No video lectures uploaded yet. Click "+ Add Video" above.</div>
                      ) : (
                        <div className="grid sm:grid-cols-2 gap-2">
                          {c.lessons.map((les, idx) => (
                            <div key={les.id} className="p-3 bg-[#0A192F] rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                              <div className="flex items-center gap-2.5 truncate">
                                <Video className="w-4 h-4 text-brand-400 shrink-0" />
                                <span className="font-bold text-slate-200 truncate">{idx + 1}. {les.title}</span>
                              </div>
                              <button
                                onClick={() => handleDeleteVideo(c.id, les.id)}
                                className="text-slate-500 hover:text-rose-400 p-1"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* PDF Resources Breakdown */}
                    {c.pdfResources && c.pdfResources.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-slate-800/60">
                        <div className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">PDF Resources ({c.pdfResources.length})</div>
                        <div className="grid sm:grid-cols-2 gap-2">
                          {c.pdfResources.map((pdf) => (
                            <div key={pdf.id} className="p-3 bg-[#0A192F] rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                              <div className="flex items-center gap-2.5 truncate">
                                <FileDown className="w-4 h-4 text-amber-400 shrink-0" />
                                <span className="font-bold text-slate-200 truncate">{pdf.title}</span>
                              </div>
                              <button
                                onClick={() => handleDeletePdf(c.id, pdf.id)}
                                className="text-slate-500 hover:text-rose-400 p-1"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Enrolled Students */}
        {activeTab === 'students' && (
          <div className="bg-[#0A192F] p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-lg font-black flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-400" />
              <span>Learners Enrolled in Your Classes</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#071325] text-slate-400 font-extrabold uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-3">Course</th>
                    <th className="p-3">Student User ID</th>
                    <th className="p-3">Progress</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Enrolled Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-medium text-slate-300">
                  {myStudents.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-slate-500">No student enrollments found yet.</td>
                    </tr>
                  ) : (
                    myStudents.map((e) => (
                      <tr key={e.id}>
                        <td className="p-3 font-bold text-white flex items-center gap-2">
                          <img src={e.courseThumbnail} alt={e.courseTitle} className="w-8 h-8 rounded-lg object-cover" />
                          <span className="truncate max-w-xs">{e.courseTitle}</span>
                        </td>
                        <td className="p-3 font-mono">{e.userId}</td>
                        <td className="p-3 font-bold text-brand-400">{e.progress}%</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                            {e.status}
                          </span>
                        </td>
                        <td className="p-3 text-right font-mono text-slate-400">{new Date(e.enrolledAt).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Website Media & CMS */}
        {activeTab === 'website-content' && (
          <div className="bg-[#0A192F] p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <div>
              <h3 className="text-xl font-black flex items-center gap-2">
                <Globe className="w-5 h-5 text-emerald-400" />
                <span>Permitted Website Media & Section Manager</span>
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-1">
                Instructors can manage promotional section images, video embeds, and educational section media across the platform.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {DBService.getWebsiteContents().map((item) => (
                <div key={item.id} className="bg-[#071325] p-5 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full">
                        Location: {item.locationKey}
                      </span>
                      <h4 className="text-sm font-bold text-white mt-2">{item.sectionName}</h4>
                    </div>
                  </div>

                  {item.mediaUrl && (
                    <div className="h-32 bg-slate-950 rounded-xl overflow-hidden relative border border-slate-800 flex items-center justify-center">
                      {item.mediaType === 'VIDEO' ? (
                        <div className="text-center p-4">
                          <Video className="w-8 h-8 text-emerald-400 mx-auto mb-1" />
                          <div className="text-[10px] text-slate-300 truncate max-w-xs font-mono">{item.mediaUrl}</div>
                        </div>
                      ) : (
                        <img src={item.mediaUrl} alt={item.sectionName} className="w-full h-full object-cover" />
                      )}
                    </div>
                  )}

                  <div className="space-y-1 text-xs text-slate-300">
                    {item.title && <div className="font-bold text-white line-clamp-1">{item.title}</div>}
                    {item.description && <div className="text-slate-400 text-[11px] line-clamp-2">{item.description}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Course Editor Modal */}
      {showCourseEditorModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0A192F] text-white p-6 sm:p-8 rounded-3xl max-w-lg w-full border border-slate-700 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-black">{selectedCourse ? 'Edit Masterclass Details' : 'Create New Masterclass'}</h3>
            <form onSubmit={handleSaveCourseSubmit} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block text-slate-300 mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  placeholder="Masterclass Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Price (BDT)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Course Thumbnail Image URL</label>
                <input
                  type="text"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 bg-[#071325] border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowCourseEditorModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-emerald-600 text-white rounded-xl font-extrabold shadow">Save Masterclass</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {showVideoModal && selectedCourse && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0A192F] text-white p-6 sm:p-8 rounded-3xl max-w-md w-full border border-slate-700 shadow-2xl space-y-4">
            <h3 className="text-xl font-black">Add Video Lecture to {selectedCourse.title}</h3>
            <form onSubmit={handleAddVideoSubmit} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block text-slate-300 mb-1">Video Lecture Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Module 1: Introduction to WP Hooks"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Video Embed / Hosting URL</label>
                <input
                  type="text"
                  required
                  placeholder="https://www.youtube.com/embed/..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Duration</label>
                <input
                  type="text"
                  placeholder="15 mins"
                  value={videoDuration}
                  onChange={(e) => setVideoDuration(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowVideoModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-brand-500 text-white rounded-xl font-extrabold shadow">+ Add Video</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PDF Modal */}
      {showPdfModal && selectedCourse && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0A192F] text-white p-6 sm:p-8 rounded-3xl max-w-md w-full border border-slate-700 shadow-2xl space-y-4">
            <h3 className="text-xl font-black">Attach PDF Resource to {selectedCourse.title}</h3>
            <form onSubmit={handleAddPdfSubmit} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block text-slate-300 mb-1">PDF Resource Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shortcode Cheat Sheet PDF"
                  value={pdfTitle}
                  onChange={(e) => setPdfTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">PDF File Document URL</label>
                <input
                  type="text"
                  required
                  placeholder="https://example.com/resources/cheatsheet.pdf"
                  value={pdfUrl}
                  onChange={(e) => setPdfUrl(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowPdfModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-amber-500 text-white rounded-xl font-extrabold shadow">+ Attach PDF</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
