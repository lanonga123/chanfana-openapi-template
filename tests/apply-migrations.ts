import { applyD1Migrations } from "@cloudflare/vitest-pool-workers/config";

// Setup files run outside isolated storage, and may be run multiple times.
// `applyD1Migrations()` only applies migrations that haven't already been applied, therefore it is safe to call this function here.
await applyD1Migrations(globalThis.env.DB, globalThis.env.D1_MIGRATIONS);
