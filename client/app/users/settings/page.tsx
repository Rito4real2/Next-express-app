// app/users/settings/page.tsx
'use client';

import React, { useState } from 'react';
import ProfileForm from '@/components/ProfileForm';
import AvatarUpload from '@/components/AvatarUpload';

export default function UserSettingsPage() {
  const [avatarUrl, setAvatarUrl] = useState<string>('/default-avatar.png');

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">User Settings</h1>
        
        {/* Avatar Upload Component */}
        <AvatarUpload 
          currentAvatarUrl={avatarUrl} 
          onAvatarUpdated={(newUrl) => setAvatarUrl(newUrl)} 
        />

        {/* Existing Profile Form */}
        <ProfileForm />
      </div>
    </div>
  );
}