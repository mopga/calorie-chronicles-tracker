
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { addFoodItem, getDailyCalories, getWeeklyData, getFoodItems, removeFoodItem, setCalorieGoal, getCalorieGoal } from '../utils/calorieStorage';

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  timestamp: number;
}

interface CalorieContextType {
  foodItems: FoodItem[];
  dailyCalories: number;
  calorieGoal: number;
  weeklyData: { date: string; calories: number }[];
  addFood: (food: Omit<FoodItem, 'id' | 'timestamp'>) => void;
  removeFood: (id: string) => void;
  updateCalorieGoal: (goal: number) => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

const CalorieContext = createContext<CalorieContextType | undefined>(undefined);

export const CalorieProvider = ({ children }: { children: ReactNode }) => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [dailyCalories, setDailyCalories] = useState(0);
  const [calorieGoal, setCalorieGoalState] = useState(2000);
  const [weeklyData, setWeeklyData] = useState<{ date: string; calories: number }[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    // Load calorie goal from storage
    const storedGoal = getCalorieGoal();
    if (storedGoal) {
      setCalorieGoalState(storedGoal);
    }
  }, []);

  useEffect(() => {
    // Load food items for the selected date
    const items = getFoodItems(selectedDate);
    setFoodItems(items);
    
    // Update daily calories
    const total = getDailyCalories(selectedDate);
    setDailyCalories(total);
    
    // Update weekly data
    const weekly = getWeeklyData();
    setWeeklyData(weekly);
  }, [selectedDate]);

  const addFood = (food: Omit<FoodItem, 'id' | 'timestamp'>) => {
    const newFoodItem = addFoodItem(food, selectedDate);
    setFoodItems([...foodItems, newFoodItem]);
    setDailyCalories(dailyCalories + food.calories);
    
    // Update weekly data
    const weekly = getWeeklyData();
    setWeeklyData(weekly);
  };

  const removeFood = (id: string) => {
    const itemToRemove = foodItems.find(item => item.id === id);
    if (itemToRemove) {
      removeFoodItem(id);
      setFoodItems(foodItems.filter(item => item.id !== id));
      setDailyCalories(dailyCalories - itemToRemove.calories);
      
      // Update weekly data
      const weekly = getWeeklyData();
      setWeeklyData(weekly);
    }
  };

  const updateCalorieGoal = (goal: number) => {
    setCalorieGoal(goal);
    setCalorieGoalState(goal);
  };

  return (
    <CalorieContext.Provider
      value={{
        foodItems,
        dailyCalories,
        calorieGoal,
        weeklyData,
        addFood,
        removeFood,
        updateCalorieGoal,
        selectedDate,
        setSelectedDate,
      }}
    >
      {children}
    </CalorieContext.Provider>
  );
};

export const useCalorie = () => {
  const context = useContext(CalorieContext);
  if (context === undefined) {
    throw new Error('useCalorie must be used within a CalorieProvider');
  }
  return context;
};
