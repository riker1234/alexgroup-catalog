import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(request: Request, context: RouteContext) {
  try {
    const { slug } = await context.params;

    const object = await prisma.object.findUnique({
      where: {
        slug,
      },
    });

    if (!object) {
      return NextResponse.json(
        { error: "Объект не найден", slug },
        { status: 404 }
      );
    }

    return NextResponse.json(object);
  } catch (error) {
    return NextResponse.json(
      { error: "Ошибка получения объекта" },
      { status: 500 }
    );
  }
}