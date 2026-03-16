import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { nextCookies } from "better-auth/next-js";
import { sendEmailAction } from "@/lib/actions/send-email.action";
import { admin } from "better-auth/plugins"
import { UserRole } from "./generated/prisma";
import {ac, roles } from "./permissions";


export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    database: prismaAdapter(prisma, {
        provider: "postgresql"
    }),
    emailAndPassword: {    
        enabled: true,
        minPasswordLength: 8,
        requireEmailVerification: true,
        sendResetPassword: async ({user, url}) => {
          await sendEmailAction({
          to: user.email,
          subject: "Reset Your Password",
          meta: {
            description: "Please click the link below to reset your password",
            link: url
          }
        })
        }
    }, 
    emailVerification: {
      sendOnSignUp: true,
      expiresIn: 60 * 60,
      autoSignInAfterVerification: true,
      sendVerificationEmail: async ({user, url}) => {
        const link = new URL(url);
        link.searchParams.set("callbackURL", "/auth/verify")
        await sendEmailAction({
          to: user.email,
          subject: "Verify your email address",
          meta: {
            description: "Please verify your email address to complete registration",
            link: String(link)
          }
        })
      }
    },
     advanced: {
        ipAddress: {
          ipAddressHeaders: ["cf-connecting-ip"], 
      },
    },
    rateLimit: {
      enabled: true,
      window: 60,
      max: 100,
    },
    user: {
      additionalFields: {
        role: {
          type: ["USER", "ADMIN"],
          input: false,
        },
      },
    },
    providers: {
      email: true,
    },
    session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, 
    },
  },
    socialProviders: {
    google: {
      prompt: "select_account", 
      clientId: String(process.env.GOOGLE_CLIENT_ID),
      clientSecret: String(process.env.GOOGLE_CLIENT_SECRET),
    },
  },
    plugins: [
      nextCookies(), 
      admin({
        defaultRole: UserRole.USER,
        adminRoles: UserRole.ADMIN,
        ac,
        roles,
      }),
    ],
    
});
