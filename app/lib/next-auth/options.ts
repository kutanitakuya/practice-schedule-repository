import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import prisma from "../prisma";
import CredentialsProvider from "next-auth/providers/credentials";

export const nextAuthOptions:NextAuthOptions = {
    debug: true, // デバッグを有効にして詳細なログを確認
    secret: process.env.NEXTAUTH_SECRET,
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
              email: { label: "Username", type: "text" },
              password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
              let user = null; // `try`ブロックの外で`user`を宣言
              try {
                // メールアドレス存在チェック
                user = await prisma.user.findUnique({
                  where: { email: credentials?.email },
                });
              } catch (error) {
                console.error(error);
                return null; // エラーが発生した場合はnullを返す
              }
              return user;
            },
          }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!, // 環境変数からGoogleのクライアントIDを取得
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!, // 環境変数からGoogleのクライアントシークレットを取得
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
          }),

    ],
    
    callbacks: {
        session: ({session, user}) => {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: user.id,
                },
            };
        }
    },
    
};

export default nextAuthOptions;