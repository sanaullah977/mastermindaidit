import React from "react";
import { Globe, Edit3, Video } from "lucide-react";
import { WebsiteContentItem } from "../../../../types/platform";

interface WebsiteContentTabProps {
  websiteContents: WebsiteContentItem[];
  onOpenEditContent: (item: WebsiteContentItem) => void;
  onAddNewLocation: () => void;
}

export const WebsiteContentTab: React.FC<WebsiteContentTabProps> = ({
  websiteContents,
  onOpenEditContent,
  onAddNewLocation,
}) => {
  return (
    <div className="bg-[#0A192F] p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-xl font-black flex items-center gap-2">
            <Globe className="w-5 h-5 text-sky-400" />
            <span>Website Content & Media Location Manager</span>
          </h3>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Manage homepage hero images, promotional videos, banner content,
            about section, and custom website locations dynamically.
          </p>
        </div>

        <button
          onClick={onAddNewLocation}
          className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs rounded-xl shadow transition flex items-center gap-1.5"
        >
          + Add Content Location
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {websiteContents.map((item) => (
          <div
            key={item.id}
            className="bg-[#071325] p-5 rounded-2xl border border-slate-800 space-y-3 relative group"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-extrabold uppercase bg-sky-500/20 text-sky-300 px-2.5 py-1 rounded-full">
                  Location: {item.locationKey}
                </span>
                <h4 className="text-sm font-bold text-white mt-2">
                  {item.sectionName}
                </h4>
              </div>

              <button
                onClick={() => onOpenEditContent(item)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-purple-300 rounded-xl text-xs font-bold transition flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" /> Manage
              </button>
            </div>

            {item.mediaUrl && (
              <div className="h-32 bg-slate-950 rounded-xl overflow-hidden relative border border-slate-800 flex items-center justify-center">
                {item.mediaType === "VIDEO" ? (
                  <div className="text-center p-4">
                    <Video className="w-8 h-8 text-sky-400 mx-auto mb-1" />
                    <div className="text-[10px] text-slate-300 truncate max-w-xs font-mono">
                      {item.mediaUrl}
                    </div>
                  </div>
                ) : (
                  <img
                    src={item.mediaUrl}
                    alt={item.altText || item.sectionName}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            )}

            <div className="space-y-1 text-xs text-slate-300">
              {item.title && (
                <div className="font-bold text-white line-clamp-1">
                  {item.title}
                </div>
              )}
              {item.description && (
                <div className="text-slate-400 text-[11px] line-clamp-2">
                  {item.description}
                </div>
              )}
            </div>

            <div className="text-[10px] text-slate-500 font-mono pt-2 border-t border-slate-800/80 flex justify-between">
              <span>Type: {item.mediaType}</span>
              <span>
                Updated: {new Date(item.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
