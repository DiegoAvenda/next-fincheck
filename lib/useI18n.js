'use client';

import { useFinStore } from './store';
import { translations } from './i18n';

export function useI18n() {
  const locale = useFinStore((state) => state.locale);
  const t = translations[locale] || translations.es;

  return { locale, t };
}
