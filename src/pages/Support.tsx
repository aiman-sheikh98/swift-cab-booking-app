
import React from 'react';
import Header from '@/components/Header';

const Support = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Support</h1>
        <p className="text-slate-500">Need help? Contact our support team.</p>
      </div>
    </div>
  );
};

export default Support;
