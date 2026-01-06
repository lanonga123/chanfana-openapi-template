import { fromHono } from "chanfana";
import { Hono } from "hono";
import { TaskList } from "./endpoints/tasks/router"; 
import { DummyEndpoint } from "./endpoints/dummyEndpoint"; 

const app = new Hono();

// --- SEGURIDAD GRADO A+ ---
app.use("*", async (c, next) => {
  await next();
  c.header("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  c.header("X-Frame-Options", "SAMEORIGIN");
  c.header("X-Content-Type-Options", "nosniff");
  c.header("Referrer-Policy", "strict-origin-when-cross-origin");
  c.header("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  
  // Actualizado connect-src para permitir los mapas de Swagger y corregir el error de consola
  c.header(
    "Content-Security-Policy",
    "default-src 'self'; " +
    "script-src 'self' https://cdn.jsdelivr.net 'sha256-k50uV4UJTsLb556/ssV/UqPtQnzt3a3VxHTxwJ0rxYo='; " + 
    "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; " + 
    "img-src 'self' data: https://aegistechmx.github.io https://raw.githubusercontent.com; " + 
    "font-src 'self' https://cdn.jsdelivr.net; " + 
    "connect-src 'self' https://cdn.jsdelivr.net;"
  );
});

const openapi = fromHono(app, {
  docs_url: "/",
  schema: {
    openapi: "3.0.0",
    info: {
      title: "AegisTech API",
      version: "1.0.0",
      description: "![Logo](https://aegistechmx.github.io/images/logo-aegistech-dark.png)\n\n API de Gestión de Tareas Segura",
    },
  },
});

// --- REGISTRO DE RUTAS ---
// Usamos el registro directo para evitar errores de contexto
openapi.get("/tasks", TaskList);
openapi.post("/dummy/:slug", DummyEndpoint);

export default app;