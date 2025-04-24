import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Car, Menu, X, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Successfully signed out');
      navigate('/auth');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleAuthClick = () => {
    navigate('/auth');
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and name */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Car className="h-8 w-8 text-swift-600" />
              <span className="text-2xl font-bold text-slate-900">Swift</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-slate-700 hover:text-swift-600 font-medium">
              Dashboard
            </Link>
            <Link to="/rides" className="text-slate-700 hover:text-swift-600 font-medium">
              My Rides
            </Link>
            <Link to="/book" className="text-slate-700 hover:text-swift-600 font-medium">
              Book a Ride
            </Link>
            <Link to="/support" className="text-slate-700 hover:text-swift-600 font-medium">
              Support
            </Link>
            {user ? (
              <Button 
                onClick={handleSignOut}
                variant="outline"
                className="text-swift-600 border-swift-600 hover:bg-swift-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            ) : (
              <Button 
                onClick={handleAuthClick}
                className="bg-swift-600 hover:bg-swift-700 text-white"
              >
                Sign In
              </Button>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isMenuOpen ? (
                <X className="h-6 w-6 text-slate-700" />
              ) : (
                <Menu className="h-6 w-6 text-slate-700" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-2 px-2 space-y-2">
            <Link 
              to="/" 
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-swift-50 hover:text-swift-600"
              onClick={toggleMenu}
            >
              Dashboard
            </Link>
            <Link 
              to="/rides" 
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-swift-50 hover:text-swift-600"
              onClick={toggleMenu}
            >
              My Rides
            </Link>
            <Link 
              to="/book" 
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-swift-50 hover:text-swift-600"
              onClick={toggleMenu}
            >
              Book a Ride
            </Link>
            <Link 
              to="/support" 
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-swift-50 hover:text-swift-600"
              onClick={toggleMenu}
            >
              Support
            </Link>
            {user ? (
              <Button 
                onClick={handleSignOut}
                variant="outline"
                className="w-full text-swift-600 border-swift-600 hover:bg-swift-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            ) : (
              <Button 
                onClick={handleAuthClick}
                className="w-full bg-swift-600 hover:bg-swift-700 text-white"
              >
                Sign In
              </Button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
