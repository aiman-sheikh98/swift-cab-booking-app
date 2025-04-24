
import React from 'react';

export const PriceSummary: React.FC = () => {
  return (
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
  );
};
