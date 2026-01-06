import { fromHono } from "chanfana";
import { Hono } from "hono";
import { TaskList } from "./endpoints/tasks/router";
import { DummyEndpoint } from "./endpoints/dummyEndpoint";

const app = new Hono();

// === SEGURIDAD Y HEADERS (HEATERS) ===
app.use("*", async (c, next) => {
  await next();
  c.header("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  c.header("X-Frame-Options", "SAMEORIGIN");
  c.header("X-Content-Type-Options", "nosniff");
  c.header("Referrer-Policy", "strict-origin-when-cross-origin");
  
  // CSP optimizado: permite Swagger, Logo de GitHub y Fetch interno
  c.header(
    "Content-Security-Policy",
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; " +
    "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; " +
    "img-src 'self' data: https://aegistechmx.github.io; " +
    "connect-src 'self'; " + 
    "font-src 'self' https://cdn.jsdelivr.net;"
  );
});

// === CONFIGURACIÓN OPENAPI CON CHANFANA ===
const openapi = fromHono(app, {
  docs_url: "/",
  schema: {
    openapi: "3.0.0",
    info: {
      title: "AegisTech Task API",
      version: "1.0.0",
      description: "Gestión de tareas 🚀",
      "x-logo": {
        url: "aegistechmx.github.io",
        altText: "AegisTechMX",
        backgroundColor: "#0a0a0a"
      },
    },
  },
});

// === REGISTRO DE RUTAS (Modo Plano para evitar Error 500) ===
openapi.get("/health", (c) => c.json({ status: "ok", date: new Date().toISOString() }));
openapi.get("/tasks", TaskList);
openapi.post("/dummy/:slug", DummyEndpoint);

export default app;
