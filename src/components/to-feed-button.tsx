"use client";

import { usePathname } from "next/navigation";

import { Icons } from "~/components/icons";
import { buttonVariants } from "./ui/button";

// If path is `/m/mycommunity`, return to `/`
// if path is `/m/mycommunity/post/id`, return to /m/mycommunity
const getMarblePath = (pathname: string) => {
  const splitPath = pathname.split("/");

  if (splitPath.length === 3) return "/";
  else if (splitPath.length > 3) return `/${splitPath[1]}/${splitPath[2]}`;
  // Return default path in case pathname does not match expected format
  else return "/";
};

export function ToFeedButton() {
  const pathname = usePathname();
  const marblePath = getMarblePath(pathname);

  return (
    <a href={marblePath} className={buttonVariants({ variant: "ghost" })}>
      <Icons.chevronLeft className="mr-1 h-4 w-4" />
      {marblePath === "/" ? "Home Feed" : "Marble Feed"}
    </a>
  );
}
