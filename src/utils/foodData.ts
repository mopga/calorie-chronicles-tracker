
export interface FoodDatabase {
  [key: string]: {
    calories: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
}

// Basic food database with common items
export const foodDatabase: FoodDatabase = {
  "apple": { calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
  "banana": { calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
  "chicken breast": { calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  "egg": { calories: 68, protein: 5.5, carbs: 0.6, fat: 4.8 },
  "bread slice": { calories: 79, protein: 3, carbs: 14, fat: 1 },
  "rice (1 cup cooked)": { calories: 205, protein: 4.3, carbs: 45, fat: 0.4 },
  "potato": { calories: 161, protein: 4.3, carbs: 37, fat: 0.2 },
  "milk (1 cup)": { calories: 122, protein: 8.1, carbs: 11.7, fat: 4.8 },
  "pasta (1 cup cooked)": { calories: 221, protein: 8.1, carbs: 43.2, fat: 1.3 },
  "salmon (100g)": { calories: 206, protein: 22, carbs: 0, fat: 13 },
  "avocado": { calories: 234, protein: 2.9, carbs: 12.5, fat: 21 },
  "cheese (cheddar, 1oz)": { calories: 114, protein: 7, carbs: 0.9, fat: 9.4 },
  "peanut butter (1 tbsp)": { calories: 96, protein: 3.6, carbs: 3.5, fat: 8.2 },
  "chocolate bar": { calories: 235, protein: 2.2, carbs: 26, fat: 13 },
  "soda (12oz)": { calories: 140, protein: 0, carbs: 39, fat: 0 },
  "orange juice (1 cup)": { calories: 112, protein: 1.7, carbs: 25.8, fat: 0.5 },
};

// Function to search foods
export const searchFoods = (query: string) => {
  query = query.toLowerCase().trim();
  
  if (!query) return [];
  
  return Object.entries(foodDatabase)
    .filter(([name]) => name.toLowerCase().includes(query))
    .map(([name, details]) => ({
      name,
      ...details
    }));
};
