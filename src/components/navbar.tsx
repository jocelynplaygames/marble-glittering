import Link from "next/link";

//import { Icons } from "~/components/icons";
import { ModeToggle } from "~/components/mode-toggle";
import { SearchBar } from "~/components/search-bar";
import { buttonVariants } from "~/components/ui/button";
import { UserAccountNav } from "~/components/user-account-nav";
import { getServerAuthSession } from "~/server/auth";
import Image from "next/image";

export async function Navbar() {
  const session = await getServerAuthSession();

  return (
    <div className="fixed inset-x-0 top-0 z-[10] h-fit border-b bg-inherit py-2">
      <div className="container mx-auto flex h-full max-w-7xl items-center justify-between gap-2">
        {/* Logo */}

        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.gif"
            alt="Logo"
            width={48}
            height={48}
            className="h-10 w-10 max-w-[48px] max-h-[48px] rounded-full object-contain"
          />
          <span className="hidden text-3xl font-bold text-pink-400 md:block font-['Dancing_Script']">Marble Glittering</span>
        </Link>



        {/* Search Bar */}
        <SearchBar />

        {/* Actions */}
        <div className="flex justify-between gap-2">
          <ModeToggle />

          {session?.user ? (
            <UserAccountNav user={session.user} />
          ) : (
            <Link href="/login" className={buttonVariants()}>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
