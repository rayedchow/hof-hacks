
import React, { useState } from 'react';
import { Search, Filter, ChevronDown, Clock, Download } from 'lucide-react';

interface Log {
  id: string;
  timestamp: string;
  jobName: string;
  status: 'Success' | 'Error' | 'Warning' | 'Info';
  message: string;
}

const Logs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJobName, setSelectedJobName] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState<string | null>(null);
  
  // Sample logs data
  const [logs, setLogs] = useState<Log[]>([
    { id: '1', timestamp: '2025-04-15 10:15:03', jobName: 'Data Import', status: 'Success', message: 'File processed successfully' },
    { id: '2', timestamp: '2025-04-15 10:12:47', jobName: 'Report Generation', status: 'Error', message: 'Failed to generate PDF: Memory limit exceeded' },
    { id: '3', timestamp: '2025-04-15 10:05:22', jobName: 'Email Notification', status: 'Success', message: '15 emails sent' },
    { id: '4', timestamp: '2025-04-15 09:58:11', jobName: 'Backup Process', status: 'Error', message: 'Connection timeout' },
    { id: '5', timestamp: '2025-04-15 09:45:30', jobName: 'Data Sync', status: 'Warning', message: 'Some records skipped due to validation errors' },
    { id: '6', timestamp: '2025-04-15 09:30:05', jobName: 'Log Cleanup', status: 'Success', message: 'Old logs archived' },
    { id: '7', timestamp: '2025-04-15 09:15:18', jobName: 'API Integration', status: 'Info', message: 'API request completed with 200 OK' },
    { id: '8', timestamp: '2025-04-15 09:00:02', jobName: 'Database Maintenance', status: 'Success', message: 'Indexes rebuilt' },
    { id: '9', timestamp: '2025-04-15 08:45:51', jobName: 'Data Import', status: 'Error', message: 'Invalid data format in row 351' },
    { id: '10', timestamp: '2025-04-15 08:30:27', jobName: 'Report Generation', status: 'Success', message: 'Monthly report generated' },
    { id: '11', timestamp: '2025-04-15 08:15:14', jobName: 'Email Notification', status: 'Warning', message: '3 emails failed to send' },
    { id: '12', timestamp: '2025-04-15 08:00:00', jobName: 'Backup Process', status: 'Success', message: 'Database backup completed' },
  ]);
  
  // Unique job names for filter
  const jobNames = Array.from(new Set(logs.map(log => log.jobName)));
  
  // Statuses for filter
  const statuses = ['Success', 'Error', 'Warning', 'Info'];
  
  // Filter logs
  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.jobName.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesJob = selectedJobName ? log.jobName === selectedJobName : true;
    const matchesStatus = selectedStatus ? log.status === selectedStatus : true;
    
    // Date range filtering would be implemented here
    
    return matchesSearch && matchesJob && matchesStatus;
  });
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Success':
        return 'automate-status-success';
      case 'Error':
        return 'automate-status-error';
      case 'Warning':
        return 'automate-status-pending';
      case 'Info':
        return 'automate-status-running';
      default:
        return '';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Logs</h1>
        <button className="automate-button flex items-center">
          <Download size={18} className="mr-2" />
          Export Logs
        </button>
      </div>
      
      {/* Search and filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center bg-automate-dark-gray rounded-md border border-gray-800 px-3 flex-1">
          <Search size={18} className="text-gray-400" />
          <input 
            type="text"
            placeholder="Search logs..."
            className="bg-transparent border-none outline-none px-2 py-2 text-white w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Job filter */}
        <div className="relative">
          <button className="px-3 py-2 bg-automate-dark-gray rounded-md border border-gray-800 flex items-center">
            <Filter size={18} className="mr-2 text-gray-400" />
            <span>{selectedJobName || 'All Jobs'}</span>
            <ChevronDown size={16} className="ml-2 text-gray-400" />
          </button>
          {/* Dropdown would go here */}
        </div>
        
        {/* Status filter */}
        <div className="relative">
          <button className="px-3 py-2 bg-automate-dark-gray rounded-md border border-gray-800 flex items-center">
            <Filter size={18} className="mr-2 text-gray-400" />
            <span>{selectedStatus || 'All Statuses'}</span>
            <ChevronDown size={16} className="ml-2 text-gray-400" />
          </button>
          {/* Dropdown would go here */}
        </div>
        
        {/* Date range filter */}
        <div className="relative">
          <button className="px-3 py-2 bg-automate-dark-gray rounded-md border border-gray-800 flex items-center">
            <Clock size={18} className="mr-2 text-gray-400" />
            <span>{selectedDateRange || 'Today'}</span>
            <ChevronDown size={16} className="ml-2 text-gray-400" />
          </button>
          {/* Dropdown would go here */}
        </div>
      </div>
      
      {/* Logs list */}
      <div className="automate-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="text-left text-gray-400 border-b border-gray-800">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Job Name</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-800/30">
                  <td className="px-4 py-3 text-gray-400 whitespace-nowrap font-mono text-sm">
                    {log.timestamp}
                  </td>
                  <td className="px-4 py-3 text-white">{log.jobName}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(log.status)}`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-300">{log.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Logs;
