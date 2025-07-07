import { NextResponse } from "next/server";
import { prisma } from "@/utils/connect";
import { z } from "zod";

import { categorySchema } from "@/lib/schemas/categorie";
import { slugify } from "@/lib/utils/slugfy";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao buscar categorias" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = categorySchema.parse(body);

    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug: slugify(data.name), // gera slug automaticamente
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    console.error("[CATEGORY_POST_ERROR]", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Erro de validação", issues: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Erro interno ao criar categoria" },
      { status: 500 }
    );
  }
}
