"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sentry = require("@sentry/nestjs");
Sentry.init({
    dsn: 'https://f3ae5fd9cb05634a33b764ae57d13861@o4509072878731264.ingest.de.sentry.io/4509073042243664',
    profileSessionSampleRate: 1.0,
});
//# sourceMappingURL=sentry.js.map