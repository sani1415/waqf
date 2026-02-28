import { getRequestConfig } from 'next-intl/server';

export const routing = {
  locales: ['en', 'bn'] as const,
  defaultLocale: 'en' as const,
  localePrefix: 'always' as const,
};
export type Locale = (typeof routing.locales)[number];

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as 'en' | 'bn')) {
    locale = routing.defaultLocale;
  }
  const messages = (await import(`../messages/${locale}.json`)).default;
  return { locale, messages };
});
