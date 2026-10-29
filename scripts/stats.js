// scripts/stats.js — repo metadata -> stats.json, via the GitHub CLI (`gh`).
// Needs: gh installed, GH_REPO set (the workflow passes github.repository),
// and GH_TOKEN for private repos (the workflow passes GITHUB_TOKEN).
// Exits non-zero with a readable error when anything is missing.
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const repo = process.env.GH_REPO;
if (!repo) {
  console.error("stats.js: GH_REPO is missing. Run e.g.:");
  console.error("  GH_REPO=youruser/trackme node scripts/stats.js");
  process.exit(1);
}

function ghApi(endpoint) {
  try {
    const out = execFileSync("gh", ["api", endpoint], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    return JSON.parse(out);
  } catch (err) {
    if (err.code === "ENOENT") {
      console.error("stats.js: `gh` CLI not found. Install: https://cli.github.com/");
    } else {
      console.error(`stats.js: gh api ${endpoint} failed:`);
      console.error(String(err.stderr || err.message).trim());
      if (!process.env.GH_TOKEN) {
        console.error("Hint: export GH_TOKEN (or run `gh auth login`).");
      }
    }
    process.exit(1);
  }
}

function bar(label, value) {
  const width = Math.min(40, Math.round(Math.log10(value + 1) * 13));
  return `${label.padEnd(10)} ${"#".repeat(Math.max(width, 1)).padEnd(40, ".")} ${value}`;
}

const meta = ghApi(`repos/${repo}`);

const stats = {
  generatedAt: new Date().toISOString(),
  repo,
  stars: meta.stargazers_count,
  forks: meta.forks_count,
  openIssues: meta.open_issues_count,
  watchers: meta.subscribers_count,
  bars: [
    bar("stars", meta.stargazers_count),
    bar("forks", meta.forks_count),
    bar("issues", meta.open_issues_count),
    bar("watchers", meta.subscribers_count),
  ],
};

writeFileSync("stats.json", `${JSON.stringify(stats, null, 2)}\n`);
console.log(`stats.json written for ${repo}`);
console.log(stats.bars.join("\n"));
