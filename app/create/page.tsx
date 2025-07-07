import CreateProductForm from "@/components/CreateProductForm";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function createPage() {

  const session = await auth();

  if(session?.user.role === "USER") {
    redirect("/")
  }

  return <CreateProductForm />
}