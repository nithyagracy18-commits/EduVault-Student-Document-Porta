import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type Language = 'en' | 'hi' | 'es' | 'fr' | 'te';

interface Translations {
  [key: string]: {
    [lang in Language]: string;
  };
}

export const translations: Translations = {
  welcome: { en: 'Welcome back', hi: 'वापस स्वागत है', es: 'Bienvenido de nuevo', fr: 'Bon retour', te: 'తిరిగి స్వాగతం' },
  dashboard: { en: 'Dashboard', hi: 'डैशबोर्ड', es: 'Tablero', fr: 'Tableau de bord', te: 'డాష్‌బోర్డ్' },
  vault: { en: 'Vault', hi: 'वॉल्ट', es: 'Bóveda', fr: 'Coffre-fort', te: 'వాల్ట్' },
  profile: { en: 'Profile', hi: 'प्रोफ़ाइल', es: 'Perfil', fr: 'Profil', te: 'ప్రొఫైల్' },
  chat: { en: 'AI Chat', hi: 'AI चैट', es: 'Chat AI', fr: 'Chat AI', te: 'AI చాట్' },
  security: { en: 'Security', hi: 'सुरक्षा', es: 'Seguridad', fr: 'Sécurité', te: 'భద్రత' },
  logout: { en: 'Logout', hi: 'लॉगआउट', es: 'Cerrar sesión', fr: 'Déconnexion', te: 'నిష్క్రమించు' },
  drive: { en: 'My Drive', hi: 'मेरा ड्राइव', es: 'Mi unidad', fr: 'Mon drive', te: 'నా డ్రైవ్' },
  verified: { en: 'Verified', hi: 'सत्यापित', es: 'Verificado', fr: 'Vérifié', te: 'ధృవీకరించబడింది' },
  pending: { en: 'Pending', hi: 'लंबित', es: 'Pendiente', fr: 'En attente', te: 'పెండింగ్‌లో ఉంది' },
  settings: { en: 'Settings', hi: 'सेटिग्स', es: 'Ajustes', fr: 'Paramètres', te: 'సెట్టింగ్‌లు' },
  help: { en: 'Help', hi: 'सहायता', es: 'Ayuda', fr: 'Aide', te: 'సహాయం' },
  about: { en: 'About', hi: 'के बारे में', es: 'Acerca de', fr: 'À propos', te: 'గురించి' },
  activity: { en: 'My Activity', hi: 'मेरी गतिविधि', es: 'Mi actividad', fr: 'Mon activité', te: 'నా కార్యాచరణ' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('eduvault_lang') as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('eduvault_lang', language);
  }, [language]);

  const t = (key: string) => {
    return translations[key]?.[language] || translations[key]?.['en'] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
}
