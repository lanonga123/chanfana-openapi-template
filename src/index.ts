import { fromHono } from "chanfana";
import { Hono } from "hono";
import { TaskRead } from "./endpoints/tasks/taskRead";
import { TaskCreate } from "./endpoints/tasks/taskCreate";
import { TaskUpdate } from "./endpoints/tasks/taskUpdate";
import { TaskDelete } from "./endpoints/tasks/taskDelete";

const app = new Hono();

// --- BLOQUE DE SEGURIDAD (Middleware) ---
app.use("*", async (c, next) => {
  await next();
  // HSTS: Fuerza HTTPS
  c.header("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  // Previene Clickjacking
  c.header("X-Frame-Options", "SAMEORIGIN");
  // Previene MIME-sniffing
  c.header("X-Content-Type-Options", "nosniff");
  // Controla qué info se envía al salir del sitio
  c.header("Referrer-Policy", "strict-origin-when-cross-origin");
  // Limita APIs del navegador (Cámara, Micro, etc)
  c.header("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  // CSP Básico (Permite Swagger y scripts propios)
  c.header("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; img-src 'self' data: https://fastly.jsdelivr.net;");
});
// ----------------------------------------

const openapi = fromHono(app, {
  docs_url: "/",
  schema: {
    openapi: "3.0.0",
    info: {
      title: "AegisTech API",
      version: "1.0.0",
    },
  },
});

openapi.get("/tasks", TaskRead);
openapi.post("/tasks", TaskCreate);
openapi.put("/tasks/:slug", TaskUpdate);
openapi.delete("/tasks/:slug", TaskDelete);

export default app;