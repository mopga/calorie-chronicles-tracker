
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const ALIBABA_CLOUD_API_KEY = Deno.env.get('ALIBABA_CLOUD_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NutritionRequest {
  foodName: string;
  weight: number;
}

interface NutritionResponse {
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  found: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!ALIBABA_CLOUD_API_KEY) {
      throw new Error('ALIBABA_CLOUD_API_KEY is not configured');
    }

    const { foodName, weight }: NutritionRequest = await req.json();
    
    console.log(`Processing nutrition request for: ${foodName}, ${weight}g`);

    // Создаем промпт для Qwen
    const prompt = `Определи калорийность на 100 грамм для продукта: "${foodName}". 
Ответь только числом калорий на 100г без дополнительного текста. 
Если не можешь определить точно, дай примерную оценку.
Примеры:
Суп-пюре из тыквы - 40
Рис отварной - 130
Куриная грудка - 165
Яблоко - 52`;

    // Вызываем Qwen API через Alibaba Cloud
    const qwenResponse = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ALIBABA_CLOUD_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'qwen-turbo',
        input: {
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        },
        parameters: {
          temperature: 0.1,
          max_tokens: 50
        }
      }),
    });

    if (!qwenResponse.ok) {
      console.error('Qwen API response not ok:', qwenResponse.status);
      throw new Error(`Qwen API error: ${qwenResponse.status}`);
    }

    const qwenData = await qwenResponse.json();
    console.log('Qwen API response:', qwenData);

    // Извлекаем калории из ответа
    const aiResponse = qwenData.output?.text || qwenData.output?.choices?.[0]?.message?.content || '';
    console.log('AI response text:', aiResponse);
    
    // Извлекаем число из ответа
    const caloriesPer100g = parseInt(aiResponse.replace(/\D/g, '')) || 0;
    console.log('Calories per 100g:', caloriesPer100g);

    if (caloriesPer100g === 0) {
      console.log('No calories found, returning not found');
      return new Response(JSON.stringify({
        calories: 0,
        found: false
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Рассчитываем калории для указанного веса
    const totalCalories = Math.round(caloriesPer100g * (weight / 100));
    
    console.log(`Calculated: ${caloriesPer100g} cal/100g * ${weight}g = ${totalCalories} calories`);

    const result: NutritionResponse = {
      calories: totalCalories,
      protein: Math.round(totalCalories * 0.1), // Примерная оценка белков
      carbs: Math.round(totalCalories * 0.5),   // Примерная оценка углеводов
      fat: Math.round(totalCalories * 0.3),     // Примерная оценка жиров
      found: true
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in calculate-nutrition function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      calories: 0,
      found: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
