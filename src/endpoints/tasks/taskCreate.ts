import { OpenAPIRoute } from "chanfana";
import { z } from "zod";

export class TaskCreate extends OpenAPIRoute {
  schema = {
    tags: ["Tasks"],
    summary: "Crear tarea",
    request: {
      body: {
        content: {
          "application/json": {
            schema: z.object({
              name: z.string(),
              slug: z.string(),
              description: z.string(),
              due_date: z.string(),
            }),
          },
        },
      },
    },
    responses: {
      "201": { description: "Creado", content: { "application/json": { schema: z.object({ success: z.boolean() }) } } },
    },
  };

  async handle(c: any) {
    const data = await c.req.valid("json");
    await c.env.DB.prepare(
      "INSERT INTO tasks (name, slug, description, completed, due_date) VALUES (?, ?, ?, 0, ?)"
    ).bind(data.name, data.slug, data.description, data.due_date).run();
    return { success: true };
  }
}