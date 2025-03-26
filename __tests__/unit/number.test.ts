import { processor } from "../../src/number";
import { Project } from "ts-morph";

const project = new Project({
  useInMemoryFileSystem: true,
});

let fileCounter = 0;

function createEnv(code: string) {
  const needsPolyfill = new Set<string>();

  const fileName = `test_${fileCounter++}.ts`;
  const file = project.createSourceFile(fileName, code);
  return { file, needsPolyfill };
}

describe("Number static method calls", () => {
  it("should detect Number.isInteger method", async () => {
    const code = "Number.isInteger(42)";
    const { file, needsPolyfill } = createEnv(code);
    file.forEachDescendant((node) => {
      processor(node, needsPolyfill);
    });

    expect(needsPolyfill).toContain("number.isInteger");
  });

  it("should detect Number.isNaN method", async () => {
    const code = "Number.isNaN(NaN)";
    const { file, needsPolyfill } = createEnv(code);
    file.forEachDescendant((node) => {
      processor(node, needsPolyfill);
    });

    expect(needsPolyfill).toContain("number.isNaN");
  });

  it("should detect multiple Number methods", async () => {
    const code = `
      Number.isInteger(42);
      Number.isNaN(NaN);
    `;
    const { file, needsPolyfill } = createEnv(code);
    file.forEachDescendant((node) => {
      processor(node, needsPolyfill);
    });

    expect(needsPolyfill).toContain("number.isInteger");
    expect(needsPolyfill).toContain("number.isNaN");
  });
});

describe("negative cases", () => {
  it("should not detect non-Number method calls", async () => {
    const code = `
      const obj = {};
      obj.isInteger();
      const num = 42;
      num.isNaN();
    `;
    const { file, needsPolyfill } = createEnv(code);
    file.forEachDescendant((node) => {
      processor(node, needsPolyfill);
    });

    expect(needsPolyfill.size).toBe(0);
  });

  it("should not detect non-targeted Number methods", async () => {
    const code = `
      Number.MAX_VALUE;
      Number.MIN_VALUE;
      Number.parseFloat("42");
    `;
    const { file, needsPolyfill } = createEnv(code);
    file.forEachDescendant((node) => {
      processor(node, needsPolyfill);
    });

    expect(needsPolyfill.size).toBe(0);
  });
});
