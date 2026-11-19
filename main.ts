// main.ts — hand in the X post for the gta6-meme-x-01 bounty.
// Reads POST.json, checks it names a real X post, writes it to /output.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
const INPUT = join(process.cwd(), "POST.json");
const OUT_DIR = "/output";
const OUT_FILE = join(OUT_DIR, "POST.json");

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

// Read POST.json, parse it, and return it once its url checks out.
function loadPost(): { url: string } {
  let text: string;
  try {
    text = readFileSync(INPUT, "utf8");
  } catch {
    fail(`cannot read ${INPUT}`);
  }
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    fail(`${INPUT} is not valid JSON`);
  }
  const url = (data as { url?: unknown } | null)?.url;
  if (typeof url !== "string" || url === "") {
    fail(`${INPUT} needs a non-empty "url" string`);
  }
  if (!url.startsWith("https://")) {
    fail(`"url" must start with "https://"`);
  }
  return data as { url: string };
}
const post = loadPost();
mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT_FILE, JSON.stringify(post, null, 2) + "\n", "utf8");
console.log(`wrote ${OUT_FILE} for ${post.url}`);
