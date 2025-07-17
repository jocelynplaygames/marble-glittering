import { CustomFeed, GeneralFeed, Icons } from "~/components";
// import { buttonVariants } from "~/components/ui/button";
import { Button } from "~/components/client-only";
import { getServerAuthSession } from "~/server/auth";
import { CommunitySidebar } from "~/components/community-sidebar"; // 👈 这是服务端组件
import Link from "next/link";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function Home() {
  const session = await getServerAuthSession();//判断是否登录

  return (
    <div className="mx-auto max-w-7xl px-4 pt-12 sm:container">
      <h1 className="mb-4 text-3xl font-bold md:text-4xl">Your feed</h1>

      <div className="grid grid-cols-1 gap-y-4 md:grid-cols-3 md:gap-x-4">
        {/* Sidebar: 在移动端会排在上方 */}
        <div className="order-first md:order-last">
          <div className="overflow-hidden rounded-lg border border-secondary">
            <div className="bg-secondary px-6 py-4">
              <p className="flex items-center gap-1.5 py-3 font-semibold">
                <Icons.home className="h-4 w-4" />
                Home
              </p>
            </div>

            <div className="-my-3 divide-y divide-secondary px-6 py-4 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
              <p className="py-3">
                Your personal marble-glittering frontpage. Check in with your favourite communities.
              </p>

              <div className="py-3">
                <CommunitySidebar /> {/* 👈 服务端渲染的 Sidebar */}
              </div>

              <div className="py-3">
                  {/*跳转到创建社区页面*/}
                <Button asChild variant="secondary" className="mb-4 mt-2 w-full">
                  <Link href="/m/create">Create Marble Community</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Feed 主体内容 */}{/*展示对应 Feed*/}
        <div className="col-span-2">
          {session ? <CustomFeed /> : <GeneralFeed />}
        </div>
      </div>
    </div>
  );
}
