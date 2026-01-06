import { OpenAPIRoute } from "chanfana";
import { z } from "zod";

export class TaskUpdate extends OpenAPIRoute {
  schema = {
    tags: ["Tasks"],
    summary: "Completar tarea",
    request: { params: z.object({ slug: z.string() }) },
    responses: { "200": { description: "OK", content: { "application/json": { schema: z.object({ success: z.boolean() }) } } } },
  };

  async handle(c: any) {
    const { slug } = await c.req.valid("param");
    await c.env.DB.prepare("UPDATE tasks SET completed = 1 WHERE slug = ?").bind(slug).run();
    return { success: true };
  }
}