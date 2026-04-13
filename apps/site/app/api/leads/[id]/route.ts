import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(req: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const leadId = Number(id);

    if (!leadId) {
      return NextResponse.json(
        { error: "Некорректный id заявки" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const status = String(body.status || "").trim();

    const allowedStatuses = ["new", "in_progress", "closed"];

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Некорректный статус" },
        { status: 400 }
      );
    }

    const updatedLead = await prisma.lead.update({
      where: {
        id: leadId,
      },
      data: {
        status,
      },
      include: {
        object: true,
      },
    });

    return NextResponse.json({
      success: true,
      lead: updatedLead,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Ошибка обновления заявки" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const leadId = Number(id);

    if (!leadId) {
      return NextResponse.json(
        { error: "Некорректный id заявки" },
        { status: 400 }
      );
    }

    await prisma.lead.delete({
      where: {
        id: leadId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Ошибка удаления заявки" },
      { status: 500 }
    );
  }
}