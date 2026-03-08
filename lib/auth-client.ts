import { createAuthClient } from "better-auth/react";
import {inferAdditionalFields, adminClient } from "better-auth/client/plugins";
import type { auth } from "@/lib/auth"
import { roles, ac } from "./permissions";


export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    plugins: [
        inferAdditionalFields<typeof auth>(), adminClient({ ac, roles }),
    ],
});

export const { signUp, signOut, signIn, useSession, sendVerificationEmail, forgetPassword, resetPassword, admin} = authClient;
