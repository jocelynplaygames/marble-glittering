type SiteConfig = {
  name: string;
  url: string;
  description: string;
  creator: string;
  authors: { name: string; url: string }[];
  keywords: string[];
  ogImage?: string;
  links: {
    github: string;
    twitter?: string;
  };
};

export const siteConfig: SiteConfig = {
  name: "Marble Glittering",
  url: "https://marble-glittering.vercel.app",
  description: "A Reddit clone built with Next.js and TypeScript. The website curates happy and inspiring content, dedicated to fueling people with excitement and positive energy.",
  creator: "Jojo",
  authors: [{ name: "Jojo", url: "https://www.jocelynplaygames.com" }],
  keywords: ["reddit", "clone", "nextjs", "typescript"],
  links: {
    github: "https://github.com/jocelynplaygames/marble-glittering",
  },
};
