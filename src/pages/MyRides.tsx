
import React from 'react';
import Header from '@/components/Header';

const MyRides = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">My Rides</h1>
        <p className="text-slate-500">View your ride history and upcoming bookings.</p>
      </div>
    </div>
  );
};

export default MyRides;
