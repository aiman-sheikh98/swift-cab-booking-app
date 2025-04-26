
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "@/lib/auth";
import { useRides } from '@/hooks/use-rides';
import { toast } from 'sonner';
import { useDashboard } from '@/hooks/use-dashboard';
import DashboardStats from './dashboard/DashboardStats';
import QuickActions from './dashboard/QuickActions';
import RidesList from './dashboard/RidesList';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { updateRideStatus } = useRides();
  const { rides, newBookingId } = useDashboard(user);

  const handleBookRide = () => {
    navigate('/book');
  };

  const handleSchedule = (rideId: string) => {
    toast.info("Reschedule feature coming soon!");
  };

  const handleCancelRide = async (rideId: string) => {
    try {
      await updateRideStatus(rideId, 'cancelled');
      toast.success(`Ride #${rideId} has been cancelled`);
    } catch (error) {
      toast.error("Failed to cancel ride. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome to Swift</h1>
          <p className="text-slate-500 mt-1">Your premium ride service</p>
        </div>
        <Button 
          className="mt-4 md:mt-0 bg-swift-600 hover:bg-swift-700 text-white"
          onClick={handleBookRide}
        >
          <Plus className="h-4 w-4 mr-2" /> Book New Ride
        </Button>
      </div>
      
      <DashboardStats rides={rides} />
      <QuickActions />
      <RidesList
        rides={rides}
        newBookingId={newBookingId}
        onCancel={handleCancelRide}
        onSchedule={handleSchedule}
      />
    </div>
  );
};

export default Dashboard;
