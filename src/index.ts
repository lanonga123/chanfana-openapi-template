import { fromHono } from "chanfana";
import { Hono } from "hono";
import { TaskList } from "./endpoints/tasks/router";
import { DummyEndpoint } from "./endpoints/dummyEndpoint";

const app = new Hono();

// === 1. MIDDLEWARE DE SEGURIDAD (HEATERS / HEADERS) ===
app.use("*", async (c, next) => {
  await next();

  // Cabeceras de seguridad estándar
  c.header("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  c.header("X-Frame-Options", "SAMEORIGIN");
  c.header("X-Content-Type-Options", "nosniff");
  c.header("Referrer-Policy", "strict-origin-when-cross-origin");
  
  // CSP: Permite Swagger UI de CDN, Logo de GitHub y Fetch interno al JSON
  c.header(
    "Content-Security-Policy",
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; " +
    "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; " +
    "img-src 'self' data: https://aegistechmx.github.io; " +
    "connect-src 'self'; " + // Vital para cargar /openapi.json
    "font-src 'self' https://cdn.jsdelivr.net;"
  );

  // CORS básico
  c.header("Access-Control-Allow-Origin", "*");
});

// === 2. CONFIGURACIÓN DE OPENAPI CON CHANFANA ===
const openapi = fromHono(app, {
  docs_url: "/", // Swagger UI en la raíz
  schema: {
    openapi: "3.0.0",
    info: {
      title: "AegisTech Task API",
      version: "1.0.0",
      description: "API de gestión de tareas corregida 2026 🚀",
      "x-logo": {
        url: "aegistechmx.github.io",
        altText: "AegisTechMX",
        backgroundColor: "#0a0a0a"
      },
    },
  },
});

// === 3. REGISTRO PLANO (Elimina el Error 500 de 'parent') ===
openapi.get("/health", (c) => c.json({ status: "ok", timestamp: new Date().toISOString() }));
openapi.get("/tasks", TaskList);
openapi.post("/dummy/:slug", DummyEndpoint);

export default app;
