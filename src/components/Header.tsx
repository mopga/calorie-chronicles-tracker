
import React, { useState } from 'react';
import { useCalorie } from '@/context/CalorieContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CalendarIcon } from 'lucide-react';
import { 
  Popover, 
  PopoverContent,
  PopoverTrigger 
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';

const Header = () => {
  const { calorieGoal, updateCalorieGoal, selectedDate, setSelectedDate } = useCalorie();
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState(calorieGoal.toString());
  
  const handleSaveGoal = () => {
    const newGoal = parseInt(goalInput, 10);
    if (!isNaN(newGoal) && newGoal > 0) {
      updateCalorieGoal(newGoal);
      setIsEditingGoal(false);
    }
  };

  return (
    <header className="bg-white shadow-sm mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              Calorie Chronicles
            </h1>
            <p className="text-sm text-muted-foreground">
              Track your nutrition journey
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span>{format(selectedDate, 'PPP')}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            
            <div className="flex items-center gap-2">
              {isEditingGoal ? (
                <>
                  <Input
                    type="number"
                    value={goalInput}
                    onChange={(e) => setGoalInput(e.target.value)}
                    className="w-24"
                  />
                  <Button onClick={handleSaveGoal} size="sm">Save</Button>
                </>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditingGoal(true)}
                >
                  Goal: {calorieGoal} cal
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
