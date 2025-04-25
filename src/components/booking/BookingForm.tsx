import React from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useLocationSuggestions } from '@/hooks/use-location-suggestions';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { LocationInput } from './LocationInput';
import { DateTimePicker } from './DateTimePicker';
import { PriceSummary } from './PriceSummary';
import { format } from "date-fns";
import { RideStatus } from '@/hooks/use-rides';

interface BookingFormProps {
  vehicleType: string;
  pickupLocation: string;
  dropoffLocation: string;
  onLocationChange: (type: 'pickup' | 'dropoff', value: string) => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({ 
  vehicleType, 
  pickupLocation, 
  dropoffLocation, 
  onLocationChange 
}) => {
  const [date, setDate] = React.useState<Date>();
  const [time, setTime] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const { getSuggestion, isLoading: isSuggestingLocation } = useLocationSuggestions();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLocationSuggestion = async (type: 'pickup' | 'dropoff', value: string) => {
    if (!value.trim()) return;

    const suggestion = await getSuggestion(value, type);
    if (suggestion) {
      onLocationChange(type, suggestion);
      toast.success(`${type === 'pickup' ? 'Pickup' : 'Dropoff'} location suggested!`);
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!pickupLocation || !dropoffLocation || !date || !time) {
      toast.error("Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    try {
      // Generate estimated arrival time (30 mins after booking)
      const estimatedArrivalTime = new Date(date);
      const [hours, minutes] = time.split(':').map(Number);
      estimatedArrivalTime.setHours(hours, minutes + 30);

      const { error } = await supabase
        .from('rides')
        .insert({
          pickup_location: pickupLocation,
          dropoff_location: dropoffLocation,
          date: format(date, "MMM dd, yyyy"),
          time: time,
          status: 'scheduled' as RideStatus,
          user_id: user?.id,
          current_location_lat: null,  // Will be updated during ride
          current_location_lng: null,  // Will be updated during ride
          estimated_arrival_time: estimatedArrivalTime.toISOString()
        });

      if (error) throw error;
      
      toast.success("Ride booked successfully!");
      navigate('/rides');
    } catch (error) {
      toast.error("Failed to book your ride. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleBooking} className="space-y-4">
      <LocationInput
        id="pickup"
        label="Pickup Location"
        value={pickupLocation}
        onChange={(value) => onLocationChange('pickup', value)}
        onSuggest={() => handleLocationSuggestion('pickup', pickupLocation)}
        isLoading={isSuggestingLocation}
      />

      <LocationInput
        id="dropoff"
        label="Dropoff Location"
        value={dropoffLocation}
        onChange={(value) => onLocationChange('dropoff', value)}
        onSuggest={() => handleLocationSuggestion('dropoff', dropoffLocation)}
        isLoading={isSuggestingLocation}
      />

      <DateTimePicker
        date={date}
        time={time}
        onDateChange={setDate}
        onTimeChange={setTime}
      />

      <PriceSummary />

      <div className="space-y-4">
        <Button 
          type="submit" 
          className="w-full bg-swift-600 hover:bg-swift-700"
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Book Now"}
        </Button>
      </div>
    </form>
  );
};
