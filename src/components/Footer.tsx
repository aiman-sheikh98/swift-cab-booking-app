
import React from 'react';
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Footer = () => {
  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  ];

  return (
    <footer className="w-full bg-gradient-to-r from-slate-900 to-slate-800 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Logo and Company Info */}
          <div className="flex flex-col items-center md:items-start animate-fade-in">
            <h2 className="text-3xl font-bold text-swift-500 mb-2">SwiftRide</h2>
            <p className="text-slate-400 max-w-md text-center md:text-left">
              Your premium ride-hailing service. Available 24/7 for your convenience.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex gap-6 animate-fade-in [--animation-delay:200ms]">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "transform transition-all duration-300 hover:scale-110",
                  "hover:text-swift-400 p-2 rounded-full",
                  "bg-slate-800/50 hover:bg-slate-700/50"
                )}
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-4 border-t border-slate-700/50 text-center animate-fade-in [--animation-delay:400ms]">
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} SwiftRide. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
