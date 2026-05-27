/**
 * Deterministic skill detection from file paths.
 *
 * No AI needed — file extensions and directory names
 * are structured data. Parse them, don't prompt them.
 */

type SkillRule = {
  skill: string;
  domain: "frontend" | "backend" | "devops" | "testing" | "data" | "mobile" | "general";
  patterns: (string | RegExp)[];
};

const RULES: SkillRule[] = [
  // Frontend
  {
    skill: "React",
    domain: "frontend",
    patterns: [".tsx", ".jsx", "components/", "hooks/"],
  },
  {
    skill: "Next.js",
    domain: "frontend",
    patterns: ["app/", "pages/", "next.config", "middleware.ts", "middleware.js"],
  },
  {
    skill: "Tailwind CSS",
    domain: "frontend",
    patterns: ["tailwind", ".css", "globals.css", "postcss"],
  },
  {
    skill: "CSS/Styling",
    domain: "frontend",
    patterns: [".css", ".scss", ".sass", ".less", ".styled."],
  },
  {
    skill: "TypeScript",
    domain: "frontend",
    patterns: [".ts", ".tsx", "tsconfig"],
  },
  {
    skill: "JavaScript",
    domain: "frontend",
    patterns: [".js", ".mjs", ".cjs"],
  },
  {
    skill: "HTML",
    domain: "frontend",
    patterns: [".html", ".ejs", ".hbs", ".pug"],
  },
  {
    skill: "Vue",
    domain: "frontend",
    patterns: [".vue", "nuxt.config"],
  },
  {
    skill: "Svelte",
    domain: "frontend",
    patterns: [".svelte", "svelte.config"],
  },

  // Backend
  {
    skill: "Prisma",
    domain: "backend",
    patterns: [".prisma", "prisma/", "schema.prisma"],
  },
  {
    skill: "SQL/Databases",
    domain: "backend",
    patterns: [".sql", "migrations/", "seeds/", "knex", "sequelize"],
  },
  {
    skill: "Node.js",
    domain: "backend",
    patterns: ["server.", "api/", "routes/", "controllers/", "express", "fastify"],
  },
  {
    skill: "Python",
    domain: "backend",
    patterns: [".py", "requirements.txt", "pyproject.toml", "Pipfile"],
  },
  {
    skill: "Go",
    domain: "backend",
    patterns: [".go", "go.mod", "go.sum"],
  },
  {
    skill: "Ruby",
    domain: "backend",
    patterns: [".rb", "Gemfile", "Rakefile", ".erb"],
  },
  {
    skill: "GraphQL",
    domain: "backend",
    patterns: [".graphql", ".gql", "schema.graphql", "resolvers/"],
  },
  {
    skill: "REST APIs",
    domain: "backend",
    patterns: ["api/", "routes/", "endpoints/", "controllers/", /\.route\./],
  },

  // DevOps / Infrastructure
  {
    skill: "Docker",
    domain: "devops",
    patterns: ["Dockerfile", "docker-compose", ".dockerignore"],
  },
  {
    skill: "CI/CD",
    domain: "devops",
    patterns: [".github/workflows/", ".gitlab-ci", "Jenkinsfile", ".circleci/", "bitbucket-pipelines"],
  },
  {
    skill: "Terraform",
    domain: "devops",
    patterns: [".tf", "terraform/"],
  },
  {
    skill: "AWS",
    domain: "devops",
    patterns: ["aws", "lambda", "s3", "cloudformation", ".aws/"],
  },
  {
    skill: "Nginx",
    domain: "devops",
    patterns: ["nginx", ".conf"],
  },

  // Testing
  {
    skill: "Testing",
    domain: "testing",
    patterns: [
      ".test.", ".spec.", "__tests__/", "cypress/", "playwright/",
      "jest.config", "vitest.config", ".e2e.",
    ],
  },
  {
    skill: "Storybook",
    domain: "testing",
    patterns: [".stories.", ".storybook/"],
  },

  // Data / Analytics
  {
    skill: "Analytics SDKs",
    domain: "data",
    patterns: ["analytics", "tracking", "segment", "mixpanel", "gtag", "gtm"],
  },

  // Mobile
  {
    skill: "React Native",
    domain: "mobile",
    patterns: ["react-native", ".native.", "ios/", "android/"],
  },

  // General
  {
    skill: "Markdown/Docs",
    domain: "general",
    patterns: [".md", ".mdx", "docs/", "README"],
  },
  {
    skill: "Package Management",
    domain: "general",
    patterns: ["package.json", "yarn.lock", "pnpm-lock", "package-lock"],
  },
  {
    skill: "Linting/Formatting",
    domain: "general",
    patterns: [".eslint", ".prettier", ".editorconfig", "biome.json"],
  },
];

/**
 * Given a list of file paths from a PR, return detected skills.
 */
export function detectSkills(filePaths: string[]): string[] {
  const detected = new Set<string>();

  for (const filePath of filePaths) {
    const lower = filePath.toLowerCase();
    for (const rule of RULES) {
      for (const pattern of rule.patterns) {
        if (pattern instanceof RegExp) {
          if (pattern.test(lower)) detected.add(rule.skill);
        } else {
          if (lower.includes(pattern.toLowerCase())) detected.add(rule.skill);
        }
      }
    }
  }

  return [...detected].sort();
}

/**
 * Detect skills from PR title and category as a fallback
 * when file paths aren't available.
 */
export function detectSkillsFromMetadata(
  title: string,
  category: string,
  description: string | null,
): string[] {
  const text = `${title} ${description || ""}`.toLowerCase();
  const detected = new Set<string>();

  // Category-based baseline
  if (category === "frontend") {
    detected.add("React");
    detected.add("TypeScript");
  }
  if (category === "backend") {
    detected.add("Node.js");
  }

  // Keyword matching on title/description
  const keywordMap: Record<string, string[]> = {
    "React": ["react", "component", "hook", "jsx", "tsx"],
    "Next.js": ["next.js", "nextjs", "app router", "server component", "ssr"],
    "Tailwind CSS": ["tailwind", "tw-"],
    "Prisma": ["prisma", "migration", "schema"],
    "SQL/Databases": ["database", "sql", "postgres", "sqlite", "mysql", "migration"],
    "Docker": ["docker", "container"],
    "CI/CD": ["ci/cd", "pipeline", "workflow", "deploy", "github actions"],
    "Testing": ["test", "spec", "e2e", "cypress", "playwright", "jest"],
    "GraphQL": ["graphql", "gql", "apollo", "query", "mutation"],
    "REST APIs": ["api", "endpoint", "route", "rest"],
    "Analytics SDKs": ["analytics", "tracking", "gtm", "segment"],
    "CSS/Styling": ["css", "style", "scss", "sass", "animation"],
    "TypeScript": ["typescript", "type", "interface"],
  };

  for (const [skill, keywords] of Object.entries(keywordMap)) {
    if (keywords.some((kw) => text.includes(kw))) {
      detected.add(skill);
    }
  }

  return [...detected].sort();
}

/**
 * Get the domain for a skill.
 */
export function getSkillDomain(skill: string): string {
  const rule = RULES.find((r) => r.skill === skill);
  return rule?.domain ?? "general";
}

/**
 * All known domains and their display colors.
 */
export const DOMAIN_COLORS: Record<string, string> = {
  frontend: "#79c0ff",
  backend: "#d2a8ff",
  devops: "#f0883e",
  testing: "#7ee787",
  data: "#d29922",
  mobile: "#f778ba",
  general: "#7d8590",
};
