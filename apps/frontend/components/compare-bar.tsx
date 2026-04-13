"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { clearCompare, getCompareList } from "@/lib/compare";

export default function CompareBar() {
  const [list, setList] = useState<number[]>([]);

  function sync() {
    setList(getCompareList());
  }

  useEffect(() => {
    sync();

    window.addEventListener("compare-updated", sync);
    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener("compare-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  if (list.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        left: "50%",
        bottom: "20px",
        transform: "translateX(-50%)",
        width: "min(1100px, calc(100% - 32px))",
        backgroundColor: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "16px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
        padding: "16px 20px",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
      }}
    >
      <div style={{ color: "#111827", fontSize: "16px", fontWeight: 600 }}>
        Сравнение: {list.length} из 3
      </div>

      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <button
          type="button"
          onClick={() => {
            clearCompare();
            sync();
            window.dispatchEvent(new Event("compare-updated"));
          }}
          style={{
            padding: "10px 14px",
            borderRadius: "8px",
            border: "1px solid #d1d5db",
            backgroundColor: "#ffffff",
            color: "#1f2b3d",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Очистить
        </button>

        <Link href="/compare">
          <button
            type="button"
            style={{
              padding: "10px 16px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#1f2b3d",
              color: "#ffffff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Сравнить →
          </button>
        </Link>
      </div>
    </div>
  );
}