"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

// import { Button } from "~/components/ui/button";
import { Button } from "~/components/client-only";
import { useToast } from "~/components/ui/use-toast";
import { cn } from "~/lib/utils";

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>;

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");

  const loginAsDev = async () => {
    setIsLoading(true);

    try {
      await signIn("credentials", {
        username: username || "devuser",
        //redirect: false, // ✅ 增加这句，避免中断流程，便于 debug
        callbackUrl: "/",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "There was an error logging in.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      <input
        type="text"
        name="username"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border rounded px-4 py-2"
      />

      <Button
        className="w-full"
        type="button"
        size="sm"
        disabled={isLoading}
        isLoading={isLoading}
        onClick={loginAsDev}
      >
        {isLoading ? null : "Login as " + (username || "devuser")}
      </Button>
    </div>
  );
}
