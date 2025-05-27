
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface Language {
  appName: string;
  appTitle: string;
  appSubtitle: string;
  headerTitle: string;
  selectLanguage: string;
  selectTheme: string;
  language: string;
  english: string;
  russian: string;
  light: string;
  dark: string;
  system: string;
  dailyProgress: string;
  consumed: string;
  goal: string;
  remaining: string;
  ofGoal: string;
  foodLog: string;
  item: string;
  items: string;
  noFoodItems: string;
  addFirstFood: string;
  foodName: string;
  enterFoodName: string;
  calories: string;
  cal: string;
  protein: string;
  carbs: string;
  fat: string;
  optional: string;
  addFoodItem: string;
  addFood: string;
  pleaseEnterValid: string;
  foodAdded: string;
  search: string;
  noFoodsFound: string;
  commonFoods: string;
  removed: string;
  weeklyStats: string;
  weeklyOverview: string;
  totalCalories: string;
  averageDaily: string;
  calorieGoal: string;
  setYourGoal: string;
  save: string;
  cancel: string;
  completed: string;
  weightInGrams: string;
  calculate: string;
  nutritionDataFound: string;
  nutritionDataNotFound: string;
  errorCalculating: string;
  pleaseEnterFoodName: string;
  pleaseEnterValidWeight: string;
}

const languages: Record<string, Language> = {
  en: {
    appName: 'Calorie Tracker',
    appTitle: 'Calorie Tracker',
    appSubtitle: 'Track your daily nutrition',
    headerTitle: 'Daily Calorie Intake',
    selectLanguage: 'Select Language',
    selectTheme: 'Select Theme',
    language: 'Language',
    english: 'English',
    russian: 'Russian',
    light: 'Light',
    dark: 'Dark',
    system: 'System',
    dailyProgress: 'Daily Progress',
    consumed: 'Consumed',
    goal: 'Goal',
    remaining: 'Remaining',
    ofGoal: 'of Goal',
    foodLog: 'Food Log',
    item: 'item',
    items: 'items',
    noFoodItems: 'No food items for today.',
    addFirstFood: 'Add your first food item!',
    foodName: 'Food Name',
    enterFoodName: 'Enter food name',
    calories: 'Calories',
    cal: 'cal',
    protein: 'Protein',
    carbs: 'Carbs',
    fat: 'Fat',
    optional: 'optional',
    addFoodItem: 'Add Food Item',
    addFood: 'Add Food',
    pleaseEnterValid: 'Please enter a valid food name and calorie amount.',
    foodAdded: 'Food added successfully!',
    search: 'Search',
    noFoodsFound: 'No foods found.',
    commonFoods: 'Common Foods',
    removed: 'Removed',
    weeklyStats: 'Weekly Stats',
    weeklyOverview: 'Weekly Overview',
    totalCalories: 'Total Calories',
    averageDaily: 'Average Daily',
    calorieGoal: 'Calorie Goal',
    setYourGoal: 'Set Your Goal',
    save: 'Save',
    cancel: 'Cancel',
    completed: 'Completed',
    weightInGrams: 'Weight (g)',
    calculate: 'Calculate',
    nutritionDataFound: 'Nutrition data found!',
    nutritionDataNotFound: 'Could not find nutrition data for this food',
    errorCalculating: 'Error calculating nutrition data',
    pleaseEnterFoodName: 'Please enter a food name',
    pleaseEnterValidWeight: 'Please enter a valid weight',
  },
  ru: {
    appName: 'Трекер Калорий',
    appTitle: 'Трекер Калорий',
    appSubtitle: 'Отслеживайте свое питание',
    headerTitle: 'Ежедневное Потребление Калорий',
    selectLanguage: 'Выберите Язык',
    selectTheme: 'Выберите Тему',
    language: 'Язык',
    english: 'Английский',
    russian: 'Русский',
    light: 'Светлая',
    dark: 'Тёмная',
    system: 'Системная',
    dailyProgress: 'Дневной Прогресс',
    consumed: 'Потреблено',
    goal: 'Цель',
    remaining: 'Осталось',
    ofGoal: 'от Цели',
    foodLog: 'Список Продуктов',
    item: 'продукт',
    items: 'продуктов',
    noFoodItems: 'Сегодня нет добавленных продуктов.',
    addFirstFood: 'Добавьте свой первый продукт!',
    foodName: 'Название Продукта',
    enterFoodName: 'Введите название продукта',
    calories: 'Калории',
    cal: 'ккал',
    protein: 'Белки',
    carbs: 'Углеводы',
    fat: 'Жиры',
    optional: 'необязательно',
    addFoodItem: 'Добавить Продукт',
    addFood: 'Добавить',
    pleaseEnterValid: 'Пожалуйста, введите корректное название продукта и количество калорий.',
    foodAdded: 'Продукт успешно добавлен!',
    search: 'Поиск',
    noFoodsFound: 'Продукты не найдены.',
    commonFoods: 'Популярные Продукты',
    removed: 'Удалено',
    weeklyStats: 'Недельная Статистика',
    weeklyOverview: 'Обзор недели',
    totalCalories: 'Всего Калорий',
    averageDaily: 'В среднем в день',
    calorieGoal: 'Цель по Калориям',
    setYourGoal: 'Установите свою цель',
    save: 'Сохранить',
    cancel: 'Отмена',
    completed: 'Выполнено',
    weightInGrams: 'Вес (г)',
    calculate: 'Рассчитать',
    nutritionDataFound: 'Данные о пищевой ценности найдены!',
    nutritionDataNotFound: 'Не удалось найти данные о пищевой ценности для этого продукта',
    errorCalculating: 'Ошибка при расчете пищевой ценности',
    pleaseEnterFoodName: 'Пожалуйста, введите название блюда',
    pleaseEnterValidWeight: 'Пожалуйста, введите корректный вес',
  },
};

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: keyof Language) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: keyof Language): string => {
    return languages[language][key] || languages['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
