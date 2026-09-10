import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { DBService } from "../../services/db";
import {
  Course,
  User,
  Transaction,
  ReviewStatus,
  CommentStatus,
  UserRole,
  WebsiteContentItem,
} from "../../types/platform";
import { CheckCircle2 } from "lucide-react";

// Subcomponents
import { AdminSidebar, type AdminTab } from "./components/AdminSidebar";
import { OverviewTab } from "./components/tabs/OverviewTab";
import { WebsiteContentTab } from "./components/tabs/WebsiteContentTab";
import { CoursesTab } from "./components/tabs/CoursesTab";
import { UsersTab } from "./components/tabs/UsersTab";
import { TeachersTab } from "./components/tabs/TeachersTab";
import { ReviewsTab } from "./components/tabs/ReviewsTab";
import { CommentsTab } from "./components/tabs/CommentsTab";
import { TransactionsTab } from "./components/tabs/TransactionsTab";
import { CategoriesTab } from "./components/tabs/CategoriesTab";
import { AdministratorsTab } from "./components/tabs/AdministratorsTab";
import { AuditLogsTab } from "./components/tabs/AuditLogsTab";

// Modals
import { CreateCourseModal } from "./components/modals/CreateCourseModal";
import { EditCourseModal } from "./components/modals/EditCourseModal";
import { CourseMediaModals } from "./components/modals/CourseMediaModals";
import { WebsiteContentModal } from "./components/modals/WebsiteContentModal";
import { AdminProfileModal } from "./components/modals/AdminProfileModal";
import { EditUserModal } from "./components/modals/EditUserModal";
import { AddUserModal } from "./components/modals/AddUserModal";
import { ResetPasswordModal } from "./components/modals/ResetPasswordModal";
import { ViewUserModal } from "./components/modals/ViewUserModal";

export const AdminDashboard: React.FC = () => {
  const { currentUser, logout, updateProfile, changePassword } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");

  // Administrator & Access Code Form states
  const [newAdminName, setNewAdminName] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newTeacherAccessCode, setNewTeacherAccessCode] = useState("");
  const [newAdminSecurityCode, setNewAdminSecurityCode] = useState("");

  // Course Filter & Search states
  const [courseSearch, setCourseSearch] = useState("");
  const [courseFilterCategory, setCourseFilterCategory] = useState("ALL");
  const [courseFilterStatus, setCourseFilterStatus] = useState<
    "ALL" | "PUBLISHED" | "DRAFT" | "UNPUBLISHED"
  >("ALL");

  // Category Form state
  const [newCatName, setNewCatName] = useState("");
  const [newCatBengali, setNewCatBengali] = useState("");

  // Course Modal states
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [selectedCourseForMedia, setSelectedCourseForMedia] =
    useState<Course | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);

  // User Filter & Search states
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState<UserRole | "ALL">("ALL");
  const [userStatusFilter, setUserStatusFilter] = useState<
    "ALL" | "ACTIVE" | "SUSPENDED"
  >("ALL");

  // User Modal states
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [resetPasswordUser, setResetPasswordUser] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);

  // Website Content & Admin Profile Modal states
  const [editingContentItem, setEditingContentItem] =
    useState<WebsiteContentItem | null>(null);
  const [showNewLocationModal, setShowNewLocationModal] = useState(false);
  const [showAdminProfileModal, setShowAdminProfileModal] = useState(false);

  // Transactions Filter & Search states
  const [trxFilter, setTrxFilter] = useState<
    "ALL" | "PENDING" | "SUCCESS" | "FAILED"
  >("ALL");
  const [trxSearch, setTrxSearch] = useState("");
  const [adminToast, setAdminToast] = useState<string | null>(null);

  // Data states with real-time sync
  const [usersList, setUsersList] = useState<User[]>(() =>
    DBService.getUsers(),
  );
  useEffect(() => {
    const handleUsersUpdated = () => setUsersList(DBService.getUsers());
    window.addEventListener("mastermind_users_updated", handleUsersUpdated);
    window.addEventListener("storage", handleUsersUpdated);
    return () => {
      window.removeEventListener(
        "mastermind_users_updated",
        handleUsersUpdated,
      );
      window.removeEventListener("storage", handleUsersUpdated);
    };
  }, []);

  const [coursesList, setCoursesList] = useState<Course[]>(() =>
    DBService.getCourses(),
  );
  useEffect(() => {
    const handleCoursesUpdated = () => setCoursesList(DBService.getCourses());
    window.addEventListener("mastermind_courses_updated", handleCoursesUpdated);
    window.addEventListener("storage", handleCoursesUpdated);
    return () => {
      window.removeEventListener(
        "mastermind_courses_updated",
        handleCoursesUpdated,
      );
      window.removeEventListener("storage", handleCoursesUpdated);
    };
  }, []);

  const [trxList, setTrxList] = useState<Transaction[]>(() =>
    DBService.getTransactions(),
  );

  // Database queries
  const stats = DBService.getStats();
  const reviews = DBService.getReviews();
  const comments = DBService.getComments();
  const categories = DBService.getCategories();
  const auditLogs = DBService.getAuditLogs();
  const websiteContents = DBService.getWebsiteContents();

  const teachers = usersList.filter((u) => u.role === "TEACHER");
  const pendingTrxCount = trxList.filter((t) => t.status === "PENDING").length;

  const showAdminToast = (msg: string) => {
    setAdminToast(msg);
    setTimeout(() => setAdminToast(null), 3500);
  };

  // Transaction Handler
  const handleUpdateTrxStatus = (
    trxId: string,
    status: Transaction["status"],
  ) => {
    const updated = DBService.updateTransactionStatus(
      trxId,
      status,
      currentUser?.name || "Admin",
    );
    if (updated) {
      setTrxList(DBService.getTransactions());
      if (status === "SUCCESS") {
        showAdminToast(
          `Enrollment approved for ${updated.userName} in "${updated.courseTitle}"! Access is now active.`,
        );
      } else if (status === "FAILED") {
        showAdminToast(`Request ${trxId} marked as Rejected.`);
      }
    }
  };

  // User Actions
  const handleToggleSuspendUser = (user: User) => {
    const isSelf = Boolean(
      currentUser &&
      (user.id === currentUser.id ||
        (user.email &&
          currentUser.email &&
          user.email.toLowerCase() === currentUser.email.toLowerCase())),
    );
    if (isSelf) {
      showAdminToast(
        "Security Restriction: You cannot suspend your own active Admin account!",
      );
      return;
    }
    if (user.status === "ACTIVE") {
      if (
        confirm(
          `Are you sure you want to suspend user "${user.name}"? This will block their login access.`,
        )
      ) {
        DBService.suspendUser(user.id, currentUser?.name || "Admin");
        setUsersList(DBService.getUsers());
        showAdminToast(`User account "${user.name}" has been suspended.`);
      }
    } else {
      DBService.unsuspendUser(user.id, currentUser?.name || "Admin");
      setUsersList(DBService.getUsers());
      showAdminToast(`User account "${user.name}" has been reactivated.`);
    }
  };

  const handleChangeRole = (targetUser: User, newRole: UserRole) => {
    if (!targetUser) return;
    const isSelf = Boolean(
      currentUser &&
      (targetUser.id === currentUser.id ||
        (targetUser.email &&
          currentUser.email &&
          targetUser.email.toLowerCase() === currentUser.email.toLowerCase())),
    );
    if (isSelf && newRole !== "ADMIN") {
      showAdminToast(
        "Security Restriction: You cannot demote your own active Admin account!",
      );
      return;
    }
    if (targetUser.role === newRole) return;
    const updated = DBService.updateUser(targetUser.id, { role: newRole });
    if (updated) {
      DBService.logAdminAction(
        currentUser?.id || "usr-admin-1",
        currentUser?.name || "Admin",
        `Changed role of user ${targetUser.name} (${targetUser.id}) from ${targetUser.role} to ${newRole}`,
        "User",
        targetUser.id,
      );
      setUsersList(DBService.getUsers());
      showAdminToast(
        `User "${targetUser.name}" role changed to ${newRole} successfully!`,
      );
    } else {
      showAdminToast("Failed to change user role.");
    }
  };

  const handleDeleteUser = (user: User) => {
    const isSelf = Boolean(
      currentUser &&
      (user.id === currentUser.id ||
        (user.email &&
          currentUser.email &&
          user.email.toLowerCase() === currentUser.email.toLowerCase())),
    );
    if (isSelf) {
      showAdminToast(
        "Security Restriction: You cannot delete your own active Admin account!",
      );
      return;
    }
    if (
      confirm(
        `Are you sure you want to permanently delete user "${user.name}" (${user.email})? This action cannot be undone.`,
      )
    ) {
      DBService.deleteUser(user.id, currentUser?.name || "Admin");
      setUsersList(DBService.getUsers());
      showAdminToast(`User "${user.name}" has been permanently deleted.`);
    }
  };

  // Course Actions
  const handleTogglePublishCourse = (course: Course) => {
    const nextStatus =
      course.status === "PUBLISHED" ? "UNPUBLISHED" : "PUBLISHED";
    DBService.updateCourse(
      course.id,
      { status: nextStatus },
      currentUser?.name,
    );
    setCoursesList(DBService.getCourses());
    showAdminToast(`Course "${course.title}" status changed to ${nextStatus}.`);
  };

  const handleDuplicateCourse = (course: Course) => {
    DBService.createCourse(
      {
        ...course,
        title: `${course.title} (Copy)`,
        bengaliTitle: course.bengaliTitle
          ? `${course.bengaliTitle} (কপি)`
          : `${course.title} (Copy)`,
        slug: `${course.slug}-copy-${Date.now()}`,
        status: "DRAFT",
        studentsCount: 0,
      },
      currentUser?.name,
    );
    setCoursesList(DBService.getCourses());
    showAdminToast("Course duplicated as DRAFT!");
  };

  const handleDeleteCourse = (courseId: string) => {
    if (
      confirm(
        "Are you sure you want to permanently delete this course? All associated data will be removed.",
      )
    ) {
      DBService.deleteCourse(courseId, currentUser?.name);
      setCoursesList(DBService.getCourses());
      showAdminToast("Course deleted permanently.");
    }
  };

  // Review Actions
  const handleReviewStatus = (reviewId: string, status: ReviewStatus) => {
    DBService.updateReviewStatus(
      reviewId,
      status,
      currentUser?.name || "Admin",
    );
    window.location.reload();
  };

  const handleDeleteReview = (reviewId: string) => {
    if (confirm("Delete this review permanently?")) {
      DBService.deleteReview(reviewId, currentUser?.name);
      window.location.reload();
    }
  };

  // Comment Actions
  const handleCommentStatus = (commentId: string, status: CommentStatus) => {
    DBService.updateCommentStatus(
      commentId,
      status,
      currentUser?.name || "Admin",
    );
    window.location.reload();
  };

  const handleDeleteComment = (commentId: string) => {
    if (confirm("Delete this comment permanently?")) {
      DBService.deleteComment(commentId, currentUser?.name);
      window.location.reload();
    }
  };

  // Category Actions
  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    DBService.createCategory(
      {
        name: newCatName,
        bengaliName: newCatBengali || newCatName,
        description: "Skill development courses.",
        iconName: "BookOpen",
      },
      currentUser?.name || "Admin",
    );
    setNewCatName("");
    setNewCatBengali("");
    window.location.reload();
  };

  // Administrator Actions
  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail.trim() || !newAdminName.trim()) return;
    const res = DBService.createAdminAccount(
      newAdminName,
      newAdminEmail,
      currentUser?.name || "Admin",
    );
    if (res.success) {
      setNewAdminName("");
      setNewAdminEmail("");
      setUsersList(DBService.getUsers());
      showAdminToast(`New Administrator account created for ${newAdminEmail}`);
    } else {
      showAdminToast(res.error || "Failed to create administrator account.");
    }
  };

  const handleRotateAccessCodes = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherAccessCode.trim() && !newAdminSecurityCode.trim()) return;
    DBService.rotateAccessCodes(
      currentUser?.name || "Admin",
      newTeacherAccessCode,
      newAdminSecurityCode,
    );
    setNewTeacherAccessCode("");
    setNewAdminSecurityCode("");
    alert("Security Access Codes rotated successfully!");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col md:flex-row font-sans">
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingTrxCount={pendingTrxCount}
        currentUser={currentUser}
        onOpenAdminProfile={() => setShowAdminProfileModal(true)}
        onLogout={logout}
      />

      <main className="flex-1 p-4 sm:p-8 lg:p-10 overflow-y-auto">
        {activeTab === "overview" && (
          <OverviewTab
            pendingTrxCount={pendingTrxCount}
            setActiveTab={setActiveTab}
            stats={stats}
            auditLogs={auditLogs}
          />
        )}
        {activeTab === "website-content" && (
          <WebsiteContentTab
            websiteContents={websiteContents}
            onOpenEditContent={(item) => setEditingContentItem(item)}
            onAddNewLocation={() => {
              setEditingContentItem(null);
              setShowNewLocationModal(true);
            }}
          />
        )}
        {activeTab === "courses" && (
          <CoursesTab
            coursesList={coursesList}
            courseSearch={courseSearch}
            setCourseSearch={setCourseSearch}
            courseFilterCategory={courseFilterCategory}
            setCourseFilterCategory={setCourseFilterCategory}
            courseFilterStatus={courseFilterStatus}
            setCourseFilterStatus={setCourseFilterStatus}
            categories={categories}
            onOpenCreateCourse={() => setShowCourseModal(true)}
            onOpenEditCourse={(c) => setEditingCourse(c)}
            onAddVideo={(c) => {
              setSelectedCourseForMedia(c);
              setShowVideoModal(true);
            }}
            onAddPdf={(c) => {
              setSelectedCourseForMedia(c);
              setShowPdfModal(true);
            }}
            onTogglePublishCourse={handleTogglePublishCourse}
            onDuplicateCourse={handleDuplicateCourse}
            onDeleteCourse={handleDeleteCourse}
          />
        )}
        {activeTab === "users" && (
          <UsersTab
            users={usersList}
            currentUser={currentUser}
            userSearch={userSearch}
            setUserSearch={setUserSearch}
            userRoleFilter={userRoleFilter}
            setUserRoleFilter={setUserRoleFilter}
            userStatusFilter={userStatusFilter}
            setUserStatusFilter={setUserStatusFilter}
            onOpenAddUser={() => setShowAddUserModal(true)}
            onChangeRole={handleChangeRole}
            onViewUser={(u) => setViewingUser(u)}
            onOpenEditUser={(u) => setEditingUser(u)}
            onOpenResetPassword={(u) => setResetPasswordUser(u)}
            onToggleSuspendUser={handleToggleSuspendUser}
            onDeleteUser={handleDeleteUser}
          />
        )}
        {activeTab === "teachers" && <TeachersTab teachers={teachers} />}
        {activeTab === "reviews" && (
          <ReviewsTab
            reviews={reviews}
            onReviewStatus={handleReviewStatus}
            onDeleteReview={handleDeleteReview}
          />
        )}
        {activeTab === "comments" && (
          <CommentsTab
            comments={comments}
            onCommentStatus={handleCommentStatus}
            onDeleteComment={handleDeleteComment}
          />
        )}
        {activeTab === "transactions" && (
          <TransactionsTab
            trxList={trxList}
            pendingTrxCount={pendingTrxCount}
            trxSearch={trxSearch}
            setTrxSearch={setTrxSearch}
            trxFilter={trxFilter}
            setTrxFilter={setTrxFilter}
            onUpdateTrxStatus={handleUpdateTrxStatus}
          />
        )}
        {activeTab === "categories" && (
          <CategoriesTab
            categories={categories}
            newCatName={newCatName}
            setNewCatName={setNewCatName}
            newCatBengali={newCatBengali}
            setNewCatBengali={setNewCatBengali}
            onCreateCategory={handleCreateCategory}
            onDeleteCategory={(catId) => {
              DBService.deleteCategory(catId, currentUser?.name || "Admin");
              window.location.reload();
            }}
          />
        )}
        {activeTab === "administrators" && (
          <AdministratorsTab
            users={usersList}
            newAdminName={newAdminName}
            setNewAdminName={setNewAdminName}
            newAdminEmail={newAdminEmail}
            setNewAdminEmail={setNewAdminEmail}
            newTeacherAccessCode={newTeacherAccessCode}
            setNewTeacherAccessCode={setNewTeacherAccessCode}
            newAdminSecurityCode={newAdminSecurityCode}
            setNewAdminSecurityCode={setNewAdminSecurityCode}
            onCreateAdmin={handleCreateAdmin}
            onRotateAccessCodes={handleRotateAccessCodes}
          />
        )}
        {activeTab === "audit" && <AuditLogsTab auditLogs={auditLogs} />}
      </main>

      {/* Course Modals */}
      <CreateCourseModal
        isOpen={showCourseModal}
        onClose={() => setShowCourseModal(false)}
        categories={categories}
        teachers={teachers}
        currentUser={currentUser}
        onCourseCreated={(msg) => {
          setCoursesList(DBService.getCourses());
          showAdminToast(msg);
        }}
      />
      <EditCourseModal
        editingCourse={editingCourse}
        onClose={() => setEditingCourse(null)}
        categories={categories}
        teachers={teachers}
        currentUser={currentUser}
        onCourseUpdated={(msg) => {
          setCoursesList(DBService.getCourses());
          showAdminToast(msg);
        }}
      />
      <CourseMediaModals
        selectedCourse={selectedCourseForMedia}
        showVideoModal={showVideoModal}
        onCloseVideoModal={() => setShowVideoModal(false)}
        showPdfModal={showPdfModal}
        onClosePdfModal={() => setShowPdfModal(false)}
        currentUser={currentUser}
        onMediaAdded={(msg) => {
          setCoursesList(DBService.getCourses());
          showAdminToast(msg);
        }}
      />

      {/* Website Content Modal */}
      <WebsiteContentModal
        isOpen={Boolean(editingContentItem || showNewLocationModal)}
        editingContentItem={editingContentItem}
        showNewLocationModal={showNewLocationModal}
        onClose={() => {
          setEditingContentItem(null);
          setShowNewLocationModal(false);
        }}
        currentUserName={currentUser?.name}
      />

      {/* Admin Profile Modal */}
      <AdminProfileModal
        isOpen={showAdminProfileModal}
        onClose={() => setShowAdminProfileModal(false)}
        currentUser={currentUser}
        updateProfile={updateProfile}
        changePassword={changePassword}
        onToast={showAdminToast}
      />

      {/* User Modals */}
      <EditUserModal
        user={editingUser}
        currentUser={currentUser}
        onClose={() => setEditingUser(null)}
        onUserUpdated={() => setUsersList(DBService.getUsers())}
        onToast={showAdminToast}
      />
      <AddUserModal
        isOpen={showAddUserModal}
        currentUser={currentUser}
        onClose={() => setShowAddUserModal(false)}
        onUserCreated={() => setUsersList(DBService.getUsers())}
        onToast={showAdminToast}
      />
      <ResetPasswordModal
        user={resetPasswordUser}
        currentUser={currentUser}
        onClose={() => setResetPasswordUser(null)}
        onPasswordReset={() => setUsersList(DBService.getUsers())}
        onToast={showAdminToast}
      />
      <ViewUserModal
        user={viewingUser}
        onClose={() => setViewingUser(null)}
        onEditUser={(u) => setEditingUser(u)}
        onResetPassword={(u) => setResetPasswordUser(u)}
      />

      {/* Toast Notification Popup */}
      {adminToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3.5 rounded-2xl shadow-2xl text-xs sm:text-sm font-bold flex items-center gap-2 animate-in slide-in-from-bottom-5 duration-300">
          <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
          <span>{adminToast}</span>
        </div>
      )}
    </div>
  );
};
export default AdminDashboard;
