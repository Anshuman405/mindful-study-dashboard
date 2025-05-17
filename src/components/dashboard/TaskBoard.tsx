
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ListTodo, Plus, CheckSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const TaskBoard = () => {
  const [newTask, setNewTask] = useState('');
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Complete Math assignment', completed: false, priority: 'high', subject: 'Mathematics' },
    { id: 2, title: 'Read Chapter 7 of History textbook', completed: false, priority: 'medium', subject: 'History' },
    { id: 3, title: 'Prepare notes for Physics lab', completed: true, priority: 'high', subject: 'Physics' },
    { id: 4, title: 'Review English literature essay', completed: false, priority: 'low', subject: 'English' },
  ]);

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([
        ...tasks, 
        { 
          id: Date.now(), 
          title: newTask, 
          completed: false,
          priority: 'medium',
          subject: 'General'
        }
      ]);
      setNewTask('');
    }
  };

  const toggleTaskCompletion = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const getPriorityClass = (priority: string) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <ListTodo className="h-5 w-5 mr-2" />
          <span>Tasks & Assignments</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex mb-4">
          <Input
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="flex-1 mr-2 studyflow-input"
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
          />
          <Button onClick={addTask} size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-2">
          {tasks.map((task) => (
            <div 
              key={task.id} 
              className={`p-3 border rounded-lg flex items-start ${task.completed ? 'bg-muted/30' : 'bg-white'}`}
            >
              <button 
                onClick={() => toggleTaskCompletion(task.id)} 
                className="mr-2 mt-0.5 text-muted-foreground hover:text-primary transition-colors"
              >
                <CheckSquare className={`h-5 w-5 ${task.completed ? 'text-studyflow-mint' : ''}`} />
              </button>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className={`font-medium text-sm ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {task.title}
                  </h4>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityClass(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{task.subject}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskBoard;
