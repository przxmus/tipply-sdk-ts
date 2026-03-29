declare const process: {
  env: Record<string, string | undefined>;
};

declare module "bun:test" {
  export const describe: any;
  export const test: any;
  export const expect: any;
}
