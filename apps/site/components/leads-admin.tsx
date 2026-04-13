"use client";

import Link from "next/link";
import { useState } from "react";

type LeadItem = {
  id: number;
  name: string;
  phone: string;
  message: string | null;
  status: string;
  createdAt: string;
  object: {
    id: number;
    title: string;
    slug: string;
  };
};

type LeadsAdminProps = {
  initialLeads: LeadItem[];
};

function getStatusLabel(status: string) {
  if (status === "new") return "Новая";
  if (status === "in_progress") return "В работе";
  if (status === "closed") return "Закрыта";
  return status;
}

function getStatusColor(status: string) {
  if (status === "new") {
    return {
      background: "#dbeafe",
      color: "#1d4ed8",
      border: "#bfdbfe",
    };
  }

  if (status === "in_progress") {
    return {
      background: "#fef3c7",
      color: "#b45309",
      border: "#fde68a",
    };
  }

  return {
    background: "#dcfce7",
    color: "#15803d",
    border: "#bbf7d0",
  };
}

export default function LeadsAdmin({ initialLeads }: LeadsAdminProps) {
  const [leads, setLeads] = useState(initialLeads);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  async function updateStatus(id: number, status: string) {
    setLoadingId(id);

    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Ошибка обновления статуса");
        setLoadingId(null);
        return;
      }

      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === id ? { ...lead, status } : lead
        )
      );
    } catch {
      alert("Ошибка сети");
    } finally {
      setLoadingId(null);
    }
  }

  async function removeLead(id: number) {
    const confirmed = window.confirm("Удалить заявку?");
    if (!confirmed) return;

    setLoadingId(id);

    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Ошибка удаления заявки");
        setLoadingId(null);
        return;
      }

      setLeads((prev) => prev.filter((lead) => lead.id !== id));
    } catch {
      alert("Ошибка сети");
    } finally {
      setLoadingId(null);
    }
  }

  if (leads.length === 0) {
    return (
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
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gap: "16px",
      }}
    >
      {leads.map((lead) => {
        const statusStyle = getStatusColor(lead.status);

        return (
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
                display: "flex",
                justifyContent: "space-between",
                gap: "12px",
                alignItems: "flex-start",
                flexWrap: "wrap",
                marginBottom: "16px",
              }}
            >
              <div>
                <div style={{ fontSize: "22px", fontWeight: 700, color: "#111827" }}>
                  {lead.name}
                </div>
                <div style={{ marginTop: "6px", color: "#374151" }}>
                  {lead.phone}
                </div>
              </div>

              <div
                style={{
                  padding: "8px 12px",
                  borderRadius: "999px",
                  border: `1px solid ${statusStyle.border}`,
                  backgroundColor: statusStyle.background,
                  color: statusStyle.color,
                  fontWeight: 700,
                  fontSize: "14px",
                }}
              >
                {getStatusLabel(lead.status)}
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "12px",
                marginBottom: "16px",
              }}
            >
              <div style={infoCard}>
                <div style={label}>Объект</div>
                <div style={value}>
                  <Link
                    href={`/object/${lead.object.slug}`}
                    style={{
                      color: "#1f2b3d",
                      textDecoration: "none",
                    }}
                  >
                    {lead.object.title}
                  </Link>
                </div>
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
                marginBottom: "16px",
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

            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                onClick={() => updateStatus(lead.id, "new")}
                disabled={loadingId === lead.id}
                style={buttonSecondary}
              >
                Новая
              </button>

              <button
                type="button"
                onClick={() => updateStatus(lead.id, "in_progress")}
                disabled={loadingId === lead.id}
                style={buttonWarning}
              >
                В работу
              </button>

              <button
                type="button"
                onClick={() => updateStatus(lead.id, "closed")}
                disabled={loadingId === lead.id}
                style={buttonSuccess}
              >
                Закрыть
              </button>

              <button
                type="button"
                onClick={() => removeLead(lead.id)}
                disabled={loadingId === lead.id}
                style={buttonDanger}
              >
                Удалить
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

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

const buttonBase: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: "8px",
  border: "none",
  fontWeight: 700,
  cursor: "pointer",
};

const buttonSecondary: React.CSSProperties = {
  ...buttonBase,
  backgroundColor: "#e5e7eb",
  color: "#111827",
};

const buttonWarning: React.CSSProperties = {
  ...buttonBase,
  backgroundColor: "#f59e0b",
  color: "#ffffff",
};

const buttonSuccess: React.CSSProperties = {
  ...buttonBase,
  backgroundColor: "#16a34a",
  color: "#ffffff",
};

const buttonDanger: React.CSSProperties = {
  ...buttonBase,
  backgroundColor: "#dc2626",
  color: "#ffffff",
};