
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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
    console.log(`Searching nutrition for: ${query}, ${weight}g`);
    
    // Вызываем нашу Edge Function с Qwen API
    const { data, error } = await supabase.functions.invoke('calculate-nutrition', {
      body: {
        foodName: query,
        weight: weight
      }
    });

    if (error) {
      console.error('Supabase function error:', error);
      throw new Error(error.message);
    }

    console.log('Nutrition API response:', data);

    // Если API нашел данные, возвращаем их
    if (data && data.found) {
      return {
        calories: data.calories,
        protein: data.protein,
        carbs: data.carbs,
        fat: data.fat,
        weight: weight,
        found: true
      };
    }

    // Если API не нашел данные, используем fallback
    console.log('API did not find data, using fallback');
    return searchFoodMock(query, weight);

  } catch (error) {
    console.error('Error calling nutrition API:', error);
    toast.error('Ошибка при получении данных о питании. Попробуйте снова.');
    
    // В случае ошибки используем fallback
    return searchFoodMock(query, weight);
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
    { name: 'суп-пюре', caloriesPer100g: 40 },
    { name: 'тыква', caloriesPer100g: 26 },
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
