import { expect, test } from "@playwright/test";

test.describe("auth guard", () => {
  test("redirects unauthenticated user from /products to /login", async ({
    page,
  }) => {
    await page.goto("/products");
    await expect(page).toHaveURL(/\/login$/);
  });

  test("redirects authenticated user from /login to /products", async ({
    context,
    page,
    baseURL,
  }) => {
    if (!baseURL) {
      throw new Error("baseURL is required for this test");
    }

    await context.addCookies([
      {
        name: "accessToken",
        value: "fake-token",
        url: baseURL,
      },
    ]);

    await page.goto("/login");
    await expect(page).toHaveURL(/\/products$/);
  });
});
