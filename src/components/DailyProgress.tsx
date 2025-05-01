
import React from 'react';
import { useCalorie } from '@/context/CalorieContext';
import { useLanguage } from '@/context/LanguageContext'; 
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

const ProgressRing = ({ 
  percentage, 
  radius = 60, 
  strokeWidth = 12,
  fontSize = '1.5rem',
  smallFontSize = '0.75rem'
}: { 
  percentage: number, 
  radius?: number,
  strokeWidth?: number,
  fontSize?: string,
  smallFontSize?: string
}) => {
  const normalizedPercentage = Math.min(100, Math.max(0, percentage));
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedPercentage / 100) * circumference;
  const { t } = useLanguage();
  
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={(radius * 2) + strokeWidth} height={(radius * 2) + strokeWidth} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={radius + strokeWidth / 2}
          cy={radius + strokeWidth / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={radius + strokeWidth / 2}
          cy={radius + strokeWidth / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="progress-ring-circle"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span style={{ fontSize }} className="font-semibold text-foreground">{normalizedPercentage}%</span>
        <span style={{ fontSize: smallFontSize }} className="text-muted-foreground">{t('completed')}</span>
      </div>
    </div>
  );
};

const DailyProgress = () => {
  const { dailyCalories, calorieGoal } = useCalorie();
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  // Calculate calories remaining
  const caloriesRemaining = Math.max(0, calorieGoal - dailyCalories);
  
  // Calculate percentage of goal reached
  const percentComplete = Math.min(100, Math.round((dailyCalories / calorieGoal) * 100)) || 0;

  return (
    <Card className="mb-6 transition-colors">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Circular Progress */}
          <div className="flex justify-center items-center">
            <ProgressRing 
              percentage={percentComplete} 
              radius={isMobile ? 50 : 60}
              strokeWidth={isMobile ? 10 : 12}
              fontSize={isMobile ? '1.25rem' : '1.5rem'}
              smallFontSize={isMobile ? '0.7rem' : '0.75rem'}
            />
          </div>
          
          {/* Daily Stats */}
          <div className="col-span-1 md:col-span-2">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">{t('dailyProgress')}</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div className="p-3 bg-muted rounded-md transition-colors">
                  <div className="text-sm text-muted-foreground">{t('consumed')}</div>
                  <div className="text-xl font-semibold">{dailyCalories} <span className="text-sm font-normal">{t('cal')}</span></div>
                </div>
                
                <div className="p-3 bg-muted rounded-md transition-colors">
                  <div className="text-sm text-muted-foreground">{t('goal')}</div>
                  <div className="text-xl font-semibold">{calorieGoal} <span className="text-sm font-normal">{t('cal')}</span></div>
                </div>
                
                <div className="p-3 bg-muted rounded-md transition-colors">
                  <div className="text-sm text-muted-foreground">{t('remaining')}</div>
                  <div className="text-xl font-semibold">{caloriesRemaining} <span className="text-sm font-normal">{t('cal')}</span></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1 items-center">
                  <span className="text-sm text-muted-foreground">{dailyCalories} {t('cal')}</span>
                  <span className="text-sm text-muted-foreground">{calorieGoal} {t('cal')}</span>
                </div>
                <Progress value={percentComplete} className="h-2" />
                <div className="mt-1 text-xs text-muted-foreground text-right">
                  {percentComplete}% {t('ofGoal')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyProgress;
