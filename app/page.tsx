import AllProducts from "@/components/AllProducts";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {

  const session = await auth();

  if(!session) redirect("/auth/sign-in");

  return <AllProducts />
}
