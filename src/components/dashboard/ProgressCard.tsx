
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckSquare } from 'lucide-react';

const ProgressCard = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <CheckSquare className="h-5 w-5 mr-2" />
          <span>Weekly Progress</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Tasks Completed</span>
              <span className="text-sm font-medium">15/20</span>
            </div>
            <Progress value={75} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Study Hours</span>
              <span className="text-sm font-medium">12/15 hours</span>
            </div>
            <Progress value={80} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Materials Reviewed</span>
              <span className="text-sm font-medium">8/10</span>
            </div>
            <Progress value={80} className="h-2" />
          </div>
          
          <div className="pt-3 mt-3 border-t text-center">
            <p className="text-sm text-muted-foreground">
              You've had a productive week! 
              <span className="text-primary-foreground">80% of goals completed</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressCard;
