"use client"

import { forgetPassword } from "@/lib/auth-client";
import { validateEmail, sanitizeEmail, sanitizeString } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ForgotPassword = () => {
    const [hasEmailValue, setHasEmailValue] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string>("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        
        const formData = new FormData(e.currentTarget)
        const rawEmail = String(formData.get("email"))

        if(!rawEmail) {
            setError("Please enter your email");
            return;
        }

        const email = sanitizeEmail(rawEmail);

        if(!validateEmail(email)) {
            setError("Please enter a valid email address");
            return;
        }

        if (email.includes('<') || email.includes('>') || email.includes('script')) {
            setError("Email contains invalid characters");
            return;
        }

        await forgetPassword({
            email,
            redirectTo: "/auth/reset-password",
            fetchOptions: {
                onRequest: () => {
                    setIsPending(true)
                },
                onResponse: () => {
                    setIsPending(false)
                },
                onError: (err) => {
                    const sanitizedError = sanitizeString(String(err));
                    setError(sanitizedError);
                },
                onSuccess: () => {
                    router.push("/auth/forgot-password/success")
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
                        onChange={(e) => {
                            setHasEmailValue(e.target.value !== "")
                            
                            if (error) {
                                setError("")
                            }
                        }}
                        name="email"
                        type="email"
                        placeholder="Type your email"
                        className={`
                            w-full rounded-xl bg-light py-3 text-body text-black 
                            focus:outline-none focus:ring-1 focus:ring-offset-neutral-400 focus:bg-light
                            ${!hasEmailValue ? "bg-[url('/email_placeholder.png')] bg-no-repeat bg-[length:18px_18px] bg-[position:8px_center] px-8" : "px-3"}
                            ${error ? "ring-2 ring-red-500" : ""}
                        `}
                        autoComplete="email"
                        maxLength={254}
                        required
                    />
                    {error && (
                        <p className="text-sm text-red-500 mt-1">{error}</p>
                    )}
                </div>
            </div>
            <button
                type="submit"
                disabled={isPending}
                className={`mt-2 w-full rounded-full bg-dark-dark px-6 py-3 text-body-medium text-light-100 hover:ring-1 hover:bg-dark-light cursor-pointer text-text-light ${isPending && "opacity-50 cursor-wait"}`}
            > 
                {isPending ? "Sending..." : "Send Reset Link"}
            </button>
        </form>
    )
}

export default ForgotPassword