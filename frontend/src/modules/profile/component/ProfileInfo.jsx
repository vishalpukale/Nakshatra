import React from "react";
import { useSelector } from "react-redux";

const ProfileInfo = () => {
  const { userData } = useSelector((state) => state?.signin || {});

  if (!userData) {
    return (
      <div className="p-4 bg-white border rounded">No profile data available.</div>
    );
  }

  return (
    <div className="p-4 bg-white border rounded">
      <h2 className="text-lg font-semibold">Profile</h2>
      <div className="mt-2">
        <div><strong>Name:</strong> {userData.firstName} {userData.lastName}</div>
        <div><strong>Email:</strong> {userData.email}</div>
        <div><strong>Role:</strong> {userData.userTypeCode || "—"}</div>
      </div>
    </div>
  );
};

export default ProfileInfo;
