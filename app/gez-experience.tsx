'use client';

import { useEffect, useState } from 'react';
import { AppPrototype } from '@/components/gez/app-prototype';
import { MarketingHome } from '@/components/gez/marketing-home';
import { getGezCopy, type GezLocale } from '@/lib/gez-prototype';

type WebMcpContext = {
  registerTool: (tool: {
    name: string;
    title: string;
    description: string;
    inputSchema: object;
    annotations: { readOnlyHint: boolean; untrustedContentHint: boolean };
    execute: (input: unknown) => unknown;
  }, options?: { signal?: AbortSignal }) => void | Promise<void>;
};

export function GezExperience() {
  const [locale, setLocale] = useState<GezLocale>('en');
  const [inApp, setInApp] = useState(false);
  const copy = getGezCopy(locale);

  useEffect(() => {
    queueMicrotask(() => {
      const savedLocale = window.localStorage.getItem('gez-locale');
      if (savedLocale === 'az' || savedLocale === 'en' || savedLocale === 'ru') setLocale(savedLocale);
    });
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    window.localStorage.setItem('gez-locale', locale);
  }, [locale]);

  useEffect(() => {
    const context = (document as Document & { modelContext?: WebMcpContext }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();

    const registration = context.registerTool({
      name: 'start_gez_walk_demo',
      title: 'Start a GƏZ walk booking',
      description: 'Open the GƏZ prototype at its sign-in and dog-walk booking journey in Azerbaijani, English, or Russian.',
      inputSchema: {
        type: 'object',
        properties: { locale: { type: 'string', enum: ['az', 'en', 'ru'] } },
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input) {
        const requested = input && typeof input === 'object' ? (input as { locale?: unknown }).locale : undefined;
        if (requested !== undefined && requested !== 'az' && requested !== 'en' && requested !== 'ru') {
          throw new Error('locale must be az, en, or ru');
        }
        if (requested) setLocale(requested);
        setInApp(true);
        window.scrollTo({ top: 0 });
        return { view: 'walk-booking-demo', locale: requested ?? locale };
      },
    }, { signal: lifecycle.signal });

    void Promise.resolve(registration).catch(() => undefined);
    return () => lifecycle.abort();
  }, [locale]);

  const openApp = () => {
    setInApp(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeApp = () => {
    setInApp(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return inApp ? (
    <AppPrototype copy={copy} locale={locale} onLocaleChange={setLocale} onExit={closeApp} />
  ) : (
    <MarketingHome copy={copy} locale={locale} onLocaleChange={setLocale} onStart={openApp} />
  );
}
