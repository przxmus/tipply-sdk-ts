await Bun.build({
  entrypoints: ["./src/index.ts", "./src/public.ts", "./src/types.ts", "./src/errors.ts"],
  outdir: "./dist",
  target: "browser",
  format: "esm",
  sourcemap: "external",
  minify: false,
});
