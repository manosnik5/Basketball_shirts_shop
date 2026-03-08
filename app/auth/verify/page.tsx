import SendVerificationEmailForm from "@/components/SendVerificationEmailForm";
import { redirect } from "next/navigation";


interface PageProps {
    searchParams: Promise<{error: string}>;
}

const page = async ({searchParams}: PageProps) => {
    const error = (await searchParams).error;
    if (!error) redirect("/")
  return (

    <div className='flex items-center justify-center space-y-4 flex-col h-[70vh]'>
        <h1 className='text-heading-3'>Verify Email</h1>
        <p className='text-destructive'>
            {error === "invalid_token" || error === "token_expired" 
            ? "Your token is invalid or expired. Please request a new one." 
            : error === "email_not_verified" 
            ? "Please verify your email, or request a new verification below" 
            :
            "Oops! Something went wrong. Please try again."}
        </p>
        <SendVerificationEmailForm/>
    </div>

  )
}

export default page