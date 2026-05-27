# GitHub PR CV Generator

Fetch and visualize all your merged GitHub pull requests for CV/resume purposes.

## Features

- Fetches all merged PRs from your GitHub account
- Categorizes PRs as **Frontend**, **Backend**, **Fullstack**, or **Other**
- Identifies achievement types: **Feature**, **Fix**, **Refactor**
- Extracts PR summaries for quick reference
- Outputs JSON, Markdown, and a web viewer
- Filter by date range, repository, category, and more

## Requirements

- Python 3.6+
- [GitHub CLI](https://cli.github.com/) (`gh`) - authenticated

## Setup

1. Install GitHub CLI:
   ```bash
   brew install gh
   ```

2. Authenticate with GitHub:
   ```bash
   gh auth login
   ```

3. Run the script:
   ```bash
   python3 fetch_prs.py
   ```

## Usage

### Basic Usage

```bash
# Fetch all merged PRs and output both JSON and Markdown
python3 fetch_prs.py
```

### Filter by Date Range

```bash
# PRs from 2026 only
python3 fetch_prs.py --start-date 2026-01-01 --end-date 2026-12-31

# PRs from the last 6 months
python3 fetch_prs.py --start-date 2025-09-01
```

### Output Formats

```bash
# JSON only
python3 fetch_prs.py --format json

# Markdown only
python3 fetch_prs.py --format markdown

# Both (default)
python3 fetch_prs.py --format both
```

### Custom Output Filename

```bash
python3 fetch_prs.py --output my-contributions
# Creates: my-contributions.json and my-contributions.md
```

## Web Viewer

View your PRs in an interactive web interface:

```bash
# Start local server
python3 -m http.server 8080

# Open in browser
open http://localhost:8080
```

### Web Viewer Features

- Search PRs by title or summary
- Filter by category (Frontend/Backend/Fullstack)
- Filter by achievement type (Feature/Fix/Refactor)
- Filter by repository
- Filter by date range
- Click PR titles to open on GitHub

## Output Files

| File | Description |
|------|-------------|
| `prs.json` | Full PR data with categories, summaries, and metadata |
| `prs.md` | CV-ready Markdown summary with highlights |
| `index.html` | Interactive web viewer |

## JSON Structure

```json
{
  "generated_at": "2026-03-07T...",
  "total_prs": 154,
  "by_category": {
    "frontend": { "repo/name": [...] },
    "backend": { "repo/name": [...] },
    "fullstack": { "repo/name": [...] }
  },
  "achievement_summary": {
    "feature": 64,
    "fix": 12,
    "refactor": 9
  },
  "category_summary": {
    "frontend": 55,
    "backend": 11,
    "fullstack": 83
  }
}
```

## CV-Ready Output

The Markdown file includes ready-to-copy bullet points:

```
- Frontend Development: Contributed 55 merged PRs (+140,367 lines) across 5 repositories
- Backend Development: Contributed 11 merged PRs (+2,846 lines) across 2 repositories
- Fullstack Development: Contributed 83 merged PRs (+73,373 lines) across 7 repositories
```

## Categorization Logic

PRs are categorized based on:
- Repository name (e.g., repos with "ui" or "frontend" → Frontend)
- File extensions changed (.tsx, .css → Frontend; .py, .go → Backend)
- Keywords in PR title/description

## License

MIT
