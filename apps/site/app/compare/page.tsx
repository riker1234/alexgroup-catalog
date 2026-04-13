"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { clearCompare, getCompareList, toggleCompare } from "@/lib/compare";

type CompareObject = {
  id: number;
  title: string;
  slug: string;
  price: number;
  area: number;
  floors: number;
  bedrooms: number;
  rooms: number;
  material: string;
  image1?: string | null;
};

type CompareRow = {
  key: "price" | "area" | "bedrooms" | "rooms" | "floors" | "material";
  label: string;
  format: (obj: CompareObject) => string;
};

const compareRows: CompareRow[] = [
  {
    key: "price",
    label: "Цена",
    format: (obj) => `${Number(obj.price).toLocaleString("ru-RU")} ₽`,
  },
  {
    key: "area",
    label: "Площадь дома",
    format: (obj) => `${obj.area} м²`,
  },
  {
    key: "bedrooms",
    label: "Спален",
    format: (obj) => `${obj.bedrooms}`,
  },
  {
    key: "rooms",
    label: "Комнат",
    format: (obj) => `${obj.rooms}`,
  },
  {
    key: "floors",
    label: "Этажей",
    format: (obj) => `${obj.floors}`,
  },
  {
    key: "material",
    label: "Материал",
    format: (obj) => obj.material,
  },
];

function getBestValues(objects: CompareObject[]) {
  if (objects.length === 0) {
    return {
      minPrice: null,
      maxArea: null,
      maxBedrooms: null,
      maxRooms: null,
    };
  }

  return {
    minPrice: Math.min(...objects.map((obj) => obj.price)),
    maxArea: Math.max(...objects.map((obj) => obj.area)),
    maxBedrooms: Math.max(...objects.map((obj) => obj.bedrooms)),
    maxRooms: Math.max(...objects.map((obj) => obj.rooms)),
  };
}

function isBestValue(
  rowKey: CompareRow["key"],
  obj: CompareObject,
  best: ReturnType<typeof getBestValues>
) {
  if (rowKey === "price") return obj.price === best.minPrice;
  if (rowKey === "area") return obj.area === best.maxArea;
  if (rowKey === "bedrooms") return obj.bedrooms === best.maxBedrooms;
  if (rowKey === "rooms") return obj.rooms === best.maxRooms;
  return false;
}

export default function ComparePage() {
  const [objects, setObjects] = useState<CompareObject[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    setLoading(true);

    const ids = getCompareList();

    if (ids.length === 0) {
      setObjects([]);
      setLoading(false);
      return;
    }

    const res = await fetch("/api/objects?pageSize=100", {
      cache: "no-store",
    });

    const data = await res.json();
    const items = Array.isArray(data.items) ? data.items : [];

    const filtered = items.filter((item: CompareObject) =>
      ids.includes(item.id)
    );

    filtered.sort((a: CompareObject, b: CompareObject) => {
      return ids.indexOf(a.id) - ids.indexOf(b.id);
    });

    setObjects(filtered);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  const bestValues = useMemo(() => getBestValues(objects), [objects]);

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          backgroundColor: "#f4f6f8",
          fontFamily: "Arial, sans-serif",
          color: "#111827",
          padding: "32px 16px",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>Загрузка...</div>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#f4f6f8",
        fontFamily: "Arial, sans-serif",
        color: "#111827",
        paddingBottom: "40px",
      }}
    >
      <section
        style={{
          background:
            "linear-gradient(135deg, #0f172a 0%, #1f2b3d 55%, #24364d 100%)",
          color: "#ffffff",
          padding: "56px 24px 44px",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div
            style={{
              display: "inline-block",
              padding: "8px 14px",
              borderRadius: "999px",
              backgroundColor: "rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.92)",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            Сравнение объектов
          </div>

          <h1
            style={{
              margin: 0,
              marginBottom: "12px",
              fontSize: "48px",
              lineHeight: 1.08,
              fontWeight: 700,
            }}
          >
            Сравнение проектов
          </h1>

          <p
            style={{
              margin: 0,
              maxWidth: "760px",
              fontSize: "18px",
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.82)",
            }}
          >
            Сравните ключевые характеристики объектов и выберите проект, который
            подходит лучше всего.
          </p>
        </div>
      </section>

      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "24px 16px 0",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            marginBottom: "20px",
          }}
        >
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

        {objects.length === 0 ? (
          <div
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "22px",
              boxShadow: "0 14px 40px rgba(15,23,42,0.06)",
              padding: "28px",
            }}
          >
            Нет объектов для сравнения
          </div>
        ) : (
          <div
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "24px",
              boxShadow: "0 14px 40px rgba(15,23,42,0.08)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `220px repeat(${objects.length}, minmax(290px, 1fr))`,
                alignItems: "stretch",
              }}
            >
              <div
                style={{
                  borderRight: "1px solid #e5e7eb",
                  backgroundColor: "#f8fafc",
                }}
              >
                <div
                  style={{
                    minHeight: "330px",
                    padding: "24px 18px",
                    borderBottom: "1px solid #e5e7eb",
                    display: "flex",
                    alignItems: "flex-end",
                    fontSize: "20px",
                    fontWeight: 700,
                    color: "#1f2b3d",
                  }}
                >
                  Характеристики
                </div>

                {compareRows.map((row, index) => (
                  <div
                    key={row.key}
                    style={{
                      minHeight: "68px",
                      padding: "0 18px",
                      display: "flex",
                      alignItems: "center",
                      borderBottom:
                        index === compareRows.length - 1
                          ? "none"
                          : "1px solid #edf2f7",
                      backgroundColor: index % 2 === 0 ? "#ffffff" : "#f8fafc",
                      color: "#475569",
                      fontSize: "15px",
                      fontWeight: 600,
                    }}
                  >
                    {row.label}
                  </div>
                ))}

                <div
                  style={{
                    minHeight: "92px",
                    padding: "0 18px",
                    display: "flex",
                    alignItems: "center",
                    borderTop: "1px solid #e5e7eb",
                    backgroundColor: "#f8fafc",
                    color: "#1f2b3d",
                    fontSize: "15px",
                    fontWeight: 700,
                  }}
                >
                  Действия
                </div>
              </div>

              {objects.map((obj, columnIndex) => (
                <div
                  key={obj.id}
                  style={{
                    borderRight:
                      columnIndex === objects.length - 1
                        ? "none"
                        : "1px solid #e5e7eb",
                    minWidth: 0,
                  }}
                >
                  <div
                    style={{
                      minHeight: "330px",
                      padding: "18px",
                      borderBottom: "1px solid #e5e7eb",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div
                      style={{
                        borderRadius: "18px",
                        overflow: "hidden",
                        backgroundColor: "#e5e7eb",
                        marginBottom: "14px",
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
                          height: "185px",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    </div>

                    <div
                      style={{
                        fontSize: "22px",
                        lineHeight: 1.15,
                        fontWeight: 700,
                        color: "#111827",
                        marginBottom: "14px",
                      }}
                    >
                      {obj.title}
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 44px",
                        gap: "10px",
                        marginTop: "auto",
                      }}
                    >
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
                        style={iconRemoveButton}
                        aria-label="Удалить из сравнения"
                        title="Удалить из сравнения"
                      >
                        ×
                      </button>
                    </div>
                  </div>

                  {compareRows.map((row, rowIndex) => {
                    const isBest = isBestValue(row.key, obj, bestValues);

                    return (
                      <div
                        key={row.key}
                        style={{
                          minHeight: "68px",
                          padding: "0 18px",
                          display: "flex",
                          alignItems: "center",
                          borderBottom:
                            rowIndex === compareRows.length - 1
                              ? "none"
                              : "1px solid #edf2f7",
                          backgroundColor: isBest
                            ? "#ecfdf5"
                            : rowIndex % 2 === 0
                            ? "#ffffff"
                            : "#f8fafc",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            flexWrap: "wrap",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "15px",
                              fontWeight:
                                row.key === "price" || row.key === "area"
                                  ? 700
                                  : 500,
                              color: isBest ? "#166534" : "#111827",
                            }}
                          >
                            {row.format(obj)}
                          </span>

                          {isBest ? (
                            <span
                              style={{
                                padding: "5px 8px",
                                borderRadius: "999px",
                                fontSize: "12px",
                                fontWeight: 700,
                                backgroundColor: "#dcfce7",
                                color: "#166534",
                              }}
                            >
                              Лучшее
                            </span>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}

                  <div
                    style={{
                      minHeight: "92px",
                      padding: "18px",
                      borderTop: "1px solid #e5e7eb",
                      backgroundColor: "#f8fafc",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Link href={`/object/${obj.slug}`} style={{ width: "100%" }}>
                      <button type="button" style={ctaButton}>
                        Оставить заявку
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

const primaryButton: React.CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: "10px",
  border: "none",
  backgroundColor: "#1f2b3d",
  color: "#ffffff",
  fontSize: "15px",
  fontWeight: 700,
  cursor: "pointer",
};

const ctaButton: React.CSSProperties = {
  width: "100%",
  padding: "13px 16px",
  borderRadius: "10px",
  border: "none",
  backgroundColor: "#1f2b3d",
  color: "#ffffff",
  fontSize: "15px",
  fontWeight: 700,
  cursor: "pointer",
};

const secondaryButton: React.CSSProperties = {
  padding: "12px 16px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  backgroundColor: "#ffffff",
  color: "#1f2b3d",
  fontSize: "15px",
  fontWeight: 600,
  cursor: "pointer",
};

const iconRemoveButton: React.CSSProperties = {
  width: "44px",
  height: "44px",
  borderRadius: "10px",
  border: "1px solid #e5e7eb",
  backgroundColor: "#f8fafc",
  color: "#64748b",
  fontSize: "24px",
  lineHeight: 1,
  cursor: "pointer",
};