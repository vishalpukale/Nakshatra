import React from 'react';

const TableLoader = () => {
  // Different widths for name variations
  const nameWidths = ['w-16', 'w-16', 'w-16', 'w-16', 'w-16', 'w-16', 'w-16', 'w-16', 'w-16'];
  const codeWidths = ['w-12', 'w-12', 'w-12', 'w-12', 'w-12', 'w-12', 'w-12', 'w-12', 'w-12'];
  const premiumWidths = ['w-17', 'w-17', 'w-17', 'w-17', 'w-17', 'w-17', 'w-17', 'w-17', 'w-17'];
  
  return (
    <div className="bg-gray-50 w-full">
      {/* Table Header */}
      <div className="flex items-center px-4 py-2 bg-gray-100 text-sm font-medium text-gray-500">
        <div className="w-48 h-3 bg-gray-200 rounded animate-pulse"></div>
        <div className="w-16 h-3 bg-gray-200 rounded animate-pulse ml-8"></div>
        <div className="w-32 h-3 bg-gray-200 rounded animate-pulse ml-16"></div>
      </div>
      
      {/* Table Rows */}
      <div className="bg-white">
        {[...Array(9)].map((_, index) => (
          <div key={index} className="flex items-center px-4 py-3 border-b border-gray-100 last:border-b-0">
            {/* Agent Column - Avatar + Name */}
            <div className="flex items-center space-x-3 w-48">
              {/* Avatar */}
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse flex-shrink-0"></div>
              
              {/* Name with ellipsis effect */}
              <div className="flex-1 min-w-0">
                <div className={`h-4 bg-gray-200 rounded animate-pulse ${nameWidths[index]}`}></div>
              </div>
            </div>
            
            {/* Gfi Code Column */}
            <div className="w-24 ml-8">
              <div className={`h-4 bg-gray-200 rounded animate-pulse ${codeWidths[index]}`}></div>
            </div>
            
            {/* Submitted Premium Column */}
            <div className="flex-1 ml-9">
              <div className={`h-4 bg-gray-200 rounded animate-pulse ${premiumWidths[index]}`}></div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Watermark area at bottom */}
      <div className="relative h-16 bg-white border-t border-gray-100">
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <div className="text-center space-y-1">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-48 mx-auto"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse w-32 mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default TableLoader;