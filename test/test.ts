// array
Array.isArray([1, 2, 3]);
let arr: number[] = [1, 2, 3];
arr.map((x) => x * 2);

// function
function add(a: any, b: any) {
  return a + b;
}

let addFive = add.bind(null, 5); // 预设第一个参数为 5
console.log(addFive(10)); // 15（5 + 10）

// json
JSON.parse('{"name": "John", "age": 30, "city": "New York"}');

// math
Math.cbrt(27);

// number
Number.isInteger(42);

// object
const obj = { name: "John", age: 30, city: "New York" };
Object.keys(obj);

// string
const s = "Hello World!";
String.fromCodePoint(123);
"s".padEnd(10, " ");
