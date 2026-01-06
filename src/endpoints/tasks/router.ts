import { OpenAPIRoute, fromHono } from "chanfana";
import { Hono } from "hono";
import { z } from "zod";

// --- Esquemas ---
const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  completed: z.boolean(),
});

// --- Endpoints usando CLASES (Correcto para 2026) ---

class TaskList extends OpenAPIRoute {
  schema = {
    tags: ["Tasks"],
    summary: "List all tasks",
    responses: {
      "200": {
        description: "Returns a list of tasks",
        content: {
          "application/json": {
            schema: z.object({ tasks: z.array(TaskSchema) }),
          },
        },
      },
    },
  };

  async handle(c: any) {
    return {
      tasks: [
        { id: "1", title: "Task 1", completed: false },
      ],
    };
  }
}

class TaskCreate extends OpenAPIRoute {
  schema = {
    tags: ["Tasks"],
    summary: "Create a new task",
    request: {
      body: {
        content: {
          "application/json": {
            schema: z.object({
              title: z.string().min(1),
              completed: z.boolean().optional().default(false),
            }),
          },
        },
      },
    },
    responses: {
      "201": {
        description: "Task created",
        content: { "application/json": { schema: TaskSchema } },
      },
    },
  };

  async handle(c: any) {
    const data = await c.req.valid("json");
    return {
      id: Date.now().toString(),
      ...data,
    };
  }
}

// --- Configuración del Router ---
const hono = new Hono();
export const tasksRouter = fromHono(hono);

// Registramos las clases directamente (SIN paréntesis)
tasksRouter.get("/", TaskList);
tasksRouter.post("/", TaskCreate);
// ... repite el patrón de clase para Read, Update y Delete

