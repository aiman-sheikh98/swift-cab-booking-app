import React, { useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Clock, CreditCard, Car } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { RideMap } from '@/components/RideMap';
import { VehicleCarousel } from '@/components/VehicleCarousel';
import { useLocationSuggestions } from '@/hooks/use-location-suggestions';

const BookRide = () => {
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState('');
  const [vehicleType, setVehicleType] = useState('standard');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { getSuggestion, isLoading: isSuggestingLocation } = useLocationSuggestions();

  const handleLocationSuggestion = async (type: 'pickup' | 'dropoff', value: string) => {
    if (!value.trim()) return;

    const suggestion = await getSuggestion(value, type);
    if (suggestion) {
      if (type === 'pickup') {
        setPickupLocation(suggestion);
        toast.success("Pickup location suggested!");
      } else {
        setDropoffLocation(suggestion);
        toast.success("Dropoff location suggested!");
      }
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!pickupLocation || !dropoffLocation || !date || !time) {
      toast.error("Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    // Simulate API call
    try {
      // In a real app, this would be an API call to create a booking
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const rideId = Math.floor(1000 + Math.random() * 9000).toString();
      
      toast.success("Ride booked successfully!");
      navigate('/rides');
    } catch (error) {
      toast.error("Failed to book your ride. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Book a Ride</h1>
              <p className="text-slate-500">Fill in the details to schedule your ride</p>
            </div>

            <Card className="overflow-hidden border-slate-200 animate-fade-in">
              <CardContent className="p-6">
                <RideMap pickupLocation={pickupLocation} dropoffLocation={dropoffLocation} />
              </CardContent>
            </Card>

            <Card className="border-slate-200 animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Car className="h-5 w-5 mr-2 text-swift-600" />
                  Choose Your Ride
                </CardTitle>
              </CardHeader>
              <CardContent>
                <VehicleCarousel selectedVehicle={vehicleType} onSelect={setVehicleType} />
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="border-slate-200 shadow-md animate-fade-in">
              <CardHeader>
                <CardTitle className="text-xl">Ride Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBooking} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="pickup">Pickup Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input 
                        id="pickup"
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                        className="pl-10 pr-24"
                        placeholder="Enter pickup address"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-2"
                        onClick={() => handleLocationSuggestion('pickup', pickupLocation)}
                        disabled={isSuggestingLocation || !pickupLocation}
                      >
                        {isSuggestingLocation ? "Suggesting..." : "Suggest"}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dropoff">Dropoff Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input 
                        id="dropoff"
                        value={dropoffLocation}
                        onChange={(e) => setDropoffLocation(e.target.value)}
                        className="pl-10 pr-24"
                        placeholder="Enter destination"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-2"
                        onClick={() => handleLocationSuggestion('dropoff', dropoffLocation)}
                        disabled={isSuggestingLocation || !dropoffLocation}
                      >
                        {isSuggestingLocation ? "Suggesting..." : "Suggest"}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !date && "text-muted-foreground"
                            )}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="time">Time</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input 
                          id="time"
                          type="time" 
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vehicle-type">Vehicle Type</Label>
                    <Select value={vehicleType} onValueChange={setVehicleType}>
                      <SelectTrigger id="vehicle-type">
                        <SelectValue placeholder="Select vehicle type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="economy">Economy (Affordable)</SelectItem>
                        <SelectItem value="standard">Standard (Comfortable)</SelectItem>
                        <SelectItem value="premium">Premium (Luxurious)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

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
                </form>
              </CardContent>
              <CardFooter className="flex-col gap-4">
                <Button 
                  onClick={handleBooking} 
                  className="w-full bg-swift-600 hover:bg-swift-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Book Now"}
                </Button>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookRide;
