'use client';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function PayCreatorButton({
  creatorEmail,
  creatorName,
  amount,
  collaborationId,
}: {
  creatorEmail: string;
  creatorName: string;
  amount: number;
  collaborationId: string;
}) {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    const res = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, creatorEmail, creatorName, collaborationId }),
    });

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert('Payment failed');
    }
    setLoading(false);
  };

  return (
    <Button onClick={handlePay} disabled={loading}>
      {loading ? 'Processing...' : `Pay $${amount} to ${creatorName}`}
    </Button>
  );
}
