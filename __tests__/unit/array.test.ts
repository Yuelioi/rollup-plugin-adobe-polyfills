import { processor } from "../../src/array";
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

describe("array static method calls", () => {
  it("should detect Array.from static method", async () => {
    const code = "Array.from([1, 2, 3])";
    const { file, needsPolyfill } = createEnv(code);
    file.forEachDescendant((node) => {
      processor(node, needsPolyfill);
    });

    expect(needsPolyfill).toContain("array.from");
  });

  it("should detect Array.of static method", async () => {
    const code = "Array.of(1, 2, 3)";
    const { file, needsPolyfill } = createEnv(code);
    file.forEachDescendant((node) => {
      processor(node, needsPolyfill);
    });

    expect(needsPolyfill).toContain("array.of");
  });
});

describe("array literal method calls", () => {
  it("should detect at() method on array literal", async () => {
    const code = "[1, 2, 3].at(1)";
    const { file, needsPolyfill } = createEnv(code);
    file.forEachDescendant((node) => {
      processor(node, needsPolyfill);
    });

    expect(needsPolyfill).toContain("array.at");
  });

  it("should detect includes() method on array literal", async () => {
    const code = "[1, 2, 3].includes(2)";
    const { file, needsPolyfill } = createEnv(code);
    file.forEachDescendant((node) => {
      processor(node, needsPolyfill);
    });

    expect(needsPolyfill).toContain("array.includes");
  });

  it("should detect multiple methods on array literal", async () => {
    const code = `
      [1, 2, 3].at(1);
      [4, 5, 6].includes(5);
    `;
    const { file, needsPolyfill } = createEnv(code);
    file.forEachDescendant((node) => {
      processor(node, needsPolyfill);
    });

    expect(needsPolyfill).toContain("array.at");
    expect(needsPolyfill).toContain("array.includes");
  });
});

describe("variable array method calls", () => {
  it("should detect at() method on array variable", async () => {
    const code = `
      const arr = [1, 2, 3];
      arr.at(1);
    `;
    const { file, needsPolyfill } = createEnv(code);
    file.forEachDescendant((node) => {
      processor(node, needsPolyfill);
    });

    expect(needsPolyfill).toContain("array.at");
  });

  it("should detect flat() method on array variable", async () => {
    const code = `
      const arr = [1, [2, 3], 4];
      arr.flat();
    `;
    const { file, needsPolyfill } = createEnv(code);
    file.forEachDescendant((node) => {
      processor(node, needsPolyfill);
    });

    expect(needsPolyfill).toContain("array.flat");
  });

  it("should detect multiple methods on array variables", async () => {
    const code = `
      const arr1 = [1, 2, 3];
      const arr2 = [4, [5, 6], 7];
      arr1.at(1);
      arr2.flat();
    `;
    const { file, needsPolyfill } = createEnv(code);
    file.forEachDescendant((node) => {
      processor(node, needsPolyfill);
    });

    expect(needsPolyfill).toContain("array.at");
    expect(needsPolyfill).toContain("array.flat");
  });
});

describe("mixed usage", () => {
  it("should detect both literal and variable and static method calls", async () => {
    const code = `
      [1, 2, 3].at(1);
      const arr = [4, 5, 6];
      arr.includes(5);
      Array.from([7, 8, 9]);
    `;
    const { file, needsPolyfill } = createEnv(code);
    file.forEachDescendant((node) => {
      processor(node, needsPolyfill);
    });

    expect(needsPolyfill).toContain("array.at");
    expect(needsPolyfill).toContain("array.includes");
    expect(needsPolyfill).toContain("array.from");
  });
});

describe("negative cases", () => {
  it("should not detect non-array method calls", async () => {
    const code = `
      const str = "hello";
      str.includes("o");
      const num = 123;
      num.toString();
    `;
    const { file, needsPolyfill } = createEnv(code);
    file.forEachDescendant((node) => {
      processor(node, needsPolyfill);
    });

    expect(needsPolyfill.size).toBe(0);
  });

  it("should not detect non-targeted array methods", async () => {
    const code = `
      [1, 2, 3].length;
      const arr = [4, 5, 6];
      arr.push(7);
    `;
    const { file, needsPolyfill } = createEnv(code);
    file.forEachDescendant((node) => {
      processor(node, needsPolyfill);
    });

    expect(needsPolyfill.size).toBe(0);
  });
});
