"use client";

import { useState } from "react";

import { Button } from "./ui/button";
import { Input } from "./ui/input";

import { signIn } from "next-auth/react"; // Import direto do next-auth/react

import { useRouter } from "next/navigation";

export default function SignInForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false, // impede redirect automático
    });

    console.log("RES", res);

    if (!res?.error) {
      router.push("/"); // redireciona manualmente
    } else {
      setError("Credenciais inválidas.");
    }

    setLoading(false);
  }

  return (
    <form className="space-y-4" onSubmit={handleLogin}>
      <Input
        name="email"
        placeholder="Email"
        type="email"
        required
        autoComplete="email"
      />
      <Input
        name="password"
        placeholder="Password"
        type="password"
        required
        autoComplete="current-password"
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button className="w-full" type="submit" disabled={loading}>
        {loading ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}
