import { build, emptyDir } from "https://deno.land/x/dnt@0.40.0/mod.ts";

await emptyDir("./npm");

const version = Deno.args[0];

if (!version) {
  console.error("Version argument is required");
  Deno.exit(1);
}

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  shims: {
    deno: true,
  },
  package: {
    name: "@alis-build/utils",
    version: version,
    description: "A collection of common utilities used at Alis Exchange.",
    license: "APACHE-2.0",
    repository: {
      type: "git",
      url: "git+https://github.com/alis-exchange/ts-alis-build.git",
    },
    bugs: {
      url: "https://github.com/alis-exchange/ts-alis-build/issues",
    },
    dependencies: {
      "@alis-build/google-common-protos": "latest",
    },
    peerDependencies: {
      "google-protobuf": "latest",
    },
  },
  postBuild() {
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    Deno.copyFileSync("README.md", "npm/README.md");
    Deno.copyFileSync("CHANGELOG.md", "npm/CHANGELOG.md");
  },
});
