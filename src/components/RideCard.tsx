
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Clock } from "lucide-react";

export type RideStatus = 'scheduled' | 'completed' | 'cancelled' | 'in-progress';

interface RideCardProps {
  id: string;
  pickupLocation: string;
  dropoffLocation: string;
  date: string;
  time: string;
  status: RideStatus;
}

const statusConfig = {
  'scheduled': { color: 'bg-blue-100 text-blue-800 hover:bg-blue-100', label: 'Scheduled' },
  'completed': { color: 'bg-green-100 text-green-800 hover:bg-green-100', label: 'Completed' },
  'cancelled': { color: 'bg-red-100 text-red-800 hover:bg-red-100', label: 'Cancelled' },
  'in-progress': { color: 'bg-amber-100 text-amber-800 hover:bg-amber-100', label: 'In Progress' }
};

const RideCard = ({ id, pickupLocation, dropoffLocation, date, time, status }: RideCardProps) => {
  const statusInfo = statusConfig[status];
  
  return (
    <Card className="hover:shadow-md transition-shadow duration-300 cursor-pointer border-slate-200">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="space-y-3">
            <div className="space-y-1">
              <h3 className="font-medium text-slate-900">Ride #{id}</h3>
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
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-swift-800 mr-2 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500 font-medium">DROP-OFF</p>
                  <p className="text-sm text-slate-700">{dropoffLocation}</p>
                </div>
              </div>
            </div>
          </div>
          
          <Badge 
            variant="outline" 
            className={`${statusInfo.color} border-none whitespace-nowrap`}
          >
            {statusInfo.label}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default RideCard;
