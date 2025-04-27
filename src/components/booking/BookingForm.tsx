import React, { useState } from 'react';
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Ride, RideStatus } from '@/hooks/use-rides';

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
  const [paymentMethod, setPaymentMethod] = useState('card');
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

  const handleBooking = async () => {
    if (!pickupLocation || !dropoffLocation || !date || !time) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      const vehicleTypeFormatted = vehicleType.toLowerCase() as 'economy' | 'standard' | 'premium';
      const pricing = RIDE_PRICING[vehicleTypeFormatted];
      const baseFare = pricing.basePrice;
      const distance = 10; // Default distance for demo
      const distanceFare = pricing.pricePerKm * distance;
      const serviceFee = Math.round(baseFare * 0.1);
      const totalPrice = baseFare + distanceFare + serviceFee;

      // Create Stripe checkout session
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          pickupLocation,
          dropoffLocation,
          date: format(date, "MMM dd, yyyy"),
          time,
          vehicleType: vehicleTypeFormatted,
          price: totalPrice
        },
      });

      if (error) throw error;

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      toast.error("Failed to process payment. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); }}>
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

      <div className="space-y-2">
        <h3 className="font-medium text-gray-900">Payment Method</h3>
        <RadioGroup 
          value={paymentMethod} 
          onValueChange={setPaymentMethod}
          className="grid grid-cols-3 gap-4"
        >
          <div>
            <RadioGroupItem 
              value="card" 
              id="card" 
              className="peer sr-only"
            />
            <Label
              htmlFor="card"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-swift-600 [&:has([data-state=checked])]:border-swift-600 cursor-pointer"
            >
              <svg className="h-6 w-6 mb-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M2 10H22" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Credit Card
            </Label>
          </div>
          
          <div>
            <RadioGroupItem 
              value="paypal" 
              id="paypal" 
              className="peer sr-only" 
            />
            <Label
              htmlFor="paypal"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer peer-data-[state=checked]:border-swift-600 [&:has([data-state=checked])]:border-swift-600"
            >
              <svg className="h-6 w-6 mb-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.891 7.78C19.891 9.3709 19.1575 10.8538 17.9536 11.72C16.655 12.6623 14.9512 13 13.1642 13H11.9603C11.6921 13 11.4665 13.1854 11.3889 13.4438L10 18.9697H6.7145C6.3301 18.9697 6.0405 18.6327 6.0834 18.2513L8.2415 3.77643C8.30367 3.31983 8.7029 2.98291 9.16591 2.98291H14.0297C16.0386 2.98291 17.5767 3.35439 18.5499 4.08024C19.4516 4.75815 19.891 6.03339 19.891 7.78Z" stroke="currentColor" strokeWidth="2"/>
              </svg>
              PayPal
            </Label>
          </div>
          
          <div>
            <RadioGroupItem 
              value="upi" 
              id="upi" 
              className="peer sr-only" 
            />
            <Label
              htmlFor="upi"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer peer-data-[state=checked]:border-swift-600 [&:has([data-state=checked])]:border-swift-600"
            >
              <svg className="h-6 w-6 mb-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M7.5 8.5L16.5 15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M16.5 8.5L7.5 15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              UPI
            </Label>
          </div>
        </RadioGroup>
      </div>

      <PriceSummary vehicleType={vehicleType as 'economy' | 'standard' | 'premium'} />

      <div className="flex gap-4">
        <Button 
          type="button"
          className="flex-1 bg-swift-600 hover:bg-swift-700 text-white"
          onClick={() => handleBooking()}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Book Now"}
        </Button>
      </div>
    </form>
  );
};
