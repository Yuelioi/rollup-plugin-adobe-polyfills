import { processor } from "../../src/object";
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

describe("Object static method calls", () => {
  it("should detect Object.assign method", async () => {
    const code = "Object.assign({}, { a: 1 })";
    const { file, needsPolyfill } = createEnv(code);
    file.forEachDescendant((node) => {
      processor(node, needsPolyfill);
    });

    expect(needsPolyfill).toContain("object.assign");
  });

  it("should detect Object.entries method", async () => {
    const code = "Object.entries({ a: 1, b: 2 })";
    const { file, needsPolyfill } = createEnv(code);
    file.forEachDescendant((node) => {
      processor(node, needsPolyfill);
    });

    expect(needsPolyfill).toContain("object.entries");
  });

  it("should detect multiple Object static methods", async () => {
    const code = `
      Object.assign({}, { a: 1 });
      Object.entries({ a: 1, b: 2 });
      Object.keys({ a: 1, b: 2 });
    `;
    const { file, needsPolyfill } = createEnv(code);
    file.forEachDescendant((node) => {
      processor(node, needsPolyfill);
    });

    expect(needsPolyfill).toContain("object.assign");
    expect(needsPolyfill).toContain("object.entries");
    expect(needsPolyfill).toContain("object.keys");
  });
});

describe("negative cases", () => {
  it("should not detect non-Object method calls", async () => {
    const code = `
      const arr = [];
      arr.assign();
      const str = "test";
      str.assign();
    `;
    const { file, needsPolyfill } = createEnv(code);
    file.forEachDescendant((node) => {
      processor(node, needsPolyfill);
    });

    expect(needsPolyfill.size).toBe(0);
  });

  it("should not detect non-targeted Object methods", async () => {
    const code = `
      Object.prototype;
      Object.getOwnPropertyNames({});
      Object.seal({});
    `;
    const { file, needsPolyfill } = createEnv(code);
    file.forEachDescendant((node) => {
      processor(node, needsPolyfill);
    });

    expect(needsPolyfill.size).toBe(0);
  });
});
