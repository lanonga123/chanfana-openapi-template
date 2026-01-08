import { SELF } from "cloudflare:test";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("Dummy API Integration Tests", () => {
	beforeEach(async () => {
		vi.clearAllMocks();
	});
	// The dummy endpoint is a GET request, not POST.
	// The dummy endpoint does not accept a request body.
	describe("GET /dummy/{slug}", () => {
		it("should return the log details", async () => {
			const slug = "test-slug";
			const response = await SELF.fetch(`http://local.test/dummy/${slug}`);
			const body = await response.json<{ message: string }>();

			expect(response.status).toBe(200);
			expect(body.message).toBe(`Funcionando con slug: ${slug}`);
		});
	});
});
