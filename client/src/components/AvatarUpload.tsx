// components/AvatarUpload.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface AvatarUploadProps {
  currentAvatarUrl?: string;
  onAvatarUpdated?: (newUrl: string) => void;
}

export default function AvatarUpload({
  currentAvatarUrl = '/default-avatar.png',
  onAvatarUpdated,
}: AvatarUploadProps) {
  const [preview, setPreview] = useState<string>(currentAvatarUrl);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type & size (max 5MB)
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be under 5MB.');
      return;
    }

    setError(null);
    setPreview(URL.createObjectURL(file)); // Immediate local preview
    setUploading(true);

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await fetch(`${API_BASE_URL}/api/users/profile/avatar`, {
        method: 'POST',
        credentials: 'include', // Pass HTTP-only auth cookies if needed
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to upload image');
      }

      // Notify parent component of updated image URL
      if (onAvatarUpdated) {
        onAvatarUpdated(data.avatarUrl);
      }
    } catch (err: any) {
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center sm:flex-row gap-6">
      {/* Avatar Preview Ring */}
      <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-black shrink-0 bg-gray-100">
        <Image
          src={preview}
          alt="Profile Avatar"
          fill
          className="object-cover"
        />
        {uploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-mono">
            Uploading...
          </div>
        )}
      </div>

      {/* Upload Controls */}
      <div className="flex flex-col gap-2 text-center sm:text-left">
        <h3 className="text-lg font-bold text-gray-800">Profile Picture</h3>
        <p className="text-xs text-gray-500">
          PNG, JPG, or WEBP up to 5MB.
        </p>

        <label className="inline-block cursor-pointer self-center sm:self-start px-4 py-2 text-sm font-mono font-bold text-black border-2 border-black bg-white hover:bg-black hover:text-white transition-colors rounded-md">
          {uploading ? 'Processing...' : 'Upload New Picture'}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>

        {error && <p className="text-xs text-red-500 font-mono mt-1">{error}</p>}
      </div>
    </div>
  );
}