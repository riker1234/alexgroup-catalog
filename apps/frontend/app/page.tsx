import Link from "next/link";
import CompareBar from "@/components/compare-bar";
import CompareButton from "@/components/compare-button";

type PageProps = {
  searchParams: Promise<{
    minPrice?: string;
    maxPrice?: string;
    minArea?: string;
    maxArea?: string;
    sort?: string;
  }>;
};

async function getObjects(filters: {
  minPrice?: string;
  maxPrice?: string;
  minArea?: string;
  maxArea?: string;
  sort?: string;
}) {
  const params = new URLSearchParams();

  if (filters.minPrice) params.set("minPrice", filters.minPrice);
  if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
  if (filters.minArea) params.set("minArea", filters.minArea);
  if (filters.maxArea) params.set("maxArea", filters.maxArea);
  if (filters.sort) params.set("sort", filters.sort);

  const query = params.toString();
  const url = query
    ? `http://localhost:3000/api/objects?${query}`
    : `http://localhost:3000/api/objects`;

  const res = await fetch(url, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Ошибка загрузки объектов");
  }

  return res.json();
}

export default async function Page({ searchParams }: PageProps) {
  const filters = await searchParams;
  const objects = await getObjects(filters);

  return (
    <main
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f3f4f6",
        minHeight: "100vh",
        color: "#111827",
        paddingBottom: "120px",
      }}
    >
      <section
        style={{
          background: "linear-gradient(90deg, #0f172a, #1f2b3d)",
          color: "#ffffff",
          padding: "60px 32px",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h1
            style={{
              fontSize: "48px",
              lineHeight: 1.1,
              margin: 0,
              marginBottom: "16px",
              color: "#ffffff",
            }}
          >
            Каталог объектов
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: "20px",
              color: "rgba(255,255,255,0.85)",
            }}
          >
            Подберите дом по цене, площади и параметрам
          </p>
        </div>
      </section>

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "24px 16px 40px",
          display: "grid",
          gridTemplateColumns: "280px 1fr",
          gap: "24px",
          alignItems: "start",
        }}
      >
        <aside
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            padding: "20px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            border: "1px solid #e5e7eb",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              marginBottom: "16px",
              fontSize: "24px",
              color: "#111827",
            }}
          >
            Фильтры
          </h2>

          <form method="GET">
            <label style={label}>Цена от</label>
            <input
              name="minPrice"
              placeholder="Например, 10000000"
              defaultValue={filters.minPrice}
              style={input}
            />

            <label style={label}>Цена до</label>
            <input
              name="maxPrice"
              placeholder="Например, 15000000"
              defaultValue={filters.maxPrice}
              style={input}
            />

            <label style={label}>Площадь от</label>
            <input
              name="minArea"
              placeholder="Например, 100"
              defaultValue={filters.minArea}
              style={input}
            />

            <label style={label}>Площадь до</label>
            <input
              name="maxArea"
              placeholder="Например, 130"
              defaultValue={filters.maxArea}
              style={input}
            />

            <label style={label}>Сортировка</label>
            <select
              name="sort"
              defaultValue={filters.sort || "newest"}
              style={input}
            >
              <option value="newest">Сначала новые</option>
              <option value="price_asc">Цена: по возрастанию</option>
              <option value="price_desc">Цена: по убыванию</option>
              <option value="area_asc">Площадь: по возрастанию</option>
              <option value="area_desc">Площадь: по убыванию</option>
            </select>

            <button type="submit" style={primaryButton}>
              Применить фильтр
            </button>

            <Link href="/">
              <button type="button" style={secondaryButton}>
                Сбросить
              </button>
            </Link>
          </form>
        </aside>

        <section>
          <div
            style={{
              marginBottom: "16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                fontSize: "18px",
                color: "#111827",
                fontWeight: 600,
              }}
            >
              Найдено: {objects.length} объектов
            </div>

            <div
              style={{
                fontSize: "14px",
                color: "#4b5563",
              }}
            >
              Текущая сортировка:{" "}
              <strong>
                {filters.sort === "price_asc" && "Цена: по возрастанию"}
                {filters.sort === "price_desc" && "Цена: по убыванию"}
                {filters.sort === "area_asc" && "Площадь: по возрастанию"}
                {filters.sort === "area_desc" && "Площадь: по убыванию"}
                {!filters.sort || filters.sort === "newest"
                  ? "Сначала новые"
                  : ""}
              </strong>
            </div>
          </div>

          {objects.length === 0 ? (
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "16px",
                padding: "24px",
                border: "1px solid #e5e7eb",
                color: "#111827",
              }}
            >
              По выбранным параметрам объекты не найдены
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: "20px",
              }}
            >
              {objects.map((obj: any) => (
                <div
                  key={obj.id}
                  style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "18px",
                    overflow: "hidden",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    display: "flex",
                    flexDirection: "column",
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
                      height: "220px",
                      objectFit: "cover",
                      display: "block",
                      backgroundColor: "#e5e7eb",
                    }}
                  />

                  <div
                    style={{
                      padding: "18px",
                      display: "flex",
                      flexDirection: "column",
                      flexGrow: 1,
                    }}
                  >
                    <h3
                      style={{
                        marginTop: 0,
                        marginBottom: "14px",
                        fontSize: "28px",
                        lineHeight: 1.15,
                        color: "#111827",
                      }}
                    >
                      {obj.title}
                    </h3>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "10px",
                        marginBottom: "16px",
                      }}
                    >
                      <div style={miniFeature}>
                        <div style={miniFeatureLabel}>Цена</div>
                        <div style={miniFeatureValue}>{obj.price} ₽</div>
                      </div>

                      <div style={miniFeature}>
                        <div style={miniFeatureLabel}>Площадь</div>
                        <div style={miniFeatureValue}>{obj.area} м²</div>
                      </div>

                      <div style={miniFeature}>
                        <div style={miniFeatureLabel}>Этажей</div>
                        <div style={miniFeatureValue}>{obj.floors}</div>
                      </div>

                      <div style={miniFeature}>
                        <div style={miniFeatureLabel}>Спальни</div>
                        <div style={miniFeatureValue}>{obj.bedrooms}</div>
                      </div>
                    </div>

                    <p style={materialRow}>
                      <strong>Материал:</strong> {obj.material}
                    </p>

                    <div style={{ marginTop: "auto", paddingTop: "10px" }}>
                      <Link href={`/object/${obj.slug}`}>
                        <button type="button" style={cardButton}>
                          Подробнее
                        </button>
                      </Link>

                      <CompareButton objectId={obj.id} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <CompareBar />
    </main>
  );
}

const label: React.CSSProperties = {
  display: "block",
  marginBottom: "6px",
  fontSize: "14px",
  fontWeight: 600,
  color: "#111827",
};

const input: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px",
  marginBottom: "14px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  backgroundColor: "#ffffff",
  color: "#111827",
  fontSize: "14px",
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
  width: "100%",
  padding: "12px 16px",
  marginTop: "10px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  backgroundColor: "#ffffff",
  color: "#1f2b3d",
  fontSize: "15px",
  fontWeight: 600,
  cursor: "pointer",
};

const cardButton: React.CSSProperties = {
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

const miniFeature: React.CSSProperties = {
  backgroundColor: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  padding: "12px",
};

const miniFeatureLabel: React.CSSProperties = {
  fontSize: "12px",
  color: "#6b7280",
  marginBottom: "4px",
};

const miniFeatureValue: React.CSSProperties = {
  fontSize: "18px",
  fontWeight: 700,
  color: "#111827",
};

const materialRow: React.CSSProperties = {
  margin: 0,
  color: "#111827",
  fontSize: "15px",
};