
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Home, BookOpen, ListTodo, FileImage } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-neutral-100 h-screen bg-studyflow-gray/30">
      <div className="p-4">
        <div className="flex flex-col gap-1">
          <Button variant="ghost" className="justify-start gap-3 h-10">
            <Home className="h-5 w-5" />
            <span>Dashboard</span>
          </Button>
          <Button variant="ghost" className="justify-start gap-3 h-10">
            <Calendar className="h-5 w-5" />
            <span>Calendar</span>
          </Button>
          <Button variant="ghost" className="justify-start gap-3 h-10">
            <ListTodo className="h-5 w-5" />
            <span>Tasks</span>
          </Button>
          <Button variant="ghost" className="justify-start gap-3 h-10">
            <BookOpen className="h-5 w-5" />
            <span>Study Notes</span>
          </Button>
          <Button variant="ghost" className="justify-start gap-3 h-10">
            <FileImage className="h-5 w-5" />
            <span>Materials</span>
          </Button>
        </div>
      </div>
      
      <div className="mt-auto p-4 border-t border-neutral-100">
        <div className="bg-studyflow-lavender/30 rounded-lg p-3">
          <h3 className="font-medium text-sm">Need a study break?</h3>
          <p className="text-xs text-muted-foreground mt-1">
            You've been studying for 2 hours. Time for a 15-min break!
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
