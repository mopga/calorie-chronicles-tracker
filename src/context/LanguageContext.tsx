
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define available languages
export type Language = 'en' | 'ru';

// Define language context type
type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

// Create context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

// Translation dictionaries
export const translations = {
  en: {
    // Header
    "appTitle": "Calorie Chronicles",
    "appSubtitle": "Track your nutrition journey",
    "goal": "Goal",
    "cal": "cal",
    
    // Daily Progress
    "consumed": "Consumed",
    "remaining": "Remaining",
    "ofGoal": "of goal",
    "calories": "calories",
    
    // Add Food Form
    "addFoodItem": "Add Food Item",
    "foodName": "Food Name",
    "enterFoodName": "Enter food name",
    "search": "Search",
    "noFoodsFound": "No foods found.",
    "commonFoods": "Common Foods",
    "protein": "Protein (g)",
    "carbs": "Carbs (g)",
    "fat": "Fat (g)",
    "optional": "Optional",
    "addFood": "Add Food",
    
    // Food List
    "foodLog": "Food Log",
    "items": "items",
    "item": "item",
    "noFoodItems": "No food items logged for this day.",
    "addFirstFood": "Add your first food item above!",
    
    // Weekly Stats
    "weeklyOverview": "Weekly Overview",
    
    // Toasts
    "foodAdded": "Food added successfully",
    "removed": "Removed",
    "pleaseEnterValid": "Please enter a valid name and calories",
    
    // Language
    "language": "Language",
    "english": "English",
    "russian": "Russian",
  },
  ru: {
    // Header
    "appTitle": "Калорийная Хроника",
    "appSubtitle": "Отслеживайте свой путь питания",
    "goal": "Цель",
    "cal": "кал",
    
    // Daily Progress
    "consumed": "Потреблено",
    "remaining": "Осталось",
    "ofGoal": "от цели",
    "calories": "калорий",
    
    // Add Food Form
    "addFoodItem": "Добавить продукт",
    "foodName": "Название продукта",
    "enterFoodName": "Введите название продукта",
    "search": "Поиск",
    "noFoodsFound": "Продукты не найдены.",
    "commonFoods": "Популярные продукты",
    "protein": "Белки (г)",
    "carbs": "Углеводы (г)",
    "fat": "Жиры (г)",
    "optional": "Опционально",
    "addFood": "Добавить продукт",
    
    // Food List
    "foodLog": "Журнал питания",
    "items": "продуктов",
    "item": "продукт",
    "noFoodItems": "На этот день не записано продуктов.",
    "addFirstFood": "Добавьте свой первый продукт выше!",
    
    // Weekly Stats
    "weeklyOverview": "Обзор за неделю",
    
    // Toasts
    "foodAdded": "Продукт успешно добавлен",
    "removed": "Удалено",
    "pleaseEnterValid": "Пожалуйста, введите корректное название и калории",
    
    // Language
    "language": "Язык",
    "english": "Английский",
    "russian": "Русский",
  },
};

// Create provider component
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Try to get saved language from localStorage, default to 'en'
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    return savedLanguage === 'ru' ? 'ru' : 'en';
  });

  // Update localStorage when language changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Translate function
  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);
