import { OpenAPIRoute } from "chanfana";
import { z } from "zod";

export class TaskCreate extends OpenAPIRoute {
  schema = {
    tags: ["Tasks"],
    summary: "Crear una nueva tarea en AegisTech",
    request: {
      body: {
        content: {
          "application/json": {
            schema: z.object({
              name: z.string().min(1).describe("Nombre de la tarea"),
              slug: z.string().min(1).describe("URL amigable única"),
              description: z.string().describe("Detalle de la infraestructura"),
              due_date: z.string().describe("Fecha de vencimiento (YYYY-MM-DD)"),
            }),
          },
        },
      },
    },
    responses: {
      "201": {
        description: "Tarea creada exitosamente",
        content: {
          "application/json": {
            schema: z.object({
              success: z.boolean(),
              task: z.any(),
            }),
          },
        },
      },
    },
  };

  async handle(c: any) {
    const data = await c.req.valid("json");

    // Insertamos en D1 usando los nombres de tus columnas
    // El campo 'completed' inicia en 0 (falso)
    try {
      await c.env.DB.prepare(
        "INSERT INTO tasks (name, slug, description, completed, due_date) VALUES (?, ?, ?, 0, ?)"
      )
      .bind(data.name, data.slug, data.description, data.due_date)
      .run();

      return {
        success: true,
        task: data,
      };
    } catch (e: any) {
      return c.json({ success: false, error: e.message }, 400);
    }
  }
}