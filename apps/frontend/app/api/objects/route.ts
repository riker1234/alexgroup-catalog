import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const minPriceParam = searchParams.get("minPrice");
    const maxPriceParam = searchParams.get("maxPrice");
    const minAreaParam = searchParams.get("minArea");
    const maxAreaParam = searchParams.get("maxArea");
    const sortParam = searchParams.get("sort");

    const minPrice = minPriceParam ? Number(minPriceParam) : undefined;
    const maxPrice = maxPriceParam ? Number(maxPriceParam) : undefined;
    const minArea = minAreaParam ? Number(minAreaParam) : undefined;
    const maxArea = maxAreaParam ? Number(maxAreaParam) : undefined;

    let orderBy: any = { createdAt: "desc" };

    if (sortParam === "price_asc") {
      orderBy = { price: "asc" };
    } else if (sortParam === "price_desc") {
      orderBy = { price: "desc" };
    } else if (sortParam === "area_asc") {
      orderBy = { area: "asc" };
    } else if (sortParam === "area_desc") {
      orderBy = { area: "desc" };
    }

    const objects = await prisma.object.findMany({
      where: {
        price: {
          gte: minPrice,
          lte: maxPrice,
        },
        area: {
          gte: minArea,
          lte: maxArea,
        },
      },
      orderBy,
    });

    return NextResponse.json(objects);
  } catch (error) {
    return NextResponse.json(
      { error: "Ошибка получения объектов" },
      { status: 500 }
    );
  }
}