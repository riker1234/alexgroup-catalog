import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function LeadsPage() {
  const leads = await prisma.lead.findMany({
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
        <div style={{ marginBottom: "20px" }}>
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

        {leads.length === 0 ? (
          <div
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            Пока заявок нет
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: "16px",
            }}
          >
            {leads.map((lead) => (
              <div
                key={lead.id}
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "16px",
                  padding: "20px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "12px",
                  }}
                >
                  <div style={infoCard}>
                    <div style={label}>Имя</div>
                    <div style={value}>{lead.name}</div>
                  </div>

                  <div style={infoCard}>
                    <div style={label}>Телефон</div>
                    <div style={value}>{lead.phone}</div>
                  </div>

                  <div style={infoCard}>
                    <div style={label}>Объект</div>
                    <div style={value}>{lead.object.title}</div>
                  </div>

                  <div style={infoCard}>
                    <div style={label}>Дата</div>
                    <div style={value}>
                      {new Date(lead.createdAt).toLocaleString("ru-RU")}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: "16px",
                    backgroundColor: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    padding: "14px",
                  }}
                >
                  <div style={label}>Комментарий</div>
                  <div style={messageValue}>
                    {lead.message && lead.message.trim() !== ""
                      ? lead.message
                      : "Комментарий не указан"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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

const infoCard: React.CSSProperties = {
  backgroundColor: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  padding: "14px",
};

const label: React.CSSProperties = {
  fontSize: "13px",
  color: "#6b7280",
  marginBottom: "6px",
};

const value: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: 700,
  color: "#111827",
};

const messageValue: React.CSSProperties = {
  fontSize: "15px",
  lineHeight: 1.7,
  color: "#374151",
};