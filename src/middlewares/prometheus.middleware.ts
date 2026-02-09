import { Request, Response, NextFunction } from 'express';
import {
  httpRequestDuration,
  httpRequestTotal,
  httpRequestsInProgress,
  errorTotal,
} from '../config/prometheus.config';

export function prometheusMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Skip metrics collection for the metrics endpoint itself
  if (req.path === '/metrics') {
    return next();
  }

  const start = Date.now();
  const route = req.route?.path || req.path || 'unknown';
  const method = req.method;

  // Increment in-progress counter
  httpRequestsInProgress.inc({ method, route });

  // Capture the original end method
  const originalEnd = res.end;

  // Override the end method to capture response data
  res.end = function (chunk?: any, encoding?: any, callback?: any): any {
    // Calculate duration
    const duration = (Date.now() - start) / 1000;
    const statusCode = res.statusCode.toString();

    // Record metrics
    httpRequestDuration.observe({ method, route, status_code: statusCode }, duration);
    httpRequestTotal.inc({ method, route, status_code: statusCode });
    httpRequestsInProgress.dec({ method, route });

    // Track errors (4xx and 5xx)
    if (res.statusCode >= 400) {
      const errorType = res.statusCode >= 500 ? 'server_error' : 'client_error';
      errorTotal.inc({ type: errorType, route });
    }

    // Call the original end method
    return originalEnd.call(res, chunk, encoding, callback);
  };

  next();
}
