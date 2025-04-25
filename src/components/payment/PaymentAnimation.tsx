
import React from 'react';
import { LoaderCircle, BadgeCheck } from 'lucide-react';

interface PaymentAnimationProps {
  isComplete: boolean;
}

export const PaymentAnimation: React.FC<PaymentAnimationProps> = ({ isComplete }) => {
  return (
    <div className="flex items-center justify-center">
      {!isComplete ? (
        <LoaderCircle className="animate-spin text-swift-600 h-8 w-8" />
      ) : (
        <BadgeCheck className="text-green-500 h-8 w-8 animate-scale-in" />
      )}
    </div>
  );
};
