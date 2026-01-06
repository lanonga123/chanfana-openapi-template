import { OpenAPIRoute, fromHono } from "chanfana";
import { Hono } from "hono";
import { z } from "zod";

// 1. Esquema de la tarea
const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  completed: z.boolean(),
});

// 2. Definir Endpoints como CLASES (Esto evita el error de constructor)
class TaskList extends OpenAPIRoute {
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

  async handle(c: any) {
    return {
      tasks: [
        { id: "1", title: "Task 1", completed: false },
      ],
    };
  }
}

// 3. Configurar el Router correctamente
const baseHono = new Hono();
export const tasksRouter = fromHono(baseHono);

// IMPORTANTE: Aquí se pasa la clase TaskList sin paréntesis ()
tasksRouter.get("/", TaskList);

// Exportar para compatibilidad
export { TaskList };
