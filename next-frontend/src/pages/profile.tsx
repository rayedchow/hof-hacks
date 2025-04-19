import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Folder, Github, Linkedin, Globe, Mail, Phone, Save, FileText, Home, MapPin } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';

// Constants
const CACHE_KEY = 'automate_profile_data';
const CACHE_EXPIRATION = 1000 * 60 * 60 * 24 * 7; // 7 days in milliseconds

// Type for the cached data structure
interface CacheData {
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    github: string;
    linkedin: string;
    devpost: string;
    bio: string;
    // Address fields
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  directory: {
    name: string;
    files: Array<{
      name: string;
      path: string;
      size: number;
      type: string;
    }>;
  };
  timestamp: number;
}

const Profile = () => {
  // Profile state
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    github: '',
    linkedin: '',
    devpost: '',
    bio: '',
    // Address fields
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  
  // No direct OAuth callback handling here - now handled by the GitHub page

  // Load cached profile data on component mount
  useEffect(() => {
    const loadFromCache = () => {
      try {
        const cachedDataJson = localStorage.getItem(CACHE_KEY);
        if (cachedDataJson) {
          const cachedData = JSON.parse(cachedDataJson) as CacheData;
          const now = new Date().getTime();
          
          // Check if cache is still valid
          if (now - cachedData.timestamp < CACHE_EXPIRATION) {
            // Set profile data
            setProfile(cachedData.profile);
            
            // Set directory data if available
            if (cachedData.directory) {
              setSelectedDirectory(cachedData.directory.name || '');
              
              // Convert serialized file data back to File objects if we have file paths
              if (cachedData.directory.files && cachedData.directory.files.length > 0) {
                // We can't fully restore File objects from localStorage,
                // but we can show that previous files were selected
                const serializedFiles = cachedData.directory.files.map(fileInfo => {
                  // Create a placeholder object with basic file info
                  const placeholderFile = new File([
                    // Empty content, as we can't store actual file content in localStorage
                    new Blob([''], { type: fileInfo.type || 'application/octet-stream' })
                  ], fileInfo.name);
                  
                  // Add webkitRelativePath as a property (not a true File from directory input) 
                  Object.defineProperty(placeholderFile, 'webkitRelativePath', {
                    value: fileInfo.path,
                    writable: false
                  });
                  
                  return placeholderFile;
                });
                
                setDirectoryFiles(serializedFiles);
              }
            }
            
            console.log('Loaded profile and directory data from cache');
          } else {
            // Cache expired
            localStorage.removeItem(CACHE_KEY);
            console.log('Cache expired, using default data');
          }
        }
      } catch (error) {
        console.error('Error loading data from cache:', error);
      }
    };
    
    loadFromCache();
  }, []);
  
  const [selectedDirectory, setSelectedDirectory] = useState<string>("");
  const [directoryFiles, setDirectoryFiles] = useState<File[]>([]);
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedProfile = { ...profile, [name]: value };
    setProfile(updatedProfile);
    
    // Save updated profile to localStorage
    saveToCache(updatedProfile);
  };
  
  // Save all data to localStorage
  const saveToCache = (profileData = profile, dirName = selectedDirectory, files = directoryFiles) => {
    try {
      // Serialize the file data to a format that can be stored in localStorage
      const serializedFiles = files.map(file => ({
        name: file.name,
        path: file.webkitRelativePath || file.name,
        size: file.size,
        type: file.type
      }));
      
      // Create the cache data structure
      const cacheData: CacheData = {
        profile: profileData,
        directory: {
          name: dirName,
          files: serializedFiles
        },
        timestamp: new Date().getTime()
      };
      
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      console.log('Profile and directory data saved to cache');
    } catch (error) {
      console.error('Error saving data to cache:', error);
    }
  };
  
  // Handle directory selection
  const handleDirectorySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setDirectoryFiles(files);
      
      // Get the directory name from the webkitdirectory
      if (files.length > 0 && files[0].webkitRelativePath) {
        const dirPath = files[0].webkitRelativePath.split('/')[0];
        setSelectedDirectory(dirPath);
        
        // Save to cache when directory is selected
        saveToCache(profile, dirPath, files);
      }
    }
  };
  
  // Handle save profile
  const handleSaveProfile = () => {
    // Save profile and directory data to localStorage
    saveToCache();
    
    console.log('Profile saved:', profile);
    console.log('Directory:', selectedDirectory);
    console.log('Files:', directoryFiles);
  };

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
      
      <div className="bg-automate-dark p-6 rounded-lg shadow-lg space-y-6">
        {/* Directory Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Document Directory</label>
          <div className="flex items-center gap-2">
            <Input 
              type="file" 
              id="directory"
              className="hidden" 
              // @ts-ignore - webkitdirectory is not in HTMLInputElement type
              webkitdirectory="" 
              directory=""
              multiple
              onChange={handleDirectorySelect}
            />
            <Button 
              className="bg-automate-dark-gray hover:bg-gray-700 text-white"
              onClick={() => document.getElementById('directory')?.click()}
            >
              <Folder className="mr-2 h-4 w-4" />
              {selectedDirectory ? selectedDirectory : 'Select Directory'}
            </Button>
          </div>
          
          {/* Display file list */}
          {directoryFiles.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-300 mb-2">Files in directory ({directoryFiles.length}):</h3>
              <div className="bg-automate-black rounded-md p-3 max-h-[200px] overflow-y-auto">
                {directoryFiles.slice(0, 10).map((file, index) => (
                  <div key={index} className="flex items-center py-1 text-sm text-gray-300">
                    <FileText className="h-3 w-3 mr-2 text-gray-400" />
                    <span className="truncate">{file.webkitRelativePath || file.name}</span>
                    <span className="ml-auto text-gray-400 text-xs">({(file.size / 1024).toFixed(1)} KB)</span>
                  </div>
                ))}
                {directoryFiles.length > 10 && (
                  <div className="text-center text-xs text-gray-400 mt-2">
                    + {directoryFiles.length - 10} more files
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Personal Information section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold flex items-center text-white">
            <FileText className="mr-2" /> Personal Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-300">
                First Name
              </label>
              <Input 
                name="firstName"
                value={profile.firstName}
                onChange={handleInputChange}
                className="bg-automate-dark-gray border-gray-700 text-white"
                placeholder="John"
              />
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-300">
                Last Name
              </label>
              <Input 
                name="lastName"
                value={profile.lastName}
                onChange={handleInputChange}
                className="bg-automate-dark-gray border-gray-700 text-white"
                placeholder="Doe"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-300">
              <Mail className="mr-2 h-4 w-4" /> Email
            </label>
            <Input 
              name="email"
              value={profile.email}
              onChange={handleInputChange}
              className="bg-automate-dark-gray border-gray-700 text-white"
            />
          </div>
          
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-300">
              <Phone className="mr-2 h-4 w-4" /> Phone
            </label>
            <Input 
              name="phone"
              value={profile.phone}
              onChange={handleInputChange}
              className="bg-automate-dark-gray border-gray-700 text-white"
            />
          </div>
        </div>
        
        {/* Address Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Address</h2>
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-300">
              <Home className="mr-2 h-4 w-4" /> Street Address
            </label>
            <Input 
              name="street"
              value={profile.street}
              onChange={handleInputChange}
              className="bg-automate-dark-gray border-gray-700 text-white"
              placeholder="123 Main St"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-300">
                <MapPin className="mr-2 h-4 w-4" /> City
              </label>
              <Input 
                name="city"
                value={profile.city}
                onChange={handleInputChange}
                className="bg-automate-dark-gray border-gray-700 text-white"
                placeholder="New York"
              />
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-300">
                State/Province
              </label>
              <Input 
                name="state"
                value={profile.state}
                onChange={handleInputChange}
                className="bg-automate-dark-gray border-gray-700 text-white"
                placeholder="NY"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-300">
                Zip/Postal Code
              </label>
              <Input 
                name="zipCode"
                value={profile.zipCode}
                onChange={handleInputChange}
                className="bg-automate-dark-gray border-gray-700 text-white"
                placeholder="10001"
              />
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-300">
                Country
              </label>
              <Input 
                name="country"
                value={profile.country}
                onChange={handleInputChange}
                className="bg-automate-dark-gray border-gray-700 text-white"
                placeholder="United States"
              />
            </div>
          </div>
        </div>
        
        {/* Social Links */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Social Links</h2>
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-300">
              <Github className="mr-2 h-4 w-4" /> GitHub
            </label>
            <div className="flex">
              <Input 
                name="github"
                value={profile.github}
                onChange={handleInputChange}
                className="bg-automate-dark-gray border-gray-700 text-white flex-grow"
                placeholder="GitHub username or URL"
                disabled={profile.github.startsWith('oauth:')}
              />
              <Button 
                onClick={() => {
                  // GitHub OAuth URL with client ID
                  const CLIENT_ID = 'Ov23livl0mmy0KYKZs28';
                  // Store the current profile data so we don't lose it during redirect
                  localStorage.setItem('github_oauth_pending_profile', JSON.stringify(profile));
                  // Generate a random state to prevent CSRF attacks
                  const state = Math.random().toString(36).substring(2);
                  localStorage.setItem('github_oauth_state', state);
                  // Redirect to GitHub OAuth authorization endpoint with required scopes
                  window.location.href = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=repo,user`;
                }}
                className="ml-2 bg-[#24292e] hover:bg-[#1b1f23] text-white"
                disabled={profile.github.startsWith('oauth:')}
              >
                <Github className="mr-2 h-4 w-4" />
                Connect with GitHub
              </Button>
            </div>
            {profile.github.startsWith('oauth:') && (
              <div className="mt-2 text-sm text-green-500 flex items-center">
                <Github className="mr-2 h-4 w-4" />
                Connected via GitHub OAuth ({profile.github.replace('oauth:', '')})
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-300">
              <Linkedin className="mr-2 h-4 w-4" /> LinkedIn
            </label>
            <Input 
              name="linkedin"
              value={profile.linkedin}
              onChange={handleInputChange}
              className="bg-automate-dark-gray border-gray-700 text-white"
            />
          </div>
          
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-300">
              <Globe className="mr-2 h-4 w-4" /> Devpost
            </label>
            <Input 
              name="devpost"
              value={profile.devpost}
              onChange={handleInputChange}
              className="bg-automate-dark-gray border-gray-700 text-white"
            />
          </div>
        </div>
        
        {/* Bio */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Bio</h2>
          <Textarea 
            name="bio"
            value={profile.bio}
            onChange={handleInputChange}
            rows={4}
            className="bg-automate-dark-gray border-gray-700 text-white"
          />
        </div>
        
        {/* Save Button */}
        <Button 
          onClick={handleSaveProfile}
          className="w-full bg-automate-purple hover:bg-automate-purple/90 text-white"
        >
          <Save className="mr-2 h-4 w-4" /> Save Changes
        </Button>
      </div>
    </div>
  );
};

const ProfilePage = () => {
  return (
    <AppLayout>
      <Profile />
    </AppLayout>
  );
};

export default ProfilePage;
