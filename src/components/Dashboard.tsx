
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Car } from "lucide-react";
import RideCard, { RideStatus } from "./RideCard";
import { Card, CardContent } from "@/components/ui/card";

interface Ride {
  id: string;
  pickupLocation: string;
  dropoffLocation: string;
  date: string;
  time: string;
  status: RideStatus;
}

const mockRides: Ride[] = [
  {
    id: '1287',
    pickupLocation: 'Office HQ, 123 Business Park',
    dropoffLocation: 'Downtown Conference Center',
    date: 'Apr 26, 2025',
    time: '9:30 AM',
    status: 'scheduled',
  },
  {
    id: '1286',
    pickupLocation: 'Airport Terminal A',
    dropoffLocation: 'Grand Hotel',
    date: 'Apr 25, 2025',
    time: '2:15 PM',
    status: 'completed',
  },
  {
    id: '1285',
    pickupLocation: 'Corporate Tower, 45 Main St',
    dropoffLocation: 'Tech Campus Building B',
    date: 'Apr 25, 2025',
    time: '11:00 AM',
    status: 'in-progress',
  },
  {
    id: '1284',
    pickupLocation: 'City Center Mall',
    dropoffLocation: 'Research Park',
    date: 'Apr 24, 2025',
    time: '4:45 PM',
    status: 'cancelled',
  },
];

const Dashboard = () => {
  const [rides, setRides] = useState<Ride[]>(mockRides);
  
  // Stats for the overview cards
  const totalRides = rides.length;
  const completedRides = rides.filter(ride => ride.status === 'completed').length;
  const scheduledRides = rides.filter(ride => ride.status === 'scheduled').length;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">Manage your ride bookings and schedule</p>
        </div>
        <Button className="mt-4 md:mt-0 bg-swift-600 hover:bg-swift-700 text-white">
          <Plus className="h-4 w-4 mr-2" /> Book New Ride
        </Button>
      </div>
      
      {/* Stats overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-swift-100 p-3">
                <Car className="h-6 w-6 text-swift-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Total Rides</p>
                <h3 className="text-2xl font-bold text-slate-900">{totalRides}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-green-100 p-3">
                <Car className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Completed</p>
                <h3 className="text-2xl font-bold text-slate-900">{completedRides}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-blue-100 p-3">
                <Car className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Scheduled</p>
                <h3 className="text-2xl font-bold text-slate-900">{scheduledRides}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-amber-100 p-3">
                <Car className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">In Progress</p>
                <h3 className="text-2xl font-bold text-slate-900">
                  {rides.filter(ride => ride.status === 'in-progress').length}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent rides */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Recent Rides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rides.map((ride) => (
            <RideCard
              key={ride.id}
              id={ride.id}
              pickupLocation={ride.pickupLocation}
              dropoffLocation={ride.dropoffLocation}
              date={ride.date}
              time={ride.time}
              status={ride.status}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
