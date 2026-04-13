"use client";

import { useEffect, useState } from "react";
import { isInCompare, toggleCompare } from "@/lib/compare";

type CompareButtonProps = {
  objectId: number;
};

export default function CompareButton({ objectId }: CompareButtonProps) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(isInCompare(objectId));
  }, [objectId]);

  function handleClick() {
    try {
      const next = toggleCompare(objectId);
      setActive(next.includes(objectId));
      window.dispatchEvent(new Event("compare-updated"));
    } catch (error: any) {
      alert(error.message || "Ошибка сравнения");
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      style={{
        width: "100%",
        padding: "12px 16px",
        borderRadius: "8px",
        border: active ? "none" : "1px solid #1f2b3d",
        backgroundColor: active ? "#1f2b3d" : "#ffffff",
        color: active ? "#ffffff" : "#1f2b3d",
        fontSize: "15px",
        fontWeight: 700,
        cursor: "pointer",
        marginTop: "10px",
      }}
    >
      {active ? "В сравнении" : "Сравнить"}
    </button>
  );
}