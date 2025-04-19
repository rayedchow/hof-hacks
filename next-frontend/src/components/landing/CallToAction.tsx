
import React from 'react';
import { Button } from '@/components/ui/button';
import { LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

const CallToAction = () => {
  return (
    <section className="w-full py-20 px-6 md:px-12 bg-automate-dark-gray">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to transform your workflow?</h2>
        <p className="text-xl text-gray-400 mb-8">
          Join thousands of teams using AutoMate Pro to streamline their processes
        </p>
        
        <Link href="/dashboard">
          <Button className="bg-automate-purple hover:bg-automate-purple-light text-white px-8 py-6 text-lg">
            Go to Dashboard
            <LayoutDashboard className="ml-2" />
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default CallToAction;
