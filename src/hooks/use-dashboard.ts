
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Ride, RideStatus, VehicleType } from '@/hooks/use-rides';
import { User } from '@supabase/supabase-js';

export const useDashboard = (user: User | null) => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [newBookingId, setNewBookingId] = useState<string | null>(null);

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
        status: ride.status as RideStatus,
        vehicleType: (ride.vehicle_type || 'standard') as VehicleType,
        price: Number(ride.price || 0),
        userId: ride.user_id
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
              status: payload.new.status as RideStatus,
              vehicleType: (payload.new.vehicle_type || 'standard') as VehicleType,
              price: Number(payload.new.price || 0),
              userId: payload.new.user_id
            };
            
            setRides(prevRides => [newRide, ...prevRides]);
            setNewBookingId(newRide.id);
            
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

  return {
    rides,
    newBookingId
  };
};
