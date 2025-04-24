
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { RideMap } from '@/components/RideMap';

interface MapSectionProps {
  pickupLocation: string;
  dropoffLocation: string;
}

export const MapSection: React.FC<MapSectionProps> = ({ pickupLocation, dropoffLocation }) => {
  return (
    <Card className="overflow-hidden border-slate-200 animate-fade-in">
      <CardContent className="p-6">
        <RideMap pickupLocation={pickupLocation} dropoffLocation={dropoffLocation} />
      </CardContent>
    </Card>
  );
};
