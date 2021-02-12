import { schema } from "../src/main";

describe("main", () => {
  describe("Schema", () => {
    test("Schema should have correct user and application type", () => {
      const typeArray = schema.toConfig().types.map((item) => item.name);
      expect(typeArray.includes("UserResponse")).toBeTruthy();
      expect(typeArray.includes("UserInput")).toBeTruthy();
      expect(typeArray.includes("ApplicationResponse")).toBeTruthy();
      expect(typeArray.includes("ApplicationInput")).toBeTruthy();
    });
  });
});
