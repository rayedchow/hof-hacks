
import React from 'react';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="w-full py-4 px-6 md:px-12 flex items-center justify-between">
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-md bg-automate-purple flex items-center justify-center mr-3">
          <span className="font-bold text-white">AP</span>
        </div>
        <h1 className="font-bold text-xl automate-gradient-text hidden md:block">Algora</h1>
      </div>
      
      <nav className="hidden md:flex items-center space-x-6">
        <a href="#" className="text-white hover:text-automate-purple-light transition-colors">Home</a>
        <a href="#features" className="text-white hover:text-automate-purple-light transition-colors">Features</a>
        <a href="#" className="text-white hover:text-automate-purple-light transition-colors">Pricing</a>
        <a href="#" className="text-white hover:text-automate-purple-light transition-colors">Contact</a>
        <Button variant="ghost" className="text-white hover:text-automate-purple-light">
          Login
        </Button>
      </nav>
      
      <Button className="bg-automate-purple hover:bg-automate-purple-light md:hidden">
        Menu
      </Button>
      
      <span className="hidden md:block text-sm text-gray-400">Welcome to Algora</span>
    </header>
  );
};

export default Header;
