
import React, { useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";

const Payment = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: ''
  });
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setCardDetails(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // This is where you would normally integrate with Stripe
    // For demo purposes, we'll simulate payment processing
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success("Payment successful!");
      navigate('/rides');
    } catch (error) {
      toast.error("Payment processing failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Complete Payment</h1>
          <p className="text-slate-500 mb-8">Select your preferred payment method</p>
          
          <Card className="border-slate-200 animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-swift-600" />
                Payment Details
              </CardTitle>
              <CardDescription>
                Your payment information is encrypted and secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <RadioGroup 
                  value={paymentMethod} 
                  onValueChange={setPaymentMethod}
                  className="grid grid-cols-3 gap-4"
                >
                  <div>
                    <RadioGroupItem 
                      value="credit-card" 
                      id="credit-card" 
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="credit-card"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-swift-600 [&:has([data-state=checked])]:border-swift-600 cursor-pointer"
                    >
                      <svg className="h-6 w-6 mb-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                        <path d="M2 10H22" stroke="currentColor" strokeWidth="2"/>
                        <path d="M6 15H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      Credit Card
                    </Label>
                  </div>
                  
                  <div>
                    <RadioGroupItem 
                      value="paypal" 
                      id="paypal" 
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="paypal"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer peer-data-[state=checked]:border-swift-600 [&:has([data-state=checked])]:border-swift-600"
                    >
                      <svg className="h-6 w-6 mb-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.891 7.78C19.891 9.3709 19.1575 10.8538 17.9536 11.72C16.655 12.6623 14.9512 13 13.1642 13H11.9603C11.6921 13 11.4665 13.1854 11.3889 13.4438L10 18.9697H6.7145C6.3301 18.9697 6.0405 18.6327 6.0834 18.2513L8.2415 3.77643C8.30367 3.31983 8.7029 2.98291 9.16591 2.98291H14.0297C16.0386 2.98291 17.5767 3.35439 18.5499 4.08024C19.4516 4.75815 19.891 6.03339 19.891 7.78Z" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      PayPal
                    </Label>
                  </div>
                  
                  <div>
                    <RadioGroupItem 
                      value="upi" 
                      id="upi" 
                      className="peer sr-only" 
                    />
                    <Label
                      htmlFor="upi"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer peer-data-[state=checked]:border-swift-600 [&:has([data-state=checked])]:border-swift-600"
                    >
                      <svg className="h-6 w-6 mb-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                        <path d="M7.5 8.5L16.5 15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M16.5 8.5L7.5 15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      UPI
                    </Label>
                  </div>
                </RadioGroup>

                {paymentMethod === 'credit-card' && (
                  <div className="space-y-4 mt-6 animate-fade-in">
                    <div className="space-y-2">
                      <Label htmlFor="number">Card Number</Label>
                      <Input 
                        id="number"
                        placeholder="1234 5678 9012 3456"
                        value={cardDetails.number}
                        onChange={handleInputChange}
                        maxLength={19}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name">Cardholder Name</Label>
                      <Input 
                        id="name"
                        placeholder="John Smith"
                        value={cardDetails.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input 
                          id="expiry"
                          placeholder="MM/YY"
                          value={cardDetails.expiry}
                          onChange={handleInputChange}
                          maxLength={5}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <Input 
                          id="cvc"
                          placeholder="123"
                          value={cardDetails.cvc}
                          onChange={handleInputChange}
                          maxLength={3}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'paypal' && (
                  <div className="space-y-4 mt-6 animate-fade-in">
                    <div className="rounded-lg bg-blue-50 p-4 text-center">
                      <p className="text-blue-800 mb-4">You'll be redirected to PayPal to complete your payment securely.</p>
                      <div className="flex justify-center">
                        <img src="https://www.paypalobjects.com/webstatic/en_US/i/buttons/PP_logo_h_100x26.png" alt="PayPal" className="h-8" />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'upi' && (
                  <div className="space-y-4 mt-6 animate-fade-in">
                    <div className="space-y-2">
                      <Label htmlFor="upiId">UPI ID</Label>
                      <Input 
                        id="upiId"
                        placeholder="yourname@upi"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        required
                      />
                      <p className="text-sm text-muted-foreground">Enter your UPI ID (e.g. name@bank)</p>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map(app => (
                        <div key={app} className="flex flex-col items-center p-3 border rounded-md">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-1">
                            <span className="text-xs">{app.charAt(0)}</span>
                          </div>
                          <span className="text-xs">{app}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </form>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSubmit} 
                className="w-full bg-swift-600 hover:bg-swift-700"
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : `Pay Now`}
              </Button>
            </CardFooter>
          </Card>
          
          <div className="mt-6 text-center text-xs text-slate-500">
            <p>Payment processing is handled securely</p>
            <p className="mt-2">This is a demo application. No real payments are processed.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
