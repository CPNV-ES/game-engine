import { defineConfig } from "tsup";
import * as path from "path";
import fs from "fs";

const wgslLoaderPlugin = {
  name: "wgsl-loader",
  setup(build: any) {
    build.onLoad({ filter: /\.wgsl$/ }, (args: any) => {
      const filePath = path.resolve(args.path);
      const content = fs.readFileSync(filePath, "utf-8");
      return {
        contents: `export default ${JSON.stringify(content)};`,
        loader: "js",
      };
    });
  },
};

export default defineConfig({
  entry: ["src/lib.ts"],
  format: ["esm", "cjs"],
  target: "es2020",
  dts: true,
  sourcemap: true,
  clean: true,
  minify: true,
  keepNames: true,
  esbuildPlugins: [wgslLoaderPlugin],
});
