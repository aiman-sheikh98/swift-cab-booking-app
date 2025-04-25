
import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";

export type RideStatus = 'scheduled' | 'in-progress' | 'completed' | 'cancelled';

export interface Ride {
  id: string;
  pickupLocation: string;
  dropoffLocation: string;
  date: string;
  time: string;
  status: RideStatus;
}

export const useRides = () => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const { data, error } = await supabase
          .from('rides')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        setRides(data.map(ride => ({
          id: ride.id,
          pickupLocation: ride.pickup_location,
          dropoffLocation: ride.dropoff_location,
          date: ride.date,
          time: ride.time,
          status: ride.status as RideStatus
        })));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch rides');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRides();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rides'
        },
        (payload) => {
          console.log('Real-time update:', payload);
          fetchRides(); // Refetch rides when changes occur
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const updateRideStatus = async (rideId: string, status: RideStatus) => {
    try {
      const { error } = await supabase
        .from('rides')
        .update({ status })
        .eq('id', rideId);

      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update ride status');
    }
  };

  return {
    rides,
    isLoading,
    error,
    updateRideStatus
  };
};
