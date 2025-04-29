'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CollaboratePage() {
  const searchParams = useSearchParams();
  const creatorId = searchParams.get('creatorId');
  const brandId = searchParams.get('brandId'); // Now also get brandId from URL

  const router = useRouter();
  const [agreementDetails, setAgreementDetails] = useState('');

  const handleCollaborate = async () => {
    if (!agreementDetails) return alert('Please enter collaboration details');

    try {
      await axios.post('/api/collaborations', {
        creatorId,
        brandId,
        agreementDetails,
      });

      alert('Collaboration request sent!');
      router.push('/main'); // or wherever
    } catch (error) {
      console.error(error);
      alert('Failed to send collaboration request.');
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold">Collaborate with Creator</h1>

      <textarea
        value={agreementDetails}
        onChange={(e) => setAgreementDetails(e.target.value)}
        placeholder="Enter collaboration details here..."
        className="border rounded-lg p-4 min-h-[150px]"
      />

      <button
        onClick={handleCollaborate}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Send Collaboration Request
      </button>
    </div>
  );
}
