import { type NextRequest } from "next/server";
import { z } from "zod";

import { MarbleSubscriptionValidator } from "~/lib/validators/marble";
import { getServerAuthSession } from "~/server/auth";
import { prisma } from "~/server/db";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerAuthSession();

    // Check if user is signed in
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const body = await req.json();
    const { marbleId } = MarbleSubscriptionValidator.parse(body);

    // Check if user is subscribed or not
    const subscriptionExists = await prisma.subscription.findFirst({
      where: {
        marbleId,
        userId: session.user.id,
      },
    });

    if (!subscriptionExists) {
      return new Response(
        "You've not been subscribed to this marble, yet.",
        {
          status: 400,
        },
      );
    }

    // If subscribed, unsubscribe user from marble
    await prisma.subscription.delete({
      where: {
        userId_marbleId: {
          marbleId,
          userId: session.user.id,
        },
      },
    });

    return new Response(marbleId);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }

    return new Response(
      "Could not unsubscribe from marble at this time. Please try again later",
      { status: 500 },
    );
  }
}
