import { prisma } from "@/utils/connect";

import { NextResponse } from "next/server";

import { productSchema } from "@/lib/schemas/product";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" }, // opcional, se tiver timestamp
    });

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ message: "Erro ao buscar produtos" }, { status: 500 });
  }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const data = productSchema.parse(body);

        const product = await prisma.product.create({
            data
        });

        return NextResponse.json(product, {status: 201})
    }catch(error: any) {
        console.error(error);
    return NextResponse.json(
        {error: error?.message || "Erro ao criar produto"},
        {status: 400}
    )

}}