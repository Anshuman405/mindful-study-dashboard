
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, isWithinInterval, parseISO, startOfDay, addHours } from 'date-fns';
import { CalendarIcon, Sparkles, Pencil, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/auth';
import { fetchStudySessions, addStudySession, updateStudySession, deleteStudySession, generateAndSaveStudySessions } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';

interface StudySession {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  subject?: string;
  status?: string;
  related_task_id?: string;
}

const EnhancedCalendar = () => {
  const { userId } = useAuth();
  const [date, setDate] = useState<Date>(new Date());
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<StudySession | null>(null);
  const [editMode, setEditMode] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    date: new Date(),
    startTime: '09:00',
    endTime: '10:00'
  });
  
  // Color mapping for subjects
  const subjectColors: Record<string, string> = {
    'Mathematics': 'bg-blue-100 border-blue-300',
    'Physics': 'bg-purple-100 border-purple-300',
    'Chemistry': 'bg-green-100 border-green-300',
    'Biology': 'bg-yellow-100 border-yellow-300',
    'History': 'bg-orange-100 border-orange-300',
    'Literature': 'bg-pink-100 border-pink-300',
    'Computer Science': 'bg-indigo-100 border-indigo-300',
    'Economics': 'bg-red-100 border-red-300',
    'General': 'bg-gray-100 border-gray-300'
  };
  
  // Load study sessions
  useEffect(() => {
    if (userId) {
      loadSessions();
    }
  }, [userId]);
  
  const loadSessions = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const data = await fetchStudySessions(userId);
      setSessions(data);
    } catch (error) {
      console.error('Error loading sessions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load study sessions',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Generate sessions with AI
  const handleGenerateSessions = async () => {
    if (!userId) return;
    
    setIsGenerating(true);
    try {
      await generateAndSaveStudySessions(userId);
      await loadSessions();
    } catch (error) {
      console.error('Error generating sessions:', error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Calendar day renderer
  const renderDay = (day: Date, cellProps: object) => {
    const dayStart = startOfDay(day);
    const sessionsOnDay = sessions.filter((session) => {
      const sessionStart = parseISO(session.start_time);
      return dayStart.getDate() === sessionStart.getDate() && 
             dayStart.getMonth() === sessionStart.getMonth() && 
             dayStart.getFullYear() === sessionStart.getFullYear();
    });
    
    const hasSession = sessionsOnDay.length > 0;
    
    return (
      <div className="relative">
        {hasSession && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-studyflow-lavender rounded-full" />
        )}
      </div>
    );
  };
  
  // Get sessions for selected date
  const getSessionsForSelectedDate = () => {
    if (!date) return [];
    
    const dayStart = startOfDay(date);
    return sessions.filter((session) => {
      const sessionStart = parseISO(session.start_time);
      return dayStart.getDate() === sessionStart.getDate() && 
             dayStart.getMonth() === sessionStart.getMonth() && 
             dayStart.getFullYear() === sessionStart.getFullYear();
    }).sort((a, b) => {
      return parseISO(a.start_time).getTime() - parseISO(b.start_time).getTime();
    });
  };
  
  // Handle view session details
  const handleViewSession = (session: StudySession) => {
    setSelectedSession(session);
    setIsDialogOpen(true);
    setEditMode(false);
  };
  
  // Handle edit session
  const handleEditSession = (session: StudySession) => {
    setSelectedSession(session);
    setEditMode(true);
    
    const startDate = parseISO(session.start_time);
    const endDate = parseISO(session.end_time);
    
    setFormData({
      title: session.title,
      description: session.description || '',
      subject: session.subject || '',
      date: startDate,
      startTime: format(startDate, 'HH:mm'),
      endTime: format(endDate, 'HH:mm')
    });
    
    setIsDialogOpen(true);
  };
  
  // Handle delete session
  const handleDeleteSession = async (sessionId: string) => {
    if (!userId) return;
    
    if (window.confirm('Are you sure you want to delete this study session?')) {
      try {
        await deleteStudySession(sessionId);
        toast({
          title: 'Success',
          description: 'Study session deleted successfully',
        });
        await loadSessions();
      } catch (error) {
        console.error('Error deleting session:', error);
      }
    }
  };
  
  // Handle new session
  const handleNewSession = () => {
    setSelectedSession(null);
    setEditMode(true);
    
    // Default to current date and next hour slot
    const now = new Date();
    const nextHour = addHours(now, 1);
    
    setFormData({
      title: '',
      description: '',
      subject: '',
      date: date,
      startTime: format(now, 'HH:mm'),
      endTime: format(nextHour, 'HH:mm')
    });
    
    setIsDialogOpen(true);
  };
  
  // Handle save session
  const handleSaveSession = async () => {
    if (!userId) return;
    
    try {
      const startDateTime = new Date(formData.date);
      const [startHours, startMinutes] = formData.startTime.split(':');
      startDateTime.setHours(parseInt(startHours, 10), parseInt(startMinutes, 10));
      
      const endDateTime = new Date(formData.date);
      const [endHours, endMinutes] = formData.endTime.split(':');
      endDateTime.setHours(parseInt(endHours, 10), parseInt(endMinutes, 10));
      
      if (endDateTime <= startDateTime) {
        toast({
          title: 'Invalid time range',
          description: 'End time must be after start time',
          variant: 'destructive',
        });
        return;
      }
      
      const sessionData = {
        clerk_id: userId,
        title: formData.title,
        description: formData.description || undefined,
        subject: formData.subject || undefined,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        status: 'scheduled'
      };
      
      if (selectedSession) {
        // Update existing session
        await updateStudySession(selectedSession.id, sessionData);
        toast({
          title: 'Success',
          description: 'Study session updated successfully',
        });
      } else {
        // Add new session
        await addStudySession(sessionData);
        toast({
          title: 'Success',
          description: 'Study session added successfully',
        });
      }
      
      setIsDialogOpen(false);
      loadSessions();
    } catch (error) {
      console.error('Error saving session:', error);
      toast({
        title: 'Error',
        description: 'Failed to save study session',
        variant: 'destructive',
      });
    }
  };
  
  // Get color based on subject
  const getSubjectColor = (subject?: string) => {
    if (!subject) return subjectColors['General'];
    return subjectColors[subject] || subjectColors['General'];
  };
  
  // Format time for display
  const formatSessionTime = (start: string, end: string) => {
    return `${format(parseISO(start), 'h:mm a')} - ${format(parseISO(end), 'h:mm a')}`;
  };
  
  const currentDateSessions = getSessionsForSelectedDate();
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2" />
            <span>Study Calendar</span>
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleNewSession}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
            <Button 
              variant="default" 
              size="sm"
              onClick={handleGenerateSessions}
              disabled={isGenerating}
            >
              <Sparkles className="h-4 w-4 mr-1" />
              {isGenerating ? 'Generating...' : 'AI Generate'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => newDate && setDate(newDate)}
            className="rounded-md border"
            components={{
              Day: renderDay
            }}
          />
        </div>
        
        {isLoading ? (
          <div className="py-4 text-center text-muted-foreground">Loading sessions...</div>
        ) : currentDateSessions.length > 0 ? (
          <div className="space-y-3">
            <h3 className="font-medium text-sm">
              {format(date, 'MMMM d, yyyy')} · {currentDateSessions.length} Session{currentDateSessions.length !== 1 ? 's' : ''}
            </h3>
            {currentDateSessions.map((session) => (
              <div 
                key={session.id} 
                className={`p-3 rounded-lg border ${getSubjectColor(session.subject)}`}
                onClick={() => handleViewSession(session)}
              >
                <div className="flex justify-between">
                  <h4 className="font-medium text-sm">{session.title}</h4>
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        handleEditSession(session); 
                      }}
                      className="text-muted-foreground hover:text-primary"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        handleDeleteSession(session.id); 
                      }}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatSessionTime(session.start_time, session.end_time)}
                </p>
                {session.subject && (
                  <span className="inline-block text-xs px-2 py-0.5 bg-white/50 rounded-full mt-2">
                    {session.subject}
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            <p>No study sessions for {format(date, 'MMMM d, yyyy')}</p>
            <Button 
              variant="link" 
              size="sm" 
              className="mt-2"
              onClick={handleNewSession}
            >
              Add a session
            </Button>
          </div>
        )}
      </CardContent>
      
      {/* Session Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editMode 
                ? (selectedSession ? 'Edit Study Session' : 'New Study Session')
                : 'Study Session Details'
              }
            </DialogTitle>
            <DialogDescription>
              {editMode 
                ? 'Update the details of your study session.'
                : 'View details about your scheduled study session.'
              }
            </DialogDescription>
          </DialogHeader>
          
          {editMode ? (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="title" className="text-sm font-medium">Title</label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Session title"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                <Select 
                  value={formData.subject} 
                  onValueChange={(value) => setFormData({...formData, subject: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(subjectColors).map(subject => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="date" className="text-sm font-medium">Date</label>
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={(newDate) => newDate && setFormData({...formData, date: newDate})}
                  className="rounded-md border pointer-events-auto"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label htmlFor="startTime" className="text-sm font-medium">Start Time</label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="endTime" className="text-sm font-medium">End Time</label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="description" className="text-sm font-medium">Description (optional)</label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="What will you study in this session?"
                  rows={3}
                />
              </div>
            </div>
          ) : selectedSession && (
            <div className="py-4">
              <h3 className="text-lg font-semibold">{selectedSession.title}</h3>
              {selectedSession.subject && (
                <div className="mt-2">
                  <span className={`inline-block text-xs px-2 py-1 rounded-full ${getSubjectColor(selectedSession.subject)}`}>
                    {selectedSession.subject}
                  </span>
                </div>
              )}
              <div className="mt-4">
                <p className="text-sm font-medium">Time:</p>
                <p className="text-sm text-muted-foreground">
                  {format(parseISO(selectedSession.start_time), 'MMMM d, yyyy')}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatSessionTime(selectedSession.start_time, selectedSession.end_time)}
                </p>
              </div>
              {selectedSession.description && (
                <div className="mt-4">
                  <p className="text-sm font-medium">Description:</p>
                  <p className="text-sm text-muted-foreground">{selectedSession.description}</p>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            {editMode ? (
              <div className="flex gap-2 justify-end w-full">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSaveSession} disabled={!formData.title}>Save</Button>
              </div>
            ) : (
              <div className="flex gap-2 justify-end w-full">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Close</Button>
                {selectedSession && (
                  <Button onClick={() => {
                    setEditMode(true);
                    handleEditSession(selectedSession);
                  }}>
                    Edit
                  </Button>
                )}
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default EnhancedCalendar;
