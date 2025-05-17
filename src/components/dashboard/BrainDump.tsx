
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pencil, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const BrainDump = () => {
  const [content, setContent] = useState('');
  const [savedNotes, setSavedNotes] = useState<{id: number, content: string, date: Date}[]>([
    { id: 1, content: "Remember to email professor about the paper extension!", date: new Date() },
    { id: 2, content: "Study group meeting on Thursday at the library, 2nd floor", date: new Date() }
  ]);
  const { toast } = useToast();

  const saveNote = () => {
    if (content.trim()) {
      const newNote = {
        id: Date.now(),
        content: content,
        date: new Date()
      };
      setSavedNotes([newNote, ...savedNotes]);
      setContent('');
      toast({
        title: "Note saved",
        description: "Your brain dump note has been saved.",
      });
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <Pencil className="h-5 w-5 mr-2" />
          <span>Brain Dump</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Textarea 
            placeholder="Quickly capture ideas, thoughts, or reminders..." 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="resize-none h-24 studyflow-input"
          />
          <div className="flex justify-end mt-2">
            <Button onClick={saveNote} size="sm" className="flex items-center gap-1">
              <Save className="h-4 w-4" />
              <span>Save</span>
            </Button>
          </div>
        </div>
        
        {savedNotes.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">Recent notes</h4>
            {savedNotes.map((note) => (
              <div 
                key={note.id} 
                className="p-3 border border-neutral-100 rounded-lg bg-studyflow-lavender/10"
              >
                <p className="text-sm">{note.content}</p>
                <p className="text-xs text-muted-foreground mt-1">{formatDate(note.date)}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BrainDump;
