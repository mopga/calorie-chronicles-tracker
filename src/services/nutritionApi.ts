
import { toast } from 'sonner';

// Edamam API credentials
// Note: In a production app, these should be stored securely
const APP_ID = '1234abcd'; // REPLACE WITH YOUR ACTUAL APP ID
const APP_KEY = '5678efgh1234ijkl'; // REPLACE WITH YOUR ACTUAL APP KEY

export interface NutritionData {
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  weight?: number;
  found: boolean;
}

export async function searchFoodNutrition(
  query: string,
  weight: number
): Promise<NutritionData> {
  try {
    // Format the query for the API
    const formattedQuery = `${query} ${weight}g`;
    const encodedQuery = encodeURIComponent(formattedQuery);
    
    // Make request to Edamam API
    const response = await fetch(
      `https://api.edamam.com/api/nutrition-data?app_id=${APP_ID}&app_key=${APP_KEY}&ingr=${encodedQuery}`
    );

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    const data = await response.json();
    
    // Check if the API found meaningful results
    if (data.calories === 0) {
      return { calories: 0, found: false };
    }

    // Extract the nutritional information
    return {
      calories: Math.round(data.calories),
      protein: data.totalNutrients?.PROCNT ? Math.round(data.totalNutrients.PROCNT.quantity) : undefined,
      carbs: data.totalNutrients?.CHOCDF ? Math.round(data.totalNutrients.CHOCDF.quantity) : undefined,
      fat: data.totalNutrients?.FAT ? Math.round(data.totalNutrients.FAT.quantity) : undefined,
      weight: data.totalWeight,
      found: true
    };
  } catch (error) {
    console.error('Error fetching nutrition data:', error);
    toast.error('Failed to fetch nutrition data. Please try again.');
    return { calories: 0, found: false };
  }
}

// Fallback method if API doesn't find the food
export const searchFoodMock = (query: string, weight: number): NutritionData => {
  // This is a mock function that simulates API response for common foods
  const foodDatabase = [
    { name: 'салат', caloriesPer100g: 15 },
    { name: 'стейк', caloriesPer100g: 250 },
    { name: 'рис', caloriesPer100g: 130 },
    { name: 'паста', caloriesPer100g: 160 },
    { name: 'картофель', caloriesPer100g: 80 },
    { name: 'курица', caloriesPer100g: 170 },
    { name: 'говядина', caloriesPer100g: 250 },
    { name: 'лосось', caloriesPer100g: 200 },
    { name: 'яблоко', caloriesPer100g: 52 },
    { name: 'банан', caloriesPer100g: 89 },
    { name: 'молоко', caloriesPer100g: 42 },
    { name: 'яйцо', caloriesPer100g: 155 },
    { name: 'хлеб', caloriesPer100g: 265 },
    { name: 'йогурт', caloriesPer100g: 60 },
    { name: 'салат цезарь', caloriesPer100g: 380 },
    { name: 'pizza', caloriesPer100g: 270 },
    { name: 'burger', caloriesPer100g: 250 },
  ];

  const lowerQuery = query.toLowerCase();
  
  // Find the first matching food in our database
  const matchedFood = foodDatabase.find(food => 
    lowerQuery.includes(food.name) || food.name.includes(lowerQuery)
  );

  if (matchedFood) {
    const calories = Math.round(matchedFood.caloriesPer100g * (weight / 100));
    
    return {
      calories,
      protein: Math.round(calories * 0.1), // Approximation
      carbs: Math.round(calories * 0.5),  // Approximation
      fat: Math.round(calories * 0.3),   // Approximation
      weight,
      found: true
    };
  }

  return { calories: 0, found: false };
};

