
import React, { useState } from 'react';
import { useCalorie } from '@/context/CalorieContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { searchFoods } from '@/utils/foodData';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from 'sonner';

const AddFoodForm = () => {
  const { addFood } = useCalorie();
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const caloriesNum = parseInt(calories, 10);
    if (!name.trim() || isNaN(caloriesNum) || caloriesNum <= 0) {
      toast.error('Please enter a valid name and calories');
      return;
    }
    
    addFood({
      name: name.trim(),
      calories: caloriesNum,
      protein: protein ? parseFloat(protein) : undefined,
      carbs: carbs ? parseFloat(carbs) : undefined,
      fat: fat ? parseFloat(fat) : undefined,
    });
    
    // Reset form
    setName('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
    
    toast.success('Food added successfully');
  };
  
  const handleFoodSelect = (foodName: string) => {
    const foodDetails = searchFoods(foodName)[0];
    if (foodDetails) {
      setName(foodDetails.name);
      setCalories(foodDetails.calories.toString());
      if (foodDetails.protein) setProtein(foodDetails.protein.toString());
      if (foodDetails.carbs) setCarbs(foodDetails.carbs.toString());
      if (foodDetails.fat) setFat(foodDetails.fat.toString());
    }
    setIsSearchOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Add Food Item</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Food Name</Label>
              <div className="flex">
                <Input
                  id="name"
                  placeholder="Enter food name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-r-none"
                />
                <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                  <PopoverTrigger asChild>
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="rounded-l-none border-l-0"
                    >
                      Search
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0" align="end" side="bottom">
                    <Command>
                      <CommandInput placeholder="Search food..." />
                      <CommandList>
                        <CommandEmpty>No foods found.</CommandEmpty>
                        <CommandGroup heading="Common Foods">
                          {name.trim() && searchFoods(name).map((food) => (
                            <CommandItem 
                              key={food.name} 
                              onSelect={() => handleFoodSelect(food.name)}
                            >
                              {food.name} - {food.calories} cal
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="calories">Calories</Label>
                <Input
                  id="calories"
                  placeholder="Cal"
                  type="number"
                  min="0"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="protein">Protein (g)</Label>
                <Input
                  id="protein"
                  placeholder="Optional"
                  type="number"
                  min="0"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="carbs">Carbs (g)</Label>
                <Input
                  id="carbs"
                  placeholder="Optional"
                  type="number"
                  min="0"
                  value={carbs}
                  onChange={(e) => setCarbs(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="fat">Fat (g)</Label>
                <Input
                  id="fat"
                  placeholder="Optional"
                  type="number"
                  min="0"
                  value={fat}
                  onChange={(e) => setFat(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <Button type="submit" className="w-full">
            <Plus className="mr-2 h-4 w-4" /> Add Food
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddFoodForm;
