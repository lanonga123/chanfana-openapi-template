import { fromHono } from "chanfana";
import { Hono } from "hono";
import { TaskList } from "./endpoints/tasks/router"; // Importamos la CLASE
import { DummyEndpoint } from "./endpoints/dummyEndpoint";

const app = new Hono();

// 2. MIDDLEWARE DE SEGURIDAD
app.use("*", async (c, next) => {
  await next();
  c.header("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  c.header("X-Frame-Options", "SAMEORIGIN");
  c.header("X-Content-Type-Options", "nosniff");
  c.header("Referrer-Policy", "strict-origin-when-cross-origin");
  c.header(
    "Content-Security-Policy",
    "default-src 'self' https://cdn.jsdelivr.net; " +
    "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; " +
    "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; " +
    "img-src 'self' data: https://aegistechmx.github.io; " +
    "font-src 'self' https://cdn.jsdelivr.net;"
  );
});

const openapi = fromHono(app, {
  docs_url: "/",
  schema: {
    openapi: "3.0.0",
    info: {
      title: "Task Management API",
      version: "1.0.0",
      description: "API para gestión de tareas 🚀",
    },
  },
});

// 1. Health check
openapi.get("/health", (c) => c.json({ status: "ok" }));

// 2. Tareas (Registrada directamente)
openapi.get("/tasks", TaskList);

// 3. Dummy (Registrada directamente)
openapi.post("/dummy/:slug", DummyEndpoint);

export default app;