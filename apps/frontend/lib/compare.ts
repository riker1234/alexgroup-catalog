export function getCompareList(): number[] {
  if (typeof window === "undefined") return [];

  const raw = localStorage.getItem("compare");
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCompareList(list: number[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("compare", JSON.stringify(list));
}

export function isInCompare(id: number): boolean {
  return getCompareList().includes(id);
}

export function toggleCompare(id: number): number[] {
  const list = getCompareList();

  if (list.includes(id)) {
    const next = list.filter((item) => item !== id);
    saveCompareList(next);
    return next;
  }

  if (list.length >= 3) {
    throw new Error("Можно сравнить максимум 3 объекта");
  }

  const next = [...list, id];
  saveCompareList(next);
  return next;
}

export function clearCompare() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("compare");
}