import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = String(body.name || "").trim();
    const phone = String(body.phone || "").trim();
    const message = String(body.message || "").trim();
    const objectId = Number(body.objectId);

    if (!name || !phone || !objectId) {
      return NextResponse.json(
        { error: "Не заполнены обязательные поля" },
        { status: 400 }
      );
    }

    const lead = await prisma.lead.create({
      data: {
        name,
        phone,
        message: message || null,
        objectId,
      },
    });

    return NextResponse.json({ success: true, lead });
  } catch (error) {
    return NextResponse.json(
      { error: "Ошибка создания заявки" },
      { status: 500 }
    );
  }
}