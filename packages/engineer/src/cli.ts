import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { homedir } from "node:os";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SKILLS_SOURCE = resolve(__dirname, "..", "skills");
const CLAUDE_SKILLS_DIR = join(homedir(), ".claude", "skills");
const SKILL_NAMES = [
  "x402-stellar",
  "stellar-dev",
  "x402-init",
  "x402-add-paywall",
  "x402-debug",
  "x402-explain",
];

function install(): void {
  console.log("Installing x402 engineer skills...\n");

  if (!existsSync(SKILLS_SOURCE)) {
    console.error("Error: Skills directory not found at", SKILLS_SOURCE);
    console.error("This may indicate a corrupted package installation.");
    process.exit(1);
  }

  if (!existsSync(CLAUDE_SKILLS_DIR)) {
    mkdirSync(CLAUDE_SKILLS_DIR, { recursive: true });
  }

  let installed = 0;

  for (const skill of SKILL_NAMES) {
    const src = join(SKILLS_SOURCE, skill);
    const dest = join(CLAUDE_SKILLS_DIR, skill);

    if (!existsSync(src)) {
      console.error(`  Warning: Skill "${skill}" not found in package, skipping.`);
      continue;
    }

    cpSync(src, dest, { recursive: true, force: true });
    installed++;
    console.log(`  Installed: ${skill}`);
  }

  console.log(`\n${installed} x402 engineer skill(s) installed to ~/.claude/skills/`);
  console.log("Commands available: /x402:init, /x402:add-paywall, /x402:debug, /x402:explain\n");
}

function uninstall(): void {
  console.log("Uninstall command will be implemented in Phase 4.\n");
}

function showHelp(): void {
  console.log("Usage: npx @x402/engineer <command>\n");
  console.log("Commands:");
  console.log("  install    Install x402 engineer skills to ~/.claude/skills/");
  console.log("  uninstall  Remove x402 engineer skills");
  console.log("  help       Show this help message\n");
  console.log("Add x402 micropayments to any API endpoint in seconds.");
  console.log("Zero x402 protocol knowledge required.\n");
}

const command = process.argv[2];

switch (command) {
  case "install":
    install();
    break;
  case "uninstall":
    uninstall();
    break;
  case "help":
  case "--help":
  case "-h":
  case undefined:
    showHelp();
    break;
  default:
    console.error(`Unknown command: ${command}\n`);
    showHelp();
    process.exit(1);
}
