
import React from 'react';
import { RIDE_PRICING } from '@/config/pricing';

interface PriceSummaryProps {
  vehicleType: 'economy' | 'standard' | 'premium';
  distance?: number; // in kilometers
}

export const PriceSummary: React.FC<PriceSummaryProps> = ({ 
  vehicleType,
  distance = 10 // default distance for demo
}) => {
  const pricing = RIDE_PRICING[vehicleType];
  const baseFare = pricing.basePrice;
  const distanceFare = pricing.pricePerKm * distance;
  const serviceFee = Math.round(baseFare * 0.1); // 10% service fee
  const total = baseFare + distanceFare + serviceFee;

  return (
    <div className="pt-4">
      <div className="flex justify-between text-sm mb-2">
        <span className="text-slate-500">Base fare</span>
        <span className="font-medium">${baseFare.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-sm mb-2">
        <span className="text-slate-500">Distance (est. {distance}km)</span>
        <span className="font-medium">${distanceFare.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-sm mb-4">
        <span className="text-slate-500">Service fee</span>
        <span className="font-medium">${serviceFee.toFixed(2)}</span>
      </div>
      <div className="flex justify-between font-medium border-t border-slate-200 pt-4">
        <span>Total</span>
        <span className="text-lg">${total.toFixed(2)}</span>
      </div>
    </div>
  );
};
