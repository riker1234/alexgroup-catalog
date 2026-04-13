const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchObjects() {
  const res = await fetch(`${API_URL}/api/objects?populate=*`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Ошибка загрузки объектов");
  }

  return res.json();
}

export async function fetchObjectBySlug(slug: string) {
  const safeSlug = encodeURIComponent(slug);

  const res = await fetch(
    `${API_URL}/api/objects?filters[slug][$eq]=${safeSlug}&populate=*`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Ошибка загрузки объекта");
  }

  const result = await res.json();
  return result.data?.[0] || null;
}