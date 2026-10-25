// /**
//  * --------------------------------------------------------
//  * File        : TopEarnersSkeletonLoader.jsx
//  * Description : Skeleton loader component for the "Top Earners" table.
//  *               Provides a placeholder UI while top earners data is loading.
//  * Author      : Developer Team
//  * Created On  : 2025-06-12
//  * Updated On  : 2025-08-25
//  * --------------------------------------------------------
//  * Notes:
//  * - Mimics the table structure of the TopEarners component (header + rows).
//  * - Includes avatar, agent name, code, amount, and cycle date placeholders.
//  * - Uses Tailwind CSS for styling and pulse animation.
//  * - Fixed row count (5), but can be adapted if needed.
//  */

// import React from "react";

// const TopEarnersSkeletonLoader = () => {
//   return (
//     <div className="rounded-lg border border-gray-200 bg-white">
//       {/* Section Header Skeleton */}
//       <div className="px-4 py-2">
//         <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
//       </div>
      
//       {/* Table Container */}
//       <div className="flex-1 overflow-auto">
//         {/* Table Header Skeleton */}
//         <div className="grid grid-cols-3 gap-4 px-4 py-3 bg-gray-50 border-b border-gray-200 sticky top-0">
//           <div className="h-3 w-20 md:w-15 lg:w-20 xl:w-30 bg-gray-200 rounded animate-pulse"></div>
//           <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
//           <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
//         </div>
        
//         {/* Table Rows Skeleton */}
//         {Array.from({ length: 5 }, (_, index) => (
//           <div
//             key={index}
//             className="grid grid-cols-3 gap-4 px-4 py-3 border-b border-gray-100 last:border-b-0"
//           >
//             {/* Agent Name Column */}
//             <div className="flex items-center gap-2 min-w-0">
//               {/* Avatar Skeleton */}
//               <div className="h-6 w-6 bg-gray-200 rounded-full flex-shrink-0 animate-pulse"></div>
              
//               {/* Name + Code Skeleton */}
//               <div className="min-w-0 flex-1 space-y-1">
//                 <div className="h-4 w-12 md:w-7 lg:w-17 xl:w-30 bg-gray-200 rounded animate-pulse"></div>
//                 <div className="h-3 w-8 md:w-8 lg:w-11 xl:w-20 bg-gray-200 rounded animate-pulse"></div>
//               </div>
//             </div>
            
//             {/* Amount Column */}
//             <div className="flex items-center">
//               <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
//             </div>
            
//             {/* Cycle Date Column */}
//             <div className="flex items-center">
//               <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TopEarnersSkeletonLoader;


/**
 * --------------------------------------------------------
 * File        : SkeletonTableLoader.jsx
 * Description : Generic Skeleton loader for tables.
 *               Supports dynamic rows & columns.
 * Author      : Developer Team
 * Created On  : 2025-06-12
 * Updated On  : 2025-08-25
 * --------------------------------------------------------
 * Props:
 * - rows (number)       : Number of skeleton rows (default: 5)
 * - columns (number)    : Number of skeleton columns (default: 3)
 * - withHeader (bool)   : Whether to show header skeleton (default: true)
 * - showAvatar (bool)   : Show avatar circle in first column (default: true)
 * - headerWidths ([])   : Array of widths for header cells
 * - rowWidths ([[]])    : 2D array of widths for row cells
 *                         (outer = rows, inner = columns)
 * --------------------------------------------------------
 */

import React from "react";

const SkeletonTableLoader = ({
  rows = 5,
  columns = 3,
  withHeader = true,
  showAvatar = true,
  headerWidths = [],
  rowWidths = [],
}) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      {/* Section Title Skeleton */}
      <div className="px-4 py-2">
        <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
      </div>

      <div className="flex-1 overflow-auto">
        {/* Header */}
        {withHeader && (
          <div className={`grid grid-cols-${columns} gap-4 px-4 py-3 bg-gray-50 border-b border-gray-200 sticky top-0`}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div
                key={colIndex}
                className={`h-3 ${headerWidths[colIndex] || "w-20"} bg-gray-200 rounded animate-pulse`}
              ></div>
            ))}
          </div>
        )}

        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className={`grid grid-cols-${columns} gap-4 px-4 py-3 border-b border-gray-100 last:border-b-0`}
          >
            {Array.from({ length: columns }).map((_, colIndex) => {
              const width =
                rowWidths[rowIndex]?.[colIndex] || "w-20";

              // Special case: first column with avatar + text
              if (showAvatar && colIndex === 0) {
                return (
                  <div key={colIndex} className="flex items-center gap-2 min-w-0">
                    <div className="h-6 w-6 bg-gray-200 rounded-full flex-shrink-0 animate-pulse"></div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className={`h-4 ${width} bg-gray-200 rounded animate-pulse`}></div>
                      <div className="h-3 w-12 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                );
              }

              // Regular skeleton cell
              return (
                <div key={colIndex} className="flex items-center">
                  <div className={`h-4 ${width} bg-gray-200 rounded animate-pulse`}></div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonTableLoader;

