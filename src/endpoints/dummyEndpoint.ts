import { OpenAPIRoute } from "chanfana";
import { z } from "zod";

// En Chanfana 2026, usamos clases para evitar el error de constructor
export class DummyEndpoint extends OpenAPIRoute {
  schema = {
    method: "post",
    tags: ["Dummy"],
    summary: "this endpoint is an example",
    operationId: "example-endpoint",
    request: {
      params: z.object({
        slug: z.string(),
      }),
      body: {
        content: {
          "application/json": {
            schema: z.object({
              name: z.string(),
            }),
          },
        },
      },
    },
    responses: {
      "200": {
        description: "Exitoso",
        content: {
          "application/json": {
            schema: z.object({
              success: z.boolean(),
              result: z.object({
                msg: z.string(),
                slug: z.string(),
                name: z.string(),
              }),
            }),
          },
        },
      },
    },
  };

  async handle(c: any) {
    const params = c.req.valid("param");
    const body = await c.req.json(); // Acceso directo al body en Hono

    return {
      success: true,
      result: {
        msg: "this is a dummy endpoint, serving as example",
        slug: params.slug,
        name: body.name,
      },
    };
  }
}
