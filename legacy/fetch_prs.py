#!/usr/bin/env python3
"""
Fetch all merged PRs from GitHub for CV purposes.
Features:
- Date range filtering
- Frontend/Backend categorization
- Achievement extraction
- Markdown and JSON output
"""

import subprocess
import json
import sys
import re
import argparse
from datetime import datetime
from collections import defaultdict


# Keywords for categorization
FRONTEND_INDICATORS = [
    "ui", "frontend", "react", "vue", "angular", "css", "scss", "html",
    "component", "button", "modal", "form", "page", "view", "layout",
    "responsive", "animation", "style", "theme", "dark mode"
]

BACKEND_INDICATORS = [
    "api", "backend", "server", "database", "db", "sql", "endpoint",
    "auth", "authentication", "migration", "model", "controller",
    "service", "worker", "queue", "cache", "redis", "postgres"
]

# Achievement keywords for CV highlighting
ACHIEVEMENT_PATTERNS = {
    "feature": r"(?:feat|feature|add|implement|create|build|introduce)[:\s]",
    "fix": r"(?:fix|resolve|solve|patch|repair|correct)[:\s]",
    "improve": r"(?:improve|enhance|optimize|upgrade|boost|speed)[:\s]",
    "refactor": r"(?:refactor|restructure|reorganize|clean)[:\s]",
}


def run_gh_command(args):
    """Run a gh CLI command and return the output."""
    result = subprocess.run(
        ["gh"] + args,
        capture_output=True,
        text=True
    )
    if result.returncode != 0:
        print(f"Error: {result.stderr}", file=sys.stderr)
        sys.exit(1)
    return result.stdout


def fetch_merged_prs(username, start_date=None, end_date=None, skip_urls=None):
    """Fetch all merged PRs authored by the user."""
    print(f"Fetching merged PRs for {username}...", file=sys.stderr)

    # Search for all merged PRs authored by the user
    output = run_gh_command([
        "search", "prs",
        "--author", username,
        "--merged",
        "--limit", "500",
        "--json", "title,repository,url,closedAt,body,number"
    ])

    prs = json.loads(output)

    # Filter by date if specified (backup filter since search query might not work perfectly)
    if start_date or end_date:
        filtered = []
        for pr in prs:
            pr_date = pr.get("closedAt", "")[:10]
            if start_date and pr_date < start_date:
                continue
            if end_date and pr_date > end_date:
                continue
            filtered.append(pr)
        prs = filtered

    # Skip PRs already present in existing data — avoids redundant detail fetches
    # on the boundary day (PRs merged on the same date as the latest stored PR).
    if skip_urls:
        before = len(prs)
        prs = [pr for pr in prs if pr.get("url") not in skip_urls]
        skipped = before - len(prs)
        if skipped:
            print(f"Skipping {skipped} PRs already in existing data.", file=sys.stderr)

    # Fetch additional details for each PR
    print(f"Fetching details for {len(prs)} PRs...", file=sys.stderr)
    for i, pr in enumerate(prs):
        repo = pr["repository"]["nameWithOwner"]
        number = pr["number"]
        try:
            details = run_gh_command([
                "pr", "view", str(number),
                "--repo", repo,
                "--json", "additions,deletions,mergedAt,files"
            ])
            pr.update(json.loads(details))
        except:
            pr["additions"] = 0
            pr["deletions"] = 0
            pr["mergedAt"] = pr["closedAt"]
            pr["files"] = []

        if (i + 1) % 10 == 0:
            print(f"  Processed {i + 1}/{len(prs)}...", file=sys.stderr)

    return prs


def categorize_pr(pr):
    """Categorize PR as frontend, backend, or fullstack."""
    text = (pr.get("title", "") + " " + pr.get("body", "")).lower()
    repo_name = pr["repository"]["nameWithOwner"].lower()

    # Check file extensions
    files = pr.get("files", [])
    file_paths = " ".join([f.get("path", "") for f in files]).lower()

    frontend_score = 0
    backend_score = 0

    # Check repo name
    if any(ind in repo_name for ind in ["ui", "frontend", "web", "app"]):
        frontend_score += 3
    if any(ind in repo_name for ind in ["api", "backend", "server", "core"]):
        backend_score += 3

    # Check file types
    frontend_extensions = [".tsx", ".jsx", ".vue", ".css", ".scss", ".html"]
    backend_extensions = [".py", ".go", ".java", ".rb", ".sql", ".rs"]

    for ext in frontend_extensions:
        if ext in file_paths:
            frontend_score += 2
    for ext in backend_extensions:
        if ext in file_paths:
            backend_score += 2

    # Check keywords in title/body
    for indicator in FRONTEND_INDICATORS:
        if indicator in text:
            frontend_score += 1
    for indicator in BACKEND_INDICATORS:
        if indicator in text:
            backend_score += 1

    if frontend_score > backend_score + 2:
        return "frontend"
    elif backend_score > frontend_score + 2:
        return "backend"
    elif frontend_score > 0 and backend_score > 0:
        return "fullstack"
    elif frontend_score > 0:
        return "frontend"
    elif backend_score > 0:
        return "backend"
    else:
        return "other"


def extract_achievement_type(pr):
    """Extract the type of achievement from PR title."""
    title = pr.get("title", "").lower()

    for achievement_type, pattern in ACHIEVEMENT_PATTERNS.items():
        if re.search(pattern, title, re.IGNORECASE):
            return achievement_type

    return "other"


def summarize_for_cv(description):
    """Extract a CV-friendly summary from PR description."""
    if not description:
        return None

    # Try to extract summary section
    summary_match = re.search(r"##\s*Summary\s*\n(.*?)(?=\n##|\Z)", description, re.DOTALL | re.IGNORECASE)
    if summary_match:
        summary = summary_match.group(1).strip()
        # Clean up markdown bullets
        lines = [re.sub(r"^[\-\*]\s*", "", line.strip()) for line in summary.split("\n") if line.strip()]
        return " ".join(lines)[:300]

    # Otherwise take first paragraph
    lines = [l.strip() for l in description.split("\n") if l.strip() and not l.startswith("#")]
    if lines:
        return " ".join(lines[:3])[:300]

    return None


def format_for_cv(prs):
    """Format PRs for CV use with categorization."""
    by_category = defaultdict(lambda: defaultdict(list))
    achievements = defaultdict(list)

    for pr in prs:
        repo_name = pr["repository"]["nameWithOwner"]
        category = categorize_pr(pr)
        achievement_type = extract_achievement_type(pr)

        pr_data = {
            "title": pr["title"],
            "number": pr["number"],
            "url": pr["url"],
            "merged_at": pr.get("mergedAt", pr.get("closedAt")),
            "lines_added": pr.get("additions", 0),
            "lines_deleted": pr.get("deletions", 0),
            "description": pr.get("body", ""),
            "summary": summarize_for_cv(pr.get("body", "")),
            "category": category,
            "achievement_type": achievement_type,
            "repository": repo_name
        }

        by_category[category][repo_name].append(pr_data)
        achievements[achievement_type].append(pr_data)

    # Sort PRs within each category/repo by date
    for category in by_category:
        for repo in by_category[category]:
            by_category[category][repo].sort(key=lambda x: x["merged_at"] or "", reverse=True)

    output = {
        "generated_at": datetime.now().isoformat(),
        "total_prs": len(prs),
        "by_category": dict(by_category),
        "achievement_summary": {
            atype: len(prs_list) for atype, prs_list in achievements.items()
        },
        "category_summary": {
            cat: sum(len(repos) for repos in repos_dict.values())
            for cat, repos_dict in by_category.items()
        }
    }

    return output


def generate_markdown(data):
    """Generate a CV-friendly markdown summary."""
    md = []
    md.append("# GitHub Contributions Summary\n")
    md.append(f"*Generated: {data['generated_at'][:10]}*\n")
    md.append(f"**Total Merged PRs: {data['total_prs']}**\n")

    # Achievement summary
    md.append("## Achievement Overview\n")
    md.append("| Type | Count |")
    md.append("|------|-------|")
    for atype, count in sorted(data["achievement_summary"].items(), key=lambda x: -x[1]):
        md.append(f"| {atype.title()} | {count} |")
    md.append("")

    # Category summary
    md.append("## Category Breakdown\n")
    md.append("| Category | PRs |")
    md.append("|----------|-----|")
    for cat, count in sorted(data["category_summary"].items(), key=lambda x: -x[1]):
        md.append(f"| {cat.title()} | {count} |")
    md.append("")

    # Detailed breakdown by category
    for category in ["frontend", "backend", "fullstack", "other"]:
        if category not in data["by_category"]:
            continue

        repos = data["by_category"][category]
        total = sum(len(prs) for prs in repos.values())

        md.append(f"## {category.title()} ({total} PRs)\n")

        for repo_name, prs in sorted(repos.items(), key=lambda x: -len(x[1])):
            md.append(f"### {repo_name}\n")

            for pr in prs[:10]:  # Limit to top 10 per repo for readability
                date = pr["merged_at"][:10] if pr["merged_at"] else "N/A"
                lines = f"+{pr['lines_added']}/-{pr['lines_deleted']}"

                md.append(f"- **[{pr['title']}]({pr['url']})** ({date}, {lines})")

                if pr["summary"]:
                    # Indent summary
                    md.append(f"  - {pr['summary']}")
                md.append("")

            if len(prs) > 10:
                md.append(f"  *... and {len(prs) - 10} more PRs*\n")

    # CV-ready highlights
    md.append("---\n")
    md.append("## CV-Ready Highlights\n")
    md.append("*Copy these bullet points to your CV:*\n")

    # Generate highlight bullets
    for category in ["frontend", "backend", "fullstack"]:
        if category not in data["by_category"]:
            continue

        repos = data["by_category"][category]
        total_prs = sum(len(prs) for prs in repos.values())
        total_added = sum(pr["lines_added"] for prs in repos.values() for pr in prs)

        if total_prs > 0:
            md.append(f"- **{category.title()} Development**: Contributed {total_prs} merged PRs "
                     f"(+{total_added:,} lines) across {len(repos)} repositories")

    return "\n".join(md)


def load_existing_data(filename):
    """Load existing prs.json. Returns (data, latest_merged_date, existing_urls)."""
    try:
        with open(filename) as f:
            data = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return None, None, set()

    latest = None
    urls = set()
    for repos in data.get("by_category", {}).values():
        for prs in repos.values():
            for pr in prs:
                if pr.get("url"):
                    urls.add(pr["url"])
                merged = pr.get("merged_at")
                if merged and (latest is None or merged > latest):
                    latest = merged

    latest_date = latest[:10] if latest else None
    return data, latest_date, urls


def merge_formatted(existing, new_formatted):
    """Merge newly formatted PR data into the existing structure and recompute summaries."""
    by_category = existing.get("by_category", {})

    for category, repos in new_formatted["by_category"].items():
        by_category.setdefault(category, {})
        for repo, prs in repos.items():
            bucket = by_category[category].setdefault(repo, [])
            bucket.extend(prs)
            bucket.sort(key=lambda x: x.get("merged_at") or "", reverse=True)

    achievement_summary = defaultdict(int)
    category_summary = defaultdict(int)
    total = 0
    for category, repos in by_category.items():
        for prs in repos.values():
            for pr in prs:
                achievement_summary[pr.get("achievement_type", "other")] += 1
                total += 1
            category_summary[category] += len(prs)

    return {
        "generated_at": datetime.now().isoformat(),
        "total_prs": total,
        "by_category": by_category,
        "achievement_summary": dict(achievement_summary),
        "category_summary": dict(category_summary),
    }


def main():
    parser = argparse.ArgumentParser(description="Fetch GitHub PRs for CV")
    parser.add_argument("--start-date", help="Start date (YYYY-MM-DD). Overrides incremental mode.")
    parser.add_argument("--end-date", help="End date (YYYY-MM-DD)")
    parser.add_argument("--format", choices=["json", "markdown", "both"], default="both",
                       help="Output format")
    parser.add_argument("--output", "-o", default="prs", help="Output filename (without extension)")
    parser.add_argument("--full", action="store_true",
                       help="Force full refetch instead of incremental from existing prs.json")
    args = parser.parse_args()

    # Get current GitHub username
    username = run_gh_command(["api", "user", "--jq", ".login"]).strip()

    # Incremental mode: derive start_date from the latest merged PR in the existing JSON,
    # and skip refetching PRs we already have.
    json_file = f"{args.output}.json"
    existing_data, existing_latest, existing_urls = (None, None, set())
    if not args.full:
        existing_data, existing_latest, existing_urls = load_existing_data(json_file)

    start_date = args.start_date
    skip_urls = set()
    if existing_data:
        if not start_date and existing_latest:
            start_date = existing_latest
            print(f"Incremental mode: fetching PRs merged on/after {start_date} "
                  f"({len(existing_urls)} existing PRs preserved).", file=sys.stderr)
        skip_urls = existing_urls

    # Fetch PRs
    prs = fetch_merged_prs(username, start_date, args.end_date, skip_urls=skip_urls)

    if not prs and not existing_data:
        print("No merged PRs found.", file=sys.stderr)
        sys.exit(0)

    # Format new PRs and merge with existing
    if prs:
        new_formatted = format_for_cv(prs)
        formatted = merge_formatted(existing_data, new_formatted) if existing_data else new_formatted
        print(f"Added {len(prs)} new PRs.", file=sys.stderr)
    else:
        formatted = existing_data
        formatted["generated_at"] = datetime.now().isoformat()
        print("No new PRs since last run.", file=sys.stderr)

    # Output
    if args.format in ["json", "both"]:
        with open(json_file, "w") as f:
            json.dump(formatted, f, indent=2)
        print(f"Saved JSON to {json_file}", file=sys.stderr)

    if args.format in ["markdown", "both"]:
        md_file = f"{args.output}.md"
        md_content = generate_markdown(formatted)
        with open(md_file, "w") as f:
            f.write(md_content)
        print(f"Saved Markdown to {md_file}", file=sys.stderr)

    print(f"\nFound {formatted['total_prs']} merged PRs.", file=sys.stderr)
    print(f"Categories: {dict(formatted['category_summary'])}", file=sys.stderr)
    print(f"Achievements: {dict(formatted['achievement_summary'])}", file=sys.stderr)


if __name__ == "__main__":
    main()
