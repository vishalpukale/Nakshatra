import React from 'react';

const ProfileSkeletonLoader = () => {
  return (
    <div className="max-w-md mx-auto">
      {/* Profile Header */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4 mb-1"></div>
          <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
        </div>
      </div>

      {/* Edit Profile Button */}
      <div className="h-10 bg-gray-200 rounded animate-pulse mb-6"></div>

      {/* Profile Details */}
      <div className="space-y-4">
        {/* GFI Code */}
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
        </div>

        {/* Suffix */}
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-12"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-6"></div>
        </div>

        {/* Agent Level */}
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-6"></div>
        </div>

        {/* Date of Birth */}
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
        </div>

        {/* Gender */}
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
        </div>

        {/* Marital Status */}
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
        </div>

        {/* Tax (W9) */}
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
        </div>

        {/* SIN */}
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-8"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
        </div>

        {/* NPN */}
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-10"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
        </div>

        {/* Onboarded Date */}
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-28"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-4"></div>
        </div>

        {/* Approval Date */}
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-4"></div>
        </div>

        {/* Referral Agent */}
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-28"></div>
        </div>
      </div>

      {/* Address Sections */}
      <div className="mt-8 space-y-6">
        {/* Correspondence Address */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-40"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-16 ml-7"></div>
        </div>

        {/* Residential Address */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-20 ml-7"></div>
        </div>

        {/* Direct Deposit Info */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-36"></div>
          </div>
          <div className="h-6 bg-gray-200 rounded animate-pulse w-16"></div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeletonLoader;