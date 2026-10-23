'use client';

import React, { useState, useEffect, useCallback } from 'react';
import ProfileForm from '@/components/ProfileForm';
import AvatarUpload from '@/components/AvatarUpload';
import PasswordChange from '@/components/PasswordChange';
import KycUpload from '@/components/KycUpload';
import EmailVerification from '@/components/EmailVerification';

export default function UserSettingsPage() {
  const [userData, setUserData] = useState({
    avatarUrl: '/default-avatar.png',
    emailAddress: '',
    isEmailVerified: false,
    kycStatus: 'NOT_SUBMITTED',
    kycRejectionReason: '',
  });

  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const fetchUserProfile = useCallback(async () => {
    try {
      const res = await fetch(`${backendUrl}/api/users/profile`, {
        credentials: 'include',
      });
      const data = await res.json();

      // 🔍 DEBUG LOG: Check what the frontend received
    console.log('--- [FRONTEND DEBUG] PROFILE API RESPONSE ---', data.user);

    const user = data.user || (data._id ? data : null);

      if (user) {
        setUserData({
          avatarUrl: user.avatarUrl || '/default-avatar.png',
          emailAddress: user.emailAddress || '',
          isEmailVerified: user.isEmailVerified || false,
          kycStatus: user.kycStatus || 'NOT_SUBMITTED',
          kycRejectionReason: user.kycRejectionReason || '',
        });
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
    }
  }, [backendUrl]);

  // Fetch profile on initial load
  useEffect(() => {
    fetchUserProfile();

    // Optional: Re-fetch when user switches back to the tab (handy when testing admin approvals)
    const handleFocus = () => fetchUserProfile();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchUserProfile]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">User Settings</h1>
        
        {/* Avatar Upload Component */}
        <AvatarUpload 
          currentAvatarUrl={userData.avatarUrl} 
          onAvatarUpdated={(newUrl) => setUserData({ ...userData, avatarUrl: newUrl })} 
        />

        {/* Email Verification Component */}
        <EmailVerification email={userData.emailAddress} isVerified={userData.isEmailVerified} />

        {/* KYC Upload Component */}
        <KycUpload 
        key={`${userData.kycStatus}-${userData.kycRejectionReason}`}
        kycStatus={userData.kycStatus}
        rejectionReason={userData.kycRejectionReason}
         />

        {/* Existing Profile Form */}
        <ProfileForm />

        {/* Password Change Component */}
        <PasswordChange />
      </div>
    </div>
  );
}