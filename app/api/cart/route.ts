import { prisma } from "@/utils/connect";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session?.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const order = await prisma.order.findFirst({
    where: {
      userId: session.user.id,
      status: "DRAFT",
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    return NextResponse.json({ items: [], total: 0 });
  }

  return NextResponse.json({
    items: order.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      price: item.price,
      product: {
        id: item.product.id,
        name: item.product.name,
        imageUrl: item.product.imageUrl,
      },
    })),
    total: order.total,
  });
}

export async function POST(req: Request) {
  const session = await auth();

  if (!session || !session.user.id) {
    return new NextResponse("Não autorizado", { status: 401 });
  }

  const userId = session.user.id;
  const { productId, quantity } = await req.json();

  if (!productId || !quantity || quantity <= 0) {
    return new NextResponse("Dados inválidos", { status: 400 });
  }

  try {
    // Busca ou cria o pedido com status DRAFT
    let order = await prisma.order.findFirst({
      where: {
        userId,
        status: "DRAFT",
      },
    });

    if (!order) {
      order = await prisma.order.create({
        data: {
          userId,
          status: "DRAFT",
          total: 0,
        },
      });
    }

    // Verifica se o item já existe no carrinho
    const existingItem = await prisma.orderItem.findFirst({
      where: {
        orderId: order.id,
        productId,
      },
    });

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return new NextResponse("Produto não encontrado", { status: 404 });
    }

    if (existingItem) {
      // Atualiza quantidade
      await prisma.orderItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
        },
      });
    } else {
      // Cria novo item no pedido
      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId,
          quantity,
          price: Number(product.price),
        },
      });
    }

    // Recalcula total do pedido
    const allItems = await prisma.orderItem.findMany({
      where: { orderId: order.id },
    });

    const total = allItems.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);

    await prisma.order.update({
      where: { id: order.id },
      data: { total },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[CART_POST]", error);
    return new NextResponse("Erro interno no servidor", { status: 500 });
  }
}
