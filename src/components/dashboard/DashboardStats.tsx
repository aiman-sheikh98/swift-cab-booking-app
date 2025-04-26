
import React from 'react';
import { Car } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Ride } from '@/hooks/use-rides';

interface DashboardStatsProps {
  rides: Ride[];
}

const DashboardStats = ({ rides }: DashboardStatsProps) => {
  const totalRides = rides.length;
  const completedRides = rides.filter(ride => ride.status === 'completed').length;
  const scheduledRides = rides.filter(ride => ride.status === 'scheduled').length;
  const cancelledRides = rides.filter(ride => ride.status === 'cancelled').length;

  const stats = [
    { icon: <Car className="h-6 w-6 text-swift-600" />, title: "Total Rides", value: totalRides, color: "bg-swift-100" },
    { icon: <Car className="h-6 w-6 text-green-600" />, title: "Completed", value: completedRides, color: "bg-green-100" },
    { icon: <Car className="h-6 w-6 text-blue-600" />, title: "Scheduled", value: scheduledRides, color: "bg-blue-100" },
    { icon: <Car className="h-6 w-6 text-red-600" />, title: "Cancelled", value: cancelledRides, color: "bg-red-100" }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <motion.div 
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <Card className="h-full">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`rounded-full ${stat.color} p-3`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardStats;
