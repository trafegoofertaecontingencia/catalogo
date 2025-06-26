"use client"; // agora é um client component

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";  

import { FcGoogle } from "react-icons/fc";

const GoogleSignIn = () => {
  const handleLogin = async () => {
    await signIn("google", { callbackUrl: "/" }); 
  };

  return (
    <Button className="w-full" variant="outline" onClick={handleLogin} type="button">
      <FcGoogle className="mr-2 h-5 w-5" />
      Continue com o Google
    </Button>
  );
};

export { GoogleSignIn };
