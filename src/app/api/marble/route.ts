import { type NextRequest } from "next/server";
import { z } from "zod";//zod: 数据验证库

import { MarbleValidator } from "~/lib/validators/marble";//你定义的 Marble 表单校验器（限制名字长度等）
import { getServerAuthSession } from "~/server/auth";
import { prisma } from "~/server/db";//Prisma ORM，用于数据库操作
//Next.js API Route，处理前端请求用于 创建新的 Marble（社区）。它对应的 API 地址是：POST /api/marble


export async function POST(req: NextRequest) {//定义了一个 POST 方法
  try {
    const session = await getServerAuthSession();
    console.log("Current session:", session)

    // Check if user is signed in
    if (!session?.user) {//获取当前用户 session,如果没登录，返回 401 错误
      return new Response("Unauthorized", { status: 401 });
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const body = await req.json();//解析前端发送的 JSON 请求体（例如 { name: "reactjs" }）:用 Zod 验证是否符合要求（3~21 个字符）
    console.log("🔥 POST body:", body); // ✅ 调试
    const { name } = MarbleValidator.parse(body);

    // Check if marble already exists
    const marbleExists = await prisma.marble.findFirst({
      where: { name },
    });

    if (marbleExists) {//查询数据库中是否已存在该名字的 marble
      return new Response("Marble already exists", { status: 409 });
    }

    // Else, create marble and associate it with the user
    const marble = await prisma.marble.create({//在 marble 表里新建记录
      data: {
        name,
        creatorId: session.user.id,
      },
    });

    // Subscribe creator to be the marble they create
    await prisma.subscription.create({//在 subscription 表中也创建一条，表示创建者自动订阅该社区
      data: {
        userId: session.user.id,
        marbleId: marble.id,
      },
    });

    return new Response(marble.name);//返回新社区名，前端用这个跳转到 /m/[name]
  } catch (error) {
    console.error("create marble error:", error)//打印错误
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response("Could not create marble. Please try again later.", {
      status: 500,
    });
  }
}
