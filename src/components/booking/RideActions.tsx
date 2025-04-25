
import React from 'react';
import { Button } from "@/components/ui/button";
import { Calendar, X, Check } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { RideStatus } from '@/hooks/use-rides';

interface RideActionsProps {
  rideId: string;
  status: RideStatus;
  onCancel: (rideId: string) => Promise<void>;
  onSchedule?: (rideId: string) => void;
}

export const RideActions = ({ rideId, status, onCancel, onSchedule }: RideActionsProps) => {
  const navigate = useNavigate();

  const handlePayment = async () => {
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("Payment successful! Enjoy your ride!", {
        duration: 3000,
      });
      navigate('/');
    } catch (error) {
      toast.error("Payment failed. Please try again.");
    }
  };

  return (
    <div className="flex gap-2 mt-4">
      {status === 'scheduled' && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" className="flex items-center">
              <X className="h-4 w-4 mr-2" />
              Cancel Ride
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel this ride?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to cancel your ride? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep Ride</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => onCancel(rideId)}
                className="bg-red-600 hover:bg-red-700"
              >
                Yes, Cancel Ride
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {status === 'scheduled' && (
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center border-swift-600 text-swift-600 hover:bg-swift-50"
          onClick={() => onSchedule?.(rideId)}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Reschedule
        </Button>
      )}

      {status === 'scheduled' && (
        <Button 
          size="sm"
          className="flex items-center bg-swift-600 hover:bg-swift-700 ml-auto"
          onClick={handlePayment}
        >
          <Check className="h-4 w-4 mr-2" />
          Process Payment
        </Button>
      )}
    </div>
  );
};
