import { getServerSession, type DefaultSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "~/server/db";
// 引入标准的 NextAuth 设置项，适配 Prisma 数据库 + 凭证登录（即用用户名登录，无需 GitHub 登录）
import type { User as PrismaUser } from "@prisma/client";


/**
 * Type Augmentation 类型增强：
 * 把 session.user 和 JWT token 中的结构扩展，允许包含 id 和 username 字段。
 * 这样前端就可以安全地访问 session.user.id 和 session.user.username，不报类型错。
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      username: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string | null;
  }
}

/**
 * NextAuth 配置项
 */
export const authOptions: NextAuthOptions = {
  providers: [
    // 使用 CredentialsProvider 实现「用户名登录」
    CredentialsProvider({
      name: "DevLogin",
      credentials: {
        username: { label: "Username", type: "text", default: "devuser" },
      },
      async authorize(credentials) {
        console.log("✅ authorize 正在运行");
        const username = credentials?.username?.trim() ?? "devuser";

        // 改用 username 查询，email 不保证唯一
        let user = await prisma.user.findUnique({
          where: { username }, // ✅ 注意你数据库中必须设置 username 为唯一
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              name: username,
              username,
              email: `${username}@glittering.com`, // email 随便填
            },
          });

          console.log("✅ Created new dev user:", user);
        } else {
          console.log("✅ Found existing user:", user);
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: null,
          username: user.username,
        };
      }
    }),
  ],

  session: {
    strategy: "jwt", // 会话用 JWT 存储，而不是数据库 session
  },

  callbacks: {
    // 每次 JWT 更新时运行（登录、刷新等）
    async jwt({ token, user }) {
      if (user) {
        const typedUser = user as PrismaUser;//明确 user 是 Prisma User 类型
        token.id = typedUser.id;
        token.username = typedUser.username ?? null;
      }
      return token;
    },

    // 每次调用 useSession() 时，会从 token 中恢复 session.user 的字段
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.username = token.username ?? null;
      return session;
    },

    // 登录成功后跳转到首页
    redirect() {
      return "/";
    },
  },

  pages: {
    signIn: "/login", // 登录页使用 /login 页面
  },
};

/**
 * getServerAuthSession 包装器，
 * 让你在 server components 或 API 中方便调用当前用户 session
 */
export const getServerAuthSession = () => {
  return getServerSession(authOptions);
};
