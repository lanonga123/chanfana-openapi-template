import { z } from "zod";
import { OpenAPIRoute } from "chanfana";

export class DummyEndpoint extends OpenAPIRoute {
  schema = {
    tags: ["Dummy"],
    summary: "Test endpoint",
    request: {
      params: z.object({ slug: z.string().describe("Un slug de prueba") }),
    },
    responses: {
      "200": {
        description: "Ok",
        content: {
          "application/json": { schema: z.object({ message: z.string() }) },
        },
      },
    },
  };
  async handle(c: any) {
    const data = await this.getValidatedData<typeof this.schema>();
    return c.json({ message: `Working with slug: ${data.params.slug}` });
  }
}
