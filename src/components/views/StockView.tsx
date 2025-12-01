import { useLanguage } from '../../contexts/LanguageContext';

export function StockView({ viewType }: { viewType: string }) {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <h2 className="text-lg">{t('module.stock')}</h2>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-500">Module {viewType} - {t('common.inDevelopment')}</p>
      </div>
    </div>
  );
}
