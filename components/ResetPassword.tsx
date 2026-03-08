"use client"

import { resetPassword } from "@/lib/auth-client";
import { validatePasswordStrength, sanitizeString } from "@/lib/validation";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react"

interface ResetPasswordFormProps {
    token: string
}

const ResetPassword = ({token}: ResetPasswordFormProps) => {
    const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [hasNewPasswordValue, setHasNewPasswordValue] = useState<boolean>(false);
    const [hasConfirmPasswordValue, setHasConfirmPasswordValue] = useState<boolean>(false);
    const [isPending, setIsPending] = useState<boolean>(false);
    const [errors, setErrors] = useState<{password?: string; confirmPassword?: string}>({});
    const router = useRouter();
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors({});
        
        const formData = new FormData(e.currentTarget)
        // Get raw password (passwords don't need HTML sanitization)
        const password = String(formData.get("password"))
        const confirmPassword = String(formData.get("ConfirmPassword"))
        
        // Validate password is not empty
        if(!password) {
            setErrors({ password: "Please enter your password" });
            return;
        }
        
        // Validate password strength
        const passwordValidation = validatePasswordStrength(password);
        if (!passwordValidation.isValid) {
            setErrors({ password: passwordValidation.errors[0] });
            return;
        }
        
        // Validate passwords match
        if(password !== confirmPassword) {
            setErrors({ confirmPassword: "Passwords do not match" });
            return;
        }
        
        // Additional security: Check for suspicious patterns
        if (password.includes('<') || password.includes('>')) {
            setErrors({ password: "Password contains invalid characters" });
            return;
        }
  
        await resetPassword({
            newPassword: password,
            token,
            fetchOptions: {
                onRequest: () => {
                    setIsPending(true)
                },
                onResponse: () => {
                    setIsPending(false)
                },
                onError: (err) => {
                    // Sanitize error message before displaying
                    const sanitizedError = sanitizeString(String(err));
                    alert(sanitizedError)
                },
                onSuccess: () => {
                    if (window.opener && !window.opener.closed) {
                        window.opener.postMessage(
                            { type: 'PASSWORD_RESET_SUCCESS' }, 
                            window.location.origin
                        );
                    }
                    
                    localStorage.setItem('PASSWORD_RESET_SUCCESS', 'true');
                    router.push("/auth/sign-in")
                }
            }
        })
    }

    return (
        <form className='max-w-sm w-full space-y-4' onSubmit={handleSubmit}>
            {/* ... rest of the form ... */}
            <div className="space-y-1 text-start">
                <div className="flex justify-between items-center gap-2">
                    <label htmlFor="password" className="text-caption text-dark-900">
                        New Password
                    </label>
                </div>
                <div className="relative">
                    <input
                        id="password"
                        name="password"
                        type={showNewPassword ? "text" : "password"}
                        onChange={(e) => {
                            setHasNewPasswordValue(e.target.value !== "")
                            if (errors.password) {
                                setErrors(prev => ({ ...prev, password: undefined }))
                            }
                        }}
                        placeholder="Type your new password"
                        className={`
                            w-full rounded-xl bg-light py-3 text-body text-black 
                            focus:outline-none focus:ring-1 focus:ring-offset-neutral-400 focus:bg-light
                            ${!hasNewPasswordValue ? "bg-[url('/password_placeholder.png')] bg-no-repeat bg-[length:18px_18px] bg-[position:8px_center] px-8" : "px-3"}
                            ${errors.password ? "ring-2 ring-red-500" : ""}
                        `}
                        minLength={8}
                        maxLength={128}
                        required
                        autoComplete="new-password"
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 px-3 text-caption text-dark-700 cursor-pointer"
                        onClick={() => setShowNewPassword((v) => !v)}
                        aria-label={showNewPassword ? "Hide password" : "Show password"}
                    >
                        {showNewPassword 
                            ? <Image src="/hidePassword.png" alt="Hide password" width={25} height={25} priority /> 
                            : <Image src="/showPassword.png" alt="Show password" width={25} height={25} priority />
                        }
                    </button>
                </div>
                {errors.password && (
                    <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                )}
                <p className="text-xs text-dark-700 mt-1">
                    Password must contain at least 8 characters, including uppercase, lowercase, number, and special character
                </p>
            </div>

            <div className="space-y-1 text-start">
                <div className="flex justify-between items-center gap-2">
                    <label htmlFor="ConfirmPassword" className="text-caption text-dark-900">
                        Confirm Password
                    </label>
                </div>
                <div className="relative">
                    <input
                        id="ConfirmPassword"
                        name="ConfirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        onChange={(e) => {
                            setHasConfirmPasswordValue(e.target.value !== "")
                            if (errors.confirmPassword) {
                                setErrors(prev => ({ ...prev, confirmPassword: undefined }))
                            }
                        }}
                        placeholder="Confirm your new password"
                        className={`
                            w-full rounded-xl bg-light py-3 text-body text-black 
                            focus:outline-none focus:ring-1 focus:ring-offset-neutral-400 focus:bg-light
                            ${!hasConfirmPasswordValue ? "bg-[url('/password_placeholder.png')] bg-no-repeat bg-[length:18px_18px] bg-[position:8px_center] px-8" : "px-3"}
                            ${errors.confirmPassword ? "ring-2 ring-red-500" : ""}
                        `}
                        minLength={8}
                        maxLength={128}
                        required
                        autoComplete="new-password"
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 px-3 text-caption text-dark-700 cursor-pointer"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                        {showConfirmPassword 
                            ? <Image src="/hidePassword.png" alt="Hide password" width={25} height={25} priority /> 
                            : <Image src="/showPassword.png" alt="Show password" width={25} height={25} priority />
                        }
                    </button>
                </div>
                {errors.confirmPassword && (
                    <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={isPending}
                className={`mt-2 w-full rounded-full bg-dark-dark px-6 py-3 text-body-medium text-light-100 hover:ring-1 hover:bg-dark-light cursor-pointer text-text-light ${isPending && "opacity-50 cursor-wait"}`}
            > 
                Reset Password
            </button>
        </form>
    )
}

export default ResetPassword