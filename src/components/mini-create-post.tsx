"use client";

import { useRouter } from "next/navigation";
import { type Session } from "next-auth";

import { Icons } from "~/components/icons";
// import { Button } from "~/components/ui/button";
import { Button } from "~/components/client-only";
import { Input } from "~/components/ui/input";
import { UserAvatar } from "~/components/user-avatar";

interface MiniCreatePostProps {
  session: Session | null;
  slug: string
}

export function MiniCreatePost({ session, slug }: MiniCreatePostProps) {
  const router = useRouter();
  //const pathname = usePathname();

  const navToCreatePostPage = () => {
    router.push(`/m/${slug}/submit`);
  };


  return (
    <div className="bg overflow-hidden rounded-md bg-secondary shadow">
      <div className="flex h-full justify-between gap-6 px-6 py-4">
        <div className="relative">
          <UserAvatar
            user={{
              name: session?.user.name ?? null,
              image: session?.user.image ?? null,
            }}
          />

          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 outline outline-2 outline-secondary" />
        </div>

        <Input
          onClick={navToCreatePostPage}
          readOnly
          placeholder="Create post..."
        />

        <Button onClick={navToCreatePostPage} variant="ghost">
          <Icons.media />
        </Button>
        <Button onClick={navToCreatePostPage} variant="ghost">
          <Icons.link />
        </Button>
      </div>
    </div>
  );
}
