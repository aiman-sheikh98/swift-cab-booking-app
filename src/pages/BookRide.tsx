
import React, { useState } from 'react';
import Header from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BookingDetailsCard } from '@/components/booking/BookingDetailsCard';
import { MapSection } from '@/components/booking/MapSection';
import { VehicleSelectionCard } from '@/components/booking/VehicleSelectionCard';

const BookRide = () => {
  const [vehicleType, setVehicleType] = useState('standard');
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');

  const handleLocationChange = (type: 'pickup' | 'dropoff', value: string) => {
    if (type === 'pickup') {
      setPickupLocation(value);
    } else {
      setDropoffLocation(value);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Book a Ride</h1>
              <p className="text-slate-500">Fill in the details to schedule your ride</p>
            </div>

            <MapSection 
              pickupLocation={pickupLocation} 
              dropoffLocation={dropoffLocation} 
            />

            <VehicleSelectionCard 
              selectedVehicle={vehicleType} 
              onSelect={setVehicleType} 
            />
          </div>

          <div className="lg:col-span-1">
            <BookingDetailsCard 
              vehicleType={vehicleType}
              onLocationChange={handleLocationChange}
              pickupLocation={pickupLocation}
              dropoffLocation={dropoffLocation}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookRide;
