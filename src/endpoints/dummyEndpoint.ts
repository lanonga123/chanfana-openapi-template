import { OpenAPIRoute } from "chanfana";
import { z } from "zod";

export class DummyEndpoint extends OpenAPIRoute<any> {
  schema = {
    tags: ["System"],
    summary: "Endpoint de prueba",
    request: {
      params: z.object({ slug: z.string().describe("Un slug de prueba") }),
    },
    responses: {
      "200": {
        description: "Ok",
        content: { "application/json": { schema: z.object({ message: z.string() }) } },
      },
    },
  };
  async handle(c) {
    const { slug } = await this.getValidatedData();
    return { message: `Funcionando con slug: ${slug}` };
  }
}