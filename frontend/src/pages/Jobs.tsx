
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, Building, CreditCard } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// Job type for employment opportunities
interface Job {
  company: string;
  description: string;
  externalApplyLink: string;
  id: string;
  isExpired: boolean;
  jobType: string[];
  location: string;
  positionName: string;
  postedAt: string;
  postingDateParsed: string;
  rating: number;
  reviewsCount: number;
  salary: string;
  scrapedAt: string;
  searchInput: {
    country: string;
    location: string;
    position: string;
  }
  url: string;
}

const Jobs = () => {
  // Job listings state
  const [jobs, setJobs] = useState<Job[]>([]);
  
  // Loading state for fetch operation
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  
  // Fetch jobs data when component mounts
  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      setError(null);
      
      // Check if we have cached jobs data in localStorage
      const cachedJobsData = localStorage.getItem('cachedJobs');
      const cachedTimestamp = localStorage.getItem('cachedJobsTimestamp');
      
      // Define cache expiration (3 hours in milliseconds)
      const cacheExpirationTime = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
      const currentTime = new Date().getTime();
      
      // Check if we have valid cached data
      if (cachedJobsData && cachedTimestamp) {
        const cacheTime = parseInt(cachedTimestamp, 10);
        // If cache is still valid (less than 3 hours old)
        if (currentTime - cacheTime < cacheExpirationTime) {
          try {
            const parsedJobs = JSON.parse(cachedJobsData);
            // Remove descriptionHTML property from each job in the array
            const cleanedJobs = parsedJobs.map(job => {
              const { descriptionHTML, ...rest } = job;
              return rest;
            });
            setJobs(cleanedJobs);
            setIsLoading(false);
            console.log('Using cached jobs data');
            return; // Exit early as we're using cached data
          } catch (parseError) {
            console.error('Error parsing cached jobs:', parseError);
            // Continue with API fetch if parsing fails
          }
        } else {
          console.log('Cache expired, fetching fresh data');
        }
      }
      
      // If no valid cache exists, fetch from API
      try {
        const response = await fetch('http://localhost:5000/jobs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ search: "software engineer intern", location: "New York" }),
        });
        
        if (!response.ok) {
          throw new Error(`Error fetching jobs: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Remove descriptionHTML property from each job before updating state
        const cleanedJobs: Job[] = data.map(job => {
          const { descriptionHTML, ...rest } = job;
          return rest;
        });
        
        // Update state with the cleaned data
        setJobs(cleanedJobs);
        
        // Cache the cleaned data in localStorage with timestamp
        localStorage.setItem('cachedJobs', JSON.stringify(cleanedJobs));
        localStorage.setItem('cachedJobsTimestamp', currentTime.toString());
        console.log('Jobs data cached');
      } catch (err) {
        console.error('Failed to fetch jobs:', err);
        setError('Failed to load jobs. Please try again later.');
        // Set some default jobs in case the API fails
        setJobs([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchJobs();
  }, []);
  
  // Apply for job function
  const handleApply = (jobId: string) => {
    console.log(`Applied for job ID: ${jobId}`);
    // Here you would handle the application process
  };
  
  // Filter jobs based on search term and filters
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.positionName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType ? job.jobType.includes(selectedType) : true;
    const matchesLocation = selectedLocation ? 
                           job.location.toLowerCase().includes(selectedLocation.toLowerCase()) : true;
    
    return matchesSearch && matchesType && matchesLocation;
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Jobs</h1>
        <Button 
          className="bg-automate-purple hover:bg-automate-purple/90 text-white"
          onClick={() => console.log("Create new job listing")}
        >
          Create New Job
        </Button>
      </div>
      
      {/* Search and filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center bg-automate-dark-gray rounded-md border border-gray-800 px-3 flex-1">
          <Search size={18} className="text-gray-400" />
          <Input 
            placeholder="Search jobs..."
            className="bg-transparent border-none outline-none px-2 py-2 text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Job Type filter */}
        <div className="w-40">
          <Select onValueChange={(value) => setSelectedType(value)}>
            <SelectTrigger className="bg-automate-dark-gray border-gray-800 text-white">
              <SelectValue placeholder="Job Type" />
            </SelectTrigger>
            <SelectContent className="bg-automate-dark-gray text-white">
              <SelectItem value="Full-time">Full-time</SelectItem>
              <SelectItem value="Part-time">Part-time</SelectItem>
              <SelectItem value="Contract">Contract</SelectItem>
              <SelectItem value="Remote">Remote</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Location filter */}
        <div className="w-40">
          <Select onValueChange={(value) => setSelectedLocation(value)}>
            <SelectTrigger className="bg-automate-dark-gray border-gray-800 text-white">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent className="bg-automate-dark-gray text-white">
              <SelectItem value="Remote">Remote</SelectItem>
              <SelectItem value="San Francisco">San Francisco</SelectItem>
              <SelectItem value="New York">New York</SelectItem>
              <SelectItem value="Seattle">Seattle</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Loading state */}
      {isLoading && (
        <div className="text-center py-10 text-gray-400">
          <p>Loading jobs...</p>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="text-center py-10 text-red-400">
          <p>{error}</p>
        </div>
      )}
      
      {/* Job listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map((job) => (
          <Card key={job.id} className="bg-automate-dark-gray border-gray-800 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl text-white">{job.positionName}</CardTitle>
              <CardDescription className="flex items-center gap-1 text-gray-300">
                <Building size={16} className="mb-1" />
                {job.company}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-300">
                  <MapPin size={16} />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Briefcase size={16} />
                  <span>{job.jobType.join(', ')}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <CreditCard size={16} />
                  <span>{job.salary}</span>
                </div>
                <p className="text-gray-300 mt-2 line-clamp-3">{job.description}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-automate-purple hover:bg-automate-purple/90 text-white"
                onClick={() => handleApply(job.id)}
              >
                Apply
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {/* Show message if no jobs match the filters */}
      {filteredJobs.length === 0 && (
        <div className="text-center py-10 text-gray-400">
          <p>No jobs match your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Jobs;
