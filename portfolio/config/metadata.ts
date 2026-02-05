import type { Metadata } from "next";

export const siteConfig: Metadata = {
  title: " Portfolio | Victor Antunes",
  description: "Welcome.",
  icons: {
    icon: [
      {
        url: "/images/icons/icon1.png",
        type: "image/png",
      },
      {
        url: "/images/icons/icon2.png",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/images/icons/apple.png",
        type: "image/png",
      },
    ],
    shortcut: [
      {
        url: "/images/icons/favicon.ico",
        type: "image/x-icon",
      },
    ],
  },
  keywords: [
    "reactjs",
    "nextjs",
    "vercel",
    "react",
    "portfolio",
    "framer-motion",
    "motion",
    "animation",
    "postcss",
    "prettier",
    "tailwindcss",
    "javascript",
    "typescript",
    "eslint",
    "html",
    "css",
  ] as Array<string>,
  authors: {
    name: "Victor Antunes",
    url: "https://github.com/victor-trapp/antunes-lab",
  },
} as const;
