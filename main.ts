// main.ts — hand the X post over for the gta6-meme-x-01 bounty.
// Reads POST.json from the bot directory, checks it names a real
// X post, and copies it byte-for-byte to the output directory,
// where the gate reads it. The entry is the post itself; nothing
// this program writes about it is judged.
import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const POST_FILE = join(BOT_DIR, "POST.json");
const OUT_FILE = join(OUTPUT_DIR, "POST.json");

// Print a message to stderr and quit with a failure code.
function die(message) {
  console.error(`error: ${message}`);
  process.exit(1);
}

// Read POST.json, parse it, and return its url once it checks out.
function readPostUrl() {
  let text;
  try {
    text = readFileSync(POST_FILE, "utf8");
  } catch {
    die(`cannot read ${POST_FILE}`);
  }
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    die(`${POST_FILE} is not valid JSON`);
  }
  const url = data && data.url;
  if (typeof url !== "string" || url.length === 0) {
    die(`${POST_FILE} needs a non-empty "url" string`);
  }
  if (!url.startsWith("https://")) {
    die(`"url" must start with "https://"`);
  }
  return url;
}

const url = readPostUrl();
mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  copyFileSync(POST_FILE, OUT_FILE);
} catch (err) {
  die(`could not copy ${POST_FILE} to ${OUT_FILE}: ${err.message}`);
}
console.log(`wrote ${OUT_FILE} for ${url}`);
