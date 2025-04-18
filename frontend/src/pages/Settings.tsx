
import React, { useState } from 'react';
import { 
  Bell, 
  Moon, 
  Sun, 
  User, 
  Key, 
  Globe, 
  Sliders, 
  Shield, 
  Save,
  Briefcase,
  Settings as SettingsIcon
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [darkMode, setDarkMode] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [timezone, setTimezone] = useState('UTC');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <Button 
          className="bg-automate-purple hover:bg-automate-purple/90 text-white"
          onClick={() => console.log("Settings saved")}
        >
          <Save size={18} className="mr-2" />
          Save Changes
        </Button>
      </div>
      
      <Tabs defaultValue="general" onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-automate-dark-gray mb-6">
          <TabsTrigger value="general" className="data-[state=active]:bg-automate-purple data-[state=active]:text-white">
            <Sliders className="mr-2 h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-automate-purple data-[state=active]:text-white">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="account" className="data-[state=active]:bg-automate-purple data-[state=active]:text-white">
            <User className="mr-2 h-4 w-4" />
            Account
          </TabsTrigger>
          <TabsTrigger value="job-preferences" className="data-[state=active]:bg-automate-purple data-[state=active]:text-white">
            <Briefcase className="mr-2 h-4 w-4" />
            Job Preferences
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-automate-purple data-[state=active]:text-white">
            <Key className="mr-2 h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-6">
          <Card className="bg-automate-dark-gray border-gray-700">
            <CardHeader>
              <CardTitle>Theme Preferences</CardTitle>
              <CardDescription>Customize the appearance of your application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sun size={20} className="text-yellow-400" />
                  <span>Light</span>
                </div>
                <Switch 
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                />
                <div className="flex items-center gap-2">
                  <span>Dark</span>
                  <Moon size={20} className="text-blue-300" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-automate-dark-gray border-gray-700">
            <CardHeader>
              <CardTitle>Date & Time</CardTitle>
              <CardDescription>Configure date and time formats</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Timezone</label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger className="bg-automate-black border-gray-700 text-white">
                    <SelectValue placeholder="Select Timezone" />
                  </SelectTrigger>
                  <SelectContent className="bg-automate-black text-white">
                    <SelectItem value="UTC">UTC (Coordinated Universal Time)</SelectItem>
                    <SelectItem value="EST">EST (Eastern Standard Time)</SelectItem>
                    <SelectItem value="CST">CST (Central Standard Time)</SelectItem>
                    <SelectItem value="MST">MST (Mountain Standard Time)</SelectItem>
                    <SelectItem value="PST">PST (Pacific Standard Time)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Date Format</label>
                <Select value={dateFormat} onValueChange={setDateFormat}>
                  <SelectTrigger className="bg-automate-black border-gray-700 text-white">
                    <SelectValue placeholder="Select Format" />
                  </SelectTrigger>
                  <SelectContent className="bg-automate-black text-white">
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    <SelectItem value="MMM D, YYYY">MMM D, YYYY</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-automate-dark-gray border-gray-700">
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell size={20} className="text-automate-purple" />
                  <span>Email Notifications</span>
                </div>
                <Switch 
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell size={20} className="text-automate-purple" />
                  <span>Push Notifications</span>
                </div>
                <Switch 
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-automate-dark-gray border-gray-700">
            <CardHeader>
              <CardTitle>Job Alert Preferences</CardTitle>
              <CardDescription>Select the types of job alerts you want to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span>New job matches</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span>Application updates</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span>Interview reminders</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span>Job recommendation</span>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="account" className="space-y-6">
          {/* Rest of settings tabs would go here */}
          <Card className="bg-automate-dark-gray border-gray-700">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input 
                  defaultValue="Alex Johnson" 
                  className="bg-automate-black border-gray-700 text-white" 
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <Input 
                  defaultValue="alex.johnson@example.com" 
                  className="bg-automate-black border-gray-700 text-white" 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="job-preferences" className="space-y-6">
          <Card className="bg-automate-dark-gray border-gray-700">
            <CardHeader>
              <CardTitle>Job Preferences</CardTitle>
              <CardDescription>Set your job search preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Job Types</label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="full-time" defaultChecked className="rounded text-automate-purple" />
                    <label htmlFor="full-time">Full-time</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="part-time" className="rounded text-automate-purple" />
                    <label htmlFor="part-time">Part-time</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="contract" defaultChecked className="rounded text-automate-purple" />
                    <label htmlFor="contract">Contract</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="remote" defaultChecked className="rounded text-automate-purple" />
                    <label htmlFor="remote">Remote</label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Skills</label>
                <Input 
                  placeholder="e.g., React, TypeScript, Node.js" 
                  className="bg-automate-black border-gray-700 text-white" 
                  defaultValue="React, TypeScript, Node.js, GraphQL"
                />
                <p className="text-xs text-gray-400">Separate skills with commas</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Experience Level</label>
                <Select defaultValue="mid">
                  <SelectTrigger className="bg-automate-black border-gray-700 text-white">
                    <SelectValue placeholder="Select Level" />
                  </SelectTrigger>
                  <SelectContent className="bg-automate-black text-white">
                    <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                    <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
                    <SelectItem value="senior">Senior (5+ years)</SelectItem>
                    <SelectItem value="lead">Lead/Manager (7+ years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Desired Salary</label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Min" 
                    defaultValue="90,000" 
                    className="bg-automate-black border-gray-700 text-white" 
                  />
                  <span className="flex items-center">-</span>
                  <Input 
                    placeholder="Max" 
                    defaultValue="130,000" 
                    className="bg-automate-black border-gray-700 text-white" 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-6">
          {/* Similar to other tabs */}
          <Card className="bg-automate-dark-gray border-gray-700">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield size={20} className="text-automate-purple" />
                  <span>Two-Factor Authentication</span>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield size={20} className="text-automate-purple" />
                  <span>Session Timeout (30 minutes)</span>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-automate-dark-gray border-gray-700">
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your account password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Current Password</label>
                <Input 
                  type="password" 
                  placeholder="Enter current password" 
                  className="bg-automate-black border-gray-700 text-white" 
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">New Password</label>
                <Input 
                  type="password" 
                  placeholder="Enter new password" 
                  className="bg-automate-black border-gray-700 text-white" 
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Confirm New Password</label>
                <Input 
                  type="password" 
                  placeholder="Confirm new password" 
                  className="bg-automate-black border-gray-700 text-white" 
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-automate-purple hover:bg-automate-purple/90 text-white">
                Update Password
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
