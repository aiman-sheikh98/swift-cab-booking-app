
import React from 'react';
import Header from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Mail, MessageCircle, HelpCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Support = () => {
  const handleEmailSupport = () => {
    window.location.href = 'mailto:support@swiftride.com';
    toast.success('Opening email client...');
  };

  const supportOptions = [
    {
      title: 'Email Support',
      description: 'Send us an email and we\'ll get back to you within 24 hours',
      icon: Mail,
      action: handleEmailSupport,
      buttonText: 'Send Email'
    },
    {
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      icon: MessageCircle,
      action: () => toast.info('Live chat feature coming soon!'),
      buttonText: 'Start Chat'
    },
    {
      title: 'Help Center',
      description: 'Browse our knowledge base and FAQs',
      icon: HelpCircle,
      action: () => toast.info('Help center feature coming soon!'),
      buttonText: 'View Help'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Support Center</h1>
            <p className="text-slate-600 text-lg">
              Need help? Choose from the options below to get in touch with our support team.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {supportOptions.map((option) => (
              <div
                key={option.title}
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 animate-fade-in flex flex-col items-center text-center"
              >
                <div className="mb-4 p-3 bg-swift-50 rounded-full">
                  <option.icon className="w-8 h-8 text-swift-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-900">{option.title}</h3>
                <p className="text-slate-500 mb-6">{option.description}</p>
                <Button
                  onClick={option.action}
                  className="bg-swift-600 hover:bg-swift-700 text-white mt-auto"
                >
                  <option.icon className="w-4 h-4 mr-2" />
                  {option.buttonText}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Support;
