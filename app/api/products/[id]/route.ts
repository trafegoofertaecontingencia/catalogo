import { prisma } from "@/utils/connect";
import { NextResponse } from "next/server";

type Params = {
  params: {
    id: string;
  };
};

export async function GET(_: Request, { params }: Params) {

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

    return NextResponse.json({...product, price: Number(product.price)});
  } catch (error) {
    console.error("[PRODUCT_ID_GET]", error);
    return new NextResponse("Erro interno no servidor", { status: 500 });
  }
}
