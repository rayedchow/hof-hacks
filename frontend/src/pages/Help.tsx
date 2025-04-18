
import React, { useState } from 'react';
import { 
  HelpCircle, 
  BookOpen, 
  MessageCircle, 
  VideoIcon, 
  FileText, 
  Search, 
  ChevronRight,
  ChevronDown,
  ExternalLink
} from 'lucide-react';

// FAQ item interface
interface FAQItem {
  id: string;
  question: string;
  answer: string;
  isOpen: boolean;
}

const Help = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [faqs, setFaqs] = useState<FAQItem[]>([
    {
      id: '1',
      question: 'How do I create a new job?',
      answer: 'To create a new job, navigate to the Jobs section and click on the "Create New Job" button. Fill in the required details such as job name, type, and configuration settings. Click "Save" to create the job.',
      isOpen: false,
    },
    {
      id: '2',
      question: 'What types of jobs can I create?',
      answer: 'AutoMate Pro supports three main job types: Batch Jobs (for processing large sets of data), Real-Time Jobs (for immediate processing), and Scheduled Jobs (for recurring tasks).',
      isOpen: false,
    },
    {
      id: '3',
      question: 'How do I schedule recurring jobs?',
      answer: 'To schedule a recurring job, go to the Schedules section and click on "New Schedule". You can then set up the recurrence pattern (daily, weekly, monthly) and specify the time for execution.',
      isOpen: false,
    },
    {
      id: '4',
      question: 'How can I view job execution logs?',
      answer: 'Job execution logs are available in the Logs section. You can filter logs by job name, status, and date range to find specific information.',
      isOpen: false,
    },
    {
      id: '5',
      question: 'How do I configure integrations with other systems?',
      answer: 'Integrations can be configured in the Settings section under the Integrations tab. Select the desired integration and follow the configuration instructions.',
      isOpen: false,
    },
  ]);
  
  // Toggle FAQ item open/closed state
  const toggleFAQ = (id: string) => {
    setFaqs(faqs.map(faq => 
      faq.id === id ? { ...faq, isOpen: !faq.isOpen } : faq
    ));
  };
  
  // Filter FAQs based on search term
  const filteredFAQs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Quick help cards data
  const quickHelpCards = [
    {
      icon: BookOpen,
      title: 'Documentation',
      description: 'Read the full documentation to learn about all features',
      action: 'Browse Docs',
    },
    {
      icon: VideoIcon,
      title: 'Video Tutorials',
      description: 'Watch step-by-step guides on how to use AutoMate Pro',
      action: 'Watch Now',
    },
    {
      icon: MessageCircle,
      title: 'Community Forums',
      description: 'Join discussions and get help from the community',
      action: 'Visit Forums',
    },
    {
      icon: FileText,
      title: 'API Reference',
      description: 'Explore our API documentation for developers',
      action: 'View API Docs',
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Help & Support</h1>
      
      {/* Search bar */}
      <div className="flex items-center bg-automate-dark-gray rounded-md border border-gray-800 px-3 mb-6 max-w-2xl">
        <Search size={18} className="text-gray-400" />
        <input 
          type="text"
          placeholder="Search for help topics..."
          className="bg-transparent border-none outline-none px-2 py-3 text-white w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Quick Help Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {quickHelpCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="automate-card hover:border-automate-purple cursor-pointer transition-colors">
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <div className="w-10 h-10 rounded-full bg-automate-purple/20 flex items-center justify-center">
                    <Icon className="text-automate-purple" size={20} />
                  </div>
                </div>
                <h3 className="text-lg font-medium mb-2">{card.title}</h3>
                <p className="text-gray-400 text-sm mb-4 flex-1">{card.description}</p>
                <div className="flex items-center text-automate-purple hover:text-automate-purple-light mt-auto">
                  <span>{card.action}</span>
                  <ExternalLink size={16} className="ml-1" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* FAQs */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <HelpCircle size={20} className="mr-2 text-automate-purple" />
          Frequently Asked Questions
        </h2>
        
        <div className="automate-card">
          {filteredFAQs.length > 0 ? (
            <div className="divide-y divide-gray-800">
              {filteredFAQs.map((faq) => (
                <div key={faq.id} className="py-3">
                  <button
                    className="w-full text-left flex items-center justify-between py-2 focus:outline-none"
                    onClick={() => toggleFAQ(faq.id)}
                  >
                    <span className="font-medium">{faq.question}</span>
                    {faq.isOpen ? (
                      <ChevronDown size={20} className="text-gray-400" />
                    ) : (
                      <ChevronRight size={20} className="text-gray-400" />
                    )}
                  </button>
                  {faq.isOpen && (
                    <div className="mt-2 text-gray-300 pl-4">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-gray-400">No matching FAQs found. Try a different search term.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Contact Support */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <MessageCircle size={20} className="mr-2 text-automate-purple" />
          Need More Help?
        </h2>
        
        <div className="automate-card">
          <p className="mb-4 text-gray-300">
            If you can't find the answer you're looking for, our support team is ready to help.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="automate-button">
              Contact Support
            </button>
            <button className="px-4 py-2 bg-automate-dark-gray text-white rounded-md hover:bg-gray-700 transition-colors">
              Submit Feature Request
            </button>
            <button className="px-4 py-2 bg-automate-dark-gray text-white rounded-md hover:bg-gray-700 transition-colors">
              Report a Bug
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
