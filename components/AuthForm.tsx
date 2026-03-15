"use client"

import { useState } from "react";
import Image from "next/image";
import { SocialProviders } from "./SocialProviders";
import { useRouter } from "next/navigation";
import { HandleAuthAction } from "@/lib/actions/authActions";
import Link from "next/link";
import { 
    validateEmail, 
    validatePasswordStrength, 
    validateName,
    sanitizeEmail, 
    sanitizeString 
} from "@/lib/validation";

type Props = {
    mode: "sign-in" | "sign-up";
}

const AuthForm = ({mode}: Props) => {
    const [isPending, setIsPending] = useState(false);
    const [show, setShow] = useState(false);
    const [hasFullNameValue, setHasFullNameValue] = useState(false);
    const [hasEmailValue, setHasEmailValue] = useState(false);
    const [hasPasswordValue, setHasPasswordValue] = useState(false);
    const [errors, setErrors] = useState<{
        fullname?: string;
        email?: string;
        password?: string;
    }>({});
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors({});
        setIsPending(true);

        const formData = new FormData(e.currentTarget);
        
        const rawFullName = mode === "sign-up" ? String(formData.get("fullname")) : "";
        const rawEmail = String(formData.get("email"));
        const password = String(formData.get("password"));

        if (mode === "sign-up") {
            if (!rawFullName) {
                setErrors(prev => ({ ...prev, fullname: "Please enter your full name" }));
                setIsPending(false);
                return;
            }

            const fullname = sanitizeString(rawFullName);
            
            if (!validateName(fullname)) {
                setErrors(prev => ({ ...prev, fullname: "Please enter a valid name (letters, spaces, hyphens only)" }));
                setIsPending(false);
                return;
            }

            if (fullname.length < 2 || fullname.length > 100) {
                setErrors(prev => ({ ...prev, fullname: "Name must be between 2 and 100 characters" }));
                setIsPending(false);
                return;
            }

            // Update formData with sanitized value
            formData.set("fullname", fullname);
        }

        // Validate Email
        if (!rawEmail) {
            setErrors(prev => ({ ...prev, email: "Please enter your email" }));
            setIsPending(false);
            return;
        }

        const email = sanitizeEmail(rawEmail);

        if (!validateEmail(email)) {
            setErrors(prev => ({ ...prev, email: "Please enter a valid email address" }));
            setIsPending(false);
            return;
        }

        // Additional email security check
        if (email.includes('<') || email.includes('>') || email.includes('script')) {
            setErrors(prev => ({ ...prev, email: "Email contains invalid characters" }));
            setIsPending(false);
            return;
        }

        // Update formData with sanitized email
        formData.set("email", email);

        // Validate Password
        if (!password) {
            setErrors(prev => ({ ...prev, password: "Please enter your password" }));
            setIsPending(false);
            return;
        }

        // For sign-up, enforce strong password requirements
        if (mode === "sign-up") {
            const passwordValidation = validatePasswordStrength(password);
            if (!passwordValidation.isValid) {
                setErrors(prev => ({ ...prev, password: passwordValidation.errors[0] }));
                setIsPending(false);
                return;
            }
        } else {
            // For sign-in, just check minimum length
            if (password.length < 8) {
                setErrors(prev => ({ ...prev, password: "Password must be at least 8 characters" }));
                setIsPending(false);
                return;
            }
        }

        // Additional password security check
        if (password.includes('<') || password.includes('>')) {
            setErrors(prev => ({ ...prev, password: "Password contains invalid characters" }));
            setIsPending(false);
            return;
        }

        // Submit the form with sanitized data
        const result = await HandleAuthAction(formData, mode);

        if (result.success) {
            console.log(`User ${mode === "sign-up" ? "registered" : "signed in"} successfully`);
            if (result.redirect) router.push(result.redirect);
        } else if (result.redirect) {
            router.push(result.redirect);
        } else {
            // Sanitize error message before displaying
            const sanitizedError = sanitizeString(String(result.error));
            setErrors(prev => ({ ...prev, email: sanitizedError }));
        }

        setIsPending(false);
    };

    return (
        <div className="space-y-6 flex justify-center">
            <div className="w-full md:[70vw] max-w-md bg-light-light rounded-lg p-8 shadow-shadow-m text-center">
                <h1 className="text-heading-3 text-dark-900 mb-4">
                    {mode === "sign-in" ? "Welcome Back!" : "Join CourtStyle Today!"}
                </h1>
                <p className="mb-2 text-body text-muted-foreground">
                    {mode === "sign-in"
                        ? "Sign in to continue your journey"
                        : "Create your account to start your fitness journey"}
                </p>

                <SocialProviders variant={mode} setIsPending={setIsPending}/>

                <div className="">
                    <span className="shrink-0 text-caption text-muted-foreground">
                        Or {mode === "sign-in" ? "sign in" : "sign up"} with
                    </span>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    {mode === "sign-up" && (
                        <div className="space-y-1 text-start">
                            <label htmlFor="fullname" className="text-caption text-dark-900">
                                Full Name
                            </label>
                            <input
                                id="fullname"
                                onChange={(e) => {
                                    setHasFullNameValue(e.target.value !== "")
                                    if (errors.fullname) {
                                        setErrors(prev => ({ ...prev, fullname: undefined }))
                                    }
                                }}
                                name="fullname"
                                type="text"
                                placeholder="Type your full name"
                                className={`
                                    w-full rounded-xl bg-light py-3 text-body text-black 
                                    focus:outline-none focus:ring-1 focus:ring-offset-neutral-400 focus:bg-light
                                    ${!hasFullNameValue ? "bg-[url('/fullName_placeholder.png')] bg-no-repeat bg-[length:18px_18px] bg-[position:8px_center] px-8" : "px-3"}
                                    ${errors.fullname ? "ring-2 ring-red-500" : ""}
                                `}
                                maxLength={100}
                                required
                            />
                            {errors.fullname && (
                                <p className="text-sm text-red-500 mt-1">{errors.fullname}</p>
                            )}
                        </div>
                    )}
          
                    <div className="space-y-1 text-start">
                        <label htmlFor="email" className="text-caption text-dark-900">
                            Email
                        </label>
                        <input
                            id="email"
                            onChange={(e) => {
                                setHasEmailValue(e.target.value !== "")
                                if (errors.email) {
                                    setErrors(prev => ({ ...prev, email: undefined }))
                                }
                            }}
                            name="email"
                            type="email"
                            placeholder="Type your email"
                            className={`
                                w-full rounded-xl bg-light py-3 text-body text-black 
                                focus:outline-none focus:ring-1 focus:ring-offset-neutral-400 focus:bg-light
                                ${!hasEmailValue ? "bg-[url('/email_placeholder.png')] bg-no-repeat bg-[length:18px_18px] bg-[position:8px_center] px-8" : "px-3"}
                                ${errors.email ? "ring-2 ring-red-500" : ""}
                            `}
                            autoComplete="email"
                            maxLength={254}
                            required
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                        )}
                    </div>

                    <div className="space-y-1 text-start">
                        <div className="flex justify-between items-center gap-2">
                            <label htmlFor="password" className="text-caption text-dark-900">
                                Password
                            </label>
                            {mode === "sign-in" && (
                                <Link href="/auth/forgot-password" className="text-sm italic text-muted-foreground hover:text-foreground">
                                    Forgot password?
                                </Link>
                            )}
                        </div>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={show ? "text" : "password"}
                                onChange={(e) => {
                                    setHasPasswordValue(e.target.value !== "")
                                    if (errors.password) {
                                        setErrors(prev => ({ ...prev, password: undefined }))
                                    }
                                }}
                                placeholder="Type your password"
                                className={`
                                    w-full rounded-xl bg-light py-3 text-body text-black 
                                    focus:outline-none focus:ring-1 focus:ring-offset-neutral-400 focus:bg-light
                                    ${!hasPasswordValue ? "bg-[url('/password_placeholder.png')] bg-no-repeat bg-[length:18px_18px] bg-[position:8px_center] px-8" : "px-3"}
                                    ${errors.password ? "ring-2 ring-red-500" : ""}
                                `}
                                autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
                                minLength={8}
                                maxLength={128}
                                required
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 px-3 text-caption text-dark-700 cursor-pointer"
                                onClick={() => setShow((v) => !v)}
                                aria-label={show ? "Hide password" : "Show password"}
                            >
                                {show 
                                    ? <Image src="/hidePassword.png" alt="Hide password" width={25} height={25} priority /> 
                                    : <Image src="/showPassword.png" alt="Show password" width={25} height={25} priority />
                                }
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                        )}
                        {mode === "sign-up" && !errors.password && (
                            <p className="text-xs text-dark-700 mt-1">
                                Password must contain at least 8 characters, including uppercase, lowercase, number, and special character
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className={`mt-2 w-full rounded-full bg-dark-dark px-6 py-3 text-body-medium text-light-100 hover:ring-1 hover:bg-dark-light cursor-pointer text-text-light ${isPending && "opacity-50 cursor-wait"}`}
                    >
                        {isPending ? (
                            <div className="flex justify-center items-center gap-2">
                                <div className="loader_circle" />
                            </div> 
                        ) : (
                            (mode === "sign-in") ? "Sign In" : "Sign Up"
                        )}
                    </button>

                    {mode === "sign-up" && (
                        <p className="text-center text-footnote text-dark-700">
                            By signing up, you agree to our{" "}
                            <a href="#" className="underline">
                                Terms of Service
                            </a>{" "}
                            and{" "}
                            <a href="#" className="underline">
                                Privacy Policy
                            </a>
                        </p>
                    )}

                    {mode === "sign-in" && (
                        <p className="text-center text-footnote text-text-dark-muted">
                            New here?
                            <a href="sign-up" className="ml-1 underline text-foreground hover:text-muted-foreground">
                                Create an account
                            </a>
                        </p>
                    )}
                </form>
            </div>
        </div>
    )
}

export default AuthForm