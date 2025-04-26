
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import RideCard from "../RideCard";
import { Ride, RideStatus } from '@/hooks/use-rides';
import { useNavigate } from 'react-router-dom';

interface RidesListProps {
  rides: Ride[];
  newBookingId: string | null;
  onCancel: (rideId: string) => Promise<void>;
  onSchedule: (rideId: string) => void;
}

const RidesList = ({ rides, newBookingId, onCancel, onSchedule }: RidesListProps) => {
  const navigate = useNavigate();

  const filteredRides = (status: RideStatus | 'all') => 
    status === 'all' ? rides : rides.filter(ride => ride.status === status);

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-slate-900 mb-4">Recent Rides</h2>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
        
        {['all', 'scheduled', 'in-progress', 'completed', 'cancelled'].map((tab) => (
          <TabsContent key={tab} value={tab} className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {filteredRides(tab as RideStatus | 'all').map((ride) => (
                  <motion.div 
                    key={ride.id} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className={newBookingId === ride.id ? "animate-pulse" : ""}
                  >
                    <RideCard
                      id={ride.id}
                      pickupLocation={ride.pickupLocation}
                      dropoffLocation={ride.dropoffLocation}
                      date={ride.date}
                      time={ride.time}
                      status={ride.status}
                      vehicleType={ride.vehicleType}
                      price={ride.price}
                      onCancel={onCancel}
                      onSchedule={onSchedule}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
              {filteredRides(tab as RideStatus | 'all').length === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full text-center py-12 text-slate-500"
                >
                  No {tab === 'all' ? 'rides' : `${tab} rides`} found
                </motion.div>
              )}
            </div>
          </TabsContent>
        ))}
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
            onClick={() => navigate('/book')}
          >
            Book Your First Ride
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default RidesList;
