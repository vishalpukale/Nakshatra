import React from 'react';

const TilesSkeletonLoader = ({barStyle}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm px-4 py-3.5 w-full" >
      <div className="flex justify-between items-center">
        {/* Left side content */}
        <div className="flex-1">
          {/* Title - "Chargebacks" */}
          <div className={`h-4 bg-gray-200 rounded animate-pulse w-[80%] mb-3 ${barStyle}`}></div>
          
          {/* Main amount and percentage in same line */}
          <div className="flex items-baseline space-x-3">
            {/* Amount - "$625" */}
          <div className={`h-6 bg-gray-200 rounded animate-pulse w-[60%] ${barStyle}`}></div>
            
          </div>
        </div>
        
       
      </div>
    </div>
  );
};



export default TilesSkeletonLoader;