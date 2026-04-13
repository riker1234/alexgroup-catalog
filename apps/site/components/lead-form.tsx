"use client";

import { useState } from "react";

type LeadFormProps = {
  objectId: number;
  objectTitle: string;
};

export default function LeadForm({ objectId, objectTitle }: LeadFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone,
          message,
          objectId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Не удалось отправить заявку");
        setLoading(false);
        return;
      }

      setSuccessMessage(`Заявка по объекту "${objectTitle}" отправлена.`);
      setName("");
      setPhone("");
      setMessage("");
    } catch (error) {
      setErrorMessage("Произошла ошибка сети");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        backgroundColor: "#f9fafb",
        border: "1px solid #e5e7eb",
        borderRadius: "16px",
        padding: "20px",
        marginTop: "24px",
      }}
    >
      <h3
        style={{
          marginTop: 0,
          marginBottom: "12px",
          fontSize: "24px",
          color: "#111827",
        }}
      >
        Оставить заявку
      </h3>

      <p
        style={{
          marginTop: 0,
          marginBottom: "16px",
          color: "#4b5563",
          lineHeight: 1.6,
        }}
      >
        Оставьте контакты, и с вами свяжутся по этому проекту.
      </p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Ваше имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={input}
        />

        <input
          type="text"
          placeholder="Телефон"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={input}
        />

        <textarea
          placeholder="Комментарий"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={textarea}
        />

        <button type="submit" style={submitButton} disabled={loading}>
          {loading ? "Отправка..." : "ОСТАВИТЬ ЗАЯВКУ"}
        </button>
      </form>

      {successMessage ? (
        <p
          style={{
            marginTop: "14px",
            marginBottom: 0,
            color: "#166534",
            fontWeight: 600,
          }}
        >
          {successMessage}
        </p>
      ) : null}

      {errorMessage ? (
        <p
          style={{
            marginTop: "14px",
            marginBottom: 0,
            color: "#b91c1c",
            fontWeight: 600,
          }}
        >
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}

const input: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px",
  marginBottom: "12px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  backgroundColor: "#ffffff",
  color: "#111827",
  fontSize: "14px",
};

const textarea: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px",
  minHeight: "110px",
  marginBottom: "12px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  backgroundColor: "#ffffff",
  color: "#111827",
  fontSize: "14px",
  resize: "vertical",
};

const submitButton: React.CSSProperties = {
  width: "100%",
  padding: "16px 20px",
  borderRadius: "6px",
  border: "none",
  backgroundColor: "#10213a",
  color: "#ffffff",
  fontSize: "15px",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.02em",
  cursor: "pointer",
};