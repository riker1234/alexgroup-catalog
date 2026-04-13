import Link from "next/link";
import { prisma } from "@/lib/prisma";
import LeadsAdmin from "@/components/leads-admin";

type PageProps = {
  searchParams: Promise<{
    status?: string;
  }>;
};

export default async function LeadsPage({ searchParams }: PageProps) {
  const filters = await searchParams;
  const status = filters.status?.trim() || "";

  const where =
    status && ["new", "in_progress", "closed"].includes(status)
      ? { status }
      : {};

  const leads = await prisma.lead.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      object: true,
    },
  });

  return (
    <main
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f3f4f6",
        minHeight: "100vh",
        color: "#111827",
        padding: "32px 16px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div
          style={{
            marginBottom: "20px",
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <Link href="/">
            <button type="button" style={secondaryButton}>
              ← Вернуться в каталог
            </button>
          </Link>
        </div>

        <h1
          style={{
            marginTop: 0,
            marginBottom: "20px",
            fontSize: "40px",
            color: "#111827",
          }}
        >
          Заявки
        </h1>

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            marginBottom: "20px",
          }}
        >
          <Link href="/leads">
            <button
              type="button"
              style={status === "" ? activeFilterButton : filterButton}
            >
              Все
            </button>
          </Link>

          <Link href="/leads?status=new">
            <button
              type="button"
              style={status === "new" ? activeFilterButton : filterButton}
            >
              Новые
            </button>
          </Link>

          <Link href="/leads?status=in_progress">
            <button
              type="button"
              style={
                status === "in_progress" ? activeFilterButton : filterButton
              }
            >
              В работе
            </button>
          </Link>

          <Link href="/leads?status=closed">
            <button
              type="button"
              style={status === "closed" ? activeFilterButton : filterButton}
            >
              Закрытые
            </button>
          </Link>
        </div>

        <LeadsAdmin initialLeads={leads} />
      </div>
    </main>
  );
}

const secondaryButton: React.CSSProperties = {
  padding: "12px 16px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  backgroundColor: "#ffffff",
  color: "#1f2b3d",
  fontSize: "15px",
  fontWeight: 600,
  cursor: "pointer",
};

const filterButton: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: "999px",
  border: "1px solid #d1d5db",
  backgroundColor: "#ffffff",
  color: "#1f2b3d",
  fontSize: "14px",
  fontWeight: 600,
  cursor: "pointer",
};

const activeFilterButton: React.CSSProperties = {
  ...filterButton,
  backgroundColor: "#1f2b3d",
  color: "#ffffff",
  border: "1px solid #1f2b3d",
};