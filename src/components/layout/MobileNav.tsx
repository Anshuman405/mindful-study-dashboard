
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Home, BookOpen, ListTodo, FileImage } from 'lucide-react';

const MobileNav = () => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-100 z-40">
      <div className="flex items-center justify-around">
        <Button variant="ghost" className="flex-1 flex-col py-2 rounded-none">
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">Home</span>
        </Button>
        <Button variant="ghost" className="flex-1 flex-col py-2 rounded-none">
          <Calendar className="h-5 w-5" />
          <span className="text-xs mt-1">Calendar</span>
        </Button>
        <Button variant="ghost" className="flex-1 flex-col py-2 rounded-none">
          <ListTodo className="h-5 w-5" />
          <span className="text-xs mt-1">Tasks</span>
        </Button>
        <Button variant="ghost" className="flex-1 flex-col py-2 rounded-none">
          <BookOpen className="h-5 w-5" />
          <span className="text-xs mt-1">Notes</span>
        </Button>
      </div>
    </div>
  );
};

export default MobileNav;
