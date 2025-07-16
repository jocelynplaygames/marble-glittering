// 功能：创建新的记忆专辑;权限：仅限登录用户（通过 getServerAuthSession）
// 存入字段：name（专辑名）description（描述，可选）visibility（公开性）

import { NextResponse } from "next/server"
import { getServerAuthSession } from "~/server/auth"
import { prisma } from "~/server/db"

export async function POST(req: Request) {
  try {
    const session = await getServerAuthSession()

    if (!session?.user) {
      return NextResponse.json({ error: "未登录" }, { status: 401 })
    }

    const body = await req.json()
    const { title, desc, visibility } = body

    if (!title || typeof title !== "string") {
      return NextResponse.json({ error: "名称不能为空" }, { status: 400 })
    }

    const newAlbum = await prisma.memoryAlbum.create({
      data: {
        name: title,
        description: desc || null,
        visibility: visibility?.toUpperCase() || "PRIVATE",
        userId: session.user.id,
      },
    })

    return NextResponse.json(newAlbum, { status: 201 })
  } catch (err) {
    console.error("创建专辑出错", err)
    return NextResponse.json({ error: "服务器错误" }, { status: 500 })
  }
}
