"use client"

import { sendVerificationEmail } from "@/lib/auth-client";
import {useRouter} from "next/navigation";
import { useState } from "react";

const SendVerificationEmailForm = () => {
    const [hasEmailValue, setHasEmailValue] = useState<boolean>(false);
    const [isPending, setIsPending] = useState<boolean>(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget)
        const email = String(formData.get("email"))

        if(!email) {
            alert(`Please enter your email`);
        }

        await sendVerificationEmail({
            email,
            callbackURL: "/auth/verify",
            fetchOptions: {
                onRequest: () => {
                    setIsPending(true)
                },
                onResponse: () => {
                    setIsPending(false)
                },
                onError: (err) => {
                    alert(err)
                },
                onSuccess: () => {
                    alert("Verification email sent successfully!")
                    router.push("/auth/verify/success")
                }
            }
        })
    }
  return (
    <form className='max-w-sm w-full space-y-4' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-2'>
            <div className="space-y-1 text-start">
            <label htmlFor="email" className="text-caption text-dark-900">
                Email
            </label>
            <input
              id="email"
              onChange={(e) => setHasEmailValue(e.target.value !== "")}
              name="email"
              type="email"
              placeholder="Type your email"
              className={`
                w-full rounded-xl bg-light-ultra-dark  py-3 text-body text-black 
                focus:outline-none focus:ring-1 focus:ring-offset-neutral-400 focus:bg-light
                ${!hasEmailValue ? "bg-[url('/email_placeholder.png')] bg-no-repeat bg-[length:18px_18px] bg-[position:8px_center] px-8": "px-3"}
              `}
              autoComplete="email"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className={`mt-2 w-full rounded-full bg-dark-dark px-6 py-3 text-body-medium text-light-100 hover:ring-1 hover:bg-dark-light cursor-pointer text-text-light ${isPending && "opacity-50 cursor-wait"}`}
        > 
          Resend Verification Email 
        </button>
    </form>
  )
}

export default SendVerificationEmailForm