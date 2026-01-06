import { OpenAPIRoute, fromHono } from "chanfana";
import { Hono } from "hono";
import { z } from "zod";

const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  completed: z.boolean(),
});

export class TaskList extends OpenAPIRoute {
  schema = {
    tags: ["Tasks"],
    summary: "List all tasks",
    responses: {
      "200": {
        description: "List of tasks",
        content: {
          "application/json": {
            schema: z.object({ tasks: z.array(TaskSchema) }),
          },
        },
      },
    },
  };

  async handle() {
    return {
      tasks: [{ id: "1", title: "Task 1", completed: false }],
    };
  }
}

// --- CORRECCIÓN AQUÍ ---
const tasksRouterBase = new Hono();
const openapi = fromHono(tasksRouterBase);

// Asegúrate de usar el nombre correcto de la variable (openapi)
openapi.get("/", TaskList);

// Exportamos el router de Hono
export const tasksRouter = tasksRouterBase;
