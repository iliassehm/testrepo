import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import * as Sentry from '@sentry/node';

@Catch()
export class SentryFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // Ajouter des informations contextuelles supplémentaires dans le scope Sentry
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    Sentry.withScope(scope => {
      const request = host.switchToHttp().getRequest();

      // Ajouter des informations de la requête, comme l'URL, les headers, etc.
      scope.setExtra('url', request.url);
      scope.setExtra('method', request.method);
      scope.setExtra('headers', request.headers);
      scope.setExtra('body', request.body);

      // Capturer l'exception
      Sentry.captureException(exception);
    });

    // Appeler la méthode parente pour que NestJS continue de gérer l'exception
    super.catch(exception, host);
  }
}
