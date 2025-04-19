import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AppLayout from '@/components/layout/AppLayout';
import { Loader2, Github, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Constants
const CACHE_KEY = 'automate_profile_data';

interface GitHubUserData {
  login: string;
  name: string;
  avatar_url: string;
  email: string;
}

const GitHubCallbackPage = () => {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [githubUser, setGithubUser] = useState<GitHubUserData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    // Function to process the GitHub OAuth callback
    const processOAuthCallback = async () => {
      try {
        // Get code and state from URL
        const { code, state } = router.query;
        
        if (!code) {
          setStatus('error');
          setErrorMessage('No authorization code received from GitHub');
          return;
        }

        // Verify state if it was stored
        const storedState = localStorage.getItem('github_oauth_state');
        if (state && storedState && state !== storedState) {
          setStatus('error');
          setErrorMessage('Invalid state parameter. This might be a CSRF attack attempt.');
          return;
        }

        // Exchange the authorization code for an access token using our API route
        const tokenResponse = await fetch(`/api/github?code=${code}`);
        const tokenData = await tokenResponse.json();

        if (!tokenData.access_token) {
          setStatus('error');
          setErrorMessage(tokenData.error || 'Failed to obtain access token from GitHub');
          return;
        }
        
        // With the access token, fetch the user data from GitHub API
        const userResponse = await fetch('https://api.github.com/user', {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${tokenData.access_token}`
          }
        });
        
        if (!userResponse.ok) {
          setStatus('error');
          setErrorMessage('Failed to fetch user data from GitHub');
          return;
        }
        
        // Parse the GitHub user data
        const githubUser: GitHubUserData = await userResponse.json();
        
        setGithubUser(githubUser);
        
        // Update cached profile data
        const pendingProfileJson = localStorage.getItem('github_oauth_pending_profile');
        if (pendingProfileJson) {
          try {
            const pendingProfile = JSON.parse(pendingProfileJson);
            const cachedDataJson = localStorage.getItem(CACHE_KEY);
            
            if (cachedDataJson) {
              const cachedData = JSON.parse(cachedDataJson);
              
              // Update GitHub username in the cached profile
              cachedData.profile = {
                ...cachedData.profile,
                github: `oauth:${githubUser.login}`
              };
              
              // Save back to cache
              localStorage.setItem(CACHE_KEY, JSON.stringify({
                ...cachedData,
                profile: cachedData.profile,
                timestamp: new Date().getTime()
              }));
            }
            
            // Clear pending profile and state
            localStorage.removeItem('github_oauth_pending_profile');
            localStorage.removeItem('github_oauth_state');
          } catch (error) {
            console.error('Error updating profile:', error);
          }
        }
        
        setStatus('success');
      } catch (error) {
        console.error('Error processing GitHub callback:', error);
        setStatus('error');
        setErrorMessage('An unexpected error occurred while connecting with GitHub');
      }
    };

    // Process the callback when the router is ready
    if (router.isReady) {
      processOAuthCallback();
    }
  }, [router.isReady, router.query]);

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center p-8 space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-automate-purple" />
            <h2 className="text-xl font-bold text-center">Connecting to GitHub...</h2>
            <p className="text-gray-400 text-center">Please wait while we process your GitHub authorization.</p>
          </div>
        );
      
      case 'success':
        return (
          <div className="flex flex-col items-center justify-center p-8 space-y-6">
            <div className="bg-green-500/20 p-4 rounded-full">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-center">Successfully Connected!</h2>
            <div className="bg-automate-dark p-6 rounded-lg max-w-md w-full">
              <div className="flex items-center space-x-4">
                <div className="bg-[#24292e] p-2 rounded-full">
                  <Github className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{githubUser?.login}</h3>
                  <p className="text-gray-400 text-sm">Connected via GitHub OAuth</p>
                </div>
              </div>
            </div>
            <Button 
              onClick={() => router.push('/profile')} 
              className="bg-automate-purple hover:bg-automate-purple/90 text-white"
            >
              Continue to Profile
            </Button>
          </div>
        );
      
      case 'error':
        return (
          <div className="flex flex-col items-center justify-center p-8 space-y-6">
            <div className="bg-red-500/20 p-4 rounded-full">
              <XCircle className="h-16 w-16 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-center">Connection Failed</h2>
            <p className="text-red-400 text-center">{errorMessage || 'There was an error connecting to GitHub.'}</p>
            <Button 
              onClick={() => router.push('/profile')} 
              className="bg-automate-purple hover:bg-automate-purple/90 text-white"
            >
              Back to Profile
            </Button>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">GitHub Authorization</h1>
      
      <div className="bg-automate-dark p-6 rounded-lg shadow-lg">
        {renderContent()}
      </div>
    </div>
  );
};

const GitHubPage = () => {
  return (
    <AppLayout>
      <GitHubCallbackPage />
    </AppLayout>
  );
};

export default GitHubPage;
