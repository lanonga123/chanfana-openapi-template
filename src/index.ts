import { fromHono } from "chanfana";
import { Hono } from "hono";
import { TaskRead } from "./endpoints/tasks/taskRead";
import { TaskCreate } from "./endpoints/tasks/taskCreate";
import { TaskUpdate } from "./endpoints/tasks/taskUpdate";
import { TaskDelete } from "./endpoints/tasks/taskDelete";

const app = new Hono();

// Configuración base de OpenAPI
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

// Registro de rutas (Asegúrate de que estas clases existan en sus archivos)
openapi.get("/tasks", TaskRead);
openapi.post("/tasks", TaskCreate);
openapi.put("/tasks/:slug", TaskUpdate);
openapi.delete("/tasks/:slug", TaskDelete);

export default app;