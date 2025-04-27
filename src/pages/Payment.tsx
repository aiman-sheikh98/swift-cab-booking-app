
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from "sonner";
import Header from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PaymentAnimation } from '@/components/payment/PaymentAnimation';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

const Payment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isComplete, setIsComplete] = useState(false);
  const success = searchParams.get('success');
  const canceled = searchParams.get('canceled');
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const processPayment = async () => {
      try {
        // Handle successful payment
        if (success === 'true') {
          // Get booking details from localStorage
          const pendingBookingStr = localStorage.getItem('pendingBooking');
          if (!pendingBookingStr) {
            toast.error('Booking details not found');
            setTimeout(() => navigate('/book'), 2000);
            return;
          }

          const pendingBooking = JSON.parse(pendingBookingStr);

          // Create the ride in the database
          if (user) {
            // Use supabase edge function to verify payment and create ride
            const { data, error } = await supabase.functions.invoke('verify-payment', {
              body: {
                sessionId,
                userId: user.id,
                bookingDetails: pendingBooking
              }
            });

            if (error) {
              console.error('Error verifying payment:', error);
              toast.error('Failed to verify payment. Please contact support.');
              return;
            }

            // Clean up localStorage
            localStorage.removeItem('pendingBooking');
            
            setIsComplete(true);
            toast.success('Payment successful! Your ride has been booked.');
            
            // Redirect to rides page after successful payment
            setTimeout(() => navigate('/rides'), 1500);
          }
        } else if (canceled === 'true') {
          // Handle canceled payment
          toast.error('Payment was canceled. Your ride has not been booked.');
          setTimeout(() => navigate('/book'), 1500);
        }
      } catch (error) {
        console.error('Error processing payment:', error);
        toast.error('An error occurred processing your payment');
      }
    };

    processPayment();
  }, [success, canceled, sessionId, navigate, user]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-16 flex items-center justify-center flex-1">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
          <div className="text-center">
            <div className="mb-6">
              <PaymentAnimation isComplete={isComplete} />
            </div>
            
            <h1 className="text-2xl font-bold mb-4">
              {isComplete 
                ? "Payment Successful!" 
                : canceled === 'true'
                  ? "Payment Canceled"
                  : "Processing Payment..."}
            </h1>
            
            <p className="text-gray-600">
              {isComplete 
                ? "Your ride has been booked. Redirecting to your rides..." 
                : canceled === 'true'
                  ? "Your ride has not been booked. Redirecting back to booking page..."
                  : "Please wait while we process your payment..."}
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Payment;
