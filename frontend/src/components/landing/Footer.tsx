
import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full py-8 px-6 md:px-12 bg-automate-black border-t border-gray-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="w-8 h-8 rounded-md bg-automate-purple flex items-center justify-center mr-2">
            <span className="font-bold text-white text-sm">AP</span>
          </div>
          <span className="font-bold">AutoMate Pro</span>
        </div>
        
        <div className="flex space-x-6 text-sm">
          <a href="#" className="text-white hover:text-automate-purple-light">Privacy Policy</a>
          <a href="#" className="text-white hover:text-automate-purple-light">Terms of Service</a>
        </div>
        
        <div className="text-sm text-gray-400 mt-4 md:mt-0">
          © 2025 AutoMate Pro. All rights reserved.
        </div>
      </div>
      
      <div className="w-full mt-8 flex justify-center">
        <div className="h-1 w-32 bg-gradient-to-r from-automate-purple to-automate-purple-light rounded-full"></div>
      </div>
    </footer>
  );
};

export default Footer;
