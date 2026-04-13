"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { clearCompare, getCompareList, toggleCompare } from "@/lib/compare";

export default function ComparePage() {
  const [objects, setObjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    const ids = getCompareList();

    if (ids.length === 0) {
      setObjects([]);
      setLoading(false);
      return;
    }

    const res = await fetch("/api/objects", { cache: "no-store" });
    const data = await res.json();

    const filtered = data.filter((item: any) => ids.includes(item.id));
    setObjects(filtered);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <main style={{ padding: "24px", fontFamily: "Arial, sans-serif" }}>
        Загрузка...
      </main>
    );
  }

  return (
    <main
      style={{
        padding: "24px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f3f4f6",
        minHeight: "100vh",
        color: "#111827",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
          <Link href="/">
            <button type="button" style={secondaryButton}>
              ← Вернуться в каталог
            </button>
          </Link>

          <button
            type="button"
            onClick={() => {
              clearCompare();
              setObjects([]);
            }}
            style={secondaryButton}
          >
            Очистить сравнение
          </button>
        </div>

        <h1 style={{ marginTop: 0, marginBottom: "20px" }}>Сравнение объектов</h1>

        {objects.length === 0 ? (
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              padding: "24px",
              border: "1px solid #e5e7eb",
            }}
          >
            Нет объектов для сравнения
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${objects.length}, minmax(260px, 1fr))`,
              gap: "20px",
              alignItems: "start",
            }}
          >
            {objects.map((obj) => (
              <div
                key={obj.id}
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "16px",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  overflow: "hidden",
                }}
              >
                <img
                  src={
                    obj.image1 && obj.image1.trim() !== ""
                      ? obj.image1
                      : "https://via.placeholder.com/600x360?text=No+Image"
                  }
                  alt={obj.title}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                    display: "block",
                    backgroundColor: "#e5e7eb",
                  }}
                />

                <div style={{ padding: "16px" }}>
                  <h2
                    style={{
                      fontSize: "26px",
                      marginTop: 0,
                      marginBottom: "14px",
                      lineHeight: 1.15,
                    }}
                  >
                    {obj.title}
                  </h2>

                  <div style={row}>
                    <strong>Цена:</strong> {obj.price} ₽
                  </div>
                  <div style={row}>
                    <strong>Площадь:</strong> {obj.area} м²
                  </div>
                  <div style={row}>
                    <strong>Этажей:</strong> {obj.floors}
                  </div>
                  <div style={row}>
                    <strong>Спальни:</strong> {obj.bedrooms}
                  </div>
                  <div style={row}>
                    <strong>Комнаты:</strong> {obj.rooms}
                  </div>
                  <div style={row}>
                    <strong>Материал:</strong> {obj.material}
                  </div>

                  <div style={{ marginTop: "16px", display: "grid", gap: "10px" }}>
                    <Link href={`/object/${obj.slug}`}>
                      <button type="button" style={primaryButton}>
                        Подробнее
                      </button>
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        toggleCompare(obj.id);
                        loadData();
                        window.dispatchEvent(new Event("compare-updated"));
                      }}
                      style={secondaryButtonFull}
                    >
                      Удалить из сравнения
                    </button>
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

const row: React.CSSProperties = {
  marginBottom: "10px",
  lineHeight: 1.5,
};

const primaryButton: React.CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: "8px",
  border: "none",
  backgroundColor: "#1f2b3d",
  color: "#ffffff",
  fontSize: "15px",
  fontWeight: 700,
  cursor: "pointer",
};

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

const secondaryButtonFull: React.CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  backgroundColor: "#ffffff",
  color: "#1f2b3d",
  fontSize: "15px",
  fontWeight: 600,
  cursor: "pointer",
};