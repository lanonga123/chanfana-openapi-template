import { OpenAPIRoute } from "chanfana";
import { z } from "zod";

// Esquema flexible para coincidir con tu tabla vacía/null
const TaskSchema = z.object({
  id: z.any(),
  name: z.string().nullable(),
  slug: z.string().nullable(),
  description: z.string().nullable(),
  completed: z.any().nullable(),
  due_date: z.any().nullable(),
});

export class TaskList extends OpenAPIRoute {
  schema = {
    tags: ["Tasks"],
    summary: "List all tasks",
    responses: {
      "200": {
        description: "Ok",
        content: { 
          "application/json": { 
            schema: z.object({ 
              tasks: z.array(TaskSchema) 
            }) 
          } 
        },
      },
    },
  };

  async handle(c: any) {
    try {
      // Usamos el nombre de la tabla en minúsculas 'tasks' como aparece en tu consola
      const { results } = await c.env.DB.prepare("SELECT * FROM tasks").all();
      return { tasks: results || [] };
    } catch (e: any) {
      console.error("Error de D1:", e.message);
      return { tasks: [], error: e.message };
    }
  }
}