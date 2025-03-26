import adobePolyfills from "../../src/index";
import type { Plugin, TransformPluginContext, RollupError } from "rollup";

describe("adobe-script-polyfills plugin", () => {
  let plugin: Plugin;

  beforeEach(() => {
    plugin = adobePolyfills({ include: ["**/test.ts"] });
  });

  const transform = async (code: string) => {
    const transformFn = typeof plugin.transform === "function" ? plugin.transform : plugin.transform?.handler;

    if (!transformFn) {
      throw new Error("Transform function not found");
    }

    const mockContext: Partial<TransformPluginContext> = {
      error: (error: string | RollupError) => {
        throw new Error(typeof error === "string" ? error : error.message || "Unknown error");
      },
    };

    const result = await transformFn.call(mockContext as TransformPluginContext, code, "test.ts");

    if (typeof result === "string") {
      return result;
    }
    return result?.code;
  };

  describe("string literal method calls", () => {
    it("should detect multiple methods on string literals", async () => {
      const code = `
        "hello".at(1);
        "world".padEnd(10);
      `;
      const result = await transform(code);

      expect(result).toContain("String.prototype.at");
      expect(result).toContain("String.prototype.padEnd");
    });
  });

  describe("variable string method calls", () => {
    it("should detect multiple methods on string variables", async () => {
      const code = `
        const str1 = "hello";
        const str2 = "world";
        str1.at(1);
        str2.padEnd(10);
      `;
      const result = await transform(code);

      expect(result).toContain("String.prototype.at");
      expect(result).toContain("String.prototype.padEnd");
    });
  });

  describe("mixed usage", () => {
    it("should detect both literal and variable method calls", async () => {
      const code = `
        "hello".at(1);
        const str = "world";
        str.padEnd(10);
      `;
      const result = await transform(code);
      expect(result).toContain("String.prototype.at");
      expect(result).toContain("String.prototype.padEnd");
    });
  });

  describe("negative cases", () => {
    it("should not detect non-string method calls", async () => {
      const code = `
        const arr = [1, 2, 3];
        arr.at(1);
        const num = 123;
        num.toString();
      `;

      const result = await transform(code);

      expect(result).not.toContain("string.at");
    });

    it("should not detect non-targeted string methods", async () => {
      const code = `
        "hello".indexOf("o");
        const str = "world";
        str.length;
      `;
      const result = await transform(code);
      console.log(result);

      expect(result).not.toContain("String.prototype.indexOf");
    });

    it("should not change", async () => {
      const code = `
        "hello".indexOf("o");
        const str = "world";
        str.length;
      `;
      const result = await transform(code);
      console.log(result); // undefined

      expect(result).not.toContain("String.prototype.indexOf");
    });
  });

  describe("array method calls", () => {
    it("should detect array methods", async () => {
      const code = `
        [1, 2, 3].at(1);
        const arr = [4, 5, 6];
        arr.includes(5);
      `;
      const result = await transform(code);

      expect(result).toContain("Array.prototype.at");
      expect(result).toContain("Array.prototype.includes");
    });
  });

  describe("function method calls", () => {
    it("should detect function methods", async () => {
      const code = `
        function test() {}; test.bind(this);
        const fn = () => {};
        fn.name;
      `;
      const result = await transform(code);

      expect(result).toContain("Function.prototype.bind");
      expect(result).toContain("Function.prototype.name");
    });
  });

  describe("object method calls", () => {
    it("should detect object methods", async () => {
      const code = `
        Object.assign({}, { a: 1 });
        const obj = {};
        Object.getPrototypeOf(obj);
      `;
      const result = await transform(code);

      expect(result).toContain("Object.assign = function");
      expect(result).toContain("Object.getPrototypeOf = function");
    });
  });
});
