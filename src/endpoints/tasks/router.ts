import { OpenAPIRoute, fromHono } from "chanfana";
import { Hono } from "hono";
import { z } from "zod";

// 1. Definir esquemas primero
const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  completed: z.boolean(),
});

// 2. Definir la CLASE (Debe ir antes de usarse en el router)
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

// 3. Crear el router y registrar la clase después de definirla
const tasks = new Hono();
const router = fromHono(tasks);

// Ahora TaskList ya está definida y no dará ReferenceError
router.get("/", TaskList);

export const tasksRouter = tasks;
