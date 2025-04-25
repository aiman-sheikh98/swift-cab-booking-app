
import React from 'react';
import { Button } from "@/components/ui/button";
import { Calendar, X } from "lucide-react";
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
import { RideStatus } from '@/hooks/use-rides';

interface RideActionsProps {
  rideId: string;
  status: RideStatus;
  onCancel: (rideId: string) => Promise<void>;
  onSchedule?: (rideId: string) => void;
}

export const RideActions = ({ rideId, status, onCancel, onSchedule }: RideActionsProps) => {
  const handleCancel = async () => {
    try {
      await onCancel(rideId);
      toast.success("Ride cancelled successfully");
    } catch (error) {
      toast.error("Failed to cancel ride");
    }
  };

  const handleReschedule = () => {
    onSchedule?.(rideId);
    toast.success("Rescheduling initiated");
  };

  if (status !== 'scheduled') return null;

  return (
    <div className="flex gap-2 mt-4">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
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
              onClick={handleCancel}
              className="bg-red-600 hover:bg-red-700"
            >
              Yes, Cancel Ride
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Button 
        variant="outline" 
        size="sm"
        onClick={handleReschedule}
        className="border-swift-600 text-swift-600 hover:bg-swift-50"
      >
        <Calendar className="h-4 w-4 mr-2" />
        Reschedule
      </Button>
    </div>
  );
};
