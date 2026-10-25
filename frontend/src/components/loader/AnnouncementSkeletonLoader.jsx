/**
 * --------------------------------------------------------
 * File        : AnnouncementSkeletonLoader.jsx
 * Description : Skeleton loader component for announcements.
 *               Displays placeholder UI while announcement
 *               data is being fetched from the server.
 * Author      : Developer Team
 * Created On  : 2025-06-12
 * Updated On  : 2025-08-25
 * --------------------------------------------------------
 * Notes:
 * - Accepts a customizable `rowCount` prop to control number of skeleton rows.
 * - Mimics the structure of actual announcement items (avatar, title, description).
 * - Uses Tailwind CSS utility classes for styling and animations.
 */

import React from "react";

const AnnouncementSkeletonLoader = ({ rowCount = 5 }) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      {/* Header Skeleton */}
      <div className="px-4 py-2">
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
      </div>

      {/* Announcements List Skeleton */}
      <div className="flex-1 border-t border-[#E9EDF7]">
        <div className="p-4 space-y-4">
          {/* Generate skeleton items dynamically based on rowCount */}
          {Array.from({ length: rowCount }).map((_, index) => (
            <div key={index} className="flex min-w-0 items-center gap-2 py-2">
              {/* Avatar Skeleton */}
              <div className="rounded-full bg-gray-200 p-2 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-gray-300"></div>
              </div>

              {/* Content Skeleton */}
              <div className="min-w-0 flex-1 space-y-2">
                {/* Title Skeleton with random width */}
                <div className="space-y-1">
                  <div
                    className="h-4 bg-gray-200 rounded animate-pulse"
                    style={{ width: `${Math.random() * 40 + 40}%` }}
                  ></div>
                </div>

                {/* Description Skeleton with random width */}
                <div className="space-y-1">
                  <div
                    className="h-3 bg-gray-100 rounded animate-pulse"
                    style={{ width: `${Math.random() * 60 + 30}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementSkeletonLoader;
