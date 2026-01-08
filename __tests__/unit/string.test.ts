import { processor } from "../../src/string";
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

describe("string static method calls", () => {
  it("should detect fromCodePoint statics method on string literal", async () => {
    const code = "String.fromCodePoint(9731)";
    const { file, needsPolyfill } = createEnv(code);
    file.forEachDescendant((node) => {
      processor(node, needsPolyfill);
    });

    expect(needsPolyfill).toContain("string.fromCodePoint");
  });
});

describe("string literal method calls", () => {
  it("should detect at() method on string literal", async () => {
    const code = '"hello".at(1)';
    const { file, needsPolyfill } = createEnv(code);
    file.forEachDescendant((node) => {
      processor(node, needsPolyfill);
    });

    expect(needsPolyfill).toContain("string.at");
  });

  it("should detect padEnd() method on string literal", async () => {
    const code = `
      "hello".padEnd(10, "-");
    `;
    const { file, needsPolyfill } = createEnv(code);
    file.forEachDescendant((node) => {
      processor(node, needsPolyfill);
    });

    expect(needsPolyfill).toContain("string.padEnd");
  });

  it("should detect multiple methods on string literal", async () => {
    const code = `
      "hello".at(1);
      "hello".padEnd(10);
    `;
    const { file, needsPolyfill } = createEnv(code);
    file.forEachDescendant((node) => {
      processor(node, needsPolyfill);
    });

    expect(needsPolyfill).toContain("string.at");
    expect(needsPolyfill).toContain("string.padEnd");
  });
});

describe("variable string method calls", () => {
  it("should detect at() method on string variable", async () => {
    const code = `
      const str = "hello";
      str.at(1);
    `;
    const { file, needsPolyfill } = createEnv(code);
    file.forEachDescendant((node) => {
      processor(node, needsPolyfill);
    });

    expect(needsPolyfill).toContain("string.at");
  });

  it("should detect padStart() method on string variable", async () => {
    const code = `
      const text = "world";
      text.padStart(10, "-");
    `;
    const { file, needsPolyfill } = createEnv(code);
    file.forEachDescendant((node) => {
      processor(node, needsPolyfill);
    });

    expect(needsPolyfill).toContain("string.padStart");
  });

  it("should detect multiple methods on string variables", async () => {
    const code = `
      const str1 = "hello";
      const str2 = "world"; 
      str1.at(1);
      str2.padEnd(10);
    `;
    const { file, needsPolyfill } = createEnv(code);
    file.forEachDescendant((node) => {
      processor(node, needsPolyfill);
    });

    expect(needsPolyfill).toContain("string.at");
    expect(needsPolyfill).toContain("string.padEnd");
  });
});

describe("mixed usage", () => {
  it("should detect both literal and variable and static method calls", async () => {
    const code = `
      "hello".at(1);
      const str = "world";
      str.padEnd(10);
      String.fromCodePoint(9731);
    `;
    const { file, needsPolyfill } = createEnv(code);
    file.forEachDescendant((node) => {
      processor(node, needsPolyfill);
    });

    expect(needsPolyfill).toContain("string.at");
    expect(needsPolyfill).toContain("string.padEnd");
    expect(needsPolyfill).toContain("string.fromCodePoint");
  });
});

describe("function result", () => {
  it("should detect both literal and variable and static method calls", async () => {
    const code = `
      "function add(a, b){
        return a + b;
      };
      const str = add("world", "!");
      str.padEnd(10);
    `;
    const { file, needsPolyfill } = createEnv(code);
    file.forEachDescendant((node) => {
      processor(node, needsPolyfill);
    });

    expect(needsPolyfill).toContain("string.padEnd");
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
    const { file, needsPolyfill } = createEnv(code);
    file.forEachDescendant((node) => {
      processor(node, needsPolyfill);
    });

    expect(needsPolyfill.size).toBe(0);
  });

  it("should not detect non-targeted string methods", async () => {
    const code = `
      "hello".indexOf("o");
      const str = "world";
      str.length;
    `;
    const { file, needsPolyfill } = createEnv(code);
    file.forEachDescendant((node) => {
      processor(node, needsPolyfill);
    });

    expect(needsPolyfill.size).toBe(0);
  });
});
