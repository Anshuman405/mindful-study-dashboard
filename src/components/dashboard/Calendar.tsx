
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';

const CalendarView = () => {
  // Example study sessions data
  const studySessions = [
    { id: 1, subject: 'Mathematics', time: '9:00 AM - 10:30 AM', color: 'bg-blue-100 border-blue-300' },
    { id: 2, subject: 'History', time: '11:00 AM - 12:30 PM', color: 'bg-green-100 border-green-300' },
    { id: 3, subject: 'Physics Lab', time: '2:00 PM - 3:30 PM', color: 'bg-purple-100 border-purple-300' },
    { id: 4, subject: 'English Literature', time: '4:00 PM - 5:30 PM', color: 'bg-yellow-100 border-yellow-300' },
  ];

  // Days of the week
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const currentDate = new Date();
  const currentDay = currentDate.getDay();
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2" />
            <span>Study Calendar</span>
          </div>
          <Button variant="ghost" size="sm" className="text-sm">View all</Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex justify-between mb-4">
          {weekdays.map((day, i) => (
            <div 
              key={i} 
              className={`flex flex-col items-center justify-center w-9 h-9 rounded-full text-xs
                ${i === currentDay ? 'bg-studyflow-lavender text-primary-foreground font-medium' : ''}
              `}
            >
              <span>{day}</span>
            </div>
          ))}
        </div>
        
        <div className="space-y-3">
          {studySessions.map((session) => (
            <div 
              key={session.id} 
              className={`p-3 rounded-lg border ${session.color} flex items-start`}
            >
              <div className="mr-2">
                <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
              </div>
              <div>
                <h4 className="font-medium text-sm">{session.subject}</h4>
                <p className="text-xs text-muted-foreground">{session.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Import Button component
import { Button } from '@/components/ui/button';

export default CalendarView;
