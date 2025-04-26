
import React from 'react';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import { ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-10"></div>
        
        <div className="container mx-auto px-4 py-20 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="space-y-8 animate-fade-in">
              <h1 className="text-5xl font-bold leading-tight animate-fade-in [--animation-delay:200ms]">
                Your Premium
                <span className="text-swift-400 block">Ride Service</span>
              </h1>
              
              <p className="text-xl text-slate-300 max-w-lg animate-fade-in [--animation-delay:400ms]">
                Experience luxury and comfort with our premium ride service. 
                Book your ride now and travel in style.
              </p>
              
              <div className="flex gap-4 pt-4 animate-fade-in [--animation-delay:600ms]">
                <Button 
                  size="lg"
                  onClick={() => navigate('/book')}
                  className="bg-swift-600 hover:bg-swift-700 text-white"
                >
                  Book a Ride
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/support')}
                  className="text-white border-white hover:bg-white/10"
                >
                  Contact Support
                </Button>
              </div>
            </div>
            
            {/* Hero Image/Stats */}
            <div className="relative animate-slide-in-right lg:block">
              <div className="bg-gradient-to-r from-swift-500/20 to-swift-600/20 rounded-3xl p-8">
                <div className="grid grid-cols-2 gap-8">
                  <div className="text-center animate-fade-in [--animation-delay:800ms]">
                    <div className="text-4xl font-bold text-swift-400">24/7</div>
                    <div className="text-slate-300 mt-2">Available</div>
                  </div>
                  <div className="text-center animate-fade-in [--animation-delay:900ms]">
                    <div className="text-4xl font-bold text-swift-400">100+</div>
                    <div className="text-slate-300 mt-2">Premium Cars</div>
                  </div>
                  <div className="text-center animate-fade-in [--animation-delay:1000ms]">
                    <div className="text-4xl font-bold text-swift-400">500+</div>
                    <div className="text-slate-300 mt-2">Happy Clients</div>
                  </div>
                  <div className="text-center animate-fade-in [--animation-delay:1100ms]">
                    <div className="text-4xl font-bold text-swift-400">4.9</div>
                    <div className="text-slate-300 mt-2">Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="flex-1">
        <Dashboard />
      </main>
    </div>
  );
};

export default Index;
