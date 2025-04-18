
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="w-full px-6 md:px-20 flex-1 flex flex-col items-center justify-center relative">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[800px] h-[800px] rounded-full bg-automate-purple/5 border border-automate-purple/10 animate-pulse"></div>
      </div>
      
      <h1 className="text-4xl md:text-6xl font-bold text-center mb-6 z-10 max-w-4xl bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
        Automate Your Workflow with AutoMate Pro
      </h1>
      
      <p className="text-xl text-gray-400 text-center mb-10 z-10 max-w-2xl">
        Streamline your tasks, save time, and boost productivity
      </p>
      
      <div className="flex flex-col md:flex-row gap-4 z-10">
        <Link to="/dashboard">
          <Button className="bg-automate-purple hover:bg-automate-purple-light text-white px-8 py-6 text-lg transition-all duration-300 hover:scale-105">
            Get Started
            <ChevronRight className="ml-2" />
          </Button>
        </Link>
        
        <Button variant="outline" className="border-automate-purple/50 text-white hover:bg-automate-purple/10 px-8 py-6 text-lg transition-all duration-300 hover:scale-105">
          Learn More
        </Button>
      </div>
    </section>
  );
};

export default Hero;
