import React, { useState, useEffect } from "react";
import { WebsiteContentItem } from "@/types/platform";
import { DBService } from "@/services/db";

interface WebsiteContentModalProps {
  isOpen: boolean;
  editingContentItem: WebsiteContentItem | null;
  showNewLocationModal: boolean;
  onClose: () => void;
  currentUserName?: string;
}

export const WebsiteContentModal: React.FC<WebsiteContentModalProps> = ({
  isOpen,
  editingContentItem,
  showNewLocationModal,
  onClose,
  currentUserName,
}) => {
  const [contentLocationKey, setContentLocationKey] = useState("");
  const [contentSectionName, setContentSectionName] = useState("");
  const [contentTitle, setContentTitle] = useState("");
  const [contentSubtitle, setContentSubtitle] = useState("");
  const [contentDescription, setContentDescription] = useState("");
  const [contentMediaType, setContentMediaType] = useState<
    "IMAGE" | "VIDEO" | "TEXT"
  >("IMAGE");
  const [contentMediaUrl, setContentMediaUrl] = useState("");
  const [contentAltText, setContentAltText] = useState("");
  const [contentButtonText, setContentButtonText] = useState("");
  const [contentButtonUrl, setContentButtonUrl] = useState("");

  useEffect(() => {
    if (editingContentItem) {
      setContentLocationKey(editingContentItem.locationKey);
      setContentSectionName(editingContentItem.sectionName);
      setContentTitle(editingContentItem.title || "");
      setContentSubtitle(editingContentItem.subtitle || "");
      setContentDescription(editingContentItem.description || "");
      setContentMediaType(editingContentItem.mediaType);
      setContentMediaUrl(editingContentItem.mediaUrl || "");
      setContentAltText(editingContentItem.altText || "");
      setContentButtonText(editingContentItem.buttonText || "");
      setContentButtonUrl(editingContentItem.buttonUrl || "");
    } else {
      setContentLocationKey("");
      setContentSectionName("");
      setContentTitle("");
      setContentSubtitle("");
      setContentDescription("");
      setContentMediaType("IMAGE");
      setContentMediaUrl("");
      setContentAltText("");
      setContentButtonText("");
      setContentButtonUrl("");
    }
  }, [editingContentItem, showNewLocationModal]);

  if (!isOpen) return null;

  const handleSaveWebsiteContent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contentLocationKey.trim()) return;
    DBService.updateWebsiteContent(
      contentLocationKey,
      {
        sectionName: contentSectionName || contentLocationKey,
        title: contentTitle,
        subtitle: contentSubtitle,
        description: contentDescription,
        mediaType: contentMediaType,
        mediaUrl: contentMediaUrl,
        altText: contentAltText,
        buttonText: contentButtonText,
        buttonUrl: contentButtonUrl,
      },
      currentUserName,
    );
    onClose();
    alert(
      "Website section content updated successfully! Public page will display updated media immediately.",
    );
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0A192F] text-white p-6 sm:p-8 rounded-3xl max-w-lg w-full border border-slate-700 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-black">
          {editingContentItem
            ? `Manage Content: ${editingContentItem.sectionName}`
            : "Add New Content Location"}
        </h3>

        <form
          onSubmit={handleSaveWebsiteContent}
          className="space-y-4 text-xs font-bold"
        >
          <div>
            <label className="block text-slate-300 mb-1">
              Section Location Key (Unique identifier)
            </label>
            <input
              type="text"
              required
              placeholder="e.g. homepage_hero"
              value={contentLocationKey}
              onChange={(e) => setContentLocationKey(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1">
              Section Display Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Homepage Hero Showcase"
              value={contentSectionName}
              onChange={(e) => setContentSectionName(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1">Media Type</label>
              <select
                value={contentMediaType}
                onChange={(e) => setContentMediaType(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white"
              >
                <option value="IMAGE">Image</option>
                <option value="VIDEO">Video</option>
                <option value="TEXT">Text Only</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 mb-1">
                Media File / Video URL
              </label>
              <input
                type="text"
                placeholder="https://images.unsplash.com/... or https://youtube.com/embed/..."
                value={contentMediaUrl}
                onChange={(e) => setContentMediaUrl(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 mb-1">Headline Title</label>
            <input
              type="text"
              placeholder="Main Section Headline"
              value={contentTitle}
              onChange={(e) => setContentTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1">
              Subtitle / Badge Text
            </label>
            <input
              type="text"
              placeholder="Subtitle or Badge Label"
              value={contentSubtitle}
              onChange={(e) => setContentSubtitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1">
              Description Paragraph
            </label>
            <textarea
              rows={3}
              placeholder="Section overview paragraph..."
              value={contentDescription}
              onChange={(e) => setContentDescription(e.target.value)}
              className="w-full p-3 bg-[#071325] border border-slate-700 rounded-xl text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1">Button Text</label>
              <input
                type="text"
                placeholder="e.g. Explore All Courses"
                value={contentButtonText}
                onChange={(e) => setContentButtonText(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1">
                Button Target Link URL
              </label>
              <input
                type="text"
                placeholder="e.g. /courses"
                value={contentButtonUrl}
                onChange={(e) => setContentButtonUrl(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-extrabold shadow"
            >
              Save Section Content
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
