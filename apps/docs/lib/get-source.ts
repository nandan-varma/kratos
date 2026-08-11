import fs from "node:fs";
import path from "node:path";

export function getComponentSource(relativePath: string) {
  const filePath = path.join(/*turbopackIgnore: true*/ process.cwd(), relativePath);
  return fs.readFileSync(/*turbopackIgnore: true*/ filePath, "utf-8");
}
