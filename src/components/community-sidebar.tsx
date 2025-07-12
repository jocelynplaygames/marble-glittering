// components/community-sidebar.tsx
import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";
import { prisma } from "~/server/db";

export async function CommunitySidebar() {
  const session = await getServerAuthSession();

  if (!session) return null;

  const communities = await prisma.subscription.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      marble: true,
    },
  });

  return (
    <div className="space-y-3">
      {/* ✅ 收藏夹入口 */}
      <Link
        href="/me/albums"
        className="block text-sm font-medium text-blue-600 hover:underline"
      >
        📁 我的收藏夹
      </Link>

      {/* 原来的社区列表 */}
      {communities.length === 0 ? (
        <p className="text-sm text-gray-500">你还没有加入任何社区</p>
      ) : (
        <ul className="space-y-2">
          {communities.map((sub) => (
            <li key={sub.marbleId}>
              <Link
                href={`/m/${sub.marble.name}`}
                className="text-sm font-medium text-pink-500 hover:underline"
              >
                r/{sub.marble.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
