import React from "react";

const BarChartLoader = () => {
  return (
    <div className="w-full bg-white">
      <div className="mb-3 sm:mb-4 md:mb-5 animate-pulse  bg-gray-200 h-6 w-24"></div>
      <div className="flex min-h-0">
        {/* Y-axis labels */}
        <div className="flex h-12  flex-col justify-between py-1 pr-2 sm:h-64 sm:pr-4">
          <div className="h-3 w-8 animate-pulse rounded bg-gray-200 sm:w-12"></div>
          <div className="h-3 w-10 animate-pulse rounded bg-gray-200 sm:w-14"></div>
          <div className="h-3 w-8 animate-pulse rounded bg-gray-200 sm:w-12"></div>
          <div className="h-3 w-6 animate-pulse rounded bg-gray-200 sm:w-10"></div>
          <div className="h-3 w-6 animate-pulse rounded bg-gray-200 sm:w-8"></div>
          <div className="h-3 w-6 animate-pulse rounded bg-gray-200 sm:w-10"></div>
        </div>

        {/* Chart area */}
        <div className="min-w-0 flex-1">
          {/* Chart container */}
          <div className="flex h-12 items-end justify-between overflow-x-auto border-b border-l border-gray-200 px-1 sm:h-64 sm:px-2">
            {/* Bars container with proper spacing */}
            <div className="flex w-full min-w-0 items-end justify-between gap-1 sm:gap-2">
              {/* Bar 1 - Very short */}
              <div className="max-w-4 flex-1 sm:max-w-6">
                <div className="mb-1 h-1 w-full animate-pulse rounded bg-gray-200"></div>
              </div>

              {/* Bar 2 - Very short */}
              <div className="max-w-4 flex-1 sm:max-w-6">
                <div className="mb-1 h-2 w-full animate-pulse rounded bg-gray-200"></div>
              </div>

              {/* Bar 3 - Very short */}
              <div className="max-w-4 flex-1 sm:max-w-6">
                <div className="mb-1 h-1 w-full animate-pulse rounded bg-gray-200"></div>
              </div>

              {/* Bar 4 - Medium height */}
              <div className="max-w-4 flex-1 sm:max-w-6">
                <div className="mb-1 h-17 w-full animate-pulse rounded bg-gray-200 sm:h-32"></div>
              </div>

              {/* Bar 5 - Very short */}
              <div className="max-w-4 flex-1 sm:max-w-6">
                <div className="mb-1 h-2 w-full animate-pulse rounded bg-gray-200"></div>
              </div>

              {/* Bar 6 - Tallest */}
              <div className="max-w-4 flex-1 sm:max-w-6">
                <div className="mb-1 h-30 w-full animate-pulse rounded bg-gray-200 sm:h-52"></div>
              </div>

              {/* Bar 7 - Second tallest */}
              <div className="max-w-4 flex-1 sm:max-w-6">
                <div className="mb-1 h-32 w-full animate-pulse rounded bg-gray-200 sm:h-48"></div>
              </div>

              {/* Bar 8 - Short */}
              <div className="max-w-4 flex-1 sm:max-w-6">
                <div className="mb-1 h-4 w-full animate-pulse rounded bg-gray-200 sm:h-8"></div>
              </div>
            </div>
          </div>

          {/* X-axis labels */}
          <div className="flex justify-between gap-1 overflow-x-auto px-1 pt-2 sm:px-2 sm:pt-3">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="min-w-0 flex-1">
                <div className="mx-auto h-2 w-full max-w-12 animate-pulse rounded bg-gray-200 sm:h-3 sm:max-w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarChartLoader;
