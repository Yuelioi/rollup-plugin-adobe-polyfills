import { processor } from "../../src/math";
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

describe("Math method calls", () => {
  it("should detect Math.cbrt method", async () => {
    const code = "Math.cbrt(27)";
    const { file, needsPolyfill } = createEnv(code);
    file.forEachDescendant((node) => {
      processor(node, needsPolyfill);
    });

    expect(needsPolyfill).toContain("math.cbrt");
  });

  it("should detect Math.clz32 method", async () => {
    const code = "Math.clz32(1)";
    const { file, needsPolyfill } = createEnv(code);
    file.forEachDescendant((node) => {
      processor(node, needsPolyfill);
    });

    expect(needsPolyfill).toContain("math.clz32");
  });

  it("should detect multiple Math methods", async () => {
    const code = `
      Math.cbrt(27);
      Math.clz32(1);
      Math.sign(-5);
    `;
    const { file, needsPolyfill } = createEnv(code);
    file.forEachDescendant((node) => {
      processor(node, needsPolyfill);
    });

    expect(needsPolyfill).toContain("math.cbrt");
    expect(needsPolyfill).toContain("math.clz32");
    expect(needsPolyfill).toContain("math.sign");
  });
});

describe("negative cases", () => {
  it("should not detect non-Math method calls", async () => {
    const code = `
      const obj = {};
      obj.cbrt();
      const num = 27;
      num.clz32();
    `;
    const { file, needsPolyfill } = createEnv(code);
    file.forEachDescendant((node) => {
      processor(node, needsPolyfill);
    });

    expect(needsPolyfill.size).toBe(0);
  });

  it("should not detect non-targeted Math methods", async () => {
    const code = `
      Math.PI;
      Math.random();
      Math.floor(3.14);
    `;
    const { file, needsPolyfill } = createEnv(code);
    file.forEachDescendant((node) => {
      processor(node, needsPolyfill);
    });

    expect(needsPolyfill.size).toBe(0);
  });
});
