const g = globalThis as typeof globalThis & {
  __dirname?: string;
  __filename?: string;
};

if (typeof g.__dirname === "undefined") {
  g.__dirname = "/";
}
if (typeof g.__filename === "undefined") {
  g.__filename = "/index.js";
}

export {};
