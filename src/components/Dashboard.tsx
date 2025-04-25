import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Car, Plus, MapPin, CreditCard, Calendar, Locate } from "lucide-react";
import RideCard from "./RideCard";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Ride, RideStatus, useRides } from '@/hooks/use-rides';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const Dashboard = () => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [newBookingId, setNewBookingId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { updateRideStatus } = useRides();
  
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
        status: ride.status as RideStatus
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
            const newRide = {
              id: payload.new.id,
              pickupLocation: payload.new.pickup_location,
              dropoffLocation: payload.new.dropoff_location,
              date: payload.new.date,
              time: payload.new.time,
              status: payload.new.status as RideStatus
            };
            
            setRides(prevRides => [newRide, ...prevRides]);
            setNewBookingId(newRide.id);
            
            // Reset the highlighted booking after 5 seconds
            setTimeout(() => {
              setNewBookingId(null);
            }, 5000);
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
        {[
          { icon: <Car className="h-6 w-6 text-swift-600" />, title: "Total Rides", value: totalRides, color: "bg-swift-100" },
          { icon: <Car className="h-6 w-6 text-green-600" />, title: "Completed", value: completedRides, color: "bg-green-100" },
          { icon: <Car className="h-6 w-6 text-blue-600" />, title: "Scheduled", value: scheduledRides, color: "bg-blue-100" },
          { icon: <Car className="h-6 w-6 text-amber-600" />, title: "In Progress", value: rides.filter(ride => ride.status === 'in-progress').length, color: "bg-amber-100" }
        ].map((stat, index) => (
          <motion.div 
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="h-full">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`rounded-full ${stat.color} p-3`}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                    <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
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
              <AnimatePresence>
                {rides.map((ride, index) => (
                  <motion.div 
                    key={ride.id} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className={newBookingId === ride.id ? "animate-pulse" : ""}
                  >
                    <motion.div
                      animate={newBookingId === ride.id ? { 
                        boxShadow: ['0px 0px 0px rgba(0,0,0,0)', '0px 0px 20px rgba(16, 185, 129, 0.8)', '0px 0px 0px rgba(0,0,0,0)'],
                        borderColor: ['#e2e8f0', '#10b981', '#e2e8f0']
                      } : {}}
                      transition={{ duration: 2, repeat: newBookingId === ride.id ? 2 : 0 }}
                    >
                      <RideCard
                        id={ride.id}
                        pickupLocation={ride.pickupLocation}
                        dropoffLocation={ride.dropoffLocation}
                        date={ride.date}
                        time={ride.time}
                        status={ride.status}
                        onCancel={handleCancelRide}
                        onSchedule={handleSchedule}
                      />
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </TabsContent>
          
          <TabsContent value="scheduled" className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {rides.filter(r => r.status === 'scheduled').map((ride, index) => (
                  <motion.div 
                    key={ride.id} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className={newBookingId === ride.id ? "animate-pulse" : ""}
                  >
                    <RideCard
                      id={ride.id}
                      pickupLocation={ride.pickupLocation}
                      dropoffLocation={ride.dropoffLocation}
                      date={ride.date}
                      time={ride.time}
                      status={ride.status}
                      onCancel={handleCancelRide}
                      onSchedule={handleSchedule}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
              {rides.filter(r => r.status === 'scheduled').length === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full text-center py-12 text-slate-500"
                >
                  No scheduled rides found
                </motion.div>
              )}
            </div>
          </TabsContent>
          
          {/* In Progress and Completed tabs follow the same pattern */}
          <TabsContent value="in-progress" className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {rides.filter(r => r.status === 'in-progress').map((ride, index) => (
                  <motion.div 
                    key={ride.id} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <RideCard
                      id={ride.id}
                      pickupLocation={ride.pickupLocation}
                      dropoffLocation={ride.dropoffLocation}
                      date={ride.date}
                      time={ride.time}
                      status={ride.status}
                      onCancel={handleCancelRide}
                      onSchedule={handleSchedule}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
              {rides.filter(r => r.status === 'in-progress').length === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full text-center py-12 text-slate-500"
                >
                  No rides in progress
                </motion.div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="completed" className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {rides.filter(r => r.status === 'completed').map((ride, index) => (
                  <motion.div 
                    key={ride.id} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <RideCard
                      id={ride.id}
                      pickupLocation={ride.pickupLocation}
                      dropoffLocation={ride.dropoffLocation}
                      date={ride.date}
                      time={ride.time}
                      status={ride.status}
                      onCancel={handleCancelRide}
                      onSchedule={handleSchedule}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
              {rides.filter(r => r.status === 'completed').length === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full text-center py-12 text-slate-500"
                >
                  No completed rides found
                </motion.div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        {rides.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <p className="text-slate-500">You haven't booked any rides yet</p>
            <Button 
              className="mt-4 bg-swift-600 hover:bg-swift-700 text-white"
              onClick={handleBookRide}
            >
              Book Your First Ride
            </Button>
          </motion.div>
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
  <motion.div 
    className="relative group cursor-pointer"
    onClick={onClick}
    whileHover={{ scale: 1.03 }}
    transition={{ duration: 0.2 }}
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
  </motion.div>
);
