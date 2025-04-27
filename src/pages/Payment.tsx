
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from "sonner";
import Header from '@/components/Header';

const Payment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const success = searchParams.get('success');

  useEffect(() => {
    if (success === 'true') {
      toast.success('Payment successful! Your ride has been booked.');
      navigate('/rides');
    }
  }, [success, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8 flex items-center justify-center flex-1">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Processing your payment...</h1>
          <p className="text-gray-600">Please wait while we redirect you...</p>
        </div>
      </div>
    </div>
  );
};

export default Payment;
