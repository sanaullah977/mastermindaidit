import React, { useState } from "react";
import { Course, User } from "../../../../types/platform";
import { DBService } from "../../../../services/db";

interface CourseMediaModalsProps {
  selectedCourse: Course | null;
  showVideoModal: boolean;
  onCloseVideoModal: () => void;
  showPdfModal: boolean;
  onClosePdfModal: () => void;
  currentUser: User | null;
  onMediaAdded: (msg: string) => void;
}

export const CourseMediaModals: React.FC<CourseMediaModalsProps> = ({
  selectedCourse,
  showVideoModal,
  onCloseVideoModal,
  showPdfModal,
  onClosePdfModal,
  currentUser,
  onMediaAdded,
}) => {
  const [videoTitle, setVideoTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoDuration, setVideoDuration] = useState("");

  const [pdfTitle, setPdfTitle] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");

  const handleAddVideoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !videoUrl.trim()) return;

    DBService.addLessonToCourse(
      selectedCourse.id,
      {
        title: videoTitle.trim() || "Classroom Lecture Video",
        description: `Lecture on ${videoTitle.trim() || "Classroom Lecture Video"}`,
        videoUrl: videoUrl.trim(),
        duration: videoDuration.trim() || "15 mins",
        order: (selectedCourse.lessons?.length || 0) + 1,
        isPreview: false,
      },
      currentUser?.name,
    );

    onMediaAdded(`Video successfully added to ${selectedCourse.title}!`);
    setVideoTitle("");
    setVideoUrl("");
    setVideoDuration("");
    onCloseVideoModal();
  };

  const handleAddPdfSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !pdfUrl.trim()) return;

    DBService.addPdfResourceToCourse(
      selectedCourse.id,
      {
        title: pdfTitle.trim() || "Lecture Document Resource",
        url: pdfUrl.trim(),
        fileSize: "2.5 MB",
      },
      currentUser?.name,
    );

    onMediaAdded(`PDF resource attached to ${selectedCourse.title}!`);
    setPdfTitle("");
    setPdfUrl("");
    onClosePdfModal();
  };

  return (
    <>
      {/* Admin Video Modal */}
      {showVideoModal && selectedCourse && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0A192F] text-white p-6 sm:p-8 rounded-3xl max-w-md w-full border border-slate-700 shadow-2xl space-y-4">
            <h3 className="text-xl font-black">
              Add Video to {selectedCourse.title}
            </h3>
            <form
              onSubmit={handleAddVideoSubmit}
              className="space-y-4 text-xs font-bold"
            >
              <div>
                <label className="block text-slate-300 mb-1">Video Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Module 1: System Overview"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">
                  Video URL (YouTube embed or MP4)
                </label>
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
                <button
                  type="button"
                  onClick={onCloseVideoModal}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-500 text-white rounded-xl font-extrabold shadow"
                >
                  + Add Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin PDF Modal */}
      {showPdfModal && selectedCourse && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0A192F] text-white p-6 sm:p-8 rounded-3xl max-w-md w-full border border-slate-700 shadow-2xl space-y-4">
            <h3 className="text-xl font-black">
              Attach PDF to {selectedCourse.title}
            </h3>
            <form
              onSubmit={handleAddPdfSubmit}
              className="space-y-4 text-xs font-bold"
            >
              <div>
                <label className="block text-slate-300 mb-1">
                  PDF Resource Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cheat Sheet PDF"
                  value={pdfTitle}
                  onChange={(e) => setPdfTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">
                  PDF File Document URL
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://example.com/file.pdf"
                  value={pdfUrl}
                  onChange={(e) => setPdfUrl(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClosePdfModal}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 text-white rounded-xl font-extrabold shadow"
                >
                  + Attach PDF
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
