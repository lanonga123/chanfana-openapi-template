import { OpenAPIRoute } from "chanfana";
import { z } from "zod";

export class TaskRead extends OpenAPIRoute {
  schema = {
    tags: ["Tasks"],
    summary: "Listar todas las tareas",
    responses: {
      "200": {
        description: "Lista de tareas",
        content: { "application/json": { schema: z.object({ tasks: z.array(z.any()) }) } },
      },
    },
  };

  async handle(c: any) {
    const { results } = await c.env.DB.prepare("SELECT * FROM tasks").all();
    return { tasks: results || [] };
  }
}