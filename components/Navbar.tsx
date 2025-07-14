"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaShoppingCart } from "react-icons/fa";
import { SignOut } from "./sign-out";
import { useSession } from "next-auth/react";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const { state } = useCart();

  const totalQuantity = state.items.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  return (
    <nav className="w-full bg-zinc-100 text-white px-4 py-3 flex items-center justify-between shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)]">
      <Link href="/">
        <img className="w-30" src="/logo.png" alt="" />
      </Link>

      <div className="flex gap-4 items-center relative">
        {status === "loading" ? (
          <div className="flex gap-4 items-center animate-pulse">
            <FaShoppingCart className="text-primary" size={22} />
            <div className="h-8 w-12 bg-primary rounded" />
          </div>
        ) : (
          <>
           {session?.user.role === "ADMIN" && <Link className="text-primary" href="/dashboard">Dasboard</Link>}
            <Link href="/cart" className="relative">
              <FaShoppingCart className="text-primary" size={22} />
              {totalQuantity > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-xs text-white rounded-full h-5 w-5 flex items-center justify-center">
                  {totalQuantity}
                </span>
              )}
            </Link>

            {session ? (
              <>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={session.user.image || ""} alt="Avatar" />
                  <AvatarFallback>?</AvatarFallback>
                </Avatar>
                <SignOut />
              </>
            ) : (
              <Button className="bg-primary text-white" variant="secondary">
                <Link href="/auth/sign-in">Entrar</Link>
              </Button>
            )}
          </>
        )}
      </div>
    </nav>
  );
}
