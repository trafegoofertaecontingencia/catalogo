"use client";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react"

const SignOut = () => {
  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="flex justify-center">
      <Button className="bg-primary text-white" variant="secondary" onClick={handleSignOut}>
        Sair
      </Button>
    </div>
  );
};

export { SignOut };