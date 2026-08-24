import { I18n } from 'i18n-js';

import { ar } from '@/i18n/locales/ar';
import { en } from '@/i18n/locales/en';

/**
 * Guards the bilingual catalogs: switching locale must change user-facing copy.
 */
describe('i18n catalogs', () => {
  const i18n = new I18n({ en, ar });
  i18n.enableFallback = true;
  i18n.defaultLocale = 'en';

  it('returns Arabic copy when locale is ar', () => {
    expect(i18n.t('home.createBill', { locale: 'ar' })).toBe('إنشاء فاتورة جديدة');
    expect(i18n.t('settings.language', { locale: 'ar' })).toBe('اللغة');
    expect(i18n.t('nav.items', { locale: 'ar' })).toBe(ar.nav.items);
  });

  it('returns English copy when locale is en', () => {
    expect(i18n.t('home.createBill', { locale: 'en' })).toBe('Create New Bill');
    expect(i18n.t('settings.language', { locale: 'en' })).toBe('Language');
  });

  it('keeps en and ar keys in sync', () => {
    const enSections = Object.keys(en) as (keyof typeof en)[];
    expect(Object.keys(ar).sort()).toEqual([...enSections].sort());
    for (const section of enSections) {
      expect(Object.keys(ar[section]).sort()).toEqual(Object.keys(en[section]).sort());
    }
  });
});
