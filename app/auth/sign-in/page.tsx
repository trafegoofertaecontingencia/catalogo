import { GoogleSignIn } from "@/components/google-sign-in";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import SignInForm from "@/components/SignIn";

import { auth } from "@/lib/auth";

export default async function Page() {

  const session = await auth();

  if(session) {
    redirect("/");
  }

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

      <SignInForm  />

      <div className="text-center">
        <Button asChild variant="link">
          <Link href="/sign-up">Não tem uma conta? Cadastre-se</Link>
        </Button>
      </div>
    </div>
  );
}
