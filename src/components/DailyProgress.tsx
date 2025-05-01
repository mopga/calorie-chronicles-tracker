
import React from 'react';
import { useCalorie } from '@/context/CalorieContext';
import { Card, CardContent } from '@/components/ui/card';

const DailyProgress = () => {
  const { dailyCalories, calorieGoal } = useCalorie();
  
  // Calculate percentage (max 100%)
  const percentage = Math.min(Math.round((dailyCalories / calorieGoal) * 100), 100);
  const remaining = Math.max(calorieGoal - dailyCalories, 0);
  
  const strokeDasharray = 2 * Math.PI * 45; // Circumference = 2πr
  const strokeDashoffset = strokeDasharray * (1 - percentage / 100);

  // Determine color based on percentage
  const getStatusColor = () => {
    if (percentage >= 100) return 'text-destructive';
    if (percentage >= 85) return 'text-amber-500';
    return 'text-brand-teal';
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="relative flex items-center justify-center mb-4 md:mb-0">
            <svg className="w-32 h-32">
              <circle
                className="text-gray-200"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
                r="45"
                cx="50%"
                cy="50%"
              />
              <circle
                className={`progress-ring-circle ${getStatusColor()}`}
                strokeWidth="8"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="45"
                cx="50%"
                cy="50%"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-bold">{percentage}%</span>
              <span className="text-xs text-muted-foreground">of goal</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full md:w-2/3">
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-muted-foreground text-sm">Consumed</p>
              <p className="text-2xl font-semibold mt-1">{dailyCalories}</p>
              <p className="text-xs text-muted-foreground">calories</p>
            </div>
            
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-muted-foreground text-sm">Goal</p>
              <p className="text-2xl font-semibold mt-1">{calorieGoal}</p>
              <p className="text-xs text-muted-foreground">calories</p>
            </div>
            
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-muted-foreground text-sm">Remaining</p>
              <p className="text-2xl font-semibold mt-1">{remaining}</p>
              <p className="text-xs text-muted-foreground">calories</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyProgress;
