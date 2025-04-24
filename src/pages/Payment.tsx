
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

const Payment = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: ''
  });
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
      
      toast.success("Payment method added successfully!");
      navigate('/book');
    } catch (error) {
      toast.error("Payment processing failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // In a real app, this would be connected to Stripe Elements
  // For simplicity, we're using basic form inputs
  
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Payment Methods</h1>
          <p className="text-slate-500 mb-8">Add or manage your payment options</p>
          
          <Card className="border-slate-200 animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-swift-600" />
                Add Payment Method
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
                      disabled
                    />
                    <Label
                      htmlFor="paypal"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer opacity-50"
                    >
                      <svg className="h-6 w-6 mb-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.891 7.78C19.891 9.3709 19.1575 10.8538 17.9536 11.72C16.655 12.6623 14.9512 13 13.1642 13H11.9603C11.6921 13 11.4665 13.1854 11.3889 13.4438L10 18.9697H6.7145C6.3301 18.9697 6.0405 18.6327 6.0834 18.2513L8.2415 3.77643C8.30367 3.31983 8.7029 2.98291 9.16591 2.98291H14.0297C16.0386 2.98291 17.5767 3.35439 18.5499 4.08024C19.4516 4.75815 19.891 6.03339 19.891 7.78Z" stroke="currentColor" strokeWidth="2"/>
                        <path d="M17.9977 8.78C17.9977 10.3709 17.2642 11.8538 16.0603 12.72C14.7617 13.6623 13.0579 14 11.2709 14H10.067C9.79879 14 9.57319 14.1854 9.4956 14.4438L8.1067 19.9697H4.8212C4.4368 19.9697 4.1472 19.6327 4.1901 19.2513L6.3482 4.77643C6.41037 4.31983 6.8096 3.98291 7.27261 3.98291H12.1364C14.1453 3.98291 15.6834 4.35439 16.6566 5.08024C17.5583 5.75815 17.9977 7.03339 17.9977 8.78Z" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      PayPal
                    </Label>
                  </div>
                  
                  <div>
                    <RadioGroupItem 
                      value="apple-pay" 
                      id="apple-pay" 
                      className="peer sr-only" 
                      disabled
                    />
                    <Label
                      htmlFor="apple-pay"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer opacity-50"
                    >
                      <svg className="h-6 w-6 mb-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.04 12.3828C17.0176 10.5664 18.4922 9.67969 18.5508 9.64062C17.7266 8.44531 16.4805 8.28125 16.043 8.26562C14.9648 8.15625 13.9219 8.89062 13.3711 8.89062C12.8047 8.89062 11.9531 8.27344 11.0586 8.29688C9.9102 8.32031 8.84766 8.95312 8.25 9.9375C7.01562 11.9297 7.91016 14.9141 9.09766 16.6875C9.69531 17.5547 10.3984 18.5273 11.3164 18.4844C12.2109 18.4375 12.5625 17.9102 13.6406 17.9102C14.7188 17.9102 15.0469 18.4844 15.9805 18.457C16.9375 18.4375 17.5469 17.5703 18.1328 16.6953C18.8086 15.6992 19.0859 14.7188 19.1016 14.6836C19.0859 14.6719 17.0664 13.9336 17.04 12.3828Z" stroke="currentColor" strokeWidth="2"/>
                        <path d="M15.5859 7.03125C16.0703 6.4375 16.3984 5.64062 16.3125 4.82812C15.6367 4.85938 14.7852 5.29688 14.2773 5.87109C13.8281 6.37109 13.4336 7.19531 13.5352 7.97656C14.291 8.04297 15.0859 7.61328 15.5859 7.03125Z" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      Apple Pay
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
              </form>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSubmit} 
                className="w-full bg-swift-600 hover:bg-swift-700"
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Add Payment Method"}
              </Button>
            </CardFooter>
          </Card>
          
          <div className="mt-6 text-center text-xs text-slate-500">
            <p>Payment processing is handled securely by Stripe</p>
            <p className="mt-2">This is a demo application. No real payments are processed.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
