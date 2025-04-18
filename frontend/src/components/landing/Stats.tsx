
import React from 'react';

interface StatCardProps {
  number: string;
  label: string;
}

const StatCard = ({ number, label }: StatCardProps) => (
  <div className="text-center p-6 bg-automate-black border border-gray-800 rounded-lg">
    <div className="text-4xl font-bold text-automate-purple mb-2">{number}</div>
    <div className="text-gray-400">{label}</div>
  </div>
);

const Stats = () => {
  return (
    <section className="w-full py-16 px-6 md:px-12 bg-[#1A1A22]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard number="10,000+" label="Jobs Automated" />
        <StatCard number="50%" label="Time Saved" />
        <StatCard number="99.9%" label="Uptime" />
      </div>
    </section>
  );
};

export default Stats;
