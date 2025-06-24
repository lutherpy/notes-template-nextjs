import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/drizzle"; // your drizzle instance
import { user, account, session, verification } from "@/db/schema";
import { bearer } from "better-auth/plugins";

export const auth = betterAuth({
  socialProviders: {
    microsoft: {
      clientId: process.env.MICROSOFT_CLIENT_ID as string,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET as string,
      scope: [
        "openid",
        "profile",
        "email",
        "offline_access",
        "User.Read",
        "User.ReadBasic.All",
      ],
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user, account, session, verification }, // or "mysql", "sqlite"
  }),

  admin: {
    defaultRole: "regular",
  },
  plugins: [bearer()],
});
