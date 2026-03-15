export type ProjectItem = {
  title: string;
  description: string;
  link: string;
  ctaLabel: string;
  secondaryLabel?: string;
  secondaryLink?: string;
  hidePrimaryCta?: boolean;
  tags?: string[];
  status?: "Live" | "In Progress" | "Coming Soon";
};

export const PROJECTS = [
  {
    title: "Calculator App",
    description:
      "Built as a focused learning exercise to strengthen JavaScript fundamentals. The focus was on state management, event handling, conditional logic, and edge-case handling like chained operations and invalid input.",
    link: "/calculator",
    ctaLabel: "View App",
    secondaryLabel: "Source Code",
    secondaryLink:
      "https://github.com/victor-trapp/Antunes-Lab/tree/main/portfolio/public/calculator",
    tags: ["JavaScript", "HTML", "CSS"],
    status: "Live" as const,
  },
  {
    title: "Budget App",
    description:
      "A full-stack monthly budget planner with income tracking, expense categories, and debt payoff simulation using the avalanche method. Built with PostgreSQL for persistent data storage.",
    link: "#",
    ctaLabel: "View App",
    hidePrimaryCta: true,
    tags: ["Next.js", "TypeScript", "PostgreSQL", "Prisma"],
    status: "In Progress" as const,
  },
] as const satisfies readonly ProjectItem[];
