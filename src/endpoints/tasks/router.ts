// src/endpoints/tasks/router.ts
import { OpenAPIRoute } from "chanfana";
import { z } from "zod";

export class TaskList extends OpenAPIRoute {
  schema = {
    tags: ["Tasks"],
    summary: "List all tasks",
    responses: {
      "200": {
        description: "Ok",
        content: { "application/json": { schema: z.object({ tasks: z.array(z.any()) }) } },
      },
    },
  };

  async handle(c: any) {
    // Si esto falla, el error 500 es por la base de datos
    return { tasks: [] }; 
  }
}