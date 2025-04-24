
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Clock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { toast } from "sonner";
import { useLocationSuggestions } from '@/hooks/use-location-suggestions';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";

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
      const { error } = await supabase
        .from('rides')
        .insert({
          pickup_location: pickupLocation,
          dropoff_location: dropoffLocation,
          date: format(date, "MMM dd, yyyy"),
          time: time,
          status: 'scheduled',
          user_id: user?.id
        });

      if (error) throw error;
      
      toast.success("Ride booked successfully!");
      navigate('/rides');
    } catch (error) {
      toast.error("Failed to book your ride. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleBooking} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="pickup">Pickup Location</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input 
            id="pickup"
            value={pickupLocation}
            onChange={(e) => onLocationChange('pickup', e.target.value)}
            className="pl-10 pr-24"
            placeholder="Enter pickup address"
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2"
            onClick={() => handleLocationSuggestion('pickup', pickupLocation)}
            disabled={isSuggestingLocation || !pickupLocation}
          >
            {isSuggestingLocation ? "Suggesting..." : "Suggest"}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="dropoff">Dropoff Location</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input 
            id="dropoff"
            value={dropoffLocation}
            onChange={(e) => onLocationChange('dropoff', e.target.value)}
            className="pl-10 pr-24"
            placeholder="Enter destination"
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2"
            onClick={() => handleLocationSuggestion('dropoff', dropoffLocation)}
            disabled={isSuggestingLocation || !dropoffLocation}
          >
            {isSuggestingLocation ? "Suggesting..." : "Suggest"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full pl-3 text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) => date < new Date()}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="time">Time</Label>
          <div className="relative">
            <Clock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input 
              id="time"
              type="time" 
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>
      </div>

      <div className="pt-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-500">Base fare</span>
          <span className="font-medium">$15.00</span>
        </div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-500">Distance (est.)</span>
          <span className="font-medium">$12.50</span>
        </div>
        <div className="flex justify-between text-sm mb-4">
          <span className="text-slate-500">Service fee</span>
          <span className="font-medium">$2.50</span>
        </div>
        <div className="flex justify-between font-medium border-t border-slate-200 pt-4">
          <span>Total</span>
          <span className="text-lg">$30.00</span>
        </div>
      </div>

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
