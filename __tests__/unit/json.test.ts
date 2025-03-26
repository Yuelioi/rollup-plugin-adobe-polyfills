import { processor } from "../../src/json";
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

describe("JSON method calls", () => {
  it("should detect JSON.parse method", async () => {
    const code = "JSON.parse('{}')";
    const { file, needsPolyfill } = createEnv(code);
    file.forEachDescendant((node) => {
      processor(node, needsPolyfill);
    });

    expect(needsPolyfill).toContain("json.json2");
  });

  it("should detect JSON.stringify method", async () => {
    const code = "JSON.stringify({})";
    const { file, needsPolyfill } = createEnv(code);
    file.forEachDescendant((node) => {
      processor(node, needsPolyfill);
    });

    expect(needsPolyfill).toContain("json.json2");
  });

  it("should detect multiple JSON method calls", async () => {
    const code = `
      JSON.parse('{}');
      JSON.stringify({});
    `;
    const { file, needsPolyfill } = createEnv(code);
    file.forEachDescendant((node) => {
      processor(node, needsPolyfill);
    });

    expect(needsPolyfill).toContain("json.json2");
  });
});

describe("negative cases", () => {
  it("should not detect non-JSON method calls", async () => {
    const code = `
      const obj = {};
      obj.parse();
      const str = "test";
      str.stringify();
    `;
    const { file, needsPolyfill } = createEnv(code);
    file.forEachDescendant((node) => {
      processor(node, needsPolyfill);
    });

    expect(needsPolyfill.size).toBe(0);
  });

  it("should not detect JSON property access without method call", async () => {
    const code = `
      JSON;
      const json = JSON;
    `;
    const { file, needsPolyfill } = createEnv(code);
    file.forEachDescendant((node) => {
      processor(node, needsPolyfill);
    });

    expect(needsPolyfill.size).toBe(0);
  });
});
