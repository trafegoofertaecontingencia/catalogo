import { NextResponse } from "next/server";
import { prisma } from "@/utils/connect";
const bcrypt = require("bcrypt")

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("BODY", body)

    const {
      companyName,
      representativeName,
      email,
      password,
      cnpj,
      address,
      contact,
      storeImageUrl,
    } = body;

    // Verifica se o e-mail já está cadastrado
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new NextResponse("E-mail já está em uso", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        companyName,
        representativeName,
        email,
        password: hashedPassword,
        cnpj,
        address,
        contact,
        storeImageUrl
      },
    });

    console.log("NEW USER", newUser);

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("[CREATE_USER_ERROR]", error);
    return new NextResponse("Erro ao criar usuário", { status: 500 });
  }
}
