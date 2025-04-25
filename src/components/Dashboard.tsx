import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Car, Plus, MapPin, CreditCard, Calendar, Locate } from "lucide-react";
import RideCard from "./RideCard";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Ride } from '@/hooks/use-rides';

const Dashboard = () => {
  const [rides, setRides] = useState<Ride[]>([]);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchRides = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('rides')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching rides:', error);
        return;
      }

      setRides(data.map(ride => ({
        id: ride.id,
        pickupLocation: ride.pickup_location,
        dropoffLocation: ride.dropoff_location,
        date: ride.date,
        time: ride.time,
        status: ride.status
      })));
    };

    fetchRides();

    const channel = supabase
      .channel('rides')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'rides',
          filter: `user_id=eq.${user?.id}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setRides(prevRides => [
              {
                id: payload.new.id,
                pickupLocation: payload.new.pickup_location,
                dropoffLocation: payload.new.dropoff_location,
                date: payload.new.date,
                time: payload.new.time,
                status: payload.new.status
              },
              ...prevRides
            ]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);
  
  // Stats for the overview cards
  const totalRides = rides.length;
  const completedRides = rides.filter(ride => ride.status === 'completed').length;
  const scheduledRides = rides.filter(ride => ride.status === 'scheduled').length;
  
  const handleBookRide = () => {
    navigate('/book');
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
      
      {/* Quick Booking Options */}
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
      
      {/* Stats overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
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
        
        <Card className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
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
        
        <Card className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
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
        
        <Card className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
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
      
      {/* Recent rides with tabs */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Recent Rides</h2>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rides.map((ride, index) => (
                <div key={ride.id} className="animate-fade-in" style={{ animationDelay: `${0.1 * index}s` }}>
                  <RideCard
                    id={ride.id}
                    pickupLocation={ride.pickupLocation}
                    dropoffLocation={ride.dropoffLocation}
                    date={ride.date}
                    time={ride.time}
                    status={ride.status}
                  />
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="scheduled" className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rides.filter(r => r.status === 'scheduled').map((ride, index) => (
                <div key={ride.id} className="animate-fade-in" style={{ animationDelay: `${0.1 * index}s` }}>
                  <RideCard
                    id={ride.id}
                    pickupLocation={ride.pickupLocation}
                    dropoffLocation={ride.dropoffLocation}
                    date={ride.date}
                    time={ride.time}
                    status={ride.status}
                  />
                </div>
              ))}
              {rides.filter(r => r.status === 'scheduled').length === 0 && (
                <div className="col-span-full text-center py-12 text-slate-500">
                  No scheduled rides found
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="in-progress" className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rides.filter(r => r.status === 'in-progress').map((ride, index) => (
                <div key={ride.id} className="animate-fade-in" style={{ animationDelay: `${0.1 * index}s` }}>
                  <RideCard
                    id={ride.id}
                    pickupLocation={ride.pickupLocation}
                    dropoffLocation={ride.dropoffLocation}
                    date={ride.date}
                    time={ride.time}
                    status={ride.status}
                  />
                </div>
              ))}
              {rides.filter(r => r.status === 'in-progress').length === 0 && (
                <div className="col-span-full text-center py-12 text-slate-500">
                  No rides in progress
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="completed" className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rides.filter(r => r.status === 'completed').map((ride, index) => (
                <div key={ride.id} className="animate-fade-in" style={{ animationDelay: `${0.1 * index}s` }}>
                  <RideCard
                    id={ride.id}
                    pickupLocation={ride.pickupLocation}
                    dropoffLocation={ride.dropoffLocation}
                    date={ride.date}
                    time={ride.time}
                    status={ride.status}
                  />
                </div>
              ))}
              {rides.filter(r => r.status === 'completed').length === 0 && (
                <div className="col-span-full text-center py-12 text-slate-500">
                  No completed rides found
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        {rides.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500">You haven't booked any rides yet</p>
            <Button 
              className="mt-4 bg-swift-600 hover:bg-swift-700 text-white"
              onClick={handleBookRide}
            >
              Book Your First Ride
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

const QuickRideOption = ({ icon, title, description, onClick }: { 
  icon: React.ReactNode, 
  title: string, 
  description: string,
  onClick: () => void
}) => (
  <div 
    className="relative group cursor-pointer" 
    onClick={onClick}
  >
    <div className="absolute -inset-0.5 bg-gradient-to-r from-swift-500 to-swift-300 rounded-lg blur opacity-25 group-hover:opacity-70 transition duration-300"></div>
    <div className="relative bg-white p-6 rounded-lg border border-slate-200 group-hover:shadow-lg transition-all duration-300">
      <div className="flex items-center gap-4">
        <div className="rounded-full bg-swift-50 p-3 text-swift-600 group-hover:bg-swift-100 transition-colors">
          {icon}
        </div>
        <div>
          <h3 className="font-medium text-lg text-slate-900">{title}</h3>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
      </div>
    </div>
  </div>
);
