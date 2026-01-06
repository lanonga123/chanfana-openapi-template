import { OpenAPIRoute } from "chanfana";
import { z } from "zod";

export class TaskUpdate extends OpenAPIRoute {
  schema = {
    tags: ["Tasks"],
    summary: "Marcar tarea como completada",
    request: {
      params: z.object({
        slug: z.string().describe("El slug de la tarea"),
      }),
    },
    responses: {
      "200": {
        description: "Tarea actualizada",
        content: { "application/json": { schema: z.object({ success: z.boolean() }) } },
      },
    },
  };

  async handle(c: any) {
    const { slug } = await c.req.valid("param");

    await c.env.DB.prepare(
      "UPDATE tasks SET completed = 1 WHERE slug = ?"
    )
    .bind(slug)
    .run();

    return { success: true };
  }
}