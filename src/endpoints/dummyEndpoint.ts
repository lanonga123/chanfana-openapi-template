import { OpenAPIRoute } from "chanfana";
import { z } from "zod";

export class DummyEndpoint extends OpenAPIRoute {
  schema = {
    tags: ["System"],
    summary: "Endpoint de prueba",
    request: {
      params: z.object({ slug: z.string() }),
    },
    responses: {
      "200": {
        description: "Ok",
        content: { "application/json": { schema: z.object({ message: z.string() }) } },
      },
    },
  };
  async handle(c: any) {
    const data = await c.req.valid("param");
    return { message: "Funcionando", slug: data.slug };
  }
}