//负责接收发帖请求并把数据写入数据库的接口
//前面：用户点击“发帖”按钮时，前端发送 POST 请求的目标
//本文件：接收发帖请求（来自 axios.post）、校验数据是否合法、校验用户是否登录 + 是否有权限发帖、写入数据库、返回结果给前端
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type NextRequest } from "next/server";//引入 NextRequest 类型：代表请求对象（req），你可以从中读取请求体、请求头、Cookie 等。
import { z } from "zod";// Zod 是一个数据验证库，用来验证前端发来的数据格式是否正确。

import { PostValidator } from "~/lib/validators/post";//PostValidator 是你事先定义好的一套校验规则（Zod 写的）。它会检查 title、content、marbleId 是否为空、类型对不对等。
import { getServerAuthSession } from "~/server/auth";//这是你项目封装的登录状态获取函数，返回当前用户的 session。如果用户没登录，就返回 null。
import { prisma } from "~/server/db";//Prisma 是你用来连接数据库的工具。用它来查用户、查权限、创建帖子等。

import { redis } from "~/lib/redis"; 

//接口api：处理 HTTP 请求（比如 POST 请求），并且返回 HTTP 响应（比如 200 OK、401 Unauthorized 等）——这就叫接口（API）。
//它不是页面，不会渲染 HTML；它是服务器端处理数据逻辑、响应 JSON 或文本的 “程序化接口”。
export async function POST(req: NextRequest) {//Next.js 的 API Route 接口写法。表示：当客户端向 /api/marble/post/create 发出 POST 请求时,就会执行这个函数
  try {
    const body = await req.json();//把前端 axios.post(..., payload) 发来的内容payload解析出来，变成一个 JS 对象。
    const { content, marbleId, title } = PostValidator.parse(body);//校验结构

    const session = await getServerAuthSession();//用户是否登录
    // Check if user is signed in
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });//用 new Response() 返回结果
    }

    // Verify that user is subscribed to passed marble id
    const subscription = await prisma.subscription.findFirst({//“从数据库中查找第一个匹配条件的记录”
      where: {
        marbleId,
        userId: session.user.id,
      },
    });
    if (!subscription) {
      return new Response(
        "You need to be a member of this Community to post here",
        { status: 403 },
      );
    }
    // ✅ 創建貼文，並取得 post.id 等資訊
    const post = await prisma.post.create({//把帖子保存到数据库,包括标题、正文、属于哪个社区、作者
      //Prisma 会自动生成 post.id、createdAt 等字段。只要你调用 prisma.post.create(...)，Prisma 就会：把数据插入数据库；自动生成一个 id；返回包含这个 id 的完整对象
      data: {
        authorId: session.user.id,
        content,
        marbleId,
        title,
      },
      include:{author: true}
    });
    //new Response 是 Next.js API Route 使用的 Web 标准 Response 对象。

    await redis.hmset(`post:${post.id}`, {//發帖成功後自動將該貼文寫入 Redis
      id: post.id,
      title: post.title,
      content: JSON.stringify(post.content), // 注意：要序列化
      createdAt: post.createdAt.toISOString(),
      authorUsername: post.author.username,
    });
    return new Response("OK");//➡️ 发帖成功。把这段文本 OK 和状态码 200，返回给前端（浏览器、JS）,前端可以 .json() 或 .text() 拿到返回的内容,也可以用 response.status 判断是不是 200、401、500 等
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }

    return new Response("Could not post to marble. Please try again later", {
      status: 500,
    });
  }
}
