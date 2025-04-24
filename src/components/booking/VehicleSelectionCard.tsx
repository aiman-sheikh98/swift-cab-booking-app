
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car } from "lucide-react";
import { VehicleCarousel } from '@/components/VehicleCarousel';

interface VehicleSelectionCardProps {
  selectedVehicle: string;
  onSelect: (vehicleType: string) => void;
}

export const VehicleSelectionCard: React.FC<VehicleSelectionCardProps> = ({ 
  selectedVehicle, 
  onSelect 
}) => {
  return (
    <Card className="border-slate-200 animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <Car className="h-5 w-5 mr-2 text-swift-600" />
          Choose Your Ride
        </CardTitle>
      </CardHeader>
      <CardContent>
        <VehicleCarousel selectedVehicle={selectedVehicle} onSelect={onSelect} />
      </CardContent>
    </Card>
  );
};
