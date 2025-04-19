import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertCircle, CheckCircle, Clock, ArrowLeft, RefreshCw } from 'lucide-react';

// Define job application status types
type ApplicationStatus = 'pending' | 'processing' | 'success' | 'failed';

// Interface for job application tracking
interface JobApplication {
  id: string;
  company: string;
  positionName: string;
  status: ApplicationStatus;
  statusMessage?: string;
  appliedAt?: string;
  externalApplyLink?: string;
  url?: string;
}

// Profile data interface
interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  github?: string;
  githubUsername?: string;
  linkedin?: string;
  devpost?: string;
  bio?: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

const ApplicationsPage = () => {
  const router = useRouter();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  // Flag to prevent loops when showing alerts
  const [hasShownAlerts, setHasShownAlerts] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;
    const setup = async () => {
      const profileCacheData = localStorage.getItem('automate_profile_data');
      if (profileCacheData) {
        try {
          const cachedData = JSON.parse(profileCacheData);
          if (cachedData.profile) {
            setProfileData(cachedData.profile);
          } else if (cachedData.data) {
            setProfileData(cachedData.data);
          }
        } catch (error) {
          console.error('Error parsing profile data:', error);
        }
      }
    };
    // set applications from query params
    const { jobIds } = router.query;
    if (!jobIds || typeof jobIds !== 'string') {
      console.warn("No jobs selected");
      router.push('/Jobs');
      return;
    }
    const cachedJobsData = localStorage.getItem('cachedJobs');
    if (!cachedJobsData) {
      console.warn("No job data found");
      router.push('/Jobs');
      return;
    }
    const selectedIds = jobIds.split(',');
    const allJobs = JSON.parse(cachedJobsData);
    const jobApplications: JobApplication[] = [];
    for (const id of selectedIds) {
      const job = allJobs.find((j: any) => j.id === id);
      if (!job) continue;
      const jobApp: JobApplication = {
        id: job.id,
        company: job.company,
        positionName: job.positionName,
        status: 'pending',
      };
      if (job.externalApplyLink) jobApp.externalApplyLink = job.externalApplyLink;
      if (job.url) jobApp.url = job.url;
      jobApplications.push(jobApp);
    }
    setApplications(jobApplications);
    setup();
  }, [router.isReady]);

  // Process the current application based on the currentIndex
  const processCurrentApplication = async () => {
    if (currentIndex < 0 || currentIndex >= applications.length) return;
    
    setIsSubmitting(true);
    
    // Create a copy of the applications array to update
    const updatedApplications = [...applications];
    const currentApp = updatedApplications[currentIndex];
    
    // Update the current application status
    currentApp.status = 'processing';
    currentApp.statusMessage = 'Starting application process';
    currentApp.appliedAt = new Date().toISOString();
    
    // Update the applications state
    setApplications(updatedApplications);
    
    try {
      // Send the application request
      console.log(currentApp);
      const response = await fetch('http://localhost:5000/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          job: {
            id: currentApp.id,
            company: currentApp.company,
            positionName: currentApp.positionName,
            url: currentApp.externalApplyLink
          },
          user: profileData
        }),
      });
      
      const result = await response.json();
      
      // Create another copy of the latest applications state
      const updatedApps = [...applications];
      const app = updatedApps[currentIndex];
      
      // Update application status based on result
      if (result.success) {
        app.status = 'success';
        app.statusMessage = result.message;
      } else {
        app.status = 'failed';
        app.statusMessage = result.message;
      }
      
      // Update applications state
      setApplications(updatedApps);
    } catch (error) {
      console.error('Error processing application:', error);
      
      // Handle errors by updating the application status
      const updatedApps = [...applications];
      updatedApps[currentIndex].status = 'failed';
      updatedApps[currentIndex].statusMessage = 'Error connecting to application server';
      setApplications(updatedApps);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Start processing the first application
  const startApplicationProcess = async () => {
    if (isSubmitting || applications.length === 0) return;
    
    // Move to the first application and process it
    setCurrentIndex(0);
    await processCurrentApplication();
  }


  // Render status icon based on application status
  const renderStatusIcon = (status: ApplicationStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-gray-400" />;
      case 'processing':
        return <RefreshCw className="h-5 w-5 text-yellow-400 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-400" />;
      default:
        return null;
    }
  };

  return (
    <AppLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => router.push('/Jobs')}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Jobs
            </Button>
            <h1 className="text-2xl font-semibold">Job Applications</h1>
          </div>
          
          <div className="flex items-center gap-2">
            {currentIndex === -1 || currentIndex >= applications.length ? (
              <Button 
                onClick={startApplicationProcess}
                disabled={isSubmitting || applications.every(app => app.status !== 'pending')}
                className="bg-automate-purple hover:bg-automate-purple/90 text-white"
              >
                {isSubmitting ? 'Processing...' : 'Start Processing'}
              </Button>
            ) : (
              <>
                <Button 
                  onClick={startApplicationProcess}
                  disabled={isSubmitting}
                  className="bg-automate-purple hover:bg-automate-purple/90 text-white"
                >
                  {isSubmitting ? 'Processing...' : 'Restart'}
                </Button>
                <Button 
                  onClick={() => {
                    if (currentIndex + 1 < applications.length) {
                      setCurrentIndex(currentIndex + 1);
                      processCurrentApplication();
                    } else {
                      setCurrentIndex(-1);
                    }
                  }}
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {currentIndex + 1 < applications.length ? 'Next Application' : 'Finish'}
                </Button>
              </>
            )}
          </div>
        </div>
        
        {/* Application tracking table */}
        <div className="rounded-md border border-gray-800 overflow-hidden">
          <Table>
            <TableHeader className="bg-automate-dark-gray">
              <TableRow className="hover:bg-automate-dark-gray/80 border-b border-gray-800">
                <TableHead className="text-gray-300">Company</TableHead>
                <TableHead className="text-gray-300">Position</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Details</TableHead>
                <TableHead className="text-gray-300 text-right">Applied At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.length > 0 ? (
                applications.map((app) => (
                  <TableRow 
                    key={app.id} 
                    className={`hover:bg-automate-dark-gray/80 border-b border-gray-800 ${
                      app.status === 'processing' ? 'bg-automate-dark-gray/60' : ''
                    } ${
                      applications.indexOf(app) === currentIndex ? 'ring-2 ring-automate-purple' : ''
                    }`}
                  >
                    <TableCell className="font-medium text-white">{app.company}</TableCell>
                    <TableCell className="text-gray-300">{app.positionName}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {renderStatusIcon(app.status)}
                        <span className={`capitalize ${
                          app.status === 'success' ? 'text-green-400' : 
                          app.status === 'failed' ? 'text-red-400' : 
                          app.status === 'processing' ? 'text-yellow-400' : 
                          'text-gray-400'
                        }`}>
                          {app.status}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-400 max-w-xs truncate">
                      {app.statusMessage || '-'}
                    </TableCell>
                    <TableCell className="text-gray-400 text-right">
                      {app.appliedAt ? new Date(app.appliedAt).toLocaleString() : '-'}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-gray-400">
                    No jobs selected for application.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Progress summary */}
        <div className="mt-4 flex items-center justify-between bg-automate-dark-gray p-4 rounded-md border border-gray-800">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-gray-400"></div>
              <span className="text-gray-300 text-sm">Pending: {applications.filter(app => app.status === 'pending').length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
              <span className="text-gray-300 text-sm">Processing: {applications.filter(app => app.status === 'processing').length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-400"></div>
              <span className="text-gray-300 text-sm">Success: {applications.filter(app => app.status === 'success').length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-400"></div>
              <span className="text-gray-300 text-sm">Failed: {applications.filter(app => app.status === 'failed').length}</span>
            </div>
          </div>
          
          <div className="text-gray-300 text-sm">
            {applications.filter(app => app.status === 'success' || app.status === 'failed').length} of {applications.length} processed
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ApplicationsPage;
