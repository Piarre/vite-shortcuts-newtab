import { Glob } from "bun";

const files: Record<string, string> = {};
const glob = new Glob("dist/**/*");

for await (const path of glob.scan(".")) {
  const archivePath = path.replaceAll("\\", "/").replace("dist/", "");
  files[archivePath] = await Bun.file(path).text();
  console.log(`Added ${archivePath} to archive.`);
}

const archive = new Bun.Archive(files, { compress: "gzip" });
await Bun.write("build/ext.tar.gz", archive);