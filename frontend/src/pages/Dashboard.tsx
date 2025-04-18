
import React, { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Clock, CheckCircle2, AlertCircle, PauseCircle, PlayCircle } from 'lucide-react';

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const username = "Alex";
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Format date and time
  const dateOptions: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
  const formattedDate = currentTime.toLocaleDateString('en-US', dateOptions);
  const formattedTime = currentTime.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit',
    hour12: true 
  });
  
  // Data for the line chart
  const chartData = [
    { name: 'Mon', jobs: 12 },
    { name: 'Tue', jobs: 15 },
    { name: 'Wed', jobs: 10 },
    { name: 'Thu', jobs: 18 },
    { name: 'Fri', jobs: 22 },
    { name: 'Sat', jobs: 8 },
    { name: 'Sun', jobs: 14 },
  ];
  
  // Data for the pie chart
  const pieData = [
    { name: 'Batch Jobs', value: 22, percentage: 45 },
    { name: 'Real-Time Jobs', value: 15, percentage: 30 },
    { name: 'Scheduled Jobs', value: 13, percentage: 25 },
  ];
  
  const COLORS = ['#9b87f5', '#7E69AB', '#443A5E'];
  
  // Recent jobs data
  const recentJobs = [
    { id: 1, name: 'Data Import', status: 'Completed', startTime: '10:15 AM', endTime: '10:20 AM', statusColor: 'automate-status-success' },
    { id: 2, name: 'Report Generation', status: 'Running', startTime: '10:30 AM', endTime: '-', statusColor: 'automate-status-running' },
    { id: 3, name: 'Email Notification', status: 'Completed', startTime: '10:05 AM', endTime: '10:06 AM', statusColor: 'automate-status-success' },
    { id: 4, name: 'Backup Process', status: 'Failed', startTime: '09:45 AM', endTime: '09:46 AM', statusColor: 'automate-status-error' },
    { id: 5, name: 'Data Sync', status: 'Pending', startTime: '11:00 AM', endTime: '-', statusColor: 'automate-status-pending' },
  ];
  
  // Function to get the greeting based on the time of day
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Header with greeting and time */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">
            <span className="text-white">{getGreeting()}, </span>
            <span className="text-automate-purple">{username}</span>
          </h1>
          <div className="text-gray-300">
            {formattedDate} / {formattedTime}
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-1 gap-6">
        {/* Left column - 70% width */}
        <div className="flex-[7] flex flex-col">
          {/* Metrics */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {/* Active Jobs */}
            <div className="automate-card flex items-center">
              <div className="w-10 h-10 rounded-full bg-automate-purple/20 flex items-center justify-center mr-3">
                <PlayCircle className="text-automate-purple" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Active Jobs</p>
                <p className="text-xl font-semibold text-white">12</p>
              </div>
            </div>
            
            {/* Completed Jobs */}
            <div className="automate-card flex items-center">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                <CheckCircle2 className="text-green-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Completed Jobs</p>
                <p className="text-xl font-semibold text-white">58</p>
              </div>
            </div>
            
            {/* Errors */}
            <div className="automate-card flex items-center">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center mr-3">
                <AlertCircle className="text-red-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Errors</p>
                <p className="text-xl font-semibold text-white">3</p>
              </div>
            </div>
            
            {/* Total Jobs */}
            <div className="automate-card flex items-center relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[95%] h-[95%] rounded-full border-4 border-automate-purple/30"></div>
                <div className="absolute inset-0 flex items-center justify-center border-4 border-automate-purple rounded-full" 
                     style={{ clipPath: 'polygon(0 0, 100% 0, 100% 80%, 0 80%)' }}>
                </div>
              </div>
              
              <div className="z-10 text-center w-full">
                <p className="text-gray-400 text-sm">Total Jobs Run</p>
                <p className="text-2xl font-bold text-white">73</p>
              </div>
            </div>
          </div>
          
          {/* Line Chart */}
          <div className="automate-card flex-1 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Job Completion Trend</h2>
              <div className="text-sm text-gray-400">Last 7 Days</div>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9b87f5" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#9b87f5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis dataKey="name" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1A1A22', border: '1px solid #333', borderRadius: '0.375rem' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="jobs" 
                    stroke="#9b87f5" 
                    fillOpacity={1} 
                    fill="url(#colorJobs)" 
                    activeDot={{ r: 6, fill: '#fff', stroke: '#9b87f5' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Additional Metrics */}
          <div className="grid grid-cols-2 gap-4">
            {/* Scheduled Jobs */}
            <div className="automate-card flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                <Clock className="text-blue-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Scheduled Jobs</p>
                <p className="text-xl font-semibold text-white">5</p>
              </div>
            </div>
            
            {/* Pending Jobs */}
            <div className="automate-card flex items-center">
              <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center mr-3">
                <PauseCircle className="text-yellow-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Pending Jobs</p>
                <p className="text-xl font-semibold text-white">2</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right column - 30% width */}
        <div className="flex-[3] flex flex-col">
          {/* Pie Chart */}
          <div className="automate-card mb-6">
            <h2 className="text-lg font-semibold mb-4">Job Distribution</h2>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    innerRadius={50}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [`${value} jobs`, name]}
                    contentStyle={{ backgroundColor: '#1A1A22', border: '1px solid #333', borderRadius: '0.375rem' }}
                    labelStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-1 gap-2 mt-2">
              {pieData.map((item, index) => (
                <div key={index} className="flex items-center text-sm">
                  <div className="w-3 h-3 rounded-sm mr-2" style={{ backgroundColor: COLORS[index] }}></div>
                  <span className="text-gray-300">{item.name}:</span>
                  <span className="ml-auto text-white">{item.value} jobs ({item.percentage}%)</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Recent Jobs */}
          <div className="automate-card flex-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Recent Jobs</h2>
              <button className="text-sm text-automate-purple hover:text-automate-purple-light">View All</button>
            </div>
            <div className="overflow-y-auto max-h-[280px]">
              <table className="w-full text-left">
                <thead className="text-xs uppercase text-gray-400 border-b border-gray-800">
                  <tr>
                    <th className="pb-2">Job Name</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {recentJobs.map(job => (
                    <tr key={job.id} className="hover:bg-gray-800/30">
                      <td className="py-3 text-white">{job.name}</td>
                      <td className={`py-3 ${job.statusColor}`}>{job.status}</td>
                      <td className="py-3 text-gray-400 text-sm">
                        <div>{job.startTime}</div>
                        <div>{job.endTime}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
