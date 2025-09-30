import Polyglot from 'node-polyglot';
import fs from 'fs';
import path from 'path';
import { JOI_AR_TRANSLATION, JOI_EN_TRANSLATION, TranslationKeys } from './translation_keys';

interface TranslationPhrases {
  [key: string]: string;
}

export enum AppLanguages {
  ENGLISH = 'en',
  ARABIC = 'ar',
}

class I18n {
  private polyglot: Polyglot;
  private supportedLanguages: string[];
  public currentLanguage: string;

  constructor(lang: AppLanguages = AppLanguages.ENGLISH) {
    this.supportedLanguages = [AppLanguages.ENGLISH, AppLanguages.ARABIC];

    this.currentLanguage = AppLanguages.ENGLISH;

    this.polyglot = new Polyglot({
      locale: lang,
      phrases: this.loadTranslations(lang),
    });
  }

  // Load translations from JSON files
  private loadTranslations(lang: string): TranslationPhrases {
    const filePath = path.join(__dirname, '../../', 'locales', lang, 'translations.json');
    const rawData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(rawData) as TranslationPhrases;
  }

  // Change language dynamically
  public setLanguage(lang: string): void {
    if (!this.supportedLanguages.includes(lang)) {
      throw new Error('invalid i18n language');
    }

    this.polyglot.replace(this.loadTranslations(lang));
    this.polyglot.locale(lang);
    this.currentLanguage = lang;
  }

  public detectLanguage(acceptLanguageHeader: string): string {
    const preferredLang = acceptLanguageHeader.split(',')[0].split('-')[0] as AppLanguages;
    return this.supportedLanguages.includes(preferredLang)
      ? preferredLang
      : this.supportedLanguages[0];
  }

  public getJoiTranslations() {
    return {
      en: JOI_EN_TRANSLATION,
      ar: JOI_AR_TRANSLATION,
    };
  }

  // Type-safe translate method
  public t<T extends keyof TranslationKeys>(
    key: T,
    interpolations?: Record<string, unknown>
  ): string {
    return this.polyglot.t(key, interpolations);
  }
}

export const i18n = new I18n();
