"use server"

import { signUp, signIn } from "@/lib/auth-client";

export async function HandleAuthAction(formData: FormData, mode: "sign-in" | "sign-up") {
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));

  try {
    if (mode === "sign-up") {
      const name = String(formData.get("fullname"));
      const result = await signUp.email({ name, email, password });
      if (result.error) throw new Error(result.error.message);
      return { success: true, redirect: "/auth/sign-in" };
    }

    
    const result = await signIn.email({ email, password });
     if (result.error) {
      const errCode = result.error.code ?? "UNKNOWN";
      const errMsg = result.error.message ?? "Unknown sign-in error";

      if (errCode === "EMAIL_NOT_VERIFIED") {
        
        return { success: false, redirect: "/auth/verify?error=email_not_verified", error: "Email not verified" };
      }

      // Other sign-in errors
      throw new Error(errMsg);
    }

    
    return { success: true, redirect: "/" };
  } catch (e: any) {
    console.error("Auth error:", e);
    return { success: false, error: e.message };
  }
}


export const googleAuth = async () => {
    await signIn.social({
        provider: "google",
        callbackURL: "/",
        errorCallbackURL: "/auth/sign-in",
        fetchOptions: {
           
        }
    })
}