import { OpenAPIRoute } from "chanfana";
import { z } from "zod";

export class TaskRead extends OpenAPIRoute {
  schema = {
    tags: ["Tasks"],
    summary: "Listar tareas",
    responses: {
      "200": {
        description: "OK",
        content: {
          "application/json": {
            schema: z.object({
              success: z.boolean(),
              result: z.array(z.object({
                id: z.number(),
                name: z.string(),
                slug: z.string(),
                description: z.string(),
                completed: z.boolean(),
                due_date: z.string(),
              })),
            }),
          },
        },
      },
    },
  };

  async handle(c: any) {
    const { results } = await c.env.DB.prepare("SELECT * FROM tasks").all();
    return { success: true, result: results || [] };
  }
}