import { fromHono } from "chanfana";
import { Hono } from "hono";
import { tasksRouter } from "./endpoints/tasks/router";
import { DummyEndpoint } from "./endpoints/dummyEndpoint";

const app = new Hono();

// === MIDDLEWARE DE SEGURIDAD (PARA GRADO A+) ===
app.use("*", async (c, next) => {
  await next();

  // 1. Cabeceras de seguridad fundamentales
  c.header("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  c.header("X-Frame-Options", "SAMEORIGIN");
  c.header("X-Content-Type-Options", "nosniff");
  c.header("Referrer-Policy", "strict-origin-when-cross-origin");
  c.header("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  // 2. Content Security Policy (Optimizado para Grado A+)
  // Hemos eliminado 'unsafe-inline' de script-src.
  // Mantenemos 'unsafe-inline' en style-src porque Swagger lo requiere para los colores.
  c.header(
    "Content-Security-Policy",
    "default-src 'self'; " +
    "script-src 'self' https://cdn.jsdelivr.net; " + 
    "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; " + 
    "img-src 'self' data: https://aegistechmx.github.io https://raw.githubusercontent.com; " +
    "font-src 'self' https://cdn.jsdelivr.net; " +
    "connect-src 'self';"
  );
});

// === CONFIGURACIÓN DE OPENAPI ===
const openapi = fromHono(app, {
  docs_url: "/",
  schema: {
    openapi: "3.0.0",
    info: {
      title: "Task Management API",
      version: "1.0.0",
      description: 
        "![AegisTech Logo](https://aegistechmx.github.io/images/logo-aegistech-dark.png)\n\n" +
        "API para gestión de tareas con seguridad AegisTech 🚀",
    },
  },
});

// === REGISTRAR ENDPOINTS ===
openapi.get("/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Rutas de la API
openapi.route("/tasks", tasksRouter);
openapi.post("/dummy/:slug", DummyEndpoint);

// === RUTA PARA EL ESQUEMA JSON ===
// Esto evita el error 500 al cargar la definición de la API
app.get("/openapi.json", (c) => {
  return c.json(openapi.getSchema());
});

// === EXPORTAR PARA CLOUDFLARE ===
export default app;