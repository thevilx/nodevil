import { i18n } from '../config/i18n/i18n';
import { CustomError } from '../utils/errors';

function appErrorHandler(err: any, req: any, res: any, _next: any) {
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({
      message: err.message,
    });

    return;
  }

  if (err.status === 401) {
    res.status(401).json({
      message: err.inner.message || 'Unauthorized access !',
    });

    return;
  }

  console.log('An unexpected error happened : ', err);

  res.status(500).json({
    message: i18n.t('errors.unexpected'),
  });
}

export default appErrorHandler;
