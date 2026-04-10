import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { zh } from './zh';
import { en } from './en';

export type Locale = 'zh' | 'en';

const translations = { zh, en } as const;

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  tRaw: (key: string) => unknown;
}

const I18nContext = createContext<I18nContextValue>(null!);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const saved = localStorage.getItem('pp-locale');
    return (saved === 'en' || saved === 'zh') ? saved : 'zh';
  });

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('pp-locale', newLocale);
  }, []);

  const t = useCallback(
    (key: string): string => {
      const val = (translations[locale] as Record<string, unknown>)[key];
      return typeof val === 'string' ? val : key;
    },
    [locale]
  );

  const tRaw = useCallback(
    (key: string): unknown => {
      return (translations[locale] as Record<string, unknown>)[key];
    },
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, tRaw }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
