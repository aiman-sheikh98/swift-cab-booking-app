
import React from 'react';
import { Card } from "@/components/ui/card";

interface RideMapProps {
  pickupLocation: string;
  dropoffLocation: string;
}

export const RideMap: React.FC<RideMapProps> = ({ pickupLocation, dropoffLocation }) => {
  // In a real-world app, this would integrate with a mapping API like Google Maps or Mapbox
  return (
    <div className="relative w-full h-[300px] rounded-md overflow-hidden bg-slate-100">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-90" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=1000')" }} />
      
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
      
      {/* Simple route visualization */}
      {(pickupLocation && dropoffLocation) && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5">
          <div className="flex items-center justify-between gap-4">
            <div className="bg-white p-3 rounded-full shadow-lg">
              <div className="h-3 w-3 bg-swift-600 rounded-full" />
            </div>
            <div className="h-0.5 flex-1 bg-white relative">
              <div className="animate-pulse absolute top-1/2 left-0 transform -translate-y-1/2 h-2 w-2 bg-swift-600 rounded-full"
                style={{ left: '30%', animationDelay: '0.2s' }} />
              <div className="animate-pulse absolute top-1/2 left-0 transform -translate-y-1/2 h-2 w-2 bg-swift-600 rounded-full"
                style={{ left: '60%', animationDelay: '0.5s' }} />
            </div>
            <div className="bg-white p-3 rounded-full shadow-lg">
              <div className="h-3 w-3 bg-swift-800 rounded-full" />
            </div>
          </div>

          <div className="flex justify-between mt-4 text-white">
            <div className="bg-black/50 px-3 py-1 rounded-md text-xs max-w-[45%] truncate">
              {pickupLocation || "Pickup location"}
            </div>
            <div className="bg-black/50 px-3 py-1 rounded-md text-xs max-w-[45%] truncate">
              {dropoffLocation || "Dropoff location"}
            </div>
          </div>
        </div>
      )}

      {!pickupLocation && !dropoffLocation && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-white bg-black/50 px-4 py-2 rounded-md">Enter pickup and dropoff locations</p>
        </div>
      )}
    </div>
  );
};
