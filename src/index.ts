import { fromHono } from "chanfana";
import { Hono } from "hono";
import { TaskRead } from "./endpoints/tasks/taskRead";
import { TaskCreate } from "./endpoints/tasks/taskCreate";
import { TaskUpdate } from "./endpoints/tasks/taskUpdate";
import { TaskDelete } from "./endpoints/tasks/taskDelete";

const app = new Hono();

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

export default {
  async fetch(request: Request, env: any, ctx: any) {
    const response = await app.fetch(request, env, ctx);
    
    // Creamos una nueva respuesta para inyectar headers de seguridad grado A
    const newHeaders = new Headers(response.headers);
    
    newHeaders.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    newHeaders.set("X-Frame-Options", "SAMEORIGIN");
    newHeaders.set("X-Content-Type-Options", "nosniff");
    newHeaders.set("Referrer-Policy", "strict-origin-when-cross-origin");
    newHeaders.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    
    // CSP Ajustado: Permite que Swagger cargue el JSON desde cualquier parte del mismo dominio
    newHeaders.set("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; img-src 'self' data: https://fastly.jsdelivr.net; connect-src 'self' *;");

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  },
};