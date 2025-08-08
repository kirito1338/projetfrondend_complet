import React, { useEffect, useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';

const AutoTranslate = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('français');
  const [isTranslating, setIsTranslating] = useState(false);

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
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
    console.log('Tentative de traduction vers:', langCode, langName);
    setIsTranslating(true);
    
    const attemptTranslation = (retries = 10) => {
      const googleTranslateCombo = document.querySelector('.goog-te-combo');
      console.log('Widget trouvé:', googleTranslateCombo);
      
      if (googleTranslateCombo) {
        googleTranslateCombo.value = langCode;
        googleTranslateCombo.dispatchEvent(new Event('change'));
        setCurrentLang(langName);
        setIsOpen(false);
        setIsTranslating(false);
        console.log('Traduction appliquée avec succès');
      } else if (retries > 0) {
        console.log('Widget non trouvé, nouvelle tentative dans 500ms. Tentatives restantes:', retries);
        setTimeout(() => attemptTranslation(retries - 1), 500);
      } else {
        console.error('Impossible de trouver le widget Google Translate après plusieurs tentatives');
        setIsTranslating(false);
        if (window.google && window.google.translate) {
          window.google.translate.TranslateElement.getInstance().translatePage(langCode);
        }
      }
    };
    
    attemptTranslation();
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .goog-te-banner-frame.skiptranslate,
      .goog-te-gadget-icon,
      .goog-te-gadget-simple .goog-te-menu-value span:first-child {
        display: none !important;
      }
      
      .goog-te-gadget-simple {
        background-color: transparent !important;
        border: none !important;
        font-size: 0 !important;
      }
      
      .goog-te-menu-value {
        color: transparent !important;
      }
      
      body {
        top: 0 !important;
      }
      
      #google_translate_element {
        position: absolute;
        left: -9999px;
        width: 1px;
        height: 1px;
        overflow: hidden;
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return (
    <>
      <div id="google_translate_element"></div>
      
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200 text-white"
          disabled={isTranslating}
        >
          <Globe className="w-4 h-4" />
          <span className="text-sm font-medium">
            {isTranslating ? 'Traduction...' : currentLang}
          </span>
          {isTranslating ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          )}
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
                {currentLang === lang.name && (
                  <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default AutoTranslate;
