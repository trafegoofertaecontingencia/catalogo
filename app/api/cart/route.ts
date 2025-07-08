import { prisma } from "@/utils/connect";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";

export async function GET({params}: { params: { id: string } }) {

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

    return NextResponse.json({
      ...product,
      price: Number(product.price),
    });
  } catch (error) {
    console.error("[PRODUCT_ID_GET]", error);
    return new NextResponse("Erro interno no servidor", { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const userId = session.user.id;
  const { productId, quantity } = await req.json();

  if (!productId || !quantity || quantity <= 0) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  try {
    // Verifica se o usuário já tem um carrinho (pedido com status DRAFT)
    let order = await prisma.order.findFirst({
      where: {
        userId,
        status: "DRAFT",
      },
    });

    // Se não existir, cria um novo carrinho
    if (!order) {
      order = await prisma.order.create({
        data: {
          userId,
          status: "DRAFT",
        },
      });
    }

    // Verifica se o item já está no carrinho
    const existingItem = await prisma.orderItem.findFirst({
      where: {
        orderId: order.id,
        productId,
      },
    });

    if (existingItem) {
      // Atualiza a quantidade
      await prisma.orderItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
        },
      });
    } else {
      // Adiciona um novo item
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
      }

      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId,
          quantity,
          price: Number(product.price),
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[CART_POST_ERROR]", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
