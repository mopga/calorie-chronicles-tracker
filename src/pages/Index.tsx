
import React from 'react';
import { CalorieProvider } from '@/context/CalorieContext';
import { useLanguage } from '@/context/LanguageContext';
import Header from '@/components/Header';
import DailyProgress from '@/components/DailyProgress';
import AddFoodForm from '@/components/AddFoodForm';
import FoodList from '@/components/FoodList';
import WeeklyStats from '@/components/WeeklyStats';

const Index = () => {
  return (
    <CalorieProvider>
      <div className="min-h-screen bg-background transition-colors">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
          <DailyProgress />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <AddFoodForm />
              <FoodList />
            </div>
            <WeeklyStats />
          </div>
        </main>
      </div>
    </CalorieProvider>
  );
};

export default Index;
