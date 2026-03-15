"use client"

import { Button } from "./ui/button";
import { TrashIcon } from "lucide-react";
import { useState } from "react";
import { admin } from "@/lib/auth-client";

interface DeleteUserButtonProps {
    userId: string;
}

export const DeleteUserButton = ({userId}: DeleteUserButtonProps) => {
    const [isPending, setIsPending] = useState(false);

    async function handleClick() {
        if (!confirm('Are you sure you want to delete this user?')) {
            return;
        }

        setIsPending(true);

        try {
            await admin.removeUser({
                userId,
            });
            
            console.log("User deleted successfully");
            
            window.location.reload();
        } catch (error: unknown) {
            console.error("Failed to delete user:", error);
            alert(error instanceof Error ? error.message : 'Failed to delete user');
        } finally {
            setIsPending(false);
        }
    }

  return (
    <Button 
        size='icon' 
        variant='destructive' 
        aria-label="Delete User" 
        className="size-7 rounded-sm cursor-pointer hover:opacity-70" 
        disabled={isPending} 
        onClick={handleClick}
    >
        <span className="sr-only">Delete User</span>
        <TrashIcon/>   
    </Button>
  )
}

export const PlaceHolderDeleteUserButton = () => {
    return (
    <Button 
        size='icon' 
        variant='destructive' 
        aria-label="Delete User" 
        className="size-7 rounded-sm" 
        disabled
    >
        <span className="sr-only">Delete User</span>
        <TrashIcon/>   
    </Button>
  )
}