"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { FaShoppingCart } from "react-icons/fa";
import { SignOut } from "./sign-out";

import { useSession } from "next-auth/react";

export default function Navbar() {

  const {data: session} = useSession();

  console.log(session?.user?.image)

  const [open, setOpen] = useState(false);


  return (
    <nav className="w-full bg-zinc-900 text-white shadow px-4 py-3 flex items-center justify-between">
      {/* Logo / Nome do App */}
      <Link href="/" className="text-xl font-bold">
        Marccini
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-4 items-center">
        <Link href="/products">Produtos</Link>
        <Link href="/categories">Categorias</Link>
        <Link href="/cart"><FaShoppingCart /></Link>

        {session ? (
          <>
            <Avatar className="h-8 w-8">
              <AvatarImage src={session?.user?.image || ""} alt="Avatar" />
              <AvatarFallback>?</AvatarFallback>
            </Avatar>
            <SignOut />
          </>
        ) : (
          <Button variant="secondary">
            <Link href="/auth/sign-in">Entrar</Link>
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
            <div className="flex flex-col items-center gap-4 mt-8">
              <Link href="/produtos" onClick={() => setOpen(false)}>
                Produtos
              </Link>
              <Link href="/categorias" onClick={() => setOpen(false)}>
                Categorias
              </Link>
               {!session && <Link href="/carrinho"><FaShoppingCart /></Link>}

              {session && (
                <>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session?.user?.image || ""} alt="Avatar" />
                      <AvatarFallback>?</AvatarFallback>
                    </Avatar>
                    <SignOut />
                  </div>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
