import React, { useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';

const SimpleTranslate = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('Français');

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷', isOriginal: true },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'ar', name: 'العربية', flag: '🇲🇦' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'nl', name: 'Nederlands', flag: '🇳🇱' }
  ];

  const translatePage = (langCode, langName) => {
    if (langCode === 'fr') {
      const currentUrl = window.location.href;
      if (currentUrl.includes('translate.google.com')) {
        const urlParams = new URLSearchParams(window.location.search);
        const originalUrl = urlParams.get('u') || window.location.origin;
        window.location.href = decodeURIComponent(originalUrl);
      }
      setCurrentLang(langName);
      setIsOpen(false);
      return;
    }

    const currentUrl = window.location.href;
    let baseUrl = currentUrl;
    
    if (currentUrl.includes('translate.google.com')) {
      const urlParams = new URLSearchParams(window.location.search);
      baseUrl = urlParams.get('u') || window.location.origin;
      baseUrl = decodeURIComponent(baseUrl);
    }
    
    const translateUrl = `https://translate.google.com/translate?sl=fr&tl=${langCode}&u=${encodeURIComponent(baseUrl)}`;
    window.location.href = translateUrl;
    setCurrentLang(langName);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200 text-white"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">{currentLang}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 min-w-[200px]">
          <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
            Choisir la langue
          </div>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => translatePage(lang.code, lang.name)}
              className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors duration-150"
            >
              <span className="text-lg">{lang.flag}</span>
              <span className="text-sm font-medium text-gray-700">{lang.name}</span>
              {lang.isOriginal && (
                <span className="ml-auto text-xs text-blue-600 font-medium">Original</span>
              )}
              {currentLang === lang.name && (
                <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
              )}
            </button>
          ))}
          <div className="px-3 py-2 mt-2 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              Traduction powered by Google Translate
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleTranslate;
