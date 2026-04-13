import Link from "next/link";
import LeadModal from "@/components/lead-modal";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

async function getObjectBySlug(slug: string) {
  const res = await fetch(`http://localhost:3000/api/objects/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
}

function formatDescription(text: string) {
  if (!text) return [];

  return text
    .split(/\n+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export default async function ObjectPage({ params }: PageProps) {
  const { slug } = await params;
  const object = await getObjectBySlug(slug);

  if (!object) {
    return (
      <main
        style={{
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#f3f4f6",
          minHeight: "100vh",
          color: "#111827",
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
            <h1 style={{ fontSize: "42px", margin: 0 }}>Объект не найден</h1>
            <p style={{ marginTop: "12px", color: "rgba(255,255,255,0.85)" }}>
              Slug из URL: {slug}
            </p>
          </div>
        </section>

        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px 16px" }}>
          <Link href="/">
            <button type="button" style={secondaryButtonCompact}>
              ← Вернуться в каталог
            </button>
          </Link>
        </div>
      </main>
    );
  }

  const images = [
    object.image1,
    object.image2,
    object.image3,
    object.image4,
    object.image5,
  ].filter((item: string | null | undefined) => item && item.trim() !== "");

  const descriptionParts = formatDescription(object.description);

  return (
    <main
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f3f4f6",
        minHeight: "100vh",
        color: "#111827",
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
          <p
            style={{
              margin: 0,
              marginBottom: "12px",
              fontSize: "14px",
              fontWeight: 700,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.72)",
            }}
          >
            Проект дома
          </p>

          <h1
            style={{
              fontSize: "48px",
              lineHeight: 1.1,
              margin: 0,
              marginBottom: "16px",
              color: "#ffffff",
            }}
          >
            {object.title}
          </h1>

          <p
            style={{
              margin: 0,
              fontSize: "20px",
              color: "rgba(255,255,255,0.85)",
              maxWidth: "760px",
            }}
          >
            Подробная информация о проекте, характеристиках и планировке.
          </p>
        </div>
      </section>

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "24px 16px 40px",
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <Link href="/">
            <button type="button" style={secondaryButtonCompact}>
              ← Вернуться в каталог
            </button>
          </Link>
        </div>

        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "18px",
            overflow: "hidden",
            border: "1px solid #e5e7eb",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          {images.length > 0 ? (
            <div style={{ padding: "24px 24px 0" }}>
              <img
                src={images[0]}
                alt={object.title}
                style={{
                  width: "100%",
                  maxHeight: "520px",
                  objectFit: "cover",
                  borderRadius: "16px",
                  display: "block",
                  backgroundColor: "#e5e7eb",
                }}
              />

              {images.length > 1 && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                    gap: "12px",
                    marginTop: "16px",
                  }}
                >
                  {images.slice(1).map((image: string, index: number) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${object.title} ${index + 2}`}
                      style={{
                        width: "100%",
                        height: "110px",
                        objectFit: "cover",
                        borderRadius: "10px",
                        display: "block",
                        backgroundColor: "#e5e7eb",
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div style={{ padding: "24px 24px 0" }}>
              <img
                src="https://via.placeholder.com/1200x520?text=No+Image"
                alt={object.title}
                style={{
                  width: "100%",
                  maxHeight: "520px",
                  objectFit: "cover",
                  borderRadius: "16px",
                  display: "block",
                  backgroundColor: "#e5e7eb",
                }}
              />
            </div>
          )}

          <div
            style={{
              padding: "24px",
              display: "grid",
              gridTemplateColumns: "1.4fr 1fr",
              gap: "24px",
            }}
          >
            <div>
              <h2
                style={{
                  marginTop: 0,
                  marginBottom: "16px",
                  fontSize: "32px",
                  color: "#111827",
                }}
              >
                {object.title}
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: "12px",
                  marginBottom: "24px",
                }}
              >
                <div style={featureCard}>
                  <div style={featureLabel}>Цена</div>
                  <div style={featureValue}>{object.price} ₽</div>
                </div>

                <div style={featureCard}>
                  <div style={featureLabel}>Площадь</div>
                  <div style={featureValue}>{object.area} м²</div>
                </div>

                <div style={featureCard}>
                  <div style={featureLabel}>Этажей</div>
                  <div style={featureValue}>{object.floors}</div>
                </div>

                <div style={featureCard}>
                  <div style={featureLabel}>Спальни</div>
                  <div style={featureValue}>{object.bedrooms}</div>
                </div>

                <div style={featureCard}>
                  <div style={featureLabel}>Комнаты</div>
                  <div style={featureValue}>{object.rooms}</div>
                </div>

                <div style={featureCard}>
                  <div style={featureLabel}>Материал</div>
                  <div style={featureValue}>{object.material}</div>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  borderRadius: "16px",
                  padding: "20px",
                }}
              >
                <h3
                  style={{
                    marginTop: 0,
                    marginBottom: "14px",
                    fontSize: "24px",
                    color: "#111827",
                  }}
                >
                  Описание
                </h3>

                {descriptionParts.length > 0 ? (
                  <div>
                    {descriptionParts.map((part, index) => (
                      <p
                        key={index}
                        style={{
                          marginTop: 0,
                          marginBottom: "14px",
                          lineHeight: 1.8,
                          fontSize: "16px",
                          color: "#374151",
                        }}
                      >
                        {part}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p
                    style={{
                      margin: 0,
                      lineHeight: 1.8,
                      fontSize: "16px",
                      color: "#374151",
                    }}
                  >
                    {object.description}
                  </p>
                )}
              </div>
            </div>

            <div>
              <LeadModal objectId={object.id} objectTitle={object.title} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

const secondaryButtonCompact: React.CSSProperties = {
  padding: "12px 16px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  backgroundColor: "#ffffff",
  color: "#1f2b3d",
  fontSize: "15px",
  fontWeight: 600,
  cursor: "pointer",
};

const featureCard: React.CSSProperties = {
  backgroundColor: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  padding: "14px",
};

const featureLabel: React.CSSProperties = {
  fontSize: "13px",
  color: "#6b7280",
  marginBottom: "6px",
};

const featureValue: React.CSSProperties = {
  fontSize: "18px",
  fontWeight: 700,
  color: "#111827",
};