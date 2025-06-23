"use client";

import { useState } from "react";
import { useSession, signOut, signIn } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { FaShoppingCart } from "react-icons/fa";

export default function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const userImage = session?.user?.image;

  return (
    <nav className="w-full bg-zinc-900 text-white shadow px-4 py-3 flex items-center justify-between">
      {/* Logo / Nome do App */}
      <Link href="/" className="text-xl font-bold">
        Marccini
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-4 items-center">
        <Link href="/produtos">Produtos</Link>
        <Link href="/categorias">Categorias</Link>
        <Link href="/carrinho"><FaShoppingCart /></Link>

        {session ? (
          <>
            <Avatar className="h-8 w-8">
              <AvatarImage src={userImage || ""} alt="Avatar" />
              <AvatarFallback>?</AvatarFallback>
            </Avatar>
            <Button
              variant="ghost"
              className="text-white"
              onClick={() => signOut()}
            >
              Sair
            </Button>
          </>
        ) : (
          <Button variant="secondary" onClick={() => signIn("google")}>
            Entrar
          </Button>
        )}
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost">
              <Menu className="text-white" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-zinc-900 text-white w-64">
            <div className="flex flex-col gap-4 mt-8">
              <Link href="/produtos" onClick={() => setOpen(false)}>
                Produtos
              </Link>
              <Link href="/categorias" onClick={() => setOpen(false)}>
                Categorias
              </Link>
              <Link href="/carrinho" onClick={() => setOpen(false)}>
                Carrinho
              </Link>

              {session && (
                <>
                  <div className="flex items-center gap-2 mt-4">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={userImage || ""} alt="Avatar" />
                      <AvatarFallback>?</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{session.user?.name}</span>
                  </div>
                  <Button variant="outline" onClick={() => signOut()}>
                    Sair
                  </Button>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
