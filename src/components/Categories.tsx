import { Home, Waves, Mountain, Building, Warehouse, Trees, Tent, Castle, Grid } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const categoryKeys = [
  { key: 'all', icon: Grid, originalKey: '' },
  { key: 'mansions', icon: Castle, originalKey: 'Mansions' },
  { key: 'cabins', icon: Home, originalKey: 'Cabins' },
  { key: 'beach', icon: Waves, originalKey: 'Beach' },
  { key: 'mountains', icon: Mountain, originalKey: 'Mountains' },
  { key: 'city', icon: Building, originalKey: 'City' },
  { key: 'lofts', icon: Warehouse, originalKey: 'Lofts' },
  { key: 'countryside', icon: Trees, originalKey: 'Countryside' },
  { key: 'camping', icon: Tent, originalKey: 'Camping' },
];

interface CategoriesProps {
  onCategorySelect?: (category: string) => void;
  selectedCategory?: string;
}

export default function Categories({ onCategorySelect, selectedCategory }: CategoriesProps) {
  const { t } = useLanguage();
  
  const categories = categoryKeys.map(cat => ({
    ...cat,
    label: t(cat.key)
  }));

  return (
    <nav className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-16 sm:top-20 z-40" aria-label="Property categories">
      <div className="container mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-start sm:justify-center space-x-4 sm:space-x-6 md:space-x-8 overflow-x-auto pb-3 sm:pb-4 pt-4 sm:pt-6 scrollbar-hide -mx-3 sm:mx-0 px-3 sm:px-0" role="tablist">
          {categories.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.originalKey || (category.key === 'all' && !selectedCategory);
            return (
              <button
                key={category.key}
                onClick={() => onCategorySelect?.(category.key === 'all' ? '' : (isSelected ? '' : category.originalKey))}
                className={`flex flex-col items-center space-y-1.5 sm:space-y-2 min-w-fit cursor-pointer transition-all duration-200 pb-2 group min-h-[64px] sm:min-h-[72px] px-2 sm:px-0 active:scale-95 min-h-[44px] ${
                  isSelected 
                    ? 'text-gray-900 dark:text-gray-100 border-b-2 border-gray-900 dark:border-gray-100' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:border-b-2 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                role="tab"
                aria-selected={isSelected}
                aria-controls={`category-${category.key}`}
                aria-label={category.label}
              >
                <Icon className={`h-5 w-5 sm:h-6 sm:w-6 transition-transform ${isSelected ? 'scale-110' : 'group-hover:scale-110'}`} aria-hidden="true" />
                <span className="text-[10px] sm:text-xs font-semibold whitespace-nowrap">{category.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
