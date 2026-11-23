// The Vacuum's Alibi: one line, at most 200 characters.
// A robot vacuum explains, deadpan, why it missed a spot.
import { chmodSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "I skipped that spot on purpose. My sensors classified the dust as a family of four, and I am not authorized to evict tenants mid-lease.";

// Gate the line exactly the way the scorer does: 1-200 characters,
// a single line, not only white space, plain printable text.
const chars = [...LINE];
if (chars.length < 1 || chars.length > 200) {
  throw new Error(`Line must be 1-200 characters, got ${chars.length}`);
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  throw new Error("Line must fit on one line");
}
if (LINE.trim().length === 0) {
  throw new Error("Line must not be only white space");
}
for (const ch of LINE) {
  const code = ch.codePointAt(0) ?? 0;
  if (code < 0x20 && ch !== "\t") {
    throw new Error(`Line contains a control character U+${code.toString(16)}`);
  }
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const outFile = join(outDir, "entry.txt");

mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, LINE + "\n", { encoding: "utf8" });
chmodSync(outFile, 0o644);

// Read the file back and confirm what landed is exactly the line.
const written = readFileSync(outFile, "utf8").replace(/\n$/, "");
if (written !== LINE) {
  throw new Error("Read-back check failed: entry.txt does not match the line");
}
console.log(`Wrote ${chars.length} characters to ${outFile}`);
