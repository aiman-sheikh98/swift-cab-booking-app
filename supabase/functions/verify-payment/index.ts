
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sessionId, userId, bookingDetails } = await req.json();
    
    if (!sessionId || !userId || !bookingDetails) {
      return new Response(
        JSON.stringify({ error: "Missing required verification data" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Verify the payment session
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    // Check if payment was successful
    if (session.payment_status !== "paid") {
      return new Response(
        JSON.stringify({ 
          error: "Payment not completed", 
          paymentStatus: session.payment_status 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Initialize Supabase client with service role key for admin access
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
      {
        auth: {
          persistSession: false,
        }
      }
    );

    // Generate a unique ID for the ride
    const rideId = crypto.randomUUID().substring(0, 8);
    
    // Extract booking details
    const { 
      pickupLocation, 
      dropoffLocation, 
      date, 
      time, 
      vehicleType, 
      price 
    } = bookingDetails;

    // Create a new ride record in the database
    const { data: ride, error } = await supabaseAdmin
      .from("rides")
      .insert({
        id: rideId,
        user_id: userId,
        pickup_location: pickupLocation,
        dropoff_location: dropoffLocation,
        date: date,
        time: time,
        status: "scheduled",
        vehicle_type: vehicleType,
        price: price,
        payment_status: "paid",
        payment_id: sessionId,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      throw new Error(`Failed to create ride record: ${error.message}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Payment verified and ride created",
        ride: ride
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Verification error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
