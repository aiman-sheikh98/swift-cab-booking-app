
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Clock, Car } from "lucide-react";
import { RideActions } from './booking/RideActions';
import { motion } from "framer-motion";
import { RIDE_PRICING } from '@/config/pricing';

export type RideStatus = 'scheduled' | 'completed' | 'cancelled' | 'in-progress';

const statusConfig = {
  'scheduled': { color: 'bg-blue-100 text-blue-800 hover:bg-blue-100', label: 'Scheduled' },
  'completed': { color: 'bg-green-100 text-green-800 hover:bg-green-100', label: 'Completed' },
  'cancelled': { color: 'bg-red-100 text-red-800 hover:bg-red-100', label: 'Cancelled' },
  'in-progress': { color: 'bg-amber-100 text-amber-800 hover:bg-amber-100', label: 'In Progress' }
};

interface RideCardProps {
  id: string;
  pickupLocation: string;
  dropoffLocation: string;
  date: string;
  time: string;
  status: RideStatus;
  vehicleType?: 'economy' | 'standard' | 'premium';
  price?: number;
  onCancel?: (rideId: string) => Promise<void>;
  onSchedule?: (rideId: string) => void;
}

const RideCard = ({ 
  id, 
  pickupLocation, 
  dropoffLocation, 
  date, 
  time, 
  status,
  vehicleType = 'standard',
  price,
  onCancel,
  onSchedule 
}: RideCardProps) => {
  const statusInfo = statusConfig[status];
  const pricing = RIDE_PRICING[vehicleType];
  const displayPrice = price || pricing.minPrice;
  
  return (
    <Card className="hover:shadow-md transition-all duration-300 border-slate-200 hover:border-swift-200 group">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex items-center">
                <Car className="h-4 w-4 mr-2 text-swift-600" />
                <h3 className="font-medium text-slate-900">Ride #{id}</h3>
              </div>
              <div className="flex items-center text-sm text-slate-500">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{date}</span>
                <span className="mx-1">•</span>
                <Clock className="h-4 w-4 mr-1" />
                <span>{time}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-swift-600 mr-2 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500 font-medium">PICKUP</p>
                  <p className="text-sm text-slate-700">{pickupLocation}</p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute left-2.5 top-0 h-full">
                  <div className="h-full w-0.5 bg-slate-200 mx-auto"></div>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-swift-800 mr-2 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500 font-medium">DROP-OFF</p>
                  <p className="text-sm text-slate-700">{dropoffLocation}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge 
              variant="outline" 
              className={`${statusInfo.color} border-none whitespace-nowrap transition-transform group-hover:scale-110`}
            >
              {statusInfo.label}
            </Badge>
            <span className="text-lg font-semibold text-swift-600">
              ${displayPrice?.toFixed(2)}
            </span>
          </div>
        </div>
        
        {status === 'in-progress' && (
          <div className="mt-4">
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-swift-600 h-1.5 rounded-full animate-pulse" style={{width: '60%'}}></div>
            </div>
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>On the way</span>
              <span>Arriving soon</span>
            </div>
          </div>
        )}

        {(onCancel || onSchedule) && status === 'scheduled' && (
          <RideActions
            rideId={id}
            status={status}
            onCancel={onCancel}
            onSchedule={onSchedule}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default RideCard;
