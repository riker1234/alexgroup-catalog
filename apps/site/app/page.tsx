import Link from "next/link";
import CompareBar from "@/components/compare-bar";
import CompareButton from "@/components/compare-button";

type PageProps = {
  searchParams: Promise<{
    minPrice?: string;
    maxPrice?: string;
    minArea?: string;
    maxArea?: string;
    minBedrooms?: string;
    maxBedrooms?: string;
    minRooms?: string;
    maxRooms?: string;
    minFloors?: string;
    maxFloors?: string;
    sort?: string;
    search?: string;
    page?: string;
  }>;
};

async function getObjects(filters: {
  minPrice?: string;
  maxPrice?: string;
  minArea?: string;
  maxArea?: string;
  minBedrooms?: string;
  maxBedrooms?: string;
  minRooms?: string;
  maxRooms?: string;
  minFloors?: string;
  maxFloors?: string;
  sort?: string;
  search?: string;
  page?: string;
}) {
  const params = new URLSearchParams();

  if (filters.search) params.set("search", filters.search);
  if (filters.minPrice) params.set("minPrice", filters.minPrice);
  if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
  if (filters.minArea) params.set("minArea", filters.minArea);
  if (filters.maxArea) params.set("maxArea", filters.maxArea);

  if (filters.minBedrooms) params.set("minBedrooms", filters.minBedrooms);
  if (filters.maxBedrooms) params.set("maxBedrooms", filters.maxBedrooms);

  if (filters.minRooms) params.set("minRooms", filters.minRooms);
  if (filters.maxRooms) params.set("maxRooms", filters.maxRooms);

  if (filters.minFloors) params.set("minFloors", filters.minFloors);
  if (filters.maxFloors) params.set("maxFloors", filters.maxFloors);

  if (filters.sort) params.set("sort", filters.sort);
  if (filters.page) params.set("page", filters.page);

  params.set("pageSize", "6");

  const query = params.toString();
  const url = query
    ? `http://localhost:3000/api/objects?${query}`
    : `http://localhost:3000/api/objects?pageSize=6`;

  const res = await fetch(url, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Ошибка загрузки объектов");
  }

  return res.json();
}

function buildPageLink(
  filters: {
    minPrice?: string;
    maxPrice?: string;
    minArea?: string;
    maxArea?: string;
    minBedrooms?: string;
    maxBedrooms?: string;
    minRooms?: string;
    maxRooms?: string;
    minFloors?: string;
    maxFloors?: string;
    sort?: string;
    search?: string;
  },
  page: number
) {
  const params = new URLSearchParams();

  if (filters.search) params.set("search", filters.search);
  if (filters.minPrice) params.set("minPrice", filters.minPrice);
  if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
  if (filters.minArea) params.set("minArea", filters.minArea);
  if (filters.maxArea) params.set("maxArea", filters.maxArea);

  if (filters.minBedrooms) params.set("minBedrooms", filters.minBedrooms);
  if (filters.maxBedrooms) params.set("maxBedrooms", filters.maxBedrooms);

  if (filters.minRooms) params.set("minRooms", filters.minRooms);
  if (filters.maxRooms) params.set("maxRooms", filters.maxRooms);

  if (filters.minFloors) params.set("minFloors", filters.minFloors);
  if (filters.maxFloors) params.set("maxFloors", filters.maxFloors);

  if (filters.sort) params.set("sort", filters.sort);

  params.set("page", String(page));

  return `/?${params.toString()}`;
}

function buildBedroomsLink(
  filters: Awaited<PageProps["searchParams"]>,
  value: "any" | "2" | "3" | "4" | "4+"
) {
  const params = new URLSearchParams();

  if (filters.search) params.set("search", filters.search);
  if (filters.minPrice) params.set("minPrice", filters.minPrice);
  if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
  if (filters.minArea) params.set("minArea", filters.minArea);
  if (filters.maxArea) params.set("maxArea", filters.maxArea);

  if (filters.minRooms) params.set("minRooms", filters.minRooms);
  if (filters.maxRooms) params.set("maxRooms", filters.maxRooms);

  if (filters.minFloors) params.set("minFloors", filters.minFloors);
  if (filters.maxFloors) params.set("maxFloors", filters.maxFloors);

  if (filters.sort) params.set("sort", filters.sort);

  if (value === "2") {
    params.set("minBedrooms", "2");
    params.set("maxBedrooms", "2");
  } else if (value === "3") {
    params.set("minBedrooms", "3");
    params.set("maxBedrooms", "3");
  } else if (value === "4") {
    params.set("minBedrooms", "4");
    params.set("maxBedrooms", "4");
  } else if (value === "4+") {
    params.set("minBedrooms", "4");
  }

  return `/?${params.toString()}`;
}

function buildFloorsLink(
  filters: Awaited<PageProps["searchParams"]>,
  value: "any" | "1" | "2" | "3+"
) {
  const params = new URLSearchParams();

  if (filters.search) params.set("search", filters.search);
  if (filters.minPrice) params.set("minPrice", filters.minPrice);
  if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
  if (filters.minArea) params.set("minArea", filters.minArea);
  if (filters.maxArea) params.set("maxArea", filters.maxArea);

  if (filters.minBedrooms) params.set("minBedrooms", filters.minBedrooms);
  if (filters.maxBedrooms) params.set("maxBedrooms", filters.maxBedrooms);

  if (filters.minRooms) params.set("minRooms", filters.minRooms);
  if (filters.maxRooms) params.set("maxRooms", filters.maxRooms);

  if (filters.sort) params.set("sort", filters.sort);

  if (value === "1") {
    params.set("minFloors", "1");
    params.set("maxFloors", "1");
  } else if (value === "2") {
    params.set("minFloors", "2");
    params.set("maxFloors", "2");
  } else if (value === "3+") {
    params.set("minFloors", "3");
  }

  return `/?${params.toString()}`;
}

function isBedroomsActive(
  filters: Awaited<PageProps["searchParams"]>,
  value: "any" | "2" | "3" | "4" | "4+"
) {
  if (value === "any") {
    return !filters.minBedrooms && !filters.maxBedrooms;
  }
  if (value === "2") {
    return filters.minBedrooms === "2" && filters.maxBedrooms === "2";
  }
  if (value === "3") {
    return filters.minBedrooms === "3" && filters.maxBedrooms === "3";
  }
  if (value === "4") {
    return filters.minBedrooms === "4" && filters.maxBedrooms === "4";
  }
  if (value === "4+") {
    return filters.minBedrooms === "4" && !filters.maxBedrooms;
  }
  return false;
}

function isFloorsActive(
  filters: Awaited<PageProps["searchParams"]>,
  value: "any" | "1" | "2" | "3+"
) {
  if (value === "any") {
    return !filters.minFloors && !filters.maxFloors;
  }
  if (value === "1") {
    return filters.minFloors === "1" && filters.maxFloors === "1";
  }
  if (value === "2") {
    return filters.minFloors === "2" && filters.maxFloors === "2";
  }
  if (value === "3+") {
    return filters.minFloors === "3" && !filters.maxFloors;
  }
  return false;
}

function getSortLabel(sort?: string) {
  if (sort === "price_asc") return "Цена: по возрастанию";
  if (sort === "price_desc") return "Цена: по убыванию";
  if (sort === "area_asc") return "Площадь: по возрастанию";
  if (sort === "area_desc") return "Площадь: по убыванию";
  return "Сначала новые";
}

export default async function Page({ searchParams }: PageProps) {
  const filters = await searchParams;
  const data = await getObjects(filters);

  const objects = data.items;
  const pagination = data.pagination;

  const currentPage = pagination.page;
  const totalPages = pagination.totalPages;

  return (
    <main
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f4f6f8",
        minHeight: "100vh",
        color: "#111827",
        paddingBottom: "120px",
      }}
    >
      <section
        style={{
          background:
            "linear-gradient(135deg, #0f172a 0%, #1f2b3d 55%, #24364d 100%)",
          color: "#ffffff",
          padding: "72px 24px 64px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: "-120px",
            top: "-120px",
            width: "320px",
            height: "320px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: "120px",
            bottom: "-80px",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
          }}
        />

        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "8px 14px",
              borderRadius: "999px",
              backgroundColor: "rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.9)",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              marginBottom: "18px",
            }}
          >
            AlexGroup Catalog
          </div>

          <h1
            style={{
              fontSize: "56px",
              lineHeight: 1.05,
              margin: 0,
              marginBottom: "18px",
              color: "#ffffff",
              maxWidth: "760px",
            }}
          >
            Каталог объектов
          </h1>

          <p
            style={{
              margin: 0,
              fontSize: "20px",
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.82)",
              maxWidth: "760px",
            }}
          >
            Подберите проект дома по площади, цене, спальням, комнатам и этажности.
          </p>

          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              marginTop: "28px",
            }}
          >
            <div style={heroChip}>Поиск</div>
            <div style={heroChip}>Фильтрация</div>
            <div style={heroChip}>Сравнение</div>
            <div style={heroChip}>Заявки</div>
          </div>
        </div>
      </section>

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "28px 16px 40px",
          display: "grid",
          gridTemplateColumns: "300px 1fr",
          gap: "24px",
          alignItems: "start",
        }}
      >
        <aside
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "20px",
            padding: "22px",
            boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
            border: "1px solid #e7ebf0",
            position: "sticky",
            top: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "10px",
              marginBottom: "18px",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: "24px",
                color: "#111827",
                fontWeight: 700,
              }}
            >
              Фильтры
            </h2>
          </div>

          <form method="GET">
            <label style={label}>Поиск по названию</label>
            <input
              name="search"
              placeholder="Например, Эвита"
              defaultValue={filters.search}
              style={input}
            />

            <div style={sectionTitle}>Цена</div>
            <div style={doubleGrid}>
              <input
                name="minPrice"
                placeholder="от"
                defaultValue={filters.minPrice}
                style={inputCompact}
              />
              <input
                name="maxPrice"
                placeholder="до"
                defaultValue={filters.maxPrice}
                style={inputCompact}
              />
            </div>

            <div style={sectionTitle}>Площадь</div>
            <div style={doubleGrid}>
              <input
                name="minArea"
                placeholder="от"
                defaultValue={filters.minArea}
                style={inputCompact}
              />
              <input
                name="maxArea"
                placeholder="до"
                defaultValue={filters.maxArea}
                style={inputCompact}
              />
            </div>

            <div style={sectionTitle}>Спальни</div>
            <div style={chipRow}>
              <Link href={buildBedroomsLink(filters, "any")}>
                <button
                  type="button"
                  style={
                    isBedroomsActive(filters, "any") ? chipActive : chipButton
                  }
                >
                  Любое
                </button>
              </Link>

              <Link href={buildBedroomsLink(filters, "2")}>
                <button
                  type="button"
                  style={
                    isBedroomsActive(filters, "2") ? chipActive : chipButton
                  }
                >
                  2
                </button>
              </Link>

              <Link href={buildBedroomsLink(filters, "3")}>
                <button
                  type="button"
                  style={
                    isBedroomsActive(filters, "3") ? chipActive : chipButton
                  }
                >
                  3
                </button>
              </Link>

              <Link href={buildBedroomsLink(filters, "4")}>
                <button
                  type="button"
                  style={
                    isBedroomsActive(filters, "4") ? chipActive : chipButton
                  }
                >
                  4
                </button>
              </Link>

              <Link href={buildBedroomsLink(filters, "4+")}>
                <button
                  type="button"
                  style={
                    isBedroomsActive(filters, "4+") ? chipActive : chipButton
                  }
                >
                  4+
                </button>
              </Link>
            </div>

            <div style={sectionTitle}>Комнаты</div>
            <div style={doubleGrid}>
              <input
                name="minRooms"
                placeholder="от"
                defaultValue={filters.minRooms}
                style={inputCompact}
              />
              <input
                name="maxRooms"
                placeholder="до"
                defaultValue={filters.maxRooms}
                style={inputCompact}
              />
            </div>

            <div style={sectionTitle}>Этажи</div>
            <div style={chipRow}>
              <Link href={buildFloorsLink(filters, "any")}>
                <button
                  type="button"
                  style={
                    isFloorsActive(filters, "any") ? chipActive : chipButton
                  }
                >
                  Любой
                </button>
              </Link>

              <Link href={buildFloorsLink(filters, "1")}>
                <button
                  type="button"
                  style={
                    isFloorsActive(filters, "1") ? chipActive : chipButton
                  }
                >
                  1
                </button>
              </Link>

              <Link href={buildFloorsLink(filters, "2")}>
                <button
                  type="button"
                  style={
                    isFloorsActive(filters, "2") ? chipActive : chipButton
                  }
                >
                  2
                </button>
              </Link>

              <Link href={buildFloorsLink(filters, "3+")}>
                <button
                  type="button"
                  style={
                    isFloorsActive(filters, "3+") ? chipActive : chipButton
                  }
                >
                  3+
                </button>
              </Link>
            </div>

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
              Применить
            </button>

            <Link href="/">
              <button type="button" style={secondaryButton}>
                Сбросить все параметры
              </button>
            </Link>
          </form>
        </aside>

        <section>
          <div
            style={{
              marginBottom: "18px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "14px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "18px",
                  color: "#111827",
                  fontWeight: 700,
                  marginBottom: "4px",
                }}
              >
                Найдено: {pagination.total} объектов
              </div>

              <div
                style={{
                  fontSize: "14px",
                  color: "#6b7280",
                }}
              >
                Текущая сортировка: <strong>{getSortLabel(filters.sort)}</strong>
              </div>
            </div>

            <div
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e7ebf0",
                borderRadius: "999px",
                padding: "10px 14px",
                fontSize: "14px",
                fontWeight: 700,
                color: "#1f2b3d",
              }}
            >
              Страница {currentPage} из {totalPages}
            </div>
          </div>

          {objects.length === 0 ? (
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "20px",
                padding: "28px",
                border: "1px solid #e7ebf0",
                color: "#111827",
                boxShadow: "0 10px 30px rgba(15,23,42,0.04)",
              }}
            >
              По выбранным параметрам объекты не найдены.
            </div>
          ) : (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                  gap: "22px",
                }}
              >
                {objects.map((obj: any) => (
                  <div
                    key={obj.id}
                    style={{
                      backgroundColor: "#ffffff",
                      borderRadius: "22px",
                      overflow: "hidden",
                      border: "1px solid #e7ebf0",
                      boxShadow: "0 14px 40px rgba(15,23,42,0.08)",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div style={{ position: "relative" }}>
                      <img
                        src={
                          obj.image1 && obj.image1.trim() !== ""
                            ? obj.image1
                            : "https://via.placeholder.com/600x360?text=No+Image"
                        }
                        alt={obj.title}
                        style={{
                          width: "100%",
                          height: "250px",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />

                      <div
                        style={{
                          position: "absolute",
                          left: "16px",
                          bottom: "16px",
                          backgroundColor: "rgba(255,255,255,0.92)",
                          color: "#1f2b3d",
                          padding: "10px 14px",
                          borderRadius: "999px",
                          fontSize: "15px",
                          fontWeight: 700,
                          boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
                        }}
                      >
                        {Number(obj.price).toLocaleString("ru-RU")} ₽
                      </div>
                    </div>

                    <div
                      style={{
                        padding: "22px",
                        display: "flex",
                        flexDirection: "column",
                        flexGrow: 1,
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          marginBottom: "14px",
                          fontSize: "24px",
                          lineHeight: 1.15,
                          fontWeight: 700,
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

                        <div style={miniFeature}>
                          <div style={miniFeatureLabel}>Комнаты</div>
                          <div style={miniFeatureValue}>{obj.rooms}</div>
                        </div>
                      </div>

                      <div
                        style={{
                          marginTop: "auto",
                          display: "grid",
                          gap: "10px",
                        }}
                      >
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

              <div
                style={{
                  marginTop: "28px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                {currentPage > 1 ? (
                  <Link href={buildPageLink(filters, currentPage - 1)}>
                    <button type="button" style={secondaryButtonCompact}>
                      ← Назад
                    </button>
                  </Link>
                ) : (
                  <button
                    type="button"
                    style={{
                      ...secondaryButtonCompact,
                      opacity: 0.45,
                      cursor: "default",
                    }}
                    disabled
                  >
                    ← Назад
                  </button>
                )}

                <div
                  style={{
                    minWidth: "150px",
                    textAlign: "center",
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "#111827",
                  }}
                >
                  {currentPage} / {totalPages}
                </div>

                {currentPage < totalPages ? (
                  <Link href={buildPageLink(filters, currentPage + 1)}>
                    <button type="button" style={primaryButtonCompact}>
                      Вперёд →
                    </button>
                  </Link>
                ) : (
                  <button
                    type="button"
                    style={{
                      ...primaryButtonCompact,
                      opacity: 0.45,
                      cursor: "default",
                    }}
                    disabled
                  >
                    Вперёд →
                  </button>
                )}
              </div>
            </>
          )}
        </section>
      </div>

      <CompareBar />
    </main>
  );
}

const heroChip: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: "999px",
  backgroundColor: "rgba(255,255,255,0.08)",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: 700,
};

const label: React.CSSProperties = {
  display: "block",
  marginBottom: "7px",
  fontSize: "14px",
  fontWeight: 700,
  color: "#111827",
};

const sectionTitle: React.CSSProperties = {
  marginBottom: "8px",
  fontSize: "13px",
  fontWeight: 700,
  color: "#475569",
  textTransform: "uppercase",
  letterSpacing: "0.03em",
};

const doubleGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "10px",
  marginBottom: "14px",
};

const chipRow: React.CSSProperties = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
  marginBottom: "16px",
};

const chipButton: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: "999px",
  border: "1px solid #e2e8f0",
  backgroundColor: "#f8fafc",
  color: "#1f2b3d",
  fontSize: "14px",
  fontWeight: 600,
  cursor: "pointer",
};

const chipActive: React.CSSProperties = {
  ...chipButton,
  backgroundColor: "#1f2b3d",
  border: "1px solid #1f2b3d",
  color: "#ffffff",
};

const input: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "13px 14px",
  marginBottom: "14px",
  borderRadius: "12px",
  border: "1px solid #d8dee6",
  backgroundColor: "#fbfcfd",
  color: "#111827",
  fontSize: "14px",
  outline: "none",
};

const inputCompact: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "13px 14px",
  borderRadius: "12px",
  border: "1px solid #d8dee6",
  backgroundColor: "#fbfcfd",
  color: "#111827",
  fontSize: "14px",
  outline: "none",
};

const primaryButton: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "12px",
  border: "none",
  backgroundColor: "#1f2b3d",
  color: "#ffffff",
  fontSize: "15px",
  fontWeight: 700,
  cursor: "pointer",
};

const secondaryButton: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  marginTop: "10px",
  borderRadius: "12px",
  border: "1px solid #d8dee6",
  backgroundColor: "#ffffff",
  color: "#1f2b3d",
  fontSize: "15px",
  fontWeight: 600,
  cursor: "pointer",
};

const cardButton: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "12px",
  border: "none",
  backgroundColor: "#1f2b3d",
  color: "#ffffff",
  fontSize: "15px",
  fontWeight: 700,
  cursor: "pointer",
};

const primaryButtonCompact: React.CSSProperties = {
  padding: "12px 16px",
  borderRadius: "10px",
  border: "none",
  backgroundColor: "#1f2b3d",
  color: "#ffffff",
  fontSize: "15px",
  fontWeight: 700,
  cursor: "pointer",
};

const secondaryButtonCompact: React.CSSProperties = {
  padding: "12px 16px",
  borderRadius: "10px",
  border: "1px solid #d8dee6",
  backgroundColor: "#ffffff",
  color: "#1f2b3d",
  fontSize: "15px",
  fontWeight: 700,
  cursor: "pointer",
};

const miniFeature: React.CSSProperties = {
  backgroundColor: "#f8fafc",
  border: "1px solid #e7ebf0",
  borderRadius: "14px",
  padding: "12px",
};

const miniFeatureLabel: React.CSSProperties = {
  fontSize: "12px",
  color: "#64748b",
  marginBottom: "6px",
  fontWeight: 600,
};

const miniFeatureValue: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: 600,
  color: "#111827",
};