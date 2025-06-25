import { GoogleSignIn } from "@/components/google-sign-in";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const Page = async () => {

  const session = await auth();

  if(session) redirect("/")

  return (
    <div className="w-full max-w-sm mx-auto space-y-6 p-8 bg-white rounded-2xl">
      <h1 className="text-2xl font-bold text-center mb-6">Entrar</h1>
      <GoogleSignIn />
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-background px-2 text-muted-foreground">
            Ou continue com o e-mail
          </span>
        </div>
      </div>

      {/* Email/Password Sign In */}
      <form
        className="space-y-4"
        action={async () => {
          "use server";
        }}
      >
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
        <Button className="w-full" type="submit">
          Entrar
        </Button>
      </form>

      <div className="text-center">
        <Button asChild variant="link">
          <Link href="/sign-up">Não tem uma conta? cadastre-se</Link>
        </Button>
      </div>
    </div>
  );
};

export default Page;