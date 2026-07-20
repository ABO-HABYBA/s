import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2 border-orange-500/30 text-orange-400 hover:bg-orange-500/10 hover:text-orange-300"
    >
      <Globe className="w-4 h-4" />
      <span>{i18n.language === 'ar' ? t('language.en') : t('language.ar')}</span>
    </Button>
  );
}
