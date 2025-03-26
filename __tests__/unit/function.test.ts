import { processor } from "../../src/function";
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

describe("function literal method calls", () => {
  it("should detect bind() method on function", async () => {
    const code = "const x = function() {};x.bind(this)";
    const { file, needsPolyfill } = createEnv(code);
    file.forEachDescendant((node) => {
      processor(node, needsPolyfill);
    });

    expect(needsPolyfill).toContain("function.bind");
  });

  it("should detect name property on function", async () => {
    const code = "const x = function() {};x.name";
    const { file, needsPolyfill } = createEnv(code);
    file.forEachDescendant((node) => {
      processor(node, needsPolyfill);
    });

    expect(needsPolyfill).toContain("function.name");
  });

  it("should detect multiple methods on function literal", async () => {
    const code = `
      const x = function() {};
      x.bind(this);
      x.name;
    `;
    const { file, needsPolyfill } = createEnv(code);
    file.forEachDescendant((node) => {
      processor(node, needsPolyfill);
    });

    expect(needsPolyfill).toContain("function.bind");
    expect(needsPolyfill).toContain("function.name");
  });
});

describe("arrow function method calls", () => {
  it("should detect bind() method on arrow function", async () => {
    const code = "const y = (() => {});y.bind(this)";
    const { file, needsPolyfill } = createEnv(code);
    file.forEachDescendant((node) => {
      processor(node, needsPolyfill);
    });

    expect(needsPolyfill).toContain("function.bind");
  });

  it("should detect name property on arrow function", async () => {
    const code = "const y = (() => {}); y.name";
    const { file, needsPolyfill } = createEnv(code);
    file.forEachDescendant((node) => {
      processor(node, needsPolyfill);
    });

    expect(needsPolyfill).toContain("function.name");
  });
});

describe("mixed usage", () => {
  it("should detect methods on different function types", async () => {
    const code = `
      function test1() {};
      const fn = function test2() {};
      fn.name;
      test1.bind(this);
    `;
    const { file, needsPolyfill } = createEnv(code);
    file.forEachDescendant((node) => {
      processor(node, needsPolyfill);
    });

    expect(needsPolyfill).toContain("function.bind");
    expect(needsPolyfill).toContain("function.name");
  });
});

describe("negative cases", () => {
  it("should not detect non-function method calls", async () => {
    const code = `
      const obj = {};
      obj.bind();
      const str = "test";
      str.name;
    `;
    const { file, needsPolyfill } = createEnv(code);
    file.forEachDescendant((node) => {
      processor(node, needsPolyfill);
    });

    expect(needsPolyfill.size).toBe(0);
  });

  it("should not detect non-targeted function methods", async () => {
    const code = `
      function test() {};
      test.call(this);
      test.apply(this);
    `;
    const { file, needsPolyfill } = createEnv(code);
    file.forEachDescendant((node) => {
      processor(node, needsPolyfill);
    });

    expect(needsPolyfill.size).toBe(0);
  });
});
