import { prisma } from "@/utils/connect";
import { NextResponse } from "next/server";

// Corrigido aqui: o segundo argumento da função deve ser tipado corretamente para o Next.js 13+
export async function GET(params: any) {

  const { id } = params;

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: { name: true },
        },
      },
    });

    if (!product) {
      return new NextResponse("Produto não encontrado", { status: 404 });
    }

    return NextResponse.json({ ...product, price: Number(product.price) });
  } catch (error) {
    console.error("[PRODUCT_ID_GET]", error);
    return new NextResponse("Erro interno no servidor", { status: 500 });
  }
}
