import React from 'react';

const PieChartLoader = () => {
  return (
    <div className="bg-white w-full">
      <div className="flex flex-wrap items-start lg:items-center gap-6">
        {/* Donut Chart */}
        <div className="flex-shrink-0 mx-auto ">
          <div className="relative w-24 h-24 lg:w-32 lg:h-32">
            {/* Outer donut ring */}
            <div className="absolute inset-0 rounded-full border-8 border-gray-200 animate-pulse"></div>
            
            {/* Center number */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-12"></div>
            </div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex-1 w-full lg:w-auto space-y-3">
          {/* Title */}
          <div className="h-5  mx-auto xl:mx-0 bg-gray-200 rounded animate-pulse w-8 mb-4"></div>
          
          {/* Legend Items */}
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex items-center justify-between">
              {/* Left side - dot and label */}
              <div className="flex items-center space-x-2 flex-1">
                {/* Color dot */}
                <div className="w-3 h-3 bg-gray-200 rounded-full animate-pulse flex-shrink-0"></div>
                
                {/* Label text */}
                <div className="h-4 bg-gray-200 rounded animate-pulse flex-1 max-w-32"></div>
              </div>
              
              {/* Right side - percentage */}
              <div className="h-4 bg-gray-200 rounded animate-pulse w-12 ml-4 flex-shrink-0"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Demo component showing multiple variations

export default PieChartLoader;