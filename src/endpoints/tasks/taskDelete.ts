import { OpenAPIRoute } from "chanfana";
import { z } from "zod";

export class TaskDelete extends OpenAPIRoute {
  schema = {
    tags: ["Tasks"],
    summary: "Eliminar tarea",
    request: { params: z.object({ slug: z.string() }) },
    responses: { "200": { description: "OK", content: { "application/json": { schema: z.object({ success: z.boolean() }) } } } },
  };

  async handle(c: any) {
    const data = await this.getValidatedData<typeof this.schema>();
    const { slug } = data.params;

    await c.env.DB.prepare("DELETE FROM tasks WHERE slug = ?").bind(slug).run();
    return { success: true };
  }
}