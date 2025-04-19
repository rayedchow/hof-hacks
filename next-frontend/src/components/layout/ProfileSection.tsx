
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Github, Linkedin, Globe, Mail, Phone, Save } from 'lucide-react';

const ProfileSection = () => {
  // Profile state
  const [profile, setProfile] = useState({
    email: 'user@example.com',
    phone: '(555) 123-4567',
    github: 'https://github.com/username',
    linkedin: 'https://linkedin.com/in/username',
    devpost: 'https://devpost.com/username',
    bio: 'Software engineer with 5+ years of experience in web development, specializing in React and TypeScript.'
  });
  
  const [resume, setResume] = useState<File | null>(null);
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle resume upload
  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setResume(e.target.files[0]);
    }
  };
  
  // Handle save profile
  const handleSaveProfile = () => {
    console.log('Profile saved:', profile);
    console.log('Resume:', resume);
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-semibold mb-4">Profile</h2>
      
      {/* Resume Upload */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">Resume</label>
        <div className="flex items-center gap-2">
          <Input 
            type="file" 
            id="resume"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={handleResumeUpload}
          />
          <Button 
            className="bg-automate-dark-gray hover:bg-gray-700 text-white"
            onClick={() => document.getElementById('resume')?.click()}
          >
            <Upload className="mr-2 h-4 w-4" />
            {resume ? resume.name : 'Upload Resume'}
          </Button>
          {resume && <span className="text-sm text-gray-400 truncate max-w-[150px]">{resume.name}</span>}
        </div>
      </div>
      
      {/* Contact Information */}
      <div className="space-y-4">
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
      
      {/* Social Links */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-300">
            <Github className="mr-2 h-4 w-4" /> GitHub
          </label>
          <Input 
            name="github"
            value={profile.github}
            onChange={handleInputChange}
            className="bg-automate-dark-gray border-gray-700 text-white"
          />
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
        <label className="block text-sm font-medium text-gray-300">Bio</label>
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
  );
};

export default ProfileSection;
