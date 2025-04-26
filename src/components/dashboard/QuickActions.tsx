
import React from 'react';
import { MapPin, Calendar, CreditCard } from "lucide-react";
import QuickRideOption from './QuickRideOption';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="mb-10">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <QuickRideOption 
          icon={<MapPin className="h-6 w-6" />} 
          title="Book a Ride" 
          description="Request a ride to your destination"
          onClick={() => navigate('/book')}
        />
        <QuickRideOption 
          icon={<Calendar className="h-6 w-6" />} 
          title="Schedule Later" 
          description="Book a ride for a future date"
          onClick={() => navigate('/book')}
        />
        <QuickRideOption 
          icon={<CreditCard className="h-6 w-6" />} 
          title="Manage Payments" 
          description="Update your payment methods"
          onClick={() => navigate('/payment')}
        />
      </div>
    </div>
  );
};

export default QuickActions;
