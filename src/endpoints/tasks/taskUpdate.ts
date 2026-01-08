import { OpenAPIRoute } from "chanfana";
import { z } from "zod";

export class TaskUpdate extends OpenAPIRoute {
  schema = {
    tags: ["Tasks"],
    summary: "Marcar tarea como completada",
    request: {
      params: z.object({
        slug: z.string().describe("El slug único de la tarea"),
      }),
      body: {
        content: {
          "application/json": {
            schema: z.object({ completed: z.boolean().describe("Estado de completado de la tarea") }),
          },
        },
      },
    },
    responses: {
      "200": {
        description: "Tarea actualizada correctamente",
        content: {
          "application/json": {
            schema: z.object({
              success: z.boolean(),
            }),
          },
        },
      },
    },
  };

  async handle(c: any) {
    // Validamos el parámetro 'slug' definido en el schema
    const data = await this.getValidatedData<typeof this.schema>();
    const { slug } = data.params; // Obtener el slug de los parámetros
    const { completed } = data.body; // Obtener el estado de completado del cuerpo de la solicitud

    try {
      await c.env.DB.prepare("UPDATE tasks SET completed = ? WHERE slug = ?")
        .bind(completed ? 1 : 0, slug) // Usar 1 para true, 0 para false
        .run();

      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }
}