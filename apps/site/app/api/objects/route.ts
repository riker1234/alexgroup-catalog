import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const minPriceParam = searchParams.get("minPrice");
    const maxPriceParam = searchParams.get("maxPrice");
    const minAreaParam = searchParams.get("minArea");
    const maxAreaParam = searchParams.get("maxArea");

    const minBedroomsParam = searchParams.get("minBedrooms");
    const maxBedroomsParam = searchParams.get("maxBedrooms");

    const minRoomsParam = searchParams.get("minRooms");
    const maxRoomsParam = searchParams.get("maxRooms");

    const minFloorsParam = searchParams.get("minFloors");
    const maxFloorsParam = searchParams.get("maxFloors");

    const sortParam = searchParams.get("sort");
    const searchParam = searchParams.get("search");
    const pageParam = searchParams.get("page");
    const pageSizeParam = searchParams.get("pageSize");

    const minPrice = minPriceParam ? Number(minPriceParam) : undefined;
    const maxPrice = maxPriceParam ? Number(maxPriceParam) : undefined;
    const minArea = minAreaParam ? Number(minAreaParam) : undefined;
    const maxArea = maxAreaParam ? Number(maxAreaParam) : undefined;

    const minBedrooms = minBedroomsParam ? Number(minBedroomsParam) : undefined;
    const maxBedrooms = maxBedroomsParam ? Number(maxBedroomsParam) : undefined;

    const minRooms = minRoomsParam ? Number(minRoomsParam) : undefined;
    const maxRooms = maxRoomsParam ? Number(maxRoomsParam) : undefined;

    const minFloors = minFloorsParam ? Number(minFloorsParam) : undefined;
    const maxFloors = maxFloorsParam ? Number(maxFloorsParam) : undefined;

    const search = searchParam?.trim() || undefined;

    const page = pageParam ? Math.max(Number(pageParam), 1) : 1;
    const pageSize = pageSizeParam ? Math.max(Number(pageSizeParam), 1) : 6;

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

    const where = {
      ...(search
        ? {
            title: {
              contains: search,
              mode: "insensitive" as const,
            },
          }
        : {}),
      price: {
        gte: minPrice,
        lte: maxPrice,
      },
      area: {
        gte: minArea,
        lte: maxArea,
      },
      bedrooms: {
        gte: minBedrooms,
        lte: maxBedrooms,
      },
      rooms: {
        gte: minRooms,
        lte: maxRooms,
      },
      floors: {
        gte: minFloors,
        lte: maxFloors,
      },
    };

    const total = await prisma.object.count({ where });

    const objects = await prisma.object.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return NextResponse.json({
      items: objects,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.max(Math.ceil(total / pageSize), 1),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Ошибка получения объектов" },
      { status: 500 }
    );
  }
}