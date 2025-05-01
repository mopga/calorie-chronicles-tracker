
import React from 'react';
import { useCalorie } from '@/context/CalorieContext';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { format, parseISO } from 'date-fns';

const WeeklyStats = () => {
  const { weeklyData, calorieGoal } = useCalorie();
  const { language, t } = useLanguage();
  
  // Format data for chart
  const chartData = weeklyData.map(day => ({
    ...day,
    formattedDate: format(parseISO(day.date), 'EEE'),
    goal: calorieGoal,
  }));

  return (
    <Card className="mt-6 transition-colors">
      <CardHeader>
        <CardTitle className="text-lg">
          {t('weeklyOverview')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis 
                dataKey="formattedDate" 
                tick={{ fontSize: 12 }} 
                tickLine={false} 
                axisLine={{ stroke: '#E5E7EB', strokeWidth: 1 }}
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                tickLine={false} 
                axisLine={{ stroke: '#E5E7EB', strokeWidth: 1 }}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--background)', 
                  border: '1px solid var(--border)', 
                  borderRadius: '0.375rem',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  padding: '8px',
                  color: 'var(--foreground)'
                }}
                formatter={(value) => [`${value} ${t('cal')}`, '']}
                labelFormatter={(label) => `${label}`}
              />
              <Bar 
                dataKey="calories" 
                fill="hsl(var(--primary))" 
                radius={[4, 4, 0, 0]} 
                name={t('calories')}
                animationDuration={1500}
              />
              <Bar 
                dataKey="goal" 
                fill="hsl(var(--muted))" 
                radius={[4, 4, 0, 0]} 
                name={t('goal')}
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 flex justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary"></div>
            <span className="text-sm text-muted-foreground">{t('consumed')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-muted"></div>
            <span className="text-sm text-muted-foreground">{t('goal')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyStats;
