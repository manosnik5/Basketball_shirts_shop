"use client"

import Image from "next/image";
import { signIn } from "@/lib/auth-client";

type Props = {
  variant?: "sign-in" | "sign-up";
  setIsPending?: (value: boolean) => void;
};

export const SocialProviders = ({variant, setIsPending }: Props) => {
  
  const handleGoogleSignIn = async () => {
    if (setIsPending){
      setIsPending (true);
    }
    

    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/",
        errorCallbackURL: "/auth/sign-in",
      });


      console.log("Redirecting to Google...");
    } catch (error: any) {
      console.error("Google sign-in failed:", error);
      alert("Google sign-in failed: " + error?.message || error);
    } finally {
      if (setIsPending) setIsPending(false);
    }
  };

  return (
    <div className="py-3">
        <button
        type="button"
        className="flex w-full items-center justify-center gap-3 rounded-full  bg-light-100 dark:bg-dark px-4 py-3 text-body-medium text-dark-900 dark:text-text-light-muted dark:hover:bg-dark-light dark:hover:text-text-light  hover:bg-light-ultra-dark hover:outline-none cursor-pointer"
        aria-label={`${variant === "sign-in" ? "Continue" : "Sign up"} with Google`}
        onClick={handleGoogleSignIn}
      >
        <Image src="/google.png" alt="" width={20} height={20} />
        <span>Continue with Google</span>
      </button> 
    </div>
  )
}
