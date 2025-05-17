
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ListTodo, Plus, CheckSquare, Pencil, Trash2, Calendar } from 'lucide-react';
import { useAuth } from '@/context/auth';
import { fetchTasks, addTask, updateTask, deleteTask } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import { format, parseISO } from 'date-fns';

interface Task {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  priority?: string;
  subject?: string;
  status?: string;
}

const TaskBoard = () => {
  const { userId } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    subject: '',
    status: 'pending'
  });
  
  const priorities = ['high', 'medium', 'low'];
  const statuses = ['pending', 'in-progress', 'completed'];
  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Literature', 'Computer Science', 'Economics', 'General'];
  
  useEffect(() => {
    if (userId) {
      loadTasks();
    }
  }, [userId]);
  
  const loadTasks = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const data = await fetchTasks(userId);
      setTasks(data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddTask = () => {
    setSelectedTask(null);
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      subject: '',
      status: 'pending'
    });
    setIsDialogOpen(true);
  };
  
  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      dueDate: task.due_date ? format(parseISO(task.due_date), 'yyyy-MM-dd') : '',
      priority: task.priority || 'medium',
      subject: task.subject || '',
      status: task.status || 'pending'
    });
    setIsDialogOpen(true);
  };
  
  const handleDeleteTask = async (taskId: string) => {
    if (!userId) return;
    
    try {
      await deleteTask(taskId);
      toast({
        title: 'Success',
        description: 'Task deleted successfully',
      });
      loadTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };
  
  const handleToggleTaskCompletion = async (task: Task) => {
    if (!userId) return;
    
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      await updateTask(task.id, { status: newStatus });
      loadTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };
  
  const handleSaveTask = async () => {
    if (!userId) return;
    
    try {
      const taskData = {
        clerk_id: userId,
        title: formData.title,
        description: formData.description || undefined,
        due_date: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
        priority: formData.priority,
        subject: formData.subject || undefined,
        status: formData.status
      };
      
      if (selectedTask) {
        // Update existing task
        await updateTask(selectedTask.id, taskData);
        toast({
          title: 'Success',
          description: 'Task updated successfully',
        });
      } else {
        // Add new task
        await addTask(taskData);
        toast({
          title: 'Success',
          description: 'Task added successfully',
        });
      }
      
      setIsDialogOpen(false);
      loadTasks();
    } catch (error) {
      console.error('Error saving task:', error);
      toast({
        title: 'Error',
        description: 'Failed to save task',
        variant: 'destructive',
      });
    }
  };
  
  const getPriorityClass = (priority?: string) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusClass = (status?: string) => {
    switch(status) {
      case 'completed': return 'line-through text-muted-foreground';
      case 'in-progress': return 'text-blue-800';
      default: return '';
    }
  };
  
  // Group tasks by status
  const pendingTasks = tasks.filter(task => task.status !== 'completed');
  const completedTasks = tasks.filter(task => task.status === 'completed');
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <ListTodo className="h-5 w-5 mr-2" />
            <span>Tasks & Assignments</span>
          </CardTitle>
          <Button onClick={handleAddTask} size="sm">
            <Plus className="h-4 w-4 mr-1" /> Add Task
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-4 text-center text-muted-foreground">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <p>No tasks yet. Create your first task to get started!</p>
          </div>
        ) : (
          <div>
            {/* Active Tasks */}
            <div className="space-y-2 mb-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Active Tasks ({pendingTasks.length})</h3>
              {pendingTasks.map((task) => (
                <div 
                  key={task.id} 
                  className="p-3 border rounded-lg flex items-start bg-white"
                >
                  <button 
                    onClick={() => handleToggleTaskCompletion(task)} 
                    className="mr-2 mt-0.5 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <CheckSquare className={`h-5 w-5 ${task.status === 'completed' ? 'text-studyflow-mint' : ''}`} />
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-medium text-sm ${getStatusClass(task.status)}`}>
                        {task.title}
                      </h4>
                      <div className="flex gap-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityClass(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                    {task.description && (
                      <p className="text-xs text-muted-foreground mt-1">{task.description}</p>
                    )}
                    <div className="flex justify-between items-center mt-2">
                      {task.subject && (
                        <span className="text-xs text-muted-foreground">{task.subject}</span>
                      )}
                      <div className="flex gap-3">
                        {task.due_date && (
                          <span className="text-xs flex items-center text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1" />
                            {format(parseISO(task.due_date), 'MMM d')}
                          </span>
                        )}
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleEditTask(task)} 
                            className="text-muted-foreground hover:text-primary"
                          >
                            <Pencil className="h-3 w-3" />
                          </button>
                          <button 
                            onClick={() => handleDeleteTask(task.id)} 
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
              <div className="space-y-2 mt-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Completed ({completedTasks.length})</h3>
                {completedTasks.map((task) => (
                  <div 
                    key={task.id} 
                    className="p-3 border rounded-lg flex items-start bg-muted/30"
                  >
                    <button 
                      onClick={() => handleToggleTaskCompletion(task)} 
                      className="mr-2 mt-0.5 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <CheckSquare className="h-5 w-5 text-studyflow-mint" />
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm line-through text-muted-foreground">
                          {task.title}
                        </h4>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        {task.subject && (
                          <span className="text-xs text-muted-foreground">{task.subject}</span>
                        )}
                        <button 
                          onClick={() => handleDeleteTask(task.id)} 
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      {/* Task Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedTask ? 'Edit Task' : 'Add New Task'}</DialogTitle>
            <DialogDescription>
              {selectedTask ? 'Update your task details below.' : 'Enter the details of your new task.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="title" className="text-sm font-medium">Task Title</label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="What do you need to do?"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium">Description (optional)</label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Add some details about this task..."
                rows={3}
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="subject" className="text-sm font-medium">Subject (optional)</label>
              <Select 
                value={formData.subject} 
                onValueChange={(value) => setFormData({...formData, subject: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map(subject => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="dueDate" className="text-sm font-medium">Due Date (optional)</label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="priority" className="text-sm font-medium">Priority</label>
                <Select 
                  value={formData.priority} 
                  onValueChange={(value) => setFormData({...formData, priority: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map(priority => (
                      <SelectItem key={priority} value={priority}>
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="status" className="text-sm font-medium">Status</label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => setFormData({...formData, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map(status => (
                      <SelectItem key={status} value={status}>
                        {status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTask} disabled={!formData.title}>
              {selectedTask ? 'Save Changes' : 'Add Task'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default TaskBoard;
