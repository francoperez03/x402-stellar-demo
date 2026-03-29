#!/usr/bin/env node

/**
 * x402-stellar dependency and environment checker
 *
 * Checks that all required @x402 packages are installed and
 * that environment variables are properly configured.
 *
 * Usage: node scripts/check-deps.js
 * Exit codes: 0 = all checks passed, 1 = one or more checks failed
 */

const fs = require("fs");
const path = require("path");

const REQUIRED_PACKAGES = [
  "@x402/express",
  "@x402/stellar",
  "@x402/core",
  "@stellar/stellar-sdk",
];

const REQUIRED_ENV_VARS = [
  {
    name: "SERVER_STELLAR_ADDRESS",
    description: "Stellar public key for receiving payments",
    validate: (val) => /^G[A-Z0-9]{55}$/.test(val),
    hint: "Must be a Stellar public key starting with G (56 characters)",
  },
  {
    name: "FACILITATOR_URL",
    description: "OpenZeppelin facilitator endpoint URL",
    validate: (val) => val.startsWith("https://"),
    hint: "Use https://channels.openzeppelin.com/x402/testnet for testnet",
  },
  {
    name: "FACILITATOR_API_KEY",
    description: "API key for the facilitator service",
    validate: (val) => val.length > 0,
    hint: "Generate at channels.openzeppelin.com/testnet/gen",
  },
  {
    name: "CLIENT_STELLAR_SECRET",
    description: "Stellar secret key for signing payments",
    validate: (val) => /^S[A-Z0-9]{55}$/.test(val),
    hint: "Must be a Stellar secret key starting with S (56 characters)",
  },
];

function checkPackages() {
  const checks = [];
  let packageJson;

  // Find package.json by walking up from cwd
  let dir = process.cwd();
  let packageJsonPath = null;

  while (dir !== path.dirname(dir)) {
    const candidate = path.join(dir, "package.json");
    if (fs.existsSync(candidate)) {
      packageJsonPath = candidate;
      break;
    }
    dir = path.dirname(dir);
  }

  if (!packageJsonPath) {
    checks.push({
      type: "package",
      name: "package.json",
      status: "error",
      message: "No package.json found in current directory or parent directories",
    });
    return checks;
  }

  try {
    packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  } catch (err) {
    checks.push({
      type: "package",
      name: "package.json",
      status: "error",
      message: `Failed to parse package.json: ${err.message}`,
    });
    return checks;
  }

  const allDeps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };

  for (const pkg of REQUIRED_PACKAGES) {
    if (allDeps && allDeps[pkg]) {
      checks.push({
        type: "package",
        name: pkg,
        status: "ok",
        message: `Installed (${allDeps[pkg]})`,
      });
    } else {
      checks.push({
        type: "package",
        name: pkg,
        status: "error",
        message: `Not found in package.json. Run: npm install ${pkg}`,
      });
    }
  }

  return checks;
}

function checkEnvVars() {
  const checks = [];

  // Try to load .env file
  const envPath = path.join(process.cwd(), ".env");
  const envVars = { ...process.env };

  if (fs.existsSync(envPath)) {
    try {
      const envContent = fs.readFileSync(envPath, "utf8");
      const lines = envContent.split("\n");
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eqIndex = trimmed.indexOf("=");
        if (eqIndex === -1) continue;
        const key = trimmed.substring(0, eqIndex).trim();
        let value = trimmed.substring(eqIndex + 1).trim();
        // Remove surrounding quotes
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }
        envVars[key] = value;
      }
    } catch (err) {
      checks.push({
        type: "env",
        name: ".env",
        status: "error",
        message: `Failed to read .env file: ${err.message}`,
      });
    }
  } else {
    checks.push({
      type: "env",
      name: ".env",
      status: "warning",
      message: "No .env file found. Environment variables must be set in the shell.",
    });
  }

  for (const envVar of REQUIRED_ENV_VARS) {
    const value = envVars[envVar.name];
    if (!value) {
      checks.push({
        type: "env",
        name: envVar.name,
        status: "error",
        message: `Not set. ${envVar.description}. ${envVar.hint}`,
      });
    } else if (!envVar.validate(value)) {
      checks.push({
        type: "env",
        name: envVar.name,
        status: "error",
        message: `Invalid format. ${envVar.hint}`,
      });
    } else {
      const masked = value.substring(0, 4) + "..." + value.substring(value.length - 4);
      checks.push({
        type: "env",
        name: envVar.name,
        status: "ok",
        message: `Set (${masked})`,
      });
    }
  }

  return checks;
}

function main() {
  const packageChecks = checkPackages();
  const envChecks = checkEnvVars();
  const allChecks = [...packageChecks, ...envChecks];

  const hasErrors = allChecks.some((c) => c.status === "error");
  const result = {
    status: hasErrors ? "error" : "ok",
    checks: allChecks,
  };

  // Pretty print to stderr for humans
  console.error("\nx402-stellar Dependency Check");
  console.error("=".repeat(40));

  for (const check of allChecks) {
    const icon = check.status === "ok" ? "[OK]" : check.status === "warning" ? "[WARN]" : "[ERR]";
    console.error(`${icon} ${check.name}: ${check.message}`);
  }

  console.error("=".repeat(40));
  console.error(hasErrors ? "Some checks failed.\n" : "All checks passed.\n");

  // JSON to stdout for programmatic use
  console.log(JSON.stringify(result, null, 2));

  process.exit(hasErrors ? 1 : 0);
}

main();
