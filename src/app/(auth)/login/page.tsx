import Link from "next/link";

import { Icons, SignIn } from "~/components";
// import { buttonVariants } from "~/components/ui/button";
import { Button } from "~/components/client-only";
import { cn } from "~/lib/utils";

export default function Login() {
  return (
    <div className="absolute inset-0">
      <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center gap-20">
        <Button asChild variant="ghost" className="-mt-20 self-start">
          <Link href="/">
            <Icons.chevronLeft className="mr-2 h-4 w-4" />
            Home
          </Link>
        </Button>

        <SignIn />
      </div>
    </div>
  );
}
