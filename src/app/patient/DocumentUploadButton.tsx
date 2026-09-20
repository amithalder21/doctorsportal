"use client";

import { useState, useRef } from 'react';
import { upload } from '@vercel/blob/client';
import { useRouter } from 'next/navigation';

export default function DocumentUploadButton({ appointmentId }: { appointmentId: string }) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    try {
      const files = Array.from(e.target.files);
      const uploadedUrls = [];
      
      for (const file of files) {
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.\-]/g, '_');
        const blob = await upload(sanitizedName, file, {
          access: 'private',
          handleUploadUrl: '/api/upload',
        });
        uploadedUrls.push(blob.url);
      }
      
      // Update appointment in DB
      const res = await fetch(`/api/patient/appointments/${appointmentId}/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentUrls: uploadedUrls }),
      });
      
      if (!res.ok) throw new Error('Failed to save documents');
      
      alert('Documents uploaded successfully!');
      router.refresh();
    } catch (err) {
      console.error(err);
      alert('Failed to upload documents. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="w-full sm:w-auto">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleUpload} 
        className="hidden" 
        multiple 
        accept=".pdf,image/png,image/jpeg" 
      />
      <button 
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="w-full sm:w-auto justify-center inline-flex items-center gap-2 text-salute-primary hover:text-salute-dark font-bold text-sm bg-salute-primary/10 px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
      >
        {isUploading ? (
          <>
            <div className="w-4 h-4 border-2 border-salute-primary border-t-transparent rounded-full animate-spin"></div>
            Uploading...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
            </svg>
            Upload More Docs
          </>
        )}
      </button>
    </div>
  );
}
