"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const Sentry = require("@sentry/node");
const SentryFilter_1 = require("./SentryFilter");
const app_module_1 = require("./app.module");
async function bootstrap() {
    Sentry.init({
        dsn: 'https://f3ae5fd9cb05634a33b764ae57d13861@o4509072878731264.ingest.de.sentry.io/4509073042243664',
    });
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const { httpAdapter } = app.get(core_1.HttpAdapterHost);
    app.useGlobalFilters(new SentryFilter_1.SentryFilter(httpAdapter));
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map