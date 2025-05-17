
import { supabase } from '@/integrations/supabase/client';
import { generateStudySessions } from '@/lib/gemini';
import { toast } from '@/components/ui/use-toast';

interface Task {
  id?: string;
  clerk_id: string;
  title: string;
  description?: string;
  due_date?: string;
  priority?: string;
  subject?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

interface StudySession {
  id?: string;
  clerk_id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  subject?: string;
  status?: string;
  related_task_id?: string;
  created_at?: string;
  updated_at?: string;
}

// Task functions
export async function fetchTasks(clerkId: string) {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('clerk_id', clerkId)
    .order('due_date', { ascending: true, nullsLast: true });
  
  if (error) {
    console.error('Error fetching tasks:', error);
    toast({
      title: 'Error',
      description: 'Failed to load tasks.',
      variant: 'destructive',
    });
    return [];
  }
  
  return data;
}

export async function addTask(task: Task) {
  const { data, error } = await supabase
    .from('tasks')
    .insert(task)
    .select()
    .single();
  
  if (error) {
    console.error('Error adding task:', error);
    toast({
      title: 'Error',
      description: 'Failed to add task.',
      variant: 'destructive',
    });
    return null;
  }
  
  return data;
}

export async function updateTask(id: string, updates: Partial<Task>) {
  const { data, error } = await supabase
    .from('tasks')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating task:', error);
    toast({
      title: 'Error',
      description: 'Failed to update task.',
      variant: 'destructive',
    });
    return null;
  }
  
  return data;
}

export async function deleteTask(id: string) {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting task:', error);
    toast({
      title: 'Error',
      description: 'Failed to delete task.',
      variant: 'destructive',
    });
    return false;
  }
  
  return true;
}

// Study sessions functions
export async function fetchStudySessions(clerkId: string) {
  const { data, error } = await supabase
    .from('study_sessions')
    .select('*')
    .eq('clerk_id', clerkId)
    .order('start_time', { ascending: true });
  
  if (error) {
    console.error('Error fetching study sessions:', error);
    toast({
      title: 'Error',
      description: 'Failed to load study sessions.',
      variant: 'destructive',
    });
    return [];
  }
  
  return data;
}

export async function addStudySession(session: StudySession) {
  const { data, error } = await supabase
    .from('study_sessions')
    .insert(session)
    .select()
    .single();
  
  if (error) {
    console.error('Error adding study session:', error);
    toast({
      title: 'Error',
      description: 'Failed to add study session.',
      variant: 'destructive',
    });
    return null;
  }
  
  return data;
}

export async function updateStudySession(id: string, updates: Partial<StudySession>) {
  const { data, error } = await supabase
    .from('study_sessions')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating study session:', error);
    toast({
      title: 'Error',
      description: 'Failed to update study session.',
      variant: 'destructive',
    });
    return null;
  }
  
  return data;
}

export async function deleteStudySession(id: string) {
  const { error } = await supabase
    .from('study_sessions')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting study session:', error);
    toast({
      title: 'Error',
      description: 'Failed to delete study session.',
      variant: 'destructive',
    });
    return false;
  }
  
  return true;
}

// AI-powered session generation
export async function generateAndSaveStudySessions(clerkId: string) {
  try {
    // Fetch all tasks for this user
    const tasks = await fetchTasks(clerkId);
    
    if (tasks.length === 0) {
      toast({
        title: 'No tasks found',
        description: 'Please add some tasks first to generate study sessions.',
      });
      return [];
    }
    
    // Generate study sessions using Gemini AI
    const aiGeneratedSessions = await generateStudySessions(tasks);
    
    if (aiGeneratedSessions.length === 0) {
      toast({
        title: 'Generation failed',
        description: 'Could not generate study sessions. Please try again.',
        variant: 'destructive',
      });
      return [];
    }
    
    // Prepare sessions to save to the database
    const sessionsToSave = aiGeneratedSessions.map(session => ({
      clerk_id: clerkId,
      title: session.title,
      description: session.description,
      start_time: session.start_time,
      end_time: session.end_time,
      subject: session.subject,
      related_task_id: session.related_task_id,
      status: 'scheduled'
    }));
    
    // Save sessions to database
    const { data, error } = await supabase
      .from('study_sessions')
      .insert(sessionsToSave)
      .select();
    
    if (error) {
      console.error('Error saving generated study sessions:', error);
      toast({
        title: 'Error',
        description: 'Failed to save generated study sessions.',
        variant: 'destructive',
      });
      return [];
    }
    
    toast({
      title: 'Success',
      description: `Generated ${data.length} study sessions for your tasks.`,
    });
    
    return data;
  } catch (error) {
    console.error('Error in generate and save study sessions:', error);
    toast({
      title: 'Error',
      description: 'An unexpected error occurred while generating study sessions.',
      variant: 'destructive',
    });
    return [];
  }
}
