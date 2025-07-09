import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import EditProductForm from "@/components/EditForm";

export default async function EditPage() {

    const session = await auth();

    if(session?.user?.role !== "ADMIN") {
        redirect("/products")
    }

    return <EditProductForm />
}