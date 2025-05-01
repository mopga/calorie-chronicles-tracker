
import React from 'react';
import { useCalorie } from '@/context/CalorieContext';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const FoodList = () => {
  const { foodItems, removeFood, selectedDate } = useCalorie();
  const { language, t } = useLanguage();
  
  const handleRemove = (id: string, name: string) => {
    removeFood(id);
    toast.success(`${t('removed')} ${name}`);
  };
  
  // Format date for display
  const dateString = format(selectedDate, 'EEEE, MMMM d');

  return (
    <Card className="transition-colors">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>{t('foodLog')} - {dateString}</span>
          <span className="text-sm font-normal text-muted-foreground">
            {foodItems.length} {foodItems.length === 1 ? t('item') : t('items')}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {foodItems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>{t('noFoodItems')}</p>
            <p className="text-sm">{t('addFirstFood')}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {foodItems.map((item) => (
              <div 
                key={item.id} 
                className="flex items-center justify-between p-3 bg-muted rounded-lg transition-colors"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <div className="text-xs text-muted-foreground">
                    {item.protein && `${item.protein}g ${t('protein')} • `}
                    {item.carbs && `${item.carbs}g ${t('carbs')} • `}
                    {item.fat && `${item.fat}g ${t('fat')}`}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-semibold">{item.calories} {t('cal')}</p>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleRemove(item.id, item.name)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FoodList;
