import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Apple from "next-auth/providers/apple";
import LINE from "next-auth/providers/line";
import Credentials from "next-auth/providers/credentials";

/**
 * Auth.js 設定
 *
 * 4つのログイン方法:
 *   1. Google
 *   2. LINE
 *   3. Apple
 *   4. メール + パスワード
 *
 * 紐づけ: メールアドレスで GAS の注文データを検索。
 * どの方法でログインしても、同じメールなら同じ注文にアクセスできる。
 */

async function findOrderByEmail(email: string) {
  const gasUrl = process.env.GAS_WEBHOOK_URL;
  if (!gasUrl) return null;

  try {
    const res = await fetch(
      `${gasUrl}?action=find_by_email&email=${encodeURIComponent(email)}`
    );
    const data = await res.json();
    if (data.found && data.orders?.length > 0) {
      return data.orders[0]; // 最新の注文
    }
  } catch (err) {
    console.error("GAS find_by_email failed:", err);
  }
  return null;
}

async function verifyPassword(email: string, password: string): Promise<boolean> {
  const gasUrl = process.env.GAS_WEBHOOK_URL;
  if (!gasUrl) return false;

  try {
    const res = await fetch(
      `${gasUrl}?action=verify_password&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
    );
    const data = await res.json();
    return data.valid === true;
  } catch {
    return false;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,

    // LINE / Apple は環境変数が設定されている場合のみ有効化
    // AUTH_LINE_ID, AUTH_LINE_SECRET を設定すれば即座に使える
    ...(process.env.AUTH_LINE_ID ? [LINE({
      clientId: process.env.AUTH_LINE_ID,
      clientSecret: process.env.AUTH_LINE_SECRET,
    })] : []),

    ...(process.env.AUTH_APPLE_ID ? [Apple({
      clientId: process.env.AUTH_APPLE_ID,
      clientSecret: process.env.AUTH_APPLE_SECRET,
    })] : []),

    Credentials({
      id: "credentials",
      name: "メールアドレス",
      credentials: {
        email: { label: "メールアドレス", type: "email" },
        password: { label: "パスワード", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string;
        const password = credentials?.password as string;
        if (!email || !password) return null;

        const valid = await verifyPassword(email, password);
        if (!valid) return null;

        return { id: email, email, name: email.split("@")[0] };
      },
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user, account }) {
      // 初回ログイン時
      if (account && (user?.email || token.email)) {
        const email = user?.email || (token.email as string);
        token.email = email;
        token.name = user?.name || token.name;
        token.picture = user?.image || (token.picture as string | undefined);
        token.provider = account.provider;

        // メールアドレスで注文データを検索
        const order = await findOrderByEmail(email);
        if (order) {
          token.orderId = order.orderId;
          token.companyName = order.companyName;
          token.plan = order.plan;
          token.siteUrl = order.siteUrl;
          token.template = order.template;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
      }
      session.orderId = token.orderId as string | undefined;
      session.companyName = token.companyName as string | undefined;
      session.plan = token.plan as string | undefined;
      session.siteUrl = token.siteUrl as string | undefined;
      session.template = token.template as string | undefined;
      return session;
    },
  },

  pages: {
    signIn: "/member",
  },
});
