"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [loading, setLoading] = useState(false);

  async function handleSignInWithMicrosoft() {
    try {
      setLoading(true);
      await authClient.signIn.social({
        provider: "microsoft",
        callbackURL: "/dashboard",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>

        <Button
          variant="outline"
          className="w-full"
          onClick={handleSignInWithMicrosoft}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="mr-2 h-4 w-4"
            >
              <path fill="#F25022" d="M0 0h242.667v242.667H0z" />
              <path fill="#7FBA00" d="M269.333 0H512v242.667H269.333z" />
              <path fill="#00A4EF" d="M0 269.333h242.667V512H0z" />
              <path fill="#FFB900" d="M269.333 269.333H512V512H269.333z" />
            </svg>
          )}
          {loading ? "Logging in..." : "Login with Microsoft"}
        </Button>
      </div>
    </form>
  );
}
