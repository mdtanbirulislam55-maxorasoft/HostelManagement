import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const [isEnglish, setIsEnglish] = useState(i18n.language === 'en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('hostelLanguage') || 'en';
    setIsEnglish(savedLanguage === 'en');
    i18n.changeLanguage(savedLanguage);
  }, [i18n]);

  const toggleLanguage = () => {
    const newLanguage = isEnglish ? 'bn' : 'en';
    setIsEnglish(!isEnglish);
    i18n.changeLanguage(newLanguage);
    localStorage.setItem('hostelLanguage', newLanguage);
  };

  return (
    <div className="flex items-center space-x-3" data-testid="language-toggle">
      <span 
        className={`text-sm ${isEnglish ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}
        data-testid="lang-en"
      >
        EN
      </span>
      <label className="relative inline-block w-15 h-7 cursor-pointer">
        <input 
          type="checkbox" 
          className="opacity-0 w-0 h-0"
          checked={!isEnglish}
          onChange={toggleLanguage}
          data-testid="language-switch"
        />
        <span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-muted-foreground/30 transition-all duration-300 rounded-full before:absolute before:content-[''] before:h-5 before:w-5 before:left-1 before:bottom-1 before:bg-white before:transition-all before:duration-300 before:rounded-full data-[checked]:bg-primary data-[checked]:before:transform data-[checked]:before:translate-x-8" 
          data-checked={!isEnglish ? 'true' : 'false'}
        />
      </label>
      <span 
        className={`text-sm font-bengali ${!isEnglish ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}
        data-testid="lang-bn"
      >
        বাং
      </span>
    </div>
  );
}
