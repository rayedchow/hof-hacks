import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, MapPin, Briefcase, Building, CreditCard, Calendar } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import AppLayout from '@/components/layout/AppLayout';

// Job type with HTML description
interface Job {
  company: string;
  description: string;
  descriptionHTML?: string;
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

const AnalyzeJob = () => {
  const router = useRouter();
  const { id } = router.query;
  
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!id) return;
    
    const fetchJobDetails = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Try to get job data from localStorage cache
        const cachedJobsData = localStorage.getItem('cachedJobs');
        
        if (cachedJobsData) {
          const parsedJobs = JSON.parse(cachedJobsData);
          const foundJob = parsedJobs.find((job: Job) => job.id === id);
          
          if (foundJob) {
            setJob(foundJob);
            setIsLoading(false);
            return;
          }
        }
        
        // If no cached job found, fetch from API
        // This would be implemented if we had a single job endpoint
        setError('Job not found in cache. Please return to the jobs page and try again.');
      } catch (err) {
        console.error('Failed to fetch job details:', err);
        setError('Failed to load job details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchJobDetails();
  }, [id]);
  
  const handleApply = () => {
    if (job && job.externalApplyLink) {
      window.open(job.externalApplyLink, '_blank');
    }
  };
  
  const handleGoBack = () => {
    router.push('/Jobs');
  };
  
  // Format the date to a more readable format
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="p-6">
      <Button 
        variant="ghost" 
        className="mb-6 text-gray-300 hover:text-white hover:bg-automate-dark-gray"
        onClick={handleGoBack}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs
      </Button>
      
      {isLoading && (
        <div className="text-center py-10 text-gray-400">
          <p>Loading job details...</p>
        </div>
      )}
      
      {error && (
        <div className="text-center py-10 text-red-400">
          <p>{error}</p>
        </div>
      )}
      
      {job && (
        <div className="space-y-6">
          <Card className="bg-automate-dark-gray border-gray-800 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-white">{job.positionName}</CardTitle>
              <CardDescription className="flex items-center gap-1 text-gray-300 text-lg">
                <Building size={18} className="mb-1" />
                {job.company}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-gray-300">
                    <MapPin size={18} />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Briefcase size={18} />
                    <span>{job.jobType.join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <CreditCard size={18} />
                    <span>{job.salary || 'Salary not specified'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Calendar size={18} />
                    <span>Posted: {formatDate(job.postedAt)}</span>
                  </div>
                </div>
                <div className="flex flex-col items-start justify-center gap-4">
                  <Button 
                    className="w-full bg-automate-purple hover:bg-automate-purple/90 text-white"
                    onClick={handleApply}
                  >
                    Apply Now
                  </Button>
                  <a 
                    href={job.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-automate-purple hover:underline w-full text-center"
                  >
                    View Original Posting
                  </a>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-xl text-white mb-4">Job Description</h3>
                {job.descriptionHTML ? (
                  <div 
                    className="prose prose-invert max-w-none text-gray-300"
                    dangerouslySetInnerHTML={{ __html: job.descriptionHTML }}
                  />
                ) : (
                  <div className="whitespace-pre-wrap text-gray-300">{job.description}</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

const AnalyzeJobPage = () => {
  return (
    <AppLayout>
      <AnalyzeJob />
    </AppLayout>
  );
};

export default AnalyzeJobPage;
