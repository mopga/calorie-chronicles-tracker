
import { FoodItem } from '../context/CalorieContext';

// Helper to format date as YYYY-MM-DD for storage keys
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Helper to get start of day for date comparisons
const getStartOfDay = (date: Date): Date => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
};

// Add a new food item
export const addFoodItem = (food: Omit<FoodItem, 'id' | 'timestamp'>, date: Date): FoodItem => {
  const dateKey = formatDate(date);
  const items = getFoodItems(date);
  
  const newItem: FoodItem = {
    ...food,
    id: Date.now().toString(),
    timestamp: Date.now(),
  };
  
  const updatedItems = [...items, newItem];
  localStorage.setItem(`calories_items_${dateKey}`, JSON.stringify(updatedItems));
  
  return newItem;
};

// Remove a food item
export const removeFoodItem = (id: string): void => {
  // We need to check all dates since we don't know which date this item belongs to
  const dateKeys = getAllDateKeys();
  
  dateKeys.forEach(dateKey => {
    const storedItems = localStorage.getItem(`calories_items_${dateKey}`);
    if (storedItems) {
      const items: FoodItem[] = JSON.parse(storedItems);
      const updatedItems = items.filter(item => item.id !== id);
      
      if (items.length !== updatedItems.length) {
        // We found and removed the item
        localStorage.setItem(`calories_items_${dateKey}`, JSON.stringify(updatedItems));
      }
    }
  });
};

// Get all food items for a specific date
export const getFoodItems = (date: Date): FoodItem[] => {
  const dateKey = formatDate(date);
  const storedItems = localStorage.getItem(`calories_items_${dateKey}`);
  return storedItems ? JSON.parse(storedItems) : [];
};

// Get total calories for a specific date
export const getDailyCalories = (date: Date): number => {
  const items = getFoodItems(date);
  return items.reduce((sum, item) => sum + item.calories, 0);
};

// Save calorie goal
export const setCalorieGoal = (goal: number): void => {
  localStorage.setItem('calorie_goal', goal.toString());
};

// Get calorie goal
export const getCalorieGoal = (): number => {
  const goal = localStorage.getItem('calorie_goal');
  return goal ? parseInt(goal, 10) : 2000; // Default: 2000 calories
};

// Helper to get all date keys from localStorage
const getAllDateKeys = (): string[] => {
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('calories_items_')) {
      keys.push(key.replace('calories_items_', ''));
    }
  }
  return keys;
};

// Get weekly data (last 7 days including today)
export const getWeeklyData = (): { date: string; calories: number }[] => {
  const result = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    
    const dateStr = formatDate(date);
    const calories = getDailyCalories(date);
    
    result.push({
      date: dateStr,
      calories,
    });
  }
  
  return result;
};
