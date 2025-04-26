
import React from 'react';
import Header from '@/components/Header';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import RideCard, { RideStatus } from '@/components/RideCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Car } from "lucide-react";
import { useRides } from '@/hooks/use-rides';

const MyRides = () => {
  const navigate = useNavigate();
  const { rides, isLoading, error, updateRideStatus } = useRides();

  const handleCancelRide = async (rideId: string) => {
    await updateRideStatus(rideId, 'cancelled');
    toast.success(`Ride #${rideId} has been cancelled`);
  };

  const filteredRides = (status: RideStatus | 'all') => {
    if (status === 'all') return rides;
    return rides.filter(ride => ride.status === status);
  };

  if (error) {
    toast.error(error);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">My Rides</h1>
            <p className="text-slate-500">View your ride history and upcoming bookings</p>
          </div>
          <Button 
            className="mt-4 md:mt-0 bg-swift-600 hover:bg-swift-700 text-white"
            onClick={() => navigate('/book')}
          >
            <Car className="h-4 w-4 mr-2" />
            Book New Ride
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Rides</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
          
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-slate-500">Loading rides...</p>
            </div>
          ) : (
            <>
              <TabsContent value="all" className="animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredRides('all').map(ride => (
                    <RideCardWithActions key={ride.id} ride={ride} onCancel={handleCancelRide} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="scheduled" className="animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredRides('scheduled').length > 0 ? (
                    filteredRides('scheduled').map(ride => (
                      <RideCardWithActions key={ride.id} ride={ride} onCancel={handleCancelRide} />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <p className="text-slate-500">No scheduled rides found</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="in-progress" className="animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredRides('in-progress').length > 0 ? (
                    filteredRides('in-progress').map(ride => (
                      <RideCardWithActions key={ride.id} ride={ride} onCancel={handleCancelRide} showCancelAction={false} />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <p className="text-slate-500">No rides in progress</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="completed" className="animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredRides('completed').length > 0 ? (
                    filteredRides('completed').map(ride => (
                      <RideCardWithActions key={ride.id} ride={ride} onCancel={handleCancelRide} showCancelAction={false} />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <p className="text-slate-500">No completed rides</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="cancelled" className="animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredRides('cancelled').length > 0 ? (
                    filteredRides('cancelled').map(ride => (
                      <RideCardWithActions key={ride.id} ride={ride} onCancel={handleCancelRide} showCancelAction={false} />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <p className="text-slate-500">No cancelled rides</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
};

interface RideCardWithActionsProps {
  ride: {
    id: string;
    pickupLocation: string;
    dropoffLocation: string;
    date: string;
    time: string;
    status: RideStatus;
    vehicleType?: 'economy' | 'standard' | 'premium';
    price?: number;
  };
  onCancel: (rideId: string) => void;
  showCancelAction?: boolean;
}

const RideCardWithActions: React.FC<RideCardWithActionsProps> = ({ ride, onCancel, showCancelAction = true }) => {
  return (
    <div className="animate-fade-in">
      <RideCard
        id={ride.id}
        pickupLocation={ride.pickupLocation}
        dropoffLocation={ride.dropoffLocation}
        date={ride.date}
        time={ride.time}
        status={ride.status}
        vehicleType={ride.vehicleType}
        price={ride.price}
      />
      
      {showCancelAction && ride.status === 'scheduled' && (
        <div className="mt-2 flex justify-end">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
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
                  onClick={() => onCancel(ride.id)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Yes, Cancel Ride
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
};

export default MyRides;
