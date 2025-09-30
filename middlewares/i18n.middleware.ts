import { AppLanguages, i18n } from '../config/i18n/i18n';

function i18nMiddleware(req: any, res: any, next: any) {
  const queryLang = req.query.lang || req.query.locale;
  const cookieLang = req.cookies?.i18next;
  const headerLang = req.headers['accept-language'];

  const lang = i18n.detectLanguage(queryLang || headerLang || cookieLang || AppLanguages.ENGLISH);

  // If language is set via query param, update the cookie
  if (!queryLang && !headerLang && !cookieLang) {
    res.cookie('i18next', lang, {
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
      httpOnly: false, // Allow client-side access if needed
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'lax',
    });
  }

  i18n.setLanguage(lang);
  next();
}

export default i18nMiddleware;
