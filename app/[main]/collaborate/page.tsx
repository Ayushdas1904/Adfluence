'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CollaboratePage() {
  const searchParams = useSearchParams();
  const creatorId = searchParams.get('creatorId');
  const brandId = searchParams.get('brandId');

  const router = useRouter();
  const [agreementDetails, setAgreementDetails] = useState('');
  const [userType, setUserType] = useState<'creator' | 'brand' | null>(null);

  useEffect(() => {
    const storedType = localStorage.getItem('userType') as 'creator' | 'brand' | null;
    setUserType(storedType);
  }, []);

  const handleCollaborate = async () => {
    if (!agreementDetails) return alert('Please enter collaboration details');

    try {
      await axios.post('/api/collaborations', {
        creatorId,
        brandId,
        agreementDetails,
      });

      alert('Collaboration request sent!');
      router.push('/main');
    } catch (error) {
      console.error(error);
      alert('Failed to send collaboration request.');
    }
  };

  const headingText =
    userType === 'brand'
      ? 'Collaborate with Creator'
      : userType === 'creator'
      ? 'Collaborate with Brand'
      : 'Collaborate';

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-zinc-950 to-zinc-900 px-4">
      <div className="w-full max-w-xl bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_0_30px_rgba(0,0,0,0.3)] p-8 text-white relative">
        {/* Optional glow ring */}
        <div className="absolute -inset-0.5 bg-gradient-to-tr from-blue-600 via-purple-500 to-pink-500 opacity-20 blur-xl rounded-3xl z-0" />
        
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-center mb-6">{headingText}</h1>

          <textarea
            value={agreementDetails}
            onChange={(e) => setAgreementDetails(e.target.value)}
            placeholder="Enter collaboration details here..."
            className="w-full p-4 min-h-[150px] rounded-xl bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition"
          />

          <button
            onClick={handleCollaborate}
            className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-semibold py-3 rounded-xl hover:brightness-110 transition"
          >
            Send Collaboration Request
          </button>
        </div>
      </div>
    </div>
  );
}
