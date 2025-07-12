import { type NextRequest } from "next/server";
import { z } from "zod";

import { getServerAuthSession } from "~/server/auth";
import { prisma } from "~/server/db";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);

  const session = await getServerAuthSession();

  let joinedCommunitiesIds: string[] = [];

  if (session) {
    const joinedCommunities = await prisma.subscription.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        marble: true,
      },
    });

    joinedCommunitiesIds = joinedCommunities.map((sub) => sub.marble.id);
  }

  try {
    const { limit, page, marbleName } = z
      .object({
        limit: z.string(),
        page: z.string(),
        marbleName: z.string().nullish().optional(),
      })
      .parse({
        marbleName: url.searchParams.get("marbleName"),
        limit: url.searchParams.get("limit"),
        page: url.searchParams.get("page"),
      });

    let whereClause = {};

    // Check if user is browsing a specific marble, and if not, whether
    // they're logged in (show custom feed) or not (show generic feed)
    if (marbleName) {
      whereClause = {
        marble: {
          name: marbleName,
        },
      };
    } else if (session) {
      whereClause = {
        marble: {
          id: {
            in: joinedCommunitiesIds,
          },
        },
      };
    }

    const posts = await prisma.post.findMany({
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit), // Skip should start from 0 for page 1
      orderBy: {
        createdAt: "desc",
      },
      include: {
        marble: true,
        votes: true,
        author: true,
        comments: true,
      },
      where: whereClause,
    });

    return new Response(JSON.stringify(posts));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }

    return new Response("Could not fetch posts. Please try again later", {
      status: 500,
    });
  }
}
