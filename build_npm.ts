import { build, emptyDir } from "https://deno.land/x/dnt@0.37.0/mod.ts";

await emptyDir("./npm");

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  shims: {
    deno: true,
  },
  package: {
    name: "@alis-build/utils",
    version: Deno.args[0],
    description: "A collection of common utilities used at Alis Exchange.",
    license: "APACHE-2.0",
    repository: {
      type: "git",
      url: "git+https://github.com/alis-exchange/ts-alis-build.git",
    },
    bugs: {
      url: "https://github.com/alis-exchange/ts-alis-build/issues",
    },
  },
  postBuild() {
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    Deno.copyFileSync("README.md", "npm/README.md");
  },
});
