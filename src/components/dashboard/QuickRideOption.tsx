
import React from 'react';
import { motion } from "framer-motion";

interface QuickRideOptionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

const QuickRideOption = ({ icon, title, description, onClick }: QuickRideOptionProps) => (
  <motion.div 
    className="relative group cursor-pointer"
    onClick={onClick}
    whileHover={{ scale: 1.03 }}
    transition={{ duration: 0.2 }}
  >
    <div className="absolute -inset-0.5 bg-gradient-to-r from-swift-500 to-swift-300 rounded-lg blur opacity-25 group-hover:opacity-70 transition duration-300"></div>
    <div className="relative bg-white p-6 rounded-lg border border-slate-200 group-hover:shadow-lg transition-all duration-300">
      <div className="flex items-center gap-4">
        <div className="rounded-full bg-swift-50 p-3 text-swift-600 group-hover:bg-swift-100 transition-colors">
          {icon}
        </div>
        <div>
          <h3 className="font-medium text-lg text-slate-900">{title}</h3>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
      </div>
    </div>
  </motion.div>
);

export default QuickRideOption;
