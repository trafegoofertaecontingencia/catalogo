import { prisma } from "@/utils/connect";

import { NextResponse, NextRequest } from "next/server";

import { productSchema } from "@/lib/schemas/product";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const search = searchParams.get("search")?.trim() || "";

    // Filtro condicional: só aplica se tiver search
    const where = search
      ? { name: { contains: search, mode: "insensitive" as const } }
      : {};

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: { category: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao buscar produtos" },
      { status: 500 }
    );
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

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    console.log("ID", id)

    if (!id) {
      return NextResponse.json({ message: "ID não fornecido" }, { status: 400 });
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Produto deletado com sucesso" }, { status: 200 });
  } catch (error) {
    console.error("[DELETE_PRODUCT_ERROR]", error);
    return NextResponse.json({ message: "Erro ao deletar produto" }, { status: 500 });
  }
}