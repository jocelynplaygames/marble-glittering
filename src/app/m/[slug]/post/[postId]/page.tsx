// Next.js 13+ 中的服务器组件（PostDetailPage），它展示一篇帖子的详情页，并包括点赞功能和评论区。
//用的是 postId 来获取帖子信息。
///这是一个 动态路由页面文件。表示访问 /m/[slug]/[postId]（例如：/m/smile/abc123）就会自动加载并执行这个组件。
//访问的 URL /r/slug/postId 自动调用组件PostDetailPage,参数通过 params 注入进来。

//👉 前端通过跳转到 /r/[slug]/[postId] 自动打开它
// 1.拿到 postId
// 2.先查 Redis 有没有缓存帖子（redis.hgetall(...)）
// 3.如果没有就查数据库（prisma.post.findFirst(...)）
// 4.渲染投票按钮、帖子标题、内容、评论区

import { Suspense } from "react";//Suspense 是 React 的一个组件，用于异步组件加载时显示备用 UI（fallback），通常与 React.lazy 或服务器组件配合使用。
import { notFound } from "next/navigation";//notFound() 是 Next.js 的 API，用于在找不到数据时返回 404 页面。
import type { Post, User, Vote } from "@prisma/client";//导入数据库模型类型定义（类型信息不会编译成 JS），这些来自 prisma schema

import { CommentSection, Icons, PostVoteServer } from "~/components";//从项目的 components 文件夹中导入：CommentSection: 评论区组件;Icons: 图标集合（包含如 upvote, downvote, spinner 等）;PostVoteServer: 服务器端处理投票功能的组件
import { EditorOutput } from "~/components/editor-output";//import { EditorOutput } from "~/components/editor-output";
import { buttonVariants } from "~/components/ui/button";//buttonVariants 是一个函数，返回不同样式按钮的类名，常用于 Tailwind CSS + class variance 工具。

import { redis } from "~/lib/redis";
//import { formatTimeToNow } from "~/lib/utils";//工具函数，把时间转换为类似“3 hours ago”的格式。
import { prisma } from "~/server/db";
import { type CachedPost } from "~/types/redis";//Redis 缓存中使用的 CachedPost 类型，用于类型安全。从文件 ~/types/redis.ts 中引入类型 CachedPost，只引入类型，不引入实际代码

import { SaveToAlbumButton } from "~/components/memory/SaveToAlbumButton";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

//✅ 页面参数接口定义
//这个文件确实是 slug 和 postId 页面逻辑的起点
//如果用户访问这个 URL：http://localhost:3000/r/nextjs/abc123,Next.js 会解析这段路径为：params = {  slug: "nextjs",  postId: "abc123"}然后自动传入你的组件：PostDetailPage({ params: { slug: "nextjs", postId: "abc123" } })
interface PostDetailPageProps {
  params: {//params 是 Next.js 在渲染页面时传进来的 —— 来自 URL 的动态部分。
    slug: string;
    postId: string;
  };
}

//✅ PostVoteShell：占位组件:在真实投票组件 PostVoteServer 加载前，展示一个简洁占位 UI
function PostVoteShell() {
  return (
    <div className="flex w-20 flex-col items-center pr-6">
      {/* Upvote */}
      <div className={buttonVariants({ variant: "ghost" })}>
        <Icons.upvote className="h-5 w-5 text-zinc-700" />
      </div>
      {/* Votes */}
      <div className="py-2 text-center text-sm font-medium text-zinc-900">
        <Icons.spinner className="h-3 w-3 animate-spin" />
      </div>
      {/* Downvote */}
      <div className={buttonVariants({ variant: "ghost" })}>
        <Icons.downvote className="h-5 w-5 text-zinc-700" />
      </div>
    </div>
  );
}

//✅ 页面主组件定义：异步服务器组件，接收 postId，用来加载帖子详情页。
//这个函数是服务端运行的 React 组件，名字叫 PostDetailPage，会在用户访问 /m/slug/postId 时被调用。
export default async function PostDetailPage({
  params,
}: PostDetailPageProps) {
  // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
  //const cachedPost = (await redis.hgetall(`post:${postId}`)) as CachedPost;//这句尝试从 Redis 读取缓存，但：如果 Redis 没连上或未初始化
  const { slug, postId } = params; 
  //🔄 Redis 缓存读取✅ 数据来源一：Redis 缓存
  let cachedPost: CachedPost | null = null;//声明一个变量，先准备一个“空桶”；cachedPost：尝试从 Redis 获取的缓存数据（结构较轻）
  let post: (Post & { votes: Vote[]; author: User }) | null = null;//post：从数据库获取的完整帖子数据（含 votes 和 author）
  try {//使用 redis.hgetall(...) 读取 Redis 中的键 post:<postId>,；成功时结果赋值给 cachedPost
    //cachedPost = (await redis.hgetall(`post:${postId}`)) as CachedPost;//尝试从 Redis 缓存读取帖子（键是 post:${postId}）
    const raw = await redis.hgetall(`post:${postId}`);
    if (raw && Object.keys(raw).length > 0) {
      cachedPost = raw as CachedPost;
    }
  } catch (e) {
    console.error("❌ Redis fetch failed", e);//如果 Redis 没连上或出错，就打印错误提示 + 抛出的异常内容 e
  }

  //🔄 数据库读取（如果缓存失败）✅ 数据来源二：数据库（通过 Prisma 查询）
  if (!cachedPost) {
    try{

      post = await prisma.post.findFirst({//查询结果返回给 post 变量，如果找不到会返回 null
        where: {
          id: postId,//调用 Prisma ORM 访问数据库：查找 Post 表中 ID 为 postId 的记录
        },
        include: {
          votes: true,
          author: true,
          marble: true,
        },
      });
    } catch(err){
      console.error("DB fetch failed", err);
    }

     // ❗先判断是否找到 post，再验证 slug 是否一致
    if (!post || post.marble?.slug !== slug) {
      return notFound();
    }

    if (post) {//詳情頁查不到快取 → 查 DB → 自動補回快取
      await redis.hmset(`post:${post.id}`, {
        id: post.id,
        title: post.title,
        content: JSON.stringify(post.content),
        createdAt: post.createdAt.toISOString(),
        authorUsername: post.author.username,
      });
    }
  }


  
  if (post && post.marble?.slug !== slug) return notFound();// 第二个保险措施：缓存数据存在但不匹配 URL 也拦掉
  //❌ 如果 Redis 和 DB 都查不到，就返回 404
  if (!post && !cachedPost) return notFound();


  //🔁 getData 函数（传入投票组件）
  const getData = async () => {
    return await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        votes: true,
      },
    });
  };



  //✅ 页面渲染部分（JSX）
  //PostVoteServer 是投票组件，用 Suspense 包裹，加载时显示 PostVoteShell
//在手机上是垂直方向排列（flex-col），在大屏上是左右排列（sm:flex-row）
//fallback 是 Suspense 提供的“占位 UI”。当你用 <Suspense> 包裹一个“正在加载的组件”，就会先显示 fallback 里的内容，直到真实组件加载完成。
//“评论区还没加载完，先显示一个加载中动画 spinner。”
  return (
    <div>
      {/* 页面整体布局：大容器，内层是横向 flex 布局（在大屏下） */}
      <div className="flex h-full flex-col items-center justify-between sm:flex-row sm:items-start">
        {/* ✅ 投票组件区域（左侧） */}
        {/* Suspense：异步加载投票组件，加载时显示 PostVoteShell 占位动画 */}
        <Suspense fallback={<PostVoteShell />}>
          <PostVoteServer
            postId={post?.id ?? cachedPost.id}// 优先用数据库里的 id，如果没有就用 Redis 的。
            getData={post ? getData : undefined}// 获取投票数据的函数,只有当数据库 post 不为 null 时，才传 getData，否则不传它
          />
        </Suspense>

        {/* ✅ 主体内容区域（右侧） */}
        <div className="w-full flex-1 rounded-sm bg-card p-4 sm:w-0">
          {/* 帖子作者 + 发布时间 */}
          <p className="mt-1 max-h-40 truncate text-xs text-muted-foreground">
            <span>
              Posted by u/{post?.author.username ?? cachedPost.authorUsername} •
            </span>{" "}
            {new Date(post?.createdAt ?? cachedPost.createdAt).toLocaleString()}
          </p>
          {/* 帖子标题 */}
          <h1 className="py-2 text-xl font-semibold leading-6 text-primary">
            {post?.title ?? cachedPost.title}
          </h1>

          {/* ✅ 富文本内容区：用 EditorOutput 渲染结构化内容 */}
          <EditorOutput content={post?.content ?? cachedPost.content} />
          {/* 添加“收藏到专辑”按钮 */}
          <div className="mb-4">
            <SaveToAlbumButton postId={post?.id ?? cachedPost.id} />
          </div>
          {/* ✅ 评论区（异步加载） */}
          {/* Suspense：加载时显示一个 spinner */}
          <Suspense
            fallback={
              <Icons.spinner className="h-5 w-5 animate-spin text-zinc-500" />
            }
          >
            <CommentSection postId={post?.id ?? cachedPost.id} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
