//用户访问 “创建帖子页面” 时看到的内容（比如 /m/smile/submit）
//从 URL 参数拿到 slug，查数据库是否有这个社区;渲染页面 UI（标题 / 表单 / 按钮）;把参数 marbleId 和 slug 传给发帖组件 PostForm,然后就 把发帖逻辑交给 PostForm 去处理了！
import { Suspense } from "react";//Suspense：用于懒加载子组件（如 <PostForm>） “我包起来的东西是异步的，加载中时你就先显示 fallback”
//你加载 <PostForm /> 这个组件可能会花点时间，比如：EditorJS 动态加载（用 await import(...)）里面用到 useEffect、useRef，这些是“浏览器端行为”，SSR 无法立刻渲染
//所以我们用 <Suspense> 包住它，意思是：🌀 加载中就先显示 <Icons.spinner /> 这个旋转图标✅ 加载完了再显示真正的 <PostForm />
import { notFound } from "next/navigation";//notFound()：如果社区没找到，跳 404 页面
import type { Metadata } from "next";

import { Icons, PostForm } from "~/components";//PostForm：就是你写的发帖组件（标题+正文+提交）
// import { Button } from "~/components/ui/button";
import { Button } from "~/components/client-only";
import { prisma } from "~/server/db";//prisma：连接数据库，查出你要发帖的 社区信息

// interface PageProps {
//   params: { slug: string };
// }

// 🔷 generateMetadata()设置页面标题：动态设置为 "Create Post - m/[slug]"
//让浏览器 tab 显示：🪄 Create Post - m/smile
export async function generateMetadata(props: { params: { slug: string } }): Promise<Metadata> {
  const { params } = props;
  console.log("[generateMetadata] slug:", params.slug);

  return {
    title: `Create Post🪄 - m/${params.slug}`,
  };
}

//🔷 Page() 页面组件本体
export default async function Page(props: { params: { slug: string } }) {
  const { params } = props;//从 URL 参数中拿到 slug,如果访问的是 /m/smile/submit，那么 params.slug === "smile"
  console.log("[Page] Loading page for slug:", params.slug);
  //查数据库，看这个社区是否存在
  let marble = null;
  try {
    marble = await prisma.marble.findFirst({
      where: { name: params.slug },
    });
  } catch (err) {
    console.error("[Page] Prisma query error:", err);
  }
  if (!marble) {
    console.warn("[Page] Marble not found for slug:", params.slug);
    return notFound();
  }
  console.log("[Page] Found marble:", marble);



//🔸 渲染页面内容
  return (
    <div className="flex flex-col items-start gap-6">
      {/* 顶部标题 Create Post in m/{params.slug}*/}
      <div className="border-b border-gray-200 pb-3 dark:border-gray-500">
        <div className="-ml-2 -mt-2 flex flex-wrap items-baseline">
          <h3 className="ml-2 mt-2 text-base font-semibold leading-6 text-gray-900 dark:text-gray-500">
            Create Post
          </h3>
          <p className="ml-2 mt-1 truncate text-base text-gray-500 dark:text-primary">
            in m/{params.slug}
          </p>
        </div>
      </div>

      {/* 🔻 加载发帖表单组件 渲染 <PostForm> 组件,PostForm（你写的发帖逻辑）*/}
      <Suspense
        fallback={
          <Icons.spinner className="h-10 w-10 animate-spin self-center text-zinc-500" />
        }
      >
        <PostForm marbleId={marble.id} slug={params.slug} />
      </Suspense>

      {/* 提交按钮（绑定 form）提交按钮 form="marble-post-form" */}
      <div className="flex w-full justify-end">
        <Button type="submit" className="w-full" form="marble-post-form">
          Post
        </Button>
      </div>
    </div>
  );
}
