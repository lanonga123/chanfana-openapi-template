import { OpenAPIRoute, fromHono } from "chanfana";
import { Hono } from "hono";
import { z } from "zod";

const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  completed: z.boolean(),
});

export class TaskList extends OpenAPIRoute {
  schema = {
    tags: ["Tasks"],
    summary: "List all tasks",
    responses: {
      "200": {
        description: "Ok",
        content: { "application/json": { schema: z.object({ tasks: z.array(TaskSchema) }) } },
      },
    },
  };
  async handle(c: any) {
    return { tasks: [{ id: "1", title: "Task 1", completed: false }] };
  }
}

const baseHono = new Hono();
export const tasksRouter = fromHono(baseHono);
tasksRouter.get("/", TaskList);