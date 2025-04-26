
import React from 'react';
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface VehicleOption {
  id: string;
  name: string;
  image: string;
  description: string;
  price: string;
  eta: string;
}

interface VehicleCarouselProps {
  selectedVehicle: string;
  onSelect: (vehicleId: string) => void;
}

export const VehicleCarousel: React.FC<VehicleCarouselProps> = ({ selectedVehicle, onSelect }) => {
  const vehicles: VehicleOption[] = [
    {
      id: 'economy',
      name: 'Economy',
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=500',
      description: 'Affordable, compact cars for everyday rides',
      price: 'From $15',
      eta: '3 min away'
    },
    {
      id: 'standard',
      name: 'Standard',
      image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=500',
      description: 'Comfortable sedans with extra space',
      price: 'From $25',
      eta: '5 min away'
    },
    {
      id: 'premium',
      name: 'Premium',
      image: 'https://images.unsplash.com/photo-1580274455191-1c62238fa333?q=80&w=500',
      description: 'Luxury vehicles with premium features',
      price: 'From $40',
      eta: '8 min away'
    },
    {
      id: 'superbike',
      name: 'Superbike',
      image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=500',
      description: 'High-performance motorcycles for thrilling rides',
      price: 'From $35',
      eta: '2 min away'
    }
  ];

  return (
    <Carousel className="w-full">
      <CarouselContent>
        {vehicles.map((vehicle) => (
          <CarouselItem key={vehicle.id} className="md:basis-1/2 lg:basis-1/3">
            <Card 
              className={`cursor-pointer transition-all duration-300 overflow-hidden h-full border-2
                ${selectedVehicle === vehicle.id 
                  ? 'border-swift-600 shadow-md scale-[1.02]' 
                  : 'border-transparent hover:border-slate-200'}`}
              onClick={() => onSelect(vehicle.id)}
            >
              <div className="relative aspect-[4/3]">
                <img 
                  src={vehicle.image} 
                  alt={vehicle.name} 
                  className="object-cover w-full h-full"
                />
                {selectedVehicle === vehicle.id && (
                  <div className="absolute top-2 right-2 bg-swift-600 text-white text-xs px-2 py-1 rounded-full">
                    Selected
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{vehicle.name}</h3>
                <p className="text-sm text-slate-500">{vehicle.description}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-swift-800 font-medium">{vehicle.price}</span>
                  <span className="text-xs text-slate-500">{vehicle.eta}</span>
                </div>
              </div>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="flex justify-center mt-4">
        <CarouselPrevious className="relative static left-0 translate-y-0 mr-2" />
        <CarouselNext className="relative static right-0 translate-y-0 ml-2" />
      </div>
    </Carousel>
  );
};

