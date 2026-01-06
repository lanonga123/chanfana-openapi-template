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

// --- ESTE ES EL TRUCO FINAL ---
export default {
  async fetch(request: Request, env: any, ctx: any) {
    const response = await app.fetch(request, env, ctx);
    
    // Creamos una nueva respuesta basada en la original pero con los headers forzados
    const secureResponse = new Response(response.body, response);
    
    secureResponse.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    secureResponse.headers.set("X-Frame-Options", "SAMEORIGIN");
    secureResponse.headers.set("X-Content-Type-Options", "nosniff");
    secureResponse.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    secureResponse.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    secureResponse.headers.set("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; img-src 'self' data: https://fastly.jsdelivr.net;");
    
    return secureResponse;
  },
};