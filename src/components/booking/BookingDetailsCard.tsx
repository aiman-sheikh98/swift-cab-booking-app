
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BookingForm } from './BookingForm';

interface BookingDetailsCardProps {
  vehicleType: string;
  pickupLocation: string;
  dropoffLocation: string;
  onLocationChange: (type: 'pickup' | 'dropoff', value: string) => void;
}

export const BookingDetailsCard: React.FC<BookingDetailsCardProps> = ({ 
  vehicleType, 
  pickupLocation, 
  dropoffLocation, 
  onLocationChange 
}) => {
  const navigate = useNavigate();

  return (
    <Card className="border-slate-200 shadow-md animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl">Ride Details</CardTitle>
      </CardHeader>
      <CardContent>
        <BookingForm 
          vehicleType={vehicleType} 
          pickupLocation={pickupLocation}
          dropoffLocation={dropoffLocation}
          onLocationChange={onLocationChange}
        />
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full border-swift-600 text-swift-600 hover:bg-swift-50"
          onClick={() => navigate('/payment')}
        >
          <CreditCard className="h-4 w-4 mr-2" />
          Payment Options
        </Button>
      </CardFooter>
    </Card>
  );
};
