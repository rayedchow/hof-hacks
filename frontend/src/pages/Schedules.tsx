
import React, { useState } from 'react';
import { Calendar, Clock, ChevronLeft, ChevronRight, PlusCircle } from 'lucide-react';
import { format, addDays, startOfWeek, addWeeks, subWeeks, eachDayOfInterval } from 'date-fns';

interface ScheduledJob {
  id: string;
  name: string;
  type: 'Batch' | 'Real-Time';
  time: string;
  date: Date;
}

const Schedules = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<'calendar' | 'list'>('calendar');
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  
  // Sample scheduled jobs
  const [scheduledJobs, setScheduledJobs] = useState<ScheduledJob[]>([
    { id: '1', name: 'Data Import', type: 'Batch', time: '10:15 AM', date: new Date() },
    { id: '2', name: 'Report Generation', type: 'Batch', time: '2:30 PM', date: addDays(new Date(), 1) },
    { id: '3', name: 'Email Notification', type: 'Real-Time', time: '8:00 AM', date: addDays(new Date(), 2) },
    { id: '4', name: 'Backup Process', type: 'Batch', time: '12:00 AM', date: addDays(new Date(), 3) },
    { id: '5', name: 'Data Sync', type: 'Real-Time', time: '6:00 PM', date: addDays(new Date(), 4) },
    { id: '6', name: 'Log Cleanup', type: 'Batch', time: '11:30 PM', date: addDays(new Date(), 5) },
  ]);
  
  // Handle navigation
  const nextWeek = () => setCurrentWeekStart(addWeeks(currentWeekStart, 1));
  const prevWeek = () => setCurrentWeekStart(subWeeks(currentWeekStart, 1));
  
  // Get days of current week
  const daysOfWeek = eachDayOfInterval({
    start: currentWeekStart,
    end: addDays(currentWeekStart, 6)
  });
  
  // Filter jobs for the current week
  const weekJobs = scheduledJobs.filter(job => {
    const jobDate = job.date;
    return jobDate >= currentWeekStart && jobDate <= addDays(currentWeekStart, 6);
  });
  
  // Group jobs by date
  const jobsByDate = daysOfWeek.map(day => {
    const date = format(day, 'yyyy-MM-dd');
    const jobs = weekJobs.filter(job => {
      return format(job.date, 'yyyy-MM-dd') === date;
    });
    return { date: day, jobs };
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Schedules</h1>
        <div className="flex items-center space-x-2">
          <div className="flex border border-gray-800 rounded-md overflow-hidden">
            <button 
              className={`px-4 py-2 ${currentView === 'calendar' ? 'bg-automate-purple text-white' : 'bg-automate-dark-gray text-gray-300'}`}
              onClick={() => setCurrentView('calendar')}
            >
              <Calendar size={18} />
            </button>
            <button 
              className={`px-4 py-2 ${currentView === 'list' ? 'bg-automate-purple text-white' : 'bg-automate-dark-gray text-gray-300'}`}
              onClick={() => setCurrentView('list')}
            >
              <Clock size={18} />
            </button>
          </div>
          <button className="automate-button flex items-center">
            <PlusCircle size={18} className="mr-2" />
            New Schedule
          </button>
        </div>
      </div>
      
      {/* Calendar Navigation */}
      <div className="automate-card mb-6">
        <div className="flex justify-between items-center">
          <button 
            className="p-2 rounded-md hover:bg-gray-700 text-gray-400"
            onClick={prevWeek}
          >
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-lg">
            {format(currentWeekStart, 'MMMM d')} - {format(addDays(currentWeekStart, 6), 'MMMM d, yyyy')}
          </h2>
          <button 
            className="p-2 rounded-md hover:bg-gray-700 text-gray-400"
            onClick={nextWeek}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      
      {/* Calendar View */}
      {currentView === 'calendar' && (
        <div className="grid grid-cols-7 gap-4">
          {/* Day headers */}
          {daysOfWeek.map((day) => (
            <div key={format(day, 'yyyy-MM-dd')} className="text-center">
              <div className="mb-2 text-gray-400">{format(day, 'EEE')}</div>
              <div className={`text-xl font-semibold ${format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') ? 'text-automate-purple' : 'text-white'}`}>
                {format(day, 'd')}
              </div>
            </div>
          ))}
          
          {/* Calendar cells */}
          {jobsByDate.map((dayData) => (
            <div 
              key={format(dayData.date, 'yyyy-MM-dd')} 
              className="automate-card min-h-[150px] max-h-[300px] overflow-y-auto"
            >
              {dayData.jobs.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                  No scheduled jobs
                </div>
              ) : (
                <div className="space-y-2">
                  {dayData.jobs.map((job) => (
                    <div 
                      key={job.id} 
                      className="p-2 rounded bg-automate-purple/20 border-l-4 border-automate-purple cursor-pointer hover:bg-automate-purple/30"
                    >
                      <div className="text-sm font-medium text-white">{job.name}</div>
                      <div className="text-xs text-gray-400 flex items-center">
                        <Clock size={12} className="mr-1" />
                        {job.time}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* List View */}
      {currentView === 'list' && (
        <div className="automate-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="text-left text-gray-400 border-b border-gray-800">
                <tr>
                  <th className="py-3 px-4">Job Name</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {scheduledJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-800/30">
                    <td className="px-4 py-3 text-white">{job.name}</td>
                    <td className="px-4 py-3 text-gray-300">{job.type}</td>
                    <td className="px-4 py-3 text-gray-300">{format(job.date, 'MMM d, yyyy')}</td>
                    <td className="px-4 py-3 text-gray-300">{job.time}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-gray-400 hover:text-white">
                          Edit
                        </button>
                        <button className="p-1 text-gray-400 hover:text-automate-error">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedules;
